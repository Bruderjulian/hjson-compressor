require('dotenv').config();
const { gunzip, gzip } = require('./lib/gzip');
const {
    pack, unpack, parse, stringify,
} = require('./lib/hpack');
const { calculateSize } = require('./utils/calculateSize');
const { debugWrapper } = require('./utils/debugWrapper');

/**
 * Compresses a JSON object using the Gzip compression algorithm. This is accomplished by first
 * stringifying the JSON object, and then compressing it into a Buffer object. If the debug
 * parameter is set to true, the function measures and logs the performance and the size
 * of the compressed data.
 *
 * @function compress
 * @param {Object} jsonObject - The JSON object that needs to be compressed.
 * @param {boolean} [debug=false] - Optional parameter that defaults to false. If set to true,
 * it will measure the performance and size of the compressed data and log these details.
 * @returns {Buffer} The compressed data as a Buffer object. If an error occurs during
 * compression, an Error is thrown.
 * @throws {Error} If an error occurs during the compression process.
 */
function compress(jsonObject, debug = false) {
    const [startDebug, endDebug, errorDebug] = debugWrapper('compress');
    try {
        if (debug) {
            startDebug();
        }

        const hPacked = stringify(jsonObject);
        const bufferOriginal = Buffer.from(hPacked, 'utf-8');
        const gzipped = gzip(bufferOriginal);

        if (debug) {
            endDebug(jsonObject, gzipped);
        }

        return gzipped;
    } catch (error) {
        return errorDebug(error);
    }
}

/**
 * Decompresses a Buffer object into a JSON object using the Gzip decompression algorithm.
 * This is accomplished by first decompressing the Buffer object and then parsing it into
 * a JSON object. If the debug parameter is set to true, the function measures and logs the
 * performance and the size of the decompressed data.
 *
 * @function decompress
 * @param {Buffer} jsonBuffer - The Buffer object that needs to be decompressed.
 * @param {boolean} [debug=false] - Optional parameter that defaults to false. If set to true,
 * it will measure the performance and size of the decompressed data and log these details.
 * @returns {Object} The decompressed and parsed JSON object. If an error occurs during
 * decompression, the original Buffer object is returned.
 * @throws {Error} If the decompression process fails, an error is logged, but not thrown.
 */
function decompress(jsonBuffer, debug = false) {
    const [startDebug, endDebug, errorDebug] = debugWrapper('decompress');

    try {
        if (debug) {
            startDebug();
        }

        const bufferDecompressed = gunzip(jsonBuffer);
        const jsonUnpacked = parse(bufferDecompressed);

        if (debug) {
            endDebug(jsonUnpacked, jsonBuffer);
        }

        return jsonUnpacked;
    } catch (error) {
        return errorDebug(error);
    }
}
async function jsonCompressorMiddleware(req, res, next) {
    const requestCompressed = 'compressed-request' in req.headers ? req.headers['compressed-request'] : 'none';
    const responseCompressed = 'compressed-response' in req.headers ? req.headers['compressed-response'] : 'none';
    res.set('Compressed-Request', requestCompressed || 'none');
    res.set('Compressed-Response', responseCompressed || 'none');
    switch (requestCompressed) {
        case 'full':
            req.body = decompress(req.body, true);
            break;

        case 'hpack':
            req.body = unpack(req.body, false, true);
            break;

        case 'gzip':
            req.body = JSON.parse(gunzip(req.body), true);
            break;

        default:
            break;
    }

    const originalSend = res.send;

    res.send = (args) => {
        let newArgs = args;
        if (newArgs instanceof Object) {
            switch (responseCompressed) {
                case 'full':
                    newArgs = compress(newArgs, true);
                    break;

                case 'hpack':
                    newArgs = pack(newArgs, false, true);
                    break;

                case 'gzip':
                    newArgs = gzip(JSON.stringify(newArgs), true);
                    break;

                default:
                    break;
            }
        }
        res.send = originalSend;
        return res.send(newArgs);
    };
    next();
}

module.exports = {
    compress,
    decompress,
    pack,
    unpack,
    parse,
    stringify,
    gzip,
    gunzip,
    calculateSize,
    jsonCompressorMiddleware,
};

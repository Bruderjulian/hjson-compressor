const { gunzip, gzip } = require("./lib/gzip.js");
const hpack = require("./lib/hpack.js");
const { Buffer } = require("buffer");

/**
 * Compresses a JSON object using the HPack and Gzip compression algorithm.
 *
 * @function compress
 * @param {Object} obj - The JSON object to be compressed.
 * @returns {Buffer} The compressed data as a Buffer object. If an error occurs, an Error is thrown.
 * @throws {Error} If an error occurs during the compression process.
 */
function compress(obj) {
  try {
    return gzip(Buffer.from(hpack.stringify(obj), "utf-8"));
  } catch (err) {
    var tempError = new Error("Could not compress due " + err);
    tempError.stack = (err.stack, "").substring(err.stack.indexOf("\n"));
    throw tempError;
  }
}

/**
 * Decompresses a Buffer into a JSON object using the HPack and Gzip decompression algorithm.
 *
 * @function decompress
 * @param {Buffer} buf - The Buffer to be decompressed.
 * @returns {Object} The decompressed and parsed JSON object. If an error occurs, the original Buffer is returned.
 * @throws {Error} If an error occurs during the decompression process.
 */
function decompress(buf) {
  try {
    return hpack.parse(gunzip(buf));
  } catch (err) {
    var tempError = new Error("Could not decompress due " + err);
    tempError.stack = (err.stack, "").substring(err.stack.indexOf("\n"));
    throw tempError;
  }
}

/**
 * Calculate the byte length of the input data.
 * It supports data types: String, Buffer, Array, and Object.
 * For non-buffer objects, it first stringifies it before calculating the size.
 *
 * @param {String|Buffer|Object|Array} data - The data to be calculated.
 * @returns {Number} The byte length of the input data.
 */
function calculateSize(data) {
  if (
    typeof data === "string" ||
    data instanceof String ||
    data instanceof Buffer
  ) {
    return Buffer.byteLength(data);
  }
  if (typeof data === "object" && data !== null)
    return Buffer.byteLength(JSON.stringify(data));
  return 0;
}

module.exports = {
  compress,
  decompress,
  gzip,
  gunzip,
  calculateSize,
  pack: hpack.pack,
  unpack: hpack.unpack,
  parse: hpack.parse,
  stringify: hpack.stringify,
  _parser: hpack._parser,
  _stringifier: hpack._stringifier,
};

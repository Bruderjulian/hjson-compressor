const { gzipSync, gunzipSync } = require("node:zlib");

/**
 * Compresses a String using Gzip compression algorithm.
 *
 * @param {string} string - The String to be compressed.
 * @returns {Buffer} - The compressed data as a Buffer.
 */
function gzip(string) {
  return gzipSync(Buffer.from(string.toString(), "utf-8"));
}

/**
 * Decompresses a Buffer to a String using Gzip decompression algorithm.
 *
 * @param {Buffer} buffer - The Buffer object to be decompressed.
 * @returns {string} - The decompressed string.
 */
function gunzip(buffer) {
  return gunzipSync(buffer).toString("utf-8");
}

module.exports = { gzip, gunzip };

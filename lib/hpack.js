const { isArray } = Array;
const { concat, map } = Array.prototype;

function isObject(obj) {
  return typeof obj === "object" && obj !== null;
}

function iteratingWith(method) {
  return function iterate(item) {
    let current = item;
    for (let i = 0, len = this.length; i < len; i += 1) {
      const k = this[i];
      const tmp = current[k];
      if (isArray(tmp)) {
        const j = i + 1;
        current[k] =
          j < len ? map.call(tmp, method, this.slice(j)) : method(tmp);
      }
      current = current[k];
    }
    return item;
  };
}

function packOrUnpack(method) {
  return (o, schema) => {
    const wasArray = isArray(o);
    let result = concat.call(arr, o);
    const path = concat.call(arr, schema);
    for (let i = 0, len = path.length; i < len; i += 1) {
      result = map.call(result, method, path[i].split("."));
    }
    return wasArray ? result : result[0];
  };
}

function hpack(obj) {
  if (isArray(obj)) {
    const length = obj.length;
    const keys = Object.keys(length ? obj[0] : {});
    const result = Array(length * keys.length);
    for (let i = 0, j = 0; i < length; i += 1) {
      const o = obj[i];
      for (let ki = 0, len = keys.length; ki < len; ki += 1) {
        let value = o[keys[ki]];
        if (isObject(value) && !(value instanceof Date)) {
          value = isArray(value) ? value.map((x) => hpack(x)) : hpack(value);
        }
        result[j] = value;
        j += 1;
      }
    }
    return concat.call([keys.length], keys, result);
  }
  if (isObject(obj)) {
    return Object.keys(obj).reduce((res, key) => {
      res[key] = isArray(obj[key]) ? hpack(obj[key]) : obj[key];
      return res;
    }, {});
  }
  return obj;
}

function hunpack(packedObj) {
  if (isArray(packedObj)) {
    const { length } = packedObj;
    const klength = packedObj[0];
    const result = Array((length - klength - 1) / klength || 0);
    let j = 0;
    for (let i = 1 + klength; i < length; ) {
      const o = {};
      for (let ki = 0; ki < klength; ki += 1) {
        let value = packedObj[i];
        if (isArray(value)) {
          value = value.map((item) => (isArray(item) ? hunpack(item) : item));
        } else if (isObject(value)) value = hunpack(value);
        o[packedObj[ki + 1]] = value;
        i += 1;
      }
      result[j] = o;
      j += 1;
    }
    return result;
  }
  if (isObject(packedObj)) {
    return Object.keys(packedObj).reduce((res, key) => {
      res[key] = isArray(packedObj[key])
        ? hunpack(packedObj[key])
        : packedObj[key];
      return res;
    }, {});
  }
  return packedObj;
}

const packSchema = packOrUnpack(iteratingWith(hpack));
const unpackSchema = packOrUnpack(iteratingWith(hunpack));

/**
 * Packs a list of objects into a homogeneous array, according to a schema.
 *
 * @function pack
 * @param {Object[]} list - The list of objects to pack.
 * @param {string[]} [schema] - The schema to use for packing.
 * @returns {Array} - The packed array.
 */
function pack(list, schema) {
  return schema ? packSchema(list, schema) : hpack(list);
}

/**
 * Unpacks a homogeneous array into a list of objects, according to a schema.
 *
 * @function unpack
 * @param {Array} hlist - The homogeneous array to unpack.
 * @param {string[]} [schema] - The schema to use for unpacking.
 * @returns {Object[]} - The unpacked list of objects.
 */
function unpack(hlist, schema) {
  return schema ? unpackSchema(hlist, schema) : hunpack(hlist);
}

/**
 * Packs a list of objects into a homogeneous array and then stringifies it, according to a schema.
 *
 * @function stringify
 * @param {Object[]} list - The list of objects.
 * @param {Function} [replacer] - A function that alters the behavior of the
 * stringification process.
 * @param {string|number} [space] - A String or Number of whitespaces
 * @param {string[]} [schema] - The schema to use for packing.
 * @returns {string} - The JSON string.
 */
function stringify(list, replacer, space, schema) {
  return JSON.stringify(pack(list, schema), replacer, space);
}

/**
 * Parses a JSON string into a homogeneous array
 * and then unpacks it according to a schema.
 *
 * @function parse
 * @param {string} hlist - The JSON string to parse.
 * @param {Function} [reviver] - A function that prescribes how the value originally
 * produced by parsing is transformed, before being returned.
 * @param {string[]} [schema] - The schema to use for unpacking.
 * @returns {Object[]} - The parsed list of objects.
 */
function parse(hlist, reviver, schema) {
  return unpack(JSON.parse(hlist, reviver), schema);
}

module.exports = { pack, parse, stringify, unpack };

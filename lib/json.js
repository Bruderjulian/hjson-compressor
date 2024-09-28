// based of the generated code from typia.io (https://typia.io/)!!
// For the functions typia.json.stringify and typia.json.isParse. 

function stringify(input) {
  return (
    stringifyInternal(input) +
    `,"contents":[${input.contents
      .map((elem) => stringifyInternal(elem, true))
      .join(",")}]}`
  );
}

function stringifyInternal(input, ext) {
  return `{"lines":${input.lines},"name":${toString(
    input.name
  )},"path":${toString(input.path)},"fullPath":${toString(input.fullPath)}${
    ext ? ',"extension":' + toString(input.extension) : ""
  },"isFile":${input.isFile},"isFolder":${input.isFolder},"type":${toString(
    input.type
  )},"size":${input.size},"lastModified":${toString(
    input.lastModified
  )},"birthtime":${toString(input.birthtime)},"depth":${input.depth}${
    ext ? "}" : ""
  }`;
}

function checkTypes(input) {
  return (
    checkTypesInternal(input) &&
    Array.isArray(input.contents) &&
    input.contents.every(
      (elem) =>
        "object" === typeof elem &&
        null !== elem &&
        checkTypesInternal(elem, true)
    )
  );
}

function checkTypesInternal(input, ext) {
  return (
    "number" === typeof input.lines &&
    Math.floor(input.lines) === input.lines &&
    0 <= input.lines &&
    input.lines <= 4294967295 &&
    "string" === typeof input.name &&
    "string" === typeof input.path &&
    "string" === typeof input.fullPath &&
    (ext ? "string" === typeof input.extension : true) &&
    "boolean" === typeof input.isFile &&
    "boolean" === typeof input.isFolder &&
    "string" === typeof input.type &&
    "number" === typeof input.size &&
    Math.floor(input.size) === input.size &&
    0 <= input.size &&
    input.size <= 4294967295 &&
    "string" === typeof input.lastModified &&
    /^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])(T|\s)([01][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9](?:\.[0-9]{1,9})?(Z|[+-]([01][0-9]|2[0-3]):[0-5][0-9])$/i.test(
      input.lastModified
    ) &&
    "string" === typeof input.birthtime &&
    /^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])(T|\s)([01][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9](?:\.[0-9]{1,9})?(Z|[+-]([01][0-9]|2[0-3]):[0-5][0-9])$/i.test(
      input.birthtime
    ) &&
    "number" === typeof input.depth &&
    Math.floor(input.depth) === input.depth &&
    0 <= input.depth &&
    input.depth <= 4294967295
  );
}

function parse(input) {
  input = JSON.parse(input);
  return "object" === typeof input && null !== input && checkTypes(input)
    ? input
    : null;
}

function toString(str) {
  const len = str.length;
  let result = "";
  let last = -1;
  let point = 255;

  for (var i = 0; i < len; i++) {
    point = str.charCodeAt(i);
    if (point < 32 || (point >= 0xd800 && point <= 0xdfff)) {
      return JSON.stringify(str);
    }
    if (
      point === 0x22 || // '"'
      point === 0x5c // '\'
    ) {
      last === -1 && (last = 0);
      result += str.slice(last, i) + "\\";
      last = i;
    }
  }
  return (
    (last === -1 && '"' + str + '"') || '"' + result + str.slice(last) + '"'
  );
}

module.exports = { stringify, parse };

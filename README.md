# hjson-compressor

Compressing and decompressing JSON data using HPack and Gzip compression algorithm. Modified Version of [json-pack-gzip](http://npmjs.org/) by MkDierz.

## Installation

Install [hjson-compressor](http://npmjs.org/) with `npm`.

```bash
npm install hjson-compressor
```
## Usage

```javascript
const compressor = require('hjson-compressor');

// Compress JSON data
const compressedData = compressor.compress(obj);

// Decompress JSON data
const decompressedData = compressor.decompress(objBuffer);

// Calculate byte length of data
const byteLength = compressor.calculateSize(data);

// Optionally set JSON Parser and Stringify
compressor._parser = JSON.parse;
compressor._stringifier = JSON.stringify;
```

## API

### ```compress(obj)```

Compresses a JSON object using HPack and Gzip compression algorithm. The input JSON object is first packed into a homogeneous array and then stringified before compression.

- ```obj```(Array): The JSON object to be compressed.

Returns a compressed data as a Buffer.

### ```decompress(buf)```
Decompresses a Buffer to a JSON object.

- ```buf``` (Buffer): The Buffer to be decompressed.

Returns a decompressed and unpacked JSON object as a list of objects.

### ```calculateSize(data)```
Calculates the byte length of the input data. It supports data types: String, Buffer, Array, and Object. For non-buffer objects, it first stringifies it before calculating the size.

- ```data``` (String|Buffer|Object|Array): The data to be calculated.

Returns the byte length of the input data.

## Testing

If you want to run the test, download the source code and run 
```bash
npm install jasmine
```
after everything is installed, run ```npm run test```

## Contributing

Pull requests are welcome. For major changes, please open an issue first
to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

This module is licensed under the [MIT](https://choosealicense.com/licenses/mit/) License
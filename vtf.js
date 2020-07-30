const vtf_info = require('./vtf_info.js');
const { VTFImageFormats, VTFImageFormatInfo, TextureFlags, getHeader } = require('./vtf_info.js');
var { VTFOptions } = require('./vtf_info.js');
VTFOptions.version[1] = 5
console.log(VTFOptions.setFlags("Srgb,awd"))
console.log(VTFOptions.selectedFlags)
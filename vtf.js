const axios = require('axios');
const vtf_info = require('./vtf_info.js');
const { VTFImageFormats, VTFImageFormatInfo, TextureFlags, getHeader } = require('./vtf_info.js');
var { VTFOptions } = require('./vtf_info.js');
VTFOptions.version[1] = 5

async function test() {
	const attachment = {
	  attachment: 'https://cdn.discordapp.com/attachments/717562925455245325/739330391667900476/2x2.png',
	  name: '2x2.png',
	  id: '739330391667900476',
	  size: 162,
	  url: 'https://cdn.discordapp.com/attachments/717562925455245325/739330391667900476/2x2.png',
	  proxyURL: 'https://media.discordapp.net/attachments/717562925455245325/739330391667900476/2x2.png',
	  height: 2,
	  width: 2
	};
	var input = await axios({ url: attachment.url, responseType: "arraybuffer" }).then(response => {
		return {type:response.headers['content-type'],data:response.data};
	});
	createVTF(input)
}
async function createVTF(input) {
	console.log(input.type)
	console.log(input.data)
	var fileUint8Array = new Uint8Array(input.data)
	console.log(fileUint8Array)
}
test()
//console.log(input)
/*console.log(VTFOptions.setFlags("Srgb,awd"))
console.log(VTFOptions.selectedFlags)*/
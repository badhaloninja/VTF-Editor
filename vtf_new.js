var colorTable = [];
var pixelTable = [];
var alphaValueTable = [];
var alphaLookupTable = [];
var blockCount = 65280;
var blockPosition = 0;
var frames = [];
var currFrame = 0;
var imagesLoaded = 0;
var singleImageAnim = false;
var mipmaps = [document.createElement('canvas')];
var converted = false;
var outputImage = [];
var shortened = false;
var colorSqrt = false;
var forceDither = false;
var colorDifference = 0;
var sampling = "0";
setResolution();
$(document).ready(function(){
	VTFImageFormatInfo.Supported.forEach(function(entry,i){
	document.getElementById('format').innerHTML = ((i==0)? "" : document.getElementById('format').innerHTML)+"<option value="+entry+((i==0)?" selected" : "")+">"+VTFImageFormatInfo.getInfo(entry).Name+"</option>\n"
	})
  $('#widthSetting').change(function(){
    VTFOptions.width = (this).value;
    setResolution()
  });
  $('#heightSetting').change(function(){
    VTFOptions.height = (this).value;
    setResolution()
  });
  $('#versonSetting').change(function(){
  	VTFOptions.version = (this).value.split(".");
  });
  $('#format').change(function(){
  	VTFOptions.ImageFormat = +(this).value;
	if (VTFOptions.ImageFormat != VTFImageFormats.RGBA8888 && VTFOptions.ImageFormat != VTFImageFormats.RGBA8888)
		document.getElementById('ditherBlock').style.display = "block";
	else {
		document.getElementById('ditherBlock').style.display = "none";
    }
	if (VTFOptions.ImageFormat == VTFImageFormats.DXT1 || VTFOptions.ImageFormat == VTFImageFormats.DXT5){
		document.getElementById('dxtSettings').style.display = "block";
	}
	else {
		document.getElementById('dxtSettings').style.display = "none";
	}
	check();
	createCanvas();
  });
  $('#sampling').change(function(){
  	sampling = (this).value;
  });
});
$(function(){
  new Clipboard('.copy-text');
});

function setResolution() {
	colorTable = [];
	pixelTable = [];
	alphaValueTable = [];
	alphaLookupTable = [];
	blockCount = 65280;
	VTFOptions.MipCount = 0;
	blockPosition = 0;
	currFrame = 0;
	//imagesLoaded = 0;
	mipmaps = [document.createElement('canvas')];
	converted = false;
	outputImage = [];
	shortened = false;
	//document.getElementById('convertButton').disabled = true;
	document.getElementById('saveButton').disabled = true;

	/*if (width == 1024 && height == 1024) {
		height = 1020;
		document.getElementById("resolutionNotice").style.visibility = "visible";
		document.getElementById("mipmapsCheck").disabled = true;
		document.getElementById("mipmapsCheck").checked = false;
	}
	else {
		document.getElementById("resolutionNotice").style.visibility = "hidden";
		document.getElementById("mipmapsCheck").disabled = false;
	}*/
	check();
	mipmaps[0].width = VTFOptions.width;
	mipmaps[0].height = VTFOptions.height;
	document.getElementById('preview').getContext("2d").clearRect(0,0,512,512);
	document.getElementById("contentWrapper").style.width = 512+"px";
	document.getElementById("contentWrapper").style.height = 512+"px";
	document.getElementById("files").value = "";
	mipmaps[0].getContext("2d").clearRect(0,0,VTFOptions.width,VTFOptions.height);
	if (frames.length > 0){
		createCanvas();
		document.getElementById('convertButton').disabled = false;
	}
	else {
		document.getElementById('convertButton').disabled = true;
	}
}

/*function setOutputVersion(ver) {
	version = ver.split(".");
}*/
function check() {
	if (getEstFileSize(false)/1024 >= 512 && getEstFileSize(false)/1024 < 513){
		shortened = true;
		document.getElementById("resolutionNotice").innerHTML = "Changed to "+(VTFOptions.width-4)+"x"+VTFOptions.height;
		document.getElementById("resolutionNotice").style.visibility = "visible";
	}
	else if (shortened && getEstFileSize(false)/1024 < ((VTFOptions.width - 4) / VTFOptions.width) * 512 - 1){
		shortened = false;
		document.getElementById("resolutionNotice").innerHTML = "";
		document.getElementById("resolutionNotice").style.visibility = "hidden";
	}
	if (getEstFileSize(false)/1024 >= 385 || shortened || document.getElementById("sampling").value == 1){
		document.getElementById("mipmapsCheck").disabled = true;
		document.getElementById("mipmapsCheck").checked = false;
	}
	else{
		document.getElementById("mipmapsCheck").disabled = false;
	}
	/*reducedMipmaps = getEstFileSize(false)/1024 >= 384;*/
	/*showMipmap(document.getElementById("mipmapsCheck"));*/
}
setInterval(function(){
	if (VTFOptions.Frames > 1 && (imagesLoaded == VTFOptions.Frames || singleImageAnim)) {
		//console.log("ffd")
		if (++currFrame >= VTFOptions.Frames)
			currFrame = 0;
			var mipwidth = VTFOptions.width;
			var mipheight = VTFOptions.height;
		for(var i = 0; i <= VTFOptions.MipCount; i++) {

			generatePreview(i, mipwidth, mipheight);
			mipwidth /= 2;
			mipheight /= 2;
		}
	}
	var filesize = getEstFileSize(true)/1024;
	if (filesize < 512)
		if (filesize > 1){
		document.getElementById('filesizee').innerHTML = "Estimated file size: <span style='color:green'>"+filesize+"</span> [KB]";
		} else {
		document.getElementById('filesizee').innerHTML = "Estimated file size: <span style='color:green'>"+filesize*1000+"</span> [B]";
		}
	else
		document.getElementById('filesizee').innerHTML = "Estimated file size: <span style='color:red'>"+filesize+"</span> [KB]";

}, 200);

function handleFileSelect2(evt) {
	var files = evt.target.files;
	var reader = new FileReader();
	reader.readAsArrayBuffer(files[0]);
	reader.onload = (function(e) {
	var fileUint8Array = new Uint8Array(e.target.result);
	console.log(fileUint8Array.toString());
	document.getElementById('outUint8Array').innerHTML = files[0].name+": ["+fileUint8Array.toString()+"]; "
	})
}

function handleFileSelect(evt) {
	var files = evt.target.files; // FileList object
	if (files.length == 0)
		return;
	document.getElementById('convertButton').disabled = true;
	document.getElementById('saveButton').disabled = true;
	document.getElementById('files0').disabled = true;


	VTFOptions.Frames = files.length;
	frames = [];
	frames[0] = [];

	for (var i = 0; i < files.length; i++ ) {
		if (files[i] && files[i].type.match('image.*')) {
			var reader = new FileReader();
			// Closure to capture the file information.
			reader.fileIndex = i;
			reader.fileType = files[i].type;

			reader.onload = (function(e) {
					//console.log(this.fileType);
					var img = new Image();
					if (this.fileType == "image/gif"){
						VTFOptions.Frames = 0;
						var gif = new SuperGif( {gif: img, auto_play: false});
						gif.load_raw(new Uint8Array(e.target.result), function (el) {handleGifLoad(gif, frames[0]); check(); createCanvas();});
					}
					else if (this.fileType == "image/x-tga" || this.fileType == "image/targa"){
						var tga = new TGA();
						tga.load(new Uint8Array(e.target.result));
						if (singleImageAnim)
							VTFOptions.Frames = img.height / VTFOptions.height;
						imagesLoaded += 1;
						frames[0].push(tga.getCanvas());
						if (imagesLoaded == VTFOptions.Frames) {
							check();
							createCanvas();
						}
					}
					else {
						img.src = e.target.result;

						img.onload = function () {
							if (singleImageAnim)
								VTFOptions.Frames = img.height / VTFOptions.height;
							imagesLoaded += 1;
							frames[0].push(img);
							if (imagesLoaded == VTFOptions.Frames) {
								check();
								createCanvas();
							}
						}
					}

				});
			document.getElementById('convertButton').disabled = false;
			if (files[i].type == "image/gif" || files[i].type == "image/x-tga" || files[i].type == "image/targa"){
				reader.readAsArrayBuffer(files[i]);
				if (files[i].type == "image/gif")
					break;
			}
			else
				reader.readAsDataURL(files[i]);

		}
	}
	mipmaps[0].getContext("2d").clearRect(0,0,VTFOptions.width,VTFOptions.height);
}


/*function showMipmap(check){
	hasMipmaps = check.checked;
	if (hasMipmaps) {
		document.getElementById("mipmaps").style.display = "block";
	}
	else {
		document.getElementById("mipmaps").style.display = "none";
	}
}*/

function generatePreview(index, cwidth, cheight) {
	//console.log("Index" + index);

	if (index == 0) var output = document.getElementById('preview');
	else var output = document.getElementById('canvasMipmap'+index);
	var input = mipmaps[index];
	output.getContext("2d").clearRect(0,0,cwidth,cheight);

	output.width = cwidth;
	output.height = cheight;
	output.getContext('2d').drawImage(input, 0, cheight * currFrame, cwidth, cheight, 0, 0, cwidth, cheight);

}

function setSingleFrame() {
	singleImageAnim = document.getElementById('singleFrame').checked;
	if (singleImageAnim && frames[0]) {
		VTFOptions.Frames = frames[0].height / VTFOptions.height;
	}
	else {
		VTFOptions.Frames = frames.length;
	}
}

function generateCanvas(ccanvas, cwidth, cheight) {

	var canvas = mipmaps[ccanvas];
	canvas.width = cwidth;
	canvas.height = cheight * VTFOptions.Frames;

	if (singleImageAnim) {
		var fimg = frames[ccanvas][0];
		canvas.height = fimg.height;
		var scale = cheight / height;
		canvas.getContext('2d').drawImage(fimg, cwidth/2-fimg.width * scale /2, 0, fimg.width * scale, fimg.height * scale);
	}
	else {
		for (var frame = 0; frame < VTFOptions.Frames; frame++ ){
			var fimg = frames[ccanvas][frame];
			var scale = 1;
			if (document.getElementById("rescaleCheck").checked)
				scale = Math.min(cheight/fimg.height,cwidth/fimg.width);
			canvas.getContext('2d').drawImage(fimg, cwidth/2-fimg.width * scale /2, cheight/2-fimg.height * scale/2 + cheight * frame, fimg.width * scale, fimg.height * scale);
		}
	}
	document.getElementById('filesizee').innerHTML = "Estimated file size: "+(getEstFileSize()/1024);
}

function createCanvas() { // put centered image on canvas
	if (frames.length == 0)
		return;
	VTFOptions.MipCount = 0;
	generateCanvas(0, VTFOptions.width, VTFOptions.height);
	generatePreview(0, VTFOptions.width, VTFOptions.height);
	var mipwidth = VTFOptions.width;
	var mipheight = getTotalImageHeight();
	var mipmapsHTML = "";
	//hasMipmaps = 1;
	for (var i=2; (VTFOptions.width/i>=4) && (VTFOptions.height/i>=4); i*=2) {
		VTFOptions.MipCount++;
		mipmaps.push(document.createElement('canvas'));
		mipmapsHTML += "<div id=\"inputWrapper"+VTFOptions.MipCount+"\"></div>\n<canvas class=\"mipmapElement\" id=\"canvasMipmap"+VTFOptions.MipCount+"\"></canvas><br /><input type=\"file\" id=\"files"+VTFOptions.MipCount+"\" name=\"files[]\" accept=\"image/*\" onchange=\"changeMipmap(event,"+VTFOptions.MipCount+")\" multiple/>\n";
	}
	document.getElementById("mipmaps").innerHTML = mipmapsHTML;
	for (var i=1; i<=VTFOptions.MipCount; i++) {
		mipwidth /= 2;
		mipheight /= 2;
		mipmaps[i].width = mipwidth;
		mipmaps[i].height = mipheight;
		document.getElementById('canvasMipmap'+i).width = mipwidth;
		document.getElementById('canvasMipmap'+i).height = mipheight / VTFOptions.Frames;
		if (!frames[i])
			mipmaps[i].getContext('2d').drawImage(mipmaps[(i-1)],0, 0, mipwidth, mipheight);
		else
			generateCanvas(i, mipwidth, mipheight / VTFOptions.Frames);
		generatePreview(i, mipwidth, mipheight / VTFOptions.Frames);
	}
}

function convert() {
	blockPosition = 0;
	document.body.style.cursor = "wait";
	createCanvas();
	blockCount = 0;
	if (VTFOptions.hasMipmaps)
		for (var i=0; i>0; i--) convertPixels(i,VTFOptions.width/(Math.pow(2,i)),getTotalImageHeight()/(Math.pow(2,i)));
	convertPixels(0, VTFOptions.width, getTotalImageHeight());
	converted = true;
	//document.getElementById('inputWrapper').style.display = "none";
	document.getElementById('saveButton').disabled = false;
	document.getElementById('files0').disabled = false;
	document.body.style.cursor = "auto";
	generatePreview(0,VTFOptions.width, VTFOptions.height);
}



function changeMipmap(evt,mipmapNumber) { // this code, it scares me
	var files = evt.target.files; // FileList object
	if (files.length == 0)
		return;

	document.getElementById('convertButton').disabled = true;
	document.getElementById('saveButton').disabled = true;

	var mipimages = 0;
	var cwidth = VTFOptions.width/(Math.pow(2,mipmapNumber));
	var cheight = VTFOptions.height/(Math.pow(2,mipmapNumber));
	frames[mipmapNumber] = [];
	for (var i = 0; i < files.length && i < imagesLoaded; i++ ) {
		if (files[i] && files[i].type.match('image.*')) {
			var reader = new FileReader();
			// Closure to capture the file information.
			reader.fileType = files[i].type;
			reader.onload = (function(e) {
					var img = new Image();
					if (this.fileType == "image/gif"){
						var gif = new SuperGif( {gif: img, auto_play: false});
						gif.load_raw(new Uint8Array(e.target.result),
						function (el) {
							handleGifLoad(gif, frames[mipmapNumber]);
							loadMipmaps(mipmapNumber, cwidth, cheight);
						});
					}
					else if (this.fileType == "image/x-tga"  || this.fileType == "image/targa"){
						var tga = new TGA();
						tga.load(new Uint8Array(e.target.result));
						frames[mipmapNumber].push(tga.getCanvas());
						mipimages++;
						if (mipimages == Math.min(imagesLoaded, files.length)) {
							loadMipmaps(mipmapNumber, cwidth, cheight);
						}
					}
					else{

						img.src = e.target.result;
						img.onload = function () {
							frames[mipmapNumber].push(img);
							mipimages++;
							if (mipimages == Math.min(imagesLoaded, files.length)) {
								loadMipmaps(mipmapNumber, cwidth, cheight);
							}
						}
					}


				});
		// Read in the image file as a data URL.
			if (files[i].type == "image/gif" || files[i].type == "image/x-tga" || files[i].type == "image/targa"){
				reader.readAsArrayBuffer(files[i]);
				if (files[i].type == "image/gif")
					break;
			}
			else
				reader.readAsDataURL(files[i]);
		}
	}
}

function loadMipmaps(mipmapNumber, cwidth, cheight) {
	if (frames[mipmapNumber].length < imagesLoaded){
		var init = frames[mipmapNumber].length;
		for (var j = frames[mipmapNumber].length; j < imagesLoaded; j++){
			frames[mipmapNumber].push(frames[mipmapNumber][j % init]);
		}
	}
	mipmaps[mipmapNumber].getContext("2d").clearRect(0,0,cwidth,cheight * VTFOptions.Frames);
	generateCanvas(mipmapNumber, cwidth, cheight);
	generatePreview(mipmapNumber, cwidth, cheight);

	document.getElementById('saveButton').disabled = true;
	document.getElementById('convertButton').disabled = false;
	document.body.style.cursor = "auto";
}

/*function getReducedMipmapCount() {
	if (reducedMipmaps){
		return Math.min(4, mipmapCount);
	}
	return mipmapCount;
}*/
/*function setOutputType(el){
	VTFOptions.ImageFormat = +el.value;
	if (+el.value != 0 && +el.value != 2)
		document.getElementById('ditherBlock').style.display = "block";
	else
		document.getElementById('ditherBlock').style.display = "none";

	if (+el.value == 13 || +el.value == 15){
		document.getElementById('dxtSettings').style.display = "block";
	}
	else
		document.getElementById('dxtSettings').style.display = "none";
	check();
	createCanvas();
}*/

function convertPixels(canvas, fwidth, fheight) {
	if (shortened)
		fwidth = fwidth - 4;
	var pix = mipmaps[canvas].getContext("2d").getImageData(mipmaps[canvas].width/2 - fwidth/2, 0, fwidth, fheight);
	//console.log(pix)
	if (VTFOptions.ImageFormat == VTFImageFormats.DXT1 || VTFOptions.ImageFormat == VTFImageFormats.DXT5) { // DXT1; DXT5
		for (var b=0; b<=2; b++) {
			if (document.getElementById("brightnessform")[b].checked) var brightness = b;
		}
		var dith = false;
		if (document.getElementById('ditherCheck').checked) {
			dith = true;
			var dpix = mipmaps[canvas].getContext("2d").getImageData(mipmaps[canvas].width/2 - fwidth/2, 0, fwidth, fheight);
			reduceColors(dpix,5,6,5,8,true);
		}
		var position = 0;
		for (var j=0; j<fheight/4; j++) { // rows of blocks
			for (var i=0; i<fwidth/4; i++) { // columns of blocks
				var lumaMax = 0;
				var lumaMin = 255;
				//var hue1 = -1;
				//var hue2 = -1;
				var pixelMax = [0,0,0];
				var pixelMin = [255,255,255];
				var isAlpha = false;
				var pixelOrder = [0,2,3,1]; // the order of colors for un-inverted colors without transparency
				var alphaOrder = [1,7,6,5,4,3,2,0];
				var alphaMax = 0;
				var alphaMin = 255;
				blockCount++;
				// 0 - color1, 1 - color2, 2 - color1.33(or 1.5), 3 - color1.66(or alpha)
				for (var y=0; y<4; y++) { // pixel rows in block
					for (var x=0; x<16; x+=4) { // pixel columns in block
						position = x+(fwidth*4*y)+(16*i)+(fwidth*16*j); // position of a pixel in canvas
						var luma = (VTFOptions.lumaWeights[0]*pix.data[position])+(VTFOptions.lumaWeights[1]*pix.data[position+1])+(VTFOptions.lumaWeights[2]*pix.data[position+2]); // ITU-R BT.709
						if (pix.data[position+3] > 127 || VTFOptions.ImageFormat == VTFImageFormats.DXT5) { // find most different colors, unless transparent; DXT5
							if (luma > lumaMax) {
								lumaMax = luma;
								pixelMax[0] = pix.data[position];
								pixelMax[1] = pix.data[position+1];
								pixelMax[2] = pix.data[position+2];
							}
							if (luma < lumaMin) {
								lumaMin = luma;
								pixelMin[0] = pix.data[position];
								pixelMin[1] = pix.data[position+1];
								pixelMin[2] = pix.data[position+2];
							}
							if (pix.data[position+3] > alphaMax) {
								alphaMax = pix.data[position+3];
							}
							if (pix.data[position+3] < alphaMin) {
								alphaMin = pix.data[position+3];
							}
						}
						else isAlpha = true;
					}
				}
				var alphaInter = (alphaMax-alphaMin) / 7;
				alphaValueTable[blockPosition] = alphaMax;
				alphaValueTable[blockPosition+1] = alphaMin;
				colorTable[blockPosition] = (Math.round((pixelMin[0]+(2*brightness))*31/255)<<11)+(Math.round((pixelMin[1]+brightness)*63/255)<<5)+(Math.round((pixelMin[2]+(2*brightness))*31/255)); // RGB888 to RGB565 color1
				colorTable[blockPosition+1] = (Math.round((pixelMax[0]+(2*brightness))*31/255)<<11)+(Math.round((pixelMax[1]+brightness)*63/255)<<5)+(Math.round((pixelMax[2]+(2*brightness))*31/255)); // RGB888 to RGB565 color2
				/*if(colorTable[blockPosition] == colorTable[blockPosition+1]){
					colorTable[blockPosition] = (Math.floor((pixelMin[0]+(2*brightness))*31/255)<<11)+(Math.floor((pixelMin[1]+brightness)*63/255)<<5)+(Math.floor((pixelMin[2]+(2*brightness))*31/255)); // RGB888 to RGB565 color1
					colorTable[blockPosition+1] = (Math.ceil((pixelMax[0]+(2*brightness))*31/255)<<11)+(Math.ceil((pixelMax[1]+brightness)*63/255)<<5)+(Math.ceil((pixelMax[2]+(2*brightness))*31/255)); // RGB888 to RGB565 color2
				}*/
				pixelMin[0] = ((colorTable[blockPosition] >> 11) & 31) * (255/31);
				pixelMin[1] = ((colorTable[blockPosition] >> 5) & 63) * (255/63);
				pixelMin[2] = ((colorTable[blockPosition]) & 31) * (255/31);
				pixelMax[0] = ((colorTable[blockPosition+1] >> 11) & 31) * (255/31);
				pixelMax[1] = ((colorTable[blockPosition+1] >> 5) & 63) * (255/63);
				pixelMax[2] = ((colorTable[blockPosition+1]) & 31) * (255/31);
				if (document.getElementById("lumaavgform")[0].checked) var lumaAvg = (lumaMax+lumaMin)/2;
				else var lumaAvg = Math.sqrt(((lumaMax*lumaMax)+(lumaMin*lumaMin))/2);
				if (isAlpha == false) { // without transparency in the block
					if (colorTable[blockPosition] < colorTable[blockPosition+1]) { // let's make sure that color1> color2
						var temp = colorTable[blockPosition];
						colorTable[blockPosition] = colorTable[blockPosition+1];
						colorTable[blockPosition+1] = temp;
						pixelOrder = [1,3,2,0];
					}
					if (colorTable[blockPosition] == colorTable[blockPosition+1]) { // exception
						if (colorTable[blockPosition+1] > 0) {
							colorTable[blockPosition+1]--; // to spare so that the game engine does not think that the block has transparency
							pixelOrder = [0,0,0,0];
						}
						else {
							colorTable[blockPosition]++;
							pixelOrder = [1,1,1,1];
						}
					}
					if (alphaValueTable[blockPosition] == alphaValueTable[blockPosition+1]) {
						if (alphaValueTable[blockPosition+1] > 0) {
							alphaValueTable[blockPosition+1]--; // to spare so that the game engine does not think that the block has transparency
							alphaOrder = [0,0,0,0,0,0,0,0];
						}
						else {
							alphaValueTable[blockPosition]++;
							alphaOrder = [1,1,1,1,1,1,1,1];
						}
					}
					if (document.getElementById("lumathrform")[0].checked) {
						var lumaBelow = (lumaMin+lumaAvg)/2; // below this threshold draw pixelMin
						var lumaAbove = (lumaMax+lumaAvg)/2; // below this threshold draw pixel23
					}
					else {
						var lumaBelow = Math.sqrt(((lumaMin*lumaMin)+(lumaAvg*lumaAvg))/2); // below this threshold draw pixelMin
						var lumaAbove = Math.sqrt(((lumaMax*lumaMax)+(lumaAvg*lumaAvg))/2); // below this threshold draw pixel23
					}
					var pixel13 = [(pixelMin[0]+pixelMin[0]+pixelMax[0])/3,(pixelMin[1]+pixelMin[1]+pixelMax[1])/3,(pixelMin[2]+pixelMin[2]+pixelMax[2])/3]; // 1/3 between colors
					var pixel23 = [(pixelMin[0]+pixelMax[0]+pixelMax[0])/3,(pixelMin[1]+pixelMax[1]+pixelMax[1])/3,(pixelMin[2]+pixelMax[2]+pixelMax[2])/3]; // 2/3 between colors
					pixelTable[blockPosition] = 0;
					pixelTable[blockPosition+1] = 0;
					alphaLookupTable[blockPosition] = 0;
					alphaLookupTable[blockPosition+1] = 0;
					for (var y=0; y<4; y++) {
						for (var x=0; x<16; x+=4) {

							position = x+(fwidth*4*y)+(16*i)+(fwidth*16*j);


							if (dith || colorDifference == 0) {
								var palette = [pixelMin, pixel13, pixel23, pixelMax];
								var color = [pix.data[position], pix.data[position+1], pix.data[position+2]];
								var closest = bestMatchIndex(palette, color);
								var closest2 = bestMatchExIndex(palette, color, closest);
								var closest3;
								if (closest[0] == closest2[0])
									closest3 = 0;
								else
									closest3 = Math.round(closest[0]/(closest[0]+closest2[0]) * 16);
								// Use the dithering matrix that is based on the closest shade and pick the color

								if (dith)
									var trans = [closest[1], closest2[1]][getDither(dither[closest3], x/4, y)];
								else
									var trans = closest[1];
								if (y<2) pixelTable[blockPosition] += pixelOrder[trans] << 2*((x/4)+(4*y)); // first two rows
								else pixelTable[blockPosition+1] += pixelOrder[trans] << 2*((x/4)+(4*(y-2))); // last two rows
								pix.data[position] = palette[trans][0];
								pix.data[position+1] = palette[trans][1];
								pix.data[position+2] = palette[trans][2];
							}
							else{
								var luma = (VTFOptions.lumaWeights[0]*pix.data[position])+(VTFOptions.lumaWeights[1]*pix.data[position+1])+(VTFOptions.lumaWeights[2]*pix.data[position+2]); // ITU-R BT.709
								if (luma < lumaBelow) {
									pix.data[position] = pixelMin[0];
									pix.data[position+1] = pixelMin[1];
									pix.data[position+2] = pixelMin[2];
									if (y<2) pixelTable[blockPosition] += pixelOrder[0] << 2*((x/4)+(4*y)); // first two rows
									else pixelTable[blockPosition+1] += pixelOrder[0] << 2*((x/4)+(4*(y-2))); // last two rows
								}
								else if (luma < lumaAvg) {
									pix.data[position] = pixel13[0];
									pix.data[position+1] = pixel13[1];
									pix.data[position+2] = pixel13[2];
									if (y<2) pixelTable[blockPosition] += pixelOrder[1] << 2*((x/4)+(4*y));
									else pixelTable[blockPosition+1] += pixelOrder[1] << 2*((x/4)+(4*(y-2)));
								}
								else if (luma < lumaAbove) {
									pix.data[position] = pixel23[0];
									pix.data[position+1] = pixel23[1];
									pix.data[position+2] = pixel23[2];
									if (y<2) pixelTable[blockPosition] += pixelOrder[2] << 2*((x/4)+(4*y));
									else pixelTable[blockPosition+1] += pixelOrder[2] << 2*((x/4)+(4*(y-2)));
								}
								else {
									pix.data[position] = pixelMax[0];
									pix.data[position+1] = pixelMax[1];
									pix.data[position+2] = pixelMax[2];
									if (y<2) pixelTable[blockPosition] += pixelOrder[3] << 2*((x/4)+(4*y));
									else pixelTable[blockPosition+1] += pixelOrder[3] << 2*((x/4)+(4*(y-2)));
								}
							}
							if (VTFOptions.ImageFormat == VTFImageFormats.DXT1) // DXT1
								pix.data[position+3] = 255;
							else {
								var alphanum = 0;
								if (alphaInter != 0)
									var alphanum = Math.round((pix.data[position+3]-alphaMin) / alphaInter);
								if (y<2) alphaLookupTable[blockPosition] += alphaOrder[alphanum] << 3*((x/4)+(4*y));
								else alphaLookupTable[blockPosition+1] += alphaOrder[alphanum] << 3*((x/4)+(4*(y-2)));
								pix.data[position+3] = restoreAlpha (alphaValueTable[blockPosition], alphaValueTable[blockPosition+1], alphaOrder[alphanum]);
							}
						}
					}
				}
				else {
					pixelOrder = [0,2,1,3];
					if (colorTable[blockPosition] > colorTable[blockPosition+1]) { // let's make sure that color1 <= color2
						var temp = colorTable[blockPosition];
						colorTable[blockPosition] = colorTable[blockPosition+1];
						colorTable[blockPosition+1] = temp;
						pixelOrder = [1,2,0,3];
					}
					var pixelAvg = [(pixelMin[0]+pixelMax[0])/2,(pixelMin[1]+pixelMax[1])/2,(pixelMin[2]+pixelMax[2])/2];
					if (document.getElementById("lumathrform")[0].checked) {
						var lumaMinimum = (lumaMin+lumaMin+lumaAvg)/3; // below this threshold draw pixelMin
						var lumaMaximum = (lumaMax+lumaMax+lumaAvg)/3; // below this threshold draw pixelAvg
					}
					else {
						var lumaMinimum = Math.sqrt(((lumaMin*lumaMin)+(lumaMin*lumaMin)+(lumaAvg*lumaAvg))/3); // below this threshold draw pixelMin
						var lumaMaximum = Math.sqrt(((lumaMax*lumaMax)+(lumaMax*lumaMax)+(lumaAvg*lumaAvg))/3); // below this threshold draw pixelAvg
					}
					pixelTable[blockPosition] = 0;
					pixelTable[blockPosition+1] = 0;
					for (var y=0; y<4; y++) {
						for (var x=0; x<16; x+=4) {
							position = x+(fwidth*4*y)+(16*i)+(fwidth*16*j);
							var luma = (VTFOptions.lumaWeights[0]*pix.data[position])+(VTFOptions.lumaWeights[1]*pix.data[position+1])+(VTFOptions.lumaWeights[2]*pix.data[position+2]); // ITU-R BT.709
							if (pix.data[position+3] < 128) {
								pix.data[position+3] = 0;
								if (y<2) pixelTable[blockPosition] += pixelOrder[3] << 2*((x/4)+(4*y));
								else pixelTable[blockPosition+1] += pixelOrder[3] << 2*((x/4)+(4*(y-2)));
							}
							else if (dith || colorDifference == 0) {
								var palette = [pixelMin, pixelAvg, pixelMax];
								var color = [pix.data[position], pix.data[position+1], pix.data[position+2]];
								var closest = bestMatchIndex(palette, color);
								var closest2 = bestMatchExIndex(palette, color, closest);
								var closest3;
								if (closest[0] == closest2[0])
									closest3 = 0;
								else
									closest3 = Math.round(closest[0]/(closest[0]+closest2[0]) * 16);
								// Use the dithering matrix that is based on the closest shade and pick the color

								if (dith)
									var trans = [closest[1], closest2[1]][getDither(dither[closest3], x/4, y)];
								else
									var trans = closest[1];
								if (y<2) pixelTable[blockPosition] += pixelOrder[trans] << 2*((x/4)+(4*y)); // first two rows
								else pixelTable[blockPosition+1] += pixelOrder[trans] << 2*((x/4)+(4*(y-2))); // last two rows
								pix.data[position] = palette[trans][0];
								pix.data[position+1] = palette[trans][1];
								pix.data[position+2] = palette[trans][2];
							}
							else {
								pix.data[position+3] = 255;
								if (luma < lumaMinimum) {
									pix.data[position] = pixelMin[0];
									pix.data[position+1] = pixelMin[1];
									pix.data[position+2] = pixelMin[2];
									if (y<2) pixelTable[blockPosition] += pixelOrder[0] << 2*((x/4)+(4*y));
									else pixelTable[blockPosition+1] += pixelOrder[0] << 2*((x/4)+(4*(y-2)));
								}
								else if (luma < lumaMaximum) {
									pix.data[position] = pixelAvg[0];
									pix.data[position+1] = pixelAvg[1];
									pix.data[position+2] = pixelAvg[2];
									if (y<2) pixelTable[blockPosition] += pixelOrder[1] << 2*((x/4)+(4*y));
									else pixelTable[blockPosition+1] += pixelOrder[1] << 2*((x/4)+(4*(y-2)));
								}
								else {
									pix.data[position] = pixelMax[0];
									pix.data[position+1] = pixelMax[1];
									pix.data[position+2] = pixelMax[2];
									if (y<2) pixelTable[blockPosition] += pixelOrder[2] << 2*((x/4)+(4*y));
									else pixelTable[blockPosition+1] += pixelOrder[2] << 2*((x/4)+(4*(y-2)));
								}
							}
						}
					}
				}
				blockPosition += 2; // block number*2 (for double arrays)
			}
		}//BM-Data
	}
	else if(VTFOptions.ImageFormat == VTFImageFormats.RGBA8888) { // RGBA8888; 0
		outputImage[canvas] = pix.data;
	}
	else if(VTFOptions.ImageFormat == VTFImageFormats.ABGR8888) { // ABGR8888; 1
		outputImage[canvas] = pix.data;
	}
	else if (VTFOptions.ImageFormat == VTFImageFormats.RGB888) {// RGB888; 2
		for (var i = 0; i < pix.data.length; i += 4){
			pix.data[i+3] = 255;
		}
		outputImage[canvas] = pix.data;
	}
	else if (VTFOptions.ImageFormat == VTFImageFormats.BGR888) {// BGR888; 3
		for (var i = 0; i < pix.data.length; i += 4){
			pix.data[i+3] = 255;
		}
		outputImage[canvas] = pix.data;
	}
	else if(VTFOptions.ImageFormat == VTFImageFormats.RGB565) { // RGB565; 4
		for (var i = 0; i < pix.data.length; i += 4){
			pix.data[i+3] = 255;
		}
		reduceColors(pix, 5, 6, 5, 8, document.getElementById('ditherCheck').checked);
		outputImage[canvas] = pix.data;
	}
	else if(VTFOptions.ImageFormat == VTFImageFormats.ARGB8888) { // ARGB8888; 11
		outputImage[canvas] = pix.data;
	}
	else if(VTFOptions.ImageFormat == VTFImageFormats.BGRA8888) { // BGRA8888; 12
		outputImage[canvas] = pix.data;
	}
	else if(VTFOptions.ImageFormat == VTFImageFormats.BGR565) { // BGR565; 17
		for (var i = 0; i < pix.data.length; i += 4){
			pix.data[i+3] = 255;
		}
		reduceColors(pix, 5, 6, 5, 8, document.getElementById('ditherCheck').checked);
		outputImage[canvas] = pix.data;
	}
	else if(VTFOptions.ImageFormat == VTFImageFormats.BGRA4444) { // BGRA4444; 19
		reduceColors(pix, 4, 4, 4, 4, document.getElementById('ditherCheck').checked);
		outputImage[canvas] = pix.data;
	}
	else if(VTFOptions.ImageFormat == VTFImageFormats.BGRA5551) { //BGRA5551; 21
		reduceColors(pix, 5, 5, 5, 1, document.getElementById('ditherCheck').checked);
		outputImage[canvas] = pix.data;
	}
	mipmaps[canvas].getContext("2d").putImageData(pix,mipmaps[canvas].width/2 - fwidth/2,0);
}

function createVTF() {
	var size = 0;
	if (VTFOptions.ImageFormat == VTFImageFormats.DXT1) // DXT1
		size = (blockCount*8);
	if (VTFOptions.ImageFormat == VTFImageFormats.DXT5) //DXT5
		size = (blockCount*16);
	else {
		for (var i = 0; i < outputImage.length; i++){
			size += outputImage[i].length;
		}
		//console.log("blockCount: "+blockCount);
		//console.log("size: "+size);
	} (2*2)*2
	if (VTFOptions.ImageFormat == VTFImageFormats.RGB565 /*4*/|| VTFOptions.ImageFormat == VTFImageFormats.BGR565)

	var file = new Uint8Array(size+VTFOptions.HeaderSize-((VTFImageFormatInfo.getInfo().AlphaBitsPerPixel==0) ? (VTFOptions.width*VTFOptions.height)*2 : 0));
	//console.log("save: "+width+" "+height+" "+ size);
 //var header = [86,84,70,0,version[0],0,0,0,version[1],0,0,0,64,0,0,0,0,0,0,0,12 + sampling,flags,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,outputType,0,0,0,1,13,0,0,0,0,0,1]; // 64B (bare minimum) 13,0,0,0,0,0,1]; 	var header = [86,84,70,0,version[0],0,0,0,version[1],0,0,0,64,0,0,0,0,0,0,0,12 + document.getElementById("sampling").value,35-hasMipmaps,0,0,frameCount,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,outputType,0,0,0,hasMipmaps ? getReducedMipmapCount()+1 : 1,13,0,0,0,0,0,1]; // 64B (bare minimum) 13,0,0,0,0,0,1];
	var header = Array.from(getHeader().Array)
	//var header = [86,84,70,0,version[0],0,0,0,version[1],0,0,0,64,0,0,0,0,0,0,0,12 + sampling,flags,0,0,1,0,0,0,0,0,0,0,0,0,128,63,0,0,128,63,0,0,128,63,0,0,0,0,0,0,128,63,outputType,0,0,0,1,255,255,255,255,0,0,1];
// signature[4],version[8],size[4],width[2],height[2],flags[4],frames[?],firstframe[?],padding[4],
/* writeShort(header,16, shortened ? width - 4 : width); //writeShort(header,16, bool ? then : else); (n,16,2)
	writeShort(header,18, height);*/
	for (var i=0; i<header.length; i++) {
		file[i] = header[i];
	}//BM-Header
	if (VTFOptions.ImageFormat == VTFImageFormats.DXT1) {//DXT1
		for (var i=VTFOptions.HeaderSize; i<file.length; i+=8) {
			var blockNum = (i-VTFOptions.HeaderSize)/4;
			writeShort(file, i, colorTable[blockNum]);
			writeShort(file, i+2, colorTable[blockNum+1]);
			writeShort(file, i+4, pixelTable[blockNum]);
			writeShort(file, i+6, pixelTable[blockNum+1]);

		}
	}
	else if (VTFOptions.ImageFormat == VTFImageFormats.DXT5) {//DXT5
		for (var i=VTFOptions.HeaderSize; i<file.length; i+=16) {
			var blockNum = (i-VTFOptions.HeaderSize)/8;

			file[i] = alphaValueTable[blockNum];
			file[i+1] = alphaValueTable[blockNum+1];
			writeInt(file, i+2, alphaLookupTable[blockNum],3);
			writeInt(file, i+5, alphaLookupTable[blockNum+1],3);

			writeShort(file, i+8, colorTable[blockNum]);
			writeShort(file, i+10, colorTable[blockNum+1]);

			writeShort(file, i+12, pixelTable[blockNum]);
			writeShort(file, i+14, pixelTable[blockNum+1]);
		}
	}
	else if (VTFOptions.ImageFormat == VTFImageFormats.RGBA8888){//RGBA8888; 0
		var pos = VTFOptions.HeaderSize;
		for (var i = outputImage.length-1; i >= 0; i--){
			var data = outputImage[i];
			for (var j = 0; j < data.length; j++){
				file[pos] = data[j];
				pos++;
			}
		}
	}
	else if (VTFOptions.ImageFormat == VTFImageFormats.ABGR8888){//ABGR8888; 1 --test
		var pos = VTFOptions.HeaderSize;
		for (var i = outputImage.length-1; i >= 0; i--){
			var data = outputImage[i];
			for (var j = 0; j < data.length; j+=4){
				file[pos] = data[j+3];
				file[pos+1] = data[j+2];
				file[pos+2] = data[j+1];
				file[pos+3] = data[j];
				pos+=4;
			}
		}
	}
	else if (VTFOptions.ImageFormat == VTFImageFormats.RGB888){//RGB888; 2
		var pos = VTFOptions.HeaderSize;
		for (var i = outputImage.length-1; i >= 0; i--){
			var data = outputImage[i];
			for (var j = 0; j < data.length; j+=4){
				file[pos] = data[j];
				file[pos+1] = data[j+1];
				file[pos+2] = data[j+2];
				pos+=3;
			}
		}
	}
	else if (VTFOptions.ImageFormat == VTFImageFormats.BGR888){//BGR888; 3 --test
		var pos = VTFOptions.HeaderSize;
		for (var i = outputImage.length-1; i >= 0; i--){
			var data = outputImage[i];
			for (var j = 0; j < data.length; j+=4){
				file[pos] = data[j+2];
				file[pos+1] = data[j+1];
				file[pos+2] = data[j];
				pos+=3;
			}
		}
	}
	else if (VTFOptions.ImageFormat == VTFImageFormats.RGB565){//RGB565; 4
		var pos = VTFOptions.HeaderSize;
		for (var i = outputImage.length-1; i >= 0; i--){
			var data = outputImage[i];
			console.log(pos,i,j)
			for (var j = 0; j < outputImage[i].length; j+=4){
				writeShort(file,pos, ((data[j]>>3)) + ((data[j+1]>>2) << 5) + ((data[j+2]>>3 )<< 11));
				pos+=2;
				
			}
		}
	}
	else if (VTFOptions.ImageFormat == VTFImageFormats.ARGB8888){//ARGB8888; 11 --test
		var pos = VTFOptions.HeaderSize;
		for (var i = outputImage.length-1; i >= 0; i--){
			var data = outputImage[i];
			for (var j = 0; j < data.length; j+=4){
				file[pos] = data[j+3];
				file[pos+1] = data[j];
				file[pos+2] = data[j+1];
				file[pos+3] = data[j+2];
				pos+=4;
			}
		}
	}
	else if (VTFOptions.ImageFormat == VTFImageFormats.BGRA8888){//BGRA8888; 12 --test
		var pos = VTFOptions.HeaderSize;
		for (var i = outputImage.length-1; i >= 0; i--){
			var data = outputImage[i];
			for (var j = 0; j < data.length; j+=4){
				file[pos] = data[j+2];
				file[pos+1] = data[j+1];
				file[pos+2] = data[j];
				file[pos+3] = data[j+3];
				pos+=4;
			}
		}
	}
	else if (VTFOptions.ImageFormat == VTFImageFormats.BGR565){//BGR565; 17 --inprogress
		var pos = VTFOptions.HeaderSize;
		for (var i = outputImage.length-1; i >= 0; i--){
			var data = outputImage[i];
			for (var j = 0; j < outputImage[i].length; j+=4){
				writeShort(file,pos, ((data[j+2]>>3)) + ((data[j+1]>>2) << 5) + ((data[j]>>3 )<< 11)); //16
				pos+=2;
			}
		}
	}
	else if (VTFOptions.ImageFormat == VTFImageFormats.BGRA4444){//BGRA4444; 19
		var pos = VTFOptions.HeaderSize;
		for (var i = outputImage.length-1; i >= 0; i--){
			var data = outputImage[i];
			for (var j = 0; j < outputImage[i].length; j+=4){
				writeShort(file,pos, ((data[j]>>4) << 8)+ ((data[j+1]>>4) << 4) + ((data[j+2]>>4 )) + ((data[j+3] >> 4) << 12));
				pos+=2;
			}
		}
	}
	else if (VTFOptions.ImageFormat == VTFImageFormats.BGRA5551){//BGRA5551; 21
		var pos = VTFOptions.HeaderSize;
		for (var i = outputImage.length-1; i >= 0; i--){
			var data = outputImage[i];
			for (var j = 0; j < outputImage[i].length; j+=4){
				writeShort(file,pos, ((data[j]>>3) << 10) + ((data[j+1]>>3) << 5) + ((data[j+2]>>3 )) + ((data[j+3] >> 7) << 15)); //REALIZATION  ((data[j+n]>>?8)<<?)
				pos+=2;
			}
		}
	}
	filetoconsole(file)
	download(file, "spray.vtf")
}

//Utils
function getEstFileSize(cmipmaps) {//BM-Size
	var mult = 1;
	if (VTFOptions.ImageFormat == VTFImageFormats.RGBA8888 || VTFOptions.ImageFormat == VTFImageFormats.ABGR8888 || VTFOptions.ImageFormat == VTFImageFormats.ARGB8888 || VTFOptions.ImageFormat == VTFImageFormats.BGRA8888){ // RGBA8888
		mult = 3.36;//4
	}
	else if (VTFOptions.ImageFormat == VTFImageFormats.DXT1){ // DXT1
		mult = 0.5;
	}
	else if (VTFOptions.ImageFormat == VTFImageFormats.RGB888 || VTFOptions.ImageFormat == VTFImageFormats.BGR888){ // RGB888, BGR888
		mult = 2.592;//3
	}
	else if (VTFOptions.ImageFormat == VTFImageFormats.RGB565 /*4*/|| VTFOptions.ImageFormat == VTFImageFormats.BGR565 /*17*/|| VTFOptions.ImageFormat == VTFImageFormats.BGRA5551 /*21*/|| VTFOptions.ImageFormat == VTFImageFormats.BGRA4444 /*19*/){ // RGB565; BGRA5551; BGRA4444
		mult = 1.824; //2
	}
	mult *= 1+ (1/3);
	/*if (cmipmaps && document.getElementById("mipmapsCheck").checked) {
		if (reducedMipmaps)
			mult *= 1.33203125;
		else
			mult *= 1+ (1/3);
	}*/
	return (shortened ? VTFOptions.width - 4 : VTFOptions.width) * getTotalImageHeight() * mult + VTFOptions.HeaderSize;
}

function getTotalImageHeight() {
	return VTFOptions.height * VTFOptions.Frames;
}

function getHueDiff(hue1, hue2){
	return 180 - Math.abs(Math.abs(hue1 - hue2) - 180);
}

function getHue(red, green, blue){
	var min = Math.min(Math.min(red, green),blue);
	var max = Math.max(Math.max(red, green),blue);
	if (min == max)
		return 0;

	if (max == red){
		hue = (green - blue)/(max - min);
	}
	else if (max == green){
		hue = 2 + (blue - red)/(max - min);
	}
	else if (max == blue){
		hue = 4 + (red - green)/(max - min);
	}
	hue *= 60;
	return hue;
}

function restoreAlpha(alpha1, alpha2, num){
	if (alpha1 > alpha2)
	switch(num){
		case 0: return alpha1;
		case 1: return alpha2;
		case 2: return (6 * alpha1 + 1 * alpha2) / 7;
		case 3: return (5 * alpha1 + 2 * alpha2) / 7;
		case 4: return (4 * alpha1 + 3 * alpha2) / 7;
		case 5: return (3 * alpha1 + 4 * alpha2) / 7;
		case 6: return (2 * alpha1 + 5 * alpha2) / 7;
		case 7: return (1 * alpha1 + 6 * alpha2) / 7;
	}
	else
	switch (num) {
		case 0: return alpha1;
		case 1: return alpha2;
		case 2: return (4 * alpha1 + 1 * alpha2) / 5;
		case 3: return (3 * alpha1 + 2 * alpha2) / 5;
		case 4: return (2 * alpha1 + 3 * alpha2) / 5;
		case 5: return (1 * alpha1 + 4 * alpha2) / 5;
		case 6: return 0;
		case 7: return 255;
	}
	return 0;
}

function writeShort(data, pos, value){
	data[pos] = value & 0xFF;
	data[pos + 1] = (value >>> 8) & 0xFF;
}


function writeInt(data, pos, value, bytes){
	for (var i = 0; i < bytes; i++) {
		data[pos + i] = (value >>> i*8) & 0xFF;
	}
}

function reduceColors(data, rb, gb, bb, ab, dith) {
	var d = data.data;
	var rs = 8-rb;
	var gs = 8-gb;
	var bs = 8-bb;
	var as = 8-ab;
	var rm = 255 / (255 >> rs);
	var gm = 255 / (255 >> gs);
	var bm = 255 / (255 >> bs);
	var am = 255 / (255 >> as);
	for (var x = 0; x < data.width; x += 1) {
        for (var y = 0; y < data.height; y += 1) {
            var pixel = (y * data.width * 4) + (x * 4);
			var color = [d[pixel], d[pixel + 1], d[pixel + 2]];

			var floor = [Math.round(Math.floor(d[pixel] / rm) * rm),Math.round(Math.floor(d[pixel+1] / gm) * gm),Math.round(Math.floor(d[pixel+2] / bm) * bm)];
			var ceil = [Math.round(Math.ceil(d[pixel] / rm) * rm),Math.round(Math.ceil(d[pixel+1] / gm) * gm),Math.round(Math.ceil(d[pixel+2] / bm) * bm)];
			var closest = bestMatch([floor, ceil], color);

			if (closest[0] == floor[0] && closest[1] == floor[1] && closest[2] == floor[2]){
				var closest2 = ceil;
			}
			else{
				var closest2 = floor;
			}
			var alpha = Math.round(Math.floor(d[pixel+3] / am) * am);
			var alpha2 = Math.round(Math.ceil(d[pixel+3] / am) * am);
			if (Math.abs(alpha - d[pixel+3]) > Math.abs(alpha2 - d[pixel+3])){
				alpha = alpha2;
			}
			if (dith) {
				var between;

				between = [];

				// Get the 17 colors between the two previously found colors

				for (var b = 0; b < 17; b += 1) {
					between.push([closest[0] + (closest2[0] - closest[0]) * b/16,closest[1] + (closest2[1] - closest[1]) * b/16,closest[2] + (closest2[2] - closest[2]) * b/16]/*addColor(closest, multiplyColor(divideColor(closest2, 17), b))*/);
				}
				// Get the closest shade to the current pixel from the new 15 colors

				var closest3 = bestMatch(between, color);
				var index3 = between.indexOf(closest3);

				// Use the dithering matrix that is based on the closest shade and pick the color

				var trans = [closest, closest2][getDither(dither[index3], x, y)];
				d[pixel] = trans[0];
				d[pixel + 1] = trans[1];
				d[pixel + 2] = trans[2];

				// Apply the color to the image with full opacity
			}
			else {
				d[pixel] = closest[0];
				d[pixel + 1] = closest[1];
				d[pixel + 2] = closest[2];
			}
            d[pixel + 3] = alpha;
        }
    }

    // context.putImageData(png, 0, 0);
}
// Function to download data to a file
function filetoconsole(data) {
	var reader = new FileReader();
	document.getElementById('outUint8Array').innerHTML = "Out: ["+data.toString()+"]; "
	file = new Blob([data], {type: "application/octet-stream"});
	console.log(reader.readAsArrayBuffer(file, "application/octet-stream"));
}
function download(data, filename) {
    var a = document.createElement("a"),
        file = new Blob([data], {type: "application/octet-stream"});
    if (window.navigator.msSaveOrOpenBlob) // IE10+
        window.navigator.msSaveOrOpenBlob(file, filename);
    else { // Others
        var url = URL.createObjectURL(file);
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(function() {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }, 0);
    }
}

function getColorDiff(color1, color2){
	return Math.abs(color1[0] - color2[0]) + Math.abs(color1[1] - color2[1]) + Math.abs(color1[2] - color2[2]);
}
const fromHexString = hexString =>
  new Uint8Array(hexString.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));

const toHexString = bytes =>
  bytes.reduce((str, byte) => str + byte.toString(16).padStart(2, '0'), '');

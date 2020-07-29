// module "vtf_info.js"
const { uint,float,char,short,byte,merge,powerOfTwo,toHexString,fromHexString,getColorDiff } = require('./vtf_util.js');

const VTFImageFormats = {
  '-1': 'NONE',
  0: 'RGBA8888',
  1: 'ABGR8888',
  2: 'RGB888',
  3: 'BGR888',
  4: 'RGB565',
  5: 'I8',
  6: 'IA88',
  7: 'P8',
  8: 'A8',
  9: 'RGB888_BLUESCREEN',
  10: 'BGR888_BLUESCREEN',
  11: 'ARGB8888',
  12: 'BGRA8888',
  13: 'DXT1',
  14: 'DXT3',
  15: 'DXT5',
  16: 'BGRX8888',
  17: 'BGR565',
  18: 'BGRX5551',
  19: 'BGRA4444',
  20: 'DXT1_ONEBITALPHA',
  21: 'BGRA5551',
  22: 'UV88',
  23: 'UVWQ8888',
  24: 'RGBA16161616F',
  25: 'RGBA16161616',
  26: 'UVLX8888',
  NONE:-1,
  RGBA8888:0,        //!<  = Red, Green, Blue, Alpha - 32 bpp
  ABGR8888:1,        //!<  = Alpha, Blue, Green, Red - 32 bpp
  RGB888:2,        //!<  = Red, Green, Blue - 24 bpp
  BGR888:3,        //!<  = Blue, Green, Red - 24 bpp
  RGB565:4,        //!<  = Red, Green, Blue - 16 bpp
  I8:5,        //!<  = Luminance - 8 bpp
  IA88:6,        //!<  = Luminance, Alpha - 16 bpp
  P8:7,        //!<  = Paletted - 8 bpp
  A8:8,        //!<  = Alpha- 8 bpp
  RGB888_BLUESCREEN:9,        //!<  = Red, Green, Blue, "BlueScreen" Alpha - 24 bpp
  BGR888_BLUESCREEN:10,        //!<  = Red, Green, Blue, "BlueScreen" Alpha - 24 bpp
  ARGB8888:11,        //!<  = Alpha, Red, Green, Blue - 32 bpp
  BGRA8888:12,        //!<  = Blue, Green, Red, Alpha - 32 bpp
  DXT1:13,        //!<  = DXT1 compressed format - 4 bpp
  DXT3:14,        //!<  = DXT3 compressed format - 8 bpp
  DXT5:15,        //!<  = DXT5 compressed format - 8 bpp
  BGRX8888:16,        //!<  = Blue, Green, Red, Unused - 32 bpp
  BGR565:17,        //!<  = Blue, Green, Red - 16 bpp
  BGRX5551:18,        //!<  = Blue, Green, Red, Unused - 16 bpp
  BGRA4444:19,        //!<  = Red, Green, Blue, Alpha - 16 bpp
  DXT1_ONEBITALPHA:20,        //!<  = DXT1 compressed format with 1-bit alpha - 4 bpp
  BGRA5551:21,        //!<  = Blue, Green, Red, Alpha - 16 bpp
  UV88:22,        //!<  = 2 channel format for DuDv/Normal maps - 16 bpp
  UVWQ8888:23,        //!<  = 4 channel format for DuDv/Normal maps - 32 bpp
  RGBA16161616F:24,        //!<  = Red, Green, Blue, Alpha - 64 bpp
  RGBA16161616:25,        //!<  = Red, Green, Blue, Alpha signed with mantissa - 64 bpp
  UVLX8888:26        //!<  = 4 channel format for DuDv/Normal maps - 32 bpp
};

const TextureFlags = {
  POINTSAMPLE:{
    name:"Point Sample",
    comment:"Low quality, 'pixel art' texture filtering.",
    type:"Sampling",
    value: 0x00000001,
    valueOf: function(){ return this.value }
  },
  TRILINEAR: {
    name:"Trilinear",
    comment:"Medium quality texture filtering.",
    type:"Sampling",
    value: 0x00000002,
    valueOf: function(){ return this.value }
  },
  CLAMPS: {
    name:"Clamp S",
    comment:"S coordinates.",
    value: 0x00000004,
    valueOf: function(){ return this.value }
  },
  CLAMPT: {
    name:"Clamp T",
    comment:"T coordinates.",
    value: 0x00000008,
    valueOf: function(){ return this.value }
  },
  ANISOTROPIC: {
    name:"Anisotropic",
    comment:"High quality texture filtering.",
    type:"Sampling",
    value: 0x00000010,
    valueOf: function(){ return this.value }
  },
  HINT_DXT5: {
    name:"Hint DXT5",
    comment:"Used in skyboxes. Makes sure edges are seamless.",
    value: 0x00000020,
    valueOf: function(){ return this.value }
  },
  SRGB: {
    name:"SRGB",
    comment:"Uses space RGB. Useful for High Gamuts. Deprecated in 7.5.",
    value: 0x00000040,
    valueOf: function(){ return this.value }
  },
  NORMAL: {
    name:"Normal Map",
    comment:"Texture is a normal map.",
    value: 0x00000080,
    valueOf: function(){ return this.value }
  },
  NOMIP: {
    name:"No Mipmap",
    comment:"Render largest mipmap only. (Does not delete existing mipmaps, just disables them.)",
    value: 0x00000100,
    valueOf: function(){ return this.value }
  },
  NOLOD: {
    name:"No Level Of Detail",
    comment:"Not affected by texture resolution settings.",
    value: 0x00000200,
    valueOf: function(){ return this.value }
  },
  MINMIP: {
    name:"No Minimum Mipmap",
    comment:"If set, load mipmaps below 32x32 pixels.",
    value: 0x00000400,
    valueOf: function(){ return this.value }
  },
  PROCEDURAL: {
    name:"Procedural",
    comment:"Texture is an procedural texture (code can modify it).",
    value: 0x00000800,
    valueOf: function(){ return this.value }
  },
  ONEBITALPHA: {
    name:"One Bit Alpha (Format Specific)",
    comment:"One bit alpha channel used.",
    type:"FormatSpecific",
    value: 0x00001000,
    valueOf: function(){ return this.value }
  },
  EIGHTBITALPHA: {
    name:"Eight Bit Alpha (Format Specific)",
    comment:"Eight bit alpha channel used.",
    type:"FormatSpecific",
    value: 0x00002000,
    valueOf: function(){ return this.value }
  },
  ENVMAP: {
    name:"Enviroment Map (Format Specific)",
    comment:"Texture is an environment map.",
    value: 0x00004000,
    valueOf: function(){ return this.value }
  },
  RENDERTARGET: {
    name:"Render Target",
    comment:"Texture is a render target.",
    value: 0x00008000,
    valueOf: function(){ return this.value }
  },
  DEPTHRENDERTARGET: {
    name:"Depth Render Target",
    comment:"Texture is a depth render target.",
    value: 0x00010000,
    valueOf: function(){ return this.value }
  },
  NODEBUGOVERRIDE: {
    name:"No Debug Override",
    comment:"n/a",
    value: 0x00020000,
    valueOf: function(){ return this.value }
  },
  SINGLECOPY: {
    name:"Single Copy",
    comment:"n/a",
    value: 0x00040000,
    valueOf: function(){ return this.value }
  },
  UNUSED0: {
    name:"Unused",
    comment:"Unused",
    type:"Unused",
    value: 0x00080000,
    valueOf: function(){ return this.value }
  },
  UNUSED1: {
    name:"Unused",
    comment:"Unused",
    type:"Unused",
    value: 0x00100000,
    valueOf: function(){ return this.value }
  },
  UNUSED2: {
    name:"Unused",
    comment:"Unused",
    type:"Unused",
    value: 0x00200000,
    valueOf: function(){ return this.value }
  },
  UNUSED3: {
    name:"Unused",
    comment:"Unused",
    type:"Unused",
    value: 0x00400000,
    valueOf: function(){ return this.value }
  },
  NODEPTHBUFFER: {
    name:"No Depth Buffer",
    comment:"Do not buffer for Video Processing, generally render distance.",
    value: 0x00800000,
    valueOf: function(){ return this.value }
  },
  UNUSED4: {
    name:"Unused",
    comment:"Unused",
    type:"Unused",
    value: 0x01000000,
    valueOf: function(){ return this.value }
  },
  CLAMPU: {
    name:"Clamp U",
    comment:"Clamp U coordinates (for volumetric textures).",
    value: 0x02000000,
    valueOf: function(){ return this.value }
  },
  VERTEXTEXTURE: {
    name:"Vertex Texture",
    comment:"Usable as a vertex texture",
    value: 0x04000000,
    valueOf: function(){ return this.value }
  },
  SSBUMP: {
    name:"SSBump",
    comment:"Texture is a SSBump. (SSB)",
    value: 0x08000000,
    valueOf: function(){ return this.value }
  },
  UNUSED5: {
    name:"Unused",
    comment:"Unused",
    type:"Unused",
    value: 0x10000000,
    valueOf: function(){ return this.value }
  },
  BORDER: {
    name:"Clamp All",
    comment:"Clamp to border colour on all texture coordinates",
    value: 0x20000000,
    valueOf: function(){ return this.value }
  }
};
const VTFConst = {
  maxVersion: [7,5],
  maxSizePower: 12
}
let VTFOptions = {
  safemode: true, // Flag safe mode
  shortened: false, // ??
  version: [7,1],
  width: 2,
  height: 2,
  selectedFlags: ["CLAMPT","ANISOTROPIC","HINT_DXT5","SRGB","NOMIP","NOLOD"], //,"EIGHTBITALPHA" 0x00000008, 0x00000010, 0x00000020, 0x00000040, 0x00000100, 0x00000200, 0x00002000
  Frames: 1,
  StartFrame: 0,
  reflectivity: [1.0,1.0,1.0],
  BumpScale: 1.0,
  ImageFormat: VTFImageFormats.RGB565,
  hasMipmaps: false,
  MipCount: 1,
  LowResImageFormat: -1,
  LowResImageWidth: 0,
  LowResImageHeight: 0,
  Depth: 1,
  ResourceCount: 0,
  lumaWeights: [0.213,0.715,0.072],//[0.2126,0.7152,0.0722], [0.299,0.587,0.114] ITU-R BT.709
  get HeaderSize() {
  return (this.version < [7,3]) ? 64 : 80
  },
  getflags: function(flags=this.selectedFlags) {
    var tmp=0;
    flags.forEach(function(entry) {
      tmp = (parseInt(tmp, 16) + TextureFlags[entry]).toString(16);
      while (tmp.length < 8) { tmp = '0' + tmp;} // Zero pad.
    });
    return fromHexString(tmp.toString()).reverse(); //.toString()
  }
}
Object.defineProperty(VTFOptions, 'getflags', {
  enumerable: false
});



class SVTFFileHeader {
  constructor({Version=[7,0],HeaderSize=16} = {}) {
    this.signature = char("VTF\0");//4
    this.Version = uint(Version);//8
    this.HeaderSize = uint(HeaderSize);//4
  }
  get Array (){
    var flat = new Uint8Array();
    var type = Object.prototype.toString.call(this);

    for (var key in this) {
      type = Object.prototype.toString.call(this[key]);
      if (type == "[object Object]" || type == "[object Array]"){

        //flat = merge(flat,thing.getArray(thing[key]));
        console.log("Disabled: "+type+"\nValue: "+this[key]);
      } else if (type == "[object Uint8Array]" || type == "[object Uint16Array]" || type == "[object Uint32Array]") {
        flat = merge(flat,this[key]);
      } else {
        flat = new Uint8Array([255]);
        console.log("Unknown: "+type+"\nValue: "+this[key]);
      }
    }
    return flat;

  }
}
class SVTFHeader_70 extends SVTFFileHeader {
  constructor({Version=[7,0],HeaderSize=64,Width=VTFOptions.width,Height=VTFOptions.height,FlagArray=VTFOptions.selectedFlags,Frames=VTFOptions.Frames,StartFrame=VTFOptions.StartFrame,reflectivity=VTFOptions.reflectivity,BumpScale=VTFOptions.BumpScale,ImageFormat=VTFOptions.ImageFormat,MipCount=VTFOptions.MipCount,LowResImageFormat=VTFOptions.LowResImageFormat,LowResImageWidth=VTFOptions.LowResImageWidth,LowResImageHeight=VTFOptions.LowResImageHeight} = {}){
    super({Version,HeaderSize});//12
    this.Width = short(VTFOptions.shortened ? Width - 4 : Width);//2
    this.Height = short(Height);//2
    this.FlagArray = VTFOptions.getflags(FlagArray);//4
    this.Frames = short(Frames);//2
    this.StartFrame = short(StartFrame);//2
    this.padding0 = byte(0,4);//4
    this.reflectivity = float(reflectivity);//12
    this.padding1 = byte(0,4);//4
    this.BumpScale = float(BumpScale);//4
    this.ImageFormat = uint(ImageFormat);//4
    this.MipCount = byte(MipCount);//1
    this.LowResImageFormat = uint(LowResImageFormat);//4
    this.LowResImageWidth = byte(LowResImageWidth);//1
    this.lowResImageHeight = byte(LowResImageHeight);//1
    this.placeholder = new Uint8Array(1);
  }
}//https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/Inheritance

class SVTFHeader_71 extends SVTFHeader_70 {
  constructor({Version=[7,1],HeaderSize=64,Width=VTFOptions.width,Height=VTFOptions.height,FlagArray=VTFOptions.selectedFlags,Frames=VTFOptions.Frames,StartFrame=VTFOptions.StartFrame,reflectivity=VTFOptions.reflectivity,BumpScale=VTFOptions.BumpScale,ImageFormat=VTFOptions.ImageFormat,MipCount=VTFOptions.MipCount,LowResImageFormat=VTFOptions.LowResImageFormat,LowResImageWidth=VTFOptions.LowResImageWidth,LowResImageHeight=VTFOptions.LowResImageHeight} = {}){
    super({Version,HeaderSize,Width,Height,FlagArray,Frames,StartFrame,reflectivity,BumpScale,ImageFormat,MipCount,LowResImageFormat,LowResImageWidth,LowResImageHeight});
  }
}

class SVTFHeader_72 extends SVTFHeader_71 {
  constructor({Version=[7,2],HeaderSize=64,Width=VTFOptions.width,Height=VTFOptions.height,FlagArray=VTFOptions.selectedFlags,Frames=VTFOptions.Frames,StartFrame=VTFOptions.StartFrame,reflectivity=VTFOptions.reflectivity,BumpScale=VTFOptions.BumpScale,ImageFormat=VTFOptions.ImageFormat,MipCount=VTFOptions.MipCount,LowResImageFormat=VTFOptions.LowResImageFormat,LowResImageWidth=VTFOptions.LowResImageWidth,LowResImageHeight=VTFOptions.LowResImageHeight,Depth=VTFOptions.Depth} = {}){
    super({Version,HeaderSize,Width,Height,FlagArray,Frames,StartFrame,reflectivity,BumpScale,ImageFormat,MipCount,LowResImageFormat,LowResImageWidth,LowResImageHeight});
    this.placeholder = new Uint8Array();
    this.Depth = byte(Depth);//1                          //!< Depth of the largest image
  }
}

class SVTFHeader_73 extends SVTFHeader_72 {
  constructor({Version=[7,3],HeaderSize=80,Width=VTFOptions.width,Height=VTFOptions.height,FlagArray=VTFOptions.selectedFlags,Frames=VTFOptions.Frames,StartFrame=VTFOptions.StartFrame,reflectivity=VTFOptions.reflectivity,BumpScale=VTFOptions.BumpScale,ImageFormat=VTFOptions.ImageFormat,MipCount=VTFOptions.MipCount,LowResImageFormat=VTFOptions.LowResImageFormat,LowResImageWidth=VTFOptions.LowResImageWidth,LowResImageHeight=VTFOptions.LowResImageHeight,Depth=VTFOptions.Depth,ResourceCount=VTFOptions.ResourceCount} = {}){
    super({Version,HeaderSize,Width,Height,FlagArray,Frames,StartFrame,reflectivity,BumpScale,ImageFormat,MipCount,LowResImageFormat,LowResImageWidth,LowResImageHeight,Depth});
    this.padding2 = byte(0,4);//4 - should be 3
    this.ResourceCount = uint(ResourceCount);//4                          //!< Number of image resources
    this.padding3 = byte(0,8);//Most likely will never add resource support
  }
}

class SVTFHeader_74 extends SVTFHeader_73 {
  constructor({Version=[7,4],HeaderSize=80,Width=VTFOptions.width,Height=VTFOptions.height,FlagArray=VTFOptions.selectedFlags,Frames=VTFOptions.Frames,StartFrame=VTFOptions.StartFrame,reflectivity=VTFOptions.reflectivity,BumpScale=VTFOptions.BumpScale,ImageFormat=VTFOptions.ImageFormat,MipCount=VTFOptions.MipCount,LowResImageFormat=VTFOptions.LowResImageFormat,LowResImageWidth=VTFOptions.LowResImageWidth,LowResImageHeight=VTFOptions.LowResImageHeight,Depth=VTFOptions.Depth,ResourceCount=VTFOptions.ResourceCount} = {}){
    super({Version,HeaderSize,Width,Height,FlagArray,Frames,StartFrame,reflectivity,BumpScale,ImageFormat,MipCount,LowResImageFormat,LowResImageWidth,LowResImageHeight,Depth,ResourceCount});
  }
}

class SVTFHeader_75 extends SVTFHeader_74 {
  constructor({Version=[7,5],HeaderSize=80,Width=VTFOptions.width,Height=VTFOptions.height,FlagArray=VTFOptions.selectedFlags,Frames=VTFOptions.Frames,StartFrame=VTFOptions.StartFrame,reflectivity=VTFOptions.reflectivity,BumpScale=VTFOptions.BumpScale,ImageFormat=VTFOptions.ImageFormat,MipCount=VTFOptions.MipCount,LowResImageFormat=VTFOptions.LowResImageFormat,LowResImageWidth=VTFOptions.LowResImageWidth,LowResImageHeight=VTFOptions.LowResImageHeight,Depth=VTFOptions.Depth,ResourceCount=VTFOptions.ResourceCount} = {}){
    super({Version,HeaderSize,Width,Height,FlagArray,Frames,StartFrame,reflectivity,BumpScale,ImageFormat,MipCount,LowResImageFormat,LowResImageWidth,LowResImageHeight,Depth,ResourceCount});
  }
}//       |  -  -  - |       -       |        |   |   |        |   |   |       |          -          -          |       |          |       | |               | | | |       |1 2 3 4|1 2 3 4 5 6 7 8| 1 2 3 4  5 6 7 8|
function getHeader() {
  switch (VTFOptions.version[1]) {
    case 0:
      return new SVTFHeader_70();
      break;
    case 1:
      return new SVTFHeader_71();
      break;
    case 2:
      return new SVTFHeader_72();
      break;
    case 3:
      return new SVTFHeader_73();
      break;
    case 4:
      return new SVTFHeader_74();
      break;
    case 5:
      return new SVTFHeader_75();
  }
}

let ToLuminance = null;
let FromLuminance = null;
let ToBlueScreen = null;
let FromBlueScreen = null;
let ToFP16 = null;
let FromFP16 = null;
const VTFImageFormatInfo = {//tagSVTFImageConvertInfo in https://github.com/badhaloninja/vtfedit/blob/master/VTFLib/VTFFile.cpp
  //[Name, BitsPerPixel, BytesPerPixel, RedBitsPerPixel, GreenBitsPerPixel, BlueBitsPerPixel, AlphaBitsPerPixel, IsCompressed, IsSupported]
   0 : ["RGBA8888"          , 32,  4,  8,  8,  8,  8, [ 0,  1,  2,  3], false,  true, [        null,           null]],        // IMAGE_FORMAT_RGBA8888,
   1 : ["ABGR8888"          , 32,  4,  8,  8,  8,  8, [ 3,  2,  1,  0], false,  true, [        null,           null]],        // IMAGE_FORMAT_ABGR8888,
   2 : ["RGB888"            , 24,  3,  8,  8,  8,  0, [ 0,  1,  2, -1], false,  true, [        null,           null]],        // IMAGE_FORMAT_RGB888,
   3 : ["BGR888"            , 24,  3,  8,  8,  8,  0, [ 2,  1,  0, -1], false,  true, [        null,           null]],        // IMAGE_FORMAT_BGR888,
   4 : ["RGB565"            , 16,  2,  5,  6,  5,  0, [ 0,  1,  2, -1], false,  true, [        null,           null]],        // IMAGE_FORMAT_RGB565,
   5 : ["I8"                ,  8,  1,  0,  0,  0,  0, [ 0, -1, -1, -1], false, false, [ ToLuminance,  FromLuminance]],        // IMAGE_FORMAT_I8,
   6 : ["IA88"              , 16,  2,  0,  0,  0,  8, [ 0, -1, -1,  1], false, false, [ ToLuminance,  FromLuminance]],        // IMAGE_FORMAT_IA88
   7 : ["P8"                ,  8,  1,  0,  0,  0,  0, [-1, -1, -1, -1], false, false, [        null,           null]],        // IMAGE_FORMAT_P8
   8 : ["A8"                ,  8,  1,  0,  0,  0,  8, [-1, -1, -1,  0], false, false, [        null,           null]],        // IMAGE_FORMAT_A8
   9 : ["RGB888 Bluescreen" , 24,  3,  8,  8,  8,  0, [ 0,  1,  2, -1], false, false, [ToBlueScreen, FromBlueScreen]],        // IMAGE_FORMAT_RGB888_BLUESCREEN
  10 : ["BGR888 Bluescreen" , 24,  3,  8,  8,  8,  0, [ 2,  1,  0, -1], false, false, [ToBlueScreen, FromBlueScreen]],        // IMAGE_FORMAT_BGR888_BLUESCREEN
  11 : ["ARGB8888"          , 32,  4,  8,  8,  8,  8, [ 3,  0,  1,  2], false,  true, [        null,           null]],        // IMAGE_FORMAT_ARGB8888
  12 : ["BGRA8888"          , 32,  4,  8,  8,  8,  8, [ 2,  1,  0,  3], false,  true, [        null,           null]],        // IMAGE_FORMAT_BGRA8888
  13 : ["DXT1"              ,  4,  0,  0,  0,  0,  0, [-1, -1, -1, -1],  true,  true, [        null,           null]],        // IMAGE_FORMAT_DXT1
  14 : ["DXT3"              ,  8,  0,  0,  0,  0,  8, [-1, -1, -1, -1],  true, false, [        null,           null]],        // IMAGE_FORMAT_DXT3
  15 : ["DXT5"              ,  8,  0,  0,  0,  0,  8, [-1, -1, -1, -1],  true,  true, [        null,           null]],        // IMAGE_FORMAT_DXT5
  16 : ["BGRX8888"          , 32,  4,  8,  8,  8,  0, [ 2,  1,  0, -1], false, false, [        null,           null]],        // IMAGE_FORMAT_BGRX8888
  17 : ["BGR565"            , 16,  2,  5,  6,  5,  0, [ 2,  1,  0, -1], false, false, [        null,           null]],        // IMAGE_FORMAT_BGR565
  18 : ["BGRX5551"          , 16,  2,  5,  5,  5,  0, [ 2,  1,  0, -1], false, false, [        null,           null]],        // IMAGE_FORMAT_BGRX5551
  19 : ["BGRA4444"          , 16,  2,  4,  4,  4,  4, [ 2,  1,  0,  3], false,  true, [        null,           null]],        // IMAGE_FORMAT_BGRA4444
  20 : ["DXT1 One Bit Alpha",  4,  0,  0,  0,  0,  1, [-1, -1, -1, -1],  true, false, [        null,           null]],        // IMAGE_FORMAT_DXT1_ONEBITALPHA
  21 : ["BGRA5551"          , 16,  2,  5,  5,  5,  1, [ 2,  1,  0,  3], false,  true, [        null,           null]],        // IMAGE_FORMAT_BGRA5551
  22 : ["UV88"              , 16,  2,  8,  8,  0,  0, [ 0,  1, -1, -1], false, false, [        null,           null]],        // IMAGE_FORMAT_UV88
  23 : ["UVWQ8888"          , 32,  4,  8,  8,  8,  8, [ 0,  1,  2,  3], false, false, [        null,           null]],        // IMAGE_FORMAT_UVWQ8899
  24 : ["RGBA16161616F"     , 64,  8, 16, 16, 16, 16, [ 0,  1,  2,  3], false, false, [      ToFP16,       FromFP16]],        // IMAGE_FORMAT_RGBA16161616F
  25 : ["RGBA16161616"      , 64,  8, 16, 16, 16, 16, [ 0,  1,  2,  3], false, false, [        null,           null]],        // IMAGE_FORMAT_RGBA16161616
  26 : ["UVLX8888"          , 32,  4,  8,  8,  8,  8, [ 0,  1,  2,  3], false, false, [        null,           null]],        // IMAGE_FORMAT_UVLX8888
  get Supported(){
    var tmp=[]
    Object.values(VTFImageFormatInfo).forEach(function(entry,i){
      entry[9] ? tmp.push(i) : null;
    })
    return tmp
  },
  getInfo(format=VTFOptions.ImageFormat) {
    var info=this[format]
    if (!(parseInt(Number(format)) == format) && !parseInt(format, 10)) {
        info=this[VTFImageFormats[format]];
    }
    var tmp={
      Name:info[0], 
      BitsPerPixel:info[1], 
      BytesPerPixel:info[2], 
      RedBitsPerPixel:info[3], 
      GreenBitsPerPixel:info[4], 
      BlueBitsPerPixel:info[5], 
      AlphaBitsPerPixel:info[6], 
      RGBAIndex:info[7], 
      IsCompressed:info[8], 
      IsSupported:info[9], 
      TransformProc:info[10]
    }
    return tmp
  }
};
Object.defineProperty(VTFImageFormatInfo, 'Supported', {
  enumerable: false
});
Object.defineProperty(VTFImageFormatInfo, 'Info', {
  enumerable: false
});
// Testing variables
var foo = [86,84,70,0,7,0,0,0,3,0,0,0,88,0,0,0,2,0,2,0,0,35,0,0,1,0,0,0,0,0,0,0,0,0,128,63,0,0,128,63,0,0,128,63,0,0,0,0,0,0,128,63,0,0,0,0,1,255,255,255,255,0,0,1,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,48,0,0,0,88,0,0,0,255,0,0,255,0,255,0,255,0,0,255,255,0,0,0,0];
var bar = [86,84,70,0,7,0,0,0,2,0,0,0,80,0,0,0,2,0,2,0,0,35,0,0,1,0,0,0,0,0,0,0,0,0,128,63,0,0,128,63,0,0,128,63,0,0,0,0,0,0,128,63,0,0,0,0,1,255,255,255,255,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,255,0,0,255,0,255,0,255,0,0,255,255,0,0,0,0];
var baz = [86,84,70,0,7,0,0,0,1,0,0,0,64,0,0,0,2,0,2,0,0,35,0,0,1,0,0,0,0,0,0,0,0,0,128,63,0,0,128,63,0,0,128,63,0,0,0,0,0,0,128,63,0,0,0,0,1,255,255,255,255,0,0,1,255,0,0,255,0,255,0,255,0,0,255,255,0,0,0,0];
var qux = [86,84,70,0,7,0,0,0,3,0,0,0,96,0,0,0,2,0,2,0,0,35,0,0,1,0,0,0,0,0,0,0,0,0,128,63,0,0,128,63,0,0,128,63,0,0,0,0,0,0,128,63,0,0,0,0,1,255,255,255,255,0,0,1,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,48,0,0,0,96,0,0,0,75,86,68,0,112,0,0,0,255,0,0,255,0,255,0,255,0,0,255,255,0,0,0,0,38,0,0,0,34,73,110,102,111,114,109,97,116,105,111,110,34,13,10,123,13,10,9,34,65,117,116,104,111,114,34,32,34,98,104,110,34,13,10,125,13,10];

var content = {
      0:"[86,84,70,0,7,0,0,0,1,0,0,0,64,0,0,0,2,0,2,0,120,35,0,0,1,0,0,0,0,0,0,0,0,0,128,63,0,0,128,63,0,0,128,63,0,0,0,0,0,0,128,63,0,0,0,0,1,255,255,255,255,0,0,1,255,0,0,255,0,255,0,255,0,0,255,255,0,0,0,0]",
      2:"[86,84,70,0,7,0,0,0,1,0,0,0,64,0,0,0,2,0,2,0,120,3,0,0,1,0,0,0,0,0,0,0,0,0,128,63,0,0,128,63,0,0,128,63,0,0,0,0,0,0,128,63,2,0,0,0,1,255,255,255,255,0,0,1,255,0,0,0,255,0,0,0,255,0,0,0]",
     12:"[86,84,70,0,7,0,0,0,1,0,0,0,64,0,0,0,2,0,2,0,120,35,0,0,1,0,0,0,0,0,0,0,0,0,128,63,0,0,128,63,0,0,128,63,0,0,0,0,0,0,128,63,12,0,0,0,1,255,255,255,255,0,0,1,0,0,255,255,0,255,0,255,255,0,0,255,0,0,0,0]",
     17:"[86,84,70,0,7,0,0,0,1,0,0,0,64,0,0,0,2,0,2,0,120,3,0,0,1,0,0,0,0,0,0,0,0,0,128,63,0,0,128,63,0,0,128,63,0,0,0,0,0,0,128,63,17,0,0,0,1,255,255,255,255,0,0,1,0,248,224,7,31,0,0,0];"
  };
// End of testing variables

module.exports.VTFImageFormats = VTFImageFormats;
module.exports.VTFImageFormatInfo = VTFImageFormatInfo;
module.exports.TextureFlags = TextureFlags;


module.exports.VTFConst = VTFConst;
module.exports.VTFOptions = VTFOptions;


module.exports.getHeader = getHeader;

module.exports.SVTFFileHeader = SVTFFileHeader;
module.exports.SVTFHeader_70 = SVTFHeader_70;
module.exports.SVTFHeader_71 = SVTFHeader_71;
module.exports.SVTFHeader_72 = SVTFHeader_72;
module.exports.SVTFHeader_73 = SVTFHeader_73;
module.exports.SVTFHeader_74 = SVTFHeader_74;
module.exports.SVTFHeader_75 = SVTFHeader_75;

module.exports.content = content;

/*var buffer = new ArrayBuffer(24);

// ... read the data into the buffer ...

var idView = new Uint32Array(buffer, 0, 1);
var usernameView = new Uint8Array(buffer, 4, 16);
var amountDueView = new Float32Array(buffer, 20, 1);*/

/*
if(entry in TextureFlags){
console.log(entry+" exists")
}else{
console.log(entry+" missing")
}

*/
/* char        signature[4];        // File signature ("VTF\0"). (or as little-endian integer, 0x00465456)
    // unsigned int    version[2];        // version[0].version[1] (currently 7.2).
    // unsigned int    headerSize;        // Size of the header struct  (16 byte aligned; currently 80 bytes) + size of the resources dictionary (7.3+).
    // unsigned short    width;            // Width of the largest mipmap in pixels. Must be a power of 2.
    // unsigned short    height;            // Height of the largest mipmap in pixels. Must be a power of 2.
    // unsigned int    flags;            // VTF flags.
    // unsigned short    frames;            // Number of frames, if animated (1 for no animation).
    // unsigned short    firstFrame;        // First frame in animation (0 based).
    // unsigned char    padding0[4];        // reflectivity padding (16 byte alignment).
    // float        reflectivity[3];    // reflectivity vector.
    // unsigned char    padding1[4];        // reflectivity padding (8 byte packing).
    // float        bumpmapScale;        // Bumpmap scale.
    // unsigned int    highResImageFormat;    // High resolution image format.
    // unsigned char    mipmapCount;        // Number of mipmaps.
    // unsigned int    lowResImageFormat;    // Low resolution image format (always DXT1).
    // unsigned char    lowResImageWidth;    // Low resolution image width.
// unsigned char    lowResImageHeight;    // Low resolution image height.*/
/*#define VTF_MAJOR_VERSION					7		//!< VTF major version number
#define VTF_MINOR_VERSION					5		//!< VTF minor version number
#define VTF_MINOR_VERSION_DEFAULT			3

#define VTF_MINOR_VERSION_MIN_SPHERE_MAP	1
#define VTF_MINOR_VERSION_MIN_VOLUME		2
#define VTF_MINOR_VERSION_MIN_RESOURCE		3
#define VTF_MINOR_VERSION_MIN_NO_SPHERE_MAP	5*/
/*
this->Header = new SVTFHeader;
    memset(this->Header, 0, sizeof(SVTFHeader));

    strcpy(this->Header->TypeString, "VTF");
    this->Header->Version[0] = VTF_MAJOR_VERSION;
    this->Header->Version[1] = VTF_MINOR_VERSION_DEFAULT;
    this->Header->HeaderSize = 0;
    this->Header->Width = (vlShort)uiWidth;
    this->Header->Height = (vlShort)uiHeight;
    this->Header->Flags = (this->GetImageFormatInfo(ImageFormat).uiAlphaBitsPerPixel == 1 ? TEXTUREFLAGS_ONEBITALPHA : 0)
                            | (this->GetImageFormatInfo(ImageFormat).uiAlphaBitsPerPixel > 1 ? TEXTUREFLAGS_EIGHTBITALPHA : 0)
                            | (uiFaces == 1 ? 0 : TEXTUREFLAGS_ENVMAP)
                            | (bMipmaps ? 0 : TEXTUREFLAGS_NOMIP | TEXTUREFLAGS_NOLOD);
    this->Header->Frames = (vlShort)uiFrames;
    this->Header->StartFrame = uiFaces != 6 || VTF_MINOR_VERSION_DEFAULT >= VTF_MINOR_VERSION_MIN_NO_SPHERE_MAP ? 0 : 0xffff;
    this->Header->Reflectivity[0] = 1.0f;
    this->Header->Reflectivity[1] = 1.0f;
    this->Header->Reflectivity[2] = 1.0f;
    this->Header->BumpScale = 1.0f;
    this->Header->ImageFormat = ImageFormat;
    this->Header->MipCount = bMipmaps ? (vlByte)this->ComputeMipmapCount(uiWidth, uiHeight, uiSlices) : 1;
    this->Header->Depth = (vlShort)uiSlices;
    this->Header->ResourceCount = 0;

    //
    // Generate thumbnail.
    //

    if(bThumbnail)
    {
        // Note: Valve informs us that DXT1 is the correct format.

        //  The format DXT1 was observed in almost every official .vtf file.
        this->Header->LowResImageFormat = IMAGE_FORMAT_DXT1;

        // Note: Valve informs us that the below is the right dimensions.

        // Find a thumbnail width and height (the first width and height <= 16 pixels).
        // The value 16 was observed in almost every official .vtf file.

        vlUInt uiThumbnailWidth = this->Header->Width, uiThumbnailHeight = this->Header->Height;

        while(vlTrue)
        {
            if(uiThumbnailWidth <= 16 && uiThumbnailHeight <= 16)
            {
                break;
           ]

            uiThumbnailWidth >>= 1;
            uiThumbnailHeight >>= 1;

            if(uiThumbnailWidth < 1)
                uiThumbnailWidth = 1;

            if(uiThumbnailHeight < 1)
                uiThumbnailHeight = 1;
       ]

        this->Header->LowResImageWidth = (vlByte)uiThumbnailWidth;
        this->Header->LowResImageHeight = (vlByte)uiThumbnailHeight;

        this->uiThumbnailBufferSize = this->ComputeImageSize(this->Header->LowResImageWidth, this->Header->LowResImageHeight, 1, this->Header->LowResImageFormat);
        this->lpThumbnailImageData = new vlByte[this->uiThumbnailBufferSize];

        this->Header->Resources[this->Header->ResourceCount++].Type = VTF_LEGACY_RSRC_LOW_RES_IMAGE;
   ]
    else
    {
        this->Header->LowResImageFormat = IMAGE_FORMAT_NONE;
        this->Header->LowResImageWidth = 0;
        this->Header->LowResImageHeight = 0;

        this->uiThumbnailBufferSize = 0;
        this->lpThumbnailImageData = 0;

*/



/*
typedef struct tagSVTFImageConvertInfo
{
	vlUInt	uiBitsPerPixel;			// Format bytes per pixel.
	vlUInt	uiBytesPerPixel;		// Format bytes per pixel.
	vlUInt	uiRBitsPerPixel;		// Format conversion red bits per pixel.  0 for N/A.
	vlUInt	uiGBitsPerPixel;		// Format conversion green bits per pixel.  0 for N/A.
	vlUInt	uiBBitsPerPixel;		// Format conversion blue bits per pixel.  0 for N/A.
	vlUInt	uiABitsPerPixel;		// Format conversion alpha bits per pixel.  0 for N/A.
	vlInt	iR;						// "Red" index.
	vlInt	iG;						// "Green" index.
	vlInt	iB;						// "Blue" index.
	vlInt	iA;						// "Alpha" index.
	vlBool	bIsCompressed;			// Format is compressed (DXT).
	vlBool	bIsSupported;			// Format is supported by VTFLib.
	TransformProc pToTransform;		// Custom transform to function.
	TransformProc pFromTransform;	// Custom transform from function.
	VTFImageFormat Format;
} SVTFImageConvertInfo;

static SVTFImageConvertInfo VTFImageConvertInfo[] =
<<<<<<< HEAD
{ 
	*/
//[255, 0, 0, 255, 0, 255, 0, 255, 0, 0, 255, 255, 0, 0, 0, 0] 



/*
function objLength(obj){
  var out=0;
  var type="";
  var array=new Uint8Array();
 Object.keys(obj).forEach(function(entry) {
   if (entry == "getLength") {return}
   type = Object.prototype.toString.call(obj[entry]);
   if (type == "[object Array]"){
   out += objLength(obj[entry])[0];
   array = mergeTypedArrays(array,objLength(obj[entry])[1]);
  } else if (type == "[object Uint8Array]" || type == "[object Uint16Array]" || type == "[object Uint32Array]") {
     out += obj[entry].length;
     array = mergeTypedArrays(array,obj[entry]);

  } else {
     console.log("Unknown: "+type+"\nValue: "+obj[entry]);
  }
 });
 return [out,array];
}
function mergeTypedArrays(a, b) {
    var c = new a.constructor(a.length + b.length);
    c.set(a);
    c.set(b, a.length);

    return c;
}*/
/*let SVTFFileHeader = {
    Signature: char("VTF\0"),                  //!< "Magic number" identifier- "VTF\0".
    Version: [uint(7),uint(2)],                    //!< Version[0].version[1] (currently 7.2)
    HeaderSize: uint(64)                     //!< Size of the header struct (currently 80 bytes)
};*/
/*
let SVTFHeader_70 : public SVTFFileHeader
{
    vlUShort        Width;                          //!< Width of the largest image
    vlUShort        Height;                         //!< Height of the largest image
    vlUInt          Flags;                          //!< Flags for the image
    vlUShort        Frames;                         //!< Number of frames if animated (1 for no animation)
    vlUShort        StartFrame;                     //!< Start frame (always 0)
    vlByte          Padding0[4];                    //!< Reflectivity padding (16 byte alignment)
    vlSingle        Reflectivity[3];                //!< Reflectivity vector
    vlByte          Padding1[4];                    //!< Reflectivity padding (8 byte packing)
    vlSingle        BumpScale;                      //!< Bump map scale
    VTFImageFormat  ImageFormat;                    //!< Image format index
    vlByte          MipCount;                       //!< Number of MIP levels (including the largest image)
    VTFImageFormat  LowResImageFormat;              //!< Image format of the thumbnail image
    vlByte          LowResImageWidth;               //!< Thumbnail image width
    vlByte          LowResImageHeight;              //!< Thumbnail image height
};*/



// function concatTypedArrays(a, b) { // a, b TypedArray of same type
//     var c = new (a.constructor)(a.length + b.length);
//     c.set(a, 0);
//     c.set(b, a.length);
//     return c;
//]
//this.lowResImageFormat

//[86,84,70,0,version[0],0,0,0,version[1],0,0,0,64,0,0,0,0,0,0,0,12 + sampling,flags,0,0,1,0,0,0 ,0,0,0,0 ,0,0,128,63 ,0,0,128,63 ,0,0,128,63 ,0,0,0,0 ,0,0,128,63,outputType,0,0,0,1,255,255,255,255,0,0,1];
// signature[4],version[8],size[4],width[2],height[2],flags[4],frames[2],firstframe[2],padding[4],
/*
export const VTFHEADER {
    char        signature[4];        // File signature ("VTF\0"). (or as little-endian integer, 0x00465456)
    unsigned int    version[2];        // version[0].version[1] (currently 7.2).
    unsigned int    headerSize;        // Size of the header struct  (16 byte aligned; currently 80 bytes) + size of the resources dictionary (7.3+).
    unsigned short    width;            // Width of the largest mipmap in pixels. Must be a power of 2.
    unsigned short    height;            // Height of the largest mipmap in pixels. Must be a power of 2.
    unsigned int    flags;            // VTF flags.
    unsigned short    frames;            // Number of frames, if animated (1 for no animation).
    unsigned short    firstFrame;        // First frame in animation (0 based).
    unsigned char    padding0[4];        // reflectivity padding (16 byte alignment).
    float        reflectivity[3];    // reflectivity vector.
    unsigned char    padding1[4];        // reflectivity padding (8 byte packing).
    float        bumpmapScale;        // Bumpmap scale.
    unsigned int    highResImageFormat;    // High resolution image format.
    unsigned char    mipmapCount;        // Number of mipmaps.
    unsigned int    lowResImageFormat;    // Low resolution image format (always DXT1).
    unsigned char    lowResImageWidth;    // Low resolution image width.
    unsigned char    lowResImageHeight;    // Low resolution image height.

    // 7.2+
    unsigned short    depth;            // Depth of the largest mipmap in pixels.
                        // Must be a power of 2. Can be 0 or 1 for a 2D texture (v7.2 only).

    // 7.3+
    unsigned char    padding2[3];        // depth padding (4 byte alignment).
    unsigned int    numResources;        // Number of resources this vtf has
}
*/

/*
if(this->GetImageFormatInfo(ImageFormat).uiAlphaBitsPerPixel == 1)
		{
			this->Header->Flags |= TEXTUREFLAGS_ONEBITALPHA;
		}
		else
		{
			this->Header->Flags &= ~TEXTUREFLAGS_ONEBITALPHA;
		}

		if(this->GetImageFormatInfo(ImageFormat).uiAlphaBitsPerPixel > 1)
		{
			this->Header->Flags |= TEXTUREFLAGS_EIGHTBITALPHA;
		}
		else
		{
			this->Header->Flags &= ~TEXTUREFLAGS_EIGHTBITALPHA;
		}
		
		this->GetImageFormatInfo(ImageFormat).uiAlphaBitsPerPixel == 1 ? TEXTUREFLAGS_ONEBITALPHA : 0)
							| (this->GetImageFormatInfo(ImageFormat).uiAlphaBitsPerPixel > 1 ? TEXTUREFLAGS_EIGHTBITALPHA : 0)
							| (uiFaces == 1 ? 0 : TEXTUREFLAGS_ENVMAP)
							| (bMipmaps ? 0 : TEXTUREFLAGS_NOMIP | TEXTUREFLAGS_NOLOD);
							

// SetFlags()
// Sets the flags associated with the image.  These flags
// are stored in the VTFImageFlag enumeration.
//
vlVoid CVTFFile::SetFlags(vlUInt uiFlags)
{
	if(!this->IsLoaded())
		return;

	// Don't let the user set flags critical to the image's format.
	//if(this->Header->Version[0] < VTF_MAJOR_VERSION || (this->Header->Version[0] == VTF_MAJOR_VERSION && this->Header->Version[1] <= VTF_MINOR_VERSION_MIN_RESOURCE))
	//{
	//	if(this->Header->Flags & TEXTUREFLAGS_DEPRECATED_NOCOMPRESS)
	//		uiFlags |= TEXTUREFLAGS_DEPRECATED_NOCOMPRESS;
	//	else
	//		uiFlags &= ~TEXTUREFLAGS_DEPRECATED_NOCOMPRESS;
	//}

	if(this->Header->Flags & TEXTUREFLAGS_EIGHTBITALPHA)
		uiFlags |= TEXTUREFLAGS_EIGHTBITALPHA;
	else
		uiFlags &= ~TEXTUREFLAGS_EIGHTBITALPHA;

	if(this->Header->Flags & TEXTUREFLAGS_ENVMAP)
		uiFlags |= TEXTUREFLAGS_ENVMAP;
	else
		uiFlags &= ~TEXTUREFLAGS_ENVMAP;

	if(this->Header->Flags & TEXTUREFLAGS_ENVMAP)
		uiFlags |= TEXTUREFLAGS_ENVMAP;
	else
		uiFlags &= ~TEXTUREFLAGS_ENVMAP;

	this->Header->Flags = uiFlags;
}


//
// SetFlag()
// Sets the flag ImageFlag to State (set or not set).  Flags critical
// to the image's format cannot be set.
//
function SetFlag(ImageFlag, State)
{
	// Don't let the user set flags critical to the image's format.
	if(ImageFlag == TEXTUREFLAGS_ONEBITALPHA || ImageFlag == TEXTUREFLAGS_EIGHTBITALPHA || ImageFlag == TEXTUREFLAGS_ENVMAP)
	{
		return;
	}

	if(State)
	{
		this->Header->Flags |= ImageFlag;
	}
	else
	{
		this->Header->Flags &= ~ImageFlag;
	}
}

*/
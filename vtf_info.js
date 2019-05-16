// module "vtf_info.js"
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
    POINTSAMPLE                                : 0x00000001,
    TRILINEAR                                  : 0x00000002,
    CLAMPS                                     : 0x00000004,
    CLAMPT                                     : 0x00000008,
    ANISOTROPIC                                : 0x00000010,
    HINT_DXT5                                  : 0x00000020,
    SRGB                                       : 0x00000040, // Originally internal to VTex as NOCOMPRESS.
    DEPRECATED_NOCOMPRESS                      : 0x00000040,
    NORMAL                                     : 0x00000080,
    NOMIP                                      : 0x00000100,
    NOLOD                                      : 0x00000200,
    MINMIP                                     : 0x00000400,
    PROCEDURAL                                 : 0x00000800,
    ONEBITALPHA                                : 0x00001000, //!< Automatically generated by VTex.
    EIGHTBITALPHA                              : 0x00002000, //!< Automatically generated by VTex.
    ENVMAP                                     : 0x00004000,
    RENDERTARGET                               : 0x00008000,
    DEPTHRENDERTARGET                          : 0x00010000,
    NODEBUGOVERRIDE                            : 0x00020000,
    SINGLECOPY                                 : 0x00040000,
    UNUSED0                                    : 0x00080000, //!< Originally internal to VTex as ONEOVERMIPLEVELINALPHA.
    DEPRECATED_ONEOVERMIPLEVELINALPHA          : 0x00080000,
    UNUSED1                                    : 0x00100000, //!< Originally internal to VTex as PREMULTCOLORBYONEOVERMIPLEVEL.
    DEPRECATED_PREMULTCOLORBYONEOVERMIPLEVEL   : 0x00100000,
    UNUSED2                                    : 0x00200000, //!< Originally internal to VTex as NORMALTODUDV.
    DEPRECATED_NORMALTODUDV                    : 0x00200000,
    UNUSED3                                    : 0x00400000, //!< Originally internal to VTex as ALPHATESTMIPGENERATION.
    DEPRECATED_ALPHATESTMIPGENERATION          : 0x00400000,
    NODEPTHBUFFER                              : 0x00800000,
    UNUSED4                                    : 0x01000000, //!< Originally internal to VTex as NICEFILTERED.
    DEPRECATED_NICEFILTERED                    : 0x01000000,
    CLAMPU                                     : 0x02000000,
    VERTEXTEXTURE                              : 0x04000000,
    SSBUMP                                     : 0x08000000,
    UNUSED5                                    : 0x10000000, //!< Originally UNFILTERABLE_OK.
    DEPRECATED_UNFILTERABLE_OK                 : 0x10000000,
    BORDER                                     : 0x20000000,
    TEXTUREFLAGS_DEPRECATED_SPECVAR_RED        : 0x40000000,
    TEXTUREFLAGS_DEPRECATED_SPECVAR_ALPHA      : 0x80000000,
    TEXTUREFLAGS_LAST                          : 0x20000000,
    TEXTUREFLAGS_COUNT                         : 30,
    getflags: function() {
        var tmp=0
        VTFOptions.selectedFlags.forEach(function(entry) {
          tmp = (parseInt(tmp, 16) + TextureFlags[entry]).toString(16);
          while (tmp.length < 8) { tmp = '0' + tmp;} // Zero pad.
       });
        return fromHexString(tmp.toString()).reverse(); //.toString()
   }
    // key: function(n){return this[Object.keys(this)[n]]}
};
Object.defineProperty(TextureFlags, 'getflags', {
  enumerable: false
});
const VTFEnabledFlags = {
    POINTSAMPLE:"Point Sample",
    TRILINEAR:"Trilinear",
    CLAMPS:"Clamp S",
    CLAMPT:"Clamp T",
    ANISOTROPIC:"Anisotropic",
    HINT_DXT5:"Hint DXT5",
    SRGB:"SRGB",
    NORMAL:"Normal Map",
    NOMIP:"No Mipmap",
    NOLOD:"No Level Of Detail",
    MINMIP:"No Minimum Mipmap",
    PROCEDURAL:"Procedural",
    ONEBITALPHA:"One Bit Alpha (Format Specific)",
    EIGHTBITALPHA:"Eight Bit Alpha (Format Specific)",
    ENVMAP:"Enviroment Map (Format Specific)",
    RENDERTARGET:"Render Target",
    DEPTHRENDERTARGET:"Depth Render Target",
    NODEBUGOVERRIDE:"No Debug Override",
    SINGLECOPY:"Single Copy",
    UNUSED0:"Unused",
    UNUSED1:"Unused",
    UNUSED2:"Unused",
    UNUSED3:"Unused",
    NODEPTHBUFFER:"No Depth Buffer",
    UNUSED4:"Unused",
    CLAMPU:"Clamp U",
    VERTEXTEXTURE:"Vertex Texture",
    SSBUMP:"SSBump",
    UNUSED5:"Unused",
    BORDER:"Clamp All"
};

let VTFOptions = {
    version: [7,2],
    width: 2,
    height: 2,
    lumaWeights: [0.213,0.715,0.072],//[0.2126,0.7152,0.0722] ITU-R BT.709
    selectedFlags: ["CLAMPT","ANISOTROPIC","HINT_DXT5","SRGB","NOMIP","NOLOD","EIGHTBITALPHA"], //0x00000008, 0x00000010, 0x00000020, 0x00000040, 0x00000100, 0x00000200, 0x00002000
}

const VTFConst = {
    signature: "VTF\0",
    headerSize: "64",
    padding: "00000000",
    reflectivity: "3f800000",
    bumpmapScale: "3f800000"

}

let byte = (value,length=1) => {return new Uint8Array(length).map((_, i) => [value][i])};

let uint = number => (number!=-1)?(new Uint8Array({0:number>>>0,length:4})):(new Uint8Array([255,255,255,255]));

let short = number => new Uint8Array([number & 0xFF,(number >>> 8) & 0xff]);

function char(s){//uint8array
var escstr = encodeURIComponent(s);
    var binstr = escstr.replace(/%([0-9A-F]{2})/g, function(match, p1) {
        return String.fromCharCode('0x' + p1);
   });
    var ua = new Uint8Array(binstr.length);
    Array.prototype.forEach.call(binstr, function (ch, i) {
        ua[i] = ch.charCodeAt(0);
   });
    return ua;
}

function float(floatnum) {
const getHex = i => ('00' + i.toString(16)).slice(-2);
var view = new DataView(new ArrayBuffer(4)),
    result;
view.setFloat32(0, floatnum);
result = Array
    .apply(null, { length: 4})
    .map((_, i) => getHex(view.getUint8(i)))
    .join('');
return fromHexString(result).reverse();
};

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
    // char        signature[4];        // File signature ("VTF\0"). (or as little-endian integer, 0x00465456)
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
    // unsigned char    lowResImageHeight;    // Low resolution image height.
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
class SVTFFileHeader {
    constructor({Version=[7,1],HeaderSize=64} = {}) {
      this.signature = char("VTF\0");
      this.Version = [uint(Version[0]),uint(Version[1])];
      this.HeaderSize = uint(HeaderSize);
 }
 getArray() {
  var array=new Uint8Array
   Object.keys(this).forEach(function(entry) {
   if (entry == "getArray") {return}
   type = Object.prototype.toString.call(this[entry])
   if (type == "[object Array]"){
   array = mergeTypedArrays(array,getArray(this[entry]))
  } else if (type == "[object Uint8Array]" || type == "[object Uint16Array]" || type == "[object Uint32Array]") {
     array = mergeTypedArrays(array,this[entry])

  } else {
     console.log("Unknown: "+type+"\nValue: "+this[entry])
  }
 })
 return array
}
};
class SVTFHeader_70 extends SVTFFileHeader {
    constructor({Version=[7,1],HeaderSize=64,Width=2048,Height=2048,FlagArray=[120,35,0,0],Frames=1,StartFrame=0,reflectivity=[1.0,1.0,1.0],BumpScale=1.0,ImageFormat=0,MipCount=1,LowResImageFormat=-1,LowResImageWidth=0,lowResImageHeight=0} = {}){
      super({Version,HeaderSize});
      this.Width = short(Width);
      this.Height = short(Height);
      this.FlagArray = FlagArray;
      this.Frames = short(Frames);
      this.StartFrame = short(StartFrame);
      this.padding0 = byte(0,4);
      this.reflectivity = [float(reflectivity[0]),float(reflectivity[1]),float(reflectivity[2])];
      this.padding1 = byte(0,4);
      this.BumpScale = float(BumpScale);
      this.ImageFormat = uint(ImageFormat);
      this.MipCount = byte(MipCount);
      this.LowResImageFormat = uint(LowResImageFormat);
      this.LowResImageWidth = byte(LowResImageWidth);
      this.lowResImageHeight = byte(lowResImageHeight);
 }
 getArray() {
    super.getArray();
  }
 
};//https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/Inheritance

class SVTFHeader_71 extends SVTFHeader_70 {
    constructor({Version=[7,1],HeaderSize=64,Width=2048,Height=2048,FlagArray=[120,35,0,0],Frames=1,StartFrame=0,reflectivity=[1.0,1.0,1.0],BumpScale=1.0,ImageFormat=0,MipCount=1,LowResImageFormat=-1,LowResImageWidth=0,lowResImageHeight=0} = {}){
      super({Version,HeaderSize,Width,Height,FlagArray,Frames,StartFrame,reflectivity,BumpScale,ImageFormat,MipCount,LowResImageFormat,LowResImageWidth,lowResImageHeight});
  }
 getArray() {
    super.getArray();
  }
};

class SVTFHeader_72 extends SVTFHeader_71 {
    constructor({Version=[7,1],HeaderSize=64,Width=2048,Height=2048,FlagArray=[120,35,0,0],Frames=1,StartFrame=0,reflectivity=[1.0,1.0,1.0],BumpScale=1.0,ImageFormat=0,MipCount=1,LowResImageFormat=-1,LowResImageWidth=0,lowResImageHeight=0,Depth=1} = {}){
      super({Version,HeaderSize,Width,Height,FlagArray,Frames,StartFrame,reflectivity,BumpScale,ImageFormat,MipCount,LowResImageFormat,LowResImageWidth,lowResImageHeight});
      this.Depth = byte(Depth);                          //!< Depth of the largest image
  }
 getArray() {
    super.getArray();
  }
};

class SVTFHeader_73 extends SVTFHeader_72 {
    constructor({Version=[7,1],HeaderSize=64,Width=2048,Height=2048,FlagArray=[120,35,0,0],Frames=1,StartFrame=0,reflectivity=[1.0,1.0,1.0],BumpScale=1.0,ImageFormat=0,MipCount=1,LowResImageFormat=-1,LowResImageWidth=0,lowResImageHeight=0,Depth=1,ResourceCount=0} = {}){
      super({Version,HeaderSize,Width,Height,FlagArray,Frames,StartFrame,reflectivity,BumpScale,ImageFormat,MipCount,LowResImageFormat,LowResImageWidth,lowResImageHeight,Depth});
      this.padding2 = byte(0,3);
      this.ResourceCount = uint(ResourceCount);                          //!< Number of image resources
   }
 getArray() {
    super.getArray();
  }
};

class SVTFHeader_74 extends SVTFHeader_73 {
    constructor({Version=[7,1],HeaderSize=64,Width=2048,Height=2048,FlagArray=[120,35,0,0],Frames=1,StartFrame=0,reflectivity=[1.0,1.0,1.0],BumpScale=1.0,ImageFormat=0,MipCount=1,LowResImageFormat=-1,LowResImageWidth=0,lowResImageHeight=0,Depth=1,ResourceCount=0} = {}){
      super({Version,HeaderSize,Width,Height,FlagArray,Frames,StartFrame,reflectivity,BumpScale,ImageFormat,MipCount,LowResImageFormat,LowResImageWidth,lowResImageHeight,Depth,ResourceCount});
  }
 getArray() {
    super.getArray();
  }
};

class SVTFHeader_75 extends SVTFHeader_74 {
    constructor({Version=[7,1],HeaderSize=64,Width=2048,Height=2048,FlagArray=[120,35,0,0],Frames=1,StartFrame=0,reflectivity=[1.0,1.0,1.0],BumpScale=1.0,ImageFormat=0,MipCount=1,LowResImageFormat=-1,LowResImageWidth=0,lowResImageHeight=0,Depth=1,ResourceCount=0} = {}){
      super({Version,HeaderSize,Width,Height,FlagArray,Frames,StartFrame,reflectivity,BumpScale,ImageFormat,MipCount,LowResImageFormat,LowResImageWidth,lowResImageHeight,Depth,ResourceCount});
  }
 getArray() {
    super.getArray();
  }
};

function objLength(obj){
  var out=0
  var type=""
  var array=new Uint8Array
 Object.keys(obj).forEach(function(entry) {
   if (entry == "getLength") {return}
   type = Object.prototype.toString.call(obj[entry])
   if (type == "[object Array]"){
   out += objLength(obj[entry])[0]
   array = mergeTypedArrays(array,objLength(obj[entry])[1])
  } else if (type == "[object Uint8Array]" || type == "[object Uint16Array]" || type == "[object Uint32Array]") {
     out += obj[entry].length
     array = mergeTypedArrays(array,obj[entry])

  } else {
     console.log("Unknown: "+type+"\nValue: "+obj[entry])
  }
 })
 return [out,array]
}
function mergeTypedArrays(a, b) {
    var c = new a.constructor(a.length + b.length);
    c.set(a);
    c.set(b, a.length);

    return c;
}

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

const VTFImageFormatInfo = //[Name, BitsPerPixel, BytesPerPixel, RedBitsPerPixel, GreenBitsPerPixel, BlueBitsPerPixel, AlphaBitsPerPixel, IsCompressed, IsSupported]
{
     0 : ["RGBA8888"          , 32,  4,  8,  8,  8,  8, false,  true],        // IMAGE_FORMAT_RGBA8888,
     1 : ["ABGR8888"          , 32,  4,  8,  8,  8,  8, false, false],        // IMAGE_FORMAT_ABGR8888, 
     2 : ["RGB888"            , 24,  3,  8,  8,  8,  0, false,  true],        // IMAGE_FORMAT_RGB888,
     3 : ["BGR888"            , 24,  3,  8,  8,  8,  0, false,  true],        // IMAGE_FORMAT_BGR888,
     4 : ["RGB565"            , 16,  2,  5,  6,  5,  0, false,  true],        // IMAGE_FORMAT_RGB565, 
     5 : ["I8"                ,  8,  1,  0,  0,  0,  0, false, false],        // IMAGE_FORMAT_I8,
     6 : ["IA88"              , 16,  2,  0,  0,  0,  8, false, false],        // IMAGE_FORMAT_IA88
     7 : ["P8"                ,  8,  1,  0,  0,  0,  0, false, false],        // IMAGE_FORMAT_P8
     8 : ["A8"                ,  8,  1,  0,  0,  0,  8, false, false],        // IMAGE_FORMAT_A8
     9 : ["RGB888 Bluescreen" , 24,  3,  8,  8,  8,  0, false, false],        // IMAGE_FORMAT_RGB888_BLUESCREEN
    10 : ["BGR888 Bluescreen" , 24,  3,  8,  8,  8,  0, false, false],        // IMAGE_FORMAT_BGR888_BLUESCREEN
    11 : ["ARGB8888"          , 32,  4,  8,  8,  8,  8, false, false],        // IMAGE_FORMAT_ARGB8888
    12 : ["BGRA8888"          , 32,  4,  8,  8,  8,  8, false,  true],        // IMAGE_FORMAT_BGRA8888
    13 : ["DXT1"              ,  4,  0,  0,  0,  0,  0,  true,  true],        // IMAGE_FORMAT_DXT1
    14 : ["DXT3"              ,  8,  0,  0,  0,  0,  8,  true, false],        // IMAGE_FORMAT_DXT3
    15 : ["DXT5"              ,  8,  0,  0,  0,  0,  8,  true,  true],        // IMAGE_FORMAT_DXT5
    16 : ["BGRX8888"          , 32,  4,  8,  8,  8,  0, false, false],        // IMAGE_FORMAT_BGRX8888
    17 : ["BGR565"            , 16,  2,  5,  6,  5,  0, false, false],        // IMAGE_FORMAT_BGR565
    18 : ["BGRX5551"          , 16,  2,  5,  5,  5,  0, false, false],        // IMAGE_FORMAT_BGRX5551
    19 : ["BGRA4444"          , 16,  2,  4,  4,  4,  4, false,  true],        // IMAGE_FORMAT_BGRA4444
    20 : ["DXT1 One Bit Alpha",  4,  0,  0,  0,  0,  1,  true, false],        // IMAGE_FORMAT_DXT1_ONEBITALPHA
    21 : ["BGRA5551"          , 16,  2,  5,  5,  5,  1, false,  true],        // IMAGE_FORMAT_BGRA5551
    22 : ["UV88"              , 16,  2,  8,  8,  0,  0, false, false],        // IMAGE_FORMAT_UV88
    23 : ["UVWQ8888"          , 32,  4,  8,  8,  8,  8, false, false],        // IMAGE_FORMAT_UVWQ8899
    24 : ["RGBA16161616F"     , 64,  8, 16, 16, 16, 16, false, false],        // IMAGE_FORMAT_RGBA16161616F
    25 : ["RGBA16161616"      , 64,  8, 16, 16, 16, 16, false, false],        // IMAGE_FORMAT_RGBA16161616
    26 : ["UVLX8888"          , 32,  4,  8,  8,  8,  8, false, false],        // IMAGE_FORMAT_UVLX8888
    getSupported: function() {
    var tmp=[]
    Object.values(VTFImageFormatInfo).forEach(function(entry,i){
        entry[8] ? tmp.push(i) : null;
      })
    return tmp
    },
    getInfo: function(Format) {
    var info=this[Format]
    var tmp={Name:info[0], BitsPerPixel:info[1], BytesPerPixel:info[2], RedBitsPerPixel:info[3], GreenBitsPerPixel:info[4], BlueBitsPerPixel:info[5], AlphaBitsPerPixel:info[6], IsCompressed:info[7], IsSupported:info[8]}
    return tmp
   }
};
Object.defineProperty(VTFImageFormatInfo, 'getSupported', {
  enumerable: false
});
Object.defineProperty(VTFImageFormatInfo, 'getInfo', {
  enumerable: false
});

/*
typedef struct tagSVTFImageFormatInfo
{
    vlChar *lpName;                    //!< Enumeration text equivalent.
    vlUInt    uiBitsPerPixel;            //!< Format bits per pixel.
    vlUInt    uiBytesPerPixel;        //!< Format bytes per pixel.
    vlUInt    uiRedBitsPerPixel;        //!< Format red bits per pixel.  0 for N/A.
    vlUInt    uiGreenBitsPerPixel;    //!< Format green bits per pixel.  0 for N/A.
    vlUInt    uiBlueBitsPerPixel;        //!< Format blue bits per pixel.  0 for N/A.
    vlUInt    uiAlphaBitsPerPixel;    //!< Format alpha bits per pixel.  0 for N/A.
    vlBool    bIsCompressed;            //!< Format is compressed (DXT).
    vlBool    bIsSupported;            //!< Format is supported by VTFLib.
} SVTFImageFormatInfo;

*/
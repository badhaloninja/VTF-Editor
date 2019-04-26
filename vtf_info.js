// module "vtf_info.js"
export const VTFImageFormats = {
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
    RGBA8888:0,
    ABGR8888:1,
    RGB888:2,
    BGR888:3,
    RGB565:4,
    I8:5,
    IA88:6,
    P8:7,
    A8:8,
    RGB888_BLUESCREEN:9,
    BGR888_BLUESCREEN:10,
    ARGB8888:11,
    BGRA8888:12,
    DXT1:13,
    DXT3:14,
    DXT5:15,
    BGRX8888:16,
    BGR565:17,
    BGRX5551:18,
    BGRA4444:19,
    DXT1_ONEBITALPHA:20,
    BGRA5551:21,
    UV88:22,
    UVWQ8888:23,
    RGBA16161616F:24,
    RGBA16161616:25,
    UVLX8888:26
};

export const ImageFormatInfo = {
    NONE: {},

    RGBA8888:{
        supported: true,
        total_bits: 32
    },
    ABGR8888:{
        supported: false,
        total_bits: 32
    },
    RGB888:{
        supported: true,
        total_bits: 24
    },
    BGR888:{
        supported: true,
        total_bits: 24
    },
    RGB565:{
        supported: true,
        total_bits: 16
    },
    I8:{
        supported: false,
        total_bits: 8
    },
    IA88:{
        supported: false,
        total_bits: 16
    },
    P8:{
        supported: false,
        total_bits: 8
    },
    A8:{
        supported: false,
        total_bits: 8
    },
    RGB888_BLUESCREEN:{
        supported: false,
        total_bits: 24
    },
    BGR888_BLUESCREEN:{
        supported: false,
        total_bits: 24
    },
    ARGB8888:{
        supported: false,
        total_bits: 32
    },
    BGRA8888:{
        supported: true,
        total_bits: 32
    },
    DXT1:{
        supported: true,
        total_bits: 4
    },
    DXT3:{
        supported: false,
        total_bits: 8
    },
    DXT5:{
        supported: true,
        total_bits: 8
    },
    BGRX8888:{
        supported: false,
        total_bits: 32
    },
    BGR565:{
        supported: false,
        total_bits: 16
    },
    BGRX5551:{
        supported: false,
        total_bits: 16
    },
    BGRA4444:{
        supported: true,
        total_bits: 16
    },
    DXT1_ONEBITALPHA:{
        supported: false,
        total_bits: 4
    },
    BGRA5551:{
        supported: true,
        total_bits: 16
    },
    UV88:{
        supported: false,
        total_bits: 16
    },
    UVWQ8888:{
        supported: false,
        total_bits: 32
    },
    RGBA16161616F:{
        supported: false,
        total_bits: 64
    },
    RGBA16161616:{
        supported: false,
        total_bits: 64
    },
    UVLX8888:{
        supported: false,
        total_bits: 32
    }
};


export const TextureFlags = {
    POINTSAMPLE                                = 0x00000001,
    TRILINEAR                                  = 0x00000002,
    CLAMPS                                     = 0x00000004,
    CLAMPT                                     = 0x00000008,
    ANISOTROPIC                                = 0x00000010,
    HINT_DXT5                                  = 0x00000020,
    SRGB                                       = 0x00000040, // Originally internal to VTex as NOCOMPRESS.
    DEPRECATED_NOCOMPRESS                      = 0x00000040,
    NORMAL                                     = 0x00000080,
    NOMIP                                      = 0x00000100,
    NOLOD                                      = 0x00000200,
    MINMIP                                     = 0x00000400,
    PROCEDURAL                                 = 0x00000800,
    ONEBITALPHA                                = 0x00001000, //!< Automatically generated by VTex.
    EIGHTBITALPHA                              = 0x00002000, //!< Automatically generated by VTex.
    ENVMAP                                     = 0x00004000,
    RENDERTARGET                               = 0x00008000,
    DEPTHRENDERTARGET                          = 0x00010000,
    NODEBUGOVERRIDE                            = 0x00020000,
    SINGLECOPY                                 = 0x00040000,
    UNUSED0                                    = 0x00080000, //!< Originally internal to VTex as ONEOVERMIPLEVELINALPHA.
    DEPRECATED_ONEOVERMIPLEVELINALPHA          = 0x00080000,
    UNUSED1                                    = 0x00100000, //!< Originally internal to VTex as PREMULTCOLORBYONEOVERMIPLEVEL.
    DEPRECATED_PREMULTCOLORBYONEOVERMIPLEVEL   = 0x00100000,
    UNUSED2                                    = 0x00200000, //!< Originally internal to VTex as NORMALTODUDV.
    DEPRECATED_NORMALTODUDV                    = 0x00200000,
    UNUSED3                                    = 0x00400000, //!< Originally internal to VTex as ALPHATESTMIPGENERATION.
    DEPRECATED_ALPHATESTMIPGENERATION          = 0x00400000,
    NODEPTHBUFFER                              = 0x00800000,
    UNUSED4                                    = 0x01000000, //!< Originally internal to VTex as NICEFILTERED.
    DEPRECATED_NICEFILTERED                    = 0x01000000,
    CLAMPU                                     = 0x02000000,
    VERTEXTEXTURE                              = 0x04000000,
    SSBUMP                                     = 0x08000000,
    UNUSED5                                    = 0x10000000, //!< Originally UNFILTERABLE_OK.
    DEPRECATED_UNFILTERABLE_OK                 = 0x10000000,
    BORDER                                     = 0x20000000,
    DEPRECATED_SPECVAR_RED                     = 0x40000000,
    DEPRECATED_SPECVAR_ALPHA                   = 0x80000000,
    LAST                                       = 0x20000000,
    COUNT                                      = 30
};


/*
var exportOptions = {
    resolution:[2,2], //w,h
    hasMipmaps:false,
    colorDifference:0,
    version:[7,1],
    lumaWeights:[0.213,0.715,0.072], //[0.2126,0.7152,0.0722] ITU-R BT.709
    sampling:"16",
    sampling:{
        selected:16,
        point:1, 
        trilinear:2,
        anisotropic:16
    }
    outputType:VTFImageFormats.RGBA8888
 }
typedef struct tagVTFHEADER
{
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
} VTFH

function vtfheader(title, href, imageUri, description) {
    this.title = title;
    this.href = href;
    this.imageUri = imageUri;
    this.description = description;
}*/
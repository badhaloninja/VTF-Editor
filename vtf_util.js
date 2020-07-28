//module "vtf_info.js"
function getColorDiff(color1, color2){
  return Math.abs(color1[0] - color2[0]) + Math.abs(color1[1] - color2[1]) + Math.abs(color1[2] - color2[2]);
}
const fromHexString = hexString =>
  new Uint8Array(hexString.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));

const toHexString = bytes =>
  bytes.reduce((str, byte) => str + byte.toString(16).padStart(2, '0'), '');
  
let merge = (a, b) => {
  var c = new a.constructor(a.length + b.length);
  c.set(a);
  c.set(b, a.length);
  return c;
}
let byte = (value,length=1) => {return new Uint8Array(length).map((_, i) => [value][i])};

let short = number => new Uint8Array([number & 0xFF,(number >>> 8) & 0xff]);

const char = s =>{//uint8array
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

const float = (floatnum) => {
  const getHex = i => ('00' + i.toString(16)).slice(-2);
  var type = Object.prototype.toString.call(floatnum);
  if (type == "[object Object]" || type == "[object Array]"){
    var out = new Uint8Array()
    for (var key in floatnum) {
      //console.log("Float")
      //console.log("Item: "+floatnum[key]+", \nType: "+type);
      var view = new DataView(new ArrayBuffer(4)),
        result;
      view.setFloat32(0, floatnum[key]);
      result = Array
        .apply(null, { length: 4})
        .map((_, i) => getHex(view.getUint8(i)))
        .join('');
      out = merge(out, fromHexString(result).reverse())
    }
    return out;
    //console.log("Disabled: "+type+"\nValue: "+thing[key]);
  } else if (type == "[object Number]") {
    var view = new DataView(new ArrayBuffer(4)),
      result;
    view.setFloat32(0, floatnum);
    result = Array
      .apply(null, { length: 4})
      .map((_, i) => getHex(view.getUint8(i)))
      .join('');
    return fromHexString(result).reverse();
  } else {
    console.log("Unknown: "+type+"\nValue: "+floatnum);
  }
}

const uint = number => {
  var type = Object.prototype.toString.call(number);
  if (type == "[object Object]" || type == "[object Array]"){
    var out = new Uint8Array()
    for (var key in number) {
      //console.log("Item: "+number[key]+", \nType: "+type);
      out = merge(out,(number[key]!=-1)?(new Uint8Array({0:number[key]>>>0,length:4})):(new Uint8Array([255,255,255,255])));
    }
    return out;
    //console.log("Disabled: "+type+"\nValue: "+thing[key]);
  } else if (type == "[object Number]") {
    return (number!=-1)?(new Uint8Array({0:number>>>0,length:4})):(new Uint8Array([255,255,255,255]))
  } else {
    console.log("Unknown: "+type+"\nValue: "+number);
  }
}


function powerOfTwo(x) { return Math.log2(x) % 1 === 0; }


module.exports.getColorDiff = getColorDiff;
module.exports.fromHexString = fromHexString;
module.exports.toHexString = toHexString;
module.exports.powerOfTwo = powerOfTwo;
module.exports.merge = merge;
module.exports.byte = byte;
module.exports.short = short;
module.exports.char = char;
module.exports.float = float;
module.exports.uint = uint;


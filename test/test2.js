//var selected = [];
//var safemode = true
$(document).ready(function(){
	//localStorage.removeItem('VTFOptions');
 if (localStorage){
 if (!(localStorage.getItem('VTFOptions'))) {
  alert("VTFOptions does not exists in localStorage")
  localStorage.setItem('VTFOptions', VTFOptions) ;
  } else {
  	alert("VTFOptions exists in localStorage")
 // localStorage.removeItem('VTFOptions');
  VTFOptions = localStorage.getItem('VTFOptions')
  }} else {
  alert('Your browser does not support localStorage')
  }
  watch(VTFOptions, function(prop){
    localStorage.VTFOptions[prop] = VTFOptions[prop];
  });
  for (var i = 0; i <= VTFConst.maxVersion[1]; i +=1){
  if (i==0) {
    $('#versionSetting').html("")
  }
  var entry = VTFConst.maxVersion[0]+"."+i
  $('#versionSetting').append("<option value="+entry+((i==VTFOptions.version[1])?" selected" : "")+">"+entry+"</option>\n")
  }
  for (var i = 1; i <= VTFConst.maxSizePower; i +=1){
  if (i==1) {
    $('.sizeInput').html("")
  }
  var entry = Math.pow(2,i)
  $('.sizeInput').append("<option value="+entry+((i==0)?" selected" : "")+">"+entry+"</option>\n")
  }
  VTFImageFormatInfo.Supported.forEach(function(entry,i){
  if (i==0) {
    $('#formatSelect').html("")
  }
  $('#formatSelect').append("<option value="+entry+((i==0)?" selected" : "")+">"+VTFImageFormatInfo.getInfo(entry).Name+"</option>\n")
  })
  Object.keys(TextureFlags).forEach(function(imageFlag,i){
  var classname = false;
     classname = ((imageFlag == "ONEBITALPHA" || imageFlag == "EIGHTBITALPHA" || imageFlag == "ENVMAP")? "formatsp":((imageFlag == "POINTSAMPLE" || imageFlag == "TRILINEAR" || imageFlag == "ANISOTROPIC")? "sampling":false));
     $("#FlagBoxContainer").append("<input type=\"checkbox\""+((classname !=false)? "class=\""+classname+"\"": "")+"value=\""+imageFlag.toString()+"\" title=\""+TextureFlags[imageFlag].comment+"\" id=\"flag"+i+"\">"+"<label for=\"flag"+i+"\" title=\""+TextureFlags[imageFlag].comment+"\">"+TextureFlags[imageFlag].name+"</label><br> ")
    })
  $("#safemode").change(function(){
      VTFOptions.safemode=this.checked
      $('#FlagBoxContainer input').each(function() {
       if (this.className == "formatsp"){
         $(".formatsp").prop('disabled',VTFOptions.safemode)
       }
       //document.getElementById("out").innerHTML += this+"\n"
       //$(this).prop('disabled',true)
      })
  })
  $('#FlagBoxContainer input').each(function() {
    if (VTFOptions.selectedFlags.includes($(this).attr('value'))){
        $(this).prop('checked', true);
    }
    if (this.className == "formatsp" && VTFOptions.safemode == true){
    $(".formatsp").prop('disabled',true)
    }
      //if (this.checked==true) {selected.push($(this).attr('value'))}
      });
$("#FlagBoxContainer").on( 'change', 'input', function(){
  //console.log(this.className)
  if (this.className == "sampling" && VTFOptions.safemode == true){
  $(".sampling").not(this).prop('checked', false);
  }
  console.log(this)
  VTFOptions.selectedFlags = [];
  $('#FlagBoxContainer input').each(function() {
  if (this.checked==true) {VTFOptions.selectedFlags.push($(this).attr('value'))}
  });
  console.log(VTFOptions.selectedFlags)
  document.getElementById("out").innerHTML = "\n"
  $(VTFOptions.selectedFlags).each(function(){
  document.getElementById("out").innerHTML += this+"\n"
  });
});
});
$(document).ready(function(){
  var editor = CodeMirror(document.getElementById("vmt-editor"), {
    value: (!localStorage.vmtEditor)?("LightmappedGeneric\n{\n $basetexture coast\shingle_01\n $surfaceprop gravel\n}"):localStorage.vmtEditor,
   // mode: "vmt",
    theme: "material",
    autoRefresh: true,
    lineNumbers: true
  })
  editor.on('change',function(cMirror){
  // get value right from instance
  localStorage.vmtEditor = cMirror.getValue();
});
});
const keySequence = ['p','r','a','n','k'];
let userInput = new Array( keySequence.length );
window.addEventListener( 'keydown', ( { key } ) => {
    userInput = [ ...userInput.slice( 1 ), key ];
    if ( keySequence.every( ( v, k ) => v === userInput[ k ] ) ) {
        $("#office-tab").prop('hidden',false)
    }
} );

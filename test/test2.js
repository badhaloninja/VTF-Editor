var selected = [];
var safemode = true
$(document).ready(function(){
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
      safemode=this.checked
      $('#FlagBoxContainer input').each(function() {
       if (this.className == "formatsp"){
         $(".formatsp").prop('disabled',safemode)
       }
       //document.getElementById("out").innerHTML += this+"\n"
       //$(this).prop('disabled',true)
      })
  })
  $('#FlagBoxContainer input').each(function() {
    if (VTFOptions.selectedFlags.includes($(this).attr('value'))){
        $(this).prop('checked', true);
    }
    if (this.className == "formatsp" && safemode == true){
    $(".formatsp").prop('disabled',true)
    }
      //if (this.checked==true) {selected.push($(this).attr('value'))}
      });
$("#FlagBoxContainer").on( 'change', 'input', function(){
  //console.log(this.className)
  if (this.className == "sampling" && safemode == true){
  $(".sampling").not(this).prop('checked', false);
  }
  console.log(this)
  selected = [];
  $('#FlagBoxContainer input').each(function() {
  if (this.checked==true) {selected.push($(this).attr('value'))}
  });
  console.log(selected)
  document.getElementById("out").innerHTML = "\n"
  $(selected).each(function(){
  document.getElementById("out").innerHTML += this+"\n"
  });
});
});
$(document).ready(function(){
  
});
const keySequence = ['p','r','a','n','k'];
let userInput = new Array( keySequence.length );
window.addEventListener( 'keydown', ( { key } ) => {
    userInput = [ ...userInput.slice( 1 ), key ];
    if ( keySequence.every( ( v, k ) => v === userInput[ k ] ) ) {
        $("#office-tab").prop('hidden',false)
    }
} );
/*
<input type="checkbox" class="GroupFoo" name="flagCheckBox" value="foo1">foo1<br>  
<input type="checkbox" class="GroupBar"  name="flagCheckBox" value="bar1">bar1<br>  
<input type="checkbox"  name="flagCheckBox" value="qar1">qar1<br>  
<input type="checkbox" class="GroupPar"  name="flagCheckBox" value="par1">Par1<br>  
<input type="checkbox" class="GroupFoo"  name="flagCheckBox" value="foo2">foo2<br>
<input type="checkbox" class="GroupBar"  name="flagCheckBox" value="bar3">bar3<br>  
<input type="checkbox" class="GroupPoo"  name="flagCheckBox" value="par2">par2<br>  
<input type="checkbox" class="GroupBar"  name="flagCheckBox" value="bar4">bar4<br>  
<input type="checkbox" class="GroupFoo"  name="flagCheckBox" value="foo4">foo4<br>    
*/

/*//#FlagBox { border:2px solid #ccc; width:320px; height: 128px; overflow-y: scroll; }
  $(".GroupFoo").prop('checked',false);
  $(this).prop('checked',true);*/
/*
function ValidateFlagSelection(item)  
{  
    var checkboxes = document.getElementsByName("flagCheckBox"); 
    document.getElementById("out").innerHTML = null
    var numberOfCheckedItems = 0;  
    for(var i = 0; i < checkboxes.length; i++)  
//document.getElementById("out").innerHTML += checkboxes[i]+": "+checkboxes[i].ClassName"\n"
    {  
    var j=0
        if(checkboxes[i].checked)  
            numberOfCheckedItems++;  
    }  
}*/
//scrollbar-3dlight-color:#FFFFFF;scrollbar-arrow-color:#000000;scrollbar-base-color:#FF9999;scrollbar-darkshadow-color:#000000;scrollbar-face-color:#000000;scrollbar-highlight-color:#000000;scrollbar-shadow-color:#0033CC;

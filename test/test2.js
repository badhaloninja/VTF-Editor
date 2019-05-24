var selected = [];
var safemode = true
$(document).ready(function(){
  Object.keys(TextureFlags).forEach(function(imageFlag,i){
  var classname = false;
     classname = ((imageFlag == "ONEBITALPHA" || imageFlag == "EIGHTBITALPHA" || imageFlag == "ENVMAP")? "formatsp":false);
     classname = ((imageFlag == "POINTSAMPLE" || imageFlag == "TRILINEAR" || imageFlag == "ANISOTROPIC")? "sampling":false);
     $("#FlagBoxContainer").append("<input type=\"checkbox\""+((classname !=false)? "class=\""+classname+"\"": "")+"value=\""+imageFlag.toString()+"\" title=\""+TextureFlags[imageFlag].comment+"\" id=\"flag"+i+"\">"+"<label for=\"flag"+i+"\">"+TextureFlags[imageFlag].name+"</label><br> ")
    })
  $("#safemode").change(function(){
      safemode=this.checked
      $('#FlagBoxContainer').find('input.formatsp').prop('disabled',true)
  })
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
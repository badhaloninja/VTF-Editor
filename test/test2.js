var selected = [];
$(document).ready(function(){
	//document.getElementById("out").innerHTML = "apple"
	Object.keys(TextureFlags).forEach(function(ImageFlag){
	var classname = false
     //(ImageFlag == "ONEBITALPHA" || ImageFlag == "EIGHTBITALPHA" || ImageFlag == "ENVMAP")? classname="formatsp":null;
     //(ImageFlag == "POINTSAMPLE" || ImageFlag == "TRILINEAR" || ImageFlag == "ANISOTROPIC")? classname="sampling":null;
     $("#FlagBoxContainer").append("<input type='checkbox'"+((classname != false)? "class='"+classname+"'": null)+"value='"+ImageFlag.toString()+"'>"+TextureFlags[ImageFlag].name+"<br> ")
    })
	
$("#FlagBoxContainer").on( 'change', 'input', function(){
  console.log(this.className)
  if (this.className == "sampling"){
  $(". sampling").prop('checked',false);
  $(this).prop('checked',true);
  $(".sampling").not(this).prop('checked', false);
  }
   selected = [];
   $('#FlagBoxContainer input').each(function() {
   selected.push($(this).attr('value'));
   });
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
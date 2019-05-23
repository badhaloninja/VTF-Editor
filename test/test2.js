var selected = [];
$(document).ready(function(){
$("input[name=flagCheckBox]").change(function()
{
  console.log(this.className)
  if (this.className == "GroupFoo"){
    console.log("oof")
  $(".GroupFoo").prop('checked',false);
  $(this).prop('checked',true);
  $(".GroupFoo").not(this).prop('checked', false);
  }
   selected = [];
   $('input[name=flagCheckBox]:checked').each(function() {
   selected.push($(this).attr('value'));
   });
  document.getElementById("out").innerHTML = "\n"
  $(selected).each(function(){
  document.getElementById("out").innerHTML += this+"\n"
  });
});
});
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
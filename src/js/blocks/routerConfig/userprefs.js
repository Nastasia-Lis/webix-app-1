import {setFunctionError,setAjaxError}   from "../errors.js";
import {hideElem} from "../commonFunctions.js";

import {hideAllElements,checkTreeOrder,closeTree,createElements} from "./common.js";

function showUserprefs(){
    try{
    
        $$("userprefs").show();
    } catch (err){
      
        setFunctionError(err,"router","router:userprefs function showUserprefs");
    }
}

function setUserprefsNameValue (){
    let user = webix.storage.local.get("user");
    try{
        if (user){
            $$("userprefsName").setValues(user.name.toString());
        }
    } catch (err){
      
        setFunctionError(err,"router","router:userprefs function setUserprefsNameValue");
    }

}

function hideNoneContent(){
    if($$("webix__none-content")){
        $$("webix__none-content").hide();
    }
}


function userprefsRouter(){


    hideAllElements ();
  
    checkTreeOrder();

    if ($$("userprefs")){
        showUserprefs();
    } else {
        createElements("userprefs");

        const userprefsData = webix.ajax().get("/init/default/api/userprefs/");

        userprefsData.then(function(data){

            data = data.json().content;
        
            function setTemplateValue(){
                try{
                    data.forEach(function(el,i){
            
                        if (el.name.includes("userprefs") && 
                            el.name.lastIndexOf("userprefs") == 0){
                            $$(el.name).setValues(JSON.parse(el.prefs));
                        }
                    });
                } catch (err){
                    setFunctionError(err,"router","router:cp function setUserValues");
                }
            }

            setTemplateValue();
            
        });

        userprefsData.fail(function(err){
            setAjaxError(err, "router","router:userprefs userprefsData");
        });

        showUserprefs();

    }

    setUserprefsNameValue ();
    closeTree();
    hideNoneContent();


    if($$("webix__null-content")){
        const parent = $$("webix__null-content").getParentView();
        parent.removeView($$("webix__null-content"));
    }

   
}

export{
    userprefsRouter
};
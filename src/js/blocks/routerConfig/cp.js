import {setFunctionError}   from "../errors.js";
import {hideElem,showElem} from "../commonFunctions.js";

import {hideAllElements,checkTreeOrder,closeTree,createElements} from "./common.js";

function showUserAuth(){
    try{
        
        if ($$("user_auth")){
            $$("user_auth").show();
        }
    } catch (err){
        setFunctionError(err,"router","router:cp function showUserAuth");
    }
}
   
function setUserValues(){
    const user = webix.storage.local.get("user");
    const authName =  $$("authName");
    try{
        if (user){
            authName.setValues(user.name.toString());
        }
    } catch (err){
        setFunctionError(err,"router","router:cp function setUserValues");
    }
}

function hideNoneContent(){
    if($$("webix__none-content")){
        $$("webix__none-content").hide();
    }
}




function cpRouter(){
    
    if($$("webix__null-content")){
        const parent = $$("webix__null-content").getParentView();
        parent.removeView($$("webix__null-content"));
    }
 
    checkTreeOrder();


    hideAllElements ();
  
    if($$("user_auth")){
        showUserAuth();
    } else {
    
        createElements("cp");
        showUserAuth();
   
    }
  
    closeTree();
    setUserValues();
    hideNoneContent();
}


export{
    cpRouter
};
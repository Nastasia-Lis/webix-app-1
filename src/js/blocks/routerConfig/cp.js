import {setFunctionError}   from "../errors.js";
import {hideElem,showElem,removeElem} from "../commonFunctions.js";

import {hideAllElements,checkTreeOrder,closeTree,createElements} from "./common.js";


const logNameFile = "router => cp";

function showUserAuth(){
    try{
        const elem = $$("user_auth");
        if (elem){
            elem.show();
        }
    } catch (err){
        setFunctionError(err,logNameFile,"showUserAuth");
    }
}
   
function setUserValues(){
    const user     = webix.storage.local.get("user");
    const authName =  $$("authName");
    try{
        if (user){
            authName.setValues(user.name.toString());
        }
    } catch (err){
        setFunctionError(err,logNameFile,"setUserValues");
    }
}

function hideNoneContent(){
    try{
        const elem = $$("webix__none-content");
        if(elem){
            elem.hide();
        }
    } catch (err){
        setFunctionError(err,logNameFile,"hideNoneContent");
    }
}

function removeNullContent(){
    try{
        const elem = $$("webix__null-content");
        if(elem){
            const parent = elem.getParentView();
            parent.removeView(elem);
        }
    } catch (err){
        setFunctionError(err,logNameFile,"removeNoneContent");
    }
}







function cpRouter(){
    
 
 
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

    removeNullContent();
}


export{
    cpRouter
};
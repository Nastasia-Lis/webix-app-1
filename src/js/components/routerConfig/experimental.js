import { setFunctionError }                 from "../../blocks/errors.js";
import { Action }                           from "../../blocks/commonFunctions.js";

import { hideAllElements, checkTreeOrder, 
        closeTree, createElements }         from "./common.js";

import { getInfoEditTree }                  from "../../components/treeEdit/getInfoEditTree.js";

const logNameFile = "router => experimental";

function showTreeTempl(){
    try{
        $$("treeTempl").show();
    } catch (err){
        setFunctionError(err,logNameFile,"showTreeTempl");
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
        setFunctionError(err,logNameFile,"removeNullContent");
    }
}

function experimentalRouter(){
    removeNullContent();

    hideAllElements ();
    Action.hideItem($$("webix__none-content"));
    
    
    checkTreeOrder();
    
    
    if($$("treeTempl")){
        showTreeTempl ();
        getInfoEditTree();
    }else {
        createElements("treeTempl");
        getInfoEditTree();
        showTreeTempl();
    }
    
    closeTree();
}


export {
    experimentalRouter
};
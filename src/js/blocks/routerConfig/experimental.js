import {setFunctionError}   from "../errors.js";
import {hideElem} from "../commonFunctions.js";

import {hideAllElements,checkTreeOrder,closeTree,createElements} from "./common.js";

import {getInfoEditTree} from "../content.js";


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
    
    hideElem($$("webix__none-content"));
    
    
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
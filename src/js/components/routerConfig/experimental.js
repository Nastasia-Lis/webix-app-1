import { setFunctionError }                 from "../../blocks/errors.js";
import { Action }                           from "../../blocks/commonFunctions.js";

import { hideAllElements, checkTreeOrder, 
        closeTree, createElements }         from "./common.js";

import { mediator }                         from "../../blocks/_mediator.js";

const logNameFile = "router => experimental";

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
        mediator.treeEdit.showView();
        mediator.treeEdit.load();
    }else {
        createElements("treeTempl");
        mediator.treeEdit.load();
        mediator.treeEdit.showView();
    }
    
    closeTree();
}


export {
    experimentalRouter
};
import {setFunctionError}   from "../errors.js";
import {hideElem} from "../commonFunctions.js";

import {hideAllElements,checkTreeOrder,closeTree,createElements} from "./common.js";

import {getInfoEditTree} from "../content.js";

function showTreeTempl(){
    try{
        $$("treeTempl").show();
    } catch (err){
        setFunctionError(err,"router","router:experimental function showTreeTempl");
    }
}
function experimentalRouter(){
    
    if($$("webix__null-content")){
        const parent = $$("webix__null-content").getParentView();
        parent.removeView($$("webix__null-content"));
    }

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
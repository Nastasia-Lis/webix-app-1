import { Action }           from "../../blocks/commonFunctions.js";
import { GetFields }        from "../../blocks/globalStorage.js";
import { setFunctionError } from "../../blocks/errors.js";

import { mediator }         from "../../blocks/_mediator.js";

const logNameFile = "treeSidebar => selectVisualElem";



function createUndefinedView(){
    const id = "webix__null-content";

    const view = {
        view  : "align", 
        align : "middle,center",
        id    : id,
        body  : {  
            borderless : true, 
            template   : "Блок в процессе разработки", 
            height     : 50, 
            width      : 220,
            css        : {
                "color"     : "#858585",
                "font-size" : "14px!important"
            }
        }
        
    };

    if ( !($$(id)) ){
        try{
            $$("container").addView(view, 2);
        } catch (err){ 
            setFunctionError(
                err, 
                logNameFile, 
                "createUndefinedView"
            );
        }
     
    }
   
}


function selectElem(id){
    const visiualElements = mediator.getViews();
    const type = GetFields.attribute (id, "type");

    Action.hideItem($$("webix__none-content"));

    const idBranch = $$("tree").isBranch(id);

    if (!type && !idBranch){
        createUndefinedView();
    } else {
        Action.removeItem($$("webix__null-content")); 
    }

 
    function selectItemAction(){
   
        let selectElem;
     
        if (type == "dbtable"){
            selectElem = "tables";
            mediator.tables.load(id);

        } else if(type == "tform"){
            selectElem = "forms";
            mediator.forms.load(id);

        } else if(type == "dashboard"){
            selectElem = "dashboards";
            mediator.dashboards.load(id);
            Action.hideItem($$("propTableView"));

        } 

     

        visiualElements.forEach(function(elem){
            if (elem !== selectElem){
                Action.hideItem($$(elem));
            } 

            if (elem == id){
                Action.showItem($$("webix__none-content"));
            }
        });

        Action.showItem($$(selectElem));
    }

    selectItemAction     ();
}


export {
    selectElem
};
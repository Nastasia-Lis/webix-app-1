  
///////////////////////////////

// Отрисовка компонента выбранного

// Copyright (c) 2022 CA Expert

///////////////////////////////

import { Action }           from "../../blocks/commonFunctions.js";
import { GetFields }        from "../../blocks/globalStorage.js";
import { setFunctionError } from "../../blocks/errors.js";
import { mediator }         from "../../blocks/_mediator.js";

const logNameFile = "treeSidebar => selectVisualElem";

function setNameToTab(){
    mediator.tabs.changeTabName(false, false);
    const data = mediator.tabs.getInfo();
    data.tree  = {none:true};
    mediator.tabs.setInfo(data);
 
}

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

            if (mediator.tabs.isOtherViewTab()){
                mediator.tabs.addTab(true);
            } else {
                setNameToTab();
            }

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

function selectItemAction(type, id){
    const visiualElements = mediator.getViews();
    let selectElem;

    if (type){
        const values = {
            tree : {
                type  : type, 
                field : id
            }
        };

        mediator.tabs.setInfo(values);
    }
  
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


    if (visiualElements && visiualElements.length){
        visiualElements.forEach(function(elem){
            if (elem !== selectElem){
                Action.hideItem($$(elem));
            } 
    
            if (elem == id){
                Action.removeItem($$("webix__null-content"));
                Action.showItem  ($$("webix__none-content"));
            }
        });
    
        Action.showItem($$(selectElem));
    }
  

}

function removeTreeEdit(){
    Action.removeItem($$("treeTempl")); 
    Action.destructItem($$("contextMenuEditTree")); 
    
}

function selectElem(id){
 
    const type = GetFields.attribute (id, "type");

    Action.hideItem($$("webix__none-content"));

    removeTreeEdit();

    const isBranch = $$("tree").isBranch(id);
    
    if (!type && !isBranch){
        createUndefinedView();
    } else {
        Action.removeItem($$("webix__null-content")); 
    }
 
    selectItemAction (type, id);
}


export {
    selectElem
};
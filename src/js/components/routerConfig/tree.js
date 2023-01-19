///////////////////////////////

// Навигация по сайдбару

// Copyright (c) 2022 CA Expert

///////////////////////////////



import { setFunctionError }             from "../../blocks/errors.js";
import { LoadServerData, GetFields }    from "../../blocks/globalStorage.js";
import { mediator }                     from "../../blocks/_mediator.js";
import { RouterActions }                from "./actions/_RouterActions.js";

const logNameFile = "router => tree";

 
let id;
let emptyTab = false;



async function getTableData (){

    await LoadServerData.content("fields");
    const keys = GetFields.keys;
 
    if (keys){
        mediator.sidebar.selectItem(id);
    }
}


async function createTableSpace (){
    RouterActions.createContentSpace();
   
    const isFieldsExists = GetFields.keys;
    try{   
        const tree = $$("tree");
        tree.attachEvent("onAfterLoad", 
        webix.once(function (){
            if (!isFieldsExists && !emptyTab) {
                getTableData ();
            } 
        }));         
       
    } catch (err){
        setFunctionError(
            err, 
            logNameFile, 
            "createTableSpace"
        );
    }

}



async function checkTable(){

    try {
        const isSidebarData = mediator.sidebar.dataLength();
        
        if (!isSidebarData){
            createTableSpace ();
            
        }
    } catch (err){
        setFunctionError(
            err, 
            logNameFile, 
            "checkTable"
        );

    }    
  
}

async function treeRouter(selectId){

    const search = window.location.search;
    const params    = new URLSearchParams(search);
    const param = params.get("new"); 

    if (param){
        emptyTab = true;
    }

    id = selectId;
    checkTable();
  
}

export {
    treeRouter
};
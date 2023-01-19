
///////////////////////////////

// Смена пароля

// Copyright (c) 2022 CA Expert

///////////////////////////////

import { setFunctionError }   from "../../blocks/errors.js";
import { mediator }           from "../../blocks/_mediator.js";
import { Action }             from "../../blocks/commonFunctions.js";

import { RouterActions }      from "./actions/_RouterActions.js";

const logNameFile = "router => cp";
 
function setUserValues(){
    const user     = webix.storage.local.get("user");
    const authName =  $$("authName");
    try{
        if (user){
            const values = user.name.toString();
            authName.setValues(values);
        }
    } catch (err){
        setFunctionError(
            err,
            logNameFile,
            "setUserValues"
        );
    }
}

 
function setTab(id){
    $$("globalTabbar").addOption({
        id    : id, 
        value : "Смена пароля", 
        isOtherView : true,
        info  : {
            tree:{
                view : "cp"
            }
        },
        close : true, 
    }, true);
}

function createCp(){
    const auth = $$("user_auth");
    
    setTab("cp");

    if(auth){
        Action.showItem(auth);
    } else {
        RouterActions.createContentElements("cp");
        Action.showItem($$("user_auth"));
   
    }
}


function loadSpace(){
    const isSidebarData = mediator.sidebar.dataLength();

    if (!isSidebarData){
        RouterActions.createContentSpace(); //async ?
    }
}

function cpRouter(){
    
    loadSpace();

    RouterActions.hideContent();
    createCp        ();
 
    mediator.sidebar.close();

    setUserValues     ();
    RouterActions.hideEmptyTemplates();
}


export{
    cpRouter
};
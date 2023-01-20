 
///////////////////////////////

// Состояния редактора записей

// Copyright (c) 2022 CA Expert

///////////////////////////////

import { Action }            from "../../../../blocks/commonFunctions.js";
import { setFunctionError }  from "../../../../blocks/errors.js";
import { mediator }          from "../../../../blocks/_mediator.js";
import { Button }            from "../../../../viewTemplates/buttons.js";
import { createProperty }    from "../createProperty.js";

const logNameFile = "table => editForm => setState";


function initPropertyForm(){
    const property = $$("editTableFormProperty");
    Action.showItem(property);
    property.clear();
    $$("table-editForm").setDirty(false);
}



function setWorkspaceState (table){
    const emptyTemplate = $$("EditEmptyTempalte");
    function tableState(){
        table.filter(false);
        table.clearSelection();
    }

    function buttonsState(){
        $$("table-delBtnId")   .disable();
        $$("table-saveBtn")    .hide();
        $$("table-saveNewBtn") .show();
        $$("table-newAddBtnId").disable();
    }

    try{
        tableState();
        buttonsState();
        createProperty("table-editForm");
        Action.hideItem(emptyTemplate);
    } catch (err){
        setFunctionError(
            err,
            logNameFile,
            "setWorkspaceState"
        );
    }

}


function setStatusProperty(status){
    const prop = $$("editTableFormProperty");

    if (prop){
        prop.config.statusForm = status;
    }
}

function unsetDirtyProp(){
    $$("table-editForm").setDirty(false);
    mediator.tabs.setDirtyParam();
}

function editTablePostState(){
    const table = $$("table");
    initPropertyForm();
    setWorkspaceState (table);
    setStatusProperty("post");
    unsetDirtyProp();
    mediator.linkParam(true, {"view": "edit"});
}

//select exists entry
function setPropertyWidth(prop){
    const form = $$("table-editForm");

    if (prop && !(prop.isVisible())){
        prop.show();

        // if (window.innerWidth > 850){
        //    // form.config.width = 350;   
        //    // form.resize();
        // }
    }

}

function adaptiveView (editForm){
    try {
        const container = $$("container");
        
        if (container.$width < 850){
            Action.hideItem($$("tree"));

            if (container.$width < 850){
                Action.hideItem($$("tableContainer"));
                editForm.config.width = window.innerWidth;
                editForm.resize();
                Action.showItem($$("table-backTableBtn"));
            }
        }
    } catch (err){
        setFunctionError(
            err,
            logNameFile,
            "adaptiveView"
        );
    }
}

function editTablePutState(){
  
    try{
        const editForm  = $$("table-editForm");
        setPropertyWidth ($$("editTableFormProperty"));
        editForm.setDirty(false);
        Action.showItem  ($$("table-saveBtn"    ));

        Action.hideItem  ($$("table-saveNewBtn" ));
        Action.hideItem  ($$("EditEmptyTempalte"));

        Action.enableItem($$("table-delBtnId"   ));
        Action.enableItem($$("table-newAddBtnId"));
   
        if( !(editForm.isVisible()) ){
            mediator.tables.defaultState("filter");
            Button.transparentDefaultState();
            adaptiveView (editForm);
            editForm.show();
        }

        setStatusProperty("put");
 
    } catch (err){   
        setFunctionError(
            err,
            logNameFile,
            "editTablePutState"
        );
    }
    
}

function defPropertyState(){
    mediator.tables.editForm.clearTempStorage();
    const property = $$("editTableFormProperty");

    if (property){
        property.clear();
        property.hide();
    }
  
}



function editTableDefState(clearDirty){
    const form = $$("table-editForm");
    
    if (clearDirty){
        unsetDirtyProp();   
    } else {
        if (form){
            form.setDirty(false);   
        }

    }
 

    
    Action.hideItem   ($$(form                ));
    Action.hideItem   ($$("tablePropBtnsSpace"));
    Action.hideItem   ($$("table-saveNewBtn"  ));
    Action.hideItem   ($$("table-saveBtn"     ));

    Action.showItem   ($$("tableContainer"    ));
    Action.showItem   ($$("EditEmptyTempalte" ));

    Action.enableItem ($$("table-newAddBtnId" ));

    Action.disableItem($$("table-delBtnId"   ));

    Action.removeItem ($$("propertyRefbtnsContainer"));

    defPropertyState  ();

    setStatusProperty (null);
}

export {
   editTableDefState,
   editTablePutState,
   editTablePostState
};
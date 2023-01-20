 
///////////////////////////////

// Медиатор

// Copyright (c) 2022 CA Expert

///////////////////////////////


import { editTableDefState, 
        editTablePutState,
        editTablePostState }      from "./setState.js";

import { putTable, postTable,
        removeTableItem }         from "./formAcitions.js";

import { editTableBar }           from "../_layout.js";  
import { Action }                 from "../../../../blocks/commonFunctions.js";


class EditForm {
    static createForm (){
        $$("flexlayoutTable").addView(editTableBar());
        Action.enableItem($$("table-newAddBtnId"));
    }

    static defaultState (clearDirty = true){
        editTableDefState(clearDirty);
    }

    static putState     (){
       editTablePutState();
    }

    static postState    (){
        editTablePostState();
    }

    static put (updateSpace = true, isNavigate = false){
        return putTable (updateSpace, isNavigate, this); 
    }

    static post (updateSpace = true, isNavigate = false){
        return postTable(updateSpace, isNavigate, this);
    }

    static remove (){
        removeTableItem(this);
    }

    static clearTempStorage(){
        $$("editTableFormProperty").config.tempData = false;
        webix.storage.local.remove("editFormTempData");
    }


}
export {
    EditForm
};
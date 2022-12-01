
import { editTableDefState, 
        editTablePutState,
        editTablePostState }      from "./setState.js";

import { putTable, postTable,
        removeTableItem }         from "./formAcitions.js";

        
class EditForm {
    static defaultState (){
        editTableDefState();
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
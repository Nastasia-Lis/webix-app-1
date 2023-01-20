 
///////////////////////////////

// Дефолнтное состояние редактора 

// Copyright (c) 2022 CA Expert

///////////////////////////////


import { setFunctionError }        from "../../../blocks/errors.js";
import { Action }                  from "../../../blocks/commonFunctions.js";

const logNameFile = "tableEditForm => states";


function defaultStateForm () {

    const property = $$("editTableFormProperty");
    
    function btnsState(){
        
        const saveBtn    = $$("table-saveBtn");
        const saveNewBtn = $$("table-saveNewBtn");
        const delBtn     = $$("table-delBtnId");

        if (saveNewBtn.isVisible()) {
            saveNewBtn.hide();

        } else if (saveBtn.isVisible()){
            saveBtn.hide();

        }

        delBtn.disable();
    }

    function formPropertyState(){
 
        if (property){
            property.clear();
            property.hide();
        }
    }


    function removeRefBtns(){
        const refBtns = $$("propertyRefbtnsContainer");
        const parent  = $$("propertyRefbtns");
        if ( refBtns ){
            parent.removeView( refBtns );
        }
    }

    try{
        btnsState();
        formPropertyState();
        Action.showItem($$("EditEmptyTempalte"));
        removeRefBtns();

    } catch (err){
        setFunctionError(err, logNameFile, "defaultStateForm");
    }

}

export {
    defaultStateForm
};
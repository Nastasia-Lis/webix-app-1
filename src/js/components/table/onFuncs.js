 
import { defaultStateForm }                  from './editForm/states.js';
import { createProperty }                    from './editForm/createProperty.js';

import { validateProfForm }                  from './editForm/validation.js';
import { modalBox }                          from "../../blocks/notifications.js";
import { setLogValue }                       from '../logBlock.js';
import { setAjaxError, setFunctionError }    from "../../blocks/errors.js";
import { Action, getItemId, getTable }       from "../../blocks/commonFunctions.js";

import { validateError, putData }            from "./common.js";
import { EditForm }                          from "./editForm/setState.js";

import { mediator }                          from "../../blocks/_mediator.js";
import { Button }                            from "../../viewTemplates/buttons.js";

const logNameFile = "table => onFuncs";

function setUnDirtyProperty(){
    const property = $$('editTableFormProperty');
    property.config.dirty = true;
}

function toEditForm (nextItem) {
    const valuesTable = $$("table").getItem(nextItem); 

    function setViewDate(){
        const parseDate = webix.Date.dateToStr("%d.%m.%y %H:%i:%s");
        try{
            Object.values(valuesTable).forEach(function(el,i){
        
                if(el instanceof Date){
                    const key        = Object.keys(valuesTable)[i];
                    const value      = parseDate(el);
                    valuesTable[key] = value;
                }
            
            });
        } catch (err){ 
            setFunctionError(err, logNameFile, "setViewDate");
        }
    }

    
    EditForm.putState();
    const prop = $$("editTableFormProperty");
    prop.setValues(valuesTable);
    setViewDate();

}


const onFuncTable = {

    onBeforeLoad:function(){
        this.showOverlay("Загрузка...");
    },

    onBeforeEditStop:function(state, editor){
        const table      = $$("table");
        const valuesProp = table.getSelectedItem();
        const currId     = getItemId ();
        const tableItem  = table.getSelectedItem();
        try {
            if(state.value != state.old){

                const idRow = editor.row;
                const col   = editor.column;
                const val   = state.value;
              
                table.updateItem(idRow, {[col] : val});
                $$("editTableFormProperty").setValues(tableItem);
                putData ("", valuesProp, currId);

            }
        } catch (err){
            setFunctionError(
                err, 
                logNameFile, 
                "onBeforeEditStop"
            );
        }
    },

    onAfterSelect(){
        EditForm.putState();
    },
    
    onBeforeSelect:function(selection){
        const table     = $$("table");
        const property  = $$("editTableFormProperty");
    

        const valuesProp = property.getValues();
        const currId     = getItemId ();
        const nextItem   = selection.id;

        function tableUpdate (id){
            valuesProp.id = id;
            table.add(valuesProp);
        }

        function successState(id){
            tableUpdate (id);
            
            toEditForm  (nextItem);
            
            Action.removeItem($$("propertyRefbtnsContainer"));
            
            table.select(nextItem);
            
            setLogValue(
                "success", 
                "Данные успешно добавлены"
            );  
        }

        function errorState(data){
            const errs = data.errors;
            let msg = "";
            Object.values(errs).forEach(function(err,i){
                msg += err + " (Поле: " + Object.keys(errs)[i] +"); ";
            });

            setLogValue("error",msg);
        }

        function postNewData (nextItem, currId, valuesProp){
            if (!(validateProfForm().length)){
                const url      = "/init/default/api/" + currId;
                
                const postData = webix.ajax().post(url, valuesProp);
                
                postData.then(function(data){
                 
                    data = data.json().content;

                    if (data.id !== null){
                        successState(data.id);
                    } else {
                        errorState(data)
                    }
                    
                });

                postData.fail(function(err){
                    setAjaxError(
                        err, 
                        logNameFile,
                        "onBeforeSelect => postNewData"
                    );
                });
 
            } else {
                validateError ();
            }
        }
 
 
        function modalBoxTable (){

            try{
        
                modalBox().then(function(result){
                    const saveBtn  = $$("table-saveBtn");

                    if (result == 1){
                        toEditForm(nextItem);
                        table.select(selection.id);
                    
                        Action.removeItem($$("propertyRefbtnsContainer"));
                    } 

                    else if (result == 2){
                    
                        if (saveBtn.isVisible()){
                            putData     (nextItem, valuesProp, currId, true);
                        } else {
                            postNewData (nextItem, currId, valuesProp);
                        }
                        setUnDirtyProperty();
                    }

                });

                return false;
          
            } catch (err){ 
                setFunctionError(
                    err,
                    logNameFile,
                    "onBeforeSelect => modalBoxTable"
                );
            }
        }
      

        if (property.config.dirty){
            modalBoxTable ();
            return false;
        } else {
            createProperty("table-editForm");
            toEditForm(nextItem);
        }
    },

    onAfterLoad:function(){
        try {
            this.hideOverlay();

            defaultStateForm ();
        } catch (err){
            setFunctionError(
                err,
                logNameFile,
                "onAfterLoad"
            );
        }
    },  

    onAfterDelete: function() {
    
        function setOverlayState(){
            const id   = getTable().config.id;
            const table = $$(id);


            if ( !table.count() ){
                table.showOverlay("Ничего не найдено");
            } else {
                table.hideOverlay();
            }
        }

        setOverlayState();
      
    },

    onAfterAdd: function() {
        this.hideOverlay();
    },

};


export {
    onFuncTable
};
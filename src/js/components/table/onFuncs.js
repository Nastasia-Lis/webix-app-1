 
import { defaultStateForm }  from './editForm/states.js';
import { createProperty }    from './editForm/createProperty.js';

import { modalBox }          from "../../blocks/notifications.js";
import { setFunctionError }  from "../../blocks/errors.js";
import { getTable }          from "../../blocks/commonFunctions.js";

import { EditForm }          from "./editForm/editFormMediator/editFormClass.js";

import { mediator }          from "../../blocks/_mediator.js";

const logNameFile = "table => onFuncs";

function toEditForm (nextItem) {
    const valuesTable = $$("table").getItem(nextItem); 

    function setViewDate(){
        const parseDate = webix.Date.dateToStr("%d.%m.%y %H:%i:%s");
 
        const values    = Object.values(valuesTable);
    
        try{
            values.forEach(function(el, i){
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
    setViewDate();
    const prop = $$("editTableFormProperty");
    prop.setValues(valuesTable);
 

}


const onFuncTable = {

    onBeforeLoad:function(){
        this.showOverlay("Загрузка...");
    },

    onBeforeEditStop:function(state, editor){
        const table      = $$("table");
        try {
            if(state.value != state.old){

                const idRow = editor.row;
                const col   = editor.column;
                const value   = state.value;

                const item     = this.getItem(editor.row);

                const oldValue = item[editor.column];

                item[editor.column] = value;

                const property  = $$("editTableFormProperty");
                property.setValues(item);

                table.updateItem (idRow, {[col] : oldValue});
  
                mediator.tables.editForm.put(false);

            }
        } catch (err){
            setFunctionError(
                err, 
                logNameFile, 
                "onBeforeEditStop"
            );
        }

    },
    
    onBeforeSelect:function(selection){
        const table     = $$("table");
        const nextItem   = selection.id;

        function successAction(){
            $$("table-editForm").setDirty(false);
            table.select(selection.id);
        }

        function modalBoxTable (){
  
            try{ 
                modalBox().then(function(result){
                    const saveBtn  = $$("table-saveBtn");
                    const form     = mediator.tables.editForm;
      
                    if (result == 1){
                        mediator.tables.editForm.defaultState();
                        table.select(selection.id);
                    } 

                    else if (result == 2){
                    
                        if (saveBtn.isVisible()){
                            form.put(false)
                            .then(function (result){
                     
                                if (result){
                                    successAction();
                                }

                            });
                        } else {
                            form.post(false)
                            .then(function (result){

                                if (result){
                                    successAction();
                                }

                            });
                        }
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
        
        const isDirtyForm = $$("table-editForm").isDirty();
        if (isDirtyForm){
            modalBoxTable ();
            return false;
        } else {
            createProperty("table-editForm");
            toEditForm(nextItem);
        }
    },
    onAfterSelect:function(row){
        mediator.linkParam(true, {id: row.id});
    },

    onAfterUnSelect:function(){
        mediator.linkParam(false, "id");
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
            const id    = getTable().config.id;
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
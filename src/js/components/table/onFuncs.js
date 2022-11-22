 
import { defaultStateForm, createEditFields }                   from './editForm/states.js';
import { validateProfForm }                                     from './editForm/validation.js';
import { modalBox }                                             from "../../blocks/notifications.js";
import { setLogValue }                                          from '../logBlock.js';
import { setAjaxError, setFunctionError }                       from "../../blocks/errors.js";
import { Action, getItemId, getTable }                          from "../../blocks/commonFunctions.js";

import { toEditForm, validateError, putData}                    from "./common.js";

const logNameFile = "table => onFuncs";

const onFuncTable = {

    onBeforeLoad:function(){
        this.showOverlay("Загрузка...");
    },

    onBeforeEditStop:function(state, editor, ignoreUpdate){
        const table      = $$("table");
        const valuesProp = table.getSelectedItem();
        const currId     = getItemId ();
        const tableItem  = table.getSelectedItem();
        try {
            if(state.value != state.old){

                const idRow = editor.row;
                const col   = editor.column;
                const val   = state.value;
              
                table.updateItem(idRow, {[col]:val});
                $$("editTableFormProperty").setValues(tableItem);
                putData ("", valuesProp, currId);

            }
        } catch (err){
            setFunctionError(err,logNameFile,"onBeforeEditStop");
        }
    },

    onAfterSelect(id){

        function filterTableHide (){
            try{
                const filterContainer = $$("filterTableBarContainer");
                const filterForm      = $$("filterTableForm");
                const btnClass        = document.querySelector(".webix_btn-filter");

                Action.hideItem(filterContainer);
                Action.hideItem(filterForm);
      
                btnClass.classList.add   ("webix-transparent-btn");
                btnClass.classList.remove("webix-transparent-btn--primary");

            } catch (err){
                setFunctionError(err,logNameFile,"onAfterSelect => filterTableHide");
            }
        }


        function statePutEditForm (){
            
            try{
                const newAddBtn = $$("table-newAddBtnId");
                const editForm  = $$("table-editForm");
                Action.showItem($$("editTableBarContainer"));

                if (newAddBtn){
                    newAddBtn.enable();
                }
                Action.hideItem($$("EditEmptyTempalte"));


                if( !(editForm.isVisible()) ){
                    editForm.show();
                    filterTableHide ();
                }

            } catch (err){
                setFunctionError(err,logNameFile,"onAfterSelect => statePutEditForm")
            }
        }



        function adaptiveEditForm (){
            try {
                const form      = $$("table-editForm");
                const container = $$("container");

                if (container.$width < 850){
                    Action.hideItem($$("tree"));
       

                    if (container.$width< 850){
                        Action.hideItem($$("tableContainer"));
    
                        form.config.width = window.innerWidth;
                        form.resize();
                        Action.showItem($$("table-backTableBtn"));
                    }
                    Action.showItem(form);
                    Action.hideItem($$("EditEmptyTempalte"));
           
                }
            } catch (err){
                setFunctionError(err,logNameFile,"onAfterSelect => adaptiveEditForm");
            }
        }

        statePutEditForm ();
        adaptiveEditForm ();

    },
    
    onBeforeSelect:function(selection, preserve){
        const table     = $$("table");
        const property  = $$("editTableFormProperty");
    

        const valuesProp = property.getValues();
        const currId = getItemId ();
        const nextItem = selection.id;


        function postNewData (nextItem,currId,valuesProp){
            if (!(validateProfForm().length)){
                const url      = "/init/default/api/"+currId;
                
                const postData = webix.ajax().post(url, valuesProp);
                
                postData.then(function(data){
                 
                    data = data.json();

                    function tableUpdate (){
                        valuesProp.id = data.content.id;
                        table.add(valuesProp);
                    }
                
                    if (data.content.id !== null){
                        tableUpdate ();
                        toEditForm(nextItem);
                        Action.removeItem($$("propertyRefbtnsContainer"));
                        table.select(nextItem);
                        setLogValue("success","Данные успешно добавлены");
                    } else {

                        const errs = data.content.errors;
                        let msg = "";
                        Object.values(errs).forEach(function(err,i){
                            msg +=err+" (Поле: "+Object.keys(errs)[i] +"); ";
                        });

                        setLogValue("error",msg);
                    }
                    
                });

                postData.fail(function(err){
                    setAjaxError(err, logNameFile,"onBeforeSelect => postNewData");
                });
 
            } else {
                validateError ();
            }
        }
 
 
        function modalBoxTable (){

            try{
                if (property.config.dirty){

                    modalBox().then(function(result){
                        const saveBtn  = $$("table-saveBtn");

                        if (result == 1){
                            toEditForm(nextItem);
                            table.select(selection.id);
                            Action.removeItem($$("propertyRefbtnsContainer"));
                        } 

                        else if (result == 2){
                        
                            if (saveBtn.isVisible()){
                                putData (nextItem,valuesProp,currId, true);
                            } else {
                                postNewData (nextItem,currId,valuesProp);
                            }
                        }

                    });

                    return false;
                } else {
                    createEditFields("table-editForm");
                    toEditForm(nextItem);
                }
            } catch (err){ 
                setFunctionError(err,logNameFile,"onBeforeSelect => modalBoxTable")
            }
        }
 
        modalBoxTable ();

        if (property.config.dirty){
            return false;
        }
    },

    onAfterLoad:function(){
        try {
            this.hideOverlay();

            defaultStateForm ();
        } catch (err){
            setFunctionError(err,logNameFile,"onAfterLoad")
        }
    },  

    onAfterDelete: function() {
        function overlay (){

            function returnTableView(){
                if ($$("table").isVisible()){
                    return "table";
                } else if ($$("table-view").isVisible()){
                    return "table-view";
                }
              
            }

            function setOverlayState(){
                const tableId   = returnTableView();
                const tableView = $$(tableId);
    
    
                if ( !tableView.count() ){
                    tableView.showOverlay("Ничего не найдено");
                }
                if ( tableView.count() ){
                    tableView.hideOverlay();
                }
            }

            setOverlayState();
      
        }
      
        overlay ();
    },

    onAfterAdd: function() {
        this.hideOverlay();
    },

};


export {
    onFuncTable
};
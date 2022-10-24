
 
import {defaultStateForm,createEditFields} from '../blocks/tableEditForm/states.js';
import {validateProfForm} from '../blocks/tableEditForm/validation.js';

import {catchErrorTemplate,ajaxErrorTemplate} from "../blocks/logBlock.js";
import {modalBox,popupExec} from "../blocks/notifications.js";
import {setLogValue} from '../blocks/logBlock.js';
import {setAjaxError,setFunctionError} from "../blocks/errors.js";
import {showElem,hideElem,removeElem,getItemId} from "../blocks/commonFunctions.js";

// function getItemId (){
//     let id;

//     if ($$("tables").isVisible()){
//         id = $$("table").config.idTable;

//     } else if ($$("forms").isVisible()){
//         id = $$("table-view").config.idTable;
//     }
//     return id;
// }

function table (idTable, onFunc, editableParam=false) {
    return {
        view        :"datatable",
        id          : idTable,
        css         :"webix_table-style webix_header_border webix_data_border",
        autoConfig  : true,
        editable    :editableParam,
        editaction  :"dblclick",
        minHeight   :350,
        datafetch   :5,
        datathrottle: 5000,
        loadahead   :100,
        footer      : true,
        select      :true,
        resizeColumn: true,
        on          :onFunc,
        onClick     :{
            "wxi-trash":function(){
                try {
                    popupExec("Запись будет удалена").then(
                        function(){
                            let formValues = $$(idTable).getItem(id);
                            let itemTreeId = getItemId () ;

                            webix.ajax().del("/init/default/api/"+itemTreeId+"/"+formValues.id+".json", formValues,{
                                success:function(){
                                    $$(idTable).remove($$(idTable).getSelectedId());
                                    setLogValue("success","Данные успешно удалены");
                                },
                                error:function(text, data, XmlHttpRequest){
                                    ajaxErrorTemplate("012-000",XmlHttpRequest.status,XmlHttpRequest.statusText,XmlHttpRequest.responseURL);

                                }
                            }).catch(error => {
                                console.log(error);
                                ajaxErrorTemplate("012-000",error.status,error.statusText,error.responseURL);
                            });
                    });
                } catch (error){
                    console.log(error);
                    catchErrorTemplate("012-000", error);
                }
            },

            "wxi-angle-down":function(event, cell, target){
                try {
                    if (!($$("propTableView").isVisible()))   {
                        let id = cell.row;
                        let url;
                        let columns = $$("table-view").getColumns();

                        columns.forEach(function(el,i){
                            if (el.id == cell.column){
                                url=el.src;
                                let urlArgEnd = url.search("{");
                                url = url.slice(0,urlArgEnd)+id+".json"; 
                            }
                        });    

                        webix.ajax(url,{
                            success:function(text, data, XmlHttpRequest){
                                try {
                                    data = data.json().content;
                                    let arrayProperty = [];
                                    data.forEach(function(el,i){
                                        arrayProperty.push({type:"text", id:i+1,label:el.name, value:el.value})
                                    });
                                    $$("propTableView").define("elements", arrayProperty);
                                    $$("propTableView").show();
                      
                                    if ($$("propTableView").config.width < 200){
                                        $$("propTableView").config.width = 200;
                                        $$("propTableView").resize();
                                    }
                                    $$("propResize").show();
                                } catch (error){
                                    console.log(error);
                                    catchErrorTemplate("012-000", error);
                                }
                            },
                            error:function(text, data, XmlHttpRequest){
                                ajaxErrorTemplate("012-000",XmlHttpRequest.status,XmlHttpRequest.statusText,XmlHttpRequest.responseURL);


                            }
                        }).catch(error => {
                            console.log(error);
                            ajaxErrorTemplate("012-000",error.status,error.statusText,error.responseURL);
                        });
                    } else {
                        $$("propTableView").hide();
                        $$("propResize").hide();
                    }
                } catch (error){
                    console.log(error);
                    catchErrorTemplate("012-000", error);
                }

            },
            
        }
    };
}

function setCounterVal (){
    const tableCount = $$("table").count().toString();
    $$("table-findElements").setValues(tableCount);
}

function setDirtyProperty (){
    const prop = $$("editTableFormProperty");
    prop.config.dirty = false;
    prop.refresh();
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
            setFunctionError(err,"table","setViewDate")
        }
    }

    function setPropState(){
        try{
            const prop      = $$("editTableFormProperty");
            const form      = $$("table-editForm"); 
            const newAddBtn = $$("table-newAddBtnId");

            if (prop && !(prop.isVisible())){
                prop.show();

                if (window.innerWidth > 850){
                    form.config.width = 350;   
                    form.resize();
                }
            }

            if (!(newAddBtn.isEnabled())){
                newAddBtn.enable();
            }

            setDirtyProperty();
            setViewDate     ();

            prop.setValues(valuesTable);
        
            $$("table-saveNewBtn").hide();
            $$("table-saveBtn")   .show();
            $$("table-delBtnId")  .enable();

        } catch (err){   
            setFunctionError(err,"table","toEditForm => setPropState");
        }
    }

    setPropState();

}


function validateError (){
    validateProfForm ().forEach(function(el,i){

        let nameEl;
        try{
            $$("table").getColumns().forEach(function(col,i){
                if (col.id == el.nameCol){
                    nameEl = col.label;
                }
            });
        } catch (err){ 
            setFunctionError(err,"table","validateError")
        }
        setLogValue("error",el.textError+" (Поле: "+nameEl+")");
    });
}

function uniqueData (itemData){
    let validateData = {};

    try{
        Object.values(itemData).forEach(function(el,i){
            const oldValues    = $$("table").getItem(itemData.id)
            const oldValueKeys = Object.keys(oldValues);

            function compareVals (){
                let newValKey = Object.keys(itemData)[i];
                
                oldValueKeys.forEach(function(oldValKey){
                    
                    if (oldValKey == newValKey){
                        
                        if  (oldValues[oldValKey] !== Object.values(itemData)[i] ){
                            validateData[Object.keys(itemData)[i]] = Object.values(itemData)[i];
                        } 
                        
                    }
                }); 
            }
            compareVals ();
        });
    } catch (err){ 
        setFunctionError(err,"table","uniqueData")
    }
    return validateData;
}

function putData (nextItem, valuesProp, currId, editInForm=false){
   
    if (!(validateProfForm().length)){

        if (valuesProp.id){

            let sentValues;
            if (editInForm){
                sentValues = uniqueData (valuesProp);
            } else {
                sentValues = valuesProp;
            }

            const table   =  $$("table");
            const url     = "/init/default/api/"+currId+"/"+valuesProp.id;
            const putData =  webix.ajax().put(url, sentValues);
            
            putData.then(function(data){
                data = data.json();
                if (data.err_type == "i"){

                    setLogValue("success","Данные сохранены");
                    table.updateItem(valuesProp.id, valuesProp);
                    removeElem($$("propertyRefbtnsContainer"));

                    if (editInForm){
                        toEditForm(nextItem);
                        table.select(nextItem);
                    }
                } if (data.err_type == "e"){
                    setLogValue("error",data.error);
                }
            });

            putData.fail(function(err){
                setAjaxError(err, "table","putData");
            });
        
        }

    } else {
        validateError ();
    }
}


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
            setFunctionError(err,"table","onBeforeEditStop");
        }
    },

    onAfterSelect(id){

        function filterTableHide (){
            try{
                const filterContainer = $$("filterTableBarContainer");
                const filterForm      = $$("filterTableForm");
                const btnClass        = document.querySelector(".webix_btn-filter");

                hideElem(filterContainer);
                hideElem(filterForm);
      
                btnClass.classList.add   ("webix-transparent-btn");
                btnClass.classList.remove("webix-transparent-btn--primary");

            } catch (err){
                setFunctionError(err,"table","onAfterSelect => filterTableHide");
            }
        }


        function statePutEditForm (){
            
            try{
                const newAddBtn = $$("table-newAddBtnId");
                const editForm  = $$("table-editForm");

                showElem($$("editTableBarContainer"));

                if (newAddBtn){
                    newAddBtn.enable();
                }
           
                hideElem($$("EditEmptyTempalte"));

                if( !(editForm.isVisible()) ){
                    editForm.show();
                    filterTableHide ();
                }

            } catch (err){
                setFunctionError(err,"table","onAfterSelect => statePutEditForm")
            }
        }



        function adaptiveEditForm (){
            try {
                const form      = $$("table-editForm");
                const container = $$("container");

                if (container.$width < 850){

                    hideElem($$("tree"))

                    if (container.$width< 850){
                        hideElem($$("tableContainer"));

                        form.config.width = window.innerWidth;
                        form.resize();

                        showElem($$("table-backTableBtn"));
                    }
                  
                    showElem(form);
                    hideElem($$("EditEmptyTempalte"));
                }
            } catch (err){
                setFunctionError(err,"table","onAfterSelect => adaptiveEditForm");
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
                        removeElem($$("propertyRefbtnsContainer"));
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
                    setAjaxError(err, "table","onBeforeSelect => postNewData");
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
                            removeElem($$("propertyRefbtnsContainer"));
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
                setFunctionError(err,"table","onBeforeSelect => modalBoxTable")
            }
        }
 
        modalBoxTable ();

        if (property.config.dirty){
            return false;
        }
    },

    onAfterLoad:function(){
      
        // const idCurrView= this;
        // function getUserPrefs(){
        //     try{
        //         const idCurrTable = idCurrView.config.idTable;
        //         const storageData = webix.storage.local.get("visibleColsPrefs_"+idCurrTable);
        //         console.log(idCurrView.getColumns())
        //         if(storageData){
        //             storageData.forEach(function(el){

        //                 if(!el.value ){
        //                     console.log(el.id,idCurrView.isColumnVisible(el.id))
        //                     if(idCurrView.isColumnVisible(el.id)){
        //                         idCurrView.hideColumn(el.id);
        //                     }
                            
        //                 } else {
        //                     if( !( idCurrView.isColumnVisible(el.id) ) ){
        //                         idCurrView.showColumn(el.id);
        //                     }
        //                 }
        //             });
        //         }
        //     } catch (err){
        //         setFunctionError(err,"table","onAfterLoad => getUserPrefs");
        //     }
        // }

        // getUserPrefs()
        try {
            this.hideOverlay();

            defaultStateForm ();
        } catch (err){
            setFunctionError(err,"table","onAfterLoad")
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
      
        setCounterVal ();
        overlay ();
    },

    onAfterAdd: function() {
        setCounterVal ();
        this.hideOverlay();
    },
};


export {
    table,
    onFuncTable,
};
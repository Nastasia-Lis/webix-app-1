
 
import {defaultStateForm,createEditFields} from '../blocks/tableEditForm/states.js';
import {validateProfForm} from '../blocks/tableEditForm/validation.js';

import {catchErrorTemplate,ajaxErrorTemplate} from "../blocks/logBlock.js";
import {modalBox,popupExec} from "../blocks/notifications.js";
import {setLogValue} from '../blocks/logBlock.js';
import {setAjaxError,setFunctionError} from "../blocks/errors.js";

function getItemId (){
    let id;

    if ($$("tables").isVisible()){
        id = $$("table").config.idTable;
    } else if ($$("forms").isVisible()){
        id = $$("table-view").config.idTable;
    }
    return id;
}

function table (idTable, onFunc, editableParam=false) {
    return {
        view:"datatable",
        id: idTable,
        css:"webix_table-style webix_header_border webix_data_border",
        autoConfig: true,
        editable:editableParam,
        editaction:"dblclick",
        minHeight:350,
        datafetch:5,
        datathrottle: 5000,
        loadahead:100,
        footer: true,
      //  minWidth:500, 
        select:true,
      //  fillspace:true,
        resizeColumn: true,
       // autowidth:true,

      
        on:onFunc,
        onClick:{
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
    $$("table-findElements").setValues($$("table").count().toString());
}

function setDirtyProperty (){
    $$("editTableFormProperty").config.dirty = false;
    $$("editTableFormProperty").refresh();
}

function toEditForm (nextItem) {
    let valuesTable = $$("table").getItem(nextItem); 

    function setViewDate(){
        const parseDate = webix.Date.dateToStr("%d.%m.%y %H:%i:%s:%S");
        Object.values(valuesTable).forEach(function(el,i){
     
            if(el instanceof Date){
                const key   = Object.keys(valuesTable)[i];
                const value = parseDate(el);
                valuesTable[key] = value;
            }
          
        });
    }
    try {
   
        if ($$("editTableFormProperty") && !($$("editTableFormProperty").isVisible())){
            $$("editTableFormProperty").show();

            if (window.innerWidth > 850){
                $$("table-editForm").config.width = 350;   
                $$("table-editForm").resize();
            }
        }

        if (!($$("table-newAddBtnId").isEnabled())){
            $$("table-newAddBtnId").enable();
        }

        setDirtyProperty ();
        setViewDate();
        $$("editTableFormProperty").setValues(valuesTable);
      
        $$("table-saveNewBtn").hide();
        $$("table-saveBtn").show();
        $$("table-delBtnId").enable();
    } catch (error){
        console.log(error);
        setLogValue("error","toEditForm: "+error);
    }
}

function removePrefBtns (){
    if ($$("propertyRefbtnsContainer")){
        $$("propertyRefbtns").removeView($$("propertyRefbtnsContainer")) 
    }
}

function validateError (){
    validateProfForm ().forEach(function(el,i){

        let nameEl;

        $$("table").getColumns().forEach(function(col,i){
            if (col.id == el.nameCol){
                nameEl = col.label;
            }
        });

        setLogValue("error",el.textError+" (Поле: "+nameEl+")");
    });
}

function uniqueData (itemData){
    let validateData = {};
    Object.values(itemData).forEach(function(el,i){
        let oldValues = $$("table").getItem(itemData.id)
        let oldValueKeys = Object.keys(oldValues);

        function compareVals (){
            let newValKey = Object.keys(itemData)[i];
            
            oldValueKeys.forEach(function(oldValKey){
                
                if (oldValKey == newValKey){
                    
                    if (oldValues[oldValKey] !== Object.values(itemData)[i]){
                        validateData[Object.keys(itemData)[i]] = Object.values(itemData)[i];
                    } 
                    
                }
            }); 
        }
        compareVals ();
    });

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
        
            webix.ajax().put("/init/default/api/"+currId+"/"+valuesProp.id, sentValues, {
                success:function(text, data, XmlHttpRequest){
                    data = data.json();
                    if (data.err_type == "i"){
                        setLogValue("success","Данные сохранены");
                        $$( "table" ).updateItem(valuesProp.id, valuesProp);
                        removePrefBtns ();

                        if (editInForm){
                            toEditForm(nextItem);
                            $$("table").select(nextItem);
                        }
                    } if (data.err_type == "e"){
                        setLogValue("error",data.error);
                    }
                
                },
                error:function(text, data, XmlHttpRequest){
                    setLogValue("error","table function putData: "+XmlHttpRequest.status+" "+XmlHttpRequest.statusText+" "+XmlHttpRequest.responseURL);
                }
            }).catch(error => {
                console.log(error);
                setLogValue("error","table function putData ajax: "+error.status+" "+error.statusText+" "+error.responseURL);
            });
        }

    } else {
        validateError ();
    }
}

//----- table edit parameters
let onFuncTable = {
 
    // "onresize":webix.once(function(){
    //     this.adjustColumn("cdt", true);
    // }),
    onBeforeLoad:function(){
        this.showOverlay("Загрузка...");
    },
    
    onBeforeEditStop:function(state, editor, ignoreUpdate){
        let valuesProp = $$("table").getSelectedItem();
        let currId = getItemId ();
        try {
            if(state.value != state.old){
                let idRow = editor.row;
                let col = editor.column;
                let val =  state.value ;
                
                $$("table").updateItem(idRow, {[col]:val});
                $$("editTableFormProperty").setValues($$("table").getSelectedItem());
                putData ("", valuesProp, currId);

            }
        } catch (error){
            console.log(error);
            catchErrorTemplate("012-011", error);
        }
    },

    onAfterSelect(id){
        function adaptiveEditTableBtn (){
            if ($$("table-editTableBtnId").isVisible() && window.innerWidth > 1200){
                $$("table-editTableBtnId").hide();
            }
        }

        function filterTableHide (){
            try{
                if ($$("filterTableBarContainer") && $$("filterTableBarContainer").isVisible()){
                    $$("filterTableBarContainer").hide();
                }
                if ($$("filterTableForm") && $$("filterTableForm").isVisible()){
                    $$("filterTableForm").hide();
                }
                let btnClass = document.querySelector(".webix_btn-filter");
                btnClass.classList.add("webix-transparent-btn");
                btnClass.classList.remove("webix-transparent-btn--primary");
            } catch (err){
                setLogValue("error","table filterTableHide: "+err);
            }
        }

        function hideEmptyTemplate (){
            if ($$("EditEmptyTempalte")){
                $$("EditEmptyTempalte").hide();
            }
        }

        function statePutEditForm (){
            try{
                if ($$("editTableBarContainer") && !($$("editTableBarContainer").isVisible())){
                    $$("editTableBarContainer").show();
                }

                if ($$("table-newAddBtnId")){
                    $$("table-newAddBtnId").enable();
                }

                hideEmptyTemplate ();

                if(!($$("table-editForm").isVisible())){
                    $$("table-editForm").show();
                    filterTableHide ();
                }
            } catch (err){
                setLogValue("error","table statePutEditForm: "+err);
            }
        }

        function createEditPopup (){
            webix.ui({
                view:"popup",
                css:"webix_popup-table-container webix_popup-config",
                modal:true,
                id:"tableEditPopup",
                escHide:true,
                position:"center",
                body:{
                    id:"tableEditPopupContainer",rows:[

                    ]
                }
            }).show();
        }

        function initPopup (){
            try {
              
                $$("tableEditPopupContainer").addView($$("editTableBarAdaptive"));
                if($$("editTableBarHeadline") && !($$("editTableBarHeadline").isVisible())){
                    $$("editTableBarHeadline").show();
                }
            } catch (err){
                setLogValue("error","table initPopup: "+err);
            }
        } 

        function adaptiveEditForm (){
            try {
                if ($$("container").$width < 850){

                  
                    if ($$("tree") && $$("tree").isVisible()){
                        $$("tree").hide();
                    }

                    if ($$("container").$width< 850){
                        if ($$("tableContainer") && $$("tableContainer").isVisible()){
                            $$("tableContainer").hide();
                        }

                        $$("table-editForm").config.width = window.innerWidth;
                        $$("table-editForm").resize();

                        $$("table-backTableBtn").show();
                    }
                  

                    $$("table-editForm").show();
                 

                    hideEmptyTemplate ();
                }
            } catch (err){
                setLogValue("error","table adaptiveEditFormPopup: "+err);
            }
        }
        try {
         //  adaptiveEditTableBtn ();
            statePutEditForm ();
            adaptiveEditForm ();
        
        } catch (error){
            console.log(error);
            setLogValue("error","table onAfterSelect: "+error);
        }

  
    },
    
    onBeforeSelect:function(selection, preserve){
 
        const editPopup = document.querySelector(".edit-popup");

        if (editPopup){
            const idPopup = editPopup.getAttribute("view_id");
            $$(idPopup).hide();
        }
        let valuesProp = $$("editTableFormProperty").getValues();
        let currId = getItemId ();

        let nextItem = selection.id;

        function postNewData (nextItem,currId,valuesProp){
            if (!(validateProfForm().length)){
                
                webix.ajax().post("/init/default/api/"+currId, valuesProp,{
                    success:function(text, data, XmlHttpRequest){
                        data = data.json();
                        function tableUpdate (){
                            valuesProp.id = data.content.id;
                            $$("table").add(valuesProp);
                        }
                    
                        if (data.content.id !== null){
                            tableUpdate ();
                            toEditForm(nextItem);
                            removePrefBtns ();
                            $$("table").select(nextItem);
                            setLogValue("success","Данные успешно добавлены");
                        } else {

                            let errs = data.content.errors;
                            let msg = "";
                            Object.values(errs).forEach(function(err,i){
                                msg +=err+" (Поле: "+Object.keys(errs)[i] +"); ";
                            });

                            setLogValue("error",msg);
                        }
                        
                    },
                    error:function(text, data, XmlHttpRequest){
                        setLogValue("error","table modalBox (post new data): "+XmlHttpRequest.status+" "+XmlHttpRequest.statusText+" "+XmlHttpRequest.responseURL);
                    }
                });

            } else {
                validateError ();
            }
        }
 
 
        function modalBoxTable (){

    
            if ($$("editTableFormProperty").config.dirty){
                const prevSelect = $$("table").getSelectedId();
                modalBox().then(function(result){
                    const saveBtn  = $$("table-saveBtn");
                    // if(result == 0){
                    //     if (prevSelect){
                    //         $$("table").select(prevSelect);
                    //     }
                     
                    // }
                    if (result == 1){
                        toEditForm(nextItem);
                        $$("table").select(selection.id);
                        removePrefBtns ();
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
        }
 
        modalBoxTable ();

        if ($$("editTableFormProperty").config.dirty){
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

            if (!this.count()){
             //   this.showOverlay("Ничего не найдено");
            }

            defaultStateForm ();
        } catch (err){
            setFunctionError(err,"table","onAfterLoad")
        }
    },  
    onAfterDelete: function() {
        function overlay (){
            let tableId;
            if ($$("table").isVisible()){
                tableId = "table";
            } else if ($$("table-view").isVisible()){
                tableId = "table-view";
            }

            if (!$$(tableId).count()){
                $$(tableId).showOverlay("Ничего не найдено");
            }
            if ($$(tableId).count()){
                $$(tableId).hideOverlay();
            }
        }
        try {
            setCounterVal ();
            overlay ();

        } catch (error){
            console.log(error);
            setLogValue("error","table onAfterDelete: "+error);
        }
    },
    onAfterAdd: function() {
        try {
            setCounterVal ();
            this.hideOverlay();
        } catch (error){
            console.log(error);
            setLogValue("error","table onAfterAdd: "+error);
        }
    },
    onAfterRender:function(){
        //  maxWidth:100,

        // if (this.config.width !== 455){
        //    // this.define("width",window.innerWidth/3),
        //   // this.define("width",455);
        //   this.define("width",455),
        //     this.resize();
        //     console.log(this)
        // }
     
      
        function adaptiveBtnEditTable (){
            try{
                if (window.innerWidth < 1200 ){
                    if ($$("table-editTableBtnId") && !($$("table-editTableBtnId").isVisible())){
                    $$("table-editTableBtnId").show(); 
                    }
                }
            } catch (err){
                setLogValue("error","table adaptiveBtnEditTable: "+err);
            }
        }
        //adaptiveBtnEditTable ();
    }

    
 
};




export {
    table,
    onFuncTable,
};
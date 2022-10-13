import {defaultStateForm,createEditFields,validateProfForm} from "../blocks/editTableForm.js";
import {catchErrorTemplate,ajaxErrorTemplate} from "../blocks/logBlock.js";
import {modalBox,popupExec} from "../blocks/notifications.js";
import {setLogValue} from '../blocks/logBlock.js';


import {setHeadlineBlock} from '../blocks/blockHeadline.js';
import {toolbarFilterBtn} from "../blocks/filterTableForm.js";

import {setAjaxError,setFunctionError} from "../blocks/errors.js";


// function editBtnClick(idBtnEdit) {
//     try {

//         if (window.innerWidth > 1200){
//             let btnClass = document.querySelector(".webix_btn-filter");
//             $$("filterTableForm").hide();
//             $$("table-editForm").show();
//             btnClass.classList.add("webix-transparent-btn");
//             btnClass.classList.remove("webix-transparent-btn--primary");
//             $$(idBtnEdit).hide();
//             if ($$("editTableBarContainer") ){
//                 $$("editTableBarContainer").show();
//             }
//             if ($$("filterTableBarContainer") && $$("filterTableBarContainer").isVisible()){
//                 $$("filterTableBarContainer").hide();
//             }


//         } else {
//             if (!($$("tableEditPopup"))){
//                 webix.ui({
//                     view:"popup",
//                     css:"webix_popup-table-container webix_popup-config",
//                     modal:true,
//                     id:"tableEditPopup",
//                     escHide:true,
//                     position:"center",
//                     body:{
//                         id:"tableEditPopupContainer",rows:[

//                         ]
//                     }
//                 }).show();


//                 $$("tableEditPopupContainer").addView($$("editTableBarAdaptive"));

//                 if($$("editTableBarHeadline") && !($$("editTableBarHeadline").isVisible())){
//                     $$("editTableBarHeadline").show();
//                 }

//                 let size = window.innerWidth*0.7;
//                 if( $$("editTableBarAdaptive").$width > 200){
//                     $$("editTableBarAdaptive").config.width = size;
//                     $$("editTableBarAdaptive").resize();
//                 }

          
               
//             } else {
//                 $$("tableEditPopup").show();

//                 let size = window.innerWidth*0.7;
          
//                 if( $$("editTableBarAdaptive").$width > 200){
//                     $$("editTableBarAdaptive").config.width = size;
//                     $$("editTableBarAdaptive").resize();
//                 }

//                 if ($$("tableEditPopupContainer").getChildViews().length){
                    
//                     if (!($$("table-newAddBtnId").isEnabled())){
//                         $$("table-newAddBtnId").enable();
//                     }

//                     if ($$("editTableBarContainer") ){
//                         $$("editTableBarContainer").show();
//                     }

//                 } else {
//                     $$("tableEditPopupContainer").addView($$("editTableBarAdaptive"));

//                     if($$("editTableBarHeadline") && !($$("editTableBarHeadline").isVisible())){
//                         $$("editTableBarHeadline").show();
//                     }
//                 }
//             }
//             if($$("table-newAddBtnId")){
//                 if($$("table-saveNewBtn").isVisible() && $$("table-newAddBtnId").isEnabled()){
//                     $$("table-newAddBtnId").disable();
//                 } else {
//                     $$("table-newAddBtnId").enable();
//                 }
//             }
//         }
//     } catch (error){
//         console.log(error);
//         catchErrorTemplate("012-000", error);
//     }
// }

// function exportToExcel(idTable){
//     webix.toExcel(idTable, {
//       filename:"Table",
//       filterHTML:true,
//       styles:true
//     });
//     setLogValue("success","Таблица сохранена");
// }


// function tableToolbar (idTable,visible=false) {

//     let idExport         = idTable+"-exportBtn",
//         idBtnEdit        = idTable+"-editTableBtnId",
//         idFindElements   = idTable+"-findElements",
//         idFilterElements = idTable+"-idFilterElements",
//         idFilter         = idTable+"-filterId",
//         idHeadline       = idTable+"-templateHeadline"
//     ;

//     return { 
        
//         rows:[
//             setHeadlineBlock(idHeadline),

//             {//id:"filterBar", 
//             css:"webix_filterBar",
//             padding:{
//                 bottom:4,
//                // right:10
//             }, 
//             height: 40,
//           //  margin:5, 
                
//                 cols: [
//                     toolbarFilterBtn(idTable,idBtnEdit,idFilter,visible),
//                 // {   view:"button",
//                 //     width: 50, 
//                 //     type:"icon",
//                 //     id:idFilter,
//                 //     hidden:visible,
//                 //     icon:"fas fa-filter",
//                 //     css:"webix_btn-filter webix-transparent-btn ",
//                 //     disabled:true,
//                 //     title:"текст",
//                 //     height:42,
//                 //     click:function(){
//                 //         filterBtnClick(idTable,idBtnEdit);
//                 //     },
//                 //     on: {
//                 //         onAfterRender: function () {
//                 //             this.getInputNode().setAttribute("title","Показать/скрыть фильтры");
//                 //         }
//                 //     } 
//                 // },
//                 {   view:"button",
//                     maxWidth:200, 
//                     value:"<span class='webix_icon fas fa-pen'></span><span style='padding-left: 5px'>Редактор таблицы</span>",
//                     id:idBtnEdit,
//                     hidden:true,
//                     css:"webix_btn-edit",
//                     title:"текст",
//                     height:42,
//                     click:function(){
//                         editBtnClick(idBtnEdit);
//                     },
//                     on: {
//                         onAfterRender: function () {
//                             if(idTable !== "table" && this.isVisible()){
//                                 this.hide();
//                             }
//                             this.getInputNode().setAttribute("title","Редактировать таблицу");
//                         }
//                     } 
//                 },
//                 {},

//                 {   view:"button",
//                     width: 50, 
//                     type:"icon",
//                     id:idExport,
//                     hidden:visible,
//                     icon:"fas fa-circle-down",
//                     css:"webix_btn-download webix-transparent-btn",
//                     title:"текст",
//                     height:42,
//                     click:function(){
//                         exportToExcel(idTable)
//                     },
//                     on: {
//                         onAfterRender: function () {
//                             this.getInputNode().setAttribute("title","Экспорт таблицы");
//                         }
//                     } 
//                 },


//                 ],
//             },

//             {cols:[
//                 {   view:"template",
//                     id:idFindElements,
//                     css:"webix_style-template-count",
//                     height:30,
//                     template:function () {
//                         if (Object.keys($$(idFindElements).getValues()).length !==0){
//                             return "<div style='color:#999898;'> Общее количество записей:"+
//                                     " "+$$(idFindElements).getValues()+
//                                     " </div>";
//                         } else {
//                             return "";
//                         }
//                     }
                 
//                 },

//                 {   view:"template",
//                     id:idFilterElements,
//                     css:"webix_style-template-count",
//                     height:30,
//                     template:function () {
//                         if (Object.keys($$(idFilterElements).getValues()).length !==0){
                            
//                             return "<div style='color:#999898;'>Видимое количество записей:"+
//                                     " "+$$(idFilterElements).getValues()+
//                                     " </div>";
//                         } else {
//                             return "";
//                         }
//                     }
//                 },

//             ]},
//         ]

        
//     };
// }

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
        resizeColumn: true,
        autoConfig: true,
        editable:editableParam,
        editaction:"dblclick",
        minHeight:350,
        datafetch:5,
        datathrottle: 5000,
        loadahead:100,
        footer: true,
        minWidth:500, 
        select:true,
        minColumnWidth:200,
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
    try {
   
        if ($$("editTableFormProperty") && !($$("editTableFormProperty").isVisible())){
            $$("editTableFormProperty").show();
        }

        if (!($$("table-newAddBtnId").isEnabled())){
            $$("table-newAddBtnId").enable();
        }

        setDirtyProperty ();

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
            if ($$("EditEmptyTempalte") && $$("EditEmptyTempalte").isVisible()){
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

        function adaptiveEditFormPopup (){
            try {
                if (window.innerWidth < 1200){

                    if (!($$("tableEditPopup"))){
                        
                        createEditPopup ();
                        initPopup ();

                    } else {
                        $$("tableEditPopup").show();
       
                        if (!($$("tableEditPopupContainer").getChildViews().length)){
                            initPopup ();
                        }
             
                    }

                
                    hideEmptyTemplate ();
                }
            } catch (err){
                setLogValue("error","table adaptiveEditFormPopup: "+err);
            }
        }
        try {
            adaptiveEditTableBtn ();
            statePutEditForm ();
            adaptiveEditFormPopup ();
        
        } catch (error){
            console.log(error);
            setLogValue("error","table onAfterSelect: "+error);
        }

  
    },
    onBeforeSelect:function(selection, preserve){
        const editPopup = document.querySelector(".edit-popup");

        if (editPopup){
            const idPopup = editPopup.getAttribute("view_id");
            console.log($$(idPopup))
            $$(idPopup).hide();
            console.log($$(idPopup))
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
                
                modalBox().then(function(result){
                    const saveBtn  = $$("table-saveBtn");
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
    },
    onAfterLoad:function(){
        try {
            this.hideOverlay();

            if (!this.count()){
                this.showOverlay("Ничего не найдено");
            }

            defaultStateForm ();
        } catch (error){
            console.log(error);
            catchErrorTemplate("012-000", error);
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
        adaptiveBtnEditTable ();
    }

    
 
};


export {
    table,
    onFuncTable,
};
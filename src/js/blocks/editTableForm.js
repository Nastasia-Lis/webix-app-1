import {getComboOptions} from './content.js';
import {headerContextId} from '../components/header.js';
import {tableNames} from "./router.js";
import {catchErrorTemplate,ajaxErrorTemplate,setLogValue} from "./logBlock.js";
import {modalBox, popupExec} from "./notifications.js";

let currId;

//let editTableBar;

function getCurrId (){
    let itemTreeId = $$("tree").getSelectedItem().id;
    if ( itemTreeId.length == 0){
        currId=headerContextId;
    } else {
        if (itemTreeId.includes("-single")){
            let singleIndex = itemTreeId.search("-single");
            itemTreeId = itemTreeId.slice(0,singleIndex)
        }
        
        currId=itemTreeId;
        
    }
}

function validateProfForm (){

    let errors = {};

    Object.keys($$("editTableFormProperty").getValues()).forEach(function(el,i){
        let propElement = $$("editTableFormProperty").getItem(el);
        let values = $$("editTableFormProperty").getValues();
        errors[el] = {};
 
        if (values[el].length >= propElement.length ){
            errors[el].length = "Длина строки не должна превышать "+propElement.length+" симв.";
        } else {
            errors[el].length = null;
        }


        if (propElement.notnull==true && values[el].length == 0 ){
            errors[el].notnull = "Поле не может быть пустым";
        } else {
            errors[el].notnull = null;
        }

        errors[el].unique = null;
        if (propElement.unique==true){
            let tableRows = Object.values($$("table").data.pull);
            tableRows.forEach(function(row,i){
                if (values[el].localeCompare(row[el]) == 0 && row.id !== $$("table").getSelectedId().id){
                    errors[el].unique = "Поле должно быть уникальным";
                }
            });
        }

    });
    console.log(errors)
}

//--- bns
function saveItem(addBtnClick=false){    
    try{    
        getCurrId ();
        let itemData = $$("editTableFormProperty").getValues();   
       

       // validateProfForm ()

        if(Object.values( $$("editTableFormProperty").getValues()).length){
            if( itemData.id ) {
                webix.ajax().put("/init/default/api/"+currId+"/"+itemData.id, itemData, {
                    success:function(text, data, XmlHttpRequest){
                        data = data.json();
                        $$( "table" ).updateItem(itemData.id, itemData);
                        defaultStateForm();
                        $$("table").clearSelection();
                        $$("editTableFormProperty").clear();
                        if (!(addBtnClick)){
                            $$("table-newAddBtnId").enable();
                        if ($$("EditEmptyTempalte")&&!($$("EditEmptyTempalte").isVisible())){
                            $$("EditEmptyTempalte").show();
                        }
                            
                        } else {
                            $$("table").filter(false);
                            createEditFields("table-editForm");
                            $$("table-delBtnId").disable(); 
                            $$("table-saveBtn").hide();
                            $$("table-saveNewBtn").show();
                        }

                        $$("editTableFormProperty").config.dirty = false;
                        $$("editTableFormProperty").refresh();
 

                        if (data.err_type == "i"){
                            
                            if (window.innerWidth < 1200 && $$("tableEditPopup")){
                                $$("tableEditPopup").hide();
                            }

                            setLogValue("success","Данные сохранены");
                        } if (data.err_type == "e"){
                            setLogValue("error",data.error);
                        }
                    
                    },
                    error:function(text, data, XmlHttpRequest){
                        ajaxErrorTemplate("003-011",XmlHttpRequest.status,XmlHttpRequest.statusText,XmlHttpRequest.responseURL);
                    }
                }).catch(error => {
                    console.log(error);
                    ajaxErrorTemplate("003-011",error.status,error.statusText,error.responseURL);
                });
            }    
    
        } else {
            setLogValue("error","Заполните пустые поля");
        }
    }catch (error){
        catchErrorTemplate("003-000", error);
    }

}

function addItem () {
    try {

        let emptyProps = true;

        $$("editTableFormProperty").config.dirty = true;
        $$("editTableFormProperty").refresh();

        Object.values($$("editTableFormProperty").getValues()).forEach(function(el,i){
            if ( el.length){
                if (emptyProps){
                    emptyProps = false;
                }
                modalBox().then(function(result){
                    if (result == 1){
                        $$("table").filter(false);
                        createEditFields("table-editForm");
                        $$("table-delBtnId").disable();
                        $$("table-saveBtn").hide();
                        $$("table-saveNewBtn").show();
                    
                    } else if (result == 2){
                        saveItem(true);
    
                    }
                });
            } 
        });

        if(emptyProps){
            if ($$("EditEmptyTempalte")&&$$("EditEmptyTempalte").isVisible()){
                $$("EditEmptyTempalte").hide();
            }

            if ($$("editTableFormProperty") && !($$("editTableFormProperty").isVisible())){
                $$("editTableFormProperty").show();
            }

            $$("table").clearSelection();
            $$("table").filter(false);
            $$("table").hideOverlay("Ничего не найдено");
            createEditFields("table-editForm");
            $$("table-delBtnId").disable();
            $$("table-saveBtn").hide();
            $$("table-saveNewBtn").show();
            $$("table-newAddBtnId").disable();
        }
    }catch (error){
        catchErrorTemplate("003-000", error);
    }


}

function saveNewItem (){
    try{
        getCurrId ();
        
        if(Object.values( $$("editTableFormProperty").getValues()).length) {
            
            let newValues = $$("editTableFormProperty").getValues();

            webix.ajax().post("/init/default/api/"+currId, newValues,{
                success:function(text, data, XmlHttpRequest){
                    data = data.json();
                 
                    newValues.id = data.content.id;

                    $$("table").add(newValues);
                    $$("editTableFormProperty").clear();
                    defaultStateForm ();
                 
   
                    $$("table-newAddBtnId").enable();
                    if ($$("EditEmptyTempalte")&&!($$("EditEmptyTempalte").isVisible())){
                        $$("EditEmptyTempalte").show();
                    }

                    
                    $$("editTableFormProperty").config.dirty = false;
                    $$("editTableFormProperty").refresh();

                    if (data.err_type == "i"){
                        if (window.innerWidth < 1200 && $$("tableEditPopup")){
                            $$("tableEditPopup").hide();
                        }
                        setLogValue("success","Данные успешно добавлены");
                    } else if (data.err_type == "e"){
                        setLogValue("error",data.error);
                    }
                    
                },
                error:function(text, data, XmlHttpRequest){
                    ajaxErrorTemplate("003-001",XmlHttpRequest.status,XmlHttpRequest.statusText,XmlHttpRequest.responseURL);
                }
            }).catch(error => {
                console.log(error);
                ajaxErrorTemplate("003-001",error.status,error.statusText,error.responseURL);
            });
           
        } else {
            setLogValue("error","Форма пуста");
        }
    }catch (error){
        catchErrorTemplate("003-000", error);
    }
   
}

function removeItem() {
    try{
        getCurrId ();
        popupExec("Запись будет удалена").then(
            function(){
               
                $$( "table" ).remove($$( "table" ).getSelectedId().id);
               
                let formValues = $$("editTableFormProperty").getValues();
                
                webix.ajax().del("/init/default/api/"+currId+"/"+formValues.id+".json", formValues,{
                    success:function(text, data, XmlHttpRequest){
                        data = data.json();
                        defaultStateForm ();
                       
                        if (window.innerWidth < 1200 && $$("tableEditPopup")){
                            $$("tableEditPopup").hide();
                        }
                        $$("editTableFormProperty").config.dirty = false;
                        $$("editTableFormProperty").refresh();
                        
                        if (data.err_type == "i"){
                            if (window.innerWidth < 1200 && $$("tableEditPopup")){
                                $$("tableEditPopup").hide();
                            }
                            setLogValue("success","Данные успешно удалены");
                        } if (data.err_type == "e"){
                            setLogValue("error",data.error);
                        }
                       
                    },
                    error:function(text, data, XmlHttpRequest){
                        ajaxErrorTemplate("003-002",XmlHttpRequest.status,XmlHttpRequest.statusText,XmlHttpRequest.responseURL);
                    }
                }).catch(error => {
                    console.log(error);
                    ajaxErrorTemplate("003-002",error.status,error.statusText,error.responseURL);
                });
                
        });
    }catch (error){
        catchErrorTemplate("003-000", error);
    }
    
}


//--- bns




//--- components

function createEditFields (parentElement) {


    try {
        let columnsData = $$("table").getColumns();
        
        if(Object.keys($$(parentElement).elements).length==0  ){
            let inputsArray = [];
  
            columnsData.forEach((el,i) => {
         
  
                if (el.type == "datetime"){
                    inputsArray.push({   
                        id:el.id,
                        format:webix.Date.dateToStr("%d.%m.%Y %H:%i:%s"),
                        label:el.label, 
                        type:"date",
                        unique: el.unique,
                        notnull: el.notnull,
                        length:el.length,
                        default:el.default,
                    });
                } 
                

            else if (el.type.includes("reference")) {
                let findTableId = el.type.slice(10);

                inputsArray.push(
                    {   type:"combo",
                        label:el.label, 
                        css:el.id+"_container",
                        id:el.id,
                        unique: el.unique,
                        notnull: el.notnull,
                        length:el.length,
                        default:el.default,
                        options: getComboOptions(findTableId),
                        template:function(obj, common, val, config){
                            let item = config.collection.getItem(obj.value);
                            return item ? item.value : "";
                        },
                    },

                );

                
            } else if (el.type.includes("boolean")) {
               
                // inputsArray.push(
                //     {cols:[
                //     {   view:"combo",
                //         placeholder:"Выберите вариант",  
                //         label:el.label, 
                //         id:el.id,
                //         name:el.id, 
                //         labelPosition:"top",
                //         options:[
                //             {id:1, value: "Да"},
                //             {id:2, value: "Нет"}
                //         ],
                //         on:{
                //             onItemClick:function(){
                //                 $$(parentElement).clearValidation();
                //             },
                //         }
                //     },
                    
                //     ]}

                // );
                
                inputsArray.push(
                    {   type:"select",
                        label:el.label, 
                        id:el.id,
                        unique: el.unique,
                        notnull: el.notnull,
                        length:el.length,
                        default:el.default,
                        options:[
                            {id:1, value: "Да"},
                            {id:2, value: "Нет"}
                        ],

                    },

                );
                
            } else if (el.type.includes("integer")) {

                // inputsArray.push(
                //     {cols:[
                //         {
                //             view:"text", 
                //             name:el.id,
                //             id:el.id, 
                //             label:el.label, 
                //             labelPosition:"top",
                //             invalidMessage:"Поле поддерживает только числовой формат",
                //             on:{
                //                 onKeyPress:function(){
                //                     $$(parentElement).clearValidation();
                //                 }
                //             },
                //             validate:function(val){
                //                 return !isNaN(val*1);
                //             }
                //         },
                    
                //     ]}

                // );

                inputsArray.push(
                    {
                        type:"text", 
                        id:el.id, 
                        label:el.label,
                        unique: el.unique,
                        notnull: el.notnull,
                        length:el.length,
                        default:el.default,
                      
                        on:{
                            onKeyPress:function(){
                                $$(parentElement).clearValidation();
                            }
                        },
                        validate:function(val){
                            return !isNaN(val*1);
                        }
                    }

                );
                
            } else {
                    inputsArray.push(
                        {
                        id:el.id, 
                        label:el.label, 
                        type:"text",
                        unique: el.unique,
                        notnull: el.notnull,
                        length:el.length,
                        default:el.default,
                        }
                    );
                }
             
            });
      
            if(parentElement=="table-editForm"){
                $$("table-delBtnId").enable();
            }   
            $$("editTableFormProperty").define("elements", inputsArray);

            let propertyElems = $$("editTableFormProperty").config.elements;

            if (!($$("propertyRefbtns")._cells.length)){
                if (!$$("propertyRefbtnsContainer")){
                    $$("propertyRefbtns").addView({id:"propertyRefbtnsContainer",rows:[]})
                }
                propertyElems.forEach(function(el,i){
                    if (el.type == "combo"){
                        $$("propertyRefbtnsContainer").addView({ 
                            view:"button", 
                            value:"1187", 
                            type:"icon",
                            width:30,
                            height:30,
                            icon: 'wxi-angle-right',
                            on: {
                                onAfterRender: function () {
                                // this.getInputNode().setAttribute("title","Перейти в таблицу"+" "+"«"+refTableName+"»");
                                this.getInputNode().setAttribute("title","Перейти в родительскую таблицу");
                                },
                            },
                            click:function (){
                                $$("table").getColumns().forEach(function(col,i){
                                
                                    if (col.id == el.id){
                                        let refTable =  col.type.slice(10);
                                        try {
                                            $$("tree").select(refTable);
            
                                            if ($$("tableEditPopup") && $$("tableEditPopup").isVisible()){
                                                $$("tableEditPopup").hide();
                                            }
                                        } catch (e){
                                            console.log(e);
                                            setLogValue("error","Таблица не найдена");
            
                                            if ($$("EditEmptyTempalte")&&$$("EditEmptyTempalte").isVisible()){
                                                $$("EditEmptyTempalte").hide();
                                            }
                                        }
                                    }

                                });
                            }
                        })
                    } else {
                        $$("propertyRefbtnsContainer").addView({height:29,width:1})
                    }
                });
            }

        } else {
            $$(parentElement).clear();
            $$(parentElement).clearValidation();

            if(parentElement=="table-editForm"){
                $$("table-delBtnId").enable();
            }
        }
    } catch (error){
        catchErrorTemplate("003-000", error);
    }
}

function defaultStateForm () {
    if ($$("table-saveNewBtn").isVisible()) {
        $$("table-saveNewBtn").hide();
    } else if ($$("table-saveBtn").isVisible()){
        $$("table-saveBtn").hide();
    }
    $$("table-delBtnId").disable();

    if ($$("editTableFormProperty") && $$("editTableFormProperty").isVisible()){
        $$("editTableFormProperty").hide();
    }

}

//--- components




function editTableBar (){
    return {id:"editTableBarContainer",rows:[
        {id:"editTableBarAdaptive", rows:[
            {id:"editTableBarHeadline",hidden:true,cols:[
                {  template:"Редактор записей",height:30, 
                    css:"table-edit-headline",
                    borderless:true,
                },
                {
                    view:"button",
                    id:"buttonClosePopupTableEdit",
                    css:"webix_close-btn",
                    type:"icon",
                    hotkey: "esc",
                    width:25,
                    icon: 'wxi-close',
                    click:function(){
                        if($$("table-editForm")){
                            if($$("table-editForm").isDirty()){
                                modalBox().then(function(result){
                                    if (result == 1){
                                        $$("table-editForm").clear();
                                        if ($$("tableEditPopup")){
                                            $$("tableEditPopup").hide();
                                        }
                                    } else if (result == 2){
                                        if ($$("table-editForm").validate()){
                                            if ($$("table-editForm").getValues().id){
                                                saveItem();
                                            } else {
                                                saveNewItem(); 
                                            }
                                            $$("table-editForm").clear();
                                            $$("table-delBtnId").enable();
                                            if ($$("tableEditPopup")){
                                                $$("tableEditPopup").hide();
                                            }
                                        
                                        } else {
                                            setLogValue("error","Заполните пустые поля");
                                            return false;
                                        }
                                        
                                    }
                                });

                               
                            } else {

                                if ( $$("inputsTable")){
                                    $$("inputsTable").getParentView().removeView($$("inputsTable"))
                                }

                                $$("table").filter(false);
                            
                                $$("table-delBtnId").disable();
                                $$("table-saveBtn").hide();
                                $$("table-saveNewBtn").hide();

                                if ($$("tableEditPopup")){
                                    $$("tableEditPopup").hide();
                                }
                                
                            }
                        }
                    }
                }
            ]},
            {
                view:"form", 
                id:"table-editForm",
                css:"webix_form-edit",
                minHeight:350,
                minWidth:210,
                width: 320,
                scroll:true,
                borderless:true,
                elements:[
                    {
                        minHeight:48,
                        css:"webix_form-adaptive", 
                        margin:5, 
                        rows:[{
                            margin:5, 
                            rows:[
                                {
                                    margin:5, 
                    
                                    cols: [
                                        {   view:"button",
                                            id:"table-newAddBtnId",
                                            height:48,
                                            minWidth:90, 
                                            disabled:true,
                                            hotkey: "shift",
                                            value:"Новая запись", click:addItem
                                        },
                                            
                                        {   view:"button",
                                            id:"table-delBtnId",
                                            disabled:true,
                                            height:48,
                                            minWidth:90,
                                            width:100,
                                            hotkey: "shift+esc",
                                            css:"webix_danger", 
                                            type:"icon", 
                                            icon:"wxi-trash", 
                                            click:removeItem,
                                            on: {
                                                onAfterRender: function () {
                                                    this.getInputNode().setAttribute("title","Удалить запись из таблицы");
                                                }
                                            } 
                                        },
                                    ]
                                },
                        
                            ]
                            },
                
                            {   margin:10, 
                                rows:[ 
                                    { 
                                        view:"button", 
                                        id:"table-saveBtn",
                                        hidden:true, 
                                        value:"Сохранить", 
                                        height:48, 
                                        css:"webix_primary", 
                                        click:function(){
                                            saveItem();
                                        },
                                        hotkey: "enter" 
                                    },
                                    { 
                                        view:"button", 
                                        id:"table-saveNewBtn",
                                        value:"Сохранить новую запись",
                                        hidden:true,  
                                        height:48,
                                        hotkey: "enter" ,
                                        css:"webix_primary", 
                                        click:saveNewItem,
                                    },
                                    {   id:"EditEmptyTempalte",
                                        template:"<div style='color:#858585;font-size:13px!important'>Добавьте новую запись или выберите существующую из таблицы</div>", 
                                        borderless:true
                                    },
                                ]
                            },

                        ]
                    },

                    { borderelss:true,cols:[

                    {   view:"property",  
                        id:"editTableFormProperty", 
                        css:"webix_edit-table-form-property",
                        borderelss:true,
                        dirty:false,
                        elements:[],
                        on:{
                            onEditorChange:function(id, value){
                                let item = $$("editTableFormProperty").getItem(id);
                                item.value = value;
                                $$("editTableFormProperty").updateItem(id);

                                $$("editTableFormProperty").config.dirty = true;
                                $$("editTableFormProperty").refresh();
                            }
                        }
                    },
                    {   id:"propertyRefbtns",  
                        rows:[]
                    }

                    ]}
            
                ],
                
                rules:{
                    $all:webix.rules.isNotEmpty
                },
            
            
                ready:function(){
                    this.validate();
                },
            
            }
        ]}
    ]}
}

try{


} catch (error){
    alert("Ошибка при выполнении"+" "+ error);
    console.log(error);
    window.stop();
   
}

    
export{
    editTableBar,
    createEditFields,
    defaultStateForm,
    saveItem,
    saveNewItem
};

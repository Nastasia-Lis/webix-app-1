import {getComboOptions} from './content.js';
import {headerContextId} from '../components/header.js';
import {catchErrorTemplate,ajaxErrorTemplate,setLogValue} from "./logBlock.js";
import {modalBox, popupExec} from "./notifications.js";
import  {STORAGE,getData} from "./globalStorage.js";

let currId;

//let editTableBar;

function getCurrId (){
    if ($$("tree").getSelectedItem() !== undefined){
        let itemTreeId = $$("tree").getSelectedItem().id;
        if ( itemTreeId.length == 0){
            currId=headerContextId;
        } else {
            currId=itemTreeId;
        }
    } else {
        let href = window.location.pathname;
        let index = href.lastIndexOf('/');
        currId = href.slice(index+1);
    }
}

function validateProfForm (){
    // нулевое поле, уникальное и длина

    let errors = {};

    Object.keys($$("editTableFormProperty").getValues()).forEach(function(el,i){
        let propElement = $$("editTableFormProperty").getItem(el);
        let values = $$("editTableFormProperty").getValues();
        errors[el] = {};
 
        if (values[el].length > propElement.length ){
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

    let messageErrors = [];
    Object.values(errors).forEach(function(col,i){
 

        Object.values(col).forEach(function(error,e){
         
            if (error !== null){
                let nameCol = Object.keys(errors)[i];
                let textError = error;
                let typeError = Object.keys(col)[e];
                messageErrors.push({nameCol,typeError,textError})
            }
            
        });
    });

    return messageErrors;
}

//--- bns
function saveItem(addBtnClick=false, modalSidebar=false, modalTable=false){    

    try{    
        getCurrId ();
        let itemData = $$("editTableFormProperty").getValues();   
         
        if (!(validateProfForm().length)){

            //if(Object.values( $$("editTableFormProperty").getValues()).length){
                if( itemData.id ) {
                    webix.ajax().put("/init/default/api/"+currId+"/"+itemData.id, notNullData (itemData), {
                        success:function(text, data, XmlHttpRequest){
                            data = data.json();

                            if (!modalSidebar){
                                $$( "table" ).updateItem(itemData.id, itemData);
                                if(!modalTable){
                                    $$("table").clearSelection();
                                    $$("editTableFormProperty").clear();
                                    defaultStateForm();
                                    if (!addBtnClick ){
                                        $$("table-newAddBtnId").enable();
                                        if ($$("EditEmptyTempalte")&&!($$("EditEmptyTempalte").isVisible())){
                                            $$("EditEmptyTempalte").show();
                                        }

                                        $$("editTableFormProperty").config.dirty = false;
                                        $$("editTableFormProperty").refresh();
                                        
                                    } else {
                                        if (!($$("editTableFormProperty").isVisible())){
                                            $$("editTableFormProperty").show();
                                        }

                                        $$("table").filter(false);
                                        createEditFields("table-editForm");
                                        $$("table-delBtnId").disable(); 
                                        $$("table-saveBtn").hide();
                                        $$("table-saveNewBtn").show();

                                    
                                    }
                                }
                        
                            }

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
        
            // } else {
            //     setLogValue("error","Заполните пустые поля");
            // }
        } else {
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
    }catch (error){
        catchErrorTemplate("003-000", error);
    }

}

function addItem () {
    try {

        if ($$("editTableFormProperty").config.dirty == true){
            modalBox().then(function(result){
                if (result == 1){
                    $$("table").filter(false);
                    createEditFields("table-editForm");
                    $$("table-delBtnId").disable();
                    $$("table-saveBtn").hide();
                    $$("table-saveNewBtn").show();
                    $$("editTableFormProperty").config.dirty = false;
                    $$("editTableFormProperty").refresh();
                
                } else if (result == 2){
                    saveItem(true);
                  
                    $$("editTableFormProperty").config.dirty = false;
                    $$("editTableFormProperty").refresh();


                }
            });
        } else {
            if ($$("EditEmptyTempalte")&&$$("EditEmptyTempalte").isVisible()){
                $$("EditEmptyTempalte").hide();
            }

            if ($$("editTableFormProperty") && !($$("editTableFormProperty").isVisible())){
                $$("editTableFormProperty").show();
            }

            $$("editTableFormProperty").clear();

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

function saveNewItem (modalTable=false){
    try{
        getCurrId ();
     
        if (!(validateProfForm().length)){
            
            let newValues = $$("editTableFormProperty").getValues();

            webix.ajax().post("/init/default/api/"+currId, newValues,{
                success:function(text, data, XmlHttpRequest){
                    data = data.json();
                    if (data.content.id !== null){
                        newValues.id = data.content.id;

                        $$("table").add(newValues);
                        if (!modalTable){
                            $$("editTableFormProperty").clear();
                            defaultStateForm ();
                        
                        
                            $$("table-newAddBtnId").enable();
                            
                            $$("editTableFormProperty").config.dirty = false;
                            $$("editTableFormProperty").refresh();
                        }
                        if (data.err_type == "i"){
                            if (window.innerWidth < 1200 && $$("tableEditPopup")){
                                $$("tableEditPopup").hide();
                            }
                            setLogValue("success","Данные успешно добавлены");
                        } else if (data.err_type == "e"){
                            setLogValue("error",data.error);
                        }
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
                    ajaxErrorTemplate("003-001",XmlHttpRequest.status,XmlHttpRequest.statusText,XmlHttpRequest.responseURL);
                }
            }).catch(error => {
                console.log(error);
                ajaxErrorTemplate("003-001",error.status,error.statusText,error.responseURL);
            });

        } else {
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
                        ajaxErrorTemplate("Ошибка удаления записи: ",XmlHttpRequest.status,XmlHttpRequest.statusText,XmlHttpRequest.responseURL);
                    }
                }).catch(error => {
                    console.log(error);
                    ajaxErrorTemplate("Ошибка удаления записи: ",error.status,error.statusText,error.responseURL);
                });
                
        });
    }catch (error){
        catchErrorTemplate("Ошибка удаления записи: ", error);
    }
    
}


//--- bns




//--- components

function notNullData (itemData){
    let validateData = {};
    Object.values(itemData).forEach(function(el,i){
        if (el.length !== 0){
            validateData[Object.keys(itemData)[i]] = el;
        }
    });
    return validateData;
}

function createEditFields (parentElement) {


    try {
        let columnsData = $$("table").getColumns();
        
        if(Object.keys($$(parentElement).elements).length==0  ){
            let inputsArray = [];
  
            columnsData.forEach((el,i) => {

                function defValue (){

                    function createGuid() {  
                        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {  
                            var r = Math.random()*16|0, v = c === 'x' ? r : (r&0x3|0x8);
                            return v.toString(16);  
                        });  
                    }

                    function dateFormatting (){
                        return new Date(el.default);
                    }

                    let formatData = webix.Date.dateToStr("%d.%m.%Y %H:%i:%s");

                    let defVal;

                    if (el.default === "now"){
                        defVal = new Date();
                    } else if (Date.parse(new Date(el.default)) && el.default.length > 10 ){
                        defVal = formatData(dateFormatting ());
                    } else if (el.default.includes("make_guid")) {
                        defVal = createGuid();
                    }  else if (el.default == "False"){
                        defVal = 2;
                    } else if (el.default == "True"){
                        defVal = 1;
                    } else if (el.default !== "None"){
                        defVal = el.default;
                    }

                    return defVal;
                }
         
             
                if (el.type == "datetime"){
                    inputsArray.push({   
                        id:el.id,
                        format:webix.Date.dateToStr("%d.%m.%Y %H:%i:%s"),
                        label:el.label, 
                        type:"date",
                        unique: el.unique,
                        notnull: el.notnull,
                        length:el.length,
                        value: defValue ()
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
                        value: defValue (),
                        options: getComboOptions(findTableId),
                        template:function(obj, common, val, config){
                            let item = config.collection.getItem(obj.value);
                            return item ? item.value : "";
                        },
                    },

                );

                
            } else if (el.type.includes("boolean")) {

                inputsArray.push(
                    {   type:"select",
                        label:el.label, 
                        id:el.id,
                        unique: el.unique,
                        notnull: el.notnull,
                        length:el.length,
                        value: defValue (),
                        options:[
                            {id:1, value: "Да"},
                            {id:2, value: "Нет"}
                        ],

                    },

                );
                
            } else if (el.type.includes("integer")) {
                inputsArray.push(
                    {
                        type:"text", 
                        id:el.id, 
                        label:el.label,
                        unique: el.unique,
                        notnull: el.notnull,
                        length:el.length,
                        customType:"integer",
                        value: defValue (),
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
                        value: defValue (),
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
                            type:"icon",
                            width:30,
                            height:28,
                            icon: 'wxi-angle-right',
                            on: {
                                onAfterRender: function () {
                                this.getInputNode().setAttribute("title","Перейти в родительскую таблицу");
                                },
                            },
                            click:function (){

                                function setRefTable (){

                                    async function toRefTable (refTable){ 

                                        if (!STORAGE.fields){
                                            await getData("fields"); 
                                        }
                                
                                        if (STORAGE.fields){
                                            if (refTable){
                                                Backbone.history.navigate("tree/"+refTable, { trigger:true});
                                                window.location.reload()
                                            }
 
                                        }
                                    }
                                    $$("table").getColumns().forEach(function(col,i){
                                    
                                        if (col.id == el.id){
                                            let refTable =  col.type.slice(10);
                                            try {

                                                if ( $$("tree").getItem(refTable)){
                                                    $$("tree").select(refTable);
                                                } else {
                                                     
                                                    if (refTable){
                                                        toRefTable (refTable)
                                                      
                                                    }
                                                }
                                               
                
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
                               
                                if ( $$("editTableFormProperty").config.dirty){
                                    modalBox().then(function(result){
                                        if (result !== 0){
                                            if (result == 1){
                                            } else if (result == 2){
                                                if ($$("editTableFormProperty") && $$("editTableFormProperty").config.dirty){
                                                    if ($$("editTableFormProperty").getValues().id){
                                                        saveItem(false,true);
                                                    } else {
                                                        saveNewItem(); 
                                                    }
                                                
                                                }
                                                
                                            }

                                            $$("editTableFormProperty").config.dirty = false;
                                            $$("editTableFormProperty").refresh();
                                            setRefTable ();
                                        
                                        }
                                    });

                                } else {
                                    setRefTable ();
                                }
                             
                            }
                        })
                    } else {
                        $$("propertyRefbtnsContainer").addView({height:28,width:1})
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

    if ($$("EditEmptyTempalte")&&!($$("EditEmptyTempalte").isVisible())){
        $$("EditEmptyTempalte").show();
    }

    if ($$("propertyRefbtnsContainer")){
        $$("propertyRefbtns").removeView($$("propertyRefbtnsContainer")) 
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
                        function setDirtyProperty (){
                            $$("editTableFormProperty").config.dirty = false;
                            $$("editTableFormProperty").refresh();
                        }

                        function stateForm (){
                            $$("table-saveNewBtn").hide();
                            $$("table-newAddBtnId").enable();
                            $$("editTableFormProperty").hide();
                            $$("EditEmptyTempalte").show();
                            $$("table-delBtnId").disable();
                            $$("table-saveBtn").hide();
                        }


                        function statePopup (){
                            $$("editTableFormProperty").clear();
                            if ($$("tableEditPopup")){
                                $$("tableEditPopup").hide();
                            }
                        }
                       

                        if($$("editTableFormProperty") && $$("editTableFormProperty").config.dirty){ 
                                modalBox().then(function(result){
                                    if (result == 0){
                                        setDirtyProperty ();
                                    } else if (result == 1){
                                        statePopup ();
                                        stateForm ();
                                    } else if (result == 2){
                                 
                                        if ($$("editTableFormProperty").getValues().id){
                                            saveItem();
                                        } else {
                                            saveNewItem(); 
                                        }
                                        
                                        statePopup ();
                                        stateForm ();
                                    }
                                });


                        } else {

                            $$("table").filter(false);

                            setDirtyProperty ();

                            statePopup ();
                            stateForm ();
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
                borderless:true,
                scroll:true,
                //borderless:true,
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
                                        click:function (){
                                            saveNewItem()
                                        },
                                    },
                                    {   id:"EditEmptyTempalte",
                                        template:"<div style='color:#858585;font-size:13px!important'>Добавьте новую запись или выберите существующую из таблицы</div>", 
                                        borderless:true
                                    },
                                ]
                            },

                        ]
                    },

                    {scroll:"y",  cols:[

                    {   view:"property",  
                        id:"editTableFormProperty", 
                        css:"webix_edit-table-form-property",
                        dirty:false,
                        tooltip:"Имя: #label#<br> Значение: #value#",
                        hidden:true,
                       // scroll:"y",
                        elements:[],
                        on:{
                            onEditorChange:function(id, value){
                                let item = $$("editTableFormProperty").getItem(id);
                                item.value = value;
                                $$("editTableFormProperty").updateItem(id);

                                $$("editTableFormProperty").config.dirty = true;
                                $$("editTableFormProperty").refresh();
                            },
                            onBeforeRender:function (){
                                let size = this.config.elements.length*28;
                                if (size && this.$height < size){
                                    this.define("height", size);
                                    this.resize();
                                }
                            },
                            onAfterEditStop:function(state, editor, ignoreUpdate){
    
                                if (state.value !==state.old ){
                                    let item = $$("editTableFormProperty").getItem(editor.id);
                                    item.value = state.value;
                                    $$("editTableFormProperty").updateItem(editor.id);

                                    $$("editTableFormProperty").config.dirty = true;
                                    $$("editTableFormProperty").refresh();
                                }
                            }
                        }
                    },
                    {width:8},
                    {   id:"propertyRefbtns",  
                        rows:[
                         
                        ]
                    }

                    ]},
            
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
    saveNewItem,
    validateProfForm
};

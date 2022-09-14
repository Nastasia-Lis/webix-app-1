import {getComboOptions} from './content.js';
import {headerContextId} from '../components/header.js';
import {tableNames} from "./router.js";
import {catchErrorTemplate,ajaxErrorTemplate} from "./logBlock.js";

import {modalBox, popupExec} from "./notifications.js";
import {setLogValue} from './logBlock.js';
let currId;

let editTableBar;

function getCurrId (){
    let itemTreeId = $$("tree").getSelectedItem().id;
    if ( itemTreeId.length == 0){
        currId=headerContextId;
    } else {
        currId=itemTreeId;
    }
}


//--- bns
function saveItem(addBtnClick=false){    
    try{    
        getCurrId ();
        let itemData = $$("table-editForm").getValues();   
        if($$("table-editForm").validate() ){
            if( itemData.id ) {
                webix.ajax().put("/init/default/api/"+currId+"/"+itemData.id, itemData, {
                    success:function(){
                        $$( "table" ).updateItem(itemData.id, itemData);
                        setLogValue("success","Данные сохранены");
                        clearItem();
                        defaultStateForm ();
                        $$("table").clearSelection();
                        
                        if (!(addBtnClick)){
                            if ($$("inputsTable")){
                                $$("inputsTable").hide();
                            }
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

        if($$("table-editForm").isDirty()){

            modalBox().then(function(result){
                if (result == 1){
                    $$("table").filter(false);
                    createEditFields("table-editForm");
                    $$("table-delBtnId").disable();
                    $$("table-saveBtn").hide();
                    $$("table-saveNewBtn").show();
                
                } else if (result == 2){
                    if ($$("table-editForm").validate()){
                        saveItem(true);
                        
                    } else {
                        setLogValue("error","Заполните пустые поля");
                        return false;
                    }
                    
                }
            });

        } else {
            if ($$("EditEmptyTempalte")&&$$("EditEmptyTempalte").isVisible()){
                $$("EditEmptyTempalte").hide();
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
        
        if($$( "table-editForm" ).validate() ) {
            if($$("table-editForm").isDirty()){
                let newValues = $$("table-editForm").getValues();

                newValues.id=webix.uid();
                webix.ajax().post("/init/default/api/"+currId, newValues,{
                    success:function( ){
                        $$("table").add(newValues);
                        clearItem();
                        defaultStateForm ();
                        if ($$("inputsTable")){
                            $$("inputsTable").hide();
                        }
                        $$("table-newAddBtnId").enable();
                        if ($$("EditEmptyTempalte")&&!($$("EditEmptyTempalte").isVisible())){
                            $$("EditEmptyTempalte").show();
                        }
                        setLogValue("success","Данные успешно добавлены");
                    },
                    error:function(text, data, XmlHttpRequest){
                        ajaxErrorTemplate("003-001",XmlHttpRequest.status,XmlHttpRequest.statusText,XmlHttpRequest.responseURL);
                    }
                }).catch(error => {
                    console.log(error);
                    ajaxErrorTemplate("003-001",error.status,error.statusText,error.responseURL);
                });
            }else {
                webix.message({type:"debug",expire:1000, text:"Форма пуста"});
            }
        } else {
            setLogValue("error","Заполните пустые поля");
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
                $$( "table" ).remove($$("table-editForm").getValues().id);
                let formValues = $$("table-editForm").getValues();
                webix.ajax().del("/init/default/api/"+currId+"/"+formValues.id+".json", formValues,{
                    success:function(){
                        clearItem();
                        defaultStateForm ();
                        $$("inputsTable").hide();
                        setLogValue("success","Данные успешно удалены");
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

function createEditFields (parentElement, viewPosition=1) {
    try {
        let columnsData = $$("table").getColumns();

        if(Object.keys($$(parentElement).elements).length==0  ){
            let inputsArray = [];
            columnsData.forEach((el,i) => {
                if (el.type == "datetime"){
                    inputsArray.push({   
                        view: "datepicker",
                        format:"%d.%m.%Y %H:%i:%s",
                        id:el.id,
                        name:el.id, 
                        label:el.label, 
                        placeholder:"дд.мм.гг", 
                        timepicker: true,
                        labelPosition:"top",
                        on:{
                            onItemClick:function(){
                                $$(parentElement).clearValidation();
                            }
                        }
                    });
                } 
                

            else if (el.type.includes("reference")) {
                let findTableId = el.type.slice(10);
                let refTableName;

                tableNames.forEach(function(el,i){
                    if (el.id == findTableId){
                        refTableName= el.name;
                    }
                });

                inputsArray.push(
                    {cols:[
                    {   view:"combo",
                        placeholder:"Выберите вариант",  
                        label:el.label, 
                        id:el.id,
                        name:el.id, 
                        labelPosition:"top",
                        options:{
                            data:getComboOptions(findTableId)
                        },
                        on:{
                            onItemClick:function(){
                                $$(parentElement).clearValidation();
                            },
                        }
                    },
                    {
                        view:"button",
                        css:{"vertical-align":"bottom!important","height":"38px!important"},
                        type:"icon",
                        icon: 'wxi-angle-right',
                        inputHeight:38,
                        width: 40,
                        on: {
                            onAfterRender: function () {
                                this.getInputNode().setAttribute("title","Перейти в таблицу"+" "+"«"+refTableName+"»");
                            },
                        },
                        click:function(){
                            try {
                                $$("tree").select(findTableId);
                            } catch (e){
                                console.log(e);
                                setLogValue("error","Таблица не найдена");

                                if ($$("EditEmptyTempalte")&&$$("EditEmptyTempalte").isVisible()){
                                    $$("EditEmptyTempalte").hide();
                                }
                            }
                            
                        }
                    }
                    ]}

                );
                
            } else if (el.type.includes("boolean")) {

                inputsArray.push(
                    {cols:[
                    {   view:"combo",
                        placeholder:"Выберите вариант",  
                        label:el.label, 
                        id:el.id,
                        name:el.id, 
                        labelPosition:"top",
                        options:[
                            {id:1, value: "Да"},
                            {id:2, value: "Нет"}
                        ],
                        on:{
                            onItemClick:function(){
                                $$(parentElement).clearValidation();
                            },
                        }
                    },
                    
                    ]}

                );
                
            } else if (el.type.includes("integer")) {

                inputsArray.push(
                    {cols:[
                        {
                            view:"text", 
                            name:el.id,
                            id:el.id, 
                            label:el.label, 
                            labelPosition:"top",
                            invalidMessage:"Поле поддерживает только числовой формат",
                            on:{
                                onKeyPress:function(){
                                    $$(parentElement).clearValidation();
                                }
                            },
                            validate:function(val){
                                return !isNaN(val*1);
                            }
                        },
                    
                    ]}

                );
                
            } else {
                    inputsArray.push(
                        {
                        view:"text", 
                        name:el.id,
                        id:el.id, 
                        label:el.label, 
                        labelPosition:"top",
                        on:{
                            onKeyPress:function(){
                                $$(parentElement).clearValidation();
                            }
                        }
                        }
                    );
                }
            });

            let inpObj = {margin:8,id:"inputsTable", rows:inputsArray};

            if(parentElement=="table-editForm"){
                $$("table-delBtnId").enable();
            }
            
            return ($$(parentElement).addView( inpObj, viewPosition));
            
        } else {
            $$(parentElement).clear();
            $$(parentElement).clearValidation();

            if(parentElement=="table-editForm"){
                $$("table-delBtnId").enable();
            }
            $$("inputsTable").show();
        }
    } catch (error){
        catchErrorTemplate("003-000", error);
    }
}

function clearItem(){
    $$("table-editForm").clear();
    $$("table-editForm").clearValidation();
    defaultStateForm ();
}

function defaultStateForm () {
    if ($$("table-saveNewBtn").isVisible()) {
        $$("table-saveNewBtn").hide();
    } else if ($$("table-saveBtn").isVisible()){
        $$("table-saveBtn").hide();
    }
    $$("table-delBtnId").disable();
}

//--- components


try{


 editTableBar = {
    view:"form", 
    id:"table-editForm",
    css:"webix_form-edit",
    minHeight:350,
    minWidth:210,
    width: 320,
    scroll:true,
    elements:[

        {//id:"form-adaptive",
        minHeight:48,css:"webix_form-adaptive", margin:5, rows:[{margin:5, rows:[
           
            
            {//responsive:"form-adaptive",  
            margin:5, 

                cols: [
                    {   view:"button",
                        id:"table-newAddBtnId",
                        height:48,
                        minWidth:90, 
                        hotkey: "shift",
                        value:"Новая запись", click:addItem},
                        
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
            
        ]},

       {margin:10, rows:[ { 
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
            click:saveNewItem
        },
        {id:"EditEmptyTempalte",template:"<div style='color:#858585;font-size:13px!important'>Добавьте новую запись или выберите существующую из таблицы</div>", borderless:true}


        ]},


        
    ]},

    ],
    
    rules:{
        $all:webix.rules.isNotEmpty
    },


    ready:function(){
        this.validate();
    },

};
} catch (error){
    alert("Ошибка при выполнении"+" "+ error);
    console.log(error);
    window.stop();
   
}

    
export{
    editTableBar,
    createEditFields,
    defaultStateForm,
    clearItem,
    saveItem,
    saveNewItem
};

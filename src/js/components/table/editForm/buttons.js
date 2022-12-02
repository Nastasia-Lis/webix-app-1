import { modalBox }            from "../../../blocks/notifications.js";
import { Action }              from "../../../blocks/commonFunctions.js";

import { Button }              from "../../../viewTemplates/buttons.js";
import { createEmptyTemplate } from "../../../viewTemplates/emptyTemplate.js";
import { mediator }            from "../../../blocks/_mediator.js";


function setFormState(){
    mediator.tables.editForm.postState();
}

function modalBoxAddItem(){
    modalBox().then(function (result){
        if (result == 1){
            setFormState();
        } else if (result == 2){
            mediator.tables.editForm
            .put(false).then(function(result){
                if (result){
                    setFormState();
                }
            });
 
        }
    });

 
}


function addItem () {

    const isDirtyForm = $$("table-editForm").isDirty();
    const table       = $$("table");

    if (isDirtyForm){
        modalBoxAddItem();
    } else {
        mediator.tables.editForm.clearTempStorage();
        setFormState();
        table.hideOverlay("Ничего не найдено");
    }

}

function backTableBtnClick() {
    const form           = $$("table-editForm");
    const tableContainer = $$("tableContainer");
    const table          = $$("table");

    function defaultState(){
        mediator.tables.editForm.clearTempStorage();
        Action.hideItem(form);
        Action.showItem(tableContainer);
        if (table){
            table.clearSelection();
        }
    }

    function createModalBox(){

        modalBox().then(function (result){
                        
            if (result == 1 || result == 2){
                if (result == 1){
                    defaultState();
                } else if (result == 2){
                    const isExists = $$("table-saveBtn").isVisible();
                    
                    if (isExists){
                        mediator.tables.editForm.put();
                    } else {
                        mediator.tables.editForm.post();
                    }
                }
                form.setDirty(false);
            }
        });
    }

   

    if (form.isDirty()){
        createModalBox ();
    
    } else {
        defaultState();
    }
  

}


const newAddBtn = new Button({
    
    config   : {
        id          : "table-newAddBtnId",
        hotkey      : "Alt+A",
        disabled    : true,
        value       : "Новая запись", 
        click       : addItem,
    },
    titleAttribute : "Добавить новую запись",
    adaptValue     : "+",

   
}).maxView();

const delBtn = new Button({
    
    config   : {
        id       : "table-delBtnId",
        hotkey   : "Ctrl+Enter",
        disabled : true,
        icon     : "icon-trash", 
        click    : function (){
            mediator.tables.editForm.remove();
        },
    },
    titleAttribute : "Удалить запись из таблицы"

   
}).minView("delete");


const saveBtn = new Button({
    
    config   : {
        id       : "table-saveBtn",
        hotkey   : "Shift+Space",
        hidden   : true, 
        value    : "Сохранить", 
        click    : function(){
            mediator.tables.editForm.put();
        },
        on:{
            onViewShow:function(){
                if (this.isVisible()){
                    $$("editTableFormProperty")
                    .config.tableStatus = "put";
                }
   
            }
        }
    },
    titleAttribute : "Сохранить запись в таблицу"

   
}).maxView("primary");


const saveNewBtn = new Button({
    
    config   : {
        id       : "table-saveNewBtn",
        hotkey   : "Ctrl+Shift+Space",
        hidden   : true, 
        value    : "Сохранить", 
        click    : function(){
            mediator.tables.editForm.post();
        },
        on:{
            onViewShow:function(){

                if (this.isVisible()){
                    $$("editTableFormProperty")
                    .config.tableStatus = "post";
                }
   
            }
        }
    },
    titleAttribute : "Сохранить новую запись в таблицу"

   
}).maxView("primary");


const backTableBtn = new Button({
    
    config   : {
        id       : "table-backTableBtn",
        hotkey   : "Shift+Q",
        hidden   : true,  
        icon     : "icon-arrow-left", 
        click    : backTableBtnClick,
    },
    titleAttribute : "Вернуться к таблице"

   
}).minView();




const editFormBtns = {
    minHeight : 48,
    css       : "webix_form-adaptive", 
    margin    : 5, 
    rows:[
        {cols:[
            {   id      : "tablePropBtnsSpace",
                width   : 35, 
                hidden  : true
            },
            {rows:[
                {
                    margin : 5,
                    rows   : [
                        {
                            margin : 2,
                            cols   : [
                                backTableBtn,
                                newAddBtn,  
                                delBtn,
                            ]
                        },
                
                    ]
                },
        
                {   margin : 10, 
                    rows   : [ 
                        saveBtn,
                        saveNewBtn,
                        {   id        : "EditEmptyTempalte",
                            rows      : [
                                {height:20},
                                createEmptyTemplate(
                                    "Добавьте новую запись или " +
                                    "выберите существующую из таблицы")
                            ],
                        }
                    
                    ]
                },
             
            ]}
        ]}
   
     

    ]
};


export {
    editFormBtns,
};
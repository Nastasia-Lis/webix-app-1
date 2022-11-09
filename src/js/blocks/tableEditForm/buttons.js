import {setFunctionError,setAjaxError} from "../errors.js";
import {setLogValue} from "../logBlock.js";
import {modalBox, popupExec} from "../notifications.js";
import {getItemId, hideElem, showElem} from "../commonFunctions.js";

import {setDirtyProperty} from "./property.js";
import {validateProfForm,setLogError,uniqueData} from "./validation.js";
import {createEditFields,defaultStateForm} from "./states.js";

const logNameFile = "tableEditForm => buttons";

function updateWorkspace (itemData){
    try{
        const table   = $$( "table" );
        table.updateItem(itemData.id, itemData);
        table.clearSelection();
      
        defaultStateForm();
    } catch (err){
        setFunctionError(err,logNameFile,"saveItem => updateWorkspace");
    }  
    
}


function setDirtyProp (property){
                     
    try{
        property.config.dirty = false;
        property.refresh();
    } catch (err){
        setFunctionError(err,logNameFile,"saveItem => setDirtyProp");
    } 
}


function addNewStateSpace(){
    const table   = $$( "table" );
    const delBtn  = $$("table-delBtnId");
    const saveBtn = $$("table-saveBtn");
    const saveNew = $$("table-saveNewBtn");
    try{
        table.filter(false);
        createEditFields("table-editForm");
        delBtn.disable(); 
        saveBtn.hide();
        saveNew.show();
    } catch (err){
        setFunctionError(err,logNameFile,"saveItem => addNewStateSpace");
    }
}


function dateFormatting(arr){
    const vals          = Object.values(arr);
    const keys          = Object.keys(arr);
    const formattingArr = arr;

    keys.forEach(function(el,i){
        const prop       = $$("editTableFormProperty");
        const item       = prop.getItem(el);
        const formatData = webix.Date.dateToStr("%d.%m.%Y %H:%i:%s");

        if ( item.type == "customDate" ){
            formattingArr[el] = formatData(vals[i]);
        }
    });
    return formattingArr;
}


function formattingBoolVals(arr){
    const table = $$( "table" );
    const cols  = table.getColumns();
    cols.forEach(function(el,i){

        if ( arr[el.id] && el.type == "boolean" ){
            if (arr[el.id] == 2){
                arr[el.id] = false;
            } else {
                arr[el.id] = true;
            }
        }
    });

    return arr;

}   


function saveItem(addBtnClick=false, refBtnClick=false){    
  
    try{    
        
        const itemData = $$("editTableFormProperty").getValues();   
        const currId   = getItemId ();
       
        if (!(validateProfForm().length)){

            if( itemData.id ) {
                const link       = "/init/default/api/"+currId+"/"+itemData.id;
                
                const editForm       = $$("table-editForm");
                const property       = $$("editTableFormProperty");
                const addBtn         = $$("table-newAddBtnId");
                const emptyTempl     = $$("EditEmptyTempalte");
                const container      = $$("tableContainer");
                const uniqueVals     = uniqueData (itemData);
                const dateFormatVals = dateFormatting(uniqueVals)
                const sentObj        = formattingBoolVals(dateFormatVals);
 
                const putData    = webix.ajax().put(link, sentObj);

                putData.then(function(data){
                    data = data.json();

                    if (data.err_type == "i"){

                        if (!refBtnClick){
                            updateWorkspace (itemData);
                            hideElem(editForm);
                        }

                        if (!addBtnClick ){
                            addBtn.enable();
                            setDirtyProp(property);
                           
                        } else {
                            showElem(property);
                            addNewStateSpace();
                            hideElem(emptyTempl);
                        }
                 
                        showElem(container);

                        if(window.innerWidth < 850){
                            editForm.hide();
                        }
 
                        setLogValue("success","Данные сохранены",currId);

                    } else {
                        setLogValue("error",logNameFile+" function saveItem: "+data.err);
                    }
                });
                putData.fail(function(err){
                    setAjaxError(err, logNameFile,"saveItem");
                });
            }    

        } else {
            validateProfForm ().forEach(function(el,i){
                setLogError ();
            });
        }
    } catch (err){
        setFunctionError(err,logNameFile,"saveItem");
    }

}

function addItem () {
    const emptyTemplate = $$("EditEmptyTempalte");
    const property      = $$("editTableFormProperty");
    const table         = $$("table");

    function setWorkspaceState (){
        function tableState(){
            table.filter(false);
            table.clearSelection();
        }

        function buttonsState(){
            $$("table-delBtnId")   .disable();
            $$("table-saveBtn")    .hide();
            $$("table-saveNewBtn") .show();
            $$("table-newAddBtnId").disable();
        }

        try{
            tableState();
            buttonsState();
            createEditFields("table-editForm");
            hideElem(emptyTemplate);
        } catch (err){
            setFunctionError(err,logNameFile,"addItem => setWorkspaceState");
        }
    
    }

    function setDirtyProp (){
        try{
            property.config.dirty = false;
            property.refresh();
        } catch (err){
            setFunctionError(err,logNameFile,"addItem => setDirtyProp");
        }
    }
    
    function modalBoxAddItem(){
        modalBox().then(function(result){
            if (result == 1){
                setWorkspaceState ();
                setDirtyProp ();
            
            } else if (result == 2){
                saveItem(true);
                setDirtyProp ();
                hideElem(emptyTemplate);
            }
        });
    }

   

    function initPropertyForm(){
        showElem(property);
        property.clear();
    }


    try {
  
        if ( property.config.dirty == true ){
            modalBoxAddItem();
        } else {
            initPropertyForm();
            setWorkspaceState ();
            table.hideOverlay("Ничего не найдено");
        }

    }catch (err){
        setFunctionError(err,logNameFile,"addItem");
    }


}

function removeNullFields(arr){
    const vals    = Object.values(arr);
    const keys    = Object.keys(arr);
    const sentObj = {};

    vals.forEach(function(el,i){
        if (el){
            sentObj[keys[i]]= el;
        }
        dateFormatting(arr);
    });

    return sentObj;
}

function setCounterVal (){
    try{
        const counter = $$("table-findElements");
        
        const oldVal  = counter.getValues();
        const newVal  = +oldVal + 1;

        counter.setValues(newVal.toString());
    } catch (err){
        setFunctionError(err,logNameFile,"setCounterVal");
    }
}

function saveNewItem (){
    const currId = getItemId ();
 
    if (!(validateProfForm().length)){

        const editForm       = $$("table-editForm");
        const property       = $$("editTableFormProperty");
        const newValues      = property.getValues();
        const notNullVals    = removeNullFields  (newValues);
        const dateFormatVals = dateFormatting    (notNullVals);
        const sentVals       = formattingBoolVals(dateFormatVals);


        const postData  = webix.ajax().post("/init/default/api/"+currId, sentVals);
      
        postData.then(function(data){
            data = data.json();

            function setDirtyProp(){
                try{
                    property.config.dirty = false;
                    property.refresh();
                } catch (err){
                    setFunctionError(err,logNameFile,"saveNewItem => setDirtyProp");
                }
            }

            function tableUpdate(){
                newValues.id = data.content.id;

                if (newValues.id <= $$("table").config.offsetAttr ){
                    $$("table").add(newValues); 
                }

                setCounterVal ();

            }

            if (data.content.id !== null){

                if (data.err_type == "i"){
                    try{
                        tableUpdate();
                        defaultStateForm ();
                        setDirtyProp();
                        $$("table-newAddBtnId").enable();
                        hideElem(editForm);
                        showElem($$("tableContainer"));

                        if(window.innerWidth < 850){
                            editForm.hide();
                        }

              
                    } catch (err){
                        setFunctionError(err,logNameFile,"saveNewItem");
                    }
                    setLogValue("success","Данные успешно добавлены",currId);
                } else {
                    console.log(data);
                    setLogValue("error",logNameFile+" function saveNewItem: "+data.err);
                }
            } else {

                let errs = data.content.errors;
                let msg = "";
                Object.values(errs).forEach(function(err,i){
                    msg +=err+" (Поле: "+Object.keys(errs)[i] +"); ";
                });

                setLogValue("error","editTableForm function saveNewItem: "+msg);
            }
        });
        postData.fail(function(err){
            setAjaxError(err, "tableEditForm => btns","saveNewItem");
        });
    

    } else {
        setLogError ();
    }
 
}

function removeItem() {
 
    try{
        const currId = getItemId ();

        popupExec("Запись будет удалена").then(
            function(){

                const formValues  = $$("editTableFormProperty").getValues();
                const table       = $$( "table" );
                const tableSelect = table.getSelectedId().id;
                
                function removeRow(){
                    if(table){
                        table.remove(tableSelect);
                    }
                }

                removeRow();
                const link ="/init/default/api/"+currId+"/"+formValues.id+".json";
                const removeData = webix.ajax().del(link, formValues);

                removeData.then(function(data){
                    data = data.json();

                    if (data.err_type == "i"){
                        
                        defaultStateForm();
                        setDirtyProperty();
                        showElem($$("tableContainer"));

                        if(window.innerWidth < 850){
                            $$("table-editForm").hide();
                        }

                        setLogValue("success","Данные успешно удалены");
                    } else {
                        setLogValue("error","editTableForm function removeItem: "+data.err);
                    }
                });
                removeData.fail(function(err){
                    setAjaxError(err, logNameFile,"removeItem");
                });
     
        });
    } catch (err){
        setFunctionError(err,logNameFile,"removeItem");
    }
    
}


function backTableBtnClick() {
    const form           = $$("table-editForm");
    const tableContainer = $$("tableContainer");
    const property       = $$("editTableFormProperty");
    const table          = $$("table");

    function defaultState(){
        hideElem(form);
        showElem(tableContainer);
        if (table){
            table.clearSelection();
        }
    }

    function createModalBox(){

        modalBox().then(function(result){
                        
            if (result == 1 || result == 2){
                if (result == 1){
                    defaultState();
                } else if (result == 2){
                    if (property.getValues().id){
                        saveItem();
                        defaultState();
                    } else {
                        saveNewItem(); 
                    }
                }

                setDirtyProperty ();
            }
        });
    }

    if (property.config.dirty){
        createModalBox ();
    
    } else {
        defaultState();
    }
  

}


function setAdaptiveValue(btn, adaptVal, mainVal){
    const width  = btn.$width;
   
    if (width < 120 &&  btn.config.value !== adaptVal ){
        btn.config.value = adaptVal;
        btn.refresh();
      
    } else if (width > 120 &&  btn.config.value !== mainVal ) {
        btn.config.value = mainVal;
        btn.refresh();
    }
}

const newAddBtn = {   
    view    : "button",
    id      : "table-newAddBtnId",
    height  : 48,
    minWidth: 50, 
    disabled: true,
    hotkey  : "alt+a",
    value   : "Новая запись", 
    click   : addItem,
    on      : {
        onAfterRender: function () {
            this.getInputNode().setAttribute("title", "Добавить новую запись (Alt+A)");
            setAdaptiveValue(this, "+", "Новая запись");

        },
    
    } 
};

const delBtn = {  
    view:"button",
    id:"table-delBtnId",
    disabled:true,
    height:48,
    width:50,
    hotkey: "ctrl+enter",
    css:"webix_danger", 
    type:"icon", 
    icon:"icon-trash", 
    click:removeItem,
    on: {
        onAfterRender: function () {
            this.getInputNode().setAttribute("title","Удалить запись из таблицы (Ctrl+Enter)");
        }
    },
     
};

const saveBtn = { 
    view    : "button", 
    id      : "table-saveBtn",
    hidden  : true, 
    value   : "Сохранить", 
    hotkey  : "shift+space",
    height  : 48, 
    css     : "webix_primary", 
    click   : function(){
        saveItem();
    },
    on: {
        onAfterRender: function () {
            this.getInputNode().setAttribute("title","Удалить запись из таблицы (Shift+Space)");
        }
    },
};

const saveNewBtn = { 
    view    : "button", 
    id      : "table-saveNewBtn",
  //  value   : "Сохранить новую запись",
    value   : "Сохранить",
    hidden  : true,  
    height  : 48,
    css     : "webix_primary", 
    hotkey  : "ctrl+shift+space",
    click   : function(){
        saveNewItem();
    },
    on: {
        onAfterRender: function () {
            this.getInputNode().setAttribute("title","Удалить запись из таблицы (Ctrl+Shift+Space)");
        }
    },
};

const backTableBtn = { 
    view    : "button", 
    id      : "table-backTableBtn",
    type    : "icon",
    icon    : "icon-arrow-left",
    value   : "Вернуться к таблице",
    hidden  : true,  
    height  : 48,
    minWidth: 60,
    width   : 90,
    hotkey  : "shift+q",
    click   : function(){
        backTableBtnClick();
    },
    on: {
        onAfterRender: function () {
            this.getInputNode().setAttribute( "title", "Вернуться к таблице (Shift+Q)" );
        }
    } 
};

const emptyTmplate = {   
    id         : "EditEmptyTempalte",
    css        : "webix_empty-template",
    template   : "Добавьте новую запись или выберите существующую из таблицы", 
    borderless : true,
};

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
                        emptyTmplate,
                    ]
                },
             
            ]}
        ]}
   
     

    ]
};


export {
    editFormBtns,
    saveItem,
    saveNewItem
};
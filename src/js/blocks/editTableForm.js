import {getComboOptions} from './content.js';
import {setLogValue} from "./logBlock.js";
import {modalBox, popupExec} from "./notifications.js";
import  {STORAGE,getData} from "./globalStorage.js";

import {setAjaxError,setFunctionError} from "./errors.js";

let currId;

function getCurrId (){
    
    if ($$("tables").isVisible()){
        currId = $$("table").config.idTable;
    } else if ($$("forms").isVisible()){
        currId = $$("table-view").config.idTable;
    }

}

function validateProfForm (){

    let errors = {};
    let messageErrors = [];

    function checkConditions (){ 
        const propVals =  Object.keys($$("editTableFormProperty").getValues());
        propVals.forEach(function(el,i){
            let propElement = $$("editTableFormProperty").getItem(el);
            let values = $$("editTableFormProperty").getValues();
            
            errors[el] = {};

            function valLength(){ 
                try{
                    console.log(values[el])
                    if(values[el]){
                        
                        if (values[el].length > propElement.length && propElement.length !==0){
                            errors[el].length = "Длина строки не должна превышать "+propElement.length+" симв.";
                        } else {
                            errors[el].length = null;
                        }
                    }
                } catch (err){
                    setFunctionError(err,"editTableForm","valLength");
                }
            }
            function valNotNull (){
                try{
                    if (propElement.notnull==true && values[el].length == 0 ){
                        errors[el].notnull = "Поле не может быть пустым";
                    } else {
                        errors[el].notnull = null;
                    }
                } catch (err){
                    setFunctionError(err,"editTableForm","valNotNull");
                }
            }

            function valUnique (){
                try{
                errors[el].unique = null;
                if (propElement.unique==true){
                    let tableRows = Object.values($$("table").data.pull);
                    tableRows.forEach(function(row,i){
                        if (values[el].localeCompare(row[el]) == 0 && row.id !== $$("table").getSelectedId().id){
                            errors[el].unique = "Поле должно быть уникальным";
                        }
                    });
                }
                } catch (err){
                    setFunctionError(err,"editTableForm","valUnique");
                }
            }


            valLength ();
            valNotNull ();
            valUnique ();

        });
    }

    function createErrorMessage (){
     
        function findErrors (){
            Object.values(errors).forEach(function(col,i){
                
                
                function createMessage (){
                    Object.values(col).forEach(function(error,e){
                        if (error !== null){
                            let nameCol = Object.keys(errors)[i];
                            let textError = error;
                            let typeError = Object.keys(col)[e];
                            messageErrors.push({nameCol,typeError,textError})
                        }
                        
                    });
                    return messageErrors;
                }

                createMessage ();
        
            });
        }

        findErrors ();
        
    }
    try{
        checkConditions ();
        createErrorMessage ();
    } catch (err){
        setFunctionError(err,"editTableForm","validateProfForm");
    }
    return messageErrors;
}

function setLogError (){

    try{
        validateProfForm ().forEach(function(el,i){

            let nameEl;

            $$("table").getColumns().forEach(function(col,i){
                if (col.id == el.nameCol){
                    nameEl = col.label;
                }
            });

            setLogValue("error",el.textError+" (Поле: "+nameEl+")");
        });

    } catch (err){
        setFunctionError(err,"editTableForm","setLogError");
    }
}


function setDirtyProperty (type=false){
    try{
        if($$("editTableFormProperty")){
            $$("editTableFormProperty").config.dirty = type;
            $$("editTableFormProperty").refresh();
        }
    } catch (err){
        setFunctionError(err,"editTableForm","setDirtyProperty");
    } 
}




function hideEditPopup(){
    try{
        if($$("tableEditPopup")){
            $$("tableEditPopup").hide();
        }
    } catch (err){
        setFunctionError(err,"editTableForm","hideEditPopup");
    } 
}

function hideEmptyTempalte (){
    try{
    
        if ($$("EditEmptyTempalte") && $$("EditEmptyTempalte").isVisible()){
            $$("EditEmptyTempalte").hide();
        }
        
    } catch (err){
        setFunctionError(err,"editTableForm","showEmptyTempalte");
    } 
}

//--- bns
function saveItem(addBtnClick=false, refBtnClick=false){    

    try{    
        
        let itemData = $$("editTableFormProperty").getValues();   
        getCurrId ();
       
        if (!(validateProfForm().length)){

            if( itemData.id ) {
                const link = "/init/default/api/"+currId+"/"+itemData.id;
                const putData = webix.ajax().put(link, uniqueData (itemData));
                
                putData.then(function(data){
                    data = data.json();

                    function updateWorkspace (){
                        try{
                            $$( "table" ).updateItem(itemData.id, itemData);
                            $$("table").clearSelection();
                            defaultStateForm();
                        } catch (err){
                            setFunctionError(err,"editTableForm","saveItem => updateWorkspace");
                        }  
                        
                    }

                    function setDirtyProp (){
                        try{
                            $$("editTableFormProperty").config.dirty = false;
                            $$("editTableFormProperty").refresh();
                        } catch (err){
                            setFunctionError(err,"editTableForm","saveItem => setDirtyProp");
                        } 
                    }

                    function showFormProperty (){
                        try{
                            if (!($$("editTableFormProperty").isVisible())){
                                $$("editTableFormProperty").show();
                            }
                        } catch (err){
                            setFunctionError(err,"editTableForm","saveItem => showFormProperty");
                        } 
                    }

                    function addNewStateSpace(){
                        try{
                            $$("table").filter(false);
                            createEditFields("table-editForm");
                            $$("table-delBtnId").disable(); 
                            $$("table-saveBtn").hide();
                            $$("table-saveNewBtn").show();
                        } catch (err){
                            setFunctionError(err,"editTableForm","saveItem => addNewStateSpace");
                        }
                    }

                    if (data.err_type == "i"){

                        if (!refBtnClick){
                            updateWorkspace ();
                        }

                        if (!addBtnClick ){
                            $$("table-newAddBtnId").enable();
                            setDirtyProp();
                           
                        } else {
                            showFormProperty();
                            addNewStateSpace();
                            hideEmptyTempalte();
                        }

                        if (window.innerWidth < 1200 && $$("tableEditPopup")){
                            hideEditPopup ();
                        }
                        setLogValue("success","Данные сохранены",currId);

                    } else {
                        setLogValue("error","editTableForm function saveItem: "+data.err);
                    }
                });
                putData.fail(function(err){
                    setAjaxError(err, "editTableForm","saveItem");
                });
            }    

        } else {
            validateProfForm ().forEach(function(el,i){
                setLogError ();
            });
        }
    } catch (err){
        setFunctionError(err,"editTableForm","saveItem");
    }

}

function addItem () {

    function setWorkspaceState (){
        function tableState(){
            $$("table").filter(false);
            $$("table").clearSelection();
        }

        function buttonsState(){
            $$("table-delBtnId").disable();
            $$("table-saveBtn").hide();
            $$("table-saveNewBtn").show();
            $$("table-newAddBtnId").disable();
        }

        try{
            tableState();
            buttonsState();
            createEditFields("table-editForm");
            hideEmptyTempalte();
        } catch (err){
            setFunctionError(err,"editTableForm","addItem => setWorkspaceState");
        }
    
    }
    function setDirtyProp (){
        try{
            $$("editTableFormProperty").config.dirty = false;
            $$("editTableFormProperty").refresh();
        } catch (err){
            setFunctionError(err,"editTableForm","addItem => setDirtyProp");
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
                hideEmptyTempalte();
            }
        });
    }

   

    function initPropertyForm(){
        if ($$("editTableFormProperty") && !($$("editTableFormProperty").isVisible())){
            $$("editTableFormProperty").show();
        }
        $$("editTableFormProperty").clear();
    }


    try {
  
        if ($$("editTableFormProperty").config.dirty == true){
            modalBoxAddItem();
        } else {
            initPropertyForm();
            setWorkspaceState ();
            $$("table").hideOverlay("Ничего не найдено");
        

        }

    }catch (err){
        setFunctionError(err,"editTableForm","addItem");
    }


}

function saveNewItem (){

    getCurrId ();

    if (!(validateProfForm().length)){
    
        let newValues = $$("editTableFormProperty").getValues();
        const postData =  webix.ajax().post("/init/default/api/"+currId, newValues);

        postData.then(function(data){
            data = data.json();

            function setDirtyProp(){
                try{
                    $$("editTableFormProperty").config.dirty = false;
                    $$("editTableFormProperty").refresh();
                } catch (err){
                    setFunctionError(err,"editTableForm","saveNewItem => setDirtyProp");
                }
            }

            function tableUpdate(){
                newValues.id = data.content.id;
                $$("table").add(newValues); 
            }

            if (data.content.id !== null){

                if (data.err_type == "i"){
                    try{
                        tableUpdate();
                        defaultStateForm ();
                        setDirtyProp();
                        $$("table-newAddBtnId").enable();

                        if (window.innerWidth < 1200 && $$("tableEditPopup")){
                            hideEditPopup();
                        }
                    } catch (err){
                        setFunctionError(err,"editTableForm","saveNewItem");
                    }
                    setLogValue("success","Данные успешно добавлены",currId);
                } else {
                    console.log(data)
                    setLogValue("error","editTableForm function saveNewItem: "+data.err);
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
            setAjaxError(err, "editTableForm","saveNewItem");
        });
    

    } else {
        setLogError ();
    }
 
}


function removeItem() {
 
    try{
        getCurrId ();
        popupExec("Запись будет удалена").then(
            function(){

                let formValues = $$("editTableFormProperty").getValues();

                function removeRow(){
                    if($$( "table" )){
                        $$( "table" ).remove($$( "table" ).getSelectedId().id);
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

                        if (window.innerWidth < 1200 && $$("tableEditPopup")){
                            hideEditPopup();
                        }
                        setLogValue("success","Данные успешно удалены");
                    } else {
                        setLogValue("error","editTableForm function removeItem: "+data.err);
                    }
                });
                removeData.fail(function(err){
                    setAjaxError(err, "editTableForm","removeItem");
                });
     
        });
    } catch (err){
        setFunctionError(err,"editTableForm","removeItem");
    }
    
}


//--- bns




//--- components

function uniqueData (itemData){
    let validateData = {};
    try{
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
    } catch (err){
        setFunctionError(err,"editTableForm","uniqueData");
    }

    return validateData;
}

function createEditFields (parentElement) {
    function createDateEditor(){
        webix.editors.$popup = {
            date:{
               view:"popup",
               body:{
                weekHeader:true,
                view:"calendar",
                events:webix.Date.isHoliday,
                timepicker: true,
                icons: true,
               }
            }
         };
    }

    function addEditInputs(inputsArray){
        $$("editTableFormProperty").define("elements", inputsArray);
        $$("editTableFormProperty").refresh();
    }

    function propertyRefBtns(){
        let propertyElems = $$("editTableFormProperty").config.elements;

        function createBtnsContainer(){
            $$("propertyRefbtns").addView({id:"propertyRefbtnsContainer",rows:[]});
        }

        function createEmptySpace(){
            $$("propertyRefbtnsContainer").addView({height:28,width:1});
        }

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

        function setRefTable (srcTable){
            try {
                $$("table").getColumns().forEach(function(col,i){

                    if (col.id == srcTable){
                    
                        let refTable =  col.type.slice(10);
                            if ( $$("tree").getItem(refTable)){
                                $$("tree").select(refTable);
                            } else {
                                
                                if (refTable){
                                    toRefTable (refTable);
                                }
                            }
                        
                            hideEditPopup();
                    }

                });
            } catch (err){
                setFunctionError(err,"editTableForm","setRefTable");
                hideEmptyTempalte();
            }
        }


        function createRefBtn(selectBtn){
            
            function btnClick (idBtn){
                const srcTable = $$(idBtn).config.srcTable;

                function createModalBox (){
                    try{
                        modalBox().then(function(result){
                    
                            if (result == 1 || result == 2){
                                if (result == 1){
                                
                                } else if (result == 2){
                                    if ($$("editTableFormProperty").getValues().id){
                                        saveItem(false,true);
                                    } else {
                                        saveNewItem(); 
                                    }
                                    
                                }

                                setDirtyProperty ();
                                setRefTable (srcTable);
                            
                            }
                        });
                          
                    } catch (err){
                        setFunctionError(err,"editTableForm","createModalBox");
                    }
                }

                if ( $$("editTableFormProperty").config.dirty){
                    createModalBox ();
                } else {
                    setRefTable (srcTable);
                }
            }
            
            $$("propertyRefbtnsContainer").addView({ 
                view:"button", 
                type:"icon",
                srcTable:selectBtn,
                width:30,
                height:28,
                icon: 'wxi-angle-right',
                on: {
                    onAfterRender: function () {
                    this.getInputNode().setAttribute("title","Перейти в родительскую таблицу");
                    },
                },
                click:function (id){
                    btnClick (id);
                }
            });
        }

        if (!($$("propertyRefbtns")._cells.length)){

            if (!$$("propertyRefbtnsContainer")){
                createBtnsContainer();
            }
            

            propertyElems.forEach(function(el,i){
                if (el.type == "combo"){
                    createRefBtn(el.id);
                } else {
                    createEmptySpace();
                }
            });
        }
    }


    function popupTextArea (elId){
        function setStateSaveBtn(){
            if ($$("table-saveBtn")                && 
                $$("table-saveBtn").isVisible()    &&
              !($$("table-saveBtn").isEnabled()) ){ 
                    $$("table-saveBtn").enable();
            }
        }
        return webix.ui({
            view:"popup",
            css:"edit-popup",
            body:{
                view:"textarea", 
                id:elId+"_popup",
                width:300, 
                height:100 ,
                on:{
                 
                    onChange:function(){
                      
                        setStateSaveBtn();
                    },
                  
                   
                }
            },
            on:{
                onBlur:function(){
                  //  console.log(888)
                }
            }
        })
    }

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

                    let formatData = webix.Date.dateToStr("%d.%m.%Y %H:%i:%s:%S");

                    let defVal;
            
                    if (el.default === "now" && el.type == "datetime"){
                        defVal = new Date();
                    } else if (Date.parse(new Date(el.default)) && el.type == "datetime" ){
                        defVal = formatData(dateFormatting ());
                    } else if (el.default.includes("make_guid")) {
                        defVal = createGuid();
                    }  else if (el.default == "False"){
                        defVal = 2;
                    } else if (el.default == "True"){
                        defVal = 1;
                    } else if (el.default !== "None" && el.default !== "null"){
                        defVal = el.default;
                    } else if(el.default == "None" || el.default == "null"){
                        defVal = "";
                    }

                    return defVal;
                }

                
                let template = {
                    id:el.id,
                    label:el.label, 
                    unique: el.unique,
                    notnull: el.notnull,
                    length:el.length,
                    value: defValue ()
                };

                function createDateTimeInput(){
                    template.format = webix.Date.dateToStr("%d.%m.%Y %H:%i:%s:%S");
                    template.type = "date";
                }

              
                function createReferenceInput(){
               
                    let findTableId = el.type.slice(10);
                    template.type = "combo";
                    template.css = el.id+"_container";
                    template.options = getComboOptions(findTableId);
                    template.template = function(obj, common, val, config){
                        let item = config.collection.getItem(obj.value);
                        return item ? item.value : "";
                    };
                }

                function createBooleanInput(){
                    template.type = "select";
                    template.options = [
                        {id:1, value: "Да"},
                        {id:2, value: "Нет"}
                    ];
                }

                function destructPopup(){
                    if ($$(el.id+"_popup")){
                        $$(el.id+"_popup").destructor();
                    }
                }

                function createTextInput(){
                    if (el.length==0 || el.length > 512){
                        destructPopup();
                        template.type="popup";
                        template.popup = popupTextArea (el.id);

                    } else {
                        template.type = "text";
                    }
                }

                function addIntegerType(){
                    template.customType = "integer";
                }


                if (el.type == "datetime"){
                    createDateTimeInput();

                } else if (el.type.includes("reference")) {
                    createReferenceInput();

                } else if (el.type.includes("boolean")) {
                    createBooleanInput();

                } else if (el.type.includes("integer")) {
                    createTextInput();
                    addIntegerType();

                } else {
                    createTextInput();
                }

                inputsArray.push(template);
             
            });

       

            createDateEditor();
            addEditInputs(inputsArray);
            propertyRefBtns();
            
            

        } else {
            $$(parentElement).clear();
            $$(parentElement).clearValidation();

            if(parentElement=="table-editForm"){
                $$("table-delBtnId").enable();
            }
        }
    } catch (err){
        setFunctionError(err,"editTableForm","createEditFields");
    }
}




function defaultStateForm () {
    function btnsState(){
        if ($$("table-saveNewBtn").isVisible()) {
            $$("table-saveNewBtn").hide();
        } else if ($$("table-saveBtn").isVisible()){
            $$("table-saveBtn").hide();
        }
        $$("table-delBtnId").disable();
    }

    function formPropertyState(){
        if ($$("editTableFormProperty") && $$("editTableFormProperty").isVisible()){
            $$("editTableFormProperty").clear();
            $$("editTableFormProperty").hide();
        }
    }

    function showEditTemplate(){
        if ($$("EditEmptyTempalte")&&!($$("EditEmptyTempalte").isVisible())){
            $$("EditEmptyTempalte").show();
        }
    }

    function removeRefBtns(){
        if ($$("propertyRefbtnsContainer")){
            $$("propertyRefbtns").removeView($$("propertyRefbtnsContainer")) 
        }
    }
    try{
        btnsState();
        formPropertyState();
        showEditTemplate();
        removeRefBtns();
    }catch (err){
        setFunctionError(err,"editTableForm","defaultStateForm");
    }

}



//--- btns

function closeEditPopup(){

    function stateForm (){
        $$("table-saveNewBtn").hide();
        $$("table-newAddBtnId").enable();
        $$("editTableFormProperty").hide();
        $$("EditEmptyTempalte").show();
        $$("table-delBtnId").disable();
        $$("table-saveBtn").hide();
    }

    function removeRefBtns(){
        if ($$("propertyRefbtnsContainer")){
            $$("propertyRefbtns").removeView($$("propertyRefbtnsContainer")) 
        }
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
            } else if (result == 1){
                statePopup ();
                stateForm ();
                setDirtyProperty();
            } else if (result == 2){
            
                if ($$("editTableFormProperty").getValues().id){
                    saveItem();
                } else {
                    saveNewItem(); 
                }
                statePopup ();
                stateForm ();

                if($$("editTableFormProperty").config.dirty){
                    setDirtyProperty();
                }
            }
        });

    } else {

        $$("table").filter(false);

        setDirtyProperty ();
        statePopup ();
        stateForm ();
    }

    removeRefBtns();
   // setDirtyProperty();
}

const newAddBtn = {   
    view:"button",
    id:"table-newAddBtnId",
    height:48,
    minWidth:90, 
    disabled:true,
    hotkey: "shift",
    value:"Новая запись", 
    click:addItem
};

const delBtn = {  
    view:"button",
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
};

const saveBtn = { 
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
};

const saveNewBtn = { 
    view:"button", 
    id:"table-saveNewBtn",
    value:"Сохранить новую запись",
    hidden:true,  
    height:48,
    hotkey: "enter" ,
    css:"webix_primary", 
    click:function(){
        saveNewItem();
    },
};

const emptyTmplate = {   
    id:"EditEmptyTempalte",
    template:"<div style='color:#858585;font-size:13px!important'>Добавьте новую запись или выберите существующую из таблицы</div>", 
    borderless:true
};

const editFormBtns = {
    minHeight:48,
    css:"webix_form-adaptive", 
    margin:5, 
    rows:[
        {
            margin:5,rows:[
                {
                    margin:5,cols:[
                        newAddBtn,  
                        delBtn
                    ]
                },
        
            ]
        },

        {   margin:10, 
            rows:[ 
                saveBtn,
                saveNewBtn,
                emptyTmplate,
            ]
        },

    ]
};

//---- headline
const headlineTemplate = {  
    template:"Редактор записей",height:30, 
    css:"table-edit-headline",
    borderless:true,
};

const btnClosePopup = {
    view:"button",
    id:"buttonClosePopupTableEdit",
    css:"webix_close-btn",
    type:"icon",
    hotkey: "esc",
    width:25,
    icon: 'wxi-close',
    click:function(){
        closeEditPopup();
    }
};

const headlineEditPopup = {
    id:"editTableBarHeadline",
    hidden:true,
    cols:[
                
        headlineTemplate,
        btnClosePopup
    ]   
};

function editingEnd (editor,value){
    let item = $$("editTableFormProperty").getItem(editor);
    item.value = value;
    $$("editTableFormProperty").updateItem(editor);
    setDirtyProperty (true);
}
//----- form

const propertyEditForm = {   
    view:"property",  
    id:"editTableFormProperty", 
    css:"webix_edit-table-form-property",
    dirty:false,
    nameWidth:150,
    editable:true,
    tooltip:function(obj){
        let value;
        let label = obj.label;
        if (obj.type == "date"){
            let formatData = webix.Date.dateToStr("%d.%m.%Y %H:%i:%s:%S");
            value = formatData(obj.value);
        } else{
            value = obj.value;
        }
        return"Название: "+label+" <br> Значение: " + value;
    },
    hidden:true,
    elements:[],
    on:{
        onEditorChange:function(id, value){
            function setStateSaveBtn(){
                if ($$("table-saveBtn")                && 
                    $$("table-saveBtn").isVisible()    &&
                  !($$("table-saveBtn").isEnabled()) ){ 
                        $$("table-saveBtn").enable();
                }
            }
            editingEnd (id,value);
            setStateSaveBtn();
        },
        onBeforeRender:function (){
            let size = this.config.elements.length*28;
            if (size && this.$height !== size){
                this.define("height", size);
                this.resize();
            }
        },
        onAfterEditStop:function(state, editor, ignoreUpdate){

            if (state.value !==state.old ){
                editingEnd (editor.id,state.value);
            }
        },

    }
};

const propertyRefBtns = {   
    id:"propertyRefbtns",  
    rows:[]
};

const editForm = {
    view:"form", 
    id:"table-editForm",
    css:"webix_form-edit",
    minHeight:350,
    minWidth:210,
    width: 360,
    borderless:true,
    scroll:true,
    elements:[
        editFormBtns,
        {scroll:"y",  cols:[
            {width:5},
            propertyEditForm,
            {width:8},
            propertyRefBtns
        ]
        },

    ],
   
    rules:{
        $all:webix.rules.isNotEmpty
    },


    ready:function(){
        this.validate();
    },

};



function editTableBar (){
    return {id:"editTableBarContainer",rows:[
        {id:"editTableBarAdaptive", rows:[
            headlineEditPopup,
            editForm
        ]}
    ]};
}

    
export{
    editTableBar,
    createEditFields,
    defaultStateForm,
    saveItem,
    saveNewItem,
    validateProfForm
};

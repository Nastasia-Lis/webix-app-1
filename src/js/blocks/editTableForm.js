import {getComboOptions} from './content.js';
import {headerContextId} from '../components/header.js';
import {catchErrorTemplate,ajaxErrorTemplate,setLogValue} from "./logBlock.js";
import {modalBox, popupExec} from "./notifications.js";
import  {STORAGE,getData} from "./globalStorage.js";

let currId;

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

    let errors = {};
    let messageErrors = [];

    function checkConditions (){ 
        const propVals =  Object.keys($$("editTableFormProperty").getValues());
        propVals.forEach(function(el,i){
            let propElement = $$("editTableFormProperty").getItem(el);
            let values = $$("editTableFormProperty").getValues();
            
            errors[el] = {};

            function valLength (){ 
                if (values[el].length > propElement.length ){
                    errors[el].length = "Длина строки не должна превышать "+propElement.length+" симв.";
                } else {
                    errors[el].length = null;
                }
            }
            function valNotNull (){
                if (propElement.notnull==true && values[el].length == 0 ){
                    errors[el].notnull = "Поле не может быть пустым";
                } else {
                    errors[el].notnull = null;
                }
            }

            function valUnique (){
                errors[el].unique = null;
                if (propElement.unique==true){
                    let tableRows = Object.values($$("table").data.pull);
                    tableRows.forEach(function(row,i){
                        if (values[el].localeCompare(row[el]) == 0 && row.id !== $$("table").getSelectedId().id){
                            errors[el].unique = "Поле должно быть уникальным";
                        }
                    });
                }
            }

            try {
                valLength ();
                valNotNull ();
                valUnique ();
            } catch (err){
                setLogValue("error", "editTableForm function checkConditions: "+err);
            }

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
        setLogValue("error","editTableForm function validateProfForm: "+err);
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
        setLogValue("error","editTableForm function setLogError: "+err);
    }
}


function setDirtyProperty (type=false){
    try{
        if($$("editTableFormProperty")){
            $$("editTableFormProperty").config.dirty = type;
            $$("editTableFormProperty").refresh();
        }
    } catch (err){
        setLogValue("error","editTableForm setDirtyProperty: "+err);
    } 
}




function hideEditPopup(){
    try{
        if($$("tableEditPopup")){
            $$("tableEditPopup").hide();
        }
    } catch (err){
        setLogValue("error","editTableForm hideEditPopup: "+err);
    } 
}

function hideEmptyTempalte (){
    try{
    
        if ($$("EditEmptyTempalte") && $$("EditEmptyTempalte").isVisible()){
            $$("EditEmptyTempalte").hide();
        }
        
    } catch (err){
        setLogValue("error","editTableForm showEmptyTempalte: "+err);
    } 
}

//--- bns
function saveItem(addBtnClick=false, refBtnClick=false){    

    try{    
        
        let itemData = $$("editTableFormProperty").getValues();   
        getCurrId ();
       
        if (!(validateProfForm().length)){

            if( itemData.id ) {
                webix.ajax().put("/init/default/api/"+currId+"/"+itemData.id, uniqueData (itemData), {
                    success:function(text, data, XmlHttpRequest){
                        data = data.json();

                        function updateWorkspace (){
                            try{
                                $$( "table" ).updateItem(itemData.id, itemData);
                                $$("table").clearSelection();
                                defaultStateForm();
                            } catch (err){
                                setLogValue("error","editTableForm function saveItem => updateWorkspace: "+err);
                            }  
                            
                        }

                        function setDirtyProp (){
                            try{
                                $$("editTableFormProperty").config.dirty = false;
                                $$("editTableFormProperty").refresh();
                            } catch (err){
                                setLogValue("error","editTableForm function saveItem => setDirtyProp: "+err);
                            } 
                        }

                        function showFormProperty (){
                            try{
                                if (!($$("editTableFormProperty").isVisible())){
                                    $$("editTableFormProperty").show();
                                }
                            } catch (err){
                                setLogValue("error","editTableForm function saveItem => showFormProperty: "+err);
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
                                setLogValue("error","editTableForm function saveItem => addNewStateSpace: "+err);
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
                           // console.log(currId)
                            setLogValue("success","Данные сохранены",currId);

                        } if (data.err_type == "e"){
                            setLogValue("error","editTableForm function saveItem: "+data.error);
                        }
                    
                    },
                    error:function(text, data, XmlHttpRequest){
                        setLogValue("error","editTableForm function saveItem: "+XmlHttpRequest.status+" "+XmlHttpRequest.statusText+" "+XmlHttpRequest.responseURL);
                    }
                }).catch(error => {
                    console.log(error);
                    setLogValue("error","editTableForm function saveItem: "+error.status+" "+error.statusText+" "+error.responseURL);
                });
            }    

        } else {
            validateProfForm ().forEach(function(el,i){
                setLogError ();
            });
           
        }
    }catch (error){
        setLogValue("error","editTableForm function saveItem: "+error);
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
            setLogValue("error","editTableForm function addItem => setWorkspaceState: "+err);
        }
    
    }
    function setDirtyProp (){
        try{
            $$("editTableFormProperty").config.dirty = false;
            $$("editTableFormProperty").refresh();
        } catch (err){
            setLogValue("error","editTableForm function addItem => setDirtyProp: "+err);
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

    }catch (error){
        setLogValue("error","editTableForm function addItem: "+error);
    }


}

function saveNewItem (){
    try{
        getCurrId ();

        if (!(validateProfForm().length)){
            
            let newValues = $$("editTableFormProperty").getValues();

            webix.ajax().post("/init/default/api/"+currId, newValues,{
                success:function(text, data, XmlHttpRequest){
                    data = data.json();

                    function setDirtyProp(){
                        try{
                            $$("editTableFormProperty").config.dirty = false;
                            $$("editTableFormProperty").refresh();
                        } catch (err){
                            setLogValue("error","editTableForm function saveNewItem => setDirtyProp: "+err);
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
                                setLogValue("error","editTableForm function saveNewItem: "+err);
                            }
                            setLogValue("success","Данные успешно добавлены",currId);
                        } else if (data.err_type == "e"){
                            setLogValue("error","editTableForm function saveNewItem: "+data.error);
                        }
                    } else {

                        let errs = data.content.errors;
                        let msg = "";
                        Object.values(errs).forEach(function(err,i){
                            msg +=err+" (Поле: "+Object.keys(errs)[i] +"); ";
                        });

                        setLogValue("error","editTableForm function saveNewItem: "+msg);
                    }
                    
                },
                error:function(text, data, XmlHttpRequest){
                    setLogValue("error","editTableForm function saveNewItem: "+XmlHttpRequest.status+" "+XmlHttpRequest.statusText+" "+XmlHttpRequest.responseURL);
                }
            }).catch(error => {
                console.log(error);
                setLogValue("error","editTableForm function saveNewItem: "+error.status+" "+error.statusText+" "+error.responseURL);
            });

        } else {
            setLogError ();
           
        }

    }catch (error){
        setLogValue("error","editTableForm function saveNewItem: "+error);
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
               
               
                webix.ajax().del("/init/default/api/"+currId+"/"+formValues.id+".json", formValues,{
                    success:function(text, data, XmlHttpRequest){
                        data = data.json();

                       

                        if (data.err_type == "i"){
                            
                            defaultStateForm();
                            setDirtyProperty();

                            if (window.innerWidth < 1200 && $$("tableEditPopup")){
                                hideEditPopup();
                            }
                            setLogValue("success","Данные успешно удалены");
                        } if (data.err_type == "e"){
                            setLogValue("error","editTableForm function removeItem: "+data.error);
                        }
                       
                    },
                    error:function(text, data, XmlHttpRequest){
                        setLogValue("error","editTableForm function removeItem: "+XmlHttpRequest.status+" "+XmlHttpRequest.statusText+" "+XmlHttpRequest.responseURL);
                    }
                }).catch(error => {
                    console.log(error);
                    setLogValue("error","editTableForm function removeItem ajax: "+error.status+" "+error.statusText+" "+error.responseURL);
                });
                
        });
    }catch (error){
        setLogValue("error","editTableForm function removeItem all: "+error);
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
        setLogValue("error","editTableForm function uniqueData: "+err);
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

            $$("table").getColumns().forEach(function(col,i){

                if (col.id == srcTable){
                  
                    let refTable =  col.type.slice(10);

                    try {

                        if ( $$("tree").getItem(refTable)){
                            $$("tree").select(refTable);
                        } else {
                             
                            if (refTable){
                                toRefTable (refTable);
                            }
                        }
                       
                        hideEditPopup();
                       
                    } catch (e){
                        console.log(e);
                        setLogValue("error","Таблица не найдена");

                        hideEmptyTempalte();
                    }
                }

            });
        }


        function createRefBtn(selectBtn){

            
            
            function btnClick (idBtn){
                const srcTable = $$(idBtn).config.srcTable;

                if ( $$("editTableFormProperty").config.dirty){
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

                
                let template = {
                    id:el.id,
                    label:el.label, 
                    unique: el.unique,
                    notnull: el.notnull,
                    length:el.length,
                    value: defValue ()
                };

                function createDateTimeInput(){
                    template.format = webix.Date.dateToStr("%d.%m.%Y %H:%i:%s");
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

                function createTextInput(){
                    template.type = "text";
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
    } catch (error){
        catchErrorTemplate("003-000", error);
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
    }catch (error){
        setLogValue("error","editTableForm function defaultStateForm: "+error);
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
    editable:true,
    tooltip:"Имя: #label#<br> Значение: #value#",
    hidden:true,
    elements:[],
    on:{
        onEditorChange:function(id, value){
            editingEnd (id,value);
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
    width: 320,
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

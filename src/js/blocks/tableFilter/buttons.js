import { setLogValue }                           from '../logBlock.js';

import { setFunctionError,setAjaxError }         from "../errors.js";
import { setStorageData }                        from "../storageSetting.js";
import { modalBox }                              from "../notifications.js";

import { createFilterPopup,returnTemplateValue}  from "./popup.js";
import { visibleInputs, clearSpace }             from "./common.js";

import { getItemId, getTable, hideElem, 
        getUserData, showElem }                  from "../commonFunctions.js";

const PREFS_STORAGE = {};  
const logNameFile   = "tableFilter => buttons";

function getUserprefsData (){

    return webix.ajax().get(`/init/default/api/userprefs/`)
    .then(function (data) {
        PREFS_STORAGE.userprefs = data.json();
        return PREFS_STORAGE.userprefs;
    }).fail(err => {
        setAjaxError(err, logNameFile,"getUserprefsData");
    }
);
}

function editFiltersBtn (){
  
    const currId = getItemId ();

    createFilterPopup();

    function userprefsData (){ 

        const userprefsGetData = webix.ajax("/init/default/api/userprefs/");

        userprefsGetData.then(function(data){

            function setTemplates(user){
                const lib = $$("filterEditLib");

                function clearOptionsPull(){
                
                    const oldOptions = [];
    
                    if (lib && lib.config.options.length !== 0){
                        lib.config.options.forEach(function(el){
                            oldOptions.push(el.id);
                        });

                        oldOptions.forEach(function(el){
                            lib.removeOption(el);
                        
                        });
                
                    }
                }

                clearOptionsPull();

                const dataSrc = data.json().content;
                try{
                    dataSrc.forEach(function(data, i) {
                     
                        if( data.name.includes("filter-template_") && data.owner == user.id ){
                            const prefs = JSON.parse(data.prefs);
                            if (prefs.table == currId){
                    
                                lib.addOption( {
                                    id    : i+1, 
                                    value : prefs.name
                                });
                    
                            }
                        }
                    
                    });
                } catch (err){
                    setFunctionError(err,logNameFile,"function setTemplates");
                }
    
            }
    
            function setEmptyOption(){
                $$("filterEditLib").addOption(
                    {   id      : "radioNoneContent",
                        disabled: true, 
                        value   : "Сохранённых шаблонов нет"
                    }
                );
            }


            let user = webix.storage.local.get("user");

            try{
                if (!user){
                    getUserData ();
                    user = webix.storage.local.get("user");
                }
    
                if(user){
                    setTemplates(user);

                    const lib = $$("filterEditLib");
                    
                    if (lib && lib.data.options.length == 0 ){
                        setEmptyOption();
                    }
             
                }
            } catch (err){
                setFunctionError(err,logNameFile,"function userprefsData");
            }
            
        });
        userprefsGetData.fail(function(err){
            setAjaxError(err, logNameFile,"saveTemplate");
        });
       
    }

    userprefsData ();

    function setValueLib(){
        const lib = $$("filterEditLib");
        if (lib){ 
            lib.setValue(  returnTemplateValue () );   
          
        }
    }  

    function stateSubmitBtn(state){
        const btn = $$("popupFilterSubmitBtn");
        if(state){
            btn.enable();
        } else {
            btn.disable();
        }
    
    }
    
    
    function popupSizeAdaptive(){

        const size  = window.innerWidth * 0.89;
        const popup = $$("popupFilterEdit");
        try{
            popup.config.width = size;
            popup.resize();
        } catch (err){
            setFunctionError(
                err,
                logNameFile,
                "function userprefsData => popupSizeAdaptive"
            );
        }
    }
    
    setValueLib();

    if (window.innerWidth < 1200 ){
        popupSizeAdaptive();
    }

    const checkbox =  {
        view        : "checkbox", 
        id          : "selectAll", 
        labelRight  : "<div style='font-weight:600'>Выбрать всё</div>", 
        labelWidth  : 0,
        name        : "selectAll",
        on          : {
            onChange:function(){
                stateSubmitBtn(true);

                function setValueCheckbox(){
                    const content    = $$("editFormPopupScrollContent");
                    const checkboxes = content.getChildViews();
                    try{
                        checkboxes.forEach(function(el,i){
                            if (el.config.id.includes("checkbox")){

                                if($$("selectAll").getValue()){
                                    el.config.value = 1;
                                } else {
                                    el.config.value = 0;
                                }
                                $$(el).refresh();
                            }

                        });
                    } catch (err){
                        setFunctionError(
                            err,
                            logNameFile,
                            "function checkbox:onchange => setValueCheckbox"
                        );
                    }
                }

                setValueCheckbox(); 
            

            },
    
        } 
    };
 
    
 
    function getAllCheckboxes(){
        const checkboxes           = [];
        const filterTableElements  = $$("filterTableForm").elements;
        try{
            Object.values(filterTableElements).forEach(function(el,i){
                checkboxes.push({ 
                    id    : el.config.id, 
                    label : el.config.label 
                });
            });
        }catch (err){
            setFunctionError( 
                err, 
                logNameFile, 
                "function editFiltersBtn => getAllCheckboxes" 
            );
        }
     
        return checkboxes;
    }
   
 
    function checkboxOnChange (el){
   
        const parent = $$(el.id+"_checkbox").getParentView();
        const childs = parent.getChildViews();
    
        let counter  = 0;
        let btnState = 0;

        function getStatusCheckboxes(){
            try{
                childs.forEach(function(el,i){
                    if (el.config.id.includes("checkbox")){
                        const value = el.config.value;

                        if ( !(value) || value == "" ){
                            counter++;
                        }
                    }
                    if (el.config.value){
                        btnState++;
                    }
                });
            } catch (err){
                setFunctionError(
                    err,
                    logNameFile,
                    "function checkboxOnChange => getStatusCheckboxes"
                );
            }
        }

        function setStateBtnSubmit(){
            stateSubmitBtn(true);
        }

        function setSelectAllState(){
            try{
                const selectAll = $$("selectAll");
               
                if (counter == 0){
                    selectAll.config.value = 1;
                    selectAll.refresh();

                } else if ( selectAll.config.value !== 0 ){
                    selectAll.config.value = 0;
                    selectAll.refresh();
                    
                }
            } catch (err){
                setFunctionError(
                    err,
                    logNameFile,
                    "function checkboxOnChange => setSelectAllState"
                );
            }
        }
       
        try{
            getStatusCheckboxes();
            setStateBtnSubmit();
            setSelectAllState();
        } catch (err){
            setFunctionError(
                err,
                logNameFile,
                "function checkboxOnChange"
            );

        }
    }

   
    function createCheckboxes(){

        const nameList = [
            {cols:[
                {   id  : "editFormPopupScrollContent",
                    css : "webix_edit-form-popup-scroll-content",
                    rows: [
                        checkbox
                    ]
                }
            ]}
        ];

  
   
        try {  
            const formData = getAllCheckboxes();

            formData.forEach(function(el,i){
                if(!(el.id.includes("child"))){

                    const template = {
                        view        : "checkbox", 
                        id          : el.id+"_checkbox", 
                        labelRight  : el.label, 
                        labelWidth  : 0,
                        name        : el.id,
                        on          : {
                            onChange:function(){
                                checkboxOnChange (el);
                            }
                        } 
                    };

                    const field = $$(el.id);

                    const allInputs = $$( el.id+"_rows").getChildViews();

            
                    if (field && field.isVisible() || allInputs.length > 1 ){
               
                        template.value = 1;
                        nameList[0].cols[0].rows.push(template);
                    
                    }else {
                        nameList[0].cols[0].rows.push(template);
                    }
                }
            });

            const scroll = $$("editFormPopupScroll");

            if (scroll){
                scroll.addView( {rows : nameList}, 1 );
            }
        } catch (err){
            setFunctionError(err,logNameFile,"function createCheckboxes");
        }
    }
    
    createCheckboxes();
  

    let counter = 0;
    const checkboxes = $$("editFormPopupScrollContent").getChildViews();
    
    function countSelectCheckboxes(){
        try{
            checkboxes.forEach(function(el,i){
                if (el.config.id.includes("checkbox")){
                    const value = el.config.value;

                    if ( !(value) || value == "" ){
                        counter++;
                    }
                }
            });
        } catch (err){
            setFunctionError(err,logNameFile,"function countSelectCheckboxes");
        }
    } 

    function stateSelectAll(){
        try{
            const selectAll = $$("selectAll");
            if ( counter == 0 ){
                selectAll.config.value = 1;
                selectAll.refresh();
            } 
        } catch (err){
            setFunctionError(err,logNameFile,"function stateSelectAll");
        }
    }

    countSelectCheckboxes();
    stateSelectAll();
 
}

function filterSubmitBtn (){
    
                             
    let query =[];

    
    function setLogicValue(value){
        let logic = null; 
        
        if (value == "1"){
            logic = "+and+";

        } else if (value == "2"){
            logic = "+or+";
        }

        return logic;
    }

    function setOperationValue(value){
        let operation;
        if (value === "=" || !value){
            operation = "+=+";
        
        } else if (value === "!="){
            operation = "+!=+";

        } else if (value === "<"){
            operation = "+<+";
            
        } else if (value === ">"){
            operation = "+>+";

        } else if (value === "<="){
            operation = "+<=+";
    
        } else if (value === ">="){
            operation = "+>=+";
            
        } else if (value === "⊆"){
            operation = "+contains+";
        } 

        return operation;
    }

    function setName(value){
        const itemTreeId     = getItemId ();

        return itemTreeId + "." + value;
    }

    function isBool(name){
        const table = getTable();
        const col   = table.getColumnConfig(name);
        let check   = false;
        if (col.type && col.type === "boolean"){
            check = true;
        }

        return check;
    }

    function returnBoolValue(value){
        if (value == 1){
            return true;
        } else if (value == 2){
            return false;
        }
    }

    function setValue(name, value){

        let sentValue = "'" + value + "'";

        if (value == 1 || value == 2){

            if ( isBool(name) ){
                sentValue = returnBoolValue(value);
            } 
            
        }
        return sentValue;
    }

    function createQuery (input){
        const name      = setName           (input.name);
        const value     = setValue          (input.name, input.value);
        const logic     = setLogicValue     (input.logic);
        const operation = setOperationValue (input.operation);

        let query = name + operation + value;

        if (logic){
            query = query + logic;
        }

        return query;
    }

    
    function createValuesArray(){
        const keys       = Object.keys(visibleInputs);
        const keysLength = keys.length;
        const valuesArr  = [];
        let inputs       = [];


        // объединить все inputs в один массив 
        for (let i = 0; i < keysLength; i++) {   
            const key = keys[i];
            inputs = inputs.concat(visibleInputs[key]);
        }

        function segmentBtnValue(input) {
            const segmentBtn = $$(input + "_segmentBtn") ;
            let value        = null;

            if (segmentBtn.isVisible()){
                value = segmentBtn.getValue();
            }
            return value;
        }

        inputs.forEach(function(input,i){
            const name       = $$(input).config.columnName;
            const value      = $$(input)                         .getValue();
            const operation  = $$(input + "-btnFilterOperations").getValue();

            const logic      = segmentBtnValue(input); 

            valuesArr.push ( { 
                id        : input,
                name      : name, 
                value     : value,
                operation : operation,
                logic     : logic  
            });
        });

        return valuesArr;
    }


    function createGetData(){
       
        const postFormatData = webix.Date.dateToStr("%d.%m.%Y %H:%i:%s");
        const valuesArr      = createValuesArray();

        const firstChild     = valuesArr[0].name;


        valuesArr.forEach(function(el,i){
      
            let filterEl = el.id;
            let value    = el.value ;
       
            function formattingDateValue(){
                const view = $$(filterEl).config.view; 
                if ( view == "datepicker" ){
                    value = postFormatData(value);
                }
            }
 
            function formattinSelectValue(){
                const text = $$(filterEl).config.text;
                if ( text && text == "Нет" ){
                    value = 0;
                }
            }

            if ($$(filterEl)){
                formattingDateValue ();
                formattinSelectValue();
                query.push(createQuery(el));
            }

        });
    }

    
    if ($$("filterTableForm").validate()){
        
        createGetData();

        const currTableView = getTable();

        const fullQuery = query.join("");

        currTableView.config.filter = {
            table:  currTableView.config.idTable,
            query:  fullQuery
        };

        const queryData = webix.ajax("/init/default/api/smarts?query=" + fullQuery );

        queryData.then(function(data){
            data             = data.json();
            const reccount   = data.reccount;
            const notifyType = data.err_type;
            const notifyMsg  = data.err;

            data             = data.content;

            function setData(){
                try{
                    currTableView.clearAll();
                    if (data.length !== 0){
                        currTableView.hideOverlay("Ничего не найдено");
                        currTableView.parse(data);
                    } else {
                        currTableView.showOverlay("Ничего не найдено");
                    }
                } catch (err){
                    setFunctionError(err, logNameFile, "function filterSubmitBtn => setData");
                }
            }

            function setCounterValue (){
                try{
                    const counter = $$("table-idFilterElements");
                    counter.setValues(reccount.toString());
                } catch (err){
                    setFunctionError(err, logNameFile, "setCounterVal");
                }
            }

         
            if (notifyType == "i"){

                setData();
                setCounterValue();
                hideElem($$("tableFilterPopup"));
        
                setLogValue("success","Фильтры успшено применены");
            
            } else {
                setLogValue("error",notifyMsg);
            } 
        });
        queryData.fail(function(err){
            setAjaxError(err, logNameFile,"createGetData");
        });

        
    } else {
        setLogValue("error","Не все поля формы заполнены");
    }
  

}

function filterLibraryBtn () {
    try {
        webix.prompt({
            title       : "Название шаблона",
            ok          : "Сохранить",
            cancel      : "Отменить",
            css         : "webix_prompt-filter-lib",
            input       : {
                required    : true,
                placeholder : "Введите название шаблона...",
            },
            width       : 350,
        }).then(function(result){
          
            async function saveTemplate (){ 

                if (!PREFS_STORAGE.userprefs){
                    await getUserprefsData (); 
                }

           
                const data         = PREFS_STORAGE.userprefs.content;
                const nameTemplate = result;
                let settingExists  = false;

                const currId       = getItemId();

                const template     = {
                    name        : nameTemplate,
                    table       : currId,
                    values      : []
                };

                function createPrefsValue(){
                    const keys             = Object.keys(visibleInputs);
                    const keysLength       = keys.length;

                    function pushValues(id, value, operation, logic, parent){

                        template.values.push({
                            id          : id, 
                            value       : value,
                            operation   : operation,
                            logic       : logic,
                            parent      : parent,
                        });

                    }

                    function isParent(el){
                        const parent = el.config.columnName + "_filter";
                        const id     = el.config.id;
                        let check    = null;

                        if (parent !== id){
                            check = el.config.columnName;
                        } else {

                        }

                        return check;
                    }

                    function setOperation(arr){
                        arr.forEach(function(el,i){
                       
                            try{
                                const value      = $$( el ).getValue();

                                const operation  = $$( el + "-btnFilterOperations" ).getValue();

                                const segmentBtn = $$( el + "_segmentBtn" );
                                let logic = null;
                                if (segmentBtn.isVisible()){
                                    logic = segmentBtn.getValue();
                                }

                                const parent = isParent($$( el ));
                        
                                pushValues(el, value, operation, logic, parent);

                            } catch(err){
                                setFunctionError(
                                    err,
                                    logNameFile,
                                    "function filterLibraryBtn => setOperation"
                                );
                            }
                        });
                    }
                   
                    for (let i = 0; i < keysLength; i++) {   
                        const key = keys[i];
                        setOperation(visibleInputs[key]);
                    }

                  
                }

                const sentObj = {
                    name    : currId + "_filter-template_" + nameTemplate,
                    prefs   : template,
                };

                
                function saveExistsTemplate(sentObj){
                    data.forEach(function(el,i){
               
                        const currName = currId + "_filter-template_" + nameTemplate;
                    
                        function putUserprefsData (){
                            const url     = "/init/default/api/userprefs/"+el.id;
                         
                            const putData = webix.ajax().put(url, sentObj);

                            putData.then(function(data){
                                data = data.json();
                                if (data.err_type == "i"){
                                    setLogValue(
                                        "success",
                                        "Шаблон" +
                                        " «" +
                                        nameTemplate +
                                        "» " +
                                        " сохранён в библиотеку"
                                    );
                                } else {
                                    setLogValue(
                                        "error",
                                        "tableFilter => buttons function modalBoxExists: " + 
                                        data.err
                                    );
                                }
                            });

                            putData.fail(function(err){
                                setAjaxError(
                                    err, 
                                    logNameFile,
                                    "saveExistsTemplate => putUserprefsData"
                                );
                            });

                        }

                        function modalBoxExists(){
               
                            modalBox(   "Шаблон с таким именем существует", 
                                        "После сохранения предыдущие данные будут стёрты", 
                                        ["Отмена", "Сохранить изменения"]
                            )
                            .then(function(result){
                               
                                if (result == 1){
                                    putUserprefsData ();
                                }
                            });
                        }
                     
                        if (el.name == currName){
                            settingExists = true;
                            modalBoxExists();
                        } 
                    });
                }

                function setDataStorage(){
                    const whoamiData = webix.ajax("/init/default/api/whoami");
                    whoamiData.then(function(data){
                        data          = data.json().content;
                        sentObj.owner = data.id;

                        const userData      = {};
                        userData.id         = data.id;
                        userData.name       = data.first_name;
                        userData.username   = data.username;
                        
                        setStorageData("user", JSON.stringify(userData));
                    });

                    whoamiData.fail(function(err){
                        setAjaxError(err, logNameFile,"saveTemplate => setDataStorage");
                    });

                }
                
                function saveNewTemplate(){
                    const ownerId = webix.storage.local.get("user").id;
                    if (ownerId){
                        sentObj.owner = ownerId;
                    } else {
                        setDataStorage();
                    }

                    const url           = "/init/default/api/userprefs/";

                    const userprefsPost = webix.ajax().post(url, sentObj);
                    
                    userprefsPost.then(function(data){
                        data = data.json();
    
                        if (data.err_type == "i"){
                            setLogValue(
                                "success",
                                "Шаблон" +
                                " «" +
                                nameTemplate +
                                "» " +
                                " сохранён в библиотеку"
                            );
                        } else {
                            setLogValue("error",data.error);
                        }
                    });

                    userprefsPost.fail(function(err){
                        setAjaxError(
                            err, 
                            logNameFile,
                            "saveTemplate => saveNewTemplate"
                        );
                    });

                }
               
                if (PREFS_STORAGE.userprefs){

                    createPrefsValue    ();
                    saveExistsTemplate  (sentObj);

                    
                    if (!settingExists){
                        saveNewTemplate();
                    } 
                  
                }
            }

            saveTemplate ();

        });
    
    } catch(err) {
        setFunctionError(err,logNameFile,"function filterSubmitBtn");
    }
}

function backTableBtnClick() {
    const filterForm     = $$("filterTableBarContainer");
   
    const tableContainer = $$("tableContainer");
    

    function setBtnFilterState(){
        const btnClass          = document.querySelector(".webix_btn-filter");
        const primaryBtnClass   = "webix-transparent-btn--primary";
        const secondaryBtnClass = "webix-transparent-btn";

        if (btnClass.classList.contains(primaryBtnClass)){
            btnClass.classList.add     (secondaryBtnClass);
            btnClass.classList.remove  (primaryBtnClass);
        }
    }
    function defaultState(){
        if ( filterForm && filterForm.isVisible() ){
            filterForm.hide();
        }
    
        if ( tableContainer && !(tableContainer.isVisible()) ){
            tableContainer.show();
        }

        const table = $$("table");
        if (table){
            table.clearSelection();
        }
    }


    defaultState();
    setBtnFilterState();
  
}

function resetFilterBtn (){
    const table = getTable();
    try {

        const itemTreeId = getItemId ();
        const url        = "/init/default/api/smarts?query=" + itemTreeId + ".id >= 0";
        const queryData  = webix.ajax(url);

        table.config.filter = null;
        
        queryData.then(function(data){
            const dataErr =  data.json();
          
            data = data.json().content;
                
            function setDataTable(){
                try{
                    if (data.length !== 0){
                        table.hideOverlay("Ничего не найдено");
                        table.clearAll();
                        table.parse(data);
                    } else {
                        table.clearAll();
                        table.showOverlay("Ничего не найдено");
                    }
                } catch (err){
                    setFunctionError(
                        err,
                        logNameFile,
                        "function resetFilterBtn => setDataTable"
                    );
                }
            }

            function setFilterCounterVal(){
                try{
                    const filterTable     = $$("table-idFilterElements");
                    const filterCountRows = $$("table").count();
                    const value           = filterCountRows.toString();

                    filterTable.setValues(value);
                } catch (err){
                    setFunctionError(
                        err,
                        logNameFile,
                        "function setFilterCounterVal"
                    );
                }
            }

            function clearFilterValues(){
                const form = $$("filterTableForm");
                if(form){
                    form.clear(); 
                }
            }

            function hideInputsContainer(){
                const inputs = document.querySelectorAll(".webix_filter-inputs");

                const hideClass = "webix_hide-content";
                try{
                    inputs.forEach(function(elem,i){
                        if ( !(elem.classList.contains(hideClass)) ){
                            elem.classList.add(hideClass);
                        }
                    });
                } catch (err){
                    setFunctionError(
                        err,
                        logNameFile,
                        "function resetFilterBtn => hideInputsContainer"
                    );
                }
            }


            function disableLibSaveBtn(){
                const saveBtn = $$("filterLibrarySaveBtn") ;
                if (saveBtn && saveBtn.isEnabled()){
                    saveBtn.disable();
                }
            }

            function showEmptyTemplate(){
                const emptyTemplate = $$("filterEmptyTempalte");
                showElem(emptyTemplate);
            }

            function disableRemoveBtn(){
                $$("resetFilterBtn").disable();
            }

            if (dataErr.err_type == "i"){
                try{
                    setDataTable        ();
                    setFilterCounterVal ();
                    hideElem            ($$("tableFilterPopup"));
                    clearFilterValues   ();
                    hideInputsContainer ();
                    clearSpace          ();
                    disableLibSaveBtn   ();
                    showEmptyTemplate   ();
                    disableRemoveBtn    ();
                } catch (err){
                    setFunctionError(
                        err,
                        logNameFile,
                        "function resetFilterBtn"
                    );
                }
            
                setLogValue("success", "Фильтры очищены");
            } else {
                setLogValue(
                    "error", 
                    "tableFilter => buttons function resetFilterBtn ajax: " +
                    dataErr.err
                );
            }
        });

        queryData.fail(function(err){
            setAjaxError(err, logNameFile,"resetFilterBtn");
        });
    
    } catch(err) {
        setFunctionError(
            err,
            "Ошибка при очищении фильтров; tableFilter => buttons",
            "function resetFilterBtn"
        );
    }
}

function buttonsFormFilter (name) {

    const formResetBtn = {  
        view    : "button",
        id      : "resetFilterBtn",
        disabled: true,
        height  : 48,
        minWidth: 50,
        width   : 65,
        hotkey  : "shift+esc",
        css     : "webix_danger", 
        type    : "icon", 
        icon    : "icon-trash", 
        click   : resetFilterBtn,
        on      : {
            onAfterRender: function () {
                this.getInputNode().setAttribute("title", "Сбросить фильтры");
            }
        } 
    };
    
    const formBtnSubmit = {   
        view    : "button",
        id      : "btnFilterSubmit",
        height  : 48,
        minWidth: 70, 
        css     : "webix_primary",
     //   hotkey  : "Enter",
        disabled: true,
        value   : "Применить фильтры", 
        click   : filterSubmitBtn,
        on      : {
            onAfterRender: function () {
                this.getInputNode().setAttribute(
                    "title","Применить фильтры"
                );
            },
        },
    };
    
    const formEditBtn = {   
        view    : "button",
        value   : "Открыть редактор",
        height  : 48,
        minWidth: 140, 
        click   : editFiltersBtn,
        on      : {
            onAfterRender: function () {
                this.getInputNode().setAttribute(
                    "title","Добавить/удалить фильтры"
                );
            },
        },
    };    
    
    const filterBackTableBtn = { 
        view    : "button", 
        id      : "table-backTableBtnFilter",
        type    : "icon",
        icon    : "icon-arrow-left",
        value   : "Вернуться к таблице",
        hidden  : true,  
        height  : 48,
        minWidth: 50,
        width   : 55,
       
        click   : function(){
            backTableBtnClick();
        },
    
        on      : {
            onAfterRender: function () {
                this.getInputNode().setAttribute(
                    "title","Вернуться к таблице"
                );
            }
        } 
    };
    
    const formLibrarySaveBtn = {   
        view    : "button",
        id      : "filterLibrarySaveBtn",
        disabled: true,
        height  : 48,
        minWidth: 50,
        width   : 65,
        hotkey  : "shift+esc",
        type    : "icon", 
        icon    : "icon-file", 
        click   : filterLibraryBtn,
        on      : {
            onAfterRender: function () {
                this.getInputNode().setAttribute(
                    "title", "Сохранить шаблон с полями в библиотеку"
                );
            }
        } 
    };
    
    if ( name == "formResetBtn" ) {
        return formResetBtn;
    } else if ( name == "formBtnSubmit" ){
        return formBtnSubmit;
    } else if ( name == "formEditBtn" ){
        return formEditBtn;
    } else if ( name == "filterBackTableBtn" ){
        return filterBackTableBtn;
    } else if ( name == "formLibrarySaveBtn" ){
        return formLibrarySaveBtn;
    }
}

export {
    buttonsFormFilter,
    resetFilterBtn,
    getUserprefsData,
    PREFS_STORAGE
};
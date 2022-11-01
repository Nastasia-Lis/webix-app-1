import { setLogValue }                            from '../logBlock.js';
import { getItemId, hideElem, getUserData }       from "../commonFunctions.js";
import { setFunctionError,setAjaxError }          from "../errors.js";
import { setStorageData }                         from "../storageSetting.js";
import { modalBox }                               from "../notifications.js";

import { createFilterPopup,returnTemplateValue }  from "./popup.js";

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
        const size  = window.innerWidth - 500;
        const popup = $$("popupFilterEdit");
        try{
            if( popup && popup.$width > 200 ){
                popup.config.width = size;
                popup.resize();
            }
        } catch (err){
            setFunctionError(err,logNameFile,"function userprefsData => popupSizeAdaptive");
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
                    const checkboxes = $$("editFormPopupScrollContent").getChildViews();
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
                        setFunctionError(err,logNameFile,"function checkbox:onchange => setValueCheckbox");
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
            setFunctionError( err, logNameFile, "function editFiltersBtn => getAllCheckboxes" );
        }
     
        return checkboxes;
    }

   // let formData = getAllCheckboxes();
   
 
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
                setFunctionError(err,logNameFile,"function checkboxOnChange => getStatusCheckboxes");
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
                setFunctionError(err,logNameFile,"function checkboxOnChange => setSelectAllState");
            }
        }
       
        try{
            getStatusCheckboxes();
            setStateBtnSubmit();
            setSelectAllState();
        } catch (err){
            setFunctionError(err,logNameFile,"function checkboxOnChange");

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
    
    const values = $$("filterTableForm").getValues();
                             
    let query =[];

    function getOperationVal (value, filterEl,condition, position, parentIndex=false){
 
        const itemTreeId     = getItemId ();
        const operationValue = $$(filterEl+"-btnFilterOperations").config.value;
        
        let sentName;

        if (filterEl.includes("_filter")){
            const index = filterEl.lastIndexOf("_");
            sentName    = filterEl.slice(0,index);
        }

        function templateSecondItems (operation){
            const name = itemTreeId + "." + sentName;
            return "+and+" + name + operation + value;
        }

        function templateFirstItems(operation){
            const name = itemTreeId + "." + sentName;
            return name + operation + value;
        }

        
        function templateChilds(operation){
            const name = itemTreeId + "." + sentName;
            return "+" + condition + "+" + name + operation + value;
        }

        try {
      
            if (position == "parent"){

                if(parentIndex){
          
                    if (operationValue == "="){
                       query.push(templateSecondItems ("+=+"));
                     
                    } else if (operationValue == "!="){

                       query.push(templateSecondItems ("+!=+"));
                  
                    } else if (operationValue == "<"){
                       query.push(templateSecondItems ("+<+"));
                       
                    } else if (operationValue == ">"){
                       query.push(templateSecondItems ("+>+"));
                        
                    } else if (operationValue == "<="){
    
                      query.push(templateSecondItems ("+<=+"));
                
                    } else if (operationValue == ">="){
                        query.push(templateSecondItems ("+>=+"));
                        
                    } else if (operationValue == "⊆"){
                    
                        query.push(templateSecondItems ("+contains+"));
                    }

                }else {
                    if (operationValue == "="){
                        query.push(templateFirstItems("+=+"));
                    } else if (operationValue == "!="){
                        query.push(templateFirstItems("+!=+"));
                    } else if (operationValue == "<"){
                        query.push(templateFirstItems("+<+"));
                    } else if (operationValue == ">"){
                        query.push(templateFirstItems("+>+"));
                    } else if (operationValue == "<="){
                        query.push(templateFirstItems("+<=+"));
                    } else if (operationValue == ">="){
                        query.push(templateFirstItems("+>=+"));
                    } else if (operationValue == "⊆"){
                        query.push(templateFirstItems("+contains+"));
                    }
                }
                
            
            } else if (position == "child") {

                
                    if (operationValue == "="){
                        query.push(templateChilds("+=+"));
                    
                    } else if (operationValue == "!="){
                        query.push(templateChilds("+!=+"));

                    }  else if (operationValue == "<"){
                        query.push(templateChilds("+<+"));

                    } else if (operationValue == ">"){
                        query.push(templateChilds("+>+"));

                    } else if (operationValue == ">="){
                        query.push(templateChilds("+>=+"));

                    } else if (operationValue == "<="){
                        query.push(templateChilds("+<=+"));

                    } else if (operationValue == "⊆"){
                        query.push(templateChilds("+contains+"));
                    }
                
            }
        } catch (err){
            setFunctionError(err,logNameFile,"function filterSubmitBtn => getOperationVal");
        }
    }


    
    
    function createGetData(){
       
        const postFormatData = webix.Date.dateToStr("%d.%m.%Y %H:%i:%s");
        const valuesArr      = [];

        function checkInput(el){
            el.getChildViews().forEach(function(child,i){
                const idEl = child.config.id;
                if (idEl.includes("-container-child-")){

                    const startIndex   = idEl.indexOf("container-child-")-1;
                    const startId      = idEl.slice(0,startIndex);

                    const endIndex     = idEl.indexOf("-child-");
                    const endId        = idEl.slice(endIndex);

                    const name         = $$( startId + endId ).config.name;

                    valuesArr.push ({name:name, value:$$(startId+endId).getValue()});

                } else {
                    const index         = idEl.indexOf("_container");
                    const idParentInput = idEl.slice(0,index)+"_filter";

                    const name         = $$(idParentInput).config.name;
                    valuesArr.push ({name:name, value:$$(idParentInput).getValue()});

                }
            });
        }
        
        $$("inputsFilter")._cells.forEach(function(el,i){
            checkInput(el);
        });

        let checkFirstChild = false;
        let firstItem       = 0;
     
        const notNullVals = [];

        function removeNull(){
            valuesArr.forEach(function(el,i){
                if (el.value){
                    notNullVals.push(el);
                } 
            });
        }

        removeNull();

        notNullVals.forEach(function(el,i){
      
            let filterEl = el.name;
            let value    = el.value ;
 
 
            if (i == 0 && filterEl.includes("child")){
                checkFirstChild = true;
                firstItem       = 1;
            } else {
                checkFirstChild = false;
            }
       
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

            function createQuery(){
           
     
                try{

                    if( !(filterEl.includes("child")) ){

                        if (checkFirstChild){
                            getOperationVal ("'"+value+"'",filterEl,"and","parent",true);
                            firstItem++;
                        } else if ( firstItem == 0 ) {
                            getOperationVal ("'"+value+"'",filterEl,"and","parent");
                        } else if  ( firstItem > 0 ){
                            getOperationVal ("'"+value+"'",filterEl,"and","parent",true);
                        }

                        firstItem++;
                        
                    } else if (filterEl.includes("child")){ 

                        if (checkFirstChild){

                            if (filterEl.includes("operAnd")){
                                getOperationVal ("'"+value+"'",filterEl,"and","parent");
    
                            } else if (filterEl.includes("operOr")){
                                getOperationVal ("'"+value+"'",filterEl,"or","parent");
                            }
                           
                        } else {
                            if (filterEl.includes("operAnd")){
                                getOperationVal ("'"+value+"'",filterEl,"and","child");
    
                            } else if (filterEl.includes("operOr")){
                                getOperationVal ("'"+value+"'",filterEl,"or","child");
                            }
                        }
                    
                    }
                } catch (err){
                    setFunctionError(err,logNameFile,"function createQuery");
                }
            }


            if (value && $$(filterEl)){
                try{
                    formattingDateValue();
                    formattinSelectValue();
                    createQuery();
                } catch (err){
                    setFunctionError(err,logNameFile,"function createGetData");
                }
            }

        });

    }

    
    if ($$("filterTableForm").validate()){
        
        createGetData();
        let currTableView;
        if ($$("table").isVisible()){
            currTableView = $$("table");
        } else {
            currTableView = $$("table-view");
        }
   
        currTableView.config.filter = query.join("");

        const queryData = webix.ajax("/init/default/api/smarts?query=" + query.join("") );

        queryData.then(function(data){
            data             = data.json();
            const reccount   = data.reccount;
            const notifyType = data.err_type;
            const notifyMsg  = data.err;

            data             = data.content;


            function setData(){
                try{
                   
                    if (data.length !== 0){
                        currTableView.hideOverlay("Ничего не найдено");
                        currTableView.clearAll();
                        currTableView.parse(data);
                    } else {
                        currTableView.clearAll();
                        currTableView.showOverlay("Ничего не найдено");
                    }
                } catch (err){
                    setFunctionError(err,logNameFile,"function filterSubmitBtn => setData");
                }
            }

            function setCounterValue (){
                try{
                    const counter = $$("table-idFilterElements");
                    counter.setValues(reccount.toString());
                } catch (err){
                    setFunctionError(err,logNameFile,"setCounterVal");
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
            width:350,
        }).then(function(result){
          
            async function saveTemplate (){ 

                if (!PREFS_STORAGE.userprefs){
                    await getUserprefsData (); 
                }

           
                const data         = PREFS_STORAGE.userprefs.content;
                const nameTemplate = result;
                const collection   = { content:[] };
                let settingExists  = false;

                const currId       = getItemId();
                const inputs       =  $$("inputsFilter")._collection;

                const formVals     = $$("filterTableForm").getValues();

                const template     = {
                    name        : nameTemplate,
                    collection  : collection,
                    values      : formVals,
                    table       : currId
                };
              
           

                const sentObj = {
                    name    : currId + "_filter-template_" + nameTemplate,
                    prefs   : template,
                };

                function childs(el,id){
                 
                    try{
                     
                        $$(el.id).getChildViews().forEach(function(child,i){
                            
                            const condition   = $$(child.config.id)._collection[0].id;
                            const index       = el.id.lastIndexOf("_rows");
                            const parentField = el.id.slice(0,index);

                   
                         
                            function setChildToCollection(){
                                let idInput = $$(child.config.id).getChildViews()[1]._collection[0].id;
                                let tempalteCollectionItem = {
                                    parentField: $$(parentField).config, 
                                    childValue : {
                                        id   : idInput+"-btnFilterOperations",
                                        value: $$(idInput+"-btnFilterOperations").getValue()
                                    }
                                };
                                if (condition.includes("and")){
                                    tempalteCollectionItem.condition = "and";
                                    collection.content.push(tempalteCollectionItem);
                                } else if (condition.includes("or")){
                                    tempalteCollectionItem.condition = "or";
                                    collection.content.push(tempalteCollectionItem);
                                } 
                            }

                            console.log(child.config.id)
                            if (child.config.id.includes("child")){
                                setChildToCollection();
                          
                            } else {
                                collection.content.push({
                                    condition:"parent",
                                    parentField:$$(el.id).config, 
                                    parentValue:{
                                        id:id+"-btnFilterOperations", 
                                        value:$$(id+"-btnFilterOperations").getValue()
                                    }
                                });
                            }

                        });
                    } catch(err){
                        setFunctionError(err,logNameFile,"function filterLibraryBtn => childs:");
                    }
                }

                
                function saveExistsTemplate(sentObj){
                    data.forEach(function(el,i){
               
                        const currName = currId + "_filter-template_" + nameTemplate;

                        function putUserprefsData (){
                            const url     = "/init/default/api/userprefs/"+el.id;
                            const putData = webix.ajax().put(url, sentObj);

                            putData.then(function(data){
                                data = data.json();
                                if (data.err_type == "i"){
                                    setLogValue("success","Шаблон"+" «"+nameTemplate+"» "+" сохранён в библиотеку");
                                } else {
                                    setLogValue("error","tableFilter => buttons function modalBoxExists: "+ data.err);
                                }
                            });

                            putData.fail(function(err){
                                setAjaxError(err, logNameFile,"saveExistsTemplate => putUserprefsData");
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
                            setLogValue("success","Шаблон"+" «"+nameTemplate+"» "+" сохранён в библиотеку");
                        } else {
                            setLogValue("error",data.error);
                        }
                    });

                    userprefsPost.fail(function(err){
                        setAjaxError(err, logNameFile,"saveTemplate => saveNewTemplate");
                    });

                }

                if (PREFS_STORAGE.userprefs){
                    inputs.forEach(function(el,i){
                       
                        const indexId = el.id.lastIndexOf("_rows");
                        const id = el.id.slice(0,indexId);

                        if ($$(id).isVisible()){
                            childs(el,id);
                        }
                    });

                    saveExistsTemplate(sentObj);

                    
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
    const filterForm     = $$("filterTableForm");
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
    try {

        const itemTreeId = getItemId ();
        const url        = "/init/default/api/smarts?query="+itemTreeId+".id >= 0";
        const queryData  = webix.ajax(url);
        queryData.then(function(data){
            const dataErr =  data.json();
          
            data = data.json().content;
                
            function setDataTable(){
                try{
                    const table = $$("table");
                    if (data.length !== 0){
                        table.hideOverlay("Ничего не найдено");
                        table.clearAll();
                        table.parse(data);
                    } else {
                        table.clearAll();
                        table.showOverlay("Ничего не найдено");
                    }
                } catch (err){
                    setFunctionError(err,logNameFile,"function resetFilterBtn => setDataTable");
                }
            }

            function setFilterCounterVal(){
                try{
                    const filterTable     = $$("table-idFilterElements");
                    const filterCountRows = $$("table").count();
                    const value           = filterCountRows.toString();

                    filterTable.setValues(value);
                } catch (err){
                    setFunctionError(err,logNameFile,"function setFilterCounterVal");
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
                    setFunctionError(err,logNameFile,"function resetFilterBtn => hideInputsContainer");
                }
            }

            function clearSpace(){
                const childs = [];
                const inputsContainer = $$("inputsFilter").getChildViews();
                
      
                inputsContainer.forEach(function(el,i){
                    const inputId = el._collection[0].cols[0].id;
                    
                    function removeParentInput(){
                        $$(inputId).hide();
                    }

                    function getChildsId (){
                        try{
                            const childsView = $$(el.config.id).getChildViews();
                            childsView.forEach(function(child,i){
                                if (child.config.id.includes("child")){
                                    childs.push (child.config.id);
                                }
                            });
                        } catch (err){
                            setFunctionError(err,logNameFile,"function resetFilterBtn => getChildsId");
                        }
                    }

                    try{
                        removeParentInput();
                        getChildsId ();
                        hideElem($$(inputId+"_container-btns"));
                    } catch (err){
                        setFunctionError(err,logNameFile,"function resetFilterBtn => clearSpace");
                    }

                });
               
                function removeChilds(){
                    try{
                        childs.forEach(function(idChild,i){
                            const child  = $$(idChild);
                            const parent = child.getParentView();
                            parent.removeView(child);
                        });
                    } catch (err){
                        setFunctionError(err,logNameFile,"function resetFilterBtn => removeChilds");
                    }
                }
                removeChilds();
            }

            function disableLibSaveBtn(){
                const saveBtn = $$("filterLibrarySaveBtn") ;
                if (saveBtn && saveBtn.isEnabled()){
                    saveBtn.disable();
                }
            }

            function showEmptyTemplate(){
                const emptyTemplate = $$("filterEmptyTempalte");
                if  (emptyTemplate && !(emptyTemplate.isVisible()) ){
                    emptyTemplate.show();
                    emptyTemplate.refresh();
                }
            }

            function disableRemoveBtn(){
                $$("resetFilterBtn").disable();
            }

            if (dataErr.err_type == "i"){
                try{
                    setDataTable();
                    setFilterCounterVal();
                    hideElem($$("tableFilterPopup"));
                    clearFilterValues();
                    hideInputsContainer();
                    clearSpace();
                    disableLibSaveBtn();
                    showEmptyTemplate();
                    disableRemoveBtn();
                } catch (err){
                    setFunctionError(err,logNameFile,"function resetFilterBtn");
                }
            
                setLogValue("success", "Фильтры очищены");
            } else {
                setLogValue("error", "tableFilter => buttons function resetFilterBtn ajax: "+dataErr.err);
            }
        });

        queryData.fail(function(err){
            setAjaxError(err, logNameFile,"resetFilterBtn");
        });
    
    } catch(err) {
        setFunctionError(err,"Ошибка при очищении фильтров; tableFilter => buttons","function resetFilterBtn");
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
        hotkey  : "Enter",
        disabled: true,
        value   : "Применить фильтры", 
        click   : filterSubmitBtn,
    };
    
    const formEditBtn = {   
        view    : "button",
        value   : "Редактор фильтров",
        height  : 48,
        minWidth: 140, 
        click   : editFiltersBtn,
        on      : {
            onAfterRender: function () {
                this.getInputNode().setAttribute("title","Добавить/удалить фильтры");
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
                this.getInputNode().setAttribute("title","Вернуться к таблице");
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
                this.getInputNode().setAttribute("title", "Сохранить шаблон с полями в библиотеку");
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
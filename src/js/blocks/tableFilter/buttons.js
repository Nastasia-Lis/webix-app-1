import { setLogValue }                            from '../logBlock.js';
import { getItemId }                              from "../commonFunctions.js";
import { setFunctionError,setAjaxError }          from "../errors.js";
import { setStorageData }                         from "../storageSetting.js";
import { modalBox }                               from "../notifications.js";

import { createFilterPopup,returnTemplateValue }  from "./popup.js";

const PREFS_STORAGE = {};  
const logNameFile = "tableFilter => buttons";

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
            function getUserData (){
                    
                const whoamiData = webix.ajax("/init/default/api/whoami");
    
                whoamiData.then(function(data){
                    data = data.json().content;
    
                    function createStorageData (){
                        let userData = {};
                    
                        userData.id       = data.id;
                        userData.name     = data.first_name;
                        userData.username = data.username;
                        
                        setStorageData("user", JSON.stringify(userData));
                    }
    
                    function getStorageData (){
                        user = webix.storage.local.get("user");
                    }
                    try{
                        createStorageData ();
                        getStorageData ();
                    }catch (err){
                        setFunctionError(err,logNameFile,"function getUserData");
                    }
        
                    if (data.err_type == "e"){
                        setLogValue("error",data.error);
                    } else {
                        setLogValue("success","Рабочая область фильтра обновлена");
                    }
                });
        
                whoamiData.fail(function(err){
                    setAjaxError(err, logNameFile,"getUserData");
                });
            }
    
            function setTemplates(user){

                function clearOptionsPull(){
                    const lib        = $$("filterEditLib");
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

                let dataSrc = data.json().content;
                try{
                    dataSrc.forEach(function(data, i) {
                     
                        if(data.name.includes("filter-template_") && data.owner == user.id){
                            let prefs = JSON.parse(data.prefs);
                            if (prefs.table == currId){
                    
                                $$("filterEditLib").addOption( {id:i+1, value:prefs.name});
                    
                            }
                        }
                    
                    });
                } catch (err){
                    setFunctionError(err,logNameFile,"function setTemplates");
                }
    
            }
    
            function setEmptyOption(){
                $$("filterEditLib").addOption(
                    {   id:"radioNoneContent",
                        disabled:true, 
                        value:"Сохранённых шаблонов нет"
                    }
                );
            }
    
            // function counterVisibleElements (){
            //     let visibleElements=0;
            //     let filterElements = $$("filterTableForm").elements;
            //     try{
            //         Object.values(filterElements).forEach(function(el,i){
            //             if (!(el.config.hidden)){
            //                 visibleElements++;
            //             }
                        
            //         });
            //     } catch (err){
            //         setFunctionError(err,logNameFile,"function counterVisibleElements");
            //     }
            //     return visibleElements;
            // }
           


            let user = webix.storage.local.get("user");
            try{
                if (!user){
                    getUserData ();
                }
    
                if(user){
                    setTemplates(user);
                    
                    if ($$("filterEditLib") && $$("filterEditLib").data.options.length == 0 ){
                        setEmptyOption();
                    }
             
                }
            } catch (err){
                setFunctionError(err,logNameFile,"function userprefsData");
            }
            
        });
        userprefsGetData.fail(function(err){
            console.log(err);
            setLogValue("error", "tableFilter => buttons function userprefsData: "+err.status+" "+err.statusText+" "+err.responseURL);
        });
       

        // if (PREFS_STORAGE.userprefs){

            
        // }
    }

    userprefsData ();

    function setValueLib(){
        if ($$("filterEditLib")){
            //$$("filterEditLib").setValue(filterTemplateValue);   
            $$("filterEditLib").setValue(  returnTemplateValue () );   
          
        }
    }  

    function stateSubmitBtn(state){
        if(state){
            $$("popupFilterSubmitBtn").enable();
        } else {
            $$("popupFilterSubmitBtn").disable();
        }
    
    }
    
    
    function popupSizeAdaptive(){
        let size = window.innerWidth - 500;
        try{
            if($$("popupFilterEdit") && $$("popupFilterEdit").$width > 200){
                $$("popupFilterEdit").config.width = size;
                $$("popupFilterEdit").resize();
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
        view:"checkbox", 
        id:"selectAll", 
        labelRight:"<div style='font-weight:600'>Выбрать всё</div>", 
        labelWidth:0,
        name:"selectAll",
        on:{
            onChange:function(){
                stateSubmitBtn(true);
                // function setStateSubmitBtn(){
                //     try{
                //         if ($$("selectAll").getValue()){
                //             if(!($$("popupFilterSubmitBtn").isEnabled())){
                //                 stateSubmitBtn(true);
                //             }

                //         } 
                //         //else {
                //             // if($$("popupFilterSubmitBtn").isEnabled()){
                //             //     stateSubmitBtn(false);
                //             // }
                //       //  }
                //     } catch (err){
                //         setFunctionError(err,logNameFile,"function checkbox:onchange => setStateSubmitBtn");
                //     }
                // }

                function setValueCheckbox(){
                    let checkboxes = $$("editFormPopupScrollContent").getChildViews();
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
        let checkboxes = [];
        const filterTableElements  = $$("filterTableForm").elements;
        try{
            Object.values(filterTableElements).forEach(function(el,i){
                checkboxes.push({ id:el.config.id, label:el.config.label })
            });
        }catch (err){
            setFunctionError( err, logNameFile, "function editFiltersBtn => getAllCheckboxes" );
        }
     
        return checkboxes;
    }

    let formData = getAllCheckboxes();
 
 
    function checkboxOnChange (el){
   
        let parent = $$(el.id+"_checkbox").getParentView();
        let childs = parent.getChildViews();
    
        let counter=0;
        let btnState = 0;

        function getStatusCheckboxes(){
            try{
                childs.forEach(function(el,i){
                    if (el.config.id.includes("checkbox")){
                        if (!(el.config.value)||el.config.value==""){
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
            // try{
            //     if (btnState > 0) {
            //         if(!($$("popupFilterSubmitBtn").isEnabled())){
            //             stateSubmitBtn(true);
            //         }
            //     } 
            //     else {
            //         if($$("popupFilterSubmitBtn").isEnabled()){
            //             stateSubmitBtn(false);
            //         }
            //     }
            // } catch (err){
            //     setFunctionError(err,logNameFile,"function checkboxOnChange => setStateBtnSubmit");
            // }
        }
        function setSelectAllState(){
            try{
                if (counter == 0){
                    $$("selectAll").config.value = 1;
                    $$("selectAll").refresh();
                } else {
                    if ($$("selectAll").config.value !== 0){
                        $$("selectAll").config.value = 0;
                        $$("selectAll").refresh();
                    }
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
                {   id:"editFormPopupScrollContent",
                    css:"webix_edit-form-popup-scroll-content",
                    rows:[
                        checkbox
                    ]
                }
            ]}
        ];

        try {  
            formData.forEach(function(el,i){
                if(!(el.id.includes("child"))){
                    let template = {
                        view:"checkbox", 
                        id:el.id+"_checkbox", 
                        labelRight:el.label, 
                        labelWidth:0,
                        name:el.id,
                        on:{
                            onChange:function(){
                                checkboxOnChange (el);
                            }
                        } 
                    };

                    if ($$(el.id) && $$(el.id).isVisible()){
                        template.value = 1;
                        nameList[0].cols[0].rows.push(template);
                    
                    }else {
                        nameList[0].cols[0].rows.push(template);
                    }
                }
            });

            if ($$("editFormPopupScroll")){
                $$("editFormPopupScroll").addView({rows:nameList},1);
            }
        } catch (err){
            setFunctionError(err,logNameFile,"function createCheckboxes");
        }
    }
    
    createCheckboxes();
  

    let counter = 0;
    let checkboxes = $$("editFormPopupScrollContent").getChildViews();
    
    function countSelectCheckboxes(){
        try{
            checkboxes.forEach(function(el,i){
                if (el.config.id.includes("checkbox")){
                    if (!(el.config.value)||el.config.value==""){
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
            if (counter == 0){
                $$("selectAll").config.value = 1;
                $$("selectAll").refresh();
            } 
        } catch (err){
            setFunctionError(err,logNameFile,"function stateSelectAll");
        }
    }

    countSelectCheckboxes();
    stateSelectAll();
 
}


function hideFilterPopup(){
    if ($$("tableFilterPopup") && $$("tableFilterPopup").isVisible()){
        $$("tableFilterPopup").hide();
    }
}

function filterSubmitBtn (){
    
    let values = $$("filterTableForm").getValues();
                             
    let query =[];

    function getOperationVal (value, filterEl,el,condition, position, parentIndex=false){
       
        const itemTreeId = getItemId ();

        let operationValue = $$(el+"-btnFilterOperations").config.value;

        function templateSecondItems (operation){
            return "+and+"+itemTreeId+"."+filterEl+operation+value    
        }

        function templateFirstItems(operation){
            return itemTreeId+"."+filterEl+operation+value;
        }

        
        function templateChilds(operation){
            return "+"+condition+"+"+itemTreeId+"."+filterEl+operation+value;
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
        let filterEl;
        let postFormatData = webix.Date.dateToStr("%d.%m.%Y %H:%i:%s");
        let value;
        let firstItem = 0;

        Object.keys(values).sort().forEach(function(el,i){

            filterEl = el;
            value = values[el];
            function formattingDateValue(){
                if ($$(el).config.view == "datepicker"){
                    value = postFormatData(value);
                }
            }

            function formattinSelectValue(){
                if ($$(el).config.text && $$(el).config.text == "Нет"){
                    value = 0;
                }
            }

            function createFilterElement (){
                if (el.includes("filter") && !(el.includes("condition"))){
                    filterEl = el.lastIndexOf("_");
                    filterEl = el.slice(0,filterEl)
                }
            }

            function createQuery(){
                try{
                    if(
                        !(el.includes("condition")) &&
                        !(el.includes("child"    )) &&
                        values[el]!== ""            &&
                        el        !== "selectAll"   &&
                        $$(el).isVisible()
                    ){
                        
                        
                        if (firstItem > 0){
                            getOperationVal ("'"+value+"'",filterEl,el,"and","parent",true);
                        }else {
                            getOperationVal ("'"+value+"'",filterEl,el,"and","parent");
                        }

                        firstItem++;
                        
                    } else if (el.includes("child")){
                        if (el.includes("operAnd")){
                            getOperationVal ("'"+value+"'",filterEl,el,"and","child");

                        } else if (el.includes("operOr")){
                            getOperationVal ("'"+value+"'",filterEl,el,"or","child");
                        }
                    }
                } catch (err){
                    setFunctionError(err,logNameFile,"function createQuery");
                }
            }
            if (value && $$(el)){
                try{
                    formattingDateValue();
                    formattinSelectValue();
                    createFilterElement ();
                    createQuery();
                } catch (err){
                    setFunctionError(err,logNameFile,"function createGetData");
                }
            }

        });

    }

    
    if ($$("filterTableForm").validate()){
     
        createGetData();

        const queryData = webix.ajax("/init/default/api/smarts?query=" + query.join("") );

        queryData.then(function(data){
            let notifyType = data.json().err_type;
            let notifyMsg = data.json().err;
            data = data.json().content;
            function setData(){
                try{
                    if (data.length !== 0){
                        $$("table").hideOverlay("Ничего не найдено");
                        $$("table").clearAll()
                        $$("table").parse(data);
                    } else {
                        $$("table").clearAll()
                        $$("table").showOverlay("Ничего не найдено");
                    }
                } catch (err){
                    setFunctionError(err,logNameFile,"function filterSubmitBtn => setData");
                }
            }

            function setCounterValue(){
                const filterCountRows = $$("table").count();
                const value = filterCountRows.toString();
                try{
                    $$("table-idFilterElements").setValues(value);
                } catch (err){
                    setFunctionError(err,logNameFile,"function filterSubmitBtn => setCounterValue");
                }
            }

         
            if (notifyType == "i"){

                setData();
                setCounterValue();
                hideFilterPopup();
        
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
            title: "Название шаблона",
            ok: "Сохранить",
            cancel: "Отменить",
            css:"webix_prompt-filter-lib",
            input: {
            required:true,
            placeholder:"Введите название шаблона...",
            },
            width:350,
        }).then(function(result){
          
            async function saveTemplate (){ 

                if (!PREFS_STORAGE.userprefs){
                    await getUserprefsData (); 
                }

           
                let data = PREFS_STORAGE.userprefs.content;
                let nameTemplate = result;
                let collection = {content:[]};
                let settingExists = false;

                const currId = getItemId();
                const inputs =  $$("inputsFilter")._collection;

                let template = {
                    name:nameTemplate,
                    collection:collection,
                    values: $$("filterTableForm").getValues(),
                    table: currId
                };
       
              

                let sentObj = {
                    name:currId+"_filter-template_"+nameTemplate,
                    prefs:template,
                };

                function childs(el,id){
                    try{
                     
                        $$(el.id).getChildViews().forEach(function(child,i){
                            
                            let condition = $$(child.config.id)._collection[0].id;
                            let index = el.id.lastIndexOf("_rows");
                            let parentField = el.id.slice(0,index);

                   
                         
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
               
                        let currName = currId+"_filter-template_"+nameTemplate;

                        function putUserprefsData (){
                            const putData = webix.ajax().put("/init/default/api/userprefs/"+el.id, sentObj);

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
                        sentObj.owner = data.json().content.id;

                        let userData = {};
                        userData.id = data.json().content.id;
                        userData.name = data.json().content.first_name;
                        userData.username = data.json().content.username;
                        
                        setStorageData("user", JSON.stringify(userData));
                    });

                    whoamiData.fail(function(err){
                        setAjaxError(err, logNameFile,"saveTemplate => setDataStorage");
                    });

                }
                
                function saveNewTemplate(){
                    let ownerId = webix.storage.local.get("user").id;
                    if (ownerId){
                        sentObj.owner = ownerId;
                    } else {
                        setDataStorage();
                        
                    }

                    const userprefsPost = webix.ajax().post("/init/default/api/userprefs/",sentObj);
                    
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
                       
                        let indexId = el.id.lastIndexOf("_rows");
                        let id = el.id.slice(0,indexId);

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
            btnClass.classList.add(secondaryBtnClass);
            btnClass.classList.remove(primaryBtnClass);
        }
    }
    function defaultState(){
        if ( filterForm && filterForm.isVisible() ){
            filterForm.hide();
        }
    
        if ( tableContainer && !(tableContainer.isVisible()) ){
            tableContainer.show();
        }

        if ($$("table")){
            $$("table").clearSelection();
        }
    }


    defaultState();
    setBtnFilterState();
  
}

function resetFilterBtn (){
    try {

        const itemTreeId = getItemId ();

        const queryData = webix.ajax("/init/default/api/smarts?query="+itemTreeId+".id >= 0");
        queryData.then(function(data){
            const dataErr =  data.json();
          
            data = data.json().content;
                
            function setDataTable(){
                try{
                    if (data.length !== 0){
                        $$("table").hideOverlay("Ничего не найдено");
                        $$("table").clearAll()
                       $$("table").parse(data);
                    } else {
                        $$("table").clearAll()
                        $$("table").showOverlay("Ничего не найдено");
                    }
                } catch (err){
                    setFunctionError(err,logNameFile,"function resetFilterBtn => setDataTable");
                }
            }

            function setFilterCounterVal(){
                try{
                    const filterCountRows = $$("table").count();
                    const value           = filterCountRows.toString();
                    $$("table-idFilterElements").setValues(value);
                } catch (err){
                    setFunctionError(err,logNameFile,"function setFilterCounterVal");
                }
            }

            function clearFilterValues(){
                if($$("filterTableForm")){
                    $$("filterTableForm").clear(); 
                }
            }

            function hideInputsContainer(){
                const inputs = document.querySelectorAll(".webix_filter-inputs");
                try{
                    inputs.forEach(function(elem,i){
                        if ( !(elem.classList.contains("webix_hide-content")) ){
                            elem.classList.add("webix_hide-content");
                        }
                    });
                } catch (err){
                    setFunctionError(err,logNameFile,"function resetFilterBtn => hideInputsContainer");
                }
            }

            function clearSpace(){
                let childs = [];
                let inputsContainer = $$("inputsFilter").getChildViews();
                
      
                inputsContainer.forEach(function(el,i){
                    const inputId = el._collection[0].cols[0].id;
                    
                    function removeParentInput(){
                        $$(inputId).hide();
                    }

                    function getChildsId (){
                        try{
                            $$(el.config.id).getChildViews().forEach(function(child,i){
                                if (child.config.id.includes("child")){
                                    childs.push (child.config.id)
                                }
                            });
                        } catch (err){
                            setFunctionError(err,logNameFile,"function resetFilterBtn => getChildsId");
                        }
                    }

                    function hideContaier(){
                        if($$(inputId+"_container-btns") && $$(inputId+"_container-btns").isVisible()){
                            $$(inputId+"_container-btns").hide();
                        }
                    }
                    try{
                        removeParentInput();
                        getChildsId ();
                        hideContaier();
                    } catch (err){
                        setFunctionError(err,logNameFile,"function resetFilterBtn => clearSpace");
                    }

                });
               
                function removeChilds(){
                    try{
                        childs.forEach(function(idChild,i){
                            $$(idChild).getParentView().removeView($$(idChild));
                        });
                    } catch (err){
                        setFunctionError(err,logNameFile,"function resetFilterBtn => removeChilds");
                    }
                }
                removeChilds();
            }

            function disableLibSaveBtn(){
                if ($$("filterLibrarySaveBtn") && $$("filterLibrarySaveBtn").isEnabled()){
                    $$("filterLibrarySaveBtn").disable();
                }
            }

            function showEmptyTemplate(){
                if ($$("filterEmptyTempalte") && !($$("filterEmptyTempalte").isVisible())){
                    $$("filterEmptyTempalte").show();
                    $$("filterEmptyTempalte").refresh();
                }
            }

            function disableRemoveBtn(){
                $$("resetFilterBtn").disable();
            }

            if (dataErr.err_type == "i"){
                try{
                    setDataTable();
                    setFilterCounterVal();
                    hideFilterPopup();
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
        view:"button",
        id:"resetFilterBtn",
        disabled:true,
        height:48,
        minWidth:50,
        width:65,
        hotkey: "shift+esc",
        css:"webix_danger", 
        type:"icon", 
        icon:"icon-trash", 
        click:resetFilterBtn,
        on: {
            onAfterRender: function () {
                this.getInputNode().setAttribute("title", "Сбросить фильтры");
            }
        } 
    };
    
    const formBtnSubmit = {   
        view:"button",
        id:"btnFilterSubmit",
        height:48,
        minWidth:70, 
        css:"webix_primary",
        hotkey: "Enter",
        disabled:true,
        value:"Применить фильтры", 
        click:filterSubmitBtn,
    };
    
    const formEditBtn = {   
        view:"button",
        value:"Редактор фильтров",
        height:48,
        minWidth:140, 
        click:editFiltersBtn,
        on: {
            onAfterRender: function () {
                this.getInputNode().setAttribute("title","Добавить/удалить фильтры");
            },
        },
    };    
    
    const filterBackTableBtn = { 
        view:"button", 
        id:"table-backTableBtnFilter",
        type:"icon",
        icon:"icon-arrow-left",
        value:"Вернуться к таблице",
        hidden:true,  
        height:48,
        minWidth:50,
        width:55,
       
        click:function(){
            backTableBtnClick();
        },
    
        on: {
            onAfterRender: function () {
                this.getInputNode().setAttribute("title","Вернуться к таблице");
            }
        } 
    };
    
    const formLibrarySaveBtn = {   
        view:"button",
        id:"filterLibrarySaveBtn",
        disabled:true,
        height:48,
        minWidth:50,
        width:65,
        hotkey: "shift+esc",
        type:"icon", 
        icon:"icon-file", 
        click:filterLibraryBtn,
        on: {
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
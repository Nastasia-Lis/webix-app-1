import {setLogValue} from './logBlock.js';
import {setStorageData} from "./storageSetting.js";
import {modalBox} from "./notifications.js";

import {setAjaxError,setFunctionError} from "./errors.js";

import {createChildFields} from "../components/table.js";

const PREFS_STORAGE = {};

function getItemId (){
    let idTable;
    
    if ($$("tables").isVisible()){
        idTable = $$("table").config.idTable;
    } else if ($$("forms").isVisible()){
        idTable = $$("table-view").config.idTable;
    }

    return idTable;
}



function getUserprefsData (){

    return webix.ajax().get(`/init/default/api/userprefs/`)
    .then(function (data) {
        PREFS_STORAGE.userprefs = data.json();
        return PREFS_STORAGE.userprefs;
    }).fail(err => {
        setAjaxError(err, "filterTableForm","getUserprefsData");
    }
);
}

function tabbarClick (id){

    
    function btnSubmitState (state){
        try {
            if (state=="enable"){
                if(!($$("popupFilterSubmitBtn").isEnabled())){
                    $$("popupFilterSubmitBtn").enable();
                }
            } else if (state=="disable"){
                if($$("popupFilterSubmitBtn").isEnabled()){
                    $$("popupFilterSubmitBtn").disable();
                }
            }
        }catch(err){
            setFunctionError(err,"filterTableForm","btnSubmitState");
        }
    }
    function visibleClearBtn (param){
        if($$("popupFilterClearBtn") && 
        $$("popupFilterClearBtn").isVisible()){
            if (param){
                $$("popupFilterClearBtn").show();
            } else {
                $$("popupFilterClearBtn").hide();
            }
   
        }
    }

    function visibleRemoveBtn (param){
        if ($$("editFormPopupLibRemoveBtn") && 
        !($$("editFormPopupLibRemoveBtn").isVisible())){
            if (param){
                $$("editFormPopupLibRemoveBtn").show();
            } else {
                $$("editFormPopupLibRemoveBtn").hide();
            }
        }
    }

    function filterLibrary(){

        function setStateSubmitBtn (){
            
            if ($$("filterEditLib").getValue() !== "" ){
                btnSubmitState ("enable");
            } else {
                btnSubmitState ("disable");
            }
        }

        try{
            visibleClearBtn (false);
            setStateSubmitBtn ();
            visibleRemoveBtn (true);
        }catch(err){
            setFunctionError(err,"filterTableForm","filterLibrary");
        }
     
       

    }     

    function editFilter (){
   

        let checkboxes = $$("editFormPopup").getValues();
        let counter = 0;
        
        function countChecked(){
            Object.values(checkboxes).forEach(function(el,i){
                if (el){
                    counter++;
                }
            });
        }
      
        function setStateSubmitBtn(){
            if (counter > 0){
                btnSubmitState ("enable");
            } else {
                btnSubmitState ("disable");
            }
        }

        try{
            countChecked();
            visibleClearBtn (true);
            visibleRemoveBtn (false);
            setStateSubmitBtn();
        }catch(err){
            setFunctionError(err,"filterTableForm","editFilter");
        }
    }

    function tabbarLogic(){
        if (id =="editFormPopupLib"){
            filterLibrary();  
        }

        if (id =="editFormScroll"){
            editFilter ();
        }
    }

    try{
        tabbarLogic();
    } catch (err){
        setFunctionError(err,"filterTableForm","tabbarLogic");
    }
}

function popupSubmitBtn (){

    function visibleField (condition,elementClass=null,el=null){
 
        let htmlElement = document.querySelectorAll(".webix_filter-inputs");

        function showHtmlEl(){
            try{
             
                htmlElement.forEach(function(elem,i){
           
                    if (elem.classList.contains(elementClass)){
                        if (!(elem.classList.contains("webix_show-content"))){
                            elem.classList.add("webix_show-content");
                        }
                        if (elem.classList.contains("webix_hide-content")){
                            elem.classList.remove("webix_hide-content");
                        }

                    } else {
                        if (!(elem.classList.contains("webix_hide-content"))){
                            elem.classList.add("webix_hide-content");
                        }
                    }
                });

            } catch(err){
                setFunctionError(err,"filterTableForm","function visibleField => showHtmlEl");
            }
        }

        function showInputContainers(){
            $$(el).show();

            if($$(el+"_container-btns") && !($$(el+"_container-btns").isVisible())){
                $$(el+"_container-btns").show();
            }
        }
    
        function enableResetBtn(){
            if (!($$("resetFilterBtn").isEnabled())){
                $$("resetFilterBtn").enable();
            }
        }

        function enableLibrarySaveBtn(){
            if (!($$("filterLibrarySaveBtn").isEnabled())){
                $$("filterLibrarySaveBtn").enable();
            }
        }

        function hideEmptyTemplate(){
            if ($$("filterEmptyTempalte").isVisible()){
                $$("filterEmptyTempalte").hide();
            }
        }

        function hideInputContainers (){
            $$(el).setValue("");
            $$(el).hide();
     
            if($$(el+"_container-btns") && $$(el+"_container-btns").isVisible()){
                $$(el+"_container-btns").hide();
            }
        }

        function hideHtmlEl (){
            try{
                htmlElement.forEach(function(elem,i){
                    if (elem.classList.contains(elementClass)){
                        if (!(elem.classList.contains("webix_hide-content"))){
                            elem.classList.add("webix_hide-content");
                        }
                        if (elem.classList.contains("webix_show-content")){
                            elem.classList.remove("webix_show-content");
                        }
                    }
                });

            } catch(err){
                setFunctionError(err,"filterTableForm","function visibleField => hideHtmlEl");
            }
        }
      
        function removeChids(){
            let countChild = $$(el+"_rows").getChildViews();
            try{
                Object.values(countChild).forEach(function(elem,i){
                    if (elem.config.id.includes("child")){
                        $$(el+"_rows").removeView($$(elem.config.id));
                    }

                });

            } catch(err){
                setFunctionError(err,"filterTableForm","function visibleField => removeChids");
            }
        }

        if (condition){
            try{
                showHtmlEl();
                showInputContainers();
                enableResetBtn();
                enableLibrarySaveBtn();
                hideEmptyTemplate();
            } catch(err){
                setFunctionError(err,"filterTableForm","function visibleField => showElements");
            }

        } else{
            try{
                if ($$(el).isVisible()){
                    hideHtmlEl ();
                }
                hideInputContainers ();

                if($$(el+"_rows")){
                    removeChids();
                }
            } catch(err){
                setFunctionError(err,"filterTableForm","function visibleField => hideElements");
            }
        }
    }

  
    
    function getLibraryData(){
        
        let radioValue = $$("filterEditLib").getOption($$("filterEditLib").getValue());
        
        let userprefsData = webix.ajax("/init/default/api/userprefs/");
     
        userprefsData.then(function(data){
            let dataErr = data.json();
            data = data.json().content;
      
            const currId = getItemId ();

        
            function hideFalseInputs(trueInputs){
                const allInputs = $$("inputsFilter").getChildViews();
                
                function findTrueInput(inp){
                    let findInput;
                    trueInputs.forEach(function(el,i){
                   
                        if (inp.includes(el)){
                            findInput = el;
                        }
                        
                    });
                    return findInput;
                }

                try{
                    allInputs.forEach(function(input,i){
                        let trueInp =  findTrueInput(input.config.id);
                        let id = input.config.id;
                        
                        function getElementHide(){
                            let indexHide = id.indexOf("_rows");
                            return id.slice(0,indexHide);
                        }

                        function getHtmlClass(elementHide){
                            let indexHtml = elementHide.indexOf("_filter");
                            return id.slice(0,indexHtml);
                        }

                        if (!trueInp){
                            let elementHide = getElementHide();
                            let htmlClass = getHtmlClass(elementHide);
                            visibleField(0,htmlClass,elementHide);
                        }

                    });
                } catch(err){
                    setFunctionError(err,"filterTableForm","function hideFalseInputs");
                }
            }
 
            function  createWorkspace(prefs){
                let trueInputs = [];
                try{
                    prefs.collection.content.forEach(function(el,i){
                        
                        function getHtmlArgument (){
                            let indexHtml = el.parentField.id.indexOf("_filter");
                            return el.parentField.id.slice(0,indexHtml); 
                        }

                        function getIdElArgument (){
                            let indexId = el.parentField.id.indexOf("_rows");
                            return el.parentField.id.slice(0,indexId);
                        }

                        function showParentInputs(){
                            let htmlClass = getHtmlArgument ();
                            let idEl = getIdElArgument ();
                            
                            visibleField(1,htmlClass,idEl);

                            trueInputs.push(idEl);
                        }

                        function setParentValues(){
                            if($$(el.parentValue.id)){
                                $$(el.parentValue.id).setValue(el.parentValue.value);
                            }
                        }

                        
                        function removeLastChilds (){
                            try{ 
                                $$(el.parentField.id)._cells.forEach(function(child,i){
                                    if (child.config.id.includes("child")){
                                        $$(el.parentField.id).removeView($$(child.config.id));
                                    }
                                });
                            } catch(err){
                                setFunctionError(err,"filterTableForm","function createWorkspace => removeLastChilds");
                            }
                        }

                        function createChilds(){
                            let columnsData = $$("table").getColumns();
                            try{ 
                                columnsData.forEach(function(col,i){
                                    if (el.parentField.id.includes(col.id)){
                                        if (el.condition == "and"){
                                            createChildFields ("and",col);
                                            $$(el.childValue.id).setValue(el.childValue.value); 
                                        } else if (el.condition == "or"){
                                            createChildFields ("or",col);
                                            $$(el.childValue.id).setValue(el.childValue.value); 
                                        }
                                    }
                                });
                            } catch(err){
                                setFunctionError(err,"filterTableForm","function createWorkspace => createChilds");
                            }
                        }


                        if (el.condition == "parent"){
                            
                            showParentInputs();
                            setParentValues();
                            removeLastChilds ();
                        
                        }
                        
                        hideFalseInputs(trueInputs);
                        createChilds();
                    });
            
                    $$("filterTableForm").setValues(prefs.values);
                } catch(err){
                    setFunctionError(err,"filterTableForm","function createWorkspace");
                }
            }

            function dataEnumeration() {
                try{
                    data.forEach(function(el,i){

                        if (el.name == currId+"_filter-template_"+radioValue.value){
                            let prefs = JSON.parse(el.prefs);
                            createWorkspace(prefs);
                        }

                        function removeFilterPopup(){
                            if ($$("popupFilterEdit")){
                                $$("popupFilterEdit").destructor();
                            }
                        }

                        function enableBtnSubmit(){
                            if ($$("btnFilterSubmit") && !($$("btnFilterSubmit").isEnabled())){
                                $$("btnFilterSubmit").enable();
                            }
                        }
                        removeFilterPopup();
                        enableBtnSubmit();
                    });
                } catch(err){
                    setFunctionError(err,"filterTableForm","function dataEnumeration");
                }
            }

            //if (dataErr.err_type == "i"){
            dataEnumeration();
            setLogValue("success","Рабочая область фильтра обновлена");
    
               
            // } else {
            //     setLogValue("error",dataErr.err); 
            // }

        });

        userprefsData.fail(function(err){
            setAjaxError(err, "filterTableForm","getLibraryData");
        });


      
    }

 
    function getCheckboxData(){

        function enableLibrarySaveBtn(){
            if ($$("filterLibrarySaveBtn") && !($$("filterLibrarySaveBtn").isEnabled())){
                $$("filterLibrarySaveBtn").enable();
            }
        }

        function createWorkspaceCheckbox (){
            let values = $$("editFormPopup").getValues();
            let elementClass;
            let index;

   
    
            try{
                Object.keys(values).forEach(function(el,i){
                    index = el.lastIndexOf("_");
                    elementClass = el.slice(0,index);
                    visibleField (values[el],elementClass,el);
               
          
                });
            } catch(err){
                setFunctionError(err,"filterTableForm","function createWorkspaceCheckbox");
            }
        }

        function visibleCounter(){
            let visibleElements=0;
            try{
                Object.values($$("filterTableForm").elements).forEach(function(el,i){
                    if (!(el.config.hidden)){
                        visibleElements++;
                    }
                    
                });

            } catch(err){
                setFunctionError(err,"filterTableForm","function getCheckboxData => visibleCounter");
            }

            return visibleElements;
        }

        function showEmptyTempalte(){
            if (!($$("filterEmptyTempalte").isVisible())){
                $$("filterEmptyTempalte").show();
            } 
        }

        function disableFilterSubmit(){
            if($$("btnFilterSubmit") && $$("btnFilterSubmit").isEnabled()){
                $$("btnFilterSubmit").disable();
            }
        }

        function disableibrarySaveBtn(){
            if($$("filterLibrarySaveBtn").isEnabled()){
                $$("filterLibrarySaveBtn").disable();
            }
        }

        function hideFilterPopup (){
            if ($$("popupFilterEdit")){
                $$("popupFilterEdit").destructor();
            }
        }
       
        try{
            enableLibrarySaveBtn();
            createWorkspaceCheckbox ();

            let visibleElements = visibleCounter();

            if (!(visibleElements)){
                showEmptyTempalte();
                disableFilterSubmit();
                disableibrarySaveBtn(); 
            } 

            hideFilterPopup ();

        } catch(err){
            setFunctionError(err,"filterTableForm","function getCheckboxData");
        }
      
        setLogValue("success","Рабочая область фильтра обновлена");
    }



    try{                                             
        let tabbarValue = $$("filterPopupTabbar").getValue();

        if (tabbarValue =="editFormPopupLib"){
            getLibraryData();

        } else if (tabbarValue=="editFormScroll"){
            getCheckboxData();
        }
    }catch(err){
        setFunctionError(err,"filterTableForm","function popupSubmitBtn");
        $$("popupFilterEdit").destructor();
    }
}


let filterTemplateValue;


function editFiltersBtn (){
    const currId = getItemId ();
    
    const templateRecover = {
        template:"Редактор фильтров", 
        css:"webix_template-recover", 
        borderless:true, 
        height:40 
    };

    const buttonClosePopup =  {
        view:"button",
        id:"buttonClosePopup",
        css:"popup_close-btn",
        type:"icon",
        hotkey: "esc",
        width:25,
        icon: 'wxi-close',
        click:function(){
            if ($$("popupFilterEdit")){
                $$("popupFilterEdit").destructor();
            }
        
        }
    };

    const filterPrompt = {
        css:"webix_empty-template",
        template:"Выберите нужные поля или шаблон из библиотеки", 
        borderless:true, 
        height:47
    };

    const tabbar =  {
        view:"tabbar",  
        type:"top", 
        id:"filterPopupTabbar",
        css:"webix_filter-popup-tabbar",
        multiview:true, 
        options: [
            {   value: "<span class='webix_tabbar-filter-headline'>Поля</span>", 
                id: 'editFormScroll' 
            },
            {   value: "<span class=webix_tabbar-filter-headline'>Библиотека</span>", 
                id: 'editFormPopupLib' 
            },
        ],
        height:50,
        on:{
            onAfterTabClick:function(id){
                tabbarClick(id);
            }
        }
    };

    const tabCheckboxes = {   
        view:"scrollview",
        borderless:true, 
        css:"webix_multivew-cell",
        id:"editFormScroll", 
        scroll:"y", 
        body:{ 
            id:"editFormPopupScroll",
            rows:[ ]
        }

    };
    function stateSubmitBtn(state){
        if(state){
            $$("popupFilterSubmitBtn").enable();
        } else {
            $$("popupFilterSubmitBtn").disable();
        }

    }
    const radioLibBtn =  {   
        view:"radio", 
        id:"filterEditLib",
        vertical:true,
        options:[],
        on:{
            onChange:function(){
                function enableRemoveBtn(){
                    if (!($$("editFormPopupLibRemoveBtn").isEnabled())){
                        $$("editFormPopupLibRemoveBtn").enable();
                    }
                }

              

               
                if (this.getValue()){
                    filterTemplateValue = this.getValue();

                   
                    enableRemoveBtn();
                    if(!($$("popupFilterSubmitBtn").isEnabled())){
                        stateSubmitBtn(true);
                    }
                } else {
                    if($$("popupFilterSubmitBtn").isEnabled()){
                        stateSubmitBtn(false);
                    }
                }
            }
        }
    };

    const tabLib = {  
        view:"form", 
        scroll:true ,
        id:"editFormPopupLib",
        css:"webix_multivew-cell",
        borderless:true,
        elements:[
            radioLibBtn
        ],

    };

    const submitBtn =  {   
        view:"button",
        id:"popupFilterSubmitBtn",
        height:48,
        minWidth:140,
        disabled:true, 
        css:"webix_primary",
        hotkey: "Enter",
        value:"Применить", 
        on: {
            onAfterRender: function () {
                this.getInputNode().setAttribute("title","Выбранные фильтры будут добавлены в рабочее поле, остальные скрыты");
            },
        },
        click:popupSubmitBtn
    };

    const cleanBtn = {   
        view:"button",
        id:"popupFilterClearBtn",
        width:110,
        height:48,
        css:"webix_secondary",
        disabled:true,
        value:"Сбросить", 
        on: {
            onAfterRender: function () {
                this.getInputNode().setAttribute("title","Все фильтры будут очищены и удалены");
            },
        },
        click:clearPopupBtn
    };

    const removeBtn = {   
        view:"button",
        css:"webix_danger",
        id:"editFormPopupLibRemoveBtn",
        type:"icon",
        icon: 'fas fa-trash',
        hidden:true,
        disabled:true,
        width: 50,
        click:function(){
            const currId = getItemId ();
            async function userprefsData (){ 
                let libValue = $$("filterEditLib").getValue();
                let radioValue = $$("filterEditLib").getOption(libValue);

                if (!PREFS_STORAGE.userprefs){
                    await getUserprefsData (); 
                }

                if (PREFS_STORAGE.userprefs){
                    let data = PREFS_STORAGE.userprefs.content;
                    let templateName = currId+"_filter-template_"+radioValue.value;

    
                    data.forEach(function(el,i){
                        function deleteElement(){
                            let deleteTemplate = webix.ajax().del("/init/default/api/userprefs/"+el.id,el);
 
                            deleteTemplate.then(function(data){
                                data = data.json();
                            
                                function removeOptionState (){
                                    try{
                                        $$("filterEditLib").config.options.forEach(function(el,i){
                                            if (el.id == radioValue.id){
                                                el.value = radioValue.value + " (шаблон удалён)";
                                                $$("filterEditLib").refresh();
                                                $$("filterEditLib").disableOption($$("filterEditLib").getValue());
                                                $$("filterEditLib").setValue("");
                                            }
                                        });
                                    } catch (err){
                                        setFunctionError(err,"filterTableForm","function deleteElement => removeOptionState");
                                    }
                                }
    
                                if (data.err_type !== "e"&&data.err_type !== "x"){
                                    setLogValue("success","Шаблон « "+radioValue.value+" » удален");
                                    removeOptionState ();
                                } else {
                                    setLogValue("error", "filterTableForm function userprefsData: "+data.err);
                                }
    
                            });
                            deleteTemplate.fail(function(err){
                                setAjaxError(err, "filterTableForm","getLibraryData");
                            });
                        }

                        if (el.name == templateName){
                            deleteElement();
                        }
                    });

                }
            }


            modalBox(   "Шаблон будет удалён", 
                        "Вы уверены, что хотите продолжить?", 
                        ["Отмена", "Удалить"]
            ).then(function(result){
        
                if (result == 1){
 
                    userprefsData ();
                    
                }
            });




        },
        on: {
            onAfterRender: function () {
                this.getInputNode().setAttribute("title","Выбранный шаблон будет удален");
            },
        },
    };

    const editFormPopup = {
        view:"form", 
        id:"editFormPopup",
        css:"webix_edit-form-popup",
        borderless:true,
        elements:[
            {rows:[ 
                tabbar,
                    
                {   height:200,
                    cells:[
                        tabCheckboxes,
                        tabLib,
                    ]   
                },
        
                {height:20},
                {cols:[
                    submitBtn,
                    {width:5},
                    cleanBtn,
                    removeBtn,
                ]},
            ]},
            {}

        ],
    };

    function createFilterPopup() {
        webix.ui({
            view:"popup",
            id:"popupFilterEdit",
            css:"webix_popup-filter-container webix_popup-config",
            modal:true,
            escHide:true,
            position:"center",
            height:400,
            width:400,
            body:{
                scroll:"y", rows:[
                    {css:"webix_filter-headline-wrapper", cols:[ 
                        templateRecover,
                        {width:150},
                        buttonClosePopup,
                    ]},

                    filterPrompt,
                    editFormPopup
                ]
            }
        }).show();
    }
    createFilterPopup();

    function userprefsData (){ 

        const userprefsGetData = webix.ajax("/init/default/api/userprefs/");
        userprefsGetData.then(function(data){
            function getUserData (){
                    
                let whoamiData = webix.ajax("/init/default/api/whoami");
    
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
                        setFunctionError(err,"filterTableForm","function getUserData");
                    }
        
                    if (data.err_type == "e"){
                        setLogValue("error",data.error);
                    } else {
                        setLogValue("success","Рабочая область фильтра обновлена");
                    }
                });
        
                whoamiData.fail(function(err){
                    setAjaxError(err, "filterTableForm","getUserData");
                });
            }
    
            function setTemplates(user){
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
                    setFunctionError(err,"filterTableForm","function setTemplates");
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
    
            function counterVisibleElements (){
                let visibleElements=0;
                let filterElements = $$("filterTableForm").elements;
                try{
                    Object.values(filterElements).forEach(function(el,i){
                        if (!(el.config.hidden)){
                            visibleElements++;
                        }
                        
                    });
                } catch (err){
                    setFunctionError(err,"filterTableForm","function counterVisibleElements");
                }
                return visibleElements;
            }
           
            function setBtnState(){
                try{
                    if (!(counterVisibleElements())){
                        if ($$("filterEmptyTempalte") && !($$("filterEmptyTempalte").isVisible())){
                            if($$("popupFilterClearBtn").isEnabled()){
                                $$("popupFilterClearBtn").disable();
                            }
                        } 
                    } else {
                        if($$("popupFilterClearBtn") && !($$("popupFilterClearBtn").isEnabled())){
                            $$("popupFilterClearBtn").enable();
                        }
                    }
                } catch (err){
                    setFunctionError(err,"filterTableForm","function setBtnState");
                }
            }

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
                    setBtnState();
                }
            } catch (err){
                setFunctionError(err,"filterTableForm","function userprefsData");
            }
            
        });
        userprefsGetData.fail(function(err){
            console.log(err);
            setLogValue("error", "filterTableForm function userprefsData: "+err.status+" "+err.statusText+" "+err.responseURL);
        });
       

        // if (PREFS_STORAGE.userprefs){

            
        // }
    }
    userprefsData ();

    function setValueLib(){
        if ($$("filterEditLib")){
            $$("filterEditLib").setValue(filterTemplateValue);   
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
            setFunctionError(err,"filterTableForm","function userprefsData => popupSizeAdaptive");
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
              

                function setStateSubmitBtn(){
                    try{
                        if ($$("selectAll").getValue()){
                            if(!($$("popupFilterSubmitBtn").isEnabled())){
                                stateSubmitBtn(true);
                            }

                        } else {
                            if($$("popupFilterSubmitBtn").isEnabled()){
                                stateSubmitBtn(false);
                            }
                        }
                    } catch (err){
                        setFunctionError(err,"filterTableForm","function checkbox:onchange => setStateSubmitBtn");
                    }
                }

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
                        setFunctionError(err,"filterTableForm","function checkbox:onchange => setValueCheckbox");
                    }
                }
              
                setStateSubmitBtn();
                setValueCheckbox(); 
            

            },
    
        } 
    };
 
    
 
    function getAllCheckboxes(){
        let checkboxes = [];
        let filterTableElements  = $$("filterTableForm").elements;
        try{
            Object.values(filterTableElements).forEach(function(el,i){
                checkboxes.push({id:el.config.id, label:el.config.label})
            });
        }catch (err){
            setFunctionError(err,"filterTableForm","function editFiltersBtn => getAllCheckboxes");
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
                setFunctionError(err,"filterTableForm","function checkboxOnChange => getStatusCheckboxes");
            }
        }

        function setStateBtnSubmit(){
            try{
                if (btnState > 0) {
                    if(!($$("popupFilterSubmitBtn").isEnabled())){
                        stateSubmitBtn(true);
                    }
                } else {
                    if($$("popupFilterSubmitBtn").isEnabled()){
                        stateSubmitBtn(false);
                    }
                }
            } catch (err){
                setFunctionError(err,"filterTableForm","function checkboxOnChange => setStateBtnSubmit");
            }
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
                setFunctionError(err,"filterTableForm","function checkboxOnChange => setSelectAllState");
            }
        }
       
        try{
            getStatusCheckboxes();
            setStateBtnSubmit();
            setSelectAllState();
        } catch (err){
            setFunctionError(err,"filterTableForm","function checkboxOnChange");

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
            setFunctionError(err,"filterTableForm","function createCheckboxes");
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
            setFunctionError(err,"filterTableForm","function countSelectCheckboxes");
        }
    } 

    function stateSelectAll(){
        try{
            if (counter == 0){
                $$("selectAll").config.value = 1;
                $$("selectAll").refresh();
            } 
        } catch (err){
            setFunctionError(err,"filterTableForm","function stateSelectAll");
        }
    }

    countSelectCheckboxes();
    stateSelectAll();
 
}

function resetFilterBtn (){
    try {

        const itemTreeId = getItemId ();

        const queryData = webix.ajax("/init/default/api/smarts?query="+itemTreeId+".id >= 0");
        queryData.then(function(data){
            let dataErr =  data.json();
          
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
                    setFunctionError(err,"filterTableForm","function resetFilterBtn => setDataTable");
                }
            }

            function setFilterCounterVal(){
                try{
                    let filterCountRows = $$("table").count();
                    let value = filterCountRows.toString();
                    $$("table-idFilterElements").setValues(value);
                } catch (err){
                    setFunctionError(err,"filterTableForm","function setFilterCounterVal");
                }
            }

            function clearFilterValues(){
                if($$("filterTableForm")){
                    $$("filterTableForm").clear(); 
                }
            }

            function hideInputsContainer(){
                let inputs = document.querySelectorAll(".webix_filter-inputs");
                try{
                    inputs.forEach(function(elem,i){
                        if (!(elem.classList.contains("webix_hide-content"))){
                            elem.classList.add("webix_hide-content");
                        }
                    });
                } catch (err){
                    setFunctionError(err,"filterTableForm","function resetFilterBtn => hideInputsContainer");
                }
            }

            function clearSpace(){
                let childs = [];
                let inputsContainer = $$("inputsFilter").getChildViews();
                
      
                inputsContainer.forEach(function(el,i){
                    let inputId = el._collection[0].cols[0].id;
                    
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
                            setFunctionError(err,"filterTableForm","function resetFilterBtn => getChildsId");
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
                        setFunctionError(err,"filterTableForm","function resetFilterBtn => clearSpace");
                    }

                });

                function removeChilds(){
                    try{
                        childs.forEach(function(idChild,i){
                            $$(idChild).getParentView().removeView($$(idChild));
                        });
                    } catch (err){
                        setFunctionError(err,"filterTableForm","function resetFilterBtn => removeChilds");
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
                    setFunctionError(err,"filterTableForm","function resetFilterBtn");
                }
            
                setLogValue("success", "Фильтры очищены");
            } else {
                setLogValue("error", "filterTableForm function resetFilterBtn ajax: "+dataErr.err);
            }
        });

        queryData.fail(function(err){
            setAjaxError(err, "filterTableForm","resetFilterBtn");
        });
    
    } catch(err) {
        setFunctionError(err,"Ошибка при очищении фильтров; filterTableForm","function resetFilterBtn");
    }
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
            return "+"+condition+"+"+filterEl+operation+value;
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
            setFunctionError(err,"filterTableForm","function filterSubmitBtn => getOperationVal");
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
                if ($$(el).config.view=="datepicker"){
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
                            getOperationVal (value,filterEl,el,"and","parent",true);
                        }else {
                            getOperationVal (value,filterEl,el,"and","parent");
                        }

                        firstItem++;
                        
                    } else if (el.includes("child")){
                        if (el.includes("operAnd")){
                            getOperationVal (value,filterEl,el,"and","child");

                        } else if (el.includes("operOr")){
                            getOperationVal (value,filterEl,el,"or","child");
                        }
                    }
                } catch (err){
                    setFunctionError(err,"filterTableForm","function createQuery");
                }
            }
            if (value){
                try{
                    formattingDateValue();
                    formattinSelectValue();
                    createFilterElement ();
                    createQuery();
                } catch (err){
                    setFunctionError(err,"filterTableForm","function createGetData");
                }
            }

        });

    }

    
    if ($$("filterTableForm").validate()){
     
        createGetData();
        const queryData = webix.ajax("/init/default/api/smarts?query="+query.join(""));

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
                    setFunctionError(err,"filterTableForm","function filterSubmitBtn => setData");
                }
            }

            function setCounterValue(){
                const filterCountRows = $$("table").count();
                const value = filterCountRows.toString();
                try{
                    $$("table-idFilterElements").setValues(value);
                } catch (err){
                    setFunctionError(err,"filterTableForm","function filterSubmitBtn => setCounterValue");
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
            setAjaxError(err, "filterTableForm","createGetData");
        });

        
    } else {
        setLogValue("error","Не все поля формы заполнены");
    }
  

}

function filterLibraryBtn (){
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
                        console.log(el)
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
                                console.log(idInput,"idInput")
    
                                if (condition.includes("and")){
                                    tempalteCollectionItem.condition = "and";
                                    collection.content.push(tempalteCollectionItem);
                                } else if (condition.includes("or")){
                                    tempalteCollectionItem.condition = "or";
                                    collection.content.push(tempalteCollectionItem);
                                } 
                            }
                            if (child.config.id.includes("child")){
                                console.log(child.config.id,"(child.config.id")
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
                        setFunctionError(err,"filterTableForm","function filterLibraryBtn => childs:");
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
                                    setLogValue("error","filterTableForm function modalBoxExists: "+ data.err);
                                }
                            });

                            putData.fail(function(err){
                                setAjaxError(err, "filterTableForm","saveExistsTemplate => putUserprefsData");
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
                        setAjaxError(err, "filterTableForm","saveTemplate => setDataStorage");
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
                        setAjaxError(err, "filterTableForm","saveTemplate => saveNewTemplate");
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

        }).fail(function(err){
            console.log(err);
            setLogValue("error", "filterTableForm function saveTemplate fail modal box: "+err);
        });

            
            
    } catch(err) {
        setFunctionError(err,"filterTableForm","function filterSubmitBtn");
    }
}

function clearPopupBtn (){
    $$("popupFilterEdit").destructor();
    resetFilterBtn ();
}


const formHeadline =  {  
    template:"Редактор записей",height:30, 
    css:"popup_headline",
    borderless:true,
};

const formCloseBtn = {
    view:"button",
    css:"popup_close-btn",
    type:"icon",
    hotkey: "esc",
    width:25,
    icon: 'wxi-close',
    click:function(){
        if($$("table-editForm")){
            hideFilterPopup();
        }
    
    }
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
    icon:"fas fa-trash", 
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

const formLibrarySaveBtn = {   
    view:"button",
    id:"filterLibrarySaveBtn",
    disabled:true,
    height:48,
    minWidth:50,
    width:65,
    hotkey: "shift+esc",
    type:"icon", 
    icon:"fas fa-file", 
    click:filterLibraryBtn,
    on: {
        onAfterRender: function () {
            this.getInputNode().setAttribute("title", "Сохранить шаблон с полями в библиотеку");
        }
    } 
};

const formEmptyTemplate = {   
    id:"filterEmptyTempalte",
    css:"webix_empty-template",
    template:"Добавьте фильтры из редактора",
    borderless:true
};

const filterTableForm = {
    view:"form", 
    hidden:true,
    id:"filterTableForm",
    minHeight:350,
    minWidth:210,
    width: 320,
    scroll:true,
    borderless:true,
    elements:[
        {   id:"form-adaptive",
            minHeight:48,
            css:"webix_form-adaptive",
            margin:5,
            rows:[
                {   margin:5, 
                    rows:[
                    {   responsive:"form-adaptive",  
                        margin:5, 
                        cols:[
                            formEditBtn,
                            formResetBtn,
                        ],
                    },
                    ]
                },

                {   id:"btns-adaptive",
                    css:{"margin-top":"5px!important"},
                    rows:[
                        {   responsive:"btns-adaptive", 
                            margin:5, 
                            cols:[
                                formBtnSubmit,
                                formLibrarySaveBtn,
                            ]
                        },
                        {height:10},
                        formEmptyTemplate
                    ]
                }
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

function filterForm (){
    return {id:"filterTableBarContainer", hidden:true, rows:[
            {id:"editFilterBarAdaptive", rows:[
                {id:"editFilterBarHeadline",hidden:true,cols:[
                    formHeadline,
                    formCloseBtn
                ]},
                filterTableForm
            ]}
    ]};
}



export{
    filterForm
};
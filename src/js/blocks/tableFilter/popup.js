
import {setLogValue} from '../logBlock.js';
import {getItemId} from "../commonFunctions.js";
import {setFunctionError,setAjaxError} from "../errors.js";
import {modalBox} from "../notifications.js";

import {resetFilterBtn,getUserprefsData,PREFS_STORAGE} from "./buttons.js";
import {createChildFields} from "./toolbarBtn.js";

let filterTemplateValue;
const logNameFile = "tableFilter => popup";

function clearPopupBtn (){
    $$("popupFilterEdit").destructor();
    resetFilterBtn ();
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
                setFunctionError(err,logNameFile,"function visibleField => showHtmlEl");
            }
        }

        function showInputContainers(){
            if ($$(el)){
                $$(el).show();
            }

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
            const operBtn =  $$(el+"-btnFilterOperations");
            if( operBtn ){
                operBtn.setValue("=");
            }
         
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
                setFunctionError(err,logNameFile,"function visibleField => hideHtmlEl");
            }
        }
      
        function removeChilds(){
            const countChild = $$(el+"_rows").getChildViews();  
            const childs     = [];
    
            try{
               
                Object.values(countChild).forEach(function(elem,i){
                  
                    if (elem.config.id.includes("child")){
                        childs.push($$(elem.config.id));
                    }

                });
 
                childs.forEach(function(el,i){
                    const parent = el.getParentView();
                    parent.removeView($$(el.config.id));
 
                });

            } catch(err){
                setFunctionError(err,logNameFile,"function visibleField => removeChids");
            }
        }

        let checkChilds = false;
        if (el!=="selectAll"){
            const childs = $$(el+"_rows").getChildViews();
            if (childs.length > 1){
                checkChilds = true;
            }
         
        }
 
        if ( !checkChilds ){
            if (condition){

                try{
                    showHtmlEl();
                    showInputContainers();
                    enableResetBtn();
                    enableLibrarySaveBtn();
                    hideEmptyTemplate();
                } catch(err){
                    setFunctionError(err,logNameFile,"function visibleField => showElements");
                }

            } else{
                try{
        
                    if ($$(el).isVisible()){
                        hideHtmlEl ();
                    }

                    if($$(el+"_rows")){
                        removeChilds();
                    }

                    hideInputContainers ();

                } catch(err){
                    setFunctionError(err,logNameFile,"function visibleField => hideElements");
                }
            }
        } else {
            if ( !condition ){
                if ($$(el).isVisible()){
                    hideHtmlEl ();
                }

                if($$(el+"_rows")){
                    removeChilds();
                }

                hideInputContainers ();
            }
        }
    }

  
    
    function getLibraryData(){
        
        let radioValue = $$("filterEditLib").getOption($$("filterEditLib").getValue());
        
        let userprefsData = webix.ajax("/init/default/api/userprefs/");
     
        userprefsData.then(function(data){
            let dataErr = data.json();
            data = data.json().content;
      
            const currId    = getItemId ();
            const allInputs = $$("inputsFilter").getChildViews();
       
            function hideFalseInputs(trueInputs){
              
                
                function findTrueInput(inp){
                    let findInput;
                    trueInputs.forEach(function(el,i){
                     
                        if (inp.includes(el)){
                            findInput = el;
                        }
                        
                    });


                    return findInput+"_rows";
                }

                try{
                    allInputs.forEach(function(input,i){
             
                        let trueInp = findTrueInput(input.config.id);
                        let id      = input.config.id;
                        
                        function getElementHide(){
                            let indexHide = id.indexOf("_rows");
                            return id.slice(0,indexHide);
                        }

                        function getHtmlClass(elementHide){
                            let indexHtml = elementHide.indexOf("_filter");
                            return id.slice(0,indexHtml);
                        }

                        if (input.config.id !== trueInp){
                            let elementHide = getElementHide();
                            let htmlClass = getHtmlClass(elementHide);
                            visibleField(0,htmlClass,elementHide);
                        }

                    });
                } catch(err){
                    setFunctionError(err,logNameFile,"function hideFalseInputs");
                }
            }

            function removeChilds(){
                const inputsInner = [];

                allInputs.forEach(function(input,i){
                    inputsInner.push(input.getChildViews());
                });

                function getChilds(el){
                    el.forEach(function(child,i){
                        if (child.config.id.includes("-child-")){
                            const childView = $$(child.config.id);
                            const parent = childView.getParentView();
                            parent.removeView(childView);
                        }
                    });
                }
             
                inputsInner.forEach(function(el,i){
                    if (el.length > 1){
                       getChilds(el);
                    }
                });
            }
 
            function  createWorkspace(prefs){
                removeChilds();
                let trueInputs = [];

                try{
                    prefs.collection.content.forEach(function(el,i){
                     
                        function getHtmlArgument (){
                            const indexHtml = el.parentField.id.indexOf("_filter");
                            return el.parentField.id.slice(0,indexHtml); 
                        }

                        function getIdElArgument (){
                            const indexId = el.parentField.id.indexOf("_rows");
                            return el.parentField.id.slice(0,indexId);
                        }

                        function showParentInputs(){
                            const htmlClass = getHtmlArgument ();
                            const idEl      = getIdElArgument ();
                    
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
                                if(  $$(el.parentField.id) ){
                                    $$(el.parentField.id)._cells.forEach(function(child,i){
                                        if (child.config.id.includes("child")){
                                            $$(el.parentField.id).removeView($$(child.config.id));
                                        }
                                    });
                                }
                            } catch(err){
                                setFunctionError(err,logNameFile,"function createWorkspace => removeLastChilds");
                            }
                        }

                        function createChilds(){
                            const columnsData = $$("table").getColumns(true);
           
                            try{ 
                                columnsData.forEach(function(col,i){
                                    if ( el.parentField.id == col.id+"_filter" ){
                                      
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
                                setFunctionError(err,logNameFile,"function createWorkspace => createChilds");
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
                    setFunctionError(err,logNameFile,"function createWorkspace");
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
                    setFunctionError(err,logNameFile,"function dataEnumeration");
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
            setAjaxError(err, logNameFile,"getLibraryData");
        });


      
    }

 
    function getCheckboxData(){

        function enableLibrarySaveBtn(){
            const btn = $$("filterLibrarySaveBtn");
            if ( btn && !(btn.isEnabled()) ){
                btn.enable();
            }
        }

        function createWorkspaceCheckbox (){
            let values = $$("editFormPopup").getValues();
            let elementClass;
            let index;
    
            try{
                Object.keys(values).forEach(function(el,i){
                    index        = el.lastIndexOf("_");
                    elementClass = el.slice(0,index);
                    visibleField (values[el],elementClass,el);
          
                });
            } catch(err){
                setFunctionError(err,logNameFile,"function createWorkspaceCheckbox");
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
                setFunctionError(err,logNameFile,"function getCheckboxData => visibleCounter");
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

            const visibleElements = visibleCounter();

            if (!(visibleElements)){
                showEmptyTempalte();
                disableFilterSubmit();
                disableibrarySaveBtn(); 
            } 

            hideFilterPopup ();

        } catch(err){
            setFunctionError(err,logNameFile,"function getCheckboxData");
        }
      
        setLogValue("success","Рабочая область фильтра обновлена");
    }



    try{                                             
        const tabbarValue = $$("filterPopupTabbar").getValue();

        if (tabbarValue =="editFormPopupLib"){
            getLibraryData();

        } else if (tabbarValue=="editFormScroll"){
            getCheckboxData();
        }
    }catch(err){
        setFunctionError(err,logNameFile,"function popupSubmitBtn");
        $$("popupFilterEdit").destructor();
    }
}

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
            setFunctionError(err,logNameFile,"btnSubmitState");
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
           // visibleClearBtn (false);
            setStateSubmitBtn ();
            visibleRemoveBtn (true);
        }catch(err){
            setFunctionError(err,logNameFile,"filterLibrary");
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
          //  visibleClearBtn (true);
            visibleRemoveBtn (false);
            setStateSubmitBtn();
        }catch(err){
            setFunctionError(err,logNameFile,"editFilter");
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
        setFunctionError(err,logNameFile,"tabbarLogic");
    }
}

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

function returnTemplateValue(){
    return filterTemplateValue;
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

// const cleanBtn = {   
//     view:"button",
//     id:"popupFilterClearBtn",
//     width:110,
//     height:48,
//     css:"webix_secondary",
//     disabled:true,
//     value:"Сбросить", 
//     on: {
//         onAfterRender: function () {
//             this.getInputNode().setAttribute("title","Все фильтры будут очищены и удалены");
//         },
//     },
//     click:clearPopupBtn
// };

const removeBtn = {   
    view:"button",
    css:"webix_danger",
    id:"editFormPopupLibRemoveBtn",
    type:"icon",
    icon: 'icon-trash',
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
                                    setFunctionError(err,logNameFile,"function deleteElement => removeOptionState");
                                }
                            }

                            if (data.err_type !== "e"&&data.err_type !== "x"){
                                setLogValue("success","Шаблон « "+radioValue.value+" » удален");
                                removeOptionState ();
                            } else {
                                setLogValue("error", logNameFile+" function userprefsData: "+data.err);
                            }

                        });
                        deleteTemplate.fail(function(err){
                            setAjaxError(err, logNameFile,"getLibraryData");
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
               // cleanBtn,
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
//createFilterPopup();



export {
    createFilterPopup,
    returnTemplateValue
};

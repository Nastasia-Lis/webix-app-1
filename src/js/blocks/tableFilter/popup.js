
import { setLogValue }                       from '../logBlock.js';

import { setFunctionError, setAjaxError }    from "../errors.js";
import { modalBox }                          from "../notifications.js";

import { getUserprefsData, PREFS_STORAGE }   from "./buttons.js";
import { visibleField, visibleInputs }       from "./common.js";
import { getLibraryData }                    from "./userTemplate.js";

import { getItemId, showElem, hideElem, 
         disableElem, enableElem }           from "../commonFunctions.js";

let filterTemplateValue;

const logNameFile = "tableFilter => popup";


function popupSubmitBtn (){

    function getCheckboxData(){

        function enableLibrarySaveBtn(){
            const btn = $$("filterLibrarySaveBtn");
            if ( btn && !(btn.isEnabled()) ){
                btn.enable();
            }
        }

        function createWorkspaceCheckbox (){
            const values       = $$("editFormPopup").getValues();
            const selectValues = [];

            function returnSegmentBtn(input){
                return $$( input + "_segmentBtn");
            }
         
            function visibleSegmentBtn(selectAll){

                const selectLength = selectValues.length;

                selectValues.forEach(function(value,i){
                    const colId      = $$(value).config.columnName;

                    const collection = visibleInputs[colId];
                    const length     = collection.length;
                    const lastIndex  = length - 1;

                    const segmentBtn = returnSegmentBtn(collection[lastIndex]);

                    if ( i === selectLength - 1){
                      //  скрыть последний элемент
                      hideElem(segmentBtn);
          
                
                    } else if ( i === selectLength - 2 || selectAll){
                        showElem(segmentBtn);
                    }

               
                });
            }
            try{
                const keys    = Object.keys(values); 
                let selectAll = false;

                keys.forEach(function(el,i){

                    if (values[el] && el !== "selectAll"){
                        selectValues.push(el);
                    } else if (el == "selectAll"){
                        selectAll = true;
                    }

                    const columnName = $$(el).config.columnName;
                    visibleField (values[el], columnName, el);
          
                });

                visibleSegmentBtn(selectAll);

            } catch(err){
                setFunctionError(
                    err,
                    logNameFile,
                    "function createWorkspaceCheckbox"
                );
            }
        }

        function visibleCounter(){
            const elements      = $$("filterTableForm").elements;
            const values        = Object.values(elements);
            let visibleElements = 0;
            try{
                values.forEach(function(el,i){
                    if ( !(el.config.hidden) ){
                        visibleElements++;
                    }
                    
                });

            } catch(err){
                setFunctionError(
                    err,
                    logNameFile,
                    "function getCheckboxData => visibleCounter"
                );
            }

            return visibleElements;
        }


        function hideFilterPopup (){
            const popup = $$("popupFilterEdit");
            if (popup){
                popup.destructor();
            }
        }
       
        try{
            enableLibrarySaveBtn();
            createWorkspaceCheckbox ();

            const visibleElements = visibleCounter();

            if (!(visibleElements)){
                showElem    ($$("filterEmptyTempalte"));
                disableElem ($$("btnFilterSubmit"));
                disableElem ($$("filterLibrarySaveBtn"));
            } 

            hideFilterPopup ();

        } catch(err){
            setFunctionError(
                err,
                logNameFile,
                "function getCheckboxData"
            );
        }
      
        setLogValue("success","Рабочая область фильтра обновлена");
    }

    try {                                             
        const tabbarValue = $$("filterPopupTabbar").getValue();

        if (tabbarValue == "editFormPopupLib" ){
            getLibraryData();

        } else if (tabbarValue == "editFormScroll" ){
            getCheckboxData();
        }
    } catch (err) {
        setFunctionError(err,logNameFile,"function popupSubmitBtn");
        $$("popupFilterEdit").destructor();
    }

    function showEmptyTemplate(){
        const keys = Object.keys(visibleInputs).length;

        if ( !keys ){
            showElem ($$("filterEmptyTempalte"));
        }
    }
    showEmptyTemplate();

}

function removeBtnClick (){
    const currId = getItemId ();
    async function userprefsData (){ 

        const lib        = $$("filterEditLib");
        const libValue   = lib.getValue();
        const radioValue = lib.getOption(libValue);
       
        function deleteElement(el, id, value){

            const url            = "/init/default/api/userprefs/" + el.id;
            const deleteTemplate = webix.ajax().del(url, el);

            deleteTemplate.then(function(data){
                data = data.json();
            
                function removeOptionState (){
                    try{
                        lib.config.options.forEach(function(el,i){
                            if (el.id == id){
                                el.value = value + " (шаблон удалён)";
                                lib.refresh();
                                lib.disableOption(lib.getValue());
                                lib.setValue("");
                            }
                        });
                    } catch (err){
                        setFunctionError(
                            err, 
                            logNameFile, 
                            "function deleteElement => removeOptionState"
                        );
                    }
                }

                if (data.err_type !== "e"&&data.err_type !== "x"){
                    setLogValue("success","Шаблон « " + value + " » удален");
                    removeOptionState ();
                } else {
                    setLogValue("error", 
                    logNameFile + "function userprefsData: " + data.err);
                }

            });
            deleteTemplate.fail(function(err){
                setAjaxError(err, logNameFile,"getLibraryData");
            });
        }

        if (!PREFS_STORAGE.userprefs){
            await getUserprefsData (); 
        }

        if (PREFS_STORAGE.userprefs){
            const data         = PREFS_STORAGE.userprefs.content;

            const id           = radioValue.id;
            const value        = radioValue.value;

            const templateName = currId + "_filter-template_" + value;

            data.forEach(function(el,i){
                if (el.name == templateName){
                    deleteElement(el, id, value);
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
}

const templateRecover = {
    template    : "<div class='no-wrap-headline'>" +
                  "Редактор фильтров </div>", 
    css         : "webix_template-recover", 
    borderless  : true, 
    height      : 40 
};

const buttonClosePopup =  {
    view    : "button",
    id      : "buttonClosePopup",
    css     : "popup_close-btn",
    type    : "icon",
    hotkey  : "esc",
    width   : 25,
    icon    : 'wxi-close',
    click   : function(){
        const popup = $$("popupFilterEdit");
        if (popup){
            popup.destructor();
        }
    
    }
};

const filterPrompt = {
    css         : "webix_empty-template",
    template    : "Выберите нужные поля или шаблон из библиотеки", 
    borderless  : true, 
    height      : 47
};

function tabbarClick (id){


    function btnSubmitState (state){
        const btn = $$("popupFilterSubmitBtn");

        if (state=="enable"){
            enableElem(btn);
        } else if (state=="disable"){
            disableElem(btn);
        }
        
    }


    function visibleRemoveBtn (param){
        const btn = $$("editFormPopupLibRemoveBtn");
        if ( btn && !(btn.isVisible()) ){
            if (param){
                btn.show();
            } else {
                btn.hide();
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

function returnDivHeadline(title){
    return  "<span" + 
            "class='webix_tabbar-filter-headline'>" +
            title +
            "</span>";
}


const tabbar =  {
    view        : "tabbar",  
    type        : "top", 
    id          : "filterPopupTabbar",
    css         : "webix_filter-popup-tabbar",
    multiview   : true, 
    height      : 50,

    options     : [
        {   value: returnDivHeadline("Поля"), 
            id: 'editFormScroll' 
        },
        {   value: returnDivHeadline("Библиотека"), 
            id: 'editFormPopupLib' 
        },
    ],

    on:{
        onAfterTabClick: function(id){
            tabbarClick(id);
        }
    }
};

const tabCheckboxes = {   
    view        :"scrollview",
    id          : "editFormScroll", 
    borderless  : true, 
    css         : "webix_multivew-cell",
    scroll      : "y", 
    body        : { 
        id  : "editFormPopupScroll",
        rows: [ ]
    }

};

function stateSubmitBtn(state){
    const popup = $$("popupFilterSubmitBtn");
    if(state){
        popup.enable();
    } else {
        popup.disable();
    }

}

function returnTemplateValue(){
    return filterTemplateValue;
}

function onChangeLibBtn (){
    const btn       = $$("filterEditLib");
    const submitBtn = $$("popupFilterSubmitBtn");
    
    if (btn.getValue()){
        filterTemplateValue = btn.getValue();

        enableElem($$("editFormPopupLibRemoveBtn"));

        if(!(submitBtn.isEnabled())){
            stateSubmitBtn(true);
        }
    } else {
        if(submitBtn.isEnabled()){
            stateSubmitBtn(false);
        }
    }
}

const radioLibBtn =  {   
    view    : "radio", 
    id      : "filterEditLib",
    vertical: true,
    options : [],
    on      : {
        onChange: function(){
            onChangeLibBtn ();
        }
    }
};

const tabLib = {  
    view        : "form", 
    scroll      : true ,
    id          : "editFormPopupLib",
    css         : "webix_multivew-cell",
    borderless  : true,
    elements    : [
        radioLibBtn
    ],

};

const submitBtn =  {   
    view    : "button",
    id      : "popupFilterSubmitBtn",
    height  : 48,
    minWidth: 140,
    disabled: true, 
    css     : "webix_primary",
    hotkey  : "Enter",
    value   : "Применить", 
    on      : {
        onAfterRender: function () {
            this.getInputNode().setAttribute("title",
            "Выбранные фильтры будут добавлены в рабочее поле, остальные скрыты");
        },
    },
    click:popupSubmitBtn
};


const removeBtn = {   
    view    : "button",
    css     : "webix_danger",
    id      : "editFormPopupLibRemoveBtn",
    type    : "icon",
    icon    : 'icon-trash',
    hidden  : true,
    disabled: true,
    width   : 50,
    click   : function(){
        removeBtnClick ();
    },
    on      : {
        onAfterRender: function () {
            this.getInputNode().setAttribute("title","Выбранный шаблон будет удален");
        },
    },
};

const editFormPopup = {
    view        : "form", 
    id          : "editFormPopup",
    css         : "webix_edit-form-popup",
    borderless  : true,
    elements    : [

        { rows : [ 
            tabbar,
                
            {   height : 200,
                cells  : [
                    tabCheckboxes,
                    tabLib,
                ]   
            },
    
            {height : 20},
            {cols   : [
                submitBtn,
                {width : 5},
                removeBtn,
            ]},
        ]},
        {}

    ],
};

function createFilterPopup() {
    webix.ui({
        view    : "popup",
        id      : "popupFilterEdit",
        css     : "webix_popup-filter-container webix_popup-config",
        modal   : true,
        escHide : true,
        position: "center",
        height  : 400,
        width   : 400,
        body    : {
            scroll : "y", 
            rows   : [
                {   css : "webix_filter-headline-wrapper", 
                    cols: [ 
                        templateRecover,
                        {width : 150},
                        buttonClosePopup,
                    ]
                },

                filterPrompt,
                editFormPopup
            ]
        }
    }).show();
}



export {
    createFilterPopup,
    returnTemplateValue,
};

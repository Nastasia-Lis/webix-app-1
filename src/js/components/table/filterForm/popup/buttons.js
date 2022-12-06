
import { setLogValue }          from '../../../logBlock.js';

import { setFunctionError, 
        setAjaxError }          from "../../../../blocks/errors.js";

import { modalBox }             from "../../../../blocks/notifications.js";

import { getLibraryData }       from "../userTemplate.js";

import { Action }               from "../../../../blocks/commonFunctions.js";

import { Button }               from "../../../../viewTemplates/buttons.js";

import { SELECT_TEMPLATE }      from "../userTemplate.js";

import { Filter }               from "../actions/_FilterActions.js";


const logNameFile = "tableFilter => popup => buttons";


function returnCollection(value){
    const colId      = $$(value).config.columnName;
    return Filter.getItem(colId);
}

function visibleSegmentBtn(selectAll, selectValues){

    const selectLength = selectValues.length;

    selectValues.forEach(function(value, i){
        const collection = returnCollection(value);
    
        const length     = collection.length;
        const lastIndex  = length - 1;
        const lastId     = collection[lastIndex];

        const segmentBtn = $$(lastId + "_segmentBtn");

        const lastElem   = selectLength - 1;
        const prevElem   = selectLength - 1;

        if ( i === lastElem){
          //  скрыть последний элемент
            Action.hideItem(segmentBtn);

        } else if ( i === prevElem || selectAll){
            Action.showItem(segmentBtn);
        }
   
    });
}


function createWorkspaceCheckbox (){
    const values       = $$("editFormPopup").getValues();
    const selectValues = [];

    try{
        const keys    = Object.keys(values); 
        let selectAll = false;

        keys.forEach(function(el){
            const isChecked = values[el];

            if (isChecked && el !== "selectAll"){
                selectValues.push(el);
            } else if (el == "selectAll"){
                selectAll = true;
            }

            const columnName = $$(el).config.columnName;
            Filter.setFieldState(values[el], columnName, el);
  
        });

        visibleSegmentBtn(selectAll, selectValues);

    } catch(err){
        setFunctionError(
            err,
            logNameFile,
            "createWorkspaceCheckbox"
        );
    }
}

function visibleCounter(){
    const elements      = $$("filterTableForm").elements;
    const values        = Object.values(elements);
    let visibleElements = 0;
    try{
        values.forEach(function(el){
            const isVisibleElem = el.config.hidden;
            if ( !isVisibleElem ){
                visibleElements++;
            }
            
        });

    } catch(err){
        setFunctionError(
            err,
            logNameFile,
            "visibleCounter"
        );
    }

    return visibleElements;
}


function resetLibSelectOption(){
    if (SELECT_TEMPLATE){
        delete SELECT_TEMPLATE.id;
        delete SELECT_TEMPLATE.value;
    }
}

function setDisableTabState(){
    const visibleElements = visibleCounter();

    if (!(visibleElements)){
        Action.showItem     ($$("filterEmptyTempalte" ));

        Action.disableItem  ($$("btnFilterSubmit"     ));
        Action.disableItem  ($$("filterLibrarySaveBtn"));
    } 
}

function getCheckboxData(){
      
    Action.enableItem($$("filterLibrarySaveBtn"));
    createWorkspaceCheckbox ();

    setDisableTabState();

    Action.destructItem($$("popupFilterEdit"));

    resetLibSelectOption();

    setLogValue(
        "success",
        "Рабочая область фильтра обновлена"
    );
}

function showEmptyTemplate(){
    const keys = Filter.lengthPull();
    if ( !keys ){
        Action.showItem($$("filterEmptyTempalte"));
    }
}

function popupSubmitBtn (){
    try {                                             
        const tabbarValue = $$("filterPopupTabbar").getValue();

        if (tabbarValue == "editFormPopupLib" ){
   
            $$("resetFilterBtn").callEvent("resetFilter");
            getLibraryData ();

        } else if (tabbarValue == "editFormScroll" ){
            getCheckboxData();
        }

    } catch (err) {
        setFunctionError( 
            err ,
            logNameFile, 
            "popupSubmitBtn"
        );

        Action.destructItem($$("popupFilterEdit"));
    }

    showEmptyTemplate();

}



let lib;
let radioValue;

function removeOptionState (){
    const id      = radioValue.id;
    const options = lib.config.options;
    try{
        options.forEach(function(el){
            if (el.id == id){
                el.value = el.value + " (шаблон удалён)";
                lib.refresh();
                lib.disableOption(lib.getValue());
                lib.setValue("");
            }
        });
    } catch (err){
        setFunctionError(
            err, 
            logNameFile, 
            "removeOptionState"
        );
    }
}

function deleteElement(){
    const prefs   = radioValue.prefs;
    const idPrefs = prefs.id;

    const path = "/init/default/api/userprefs/" + idPrefs;
    const deleteTemplate = webix.ajax().del(path, prefs);

    deleteTemplate.then(function(data){
        data = data.json();

        const value = radioValue.value;

        if (data.err_type == "i"){
            setLogValue(
                "success",
                "Шаблон « " + value + " » удален"
            );
            removeOptionState ();
        } else {
            setFunctionError(
                data.err, 
                logNameFile, 
                "userprefsData"
            );
        }

    });

    deleteTemplate.fail(function(err){
        setAjaxError(
            err, 
            logNameFile,
            "getLibraryData"
        );
    });
}

async function userprefsData (){ 

    lib = $$("filterEditLib");
    const libValue = lib.getValue();
    radioValue = lib.getOption(libValue);

    const idPrefs = radioValue.prefs.id;

    if (idPrefs){
        deleteElement       (radioValue, lib);
        resetLibSelectOption();
        Action.disableItem  ($$("editFormPopupLibRemoveBtn"));
    }

    

}


function removeBtnClick (){

    modalBox(   "Шаблон будет удалён", 
                "Вы уверены, что хотите продолжить?", 
                ["Отмена", "Удалить"]
    ).then(function(result){

        if (result == 1){
            userprefsData ();
            
        }
    });
}


const submitBtn = new Button({
    
    config   : {
        id       : "popupFilterSubmitBtn",
        hotkey   : "Shift+Space",
        disabled : true, 
        value    : "Применить", 
        click    : popupSubmitBtn
    },
    titleAttribute : "Выбранные фильтры будут" +
    "добавлены в рабочее поле, остальные скрыты"

}).maxView("primary");


const removeBtn = new Button({
    
    config   : {
        id       : "editFormPopupLibRemoveBtn",
        hotkey   : "Shift+Q",
        hidden   : true,  
        disabled : true,
        icon     : "icon-trash", 
        click   : function(){
            removeBtnClick ();
        },
    },
    titleAttribute : "Выбранный шаблон будет удален"

   
}).minView("delete");


const btnLayout = {
    cols   : [
        submitBtn,
        {width : 5},
        removeBtn,
    ]
};

export {
    btnLayout
};
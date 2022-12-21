

import { setLogValue }          from '../../../logBlock.js';

import { setFunctionError }     from "../../../../blocks/errors.js";

import { getLibraryData }       from "../userTemplate.js";

import { Action, getTable }     from "../../../../blocks/commonFunctions.js";

import { mediator }             from "../../../../blocks/_mediator.js";

import { Button }               from "../../../../viewTemplates/buttons.js";

import { Filter }               from "../actions/_FilterActions.js";

import { modalBox }             from "../../../../blocks/notifications.js";

const logNameFile = "filterTable => popup => submitBtn";


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

       
            Filter.setFieldState(values[el], columnName);
  
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


// function resetLibSelectOption(){
//     Filter.setActiveTemplate(null);
// }

function setDisableTabState(){
    const visibleElements = visibleCounter();

    if (!(visibleElements)){
        Action.showItem     ($$("filterEmptyTempalte" ));

        Action.disableItem  ($$("btnFilterSubmit"     ));
        Action.disableItem  ($$("filterLibrarySaveBtn"));
    } 
}


function createFilter(){
    Action.enableItem($$("filterLibrarySaveBtn"));
    createWorkspaceCheckbox ();

    setDisableTabState();

    Action.destructItem($$("popupFilterEdit"));

    //resetLibSelectOption();
  
    setLogValue(
        "success",
        "Рабочая область фильтра обновлена"
    );
}

function setToTabStorage(){
    const data = mediator.tabs.getInfo();

    if (data.temp && data.temp.queryFilter){
        data.temp.queryFilter = null;
    }
}

async function createModalBox(table){
    return modalBox("С таблицы будет сброшен текущий фильтр", 
        "Вы уверены?", 
    ["Отмена", "Продолжить"]
    )
    .then(function (result){
        if (result == 1){

            return Filter.resetTable().then(function(result){
                if (result){
                    Filter.showApplyNotify(false);
                    table.config.filter = null;
                    setToTabStorage();
                    
                } 

                return result;
            });
       
        }

    });
}

function showActiveTemplate(){
    if (Filter.getActiveTemplate()){
        Action.showItem($$("templateInfo"));
    } 
}

function resultActions(){
    createFilter();
    Filter.setStateToStorage ();
    Filter.enableSubmitButton();
    showActiveTemplate();
}

function isUnselectAll(){
    const checkboxContainer = $$("editFormPopupScrollContent");
    const checkboxes        = checkboxContainer.getChildViews();

    let isUnchecked = true;
    
    checkboxes.forEach(function(el){
        const id       = el.config.id;
        const checkbox = $$(id);

        if (checkbox){

            const value = checkbox.getValue();

            if (value && isUnchecked && id !== "selectAll"){
                isUnchecked = false;
            }
        }

    });

    return isUnchecked;

}

function getCheckboxData(){
    const table          = getTable();
    const isFilterExists = table.config.filter;
 
    if (isUnselectAll() && isFilterExists){
        createModalBox(table).then(function(result){
            if (result){
                resultActions();
            }
        });
    } else {
        resultActions();
    }

     
 
}

function showEmptyTemplate(){
    const keys = Filter.lengthPull();
    if ( !keys ){
        Action.showItem($$("filterEmptyTempalte"));
    }
}

function createLibraryInputs(){
    Filter.clearFilter  ();
    Filter.clearAll     ();
    getLibraryData      ();
}

function popupSubmitBtn (){
    try {                                             
        const tabbarValue = $$("filterPopupTabbar").getValue();

        if (tabbarValue == "editFormPopupLib"){

            const table          = getTable();
            const isFilterExists = table.config.filter;
         
            if (isFilterExists){
                createModalBox(table).then(function(result){
                    if (result){

                        Filter.resetTable().then(function(result){
                            if (result){
                                createLibraryInputs();
                              
                            } 
                        });
                    }
                });
            } else {
                createLibraryInputs();
          
            }

        } else if (tabbarValue == "editFormScroll" ){
            getCheckboxData();
            Filter.setStateToStorage();
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


export {
    submitBtn
};
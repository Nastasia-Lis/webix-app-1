
import { setLogValue }                          from '../../logBlock.js';
import { setFunctionError, setAjaxError }       from "../../../blocks/errors.js";
import { createChildFields }                    from "./createElements/childFilter.js";
import { getItemId, Action, getTable }          from "../../../blocks/commonFunctions.js";
import { Filter }                               from "./actions/_FilterActions.js";

const logNameFile     = "tableFilter => userTemplate";

const SELECT_TEMPLATE = {};

function setValue(el, value){
    if (value){
        el.setValue(value);
    }
}

function setBtnsValue(el){
        
    const id = el.id;
    const segmentBtn    = $$(id + "_segmentBtn");
    const operationsBtn = $$(id + "-btnFilterOperations");

    setValue(segmentBtn   , el.logic    );
    setValue(operationsBtn, el.operation);
    
}

function showParentField (el){
    const idEl      = el.id;
    const element   = $$(idEl);
    const htmlClass = element.config.columnName;
    Filter.setFieldState(1, htmlClass, idEl);
   // visibleField(1, htmlClass, idEl);

    setBtnsValue(el);
    setValue    (element, el.value);
}

function createChildField(el){
    const table = getTable();
    const col   = table.getColumnConfig(el.parent);
 
    const idField = createChildFields (col);

    const values = el;
    values.id = idField;
  
    setBtnsValue(values);
    setValue    ($$(idField), el.value);
}


function returnValue(array, index){
    const lastKey = array.length - index;
    return array[lastKey];
}

function hideSegmentBtn(){
    const lastCollection = returnValue (Filter.getItems(), 1);
    const lastInput      = returnValue (Filter.getItem(lastCollection), 1);
    const segmentBtn     = $$(lastInput + "_segmentBtn");
    Action.hideItem(segmentBtn);
}


function  createWorkspace(prefs){

    Filter.clearFilter();

    const values = prefs.values;

    values.forEach(function(el,i){
        
        if (!el.parent){
            showParentField  (el);
        } else {
            createChildField(el);
        }
    });

    hideSegmentBtn();

}

function setToSelectStorage(id, val){
    SELECT_TEMPLATE.id    = id;
    SELECT_TEMPLATE.value = val;
}

function createFiltersByTemplate(data) {
    const currId     = getItemId ();

    data             = data.json().content;

    const lib        = $$("filterEditLib");
    const libValue   = lib.getValue ();
    const radioValue = lib.getOption(libValue);

    try{
        data.forEach(function (el){
            const value = radioValue.value;

            const name = 
            currId + "_filter-template_" + value;

            if (el.name == name){
                const prefs = JSON.parse(el.prefs);
                createWorkspace(prefs);
            }

            Action.destructItem($$("popupFilterEdit"));
            Action.enableItem  ($$("btnFilterSubmit"));
            setToSelectStorage (radioValue.id, value);

        });
    } catch(err){
        setFunctionError(
            err, 
            logNameFile, 
            "createFiltersByTemplate"
        );
    }
}

function showHtmlContainers(){
    const keys = Filter.getItems();
    
    keys.forEach(function(el){
        const htmlElement = document.querySelector("." + el );
        Filter.addClass   (htmlElement, "webix_show-content");
        Filter.removeClass(htmlElement, "webix_hide-content");
    });
}

function getLibraryData(){

    const userprefsData = webix.ajax("/init/default/api/userprefs/");

    userprefsData.then(function(data){
        createFiltersByTemplate(data);
        showHtmlContainers     ();
        setLogValue(
            "success", 
            "Рабочая область фильтра обновлена"
        );

    });

    userprefsData.fail(function(err){
        setAjaxError(
            err, 
            logNameFile, 
            "getLibraryData"
        );
    });

}

export{
    getLibraryData,
    SELECT_TEMPLATE  
};
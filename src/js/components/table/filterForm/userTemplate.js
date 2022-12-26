
import { setLogValue }                          from '../../logBlock.js';
import { setFunctionError, setAjaxError }       from "../../../blocks/errors.js";
import { createChildFields }                    from "./createElements/childFilter.js";
import { getItemId, Action, getTable }          from "../../../blocks/commonFunctions.js";
import { Filter }                               from "./actions/_FilterActions.js";

const logNameFile     = "tableFilter => userTemplate";


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
    if (element){
        const htmlClass = element.config.columnName;
        Filter.setFieldState(1, htmlClass, idEl);
    
        setBtnsValue(el);
        setValue    (element, el.value);
    } else {
        setFunctionError(
            "element is " + element, 
            logNameFile, 
            "showParentField"
        ); 
    }
    
}

function createChildField(el){
    const table = getTable();
    const col   = table.getColumnConfig(el.parent);
 
    const idField = createChildFields  (col, el.index);

    const values  = el;
    values.id     = idField;
  
    setBtnsValue(values);

    setValue    ($$(idField), el.value);


}


function returnLastItem(array){
    const indexes       = Filter.getIndexFilters();
    const selectIndexes = [];

    if (array){

        array.forEach(function(el){
            selectIndexes.push(indexes[el]);
        });

 
        let lastIndex = 0;

        for (let i = 0; i < selectIndexes.length; i++){

            if (selectIndexes[i] > lastIndex) {
                lastIndex = selectIndexes[i];
            }
        }

        const keys = Object.keys(indexes);

        const lastInput = 
        keys.find(key => indexes[key] === lastIndex);

  
        return lastInput;
    }

}

function returnLastChild(item){
    return item[item.length - 1];
}

function hideSegmentBtn(){
    const lastCollection = returnLastItem  (Filter.getItems());
    const lastInput      = returnLastChild (Filter.getItem(lastCollection));
    const segmentBtn     = $$(lastInput + "_segmentBtn");

    Action.hideItem(segmentBtn);
}


function createWorkspace(prefs){

    Filter.clearFilter();
 
    prefs.forEach(function(el){
        if (!el.parent){
            showParentField  (el);
        } else {
            createChildField(el);
        }
   
    });

    hideSegmentBtn();
 
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
                createWorkspace(prefs.values);

                Action.destructItem($$("popupFilterEdit"));
                Filter.setActiveTemplate(radioValue);
            }

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

    Filter.hideInputsContainers(keys); // hidden inputs
}



function getLibraryData(){

    const userprefsData = webix.ajax("/init/default/api/userprefs/");

    userprefsData.then(function(data){
        createFiltersByTemplate  (data);
        showHtmlContainers       ();
        Filter.setStateToStorage ();
        Filter.enableSubmitButton();
        Action.hideItem($$("templateInfo"));
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
    createWorkspace 
};

import { setLogValue }                          from '../../logBlock.js';
import { setFunctionError }                 from "../../../blocks/errors.js";
import { ServerData }                       from "../../../blocks/getServerData.js";
import { createChildFields }                from "./createElements/childFilter.js";
import { getItemId, Action, getTable }      from "../../../blocks/commonFunctions.js";
import { Filter }                           from "./actions/_FilterActions.js";

import { returnOwner }                      from "../../../blocks/commonFunctions.js";

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

    if (array && array.length){

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
 
    if (prefs && prefs.length){
        prefs.forEach(function(el){
            if (!el.parent){
                showParentField  (el);
            } else {
                createChildField(el);
            }
       
        });
    
        hideSegmentBtn();
     
    }
 
}

function getOption(){
    const lib        = $$("filterEditLib");
    const libValue   = lib.getValue ();
    return lib.getOption(libValue);
}

function createFiltersByTemplate(item) {
    const radioValue = getOption();
    const prefs      = JSON.parse(item.prefs);
    createWorkspace(prefs.values);

    Action.destructItem($$("popupFilterEdit"));
    Filter.setActiveTemplate(radioValue);
}


function showHtmlContainers(){
    const keys = Filter.getItems();

    if (keys && keys.length){
        keys.forEach(function(el){
            const htmlElement = document.querySelector("." + el ); 
            Filter.addClass   (htmlElement, "webix_show-content");
            Filter.removeClass(htmlElement, "webix_hide-content");
        });
    
        Filter.hideInputsContainers(keys); // hidden inputs
    }

}



async function getLibraryData(){
    const currId     = getItemId ();
    const radioValue = getOption();
    const value = radioValue.value;
    const name = 
    currId + "_filter-template_" + value;

    const owner = await returnOwner();

    new ServerData({
        id : `smarts?query=userprefs.name=${name}+and+userprefs.owner=${owner.id}`
    }).get().then(function(data){
    
        if (data){
    
            const content = data.content;
    
            if (content && content.length){
                const item = content[0];
                createFiltersByTemplate  (item);

                showHtmlContainers       ();
                Filter.setStateToStorage ();
                Filter.enableSubmitButton();
                Action.hideItem($$("templateInfo"));
                setLogValue(
                    "success", 
                    "Рабочая область фильтра обновлена"
                );
                
            }
        }
         
    });


}

export{
    getLibraryData,
    createWorkspace 
};
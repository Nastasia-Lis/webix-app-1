import { setLogValue }                       from '../../../logBlock.js';

import { setFunctionError, setAjaxError }    from "../../../../blocks/errors.js";

import { clearSpace, visibleInputs }         from "../common.js";

import { getItemId, getTable, Action }       from "../../../../blocks/commonFunctions.js";

import { Button }                            from "../../../../viewTemplates/buttons.js";
import { modalBox }                          from "../../../../blocks/notifications.js";


const logNameFile   = "tableFilter => buttons => resetBtn";

function clearVisibleStorage(){
    const keys = Object.keys(visibleInputs);
    if (keys){
        keys.forEach(function(key){
            delete visibleInputs[key];
        });
    }
  
}

function removeValues(collection){
    if (collection){
        collection.forEach(function(el, i){

            if (el.includes("_filter-child-")){
                const container = $$(el + "-container");
                Action.removeItem(container);
            }
     
        });
    }
    
}

function removeChilds(){
    const keys   = Object.keys(visibleInputs);

    keys.forEach(function(key, i){
        removeValues(visibleInputs[key]);
    });

}

function setDataTable(data, table){
    try{
        if (data.length !== 0){
            table.hideOverlay("Ничего не найдено");
            table.clearAll();
            table.parse(data);
        } else {
            table.clearAll();
            table.showOverlay("Ничего не найдено");
        }
    } catch (err){
        setFunctionError(
            err,
            logNameFile,
            "setDataTable"
        );
    }
}

function setFilterCounterVal(table){
    try{
        const filterTable     = $$("table-idFilterElements");
        const filterCountRows = table.count();
        const value           = filterCountRows.toString();

        filterTable.setValues(value);
    } catch (err){
        setFunctionError(
            err,
            logNameFile,
            "setFilterCounterVal"
        );
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
                   elem.classList.add     (hideClass);
            }
        });
    } catch (err){
        setFunctionError(
            err,
            logNameFile,
            "hideInputsContainer"
        );
    }
}



function resetTable(){
    const itemTreeId = getItemId ();
    const table      = getTable();
    const query      = [
        `query=${itemTreeId}.id+%3E%3D+0&sorts=
        ${itemTreeId}.id&limit=80&offset=0`
    ];

    const url        = "/init/default/api/smarts?" + query;
    const queryData  = webix.ajax(url);

     
    queryData.then(function(data){
        const dataErr =  data.json();
      
        data = data.json().content;

        if (dataErr.err_type == "i"){
            try{
                setDataTable        (data, table);
                setFilterCounterVal (table);
                removeChilds        ();
            
                clearFilterValues   ();
                hideInputsContainer ();
                clearSpace          ();

                Action.hideItem   ($$("tableFilterPopup"    ));
                Action.disableItem($$("filterLibrarySaveBtn"));
                Action.disableItem($$("resetFilterBtn"      ));
                Action.showItem   ($$("filterEmptyTempalte" ));

                clearVisibleStorage();
            } catch (err){
                setFunctionError(
                    err,
                    logNameFile,
                    "resetFilterBtn"
                );
            }
        
            setLogValue("success", "Фильтры очищены");
        } else {
            setLogValue(
                "error", 
                "tableFilter => buttons function resetFilterBtn ajax: " +
                dataErr.err
            );
        }
    });

    queryData.fail(function(err){
        setAjaxError(err, logNameFile,"resetFilterBtn");
    });
}


function resetFilterBtnClick (){
    const table = getTable();
    try {

        modalBox("Все фильтры будут удалены", 
        "Вы уверены?", 
        ["Отмена", "Удалить"]
        )
        .then(function (result){
            if (result == 1){
                resetTable();
                table.config.filter = null;
            }

        });
        

    } catch(err) {
        setFunctionError(
            err,
            "Ошибка при очищении фильтров; tableFilter => buttons",
            "function resetFilterBtnClick"
        );
    }
}



const resetBtn = new Button({
    
    config   : {
        id       : "resetFilterBtn",
        hotkey   : "Shift+Esc",
        disabled : true,
        icon     : "icon-trash", 
        click    : function(){
            this.callEvent("resetFilter");
        }
    },
    titleAttribute : "Сбросить фильтры",
    onFunc: {
        resetFilter:function(){
            resetFilterBtnClick();
        
        }
    }

   
}).minView("delete");

export {
    resetBtn
};
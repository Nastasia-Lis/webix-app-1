import { setLogValue }                       from '../../../logBlock.js';

import { setFunctionError, setAjaxError }    from "../../../../blocks/errors.js";

import { getItemId, getTable, Action }       from "../../../../blocks/commonFunctions.js";

import { Button }                            from "../../../../viewTemplates/buttons.js";
import { modalBox }                          from "../../../../blocks/notifications.js";
import { Filter }                            from "../actions/_FilterActions.js";

const logNameFile   = "tableFilter => buttons => resetBtn";



function removeValues(collection){

    if (collection){

        collection.forEach(function(el){
            const idChild = el.includes("_filter-child-");

            if (idChild){
                Action.removeItem($$(el + "-container"));
            }
     
        });
    }
    
}

function removeChilds(){
   const keys = Filter.getItems();

    keys.forEach(function(key){ 
        const item = Filter.getItem(key);
        removeValues(item);
    });

}

function setDataTable(data, table){
    const overlay = "Ничего не найдено";
    try{
        if (data.length !== 0){
            table.hideOverlay(overlay);
            table.clearAll   ();
            table.parse      (data);

        } else {
            table.clearAll   ();
            table.showOverlay(overlay);
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
    const css       = ".webix_filter-inputs";
    const inputs    = document.querySelectorAll(css);
    const hideClass = "webix_hide-content";

    try{
        inputs.forEach(function(elem){
            Filter.addClass(elem, hideClass);
        });
    } catch (err){
        setFunctionError(
            err,
            logNameFile,
            "hideInputsContainer"
        );
    }
}





async function resetTable(){
    const itemTreeId = getItemId ();
    const table      = getTable  ();
    const query      = [
        `query=${itemTreeId}.id+%3E%3D+0&sorts=
               ${itemTreeId}.id&limit=80&offset=0
        `
    ];
   
    const path       = "/init/default/api/smarts?" + query;
    const queryData  = webix.ajax(path);

     
    return await queryData.then(function(data){
        const dataErr =  data.json();
      
        data = data.json().content;

        if (dataErr.err_type == "i"){
            try{
                setDataTable (data, table);
                setLogValue("success", "Фильтры очищены");
                return true;
            } catch (err){
                setFunctionError(
                    err,
                    logNameFile,
                    "resetFilterBtn"
                );
            }

        } else {
            setLogValue(
                "error", 
                "resetFilterBtn ajax: " +
                dataErr.err
            );
        }
    }).fail(function(err){
        setAjaxError(
            err, 
            logNameFile,
            "resetFilterBtn"
        );
    });
}


function clearInputSpace(){
    const table = getTable  ();
    setFilterCounterVal (table);
    removeChilds        ();
  
    clearFilterValues   ();
    hideInputsContainer ();
 
    Filter.clearFilter  ();

    Action.hideItem   ($$("tableFilterPopup"    ));

    Action.disableItem($$("filterLibrarySaveBtn"));
    Action.disableItem($$("resetFilterBtn"      ));

    Action.showItem   ($$("filterEmptyTempalte" ));

    Filter.setActiveTemplate(null);

  
    Filter.clearAll(); // clear inputs storage
 
    Filter.setStateToStorage();

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
                resetTable().then(function(result){
                    if (result){
                        clearInputSpace();
                        Filter.showApplyNotify(false);
                    }
                   
                });
                table.config.filter = null;
               
            }

        });
        

    } catch(err) {
        setFunctionError(
            err,
            "Ошибка при очищении фильтров; " +
            "filterForm => buttons",
            "resetFilterBtnClick"
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
            resetFilterBtnClick();
        }
    },
    titleAttribute : "Сбросить фильтры",
    onFunc: {
        resetFilter:function(){
            const table = getTable();
            table.config.filter = null;
            resetTable().then(function(result){
                if (result){
                    clearInputSpace();
                    Filter.showApplyNotify(false);
                }
            });
        }
    }

   
}).minView("delete");

export {
    resetBtn
};
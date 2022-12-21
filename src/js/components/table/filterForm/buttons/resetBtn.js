
import { setFunctionError }     from "../../../../blocks/errors.js";

import { getTable, Action }     from "../../../../blocks/commonFunctions.js";
import { mediator }             from "../../../../blocks/_mediator.js";
import { Button }               from "../../../../viewTemplates/buttons.js";
import { modalBox }             from "../../../../blocks/notifications.js";
import { Filter }               from "../actions/_FilterActions.js";

const logNameFile   = "filterForm => buttons => resetBtn";



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




function clearInputSpace(){

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

function setToTabStorage(){
    const data = mediator.tabs.getInfo();

    if (data.temp && data.temp.queryFilter){
        data.temp.queryFilter = null;
    }
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
                Filter.resetTable().then(function(result){
                    if (result){
                        clearInputSpace();
                        Filter.showApplyNotify(false);
                    }
                    table.config.filter = null;
                    setToTabStorage()
                    Action.hideItem($$("templateInfo"));
                });
              
               
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
        resetFilter: function(){
  
            const table         = getTable();
            table.config.filter = null;

            Filter.resetTable().then(function(result){
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
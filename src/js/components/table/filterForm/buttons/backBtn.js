import { Action }  from  "../../../../blocks/commonFunctions.js";
import { Button }  from "../../../../viewTemplates/buttons.js";
import { Filter }  from "../actions/_FilterActions.js";


function setBtnFilterState(){
    const btnClass          = document.querySelector(".webix_btn-filter");
    const primaryBtnClass   = "webix-transparent-btn--primary";
    const secondaryBtnClass = "webix-transparent-btn";

    Filter.addClass   (btnClass, secondaryBtnClass);
    Filter.removeClass(btnClass, primaryBtnClass  );

}


function defaultFormState(){
    const filterForm     = $$("filterTableBarContainer");
    const tableContainer = $$("tableContainer");

    Action.hideItem(filterForm);
    Action.showItem(tableContainer);
}


function clearTableSelection(){
    const table = $$("table");
    if (table){
        table.clearSelection();
    } 
}



function backTableBtnClick() {
    defaultFormState    ();
    clearTableSelection ();
    setBtnFilterState   ();
  
}



const backBtn = new Button({
    
    config   : {
        id       : "table-backTableBtnFilter",
        hotkey   : "Shift+Q",
        hidden   : true,  
        icon     : "icon-arrow-left", 
        click   : function(){
            backTableBtnClick();
        },
    },
    titleAttribute : "Вернуться к таблице"

   
}).minView();


export {
    backBtn
};
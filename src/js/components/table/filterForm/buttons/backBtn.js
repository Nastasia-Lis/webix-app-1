import { Action }  from  "../../../../blocks/commonFunctions.js";

import { Button }  from "../../../../viewTemplates/buttons.js";

function backTableBtnClick() {
    const filterForm     = $$("filterTableBarContainer");
   
    const tableContainer = $$("tableContainer");
    

    function setBtnFilterState(){
        const btnClass          = document.querySelector(".webix_btn-filter");
        const primaryBtnClass   = "webix-transparent-btn--primary";
        const secondaryBtnClass = "webix-transparent-btn";

        if (btnClass.classList.contains(primaryBtnClass)){
            btnClass.classList.add     (secondaryBtnClass);
            btnClass.classList.remove  (primaryBtnClass);
        }
    }
    function defaultState(){

        Action.hideItem(filterForm);
        Action.showItem(tableContainer);

        const table = $$("table");
        if (table){
            table.clearSelection();
        }
    }


    defaultState();
    setBtnFilterState();
  
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
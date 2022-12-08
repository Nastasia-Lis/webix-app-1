
import { Action }             from "../../../blocks/commonFunctions.js";
import { mediator }           from "../../../blocks/_mediator.js";
import { Filter }             from "./actions/_FilterActions.js";
 
import { createParentFilter } from "./createElements/parentFilter.js";

const primaryBtnClass   = "webix-transparent-btn--primary";
const secondaryBtnClass = "webix-transparent-btn";

function resizeContainer(width){
    const filterContainer = $$("filterTableBarContainer");

    filterContainer.config.width = width;
    filterContainer.resize();
}

function filterMinAdaptive(){
    Action.hideItem($$("tableContainer"));
    Action.hideItem($$("tree"));

    Action.showItem($$("table-backTableBtnFilter"));

    const emptySpace = 45;
    resizeContainer(window.innerWidth - emptySpace);

}

function setBtnCssState(btnClass, add, remove){
    Filter.addClass    (btnClass, add);
    Filter.removeClass (btnClass, remove);
}


let btnClass;

function setPrimaryState(filter){
    Action.hideItem ($$("table-editForm"));
    Action.showItem (filter);

    const isChildExists = filter.getChildViews();

    if(isChildExists){
        createParentFilter("filterTableForm", 3);
    }

    setBtnCssState(
        btnClass, 
        primaryBtnClass, 
        secondaryBtnClass
    );

    Action.showItem($$("filterTableBarContainer"));
}

function setSecondaryState(){
    setBtnCssState(
        btnClass, 
        secondaryBtnClass, 
        primaryBtnClass
    );
    Action.hideItem($$("filterTableForm"));
    Action.hideItem($$("filterTableBarContainer"));
}

function toolbarBtnLogic(filter){
    btnClass = document.querySelector(".webix_btn-filter");
    const isPrimaryClass = btnClass.classList.contains(primaryBtnClass);
    
    if(!isPrimaryClass){
        setPrimaryState(filter);
        mediator.linkParam(true, {"view": "filter"});
    } else {
        setSecondaryState();
        mediator.linkParam(false, "view");
    }
}     

function filterMaxAdaptive(filter, idTable){

    $$(idTable).clearSelection();

    toolbarBtnLogic(filter);
    resizeContainer(350);
}


function filterBtnClick (idTable){

    Filter.clearAll(); // clear inputs storage
    
    const filter    = $$("filterTableForm");
    const container = $$("container");

    filterMaxAdaptive(filter, idTable);
    
    const width    = container.$width;
    const minWidth = 850;

    if (width < minWidth){
        Action.hideItem($$("tree"));

        if (width < minWidth ){
            filterMinAdaptive();
        }

    } else {
        Action.hideItem($$("table-backTableBtnFilter"));
        filter.config.width = 350;
        filter.resize();
    }


   
}

export {
    filterBtnClick,
};

import { Action }                                           from "../../../blocks/commonFunctions.js";
import { setFunctionError }                                 from "../../../blocks/errors.js";

import { createParentFilter }                               from "./createElements/parentFilter.js";


const logNameFile = "tableFilter => toolbarBtnClick";

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
    resizeContainer(window.innerWidth - 45);

}

function setPrimaryBtnState(btnClass){
    try{
        btnClass.classList.add   (primaryBtnClass);
        btnClass.classList.remove(secondaryBtnClass);
    } catch (err) {
        setFunctionError(err,logNameFile,"filterMaxAdaptive => setPrimaryBtnState");
    }
}

function setSecondaryBtnState(btnClass){   
    try{   
        btnClass.classList.add(secondaryBtnClass);
        btnClass.classList.remove(primaryBtnClass);
    } catch (err) {
        setFunctionError(err,logNameFile,"filterMaxAdaptive => setSecondaryBtnState");
    }
}


function filterMaxAdaptive(filter, idTable){

    function toolbarBtnLogic(){
        const btnClass  = document.querySelector(".webix_btn-filter");

        if(!(btnClass.classList.contains(primaryBtnClass))){

            Action.hideItem($$("table-editForm"));
            Action.showItem(filter);

            if(filter.getChildViews() !== 0){
                createParentFilter("filterTableForm", 3);
            }

            setPrimaryBtnState(btnClass);

            Action.showItem($$("filterTableBarContainer"));
        } else {
            setSecondaryBtnState(btnClass);
            Action.hideItem($$("filterTableForm"));
            Action.hideItem($$("filterTableBarContainer"));

        }
    }     
 
    $$(idTable).clearSelection();

    toolbarBtnLogic();
    resizeContainer(350);
}


function filterBtnClick (idTable){

    const filter    = $$("filterTableForm");
    const container = $$("container");

    filterMaxAdaptive(filter, idTable);
   
    if (container.$width < 850){
        Action.hideItem($$("tree"));
        if (container.$width  < 850 ){
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
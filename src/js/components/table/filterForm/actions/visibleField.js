

import { Action }              from "../../../../blocks/commonFunctions.js";
import { setFunctionError }    from "../../../../blocks/errors.js";
import { Filter }              from "./_FilterActions.js";

const logNameFile = "filterForm => actions => visibleField";


const showClass   = "webix_show-content";
const hideClass   = "webix_hide-content";

let segmentBtn;
let elementClass;
let condition;
let el;

function checkChild(elementClass){
    let unique = true;
    
    if (Filter.lengthItem(elementClass)){
        unique = false;
    }

    return unique;
 
}


function editStorage(){
    if (condition && el !== "selectAll"){
       
        const item = Filter.getItem(elementClass);

        if (!item){
            Filter.clearItem (elementClass); // =>  key = []
        }


        const unique = checkChild(elementClass, el);

        if (unique){
            Filter.pushInPull(elementClass, el);
            Action.showItem  (segmentBtn);
        }
     

    } else if (el !== "selectAll") {
        Filter.clearItem(elementClass);
    }

}


function showInputContainers(){
    Action.showItem($$(el));
    Action.showItem($$(el + "_container-btns"));
}

function setValueHiddenBtn(btn, value){
    if( btn ){
        btn.setValue(value);
    }
}
function setDefStateBtns(){
    const operBtn    = $$(el + "-btnFilterOperations");
    const btns       = $$(el + "_container-btns"     );

    
    setValueHiddenBtn(operBtn   , "=");
    setValueHiddenBtn(segmentBtn,  1);
    Action.hideItem  (segmentBtn    );
    Action.hideItem  (btns          );
}

function setDefStateInputs (){
    $$(el).setValue("");
    $$(el).hide();
}


function setHtmlState(add, remove){
  
    const css = ".webix_filter-inputs";
    const htmlElement = document.querySelectorAll(css);
    
    try{
        htmlElement.forEach(function (elem){
            const isClassExists = elem.classList.contains(elementClass);
     
            if (isClassExists){
                Filter.addClass   (elem, add   );
                Filter.removeClass(elem, remove);
            } 

        });

        

    } catch(err){
        setFunctionError(
            err,
            logNameFile,
            "hideHtmlEl"
        );
    }
}

function removeChilds(){
    const container       = $$(el + "_rows");
    const containerChilds = container.getChildViews();

    const values = Object.values(containerChilds);
    const childs = [];

    try{
       
        values.forEach(function(elem){
            const id = elem.config.id;

            if (id.includes("child")){
                childs.push($$(id));
            }

        });

        childs.forEach(function(el){
            Action.removeItem(el);
        });

    } catch(err) {
        setFunctionError(
            err,
            logNameFile,
            "removeChids"
        );
    }
}

function isChildExists(){
    let checkChilds = false;

    if (el !== "selectAll"){
        const container = $$(el + "_rows");
        const childs    = container.getChildViews();

        if (childs.length > 1){
            checkChilds = true;
        }
     
    }

    return checkChilds;
}

function showInput(){

    setHtmlState(showClass, hideClass);
    showInputContainers ();
    Action.enableItem   ($$("resetFilterBtn"        ));
    Action.enableItem   ($$("filterLibrarySaveBtn"  ));
    Action.hideItem     ($$("filterEmptyTempalte"   ));  
}

function hideInput(){

    if ($$(el).isVisible()){
        setHtmlState(hideClass, showClass);
    }

 

    if($$(el + "_rows")){
        removeChilds();
    }

    setDefStateInputs();
    setDefStateBtns  ();

}


function visibleField (visible, cssClass, element){
 
    condition    = visible;
    elementClass = cssClass;
    el           = element;

    segmentBtn   = $$( el + "_segmentBtn");
    
    editStorage();

    if (!isChildExists()){
        if (condition){
            showInput();
        } else {
            hideInput();
        }
    } else if (!condition){
        hideInput(); 
    }


}

export {
    visibleField
};
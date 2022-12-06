
import { Action }              from "../../../../../blocks/commonFunctions.js";
import { setFunctionError }    from "../../../../../blocks/errors.js";
import { setLogValue }         from "../../../../logBlock.js";
import { popupExec }           from "../../../../../blocks/notifications.js";

import { Button }              from "../../../../../viewTemplates/buttons.js";

import { createChildFields }   from "../childFilter.js";

import { Filter }              from "../../actions/_FilterActions.js";


const logNameFile = "createElement => contextBtn";



function getVisibleInfo(lastIndex = false){
 
    const values = Filter.getAllChilds();

    const fillElements = [];
    
    let counter = 0;

    values.forEach(function(value, i){
        if (value.length){
            counter ++;
            fillElements.push(i);
        }
    });

    if (lastIndex){
        return fillElements.pop();
    } else {
        return counter;
    }

 
}



function isLastInput(lastInput, thisInput){

    let check = false;

    if ( lastInput === thisInput){
        check = true;
    }

    return check;
}

function isLastKey(inputsKey, keys) {
 
    const result = {check : false};

    keys.forEach(function(input, i){
        const lastIndex = getVisibleInfo(true);

        if ( i === lastIndex && input == inputsKey ){
            result.check = true;
            result.index = i;
        }  
    });

    return result;
}

function prevArray(keys, currKey){

    let value;

    function loop(key){
        const indexCurrKey = keys.indexOf(key);
        let indexPrevKey   = indexCurrKey - 1;
        
        if (indexPrevKey >= 0){

            const key    = keys[indexPrevKey];
            const length = Filter.lengthItem (key);

            if (length){
                value = Filter.getItem(key);
            } else {
                loop(key);
            }
           
        } 
    }
    
    loop(currKey);

    return value;
}

function showEmptyTemplate(){
 
    if (!getVisibleInfo()){
        Action.showItem($$("filterEmptyTempalte"));
    }

}

function findInputs(id, keys){

    const result    = {};

    let isLastCollection = false;

    let inputs       = Filter.getItem(id);

    result.prevIndex = inputs.length - 2;
    result.lastIndex = inputs.length - 1;
    result.lastInput = inputs[result.lastIndex]; 
 
    if (result.prevIndex < 0){ // удален последний элемент из коллекции
        inputs = prevArray(keys, id); // найти не пустую коллекцию
     
        if (!inputs){
            isLastCollection = true;  // то была последняя коллекция в пулле
        } else {
            result.prevIndex = inputs.length - 1;
        }
    }


    if (!isLastCollection){
        result.prevInput = inputs[result.prevIndex];
    } else {
        showEmptyTemplate();
    }

    return result;
}

function hideBtn(input){
    const btn = $$(input + "_segmentBtn");
    Action.hideItem(btn);

}

function hideSegmentBtn (action, inputsKey, thisInput){
 
    const keys      = Filter.getItems();
    const checkKey  = isLastKey(inputsKey, keys);
  
    if (action === "add" && checkKey.check){
 
        const inputs     = findInputs (inputsKey, keys);
        const checkInput = isLastInput(inputs.lastInput, thisInput);
    
        if (checkInput){
            hideBtn( inputs.lastInput );
        }
 

    } else if (action === "remove" && checkKey.check){
 
        const inputs     = findInputs (inputsKey, keys);
        const checkInput = isLastInput(inputs.lastInput, thisInput);

        if (checkInput){
            hideBtn( inputs.prevInput );
        }
   
    }
}

function hideHtmlEl(id){
    const idContainer = $$(id + "_filter_rows");
    const showClass   = "webix_show-content";
    const hideClass   = "webix_hide-content";

    const childs = idContainer.getChildViews();

    if (childs.length == 1){
        const div = idContainer.getNode();
       
        Filter.removeClass (div, showClass);
        Filter.addClass    (div, hideClass);

    }

}

function hideMainInput(thisInput, mainInput){
    const btnOperations = $$(thisInput + "-btnFilterOperations");

    try{
        mainInput.forEach(function(el){
            Action.hideItem(el);
        });

        btnOperations.setValue(" = ");

    } catch(err){ 
        setFunctionError(
            err, 
            logNameFile, 
            "contextBtn remove => hideMainInput"
        );
    }
}




function clickContextBtnParent (id, el){

    const thisInput  = el.id + "_filter";
    const segmentBtn = $$(thisInput + "_segmentBtn");       
    
    function removeInput (){

        const container  = $$(thisInput).getParentView();
        const mainInput  = container.getChildViews();
     
        hideMainInput       (thisInput, mainInput);

        hideHtmlEl          (el.id);

        hideSegmentBtn      ("remove", el.id, thisInput);

        Filter.removeItemChild(el.id, thisInput);

        showEmptyTemplate   ();
        setLogValue         ("success", "Поле удалено"); 

    }

    function addInput (){
    
        const idChild = createChildFields (el);
 
        hideSegmentBtn ("add", el.id, idChild);
        Action.showItem(segmentBtn);
     
    }


    if ( id === "add" ){
        addInput();
        
    } else if (id === "remove"){

        popupExec("Поле фильтра будет удалено").then(
            function(){
                removeInput ();
                Action.hideItem(segmentBtn);
                
            }
        );
    }
}


function returnThisInput(thisElem){
    const master    = thisElem.config.master;
    const index     = master.indexOf("_contextMenuFilter");
    const thisInput = master.slice(0, index);

    return thisInput;
}



function returnInputPosition(id, thisContainer){
    
    const parentInput  = $$(id + "_filter");
    const isVisibleParent = parentInput.isVisible();

    const item = Filter.getItem(id);

    let childPosition = 0;

    item.forEach(function(input, i){
        const inputContainer = input + "-container";

        if (inputContainer === thisContainer){
            childPosition = i + 1;
        }
    });

    if (!isVisibleParent){
        childPosition++;
    }

    return childPosition;
}



let thisInput;
let thisContainer;
let element;
 
function addChild(){
    const segmentBtn = $$(thisInput  + "_segmentBtn");

    const childPosition = returnInputPosition(
        element.id, 
        thisContainer
    );

    const idChild = createChildFields (element, childPosition);
    hideSegmentBtn  ("add", element.id, idChild);
    Action.showItem (segmentBtn);
}


function removeInput(){
    hideSegmentBtn          ("remove", element.id    ,thisInput);
    Filter.removeItemChild  (element.id, thisInput);
    Action.removeItem       ( $$(thisContainer));
    showEmptyTemplate       ();

    setLogValue             ("success", "Поле удалено"); 

}


function clickContextBtnChild(id, el, thisElem){

    element       = el;
    thisInput     = returnThisInput(thisElem);
    thisContainer = thisInput + "-container";


    if ( id == "add" ){

        addChild();
     
    } else if (id === "remove"){
     
        popupExec("Поле фильтра будет удалено").then(
            function(res){
  
                if(res){
                    removeInput();
                }

            }
        );
    }
}



function returnActions(){
    const actions = [
        {   id      : "add",   
            value   : "Добавить поле", 
            icon    : "icon-plus",
        },
        {   id      : "remove", 
            value   : "Удалить поле", 
            icon    : "icon-trash"
        }
    ];


    return actions;
}

function createContextBtn (el, id, isChild){
  
    const popup = {
        view: 'contextmenu',
        css :"webix_contextmenu",
        data: returnActions(),
        on  :{
            onMenuItemClick:function(idClick){
                if (isChild){
                    clickContextBtnChild (idClick, el, this);
                } else {
                    clickContextBtnParent(idClick, el); 
                }
               
            },
         
        }
    };

    const contextBtn = new Button({
    
        config   : {
            id       :  id + "_contextMenuFilter",
            icon     : 'wxi-dots',
            width    : 40,
            inputHeight:38,
            popup       : popup,
        },
        titleAttribute : "Добавить/удалить поле",
        css            : "webix_filterBtns",
    
       
    }).minView();


    return contextBtn;       
}


export {
    createContextBtn
};
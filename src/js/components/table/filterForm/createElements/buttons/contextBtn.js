
import { Action }                                           from "../../../../../blocks/commonFunctions.js";
import { setFunctionError }                                 from "../../../../../blocks/errors.js";
import { setLogValue }                                      from "../../../../logBlock.js";

import { popupExec }                                        from "../../../../../blocks/notifications.js";

import { addClass, removeClass, visibleInputs }             from "../../common.js";

import { createChildFields }                                from "../childFilter.js";




const logNameFile = "createElement => contextBtn";


function getVisibleInfo(lastIndex = false){
    const values        = Object.values(visibleInputs);
    const fillElements  = [];
    
    let counter         = 0;

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

function showEmptyTemplate() {

    if (!getVisibleInfo()){
        Action.showItem($$("filterEmptyTempalte"));
    }

}


function removeInStorage(el,thisInput){
    visibleInputs[el.id].forEach(function(id,i){
        if (id == thisInput){
            visibleInputs[el.id].splice(i, 1);
        }
    });

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


function findInputs(id, keys){
    const result    = {};

    let inputs       =  visibleInputs[id];
    result.prevIndex = inputs.length - 2;
    result.lastIndex = inputs.length - 1;
    result.lastInput = inputs[result.lastIndex]; 

    if (result.prevIndex < 0){ // удален последний элемент из коллекции

        keys.forEach(function(key,i){

            if ( key == id && i-1 >= 0){ // данная коллекция
                inputs = visibleInputs[keys[i-1]];

            }
           
        });

        result.prevIndex = inputs.length - 1;

    }
   
    result.prevInput = inputs[result.prevIndex];

    return result;
}

function hideBtn(input){
    const btn = $$(input + "_segmentBtn");
    Action.hideItem(btn);

}

function hideSegmentBtn (action, inputsKey, thisInput){
    const keys     = Object.keys(visibleInputs);
    const checkKey = isLastKey(inputsKey, keys);

    if (action === "add" && checkKey.check){
 
        const inputs     = findInputs (inputsKey);
  
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


// function hideLastSegmentBtn(inputsKey, thisInput, childActionRemove = false){

//     const keys  = Object.keys(visibleInputs);

//     function hideBtn(id, index){
//         const inputs    = visibleInputs[id];
//         const lastIndex = inputs.length - 1;
//         const prevIndex = inputs.length - 2;

//         const lastInput   = inputs[lastIndex]; 
//         const prevInput   = inputs[prevIndex];
     
//         function getPrevCollection(){
        
//             const key        = keys[index] || keys[index - 1];
//             const collection = visibleInputs[key];
//             const length     = collection.length;
//             const input      = collection[length - 1]; 

//             return input;
//         }

//         function hide(condition, input){
         
//             if ( condition ){
//                 input = getPrevCollection(); 
//             }
       
//             const btn = $$(input + "_segmentBtn");
//             Action.hideItem(btn);
        
//         }

//         if ( isLastInput(lastInput, thisInput) ){
     
//             if (childActionRemove){
//                 hide (prevIndex > 0  , prevInput);
//             } else {
//                 hide (lastIndex === 0, lastInput);
           
//             }
      
//         }

//     }

//     keys.forEach(function(input, i){
//         const lastIndex = getVisibleInfo(true);
//         if ( i === lastIndex && input == inputsKey ){
//             hideBtn(input, i);
//         }  
//     });

// }

function hideHtmlEl(id){
    const idContainer = $$(id + "_filter_rows");
    const showClass   = "webix_show-content";
    const hideClass   = "webix_hide-content";

    const childs = idContainer.getChildViews();

    if (childs.length == 1){
        const div = idContainer.getNode();
       
        removeClass (div, showClass);
        addClass    (div, hideClass);

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
        const mainInput  = container    .getChildViews();
       
        hideMainInput       (thisInput, mainInput);
        hideHtmlEl          (el.id);
        hideSegmentBtn      ("remove", el.id, thisInput);
     //   hideLastSegmentBtn  (el.id, thisInput);
        removeInStorage     (el,    thisInput);
    
        showEmptyTemplate   ();
        setLogValue         ("success", "Поле удалено"); 

    }

    function addInput (){
        const idChild = createChildFields (el);
            hideSegmentBtn ("add", el.id, idChild);
        //hideLastSegmentBtn(el.id, idChild);
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
    const parentInput   = $$(id + "_filter");

    let childPosition  = 0;

    visibleInputs[id].forEach(function(input, i){

        const inputContainer = input + "-container";

        if (inputContainer === thisContainer){
            childPosition = i + 1;
        }
    });

    if ( !(parentInput.isVisible()) ){
        childPosition++;
    }

    return childPosition;
}

function clickContextBtnChild(id, el, thisElem){

    const thisInput     = returnThisInput(thisElem);
    const thisContainer = thisInput     + "-container";
    const segmentBtn    = $$(thisInput  + "_segmentBtn");

    function addChild(){

        const childPosition = returnInputPosition(
            el.id, 
            thisContainer
        );

        const idChild = createChildFields (el, childPosition);
        hideSegmentBtn      ("add", el.id, idChild);
        Action.showItem     (segmentBtn);

    }

    function removeContainer(){

        const parent = $$(thisContainer).getParentView();
        parent.removeView($$(thisContainer));
    } 


    function removeInput(){

        hideSegmentBtn      ("remove", el.id    ,thisInput);
        removeInStorage     (el      , thisInput          );
   
        removeContainer     ();
        showEmptyTemplate   ();
        setLogValue         ("success","Поле удалено"); 

    }

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



function createContextBtn (el, id, isChild){

    const contextBtn = {   
        view        : "button",
        id          :  id + "_contextMenuFilter",
        type        : "icon",
        css         : "webix_filterBtns",
        icon        : 'wxi-dots',
        inputHeight : 38,
        width       : 40,
        popup       : {
            view: 'contextmenu',
            css :"webix_contextmenu",
            data: [
                {   id      : "add",   
                    value   : "Добавить поле", 
                    icon    : "icon-plus",
                },
                {   id      : "remove", 
                    value   : "Удалить поле", 
                    icon    : "icon-trash"
                }
            ],
            on      :{
                onMenuItemClick:function(id){
                    if (isChild){
                        clickContextBtnChild (id, el, this);
                    } else {
                        clickContextBtnParent(id, el); 
                    }
                   
                },
             
            }
        },
    
        on:{
            onAfterRender: function () {
                this.getInputNode().setAttribute("title","Добавить/удалить поле");
            },
        }
    
    };

    return contextBtn;       
}


export {
    createContextBtn
};
import { createContextBtn }    from "./contextBtn.js";
import { createOperationBtn }  from "./operationBtn.js";

function createBtns(element, typeField, isChild, uniqueId = null){
    let id;
    let hideAttribute = false;

    if (isChild){
        id =  element.id + "_filter-child-" + uniqueId;
    } else {
        id =  element.id + "_filter";
        hideAttribute = true;
    }


    return {
        id      : id + "_container-btns",
        hidden  : hideAttribute,
        css     : {"margin-top" : "22px!important"},
        cols    : [
            createOperationBtn (typeField, id, isChild),
            createContextBtn   (element,   id, isChild) 
        ]
    };
}

export {
    createBtns
};
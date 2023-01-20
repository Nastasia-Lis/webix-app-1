 
///////////////////////////////

// Кнопка с выбором операции и/или 

// Copyright (c) 2022 CA Expert

///////////////////////////////

import { Filter }   from "../actions/_FilterActions.js";
import { Action }   from "../../../../blocks/commonFunctions.js";

function segmentBtn(element, isChild, uniqueId){
    let id;
    let hideAttribute = false;

    const idEl = element.id + "_filter";

    if (isChild){
        id = idEl + "-child-" + uniqueId;
    } else {
        id            = idEl;
        hideAttribute = true;
    }

    return {
        view    : "segmented", 
        id      : id + "_segmentBtn",
        hidden  : hideAttribute,
        value   : 1, 
        options : [
            { "id" : "1", "value" : "и" }, 
            { "id" : "2", "value" : "или" }, 
        ],
        on:{
            onChange:function(v){
                Filter.setStateToStorage();
                if (Filter.getActiveTemplate()){
                    Action.showItem($$("templateInfo"));
                }
            }
        }
    };
}

export {
    segmentBtn
};

import { visibleInputs }    from "../common.js";
import { field }            from "../createElements/field.js";
import { createBtns }       from "../createElements/buttons/_layoutBtns.js";
import { segmentBtn }       from "../createElements/segmentBtn.js";

let element;
let elemId;
let uniqueId;
let position;
let typeField;

function addInput(){
    const containerRows = $$(elemId + "_filter" + "_rows");

    const idContainer   = elemId + "_filter-child-" + uniqueId + "-container";

    const input         = field (uniqueId, typeField, element);

    let arrPosition     = position;

    if ( !($$(elemId + "_filter").isVisible()) ){
        arrPosition = position - 1;
    } 

    if (!visibleInputs[elemId]){
        visibleInputs[elemId] = [];
       
    }
    
    visibleInputs[elemId].splice(arrPosition, 0, input.id);

    containerRows.addView(
        {   id          : idContainer,
            padding     : 5,
            positionElem: position,
            rows        : [
       
                {   id      : webix.uid(),
                    height  : 105,
                    rows    : [
                      
                        {cols : [
                           input,              
                           createBtns(element, typeField, true, uniqueId) 
                        ]},

                        segmentBtn(element, true, uniqueId),  
                    ]
                }
        ]},position
    );

}


function getTypeField(el){
    if (el.type !== "boolean"){
        typeField = el.editor;
    } else {
        typeField = "boolean";
    }
}

function getPosition(customPosition){
    if (customPosition == undefined){
        position = 1;
    } else {
        position = customPosition;
    }
}

function getIdCreatedField(){
    const  idCreateField = elemId + "_filter-child-" + uniqueId;
    return idCreateField;
}

function createChildFields (el, customPosition) {
    element  = el;
    elemId   = el.id;
    uniqueId = webix.uid();

    getPosition (customPosition);
    getTypeField(el);

    addInput    ();

    return getIdCreatedField();
}

export {
    createChildFields
};
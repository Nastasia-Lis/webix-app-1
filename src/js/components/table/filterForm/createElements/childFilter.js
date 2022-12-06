
import { field }            from "../createElements/field.js";
import { createBtns }       from "../createElements/buttons/_layoutBtns.js";
import { segmentBtn }       from "../createElements/segmentBtn.js";
import { Filter }           from "../actions/_FilterActions.js";

let element;
let elemId;
let uniqueId;
let position;
let typeField;

function returnArrPosition(){
    let arrPosition = position;
    const isInputVisible = $$(elemId + "_filter").isVisible();

    if (!isInputVisible){
        arrPosition = position - 1;
    } 

    return arrPosition;
}


function addInputToStorage(id){
    const arrPosition = returnArrPosition();
    Filter.spliceChild (elemId, arrPosition, id);
}

function setClearStorage(){
    const item = Filter.getItem (elemId);

    if ( !item ){
        Filter.clearItem (elemId);
    }

}

function returnBtns(input){
    const btns = [
       
        {   id      : webix.uid(),
            height  : 105,
            rows    : [
              
                {cols : [
                   input,              
                    createBtns(
                        element, 
                        typeField, 
                        true, 
                        uniqueId
                    ) 
                ]},

                segmentBtn(
                    element, 
                    true, 
                    uniqueId
                ),  
            ]
        }
    ];

    return btns

}

function addInputToContainer(btns){
    const containerRows = $$(elemId + "_filter_rows");
    const idContainer   = 
    elemId + "_filter-child-" + uniqueId + "-container";

    containerRows.addView(
        {   id          : idContainer,
            padding     : 5,
            positionElem: position,
            rows        : btns
        }, position
    ); 
}

function addInput(){
   
    setClearStorage();

    const input = field (
        uniqueId, 
        typeField, 
        element
    );

    addInputToStorage      (input.id);

    const btns = returnBtns(input);

    addInputToContainer    (btns);
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
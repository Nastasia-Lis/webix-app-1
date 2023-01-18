
import { Action }                   from "../../../../blocks/commonFunctions.js";
import { setFunctionError }         from "../../../../blocks/errors.js";

import { createBtns }               from "./buttons/_layoutBtns.js";
import { segmentBtn }               from "./segmentBtn.js";
import { field }                    from "../createElements/field.js";

const logNameFile = "tableFilter => createElements => parentFilter";

let parentElement;
let viewPosition;

let inputTemplate;


function returnFilter(el){
 
    if (el.type == "datetime"){
        return [
            field(false, "date", el),
            createBtns(el, "date"),  
        ];

    } 
    else if (el.type.includes("reference")) {
        return [
            field(false, "combo", el),
            createBtns(el, "combo"), 
        ];
 
    } 
    else if (el.type.includes("boolean")) {
        return [
            field(false, "boolean", el),
            createBtns(el, "combo")
        ];
    
    } 
    else if (el.type.includes("integer")) {
        return [
            field(false, "integer", el),
            createBtns(el, "integer"), 
        ];
    }
    else{

        return [ 
            field(false, "text", el),
            createBtns(el, "text"), 
        ];
    }
}


function generateElements(){
    const inputsArray = [];
    const columnsData = $$("table").getColumns(true);
    
    if (columnsData.length){
        columnsData.forEach((el) => {
            const id = el.id;

            const idFullContainer  = id + "_filter_rows";
            const idInnerContainer = id + "_filter-container";
            const cssContainer     = id + " webix_filter-inputs";
            
            const filter  =  {   
                id  : idFullContainer,
                idCol:id,
                css : cssContainer,
                rows: [
                    {   id      : idInnerContainer,
                        padding : 5,
                        rows    : [
                            
                            { cols: 
                                returnFilter(el),
                            },
                            segmentBtn(el, false),
                            
                        ]
                    }
                ]
            };

            inputsArray.push (filter);

        });

    }
    
    return inputsArray;
    

}

function createFilter(arr){

    const inputs = {
        margin  : 8,
        id      : "inputsFilter",
        css     : "webix_inputs-table-filter", 
        rows    : arr
    };

    return inputs;
}


function addInputs(inputs){

    const elem = $$(parentElement);
    
    try{
        if(elem){ 
            elem.addView(
                createFilter(inputs), 
                viewPosition
            );
        }
    } catch (err){ 
        setFunctionError(
            err,
            logNameFile,
            "addInputs"
        );
    }
}

function clearFormValidation(){
    const elem = $$(parentElement);

    try{
        if(elem){
            elem.clear();
            elem.clearValidation();
        }
    } catch (err){ 
        setFunctionError(
            err,
            logNameFile,
            "clearFormValidation"
        );
    }
}

// function enableDelBtn(){
//     const delBtn = $$("table-delBtnId");
//     try{
//         if(parentElement == "table-editForm" && delBtn ){
//             delBtn.enable();
//         }
//     } catch (err){ 
//         setFunctionError(err,logNameFile,"enableDelBtn");
//     }
// }

function createParentFilter (parentElem, positon = 1) {
    parentElement      = parentElem;
    viewPosition       = positon;

    const childs       = $$(parentElement).elements;
    const childsLength = Object.keys(childs).length;


    if(childsLength == 0 ){
        Action.removeItem($$("inputsFilter"));
        const inputs = generateElements();
        addInputs       (inputs);

    } else {
        clearFormValidation();
        Action.showItem($$("inputsFilter"));
    }

    //enableDelBtn();
    
}


export {
    createParentFilter
};
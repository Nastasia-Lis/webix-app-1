
import { getComboOptions, Action }                    from "../../../../blocks/commonFunctions.js";
import { setFunctionError }                           from "../../../../blocks/errors.js";

import { createBtns }                                 from "./buttons/_layoutBtns.js";
import { segmentBtn }                                 from "./segmentBtn.js";

const logNameFile = "tableFilter => createElements => parentFilter";

let parentElement;
let viewPosition;

let inputTemplate;

function createInputTemplate (el){
    inputTemplate = { 
        id              : el.id + "_filter",
        name            : el.id + "_filter", 
        hidden          : true,
        label           : el.label, 
        labelPosition   : "top",
        columnName      : el.id,
        on:{
            onItemClick:function(){
                $$(parentElement).clearValidation();
                $$("btnFilterSubmit").enable();
            }
        }
    };
}



function createDatepicker(){
    const elem       = inputTemplate;
    elem.view        = "datepicker";
    elem.format      = "%d.%m.%Y %H:%i:%s";
    elem.placeholder = "дд.мм.гг";
    elem.timepicker  = true;
    return elem;
}


function createCombo(findTableId){
    const elem       = inputTemplate;
    elem.view        = "combo";
    elem.placeholder = "Выберите вариант";
    elem.options     = {
        data:getComboOptions(findTableId)
    };
    return elem;
}

function createBoolCombo (){
    const elem       = inputTemplate;
    elem.view        = "combo";
    elem.placeholder = "Выберите вариант";
    elem.options     = [
        {id:1, value: "Да"},
        {id:2, value: "Нет"}
    ];
    return elem;
}

function createText (type){
    
    const elem = inputTemplate;
    elem.view  = "text";
    elem.css   = {"passing-bottom":"5px!important"};

    if        (type == "text"){
        elem.placeholder = "Введите текст";

    } else if (type == "int"){
        elem.placeholder     = "Введите число";
        elem.invalidMessage  = "Поле поддерживает только числовой формат";
        elem.validate        = function (val) {
            return !isNaN(val*1);
        };
    }
    
    return elem;
}


function returnFilter(el){

    if (el.type == "datetime"){
        return [
            createDatepicker (), 
            createBtns(el, "date"),  
        ];

    } 
    else if (el.type.includes("reference")) {
        let findTableId = el.type.slice(10);

        return [
            createCombo(findTableId),
            createBtns(el, "combo"), 
        ];
 
    } 
    else if (el.type.includes("boolean")) {
        return [
            createBoolCombo(),
            createBtns(el, "combo")
        ];
    
    } 
    else if (el.type.includes("integer")) {
        return [
            createText ("int"),
            createBtns(el, "integer"), 
        ];
    }
    else{

        return [ 
            createText ("text"),
            createBtns(el, "text"), 
        ];
    }
}


function generateElements(){
    const inputsArray = [];
    const columnsData = $$("table").getColumns(true);
    try{
        columnsData.forEach((el, i) => {
            const id = el.id;

            createInputTemplate (el);

            const idFullContainer  = id + "_filter_rows";
            const idInnerContainer = id + "_filter-container";
            const cssContainer     = id + " webix_filter-inputs";
        
            const filter  =  {   
                id  : idFullContainer,
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

        return inputsArray;
    } catch (err){ 
        setFunctionError(
            err,
            logNameFile,
            "generateElements"
        );
    }

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

function enableDelBtn(){
    const delBtn = $$("table-delBtnId");
    try{
        if(parentElement == "table-editForm" && delBtn ){
            delBtn.enable();
        }
    } catch (err){ 
        setFunctionError(err,logNameFile,"enableDelBtn");
    }
}

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

    enableDelBtn();
    
}


export {
    createParentFilter
};
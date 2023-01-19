///////////////////////////////

// Применение фильтра

// Copyright (c) 2022 CA Expert

/////////////////////////////// 


import { setLogValue }          from '../../../logBlock.js';
import { setFunctionError }     from "../../../../blocks/errors.js";
import { createDynamicElems }   from '../dynamicElements/_layout.js';
import { Action }               from '../../../../blocks/commonFunctions.js';

const logNameFile = "dashboard => createSpace => submitBtn";

let index;
let inputsArray;
let idsParam;
let findAction;


let sdtDate;
let edtDate;
let validateEmpty;

const dateArray     = [];
const compareDates  = [];



function createTime(id, type){
    const formatTime     = webix.Date.dateToStr("%H:%i:%s");
    const value          = $$(id).getValue();
    const formattedValue = " " + formatTime(value);
    try{
        if (value){
            
            if (type == "sdt"){
                sdtDate = sdtDate.concat(formattedValue);
            } else if (type == "edt"){
                edtDate = edtDate.concat(formattedValue);
            }
    
        } else {
            validateEmpty = false;
        }
    } catch (err){  
        setFunctionError(
            err,
            logNameFile,
            "createTime"
        );
    }
}

function createDate(id, type){
    try{
        if ( $$(id).getValue() !== null ){

            const value      = $$(id).getValue();
            const formatDate = webix.Date.dateToStr("%d.%m.%y");

            if (type == "sdt"){
                sdtDate = formatDate(value); 
            } else if ( type ==  "edt"){
                edtDate = formatDate(value);
            }
        
        } else {
            validateEmpty = false;
        }
    } catch (err){  
        setFunctionError(
            err,
            logNameFile,
            "createDate"
        );
    }
}

function createFilterElems(id, type){
    if (id.includes(type)){

        if (id.includes("time")){
            createTime(id, type);

        } else {
            createDate(id, type);

        }
    }
}

function enumerationElements(el){
   
    const childs = $$(el.id).getChildViews();

    childs.forEach(function(elem){
        const id = elem.config.id;
        createFilterElems(id, "sdt");
        createFilterElems(id, "edt");
    });

}


function setInputs(){
    try{
        inputsArray.forEach(function(el){
            if ( el.id.includes("container") ){
                enumerationElements(el);
            }
        });
    } catch (err){  
        setFunctionError(
            err,
            logNameFile,
            "setInputs"
        );
    }
}
function createQuery(type, val){
    dateArray.push( type + "=" + val );
    compareDates.push( val ); 
}



function getDataInputs(){
    setInputs   ();
    createQuery("sdt", sdtDate);
    createQuery("edt", edtDate);
}


function setStateBtn(index){
    try{
        const btn = $$("dashBtn" + index);
        btn.disable();
 
        setTimeout (function () {
            const node = btn.getNode();
            if (node){
                btn.enable();
            }
          
        }, 1000);
    } catch (err){  
        setFunctionError(
            err, 
            logNameFile, 
            "setStateBtn"
        );
    }
}

// const cssInvalid = "dash-filter-invalid";

// function markInvalid(input){
//     const node = input.getInputNode();
//     webix.html.addCss(node, cssInvalid);
// }

// function resetInvalidMark(childs){
//     childs.forEach(function(input){
//         const view = input.config.view;
   
//         if (view == "datepicker" ){
//             const node = input.getInputNode();
//             const css = node.classList.contains(cssInvalid);

//             if (css){
//                 webix.html.removeCss(node, cssInvalid);
//             }

//         }

//     });
// }

// function invalidTop(input, type){
//     const id = input.config.id;
//     if ( id.includes("_sdt") && type == "top"){
//         markInvalid(input);
//     }
// }

// function invalidEmpty(input, type){
//     if (type == "empty"){
//         const value = input.getValue();
//         if (!value){
//             markInvalid(input);
//         }
//     } 
// }



// function setInvalidView(type, childs){

//     childs.forEach(function(input){
//         const view = input.config.view;
       
//         if (view == "datepicker"){
//             invalidTop  (input, type);
//             invalidEmpty(input, type);
//         }

//     });
   
// }

function loadView(){
    const charts = $$("dashboard-charts");
    const parent = charts.getParentView();
    Action.removeItem(charts);
    parent.addView({
        id       : "dash-load-charts",
        template : "Загрузка..."
    }); 
}

function findInputs(arr, result){

    arr.forEach(function(el){
        const view = el.config.view;

        if (view){
            result.push(el);
        }
    });

}
function findElems(){
    const container = $$("dashboardFilterElems");
    const result = [];
    if (container){
        const elems =  container.getChildViews();

        if (elems && elems.length){
            elems.forEach(function(el){
    
                const view = el.config.view;
                if (!view || view !=="button"){
                    const childs = el.getChildViews();
                    if (childs && childs.length){
                        findInputs(childs, result);
                        
                    }
         
                }
            });
        }
       
    }

    return result;
}

function returnFormattingTime(date){
    const format = webix.Date.dateToStr("%H:%i:%s");

    return format(date);
}

function returnFormattingDate(date){
    const format = webix.Date.dateToStr("%d.%m.%y");

    return format(date);
}

function findEachTime(obj, id){
    const res = obj.time.find(elem => elem.id === id);
    return res;
}

function createFullDate(obj, resultValues){
 
    obj.date.forEach(function(el){
        const id    = el.id;
        const value = el.value;
        if (id){
            const time  = findEachTime(obj, id);

            resultValues.push(id + "=" + value + "+" + time.value);
    
        }
    });

 

}


function formattingValues(values){

    const resultValues = [];

    let emptyValues = 0;
    const dateCollection = {
        time : [],
        date : []
    };

 

    values.forEach(function(el){

        let   value  = el.getValue();
        const view   = el.config.view;

        const sentAttr = el.config.sentAttr;
        const type     = el.config.type;

        if (value){

            if (view == "datepicker"){

                if(type && type == "time"){
                    value = returnFormattingTime(value);
                    dateCollection.time.push({
                        id   : sentAttr,
                        value: value
                    });
                } else {
                    value = returnFormattingDate(value);
                    dateCollection.date.push({
                        id   : sentAttr,
                        value: value
                    });
                }  

            } else {
                resultValues.push(sentAttr + "=" + value);
            }
           
        } else {
            emptyValues ++;
        }
    
    });

    
    if (dateCollection.time.length && dateCollection.date.length){
        createFullDate(dateCollection, resultValues);
 
    }

    return {
        values     : resultValues,
        emptyValues: emptyValues
    };

}


function sentQuery (){
    const inputs = findElems();
    let values;
    let empty = 0;

    if (inputs && inputs.length){
        const result = formattingValues(inputs);
        values = result.values;
        empty  = result.emptyValues;
    }
 
    if (!empty){

        const getUrl = findAction.url + "?" + values.join("&");
    
        loadView();

        createDynamicElems(
            getUrl, 
            inputsArray,
            idsParam, 
            true
        );


    } else {
      
        //setInvalidView("empty", childs);
     
        setLogValue(
            "error", 
            "Не все поля заполнены"
        );
    }
}

function clickBtn(i, inputs, ids, action){

    index       = i;
    inputsArray = inputs;
    idsParam    = ids;
    findAction  = action;

    dateArray   .length = 0;
    compareDates.length = 0;


    sdtDate         = "";
    edtDate         = "";
    validateEmpty   = true;

    getDataInputs();
    sentQuery ();
}




export {
    clickBtn
};
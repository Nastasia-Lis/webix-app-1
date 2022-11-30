import { setLogValue }          from '../../../logBlock.js';
import { setFunctionError }     from "../../../../blocks/errors.js";
import { createDynamicElems }   from '../dynamicElements/_layout.js';
import { Action } from '../../../../blocks/commonFunctions.js';

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

const cssInvalid = "dash-filter-invalid";

function markInvalid(input){
    const node = input.getInputNode();
    webix.html.addCss(node, cssInvalid);
}

function resetInvalidMark(childs){
    childs.forEach(function(input){
        const view = input.config.view;
   
        if (view == "datepicker" ){
            const node = input.getInputNode();
            const css = node.classList.contains(cssInvalid);

            if (css){
                webix.html.removeCss(node, cssInvalid);
            }

        }

    });
}

function invalidTop(input, type){
    const id = input.config.id;
    if ( id.includes("_sdt") && type == "top"){
        markInvalid(input);
    }
}

function invalidEmpty(input, type){
    if (type == "empty"){
        const value = input.getValue();
        if (!value){
            markInvalid(input);
        }
    } 
}



function setInvalidView(type, childs){

    childs.forEach(function(input){
        const view = input.config.view;
       
        if (view == "datepicker"){
            invalidTop  (input, type);
            invalidEmpty(input, type);
        }

    });
   
}

function loadView(){
    const charts = $$("dashboard-charts");
    const parent = charts.getParentView();
    Action.removeItem(charts);
    parent.addView({
        id       : "dash-load-charts",
        template : "Загрузка..."
    }); 
}


function sentQuery (){
    const childs = 
    $$("datepicker-containersdt").getChildViews();

    if (validateEmpty){

        const formatData = webix.Date.dateToStr ("%Y/%m/%d %H:%i:%s");
        const start      = formatData (compareDates[0]);
        const end        = formatData (compareDates[1]);

        const compareValue = webix.filters.date.greater(start, end);
        
        if ( !(compareValue) || compareDates[0] == compareDates[1] ){

            const getUrl = findAction.url + "?" + dateArray.join("&");
      
            loadView();

            createDynamicElems(
                getUrl, 
                inputsArray,
                idsParam, 
                true
            );

            setStateBtn(index);
            resetInvalidMark(childs);
        } else {
            setInvalidView("top", childs);
            setLogValue(
                "error", 
                "Начало периода больше, чем конец"
            );
        }
    } else {
      
        setInvalidView("empty", childs);
     
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
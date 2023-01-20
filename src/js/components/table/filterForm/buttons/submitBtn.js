 
///////////////////////////////

// Кнопка применить фильтры

// Copyright (c) 2022 CA Expert

///////////////////////////////

import { setLogValue }       from '../../../logBlock.js';

import { setFunctionError}   from "../../../../blocks/errors.js";

import { getItemId, 
        getTable, Action }   from "../../../../blocks/commonFunctions.js";

import { ServerData }        from "../../../../blocks/getServerData.js";

import { mediator }          from "../../../../blocks/_mediator.js";

import { Button }            from "../../../../viewTemplates/buttons.js";

import { Filter }            from "../actions/_FilterActions.js";

 
const logNameFile   = "tableFilter => buttons => submitBtn";


function setLogicValue(value){
    let logic = null; 
    
    if (value == "1"){
        logic = "+and+";

    } else if (value == "2"){
        logic = "+or+";
    }

    return logic;
}


function setOperationValue(value){
    let operation;

    if (!value){
        operation =  "=";
    } else if (value === "⊆"){
        operation = "contains";
    } else if (value === "="){
        operation = "%3D";
    } else 
    {
        operation = value;
    }

    return "+" + operation + "+";
}

function setName(value){
    const itemTreeId = getItemId ();

    return itemTreeId + "." + value;
}

function isBool(name){
    const table = getTable();
    const col   = table.getColumnConfig(name);
    const type  = col.type;

    let check   = false;
  
    if (type && type === "boolean"){
        check = true;
    }

    return check;
}

function returnBoolValue(value){
    if (value == 1){
        return true;
    } else if (value == 2){
        return false;
    }
}

function isDate(value){
    if (webix.isDate(value)){
        return true;
    }
}

function setValue(name, value){

    let sentValue = "'" + value + "'";


    if (isBool(name)){
        sentValue = returnBoolValue(value);
    }

    if (isDate(value)){
    
        const format = webix.Date.dateToStr("%d.%m.%Y+%H:%i:%s");
        sentValue = format(value);
    }
 
    return sentValue;
}

function createQuery (input){
    const name      = setName           (input.name);
    const value     = setValue          (input.name, input.value);
    const logic     = setLogicValue     (input.logic);
    const operation = setOperationValue (input.operation);

    let query = name + operation + value;

    if (logic){
        query = query + logic;
    }

    return query;
}

function segmentBtnValue(input) {
 
    const segmentBtn = $$(input + "_segmentBtn");
    const isVisible  = segmentBtn.isVisible();

    let value = null;

    if (isVisible){
        value = segmentBtn.getValue();
    }

    return value;
}

 

function createValuesArray(){
    const valuesArr  = [];
    const inputs     = Filter.getAllChilds(true);

    if (inputs && inputs.length){
        inputs.forEach(function(input){
        
            const name       = $$(input).config.columnName;
            const value      = $$(input)                         .getValue();
            const operation  = $$(input + "-btnFilterOperations").getValue();
    
            const logic      = segmentBtnValue(input); 
    
            valuesArr.push ( { 
                id        : input,
                name      : name, 
                value     : value,
                operation : operation,
                logic     : logic  
            });
        });
    } 




    return valuesArr;
}


function createGetData(){
       
    const format         = "%d.%m.%Y %H:%i:%s";
    const postFormatData = webix.Date.dateToStr(format);
    const valuesArr      = createValuesArray();
    const query          = [];

    if (valuesArr && valuesArr.length){
        valuesArr.forEach(function(el){
  
            const filterEl = $$(el.id);
    
            let value      = el.value;
       
            function formattingDateValue(){
                const view = filterEl.config.view; 
                if ( view == "datepicker" ){
                    value = postFormatData(value);
                }
            }
    
            function formattingSelectValue(){
                const text = filterEl.config.text;
                if ( text && text == "Нет" ){
                    value = 0;
                }
            }
    
            if (filterEl){
                formattingDateValue ();
                formattingSelectValue();
                query.push(createQuery(el));
               
            }
    
        });
    
    } 
 
    return query;
}

function createSentQuery(){
    const query = createGetData();
    return query.join("");
}

function setConfigToTab(query){
    const data = mediator.tabs.getInfo();
    if (!data.temp){
        data.temp = {};
    }

    data.temp.queryFilter = query;

    mediator.tabs.setInfo(data);

}

function setTableConfig(table, query){
     
    table.config.filter = {
        table:  table.config.idTable,
        query:  query
    };

 

    setConfigToTab(query);

}

function setData(currTableView, data){
    const overlay = "Ничего не найдено";
    try{
        currTableView.clearAll();
        if (data.length){
            currTableView.hideOverlay(overlay);
            currTableView.parse(data);
        } else {
            currTableView.showOverlay(overlay);
        }
    } catch (err){
        setFunctionError(
            err, 
            logNameFile, 
            "setData"
        );
    }
}

function setCounterValue (reccount){
    try{
        const table   = getTable();
        const id      = table.config.id;
        const counter = $$(id+"-findElements");

       // counter.setValues(reccount.toString());
       const res = {visible:reccount}
       counter.setValues(JSON.stringify(res));
    } catch (err){
        setFunctionError(
            err, 
            logNameFile, 
            "setCounterVal"
        );
    }
}

function errorActions(){
    Filter.showApplyNotify(false);
}

function filterSubmitBtn (){
                           
 
    const isValid = $$("filterTableForm").validate();

    if (isValid){

        const currTableView = getTable();
        const query         = createSentQuery();

        setTableConfig(currTableView, query);

        new ServerData({
    
            id           : `smarts?query=${query}`,
            isFullPath   : false,
            errorActions : errorActions
           
        }).get().then(function(data){
          
            if (data){
                const reccount = data.reccount;
                const content  = data.content;

                Filter.showApplyNotify();
                setData         (currTableView, content);
                setCounterValue (reccount);
                Action.hideItem ($$("tableFilterPopup"));
        
                setLogValue(
                    "success",
                    "Фильтры успшено применены"
                );
            }
             
        });


    } else {
        setLogValue(
            "error", 
            "Не все поля формы заполнены"
        );
    }
  

}


const submitBtn = new Button({

    config   : {
        id       : "btnFilterSubmit",
        hotkey   : "Ctrl+Shift+Space",
        disabled : true,
        value    : "Применить фильтры", 
        click    : filterSubmitBtn,
    },
    titleAttribute : "Применить фильтры"


}).maxView("primary");

export{
    submitBtn
};
import { setLogValue }                      from '../../../logBlock.js';

import { setFunctionError, setAjaxError }   from "../../../../blocks/errors.js";

import { visibleInputs }                    from "../common.js";

import { getItemId, getTable, Action }      from "../../../../blocks/commonFunctions.js";

import { Button }                           from "../../../../viewTemplates/buttons.js";

const logNameFile   = "tableFilter => buttons => submitBtn";

function filterSubmitBtn (){
    
                             
    let query =[];

    
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
        if (value === "=" || !value){
            operation = "+=+";
        
        } else if (value === "!="){
            operation = "+!=+";

        } else if (value === "<"){
            operation = "+<+";
            
        } else if (value === ">"){
            operation = "+>+";

        } else if (value === "<="){
            operation = "+<=+";
    
        } else if (value === ">="){
            operation = "+>=+";
            
        } else if (value === "⊆"){
            operation = "+contains+";
        } 

        return operation;
    }

    function setName(value){
        const itemTreeId     = getItemId ();

        return itemTreeId + "." + value;
    }

    function isBool(name){
        const table = getTable();
        const col   = table.getColumnConfig(name);
        let check   = false;
        if (col.type && col.type === "boolean"){
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

    function setValue(name, value){

        let sentValue = "'" + value + "'";

        if (value == 1 || value == 2){

            if ( isBool(name) ){
                sentValue = returnBoolValue(value);
            } 
            
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

    
    function createValuesArray(){
        const keys       = Object.keys(visibleInputs);
        const keysLength = keys.length;
        const valuesArr  = [];
        let inputs       = [];


        // объединить все inputs в один массив 
        for (let i = 0; i < keysLength; i++) {   
            const key = keys[i];
            inputs = inputs.concat(visibleInputs[key]);
        }

        function segmentBtnValue(input) {
            const segmentBtn = $$(input + "_segmentBtn") ;
            let value        = null;

            if (segmentBtn.isVisible()){
                value = segmentBtn.getValue();
            }
            return value;
        }

        inputs.forEach(function(input,i){
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

        return valuesArr;
    }


    function createGetData(){
       
        const postFormatData = webix.Date.dateToStr("%d.%m.%Y %H:%i:%s");
        const valuesArr      = createValuesArray();


        valuesArr.forEach(function(el,i){
      
            let filterEl = el.id;
            let value    = el.value ;
       
            function formattingDateValue(){
                const view = $$(filterEl).config.view; 
                if ( view == "datepicker" ){
                    value = postFormatData(value);
                }
            }
 
            function formattinSelectValue(){
                const text = $$(filterEl).config.text;
                if ( text && text == "Нет" ){
                    value = 0;
                }
            }

            if ($$(filterEl)){
                formattingDateValue ();
                formattinSelectValue();
                query.push(createQuery(el));
               
            }

        });

        console.log(query)
    }

    
    if ($$("filterTableForm").validate()){
        
        createGetData();

        const currTableView = getTable();

        const fullQuery = query.join("");

        currTableView.config.filter = {
            table:  currTableView.config.idTable,
            query:  fullQuery
        };

        const queryData = webix.ajax("/init/default/api/smarts?query=" + fullQuery );

        queryData.then(function(data){
            data             = data.json();
            const reccount   = data.reccount;
            const notifyType = data.err_type;
            const notifyMsg  = data.err;

            data             = data.content;

            function setData(){
                try{
                    currTableView.clearAll();
                    if (data.length !== 0){
                        currTableView.hideOverlay("Ничего не найдено");
                        currTableView.parse(data);
                    } else {
                        currTableView.showOverlay("Ничего не найдено");
                    }
                } catch (err){
                    setFunctionError(err, logNameFile, "function filterSubmitBtn => setData");
                }
            }

            function setCounterValue (){
                try{
                    const counter = $$("table-idFilterElements");
                    counter.setValues(reccount.toString());
                } catch (err){
                    setFunctionError(err, logNameFile, "setCounterVal");
                }
            }

         
            if (notifyType == "i"){

                setData();
                setCounterValue();
                Action.hideItem($$("tableFilterPopup"));
        
                setLogValue("success","Фильтры успшено применены");
            
            } else {
                setLogValue("error",notifyMsg);
            } 
        });

        queryData.fail(function(err){
            setAjaxError(err, logNameFile, "createGetData");
        });

    } else {
        setLogValue("error", "Не все поля формы заполнены");
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
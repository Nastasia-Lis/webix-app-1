import { setLogValue }                       from '../../../logBlock.js';

import { setFunctionError, setAjaxError }    from "../../../../blocks/errors.js";

import { getItemId, getTable, Action }       from "../../../../blocks/commonFunctions.js";
import { Filter }                            from "./_FilterActions.js";

const logNameFile   = "tableFilter => buttons => resetBtn";


function setDataTable(data, table){
    const overlay = "Ничего не найдено";
    try{
        if (data.length !== 0){
            table.hideOverlay(overlay);
            table.clearAll   ();
            table.parse      (data);

        } else {
            table.clearAll   ();
            table.showOverlay(overlay);
        }
    } catch (err){
        setFunctionError(
            err,
            logNameFile,
            "setDataTable"
        );
    }
}

function setFilterCounterVal(table){
    try{
        const counter         = $$("table-findElements");
        const filterCountRows = table.count();
        const values          = {visible:filterCountRows}
        counter.setValues(JSON.stringify(values));

    } catch (err){

        setFunctionError(
            err,
            logNameFile,
            "setFilterCounterVal"
        );
    }
}

async function resetTable(){
    const itemTreeId = getItemId ();
    const table      = getTable  ();
    const query      = [
        `query=${itemTreeId}.id+%3E%3D+0&sorts=${itemTreeId}.id&limit=80&offset=0`
    ];
   
    const path       = "/init/default/api/smarts?" + query;
    const queryData  = webix.ajax(path);

     
    return await queryData.then(function(data){
        const dataErr =  data.json();
      
        data = data.json().content;

        if (dataErr.err_type == "i"){
            try{
                setDataTable (data, table);
                setFilterCounterVal(table);
                setLogValue("success", "Фильтры очищены");
                return true;
            } catch (err){
                setFunctionError(
                    err,
                    logNameFile,
                    "resetFilterBtn"
                );
            }

        } else {
            setLogValue(
                "error", 
                "resetFilterBtn ajax: " +
                dataErr.err
            );
        }
    }).fail(function(err){
        setAjaxError(
            err, 
            logNameFile,
            "resetFilterBtn"
        );
    });
}

export {
    resetTable
};
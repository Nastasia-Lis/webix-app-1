import { setLogValue }          from '../../../logBlock.js';

import { setFunctionError }     from "../../../../blocks/errors.js";

import { getItemId, getTable }  from "../../../../blocks/commonFunctions.js";
import { ServerData }           from "../../../../blocks/getServerData.js";

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
   
    return await new ServerData({
        id : `smarts?${query}`
       
    }).get().then(function(data){
    
        if (data){
    
            const content = data.content;
    
            if (content){
                table.config.filter = null;

                setDataTable        (content, table);
                setFilterCounterVal (table);
                setLogValue         ("success", "Фильтры очищены");

                return true;

            }
        }
         
    });

}

export {
    resetTable
};
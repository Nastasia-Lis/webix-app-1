
///////////////////////////////

// Автообновление данных в таблице по параметру autorefresh

// Copyright (c) 2022 CA Expert

///////////////////////////////

import { getItemData }  from './createRows.js';
import { getTable }     from '../../../../blocks/commonFunctions.js';

let interval;
const intervals = [];
 
function setIntervalConfig(type, counter){
    interval = setInterval(
        () => {
        
            const table         = getTable();
            const isAutoRefresh = table.config.autorefresh;
             
            if (isAutoRefresh){
                if( type == "dbtable" ){
                    getItemData ("table");
                } else if ( type == "tform" ){
                    getItemData ("table-view");
                }
            } else {
                clearInterval(interval);
            }
        },
        counter
    );


    intervals.push(interval);

}

function clearPastIntervals(){
    if (intervals.length){
        intervals.forEach(function(el, i){
            clearInterval(el);
            intervals.splice(i, 1);
        });
    }
}

function autorefresh (data){

    clearPastIntervals();

    const table = getTable();


    if (data.autorefresh){

        table.config.autorefresh = true;
        const name               = "userprefsOtherForm";
        const userprefsOther     = webix.storage.local.get(name);
        let counter;

        if (userprefsOther){
            counter = userprefsOther.autorefCounterOpt;
        }

        const minValue     = 15000;
        const defaultValue = 120000;
        
        if ( userprefsOther && counter !== undefined ){
            if ( counter >= minValue ){
                setIntervalConfig(data.type, counter);
                
            } else {
                setIntervalConfig(data.type, defaultValue);
            }
        }

       
    } else {
        table.config.autorefresh = false;
        
    }

 
}


export {
    autorefresh
};
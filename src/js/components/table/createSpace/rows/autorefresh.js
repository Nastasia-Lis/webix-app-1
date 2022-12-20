import { getItemData }           from './createRows.js';
import { getItemId, getTable }   from '../../../../blocks/commonFunctions.js';

let interval;
const intervals = [];
function clear(){
    clearInterval(interval); 
}
function setIntervalConfig(type, counter){
    interval = setInterval(
        () => {
        
            const table         = getTable();
            const isAutoRefresh = table.config.autorefresh;
            console.log(isAutoRefresh, getItemId(), "isAutoRefresh")
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
    


    // interval = setInterval(function(){
       
    //     const table         = getTable();
    //     const isAutoRefresh = table.config.autorefresh;
    //     console.log(isAutoRefresh, "isAutoRefresh")
    //     if (isAutoRefresh){
    //         if( type == "dbtable" ){
    //             getItemData ("table");
    //         } else if ( type == "tform" ){
    //             getItemData ("table-view");
    //         }
    //     }
   
    // }, counter );
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

        if ( userprefsOther && counter !== undefined ){
            if ( counter >= 15000 ){
                setIntervalConfig(data.type, counter);
                
            } else {
                setIntervalConfig(data.type, 120000);
            }
        }

       
    } else {
        table.config.autorefresh = false;
        
    }

 
}


export {
    autorefresh
};
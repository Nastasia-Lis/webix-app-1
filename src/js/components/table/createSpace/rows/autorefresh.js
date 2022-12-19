import { getItemData }           from './createRows.js';
import { getItemId, getTable }   from '../../../../blocks/commonFunctions.js';

let interval;

function clear(){
    clearInterval(interval); 
}
function setIntervalConfig(type, counter){
    const interval = setInterval(
        () => {
        
            const table         = getTable();
            const isAutoRefresh = table.config.autorefresh;
          //  console.log(isAutoRefresh, "isAutoRefresh")
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

function autorefresh (id, data){

    const table = getTable();


    if (data.autorefresh){
       // console.log('data')
        table.config.autorefresh = true;
        const userprefsOther     = webix.storage.local.get("userprefsOtherForm");
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


    if (!table.config.autorefresh){
    //    clearInterval(interval);
    }
 
}


export {
    autorefresh
};
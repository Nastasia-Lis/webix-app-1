import { getItemData }  from './createRows.js';

let interval;
function setIntervalConfig(type, counter){
    interval = setInterval(function(){
        if( type == "dbtable" ){
            getItemData ("table");
        } else if ( type == "tform" ){
            getItemData ("table-view");
        }
    }, counter );
}

function autorefresh (data){
 
    if (data.autorefresh){

        const userprefsOther = webix.storage.local.get("userprefsOtherForm");
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
        clearInterval(interval);
    }
}


export {
    autorefresh
};
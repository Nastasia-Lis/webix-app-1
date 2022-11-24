import { mediator }          from '../../blocks/_mediator.js';
let idsParam;

function setIntervalConfig(counter){
    setInterval(function(){
        mediator.dashboards.load(idsParam);
    },  counter );
}

function autorefresh (el, ids) {

  
    if (el.autorefresh){

        const userprefsOther = webix.storage.local.get("userprefsOtherForm");
        const counter        = userprefsOther.autorefCounterOpt;
        idsParam             = ids;

        if ( counter !== undefined ){

            if ( counter >= 15000 ){
                setIntervalConfig(counter);

            } else {
                setIntervalConfig(50000);
            }

        } else {
            setIntervalConfig(50000);
        }

       
    }
}

export {
    autorefresh
};
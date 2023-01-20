///////////////////////////////

// Автообновление дашборда по параметру autorefresh

// Copyright (c) 2022 CA Expert

///////////////////////////////


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

        const minValue     = 15000;
        const defaultValue = 50000;

        if ( counter !== undefined ){

            if ( counter >= minValue ){
                setIntervalConfig(counter);

            } else {
                setIntervalConfig(defaultValue);
            }

        } else {
            setIntervalConfig(defaultValue);
        }

       
    }
}

export {
    autorefresh
};
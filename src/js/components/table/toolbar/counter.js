 
///////////////////////////////

// Счётчик записей

// Copyright (c) 2022 CA Expert

///////////////////////////////

import { getTable }       from '../../../blocks/commonFunctions.js';

function createTemplateCounter(idEl, text){
    const view = {   
        view    : "template",
        id      : idEl,
        css     : "webix_style-template-count",
        height  : 30,
        template: function () {

            const values = $$(idEl).getValues();
            const keys   = Object.keys(values);


            if (keys.length){
                const table = getTable();
              
                const obj = JSON.parse(values);

          
                const full    = obj.full    ? obj.full    : table.config.reccount;
                const visible = obj.visible ? obj.visible : table.count();
       
                const counter = visible +  " / " + full;

                return "<div style='color:#999898;'>" + 
                        text + ": " + counter + 
                        " </div>"
                ;
                
            } else {
                return "";
            }
        }
    };

    return view;
}

export {
    createTemplateCounter
};
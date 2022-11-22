import { LoadServerData, GetFields }      from "../../blocks/globalStorage.js";
import { Action }                         from '../../blocks/commonFunctions.js';

import { createDynamicElems }             from './createSpace/dynamicElements/_layout.js';
import { createFilter }                   from './createSpace/filter/elements.js';
import { autorefresh }                    from './autorefresh.js';


let idsParam;

function getDashId ( idsParam ){
    const tree = $$("tree");
    let itemTreeId;

    if (idsParam){
        itemTreeId = idsParam;
    } else if (tree.getSelectedItem()){
        itemTreeId = tree.getSelectedItem().id;
    }

    return itemTreeId;
}


function createDashSpace (){

    const keys   = GetFields.keys;
    const values = GetFields.values;

    const itemTreeId = getDashId(idsParam);
  
    values.forEach(function(el,i){

        const fieldId = keys[i];
     
        if (el.type == "dashboard" && fieldId == itemTreeId) {
          
            const url    = el.actions.submit.url;
            const inputs = createFilter (el.inputs, el, idsParam);
         
            createDynamicElems(url, inputs,      idsParam);
            autorefresh       (el,  idsParam);
        }
    });
}

async function getFieldsData (){
    await LoadServerData.content("fields");
    createDashSpace ();
}



function createDashboard ( ids ){
    idsParam = ids;

    const scroll = $$("dashBodyScroll");
    Action.removeItem(scroll);

    getFieldsData ();
  
    
}

export {
    createDashboard
};
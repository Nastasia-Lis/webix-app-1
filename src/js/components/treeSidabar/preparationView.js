  
///////////////////////////////

// Дефолтные состояния всех компонентов

// Copyright (c) 2022 CA Expert

///////////////////////////////


import { LoadServerData, GetFields }  from "../../blocks/globalStorage.js";
import { mediator }                   from "../../blocks/_mediator.js";
import { selectElem }                 from "./selectVisualElem.js";

async function getSingleTreeItem(data) {

    await LoadServerData.content("fields");

    const keys   = GetFields.keys;
  
    if (keys){
        selectElem(data);
    }   
}

function preparationView(id){
  
    mediator.header    .defaultState();
    mediator.treeEdit  .defaultState(id);
    mediator.dashboards.defaultState();
    mediator.tables    .defaultState();
    mediator.forms     .defaultState();
    getSingleTreeItem  (id) ;
 
    
}

export{
    preparationView
};
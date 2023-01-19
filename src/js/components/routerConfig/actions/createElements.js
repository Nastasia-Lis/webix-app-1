
///////////////////////////////

// Создание компонентов

// Copyright (c) 2022 CA Expert

///////////////////////////////

import { mediator } from "../../../blocks/_mediator.js";

let specificElement;

function createDefaultWorkspace(){
    if(!specificElement){
        mediator.dashboards.create();
        mediator.tables    .create();
        mediator.forms     .create();
    }
}

function createTreeTempl(){
    if (specificElement == "treeTempl"){
        mediator.treeEdit.create();
    }
 
}

function createCp(){
    if (specificElement == "cp"){
        mediator.user_auth.create();
    }

}

function createUserprefs(){
    if (specificElement == "settings"){
        mediator.settings.create();
    }

}

function createSpecificWorkspace (){
    createTreeTempl();
    createCp();
    createUserprefs();
}


function createElements(specElem){
    specificElement = specElem;
    createDefaultWorkspace();
    createSpecificWorkspace ();
  
}

export {
    createElements 
};
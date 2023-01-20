  
///////////////////////////////

// Адаптив дерева

// Copyright (c) 2022 CA Expert

///////////////////////////////


import { setFunctionError } from "../../blocks/errors.js";


const logNameFile = "treeSidebar => adaptive";
const minWidth    = 850;
function setAdaptiveState(){
    try{
        if (window.innerWidth < minWidth ){
            $$("tree").hide();
        }
    } catch (err){
        setFunctionError(
            err, 
            logNameFile, 
            "setAdaptiveState"
        );
    }
}

export {
    setAdaptiveState
};
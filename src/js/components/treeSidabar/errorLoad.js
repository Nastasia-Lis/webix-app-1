  
///////////////////////////////

// Загрузка дерева с ошибкой

// Copyright (c) 2022 CA Expert

///////////////////////////////

import { createOverlayTemplate }  from "../../viewTemplates/loadTemplate.js";
import { Action }                 from "../../blocks/commonFunctions.js";
import { setLogValue }            from "../logBlock.js";


function setErrLoad(err){
    Action.hideItem($$("loadTreeOverlay"));
                
    const container = $$("sidebarContainer");
    const id        = "treeErrOverlay"; 

    if ( !$$(id) && container){

        const errOverlay  = createOverlayTemplate(
            id,
            "Ошибка"
        );

        container.addView(errOverlay, 0);
    }

    if (err){
        setLogValue(
            "error", 
            err.status + " " + err.statusText + " " +
            err.responseURL + " (" + err.responseText + "). " +
            "Меню не загружено sidebar => onLoadError",
            "version"
        );
    } else {
        setLogValue(
            "error", 
            "Меню не загружено sidebar => onLoadError", 
            "version"
        );
    }
}

export {
    setErrLoad
};
///////////////////////////////

// Медиатор

// Copyright (c) 2022 CA Expert

///////////////////////////////

import { Action }               from "../../blocks/commonFunctions.js";
import { header }               from "./_layout.js";
import { headerDefState }       from "./setDefaultState.js";
import { generateHeaderMenu }   from "./loadContextMenu.js";

class Header {
    constructor (){
        this.name = "tree";
    }

    create(){
        return header;
    }

    showView(){
        Action.showItem($$(this.name));   
    }

    load(data){
        generateHeaderMenu(data);
    }

    defaultState(){
        headerDefState ();
    }

}

export {
    Header
};
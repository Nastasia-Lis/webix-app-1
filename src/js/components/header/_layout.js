///////////////////////////////

// Layout всего header

// Copyright (c) 2022 CA Expert

///////////////////////////////

import { collapseBtn }          from "./collapseBtn.js";
import { logBtn }               from "./logBtn.js";
import { userContextBtn }       from "./userContextBtn.js";

const logo = {
    view        : "template",
    borderless  :true,
    css         :{"background-color":"transparent!important"},
    template    : "<img src='/init/static/images/expalogo.png' "+
        " style='height:30px; margin: 10px;'>", 
    height      : 25,
};

const search = {
    view        : "search", 
    id          : "headerSearch",
    placeholder : "Поиск (Alt+Shift+F)", 
    css         : "searchTable",
    height      : 42, 
    hotkey      : "alt+shift+f",
    maxWidth    : 250, 
    minWidth    : 40, 
    on:{
        onViewResize:function(){
            console.log(12)
        }
    }
};

const header = {
    view    : "toolbar", 
    id      : "header",
    padding : 10,
    css     : "webix_header-style",
    elements: [
        {cols: [
            collapseBtn,
            logo
        ]},
        
        {},
        search,
        logBtn,
        userContextBtn,
    ]
};

export {
    header
};
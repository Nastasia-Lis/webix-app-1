  
///////////////////////////////

// layout кнопки добавления вкладки

// Copyright (c) 2022 CA Expert

///////////////////////////////

import { Button }    from "../../viewTemplates/buttons.js";
import { mediator }  from "../../blocks/_mediator.js";


function createAddBtn(){
    const btn = new Button({
    
        config   : {
            id       : "addTabBtn",
           // hotkey   : "Ctrl+Shift+A",
            icon     : "icon-plus", //wxi-plus
            click    : function(){
                mediator.tabs.addTab();
            },
        },
        titleAttribute : "Добавить вкладку"
    
       
    }).transparentView();

    return btn;
}


export {
    createAddBtn
};
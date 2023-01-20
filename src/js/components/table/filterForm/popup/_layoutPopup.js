 
///////////////////////////////

// Layout попапа

// Copyright (c) 2022 CA Expert

///////////////////////////////

import { Popup }                from "../../../../viewTemplates/popup.js";
import { createEmptyTemplate }  from "../../../../viewTemplates/emptyTemplate.js";

import { btnLayout }            from "./_layoutButtons.js";
import { layoutTab }            from "./tabbar/_layoutTab.js";

const editFormPopup = {
    view        : "form", 
    id          : "editFormPopup",
    css         : "webix_edit-form-popup",
    borderless  : true,
    elements    : [

        { rows : [ 
            layoutTab,
    
            {height : 20},
            btnLayout
        ]},
        {}

    ],
};



function createFilterPopup() {

    const popup = new Popup({
        headline : "Редактор фильтров",
        config   : {
            id    : "popupFilterEdit",
            height  : 400,
            width   : 400,
    
        },
    
        elements : {
            rows : [
                createEmptyTemplate(
                    "Выберите нужные поля или шаблон из библиотеки"
                ),
                editFormPopup
            ]
          
        }
    });
    
    popup.createView ();
    popup.showPopup  ();

}



export {
    createFilterPopup
};

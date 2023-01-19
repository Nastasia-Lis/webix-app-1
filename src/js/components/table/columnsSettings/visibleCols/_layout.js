///////////////////////////////

// Layout попапа с настройками колонок

// Copyright (c) 2022 CA Expert

///////////////////////////////


import { Popup }                 from "../../../../viewTemplates/popup.js";

import { returnClearBtn }        from "./clearBtn.js";
import { returnMoveBtns }        from "./moveBtns.js";
import { returnSearch }          from "./serachInput.js";
import { returnListBtns }        from "./listMoveBtns.js";
import { returnSaveBtn }         from "./saveBtn.js";
import { returnAvailableList,
         returnSelectedList }    from "./createLists.js";

function genetateScrollView(idCheckboxes, inner){
    return {
        view        : "scrollview",
        css         : "webix_multivew-cell",
        borderless  : true,
        scroll      : false,
        body        : { 
            id  : idCheckboxes,
            rows: inner
        }
    };
}

function returnContent(){
    const content = { 
        cols:[
            {   
                rows:[
                    returnSearch(),

                    genetateScrollView(
                        "listContent",
                        returnAvailableList()
                    ),
                ]
            },

            {width:10},
            { rows:[
                {height:45},
                {},
                returnListBtns(),
                {}
            ]},
            {width:10},

            { rows:[
            
                {cols:[
                    returnMoveBtns(),
                    returnClearBtn(),
                ]},
                genetateScrollView(
                    "listSelectedContent",
                    returnSelectedList()
                ),
            ]},
        ]
    };

    return content;
}


function createPopup(){
       
    const popup = new Popup({
        headline : "Видимость колонок",
        config   : {
            id          : "popupVisibleCols",
            width       : 600,
            maxHeight   : 400,
        },
     

        elements : {
            rows:[
                returnContent(),

                {height:20},

                returnSaveBtn(),
            ]
          
        }
    });

    popup.createView ();
}

export {
    createPopup
};
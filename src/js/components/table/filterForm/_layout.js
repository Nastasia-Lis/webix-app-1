 
///////////////////////////////

// Layout фильтра

// Copyright (c) 2022 CA Expert

///////////////////////////////

import { buttonsFormFilter }    from "./buttons/_layoutBtn.js";
import { createEmptyTemplate }  from "../../../viewTemplates/emptyTemplate.js";
import { saveTemplateNotify }   from "./saveTemplateNotify.js";

function returnBtns(){
    const btns = [
        {   rows   : [
            {   
                margin      : 2, 
                cols        : [
                    buttonsFormFilter("filterBackTableBtn"),
                    buttonsFormFilter("formEditBtn"),
                    buttonsFormFilter("formResetBtn"),
                ],
            },
            ]
        },

        {   id   : "btns-adaptive",
            rows : [
                {  
                    margin      : 2, 
                    cols        : [
                        buttonsFormFilter("formBtnSubmit"),
                        buttonsFormFilter("formLibrarySaveBtn"),
                    ]
                },
                
            ]
        }
    ];

    return btns;
}


const filterTableForm = {
    view        : "form", 
    hidden      : true,
    id          : "filterTableForm",
    minHeight   : 350,
    scroll      : true,
    elements    : [
        {   
            css       : "webix_form-adaptive",
            rows      :  returnBtns()
        },
        {   id        : "filterEmptyTempalte",
            rows      : [
                createEmptyTemplate(
                    "Добавьте фильтры из редактора"
                )
            ],
        },
        saveTemplateNotify()

        
    ],

    rules:{
        $all:webix.rules.isNotEmpty
    },


    ready:function(){
        this.validate();
    },

};

function filterForm (){
    const form = {   
        id       : "filterTableBarContainer", 
        minWidth : 250,
        width    : 350, 
        hidden   : true, 
        rows     : [
            {   id   : "editFilterBarAdaptive", 
                rows : [
                    filterTableForm
                ]
            }
        ]
    };
    
    return form;
}

export{
    filterForm
};

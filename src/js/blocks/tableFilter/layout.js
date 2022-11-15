import { buttonsFormFilter } from "./buttons.js";
import { createEmptyTemplate } from "../../viewTemplates/emptyTemplate.js";


const filterTableForm = {
    view        : "form", 
    hidden      : true,
    id          : "filterTableForm",
    minHeight   : 350,
    scroll      : true,
    elements    : [
        {   
            css       : "webix_form-adaptive",
            rows      : [
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
            ]
        },
        {   id        : "filterEmptyTempalte",
            rows      : [
                createEmptyTemplate("Добавьте фильтры из редактора")
            ],
        }

        
    ],
    rules:{
        $all:webix.rules.isNotEmpty
    },


    ready:function(){
        this.validate();
    },

};

function filterForm (){
    return {    id      : "filterTableBarContainer", 
                minWidth: 250,
                width   : 350, 
                hidden  : true, 
                rows    : [
                    {   id  : "editFilterBarAdaptive", 
                        rows: [
                            filterTableForm
                        ]
                    }
                ]
            };
}

export{
    filterForm
};

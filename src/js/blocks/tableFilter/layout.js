import {buttonsFormFilter} from "./buttons.js";



function setAdaptiveValue(btn, adaptVal, mainVal){
    const width  = btn.$width;
   
    if (width < 120 &&  btn.config.value !== adaptVal ){
        btn.config.value = adaptVal;
        btn.refresh();
      
    } else if (width > 120 &&  btn.config.value !== mainVal ) {
        btn.config.value = mainVal;
        btn.refresh();
    }
}


const formEmptyTemplate = {   
   // id:"filterEmptyTempalte",
    css:"webix_empty-template",
    template:"Добавьте фильтры из редактора",
    borderless:true
};

const filterTableForm = {
    view        : "form", 
    hidden      : true,
    id          : "filterTableForm",
    minHeight   : 350,
   // width       : 320,
    scroll      : true,
    borderless  : true,
    elements    : [
        {   
           // minHeight : 125,
            css       : "webix_form-adaptive",
            margin    : 5,
            rows      : [
                {   margin : 5, 
                    rows   : [
                      
                    {   
                        margin      : 5, 
                        cols        : [
                            buttonsFormFilter("filterBackTableBtn"),
                            buttonsFormFilter("formEditBtn"),
                            buttonsFormFilter("formResetBtn"),
                        ],
                    },
                    ]
                },

                {   id   : "btns-adaptive",
                    css  : {"margin-top":"5px!important"},
                    rows : [
                        {  
                            margin      : 5, 
                            cols        : [
                                buttonsFormFilter("formBtnSubmit"),
                                buttonsFormFilter("formLibrarySaveBtn"),
                            ]
                        },
                        {height:10},
                        
                    ]
                }
            ]
        },
        {   minHeight :  25,
            id:"filterEmptyTempalte",
            rows: [
                formEmptyTemplate
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

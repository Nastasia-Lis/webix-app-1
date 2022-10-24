import {buttonsFormFilter} from "./buttons.js";


const formEmptyTemplate = {   
    id:"filterEmptyTempalte",
    css:"webix_empty-template",
    template:"Добавьте фильтры из редактора",
    borderless:true
};

const filterTableForm = {
    view:"form", 
    hidden:true,
    id:"filterTableForm",
    minHeight:350,
    minWidth:210,
    width: 320,
    scroll:true,
    borderless:true,
    elements:[
        {   id:"form-adaptive",
            minHeight:48,
            css:"webix_form-adaptive",
            margin:5,
            rows:[
                {   margin:5, 
                    rows:[
                      
                    {   responsive:"form-adaptive",  
                        margin:5, 
                        cols:[
                            buttonsFormFilter("filterBackTableBtn"),
                            buttonsFormFilter("formEditBtn"),
                            buttonsFormFilter("formResetBtn"),
                        ],
                    },
                    ]
                },

                {   id:"btns-adaptive",
                    css:{"margin-top":"5px!important"},
                    rows:[
                        {   responsive:"btns-adaptive", 
                            margin:5, 
                            cols:[
                                buttonsFormFilter("formBtnSubmit"),
                                buttonsFormFilter("formLibrarySaveBtn"),
                            ]
                        },
                        {height:10},
                        formEmptyTemplate
                    ]
                }
            ]
        },
    ],
    rules:{
        $all:webix.rules.isNotEmpty
    },


    ready:function(){
        this.validate();
    },

};

function filterForm (){
    return {id:"filterTableBarContainer", hidden:true, rows:[
            {id:"editFilterBarAdaptive", rows:[
                filterTableForm
            ]}
    ]};
}

export{
    filterForm
};

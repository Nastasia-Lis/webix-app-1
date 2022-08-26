import {notify,createEditFields} from "./editTableForm.js";


const filterForm =  {   
    view:"form", 
    hidden:true,
    id:"filterTableForm",
    //container:"webix__form-container", 
    minHeight:350,
    minWidth:210,
    width: 320,
    scroll:true,
    elements:[
        { 
            css:"webix_filter-headlne",
            template:"<div style ='font-size:16px!important; font-weight:600!important'>Фильтры</div>",
            height: 40,
            labelPosition:"top",
            borderless:true
        },
    
        // {rows:[
        //     { 
        //         css:"webix_filter-headlne",
        //         template:"<div style ='font-size:16px!important; font-weight:600!important'>Фильтры</div>",
        //         height: 40,
        //         labelPosition:"top",
        //         borderless:true
        //     },
            
        // ]},
        // {}
    ],
   

};

export{
    filterForm
};
import {trashBtn, showPropBtn}        from "./btnsInTable.js";
import { tableToolbar }               from "./toolbar/_layout.js"
import { propertyTemplate }           from "./formTools/viewProperty.js";
import { viewTools }                  from "./formTools/viewTools.js";

import { editTableBar }               from "./editForm/_layout.js";
import { filterForm }                 from "./filterForm/_layout.js"
import { onFuncTable }                from "./onFuncs.js";
const limitLoad   = 80;


function table (idTable, onFunc, editableParam = false) {
    return {
        view        : "datatable",
        id          : idTable,
        css         : "webix_table-style webix_header_border webix_data_border ",
        autoConfig  : true,
        editable    : editableParam,
        editaction  :"dblclick",
        minHeight   : 350,
       // height:200,
        footer      : true,
        select      : true,
        resizeColumn: true,
        sort        : [],
        offsetAttr  : limitLoad,
        on          : onFunc,
        onClick     :{
            "wxi-trash":function(event,config,html){
                trashBtn(config,idTable);
            },

            "wxi-angle-down":function(event, cell, target){
                showPropBtn (cell);
            },
            
        },
        ready:function(){ 
            const firstCol = this.getColumns()[0];
            this.markSorting(firstCol.id, "asc");
        },
    };
}

const tableContainer = {   
    id  : "tableContainer",
    rows: [
        tableToolbar ("table"),
        {   view  : "resizer",
            class : "webix_resizers"
        },
        table ("table", onFuncTable, true)
    ]
};

function returnLayoutTables(id){

    const layout = {   
        id      : id, 
        hidden  : true, 
        view    : "scrollview", 
        body    : { 
            view  : "flexlayout",
            id    : "flexlayoutTable", 
            cols  : [
                                        
                tableContainer,

                {   view  : "resizer",
                    class : "webix_resizers", 
                    id    : "tableBarResizer" 
                },
          
                editTableBar(),
                filterForm(),
                
            ]
        }
    
    };
    return layout;
}



const tableLayout =  {   
    view:"scrollview", 
    body: {
        view:"flexlayout",
        cols:[
            table ("table-view"),
    
        ]
    }
};

const hiddenResizer = {   
    view   : "resizer",
    id     : "formsTools-resizer",
    hidden : true,
    class  : "webix_resizers",
};

const formsContainer = {   
    id:"formsContainer",
    rows:[
        tableToolbar("table-view", true ),
        {   view : "resizer", 
            class: "webix_resizers"
        },
        tableLayout, 
    ]
};

const tools = {   
    id       : "formsTools",
    hidden   : true,  
    minWidth : 190, 
    rows     : [
        viewTools,
    ]
};

function returnLayoutForms(id){  
   
    const layout =  {   
        view   : "layout",
        id     : id, 
        css    : "webix_tableView",
        hidden : true,                       
        rows   : [
            {cols : [
                formsContainer, 
                hiddenResizer,
                propertyTemplate("propTableView"),
                tools,
            ]},

        
        ],


    };

    return layout;
}


export {
    returnLayoutForms,
    returnLayoutTables
};
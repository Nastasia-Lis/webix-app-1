import { Action }                     from "../../blocks/commonFunctions.js";

import { createTable }                from "./createSpace/generateTable.js";


import { table }                      from "./_layout.js";
import { onFuncTable }                from "./onFuncs.js";


import { sortTable, scrollTableLoad } from "./lazyLoad.js";
import { onResizeTable }              from "./onResize.js";
import { columnResize }               from "./onColumnResize.js";
import { setColsWidthStorage }        from "./columnsSettings/columnsWidth.js"
import { tableToolbar }               from "./toolbar/_layout.js"


// other blocks
import { editTableBar }               from "./editForm/_layout.js";
import { propertyTemplate }           from "./viewProperty.js";
import { filterForm }                 from "./filterForm/_layout.js"
import { viewTools }                  from "./viewTools.js";

import {setFunctionError}             from "../../blocks/errors.js";


const logNameFile = "table => _tableMediator";


class Tables {
    constructor (){
        this.name = "tables";
    }

    create(){
        try{
            if (!$$(this.name)){

                $$("container").addView(
                    {   id:this.name, 
                        hidden:true, 
                        view:"scrollview", 
                        body: { 
                            view:"flexlayout",
                            id:"flexlayoutTable", 
                            cols:[
                                                        
                                {   id:"tableContainer",
                                    rows:[
                                        tableToolbar ("table"),
                                        { view:"resizer",class:"webix_resizers"},
                                        table ("table", onFuncTable,true)
                                    ]
                                },
                            
                                
                               {  view:"resizer",class:"webix_resizers", id:"tableBarResizer" },
                          
                                editTableBar(),
                                filterForm(),
                                
                            ]
                        }
                    
                    },

                
                5);

                const tableElem = $$("table");
                sortTable          (tableElem);
                onResizeTable      (tableElem);
                scrollTableLoad    (tableElem);
                setColsWidthStorage(tableElem);
                columnResize       (tableElem);
            }
        } catch (err){
            setFunctionError(err,logNameFile,"createTables");
        }
    }

    showView(){
        Action.showItem($$(this.name));   
    }

    load(id){
        createTable("table", id);
    }

}


class Forms {
    constructor (){
        this.name = "forms";
    }

    create(){
        try{
            if (!$$(this.name)){
                $$("container").addView(
                    {   view:"layout",
                        id:this.name, 
                        css:"webix_tableView",
                        hidden:true,                       
                        rows:[
                            {cols:[
                                {id:"formsContainer",rows:[
                                    tableToolbar("table-view", true ),
                                    { view:"resizer",class:"webix_resizers",},
                                    
                                    {   view:"scrollview", 
                                        body: {
                                            view:"flexlayout",
                                            cols:[
                                                table ("table-view"),
                                        
                                            ]
                                        }
                                    }, 
                                ]}, 

                                { view:"resizer",id:"formsTools-resizer",hidden:true,class:"webix_resizers",},
                                propertyTemplate("propTableView"),
                                {id:"formsTools",hidden:true,  minWidth:190, rows:[
                                    viewTools,                                
                                ]},
                            ]},
                        
                         
                        ],

                        
                    },
                6);

                const tableElem = $$("table-view");

                sortTable          (tableElem);
                onResizeTable      (tableElem);
                setColsWidthStorage(tableElem);
                columnResize       (tableElem);
           
            }
        } catch (err){
            setFunctionError(err,logNameFile,"createForms");
        }
    }

    showView(){
        Action.showItem($$(this.name));   
    }

    load(id){
        createTable("table-view", id);
    }

}

export {
    Tables,
    Forms
};
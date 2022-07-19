import * as header from "./modules/header.js";
import {gridColumns,tableDataOne} from './modules/data/data.js';
import {sidebarMenu, selected, currObj} from './modules/sidebar.js';


import * as multiviewSidebar from "./modules/multiviewSidebar.js";

import * as table from "./modules/table.js";
import * as editTable from "./modules/editTable.js";
import * as toolbarTable from "./modules/toolbarTable.js";





webix.ready(function(){
    
    webix.ui({
        rows: [
            header.header(),
            { id:"mainContent", cols:[
                sidebarMenu,
                {view:"resizer"},
                {rows:[
                    toolbarTable.toolbarTable(),
                    table.table(),
                ]},
                //multiviewSidebar.multiviewSidebar(),
                {view:"resizer"},
                editTable.editTable()
                
               
                
                

            ]}
        ]


        
      
    });
    
    


    // $$("tableInfo").registerFilter(
    //     $$("textField"),  
    //     { columnId:"title" },
    //     {  
    //     getValue:function(view){
    //         return view.getValue();
    //     },
    //     setValue:function(view, value){
    //         view.setValue(value)
    //     }
    //     }
    // );

});

// $$("search").attachEvent("onTimedKeyPress",function (){ 
//     //get user input value
//     var value = this.getValue().toLowerCase(); 
//     $$("tableInfo").filter(function(obj){
//       return obj.title.toLowerCase().indexOf(value)!=-1;
// });









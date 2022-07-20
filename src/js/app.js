import * as header from "./modules/header.js";
import {gridColumns,tableDataOne} from './modules/data/data.js';
import {sidebarMenu, selected, currObj} from './modules/sidebar.js';


import * as multiviewSidebar from "./modules/multiviewSidebar.js";

import * as table from "./modules/table.js";
import {editTableBar} from "./modules/editTable.js";
import * as toolbarTable from "./modules/toolbarTable.js";





webix.ready(function(){
    
    webix.ui({
        view:"scrollview", 
        id:"scrollview", 
        scroll:"y", 
        body:{
            rows: [
                header.header(),
                {   id:"adaptive",
                    rows:[ ]
                },
                {   id:"mainContent",
                    responsive:"adaptive", 
                    cols:[
                        sidebarMenu,
                        {view:"resizer"},
                        {id:"tableContainer",rows:[
                            toolbarTable.toolbarTable(),
                            table.table(),
                        ]},
                        //multiviewSidebar.multiviewSidebar(),
                        {view:"resizer"},
                        editTableBar
                    ]}
            ]
        }


        
      
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









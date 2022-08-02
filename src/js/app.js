//import {formLogin} from "./modules/login.js";
import {tableId} from './modules/setId.js';

import * as header from "./modules/header.js";
import * as treeSidebar from "./modules/sidebar.js";
import {tableToolbar, tableTemplate} from "./treeItems/tableEdit.js";
import {editTableBar} from "./modules/editTableForm.js";


import  {dashboardLayout} from "./treeItems/dashboardView.js";
import  {tableView} from "./treeItems/tableView.js";
import  {formView} from "./treeItems/formView.js";
import  {tableEdit} from "./treeItems/tableEdit.js";
import  {formEdit} from "./treeItems/formEdit.js";


webix.ready(function(){
    

    webix.protoUI({
        name:"edittree"
    }, webix.EditAbility, webix.ui.tree);

    webix.ui({
        view:"scrollview",
                id:"layout", 
                scroll:"y", 
                body:{
                    cells: [ 
                        // {id: "userAuth", 
                        // cols: [
                        //     {},
                        //     {   rows:[
                        //             {},
                        //             formLogin,
                        //             {}
                        //         ]},
                        //     {}
                        // ]},
                        {id:"mainLayout", rows: [
                            
                            header.header(),
                            {   id:"adaptive",
                                rows:[ ]
                            },
                            {   id:"mainContent",
                                responsive:"adaptive", 
                                cols:[
                                    treeSidebar.treeSidebar(),
                                    {view:"resizer",class:"webix_resizers",},
                                    {id:"tableEdit", hidden:true, cols:[
                                        
                                        {   id:"tableContainer",
                                            rows:[
                                                tableToolbar(),
                                                tableTemplate,
                                            ]
                                        },
                                        {view:"resizer",class:"webix_resizers",},
                                            editTableBar,
                                    ]},

                                    {id:"dashboardView", hidden:true,  
                                        cols: dashboardLayout()
                                    } ,

                                    {id:"tableView",hidden:true, 
                                        rows:[
                                            //tableToolbar(),
                                            tableView
                                        ]
                                    
                                    },
                                    {id:"formEdit",hidden:true, 
                                        cols:[
                                            formEdit,
                                            {view:"resizer",class:"webix_resizers",},
                                            formEdit
                                        ]
                                    },
                                    {id:"formView",hidden:true, 
                                        cols:[
                                            formView,
                                            {view:"resizer",class:"webix_resizers",},
                                            formView
                                        ]
                                    },
                                ]
                            },
                
                        ]}
                    ],
                },

    });

   
    //Backbone.history.start();
  

});

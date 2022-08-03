//import {formLogin} from "./modules/login.js";
import {
    tableId, pagerId, searchId, exportBtn, findElementsId, formId,
    
    tableIdView, pagerIdView, searchIdView, exportBtnView, 
    findElementsIdView, formIdView
} from './modules/setId.js';


import * as header from "./modules/header.js";
import * as treeSidebar from "./modules/sidebar.js";

import  {dashboardLayout} from "./treeItems/dashboardView.js";
import  {form,elementsFormView, elementsFormEdit} from "./treeItems/formTemplate.js";
import  {tableToolbar,table, onFuncTable, onFuncTableView} from "./treeItems/tableTemplate.js";

import {editTableBar} from "./modules/editTableForm.js";

webix.ready(function(){
    webix.protoUI({
        name:"edittree"
    }, webix.EditAbility, webix.ui.tree);

    webix.ui({
        view:"scrollview",
                type:"clean",
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
                            
                            //header.header(),
                            {   id:"adaptive",
                                rows:[ ]
                            },
                            {   id:"mainContent",
                                responsive:"adaptive", 
                                cols:[
                                    
                                    {css:"webix_side-container",rows:[ 
                                        { view:"label",label:"<img src='/init/static/images/expalogo.png' style='height:30px; margin: 20px;'>", height:65 },
                                        treeSidebar.treeSidebar(),
                                    ]},
                                    
                                    //treeSidebar.treeSidebar(),
                                    {view:"resizer",class:"webix_resizers",},
                                    
                                    
                                    {rows:[
                                        header.header(),
                                        {id:"webix__none-content"},
                                        {id:"tableEdit", hidden:true, cols:[
                                            
                                            {   id:"tableContainer",
                                                rows:[
                                                    tableToolbar(pagerId, searchId, exportBtn, findElementsId, tableId ),
                                                    table (tableId, pagerId, onFuncTable)
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
                                                tableToolbar(pagerIdView, searchIdView, exportBtnView, findElementsIdView, tableIdView ),
                                                table (tableIdView, pagerIdView,onFuncTableView)
                                            ]
                                        },
                                        {id:"formEdit",hidden:true, 
                                            cols:[
                                                form(formId, elementsFormEdit),
                                                {view:"resizer",class:"webix_resizers",},
                                                form(formId, elementsFormEdit),
                                            ]
                                        },
                                        {id:"formView",hidden:true, 
                                            cols:[
                                                form(formIdView, elementsFormView),
                                                {view:"resizer",class:"webix_resizers",},
                                                form(formIdView, elementsFormView)
                                            ]
                                        },
                                    ]},
                                ]
                            },
                
                        ]}
                    ],
                },

    });

   
    //Backbone.history.start();
  

});

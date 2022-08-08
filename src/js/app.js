//import {formLogin} from "./modules/login.js";
import {
    tableId, pagerId, searchId, exportBtn, findElementsId, formId,
    
    tableIdView, pagerIdView, searchIdView, exportBtnView, 
    findElementsIdView, formIdView
} from './modules/setId.js';

import * as header from "./modules/header.js";
import {headerSidebar,treeSidebar} from "./modules/sidebar.js";

import  {dashboardLayout} from "./treeItems/dashboardView.js";
import  {form,elementsFormView, elementsFormEdit} from "./treeItems/formTemplate.js";
import  {tableToolbar,table, onFuncTable, onFuncTableView} from "./treeItems/tableTemplate.js";

import {editTableBar} from "./modules/editTableForm.js";
import {filterForm} from "./modules/filterTableBar.js";

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
                                    
                                    {id:"sideMenu",width:250,css:"webix_side-container",rows:[ 
                                        //{ view:"label",label:"<img src='/init/static/images/expalogo.png' style='height:30px; margin: 20px;'>", height:65 },
                                        headerSidebar(),
                                        treeSidebar(),
                                        {id:"sideMenuHidden", hidden:true}
                                    ]},
                                    
                                    //treeSidebar.treeSidebar(),
                                    {id:"sideMenuResizer",view:"resizer",class:"webix_resizers",},
                                    
                                    
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

                                        {id:"dashboardView", hidden:true, scroll:true,
                                            cols: dashboardLayout()
                                        } ,

                                        {id:"tableView",hidden:true, 
                                         
                                                rows:[
                                                    tableToolbar(pagerIdView, searchIdView, exportBtnView, findElementsIdView, tableIdView, true ),
                                                    table (tableIdView, pagerIdView,onFuncTableView),
                                                ],

                                            
                                        },
                                    ]},
                                ]
                            },
                
                        ]}
                    ],
                },

    });

   
    //Backbone.history.start();
  
    //webix.UIMananger.tabControl = true;

    webix.i18n.setLocale("ru-RU");   
   webix.i18n.parseFormat = "%d.%m.%Y %H:%i:%s";
    webix.i18n.setLocale();
});

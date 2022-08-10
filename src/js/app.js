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
import {propertyTemplate} from "./modules/viewPropertyTable.js";

webix.ready(function(){
    webix.protoUI({
        name:"edittree"
    }, webix.EditAbility, webix.ui.tree);


    // webix.ui({ 
    //     id:"popupTable", 
    //     view:"popup", 
    //     height:250,
    //     width:300,
    //     padding:15,
    //     scroll:true,
    //     position:"center",
    //     body:{
    //         view:"property",
    //         id:"propTable",
    //         editable:false,
    //         elements:[]
    // }});



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
                            
                            {   id:"adaptive",
                                rows:[ ]
                            },
                            
                            {   id:"mainContent",
                                responsive:"adaptive", 
                                
                                
                                cols:[
                                    
                                    {id:"sideMenu",width:250,css:"webix_side-container",rows:[ 
                                        headerSidebar(),
                                        treeSidebar(),
                                        {id:"sideMenuHidden", hidden:true}
                                    ]},
                                    
                                    {id:"sideMenuResizer",view:"resizer",class:"webix_resizers",},
                                    
                                    
                                    {rows:[
                                        header.header(),
                                        
                                        {id:"webix__none-content"},
                                        {   id:"adaptive-tableEdit",
                                        rows:[ ]
                                         },
                                         
                                        {id:"tableEdit", hidden:true, 
   
                                            cols:[
                                                
                                               {view:"scrollview", body: { view:"flexlayout", cols:[
                                                
                                               {   id:"tableContainer",
                                                    rows:[
                                                        tableToolbar(pagerId, searchId, exportBtn, findElementsId, tableId ),
                                                        { view:"resizer",class:"webix_resizers",},
                                                        table (tableId, pagerId, onFuncTable)
                                                    ]
                                                },
                                            
                                                {  view:"resizer",class:"webix_resizers",},
                                                
                                                editTableBar,]
                                            }
                                            }

                                            ]
                                        
                                        },

                                        {id:"dashboardView", hidden:true, scroll:"auto",
                                           rows: dashboardLayout()
                                        } ,

                                        {id:"tableView",hidden:true, 
                                         
                                                rows:[
                                                    tableToolbar(pagerIdView, searchIdView, exportBtnView, findElementsIdView, tableIdView, true ),
                                                    { view:"resizer",class:"webix_resizers",},
                                                    
                                                    {view:"scrollview", body:  
                                                    
                                                    {view:"flexlayout",cols:[
                                                        table (tableIdView, pagerIdView, onFuncTableView ),
                                                        { view:"resizer",class:"webix_resizers",},
                                                        propertyTemplate("propTableView")
                                                    ]}}, 
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

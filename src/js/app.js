console.log("expa 1.0.4");
import {lib} from "./modules/expalib.js";
import * as textInputClean from "./modules/textInput.js";

import {login, routes} from "./modules/login.js";
import {getStorageData} from "./modules/userSettings.js";

import {
    tableId, pagerId, searchId, exportBtn, findElementsId, formId,
    
    tableIdView, pagerIdView, searchIdView, exportBtnView, 
    findElementsIdView, formIdView
} from './modules/setId.js';

import * as header from "./modules/header.js";
import {headerSidebar,treeSidebar} from "./modules/sidebar.js";

// tree elements
import  {dashboardLayout} from "./treeItems/dashboardView.js";
import  {tableToolbar,table, onFuncTable, onFuncTableView} from "./treeItems/tableTemplate.js";
import {authCpLayout} from "./treeItems/authItems.js";

// other blocks
import {editTableBar} from "./modules/editTableForm.js";
import {logLayout} from "./modules/logBlock.js";
import {propertyTemplate} from "./modules/viewPropertyTable.js";

lib ();


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
                        {},
                        {hidden:true, id: "userAuth", 
                        cols: [
                            {},
                            {   rows:[
                                    {},
                                    login(),
                                    {}
                                ]},
                            {}
                        ]},
                        {hidden:true, id:"mainLayout", rows: [
                            
                      
                            {   id:"mainContent",
                                css:"webix_mainContent",
                                                                
                               cols:[
                                    { rows:[
                                        header.header(),
                                        {   id:"adaptive",
                                            rows:[]
                                        },
                                    
                                       {id:"container",responsive:"adaptive",cols:[
                                            treeSidebar(), 

                                            {id:"sideMenuResizer",view:"resizer",css:"webix_resizer-hide",},
                            
                                            
                                            {id:"webix__none-content"},
                                            
                                                    
                                            {id:"tables", hidden:true, view:"scrollview", body: { view:"flexlayout", cols:[
                                                
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
                                            
                                            },

                                            {id:"dashboards", hidden:true, scroll:"auto",
                                            rows: dashboardLayout()
                                            } ,

                                            {id:"forms", css:"webix_tableView",hidden:true, 
                                            
                                                    rows:[
                                                        tableToolbar(pagerIdView, searchIdView, exportBtnView, findElementsIdView, tableIdView, true ),
                                                        { view:"resizer",class:"webix_resizers",},
                                                        
                                                        {view:"scrollview", body:  
                                                        
                                                        {view:"flexlayout",cols:[
                                                            table (tableIdView, pagerIdView, onFuncTableView ),
                                                            { view:"resizer",class:"webix_resizers", id:"propResize", hidden:true},
                                                            propertyTemplate("propTableView")
                                                        ]}}, 
                                                    ],

                                                
                                            },

                                            {id:"user_auth", css:"webix_auth",hidden:true, 
                                            
                                                    rows:[
                                                        authCpLayout,
                                                        {}
                                                    ],

                                                
                                            },
                                        ]},
                                    ]}, 



                                ]
                            },
                            {view:"resizer", id:"log-resizer"},
                            logLayout
                
                        ]}
                    ],
                },

    });
    getStorageData();
    window.addEventListener('resize', function(event) {
 
        if ($$("tree").isVisible()){
            // if(window.innerWidth >= 800){
            //     $$("sideMenu").config.width = 250;
            // }
        } else {
            if(window.innerWidth <= 600){
                if($$("sideMenuResizer")){
                    $$("sideMenuResizer").hide(); 
                 }
            } 
        }


    }, true);

    Backbone.history.start();

    textInputClean.textInputClean();

    webix.extend($$(tableId), webix.ProgressBar);
    webix.extend($$(tableIdView), webix.ProgressBar);

    webix.i18n.setLocale("ru-RU");   
    webix.i18n.parseFormat = "%d.%m.%Y %H:%i:%s";
    webix.i18n.setLocale();
});




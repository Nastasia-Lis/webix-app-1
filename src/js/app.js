console.log("expa 1.0.1");

import {formLogin, checkUserLogin, getLogin} from "./modules/login.js";
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

// other blocks
import {editTableBar} from "./modules/editTableForm.js";
import {logLayout} from "./modules/logBlock.js";
import {propertyTemplate} from "./modules/viewPropertyTable.js";




webix.ready(function(){
    
    //window.location.replace('http://localhost:3000/index.html#content');
    //checkUserLogin ();
    // console.log(checkUserLogin ())
    // if (checkUserLogin ()){
    //     console.log("yes")
    // }else {
    //     console.log("no")
    // }

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
                        {id: "userAuth", 
                        cols: [
                            {},
                            {   rows:[
                                    {},
                                    formLogin,
                                    {}
                                ]},
                            {}
                        ]},
                        {id:"mainLayout", rows: [
                            
                      
                            {   id:"mainContent",
                                css:"webix_mainContent",
                                                                
                               cols:[
                                    { rows:[
                                        header.header(),
                                        {   id:"adaptive",
                                            rows:[]
                                        },
                                    
                                       {responsive:"adaptive",cols:[
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
  
    webix.extend($$(tableId), webix.ProgressBar);
    webix.extend($$(tableIdView), webix.ProgressBar);

    webix.i18n.setLocale("ru-RU");   
    webix.i18n.parseFormat = "%d.%m.%Y %H:%i:%s";
    webix.i18n.setLocale();
});




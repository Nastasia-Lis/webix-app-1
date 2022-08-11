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

function adaptiveResizers (){
    //console.log($$("sideMenu").getParentView().config.id); 

}



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
                                rows:[]
                            },
                            
                            {   id:"mainContent",
                                responsive:"adaptive", 
                                                                
                                cols:[
                                    {id:"sideMenu",width:250,css:"webix_side-container",rows:[ 
                                        headerSidebar(),
                                        treeSidebar(),
                                    ]},
                                    
                                    {id:"sideMenuResizer",view:"resizer",css:"webix_resizer-hide",},
                                    
                                    
                                    {rows:[
                                        header.header(),
                                        
                                        
                                        {id:"webix__none-content"},
                                        

                                        {   id:"adaptive-tableEdit",
                                        rows:[ ]
                                         },
                                         
                                        {id:"tables", hidden:true, 
   
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

    window.addEventListener('resize', function(event) {
 
        if ($$("tree").isVisible()){
            if(window.innerWidth >= 800){
                $$("sideMenu").config.width = 250;
            }
        } else {
            if(window.innerWidth >= 800){
                
                if($$("sideMenuHidden")){

                } else {
                    $$("sideMenu").config.width = 55;
                    $$("sideMenu").addView({id:"sideMenuHidden"}, 3);
                }

            } else  if(window.innerWidth <= 600){
                if($$("sideMenuHidden")){
                    $$("sideMenu").removeView($$("sideMenuHidden"));
                } 
                if($$("sideMenuResizer")){
                    $$("sideMenuResizer").hide(); 
                 }
                
            }
        }


    }, true);
   
    //Backbone.history.start();
  
    //webix.UIMananger.tabControl = true;
    adaptiveResizers ();
    webix.i18n.setLocale("ru-RU");   
   webix.i18n.parseFormat = "%d.%m.%Y %H:%i:%s";
    webix.i18n.setLocale();
});




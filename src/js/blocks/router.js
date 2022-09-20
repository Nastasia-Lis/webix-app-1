import {lib} from "../expalib.js";

lib ();
// tree elements
import  {dashboardLayout} from "../components/dashboard.js";
import  {tableToolbar,table, onFuncTable} from "../components/table.js";
import {authCpLayout} from "../components/authSettings.js";
import {userprefsLayout} from "../components/userprefs.js";
 
// other blocks
import {editTableBar} from "./editTableForm.js";
import {propertyTemplate} from "./viewPropertyTable.js";
import {filterForm} from "./filterTableForm.js";
import {editTreeLayout,contextMenu} from "../components/editTree.js";
import {catchErrorTemplate,ajaxErrorTemplate,setLogValue} from "./logBlock.js";
import {getInfoEditTree} from "./content.js";
import {setStorageData} from "./storageSetting.js";


let userInfo=[];
let tableNames = [];

function createElements(specificElement){
   
    try {
        if(!specificElement){
            if (!$$("dashboards")){
                $$("container").addView(
                    {view:"layout",id:"dashboards", hidden:true, scroll:"auto",
                        rows: dashboardLayout()
                    },
                3);
            }

            if (!$$("tables")){
                $$("container").addView(
                    {id:"tables", hidden:true, view:"scrollview", body: { view:"flexlayout", cols:[
                                                    
                        {   id:"tableContainer",
                                rows:[
                                    tableToolbar ( "table-search", "table-exportBtn","table-editTableBtnId", "table-findElements","table-idFilterElements", "table","table-filterId"),
                                    { view:"resizer",class:"webix_resizers",},
                                    table ("table", onFuncTable,true)
                                ]
                            },
                        
                            {  view:"resizer",class:"webix_resizers",},
                            
                            editTableBar,
                            filterForm
                        ]
                        }
                    
                    },
                5);
            }

            if (!$$("forms")){
                $$("container").addView(
                    {view:"layout",id:"forms", css:"webix_tableView",hidden:true, 
                                                
                        rows:[
                            tableToolbar("table-view-search", "table-view-exportBtn","table-view-editTableBtnId", "table-view-findElements","table-view-idFilterElements", "table-view","table-view-filterIdView", true ),
                            { view:"resizer",class:"webix_resizers",},
                            
                            {view:"scrollview", body:  
                            
                            {view:"flexlayout",cols:[
                                table ("table-view"),
                                { view:"resizer",class:"webix_resizers", id:"propResize", hidden:true},
                                propertyTemplate("propTableView")
                            ]}}, 
                        ],

                        
                    },
                6);
            }
        }


        if (specificElement == "treeTempl"){
            if (!$$("treeTempl")){
                $$("container").addView(
                    {view:"layout",id:"treeTempl", hidden:true, scroll:"auto",
                        rows: editTreeLayout()
                    },
                4);
                webix.ui(contextMenu());
            }
        }

        if (specificElement == "cp"){
            $$("container").addView(
                {view:"layout",id:"user_auth", css:"webix_auth",hidden:true, 
                    rows:[
                        authCpLayout,
                        {}
                    ],
                }, 
            7);
        }

        if (specificElement == "userprefs"){

            $$("container").addView(
                {view:"layout",id:"userprefs", css:"webix_auth",hidden:true, 
                    rows:[
                        userprefsLayout,
                        //{}
                    ],
                }, 
            8);
        }
    } catch (error){
        console.log(error);
        catchErrorTemplate("015-004", error);
    }
    

}

function removeElements(){
    try {
        if ($$("tables")){
            $$("container").removeView($$("tables"));
        }
        if ($$("dashboards")){
            $$("container").removeView($$("dashboards"));
        }
        if ($$("forms")){
            $$("container").removeView($$("forms"));
        }
        if ($$("user_auth")){
            $$("container").removeView($$("user_auth"));
        }
    } catch (error){
        console.log(error);
        catchErrorTemplate("015-004", error);
    }
}

function getDataFields (routes, menuItem){
    return  webix.ajax("/init/default/api/whoami",{
         success:function(text, data, XmlHttpRequest){
             $$("userAuth").hide();
             $$("mainLayout").show();
             userInfo.push(data.json().content.first_name, data.json().content.username)
 
             createElements();
             webix.ajax().get("/init/default/api/fields.json",false).then(function (data) {
                 let srcTree = data.json().content;
   
                //  srcTree.treeTemplate={
                     
                //      "fields": {
                //          "id": {
                //              "type": "id",
                //              "unique": false,
                //              "notnull": false,
                //              "length": 512,
                //              "label": "Id",
                //              "comment": null,
                //              "default": "None"
                //          },
                //          "pid": {
                //              "type": "reference trees",
                //              "unique": false,
                //              "notnull": false,
                //              "length": 512,
                //              "label": "Родитель",
                //              "comment": null,
                //              "default": "None"
                //          },
                //          "owner": {
                //              "type": "reference auth_user",
                //              "unique": false,
                //              "notnull": false,
                //              "length": 512,
                //              "label": "Владелец",
                //              "comment": null,
                //              "default": "None"
                //          },
                //          "ttype": {
                //              "type": "integer",
                //              "unique": false,
                //              "notnull": false,
                //              "length": 512,
                //              "label": "Тип",
                //              "comment": "Тип записи|1=системная;2=пользовательская|Перечисление",
                //              "default": "1"
                //          },
                //          "name": {
                //              "type": "string",
                //              "unique": false,
                //              "notnull": false,
                //              "length": 100,
                //              "label": "Наименование",
                //              "comment": null,
                //              "default": ""
                //          },
                //          "descr": {
                //              "type": "string",
                //              "unique": false,
                //              "notnull": false,
                //              "length": 1000,
                //              "label": "Описание",
                //              "comment": null,
                //              "default": ""
                //          },
                //          "value": {
                //              "type": "string",
                //              "unique": false,
                //              "notnull": false,
                //              "length": 1000,
                //              "label": "Значение",
                //              "comment": null,
                //              "default": ""
                //          },
                //          "cdt": {
                //              "type": "datetime",
                //              "unique": false,
                //              "notnull": false,
                //              "length": 512,
                //              "label": "Создано",
                //              "comment": null,
                //              "default": "now"
                //          }
                //      },
                //      "singular": "Классификатор-пример",
                //      "ref_name": "name",
                //      "plural": "Классификаторы-пример",
                //      "type": "treeConf"
                     
                //  };
 
                 let obj = Object.keys(srcTree);
 
                 let dataChilds = {tables:[], forms:[], dashboards:[], treeConf:[]};
                
                 try{
                     $$("tree").unselectAll();
 
                     obj.forEach(function(data) {
 
                         if (srcTree[data].type == "treeConf" ){
 
                             dataChilds.treeConf.push({"id":data, "value":srcTree[data].plural, "type":srcTree[data].type});
                             tableNames.push({name:srcTree[data].plural , id:data}); 
                             
                         } 
             
                         if (srcTree[data].type == "dbtable"){
                             if(srcTree[data].plural){
                                 dataChilds.tables.push({"id":data, "value":srcTree[data].plural, "type":srcTree[data].type});
                                 tableNames.push({name:srcTree[data].plural , id:data});
                             } else if (srcTree[data].singular) {
                                 dataChilds.tables.push({"id":data, "value":srcTree[data].singular, "type":srcTree[data].type});
                                 tableNames.push({name:srcTree[data].singular , id:data});
                             }
         
                         } 
                         
                         if (srcTree[data].type == "tform" ){
 
                             if(srcTree[data].plural){
                                 dataChilds.forms.push({"id":data, "value":srcTree[data].plural, "type":srcTree[data].type});
                                 tableNames.push({name:srcTree[data].plural , id:data}); 
                             }else if (srcTree[data].singular) {
                                 dataChilds.forms.push({"id":data, "value":srcTree[data].singular, "type":srcTree[data].type});
                                 tableNames.push({name:srcTree[data].singular , id:data}); 
         
                             }
                             
                         } 
 
                         if (srcTree[data].type == "dashboard" ){
                     
                             if(srcTree[data].plural){
                                 dataChilds.dashboards.push({"id":data, "value":srcTree[data].plural, "type":srcTree[data].type});
                                 tableNames.push({name:srcTree[data].plural , id:data}); 
                             }else if (srcTree[data].singular) {
                                 dataChilds.dashboards.push({"id":data, "value":srcTree[data].singular, "type":srcTree[data].type});
                                 tableNames.push({name:srcTree[data].singular , id:data}); 
         
                             }
                         }   
 
                     });
                 } catch (error){
                     console.log(error);
                     catchErrorTemplate("015-000", error);
 
                 }
     
 
                 webix.ajax().get("/init/default/api/mmenu.json").then(function (data) {
                     let menu = data.json().mmenu;
                     let menuTree = [];
                    
                    //  menu.push ({
                    //      "id": 7,
                    //      "name": "sales",
                    //      "title": "Salasll",
                    //      "mtype": 2,
                    //      "ltype": 1,
                    //      "childs": [
                            
                    //      ]
                    //  }) ;

                     // single dashboard example
 
                     let dataAuth=[];
                     let dataNotAuth=[];
                     let pathPref;
 
              
                     if (window.location.host.includes("localhost:3000")){
                        pathPref = "/index.html/";
                     } else {
                        pathPref = "/init/default/spaw/";
                     }
 
                     try {
                        menu.forEach(function(el,i){
                         
                                if (el.name == "user_auth" || el.name=="userprefs" ){
                                    if (el.childs.length > 0){
                                        el.childs.forEach(function(child,i){
                                                if(child.name == "login"){
                                                    dataNotAuth.push({id:child.name,value:child.title, href:pathPref+child.name });
                                                }else if (child.name !== "logout") {
                                                    dataAuth.push({id:child.name,value:child.title, href:pathPref+child.name });
                                                }
                                                tableNames.push({name:child.title , id:child.name}); 
                                        });
                                        el.childs.forEach(function(child,i){
                                            if (child.name == "logout") {
                                            dataAuth.push({id:child.name,value:child.title, css:"webix_logout" });
                                            }
                                            tableNames.push({name:child.title , id:child.name}); 
                                        });
                                    } 
                                    
                                    if (el.childs.length <= 0){
                                        dataAuth.push({id:el.name, value:el.title, href:pathPref+el.name });
                                    }
 
 
                                } 
                                
                                //else {
                         
                                    if (el.childs.length > 0){
                                        dataChilds[el.name]=[];
                                        el.childs.forEach(function(child,i){
                                            dataChilds[el.name].push({id:child.name, value:child.title });
                                            tableNames.push({name:child.title , id:child.name}); 
                                        });
                                    }
             
                                    if (el.name.includes("delim")){

                                    } else {
                                        let singleItem;
                                        obj.forEach(function(data) {
                                            if (data==el.name){
                                                singleItem = el.title;
                                                menuTree.push({id:el.name+"-single", value:el.title, typeof:srcTree[data].type});
                                            }
                                        });
                                        if (!singleItem){
                                            if (el.title){
                                                if (el.typeof){
                                                    menuTree.push({id:el.name, value:el.title,typeof:el.typeof, data:dataChilds[el.name]});
                                                }else {
                                                    menuTree.push({id:el.name, value:el.title, data:dataChilds[el.name]});
                                                }
                                                
                                            
                                            } else {
                                                menuTree.push({id:el.name, value:"Без названия", data:dataChilds[el.name]});
                                            }
                                        }
                                    }
                            // }
 
                         });
                     
 
                         $$("tree").clearAll();
                        // menuTree.push({id:"treeTempl", value:"Классификатор-пример", data:dataChilds.treeConf});
                         $$("tree").parse(menuTree);
                         $$("button-context-menu").config.popup.data = dataAuth;
                         $$("button-context-menu").enable();
                     } catch (error){
                         console.log(error);
                         catchErrorTemplate("015-000", error);
 
                     }
                         
                 }).catch(err => {
                    console.log(err);
                    ajaxErrorTemplate("015-000",XmlHttpRequest.status,XmlHttpRequest.statusText,XmlHttpRequest.responseURL);
 
                  });
 
                 
                 $$("tree").attachEvent("onAfterSelect", function (id) {
                     routes.navigate("tree/"+id, { trigger:true }); 
                 });
              
                 
                 if (menuItem == "userprefs"){
                     $$("userprefsName").setValues(userInfo[0].toString());
        
                 }
                 if(menuItem == "cp"){
                     $$("authName").setValues(userInfo[0].toString());
                 }
  
             }).catch(err => {
                console.log(err);
                ajaxErrorTemplate("015-000",err.status,err.statusText,err.responseURL);
 
             });
         },
         error:function(text, data, XmlHttpRequest){
             routes.navigate("", { trigger:true});
             ajaxErrorTemplate("015-006",XmlHttpRequest.status,XmlHttpRequest.statusText,XmlHttpRequest.responseURL);
 
         }
     });
}

function hideAllElements (){
     try {
         $$("container").getChildViews().forEach(function(el,i){
                 if(el.config.view=="scrollview"|| el.config.view=="layout"){
                     if ($$(el.config.id).isVisible()){
                         $$(el.config.id).hide();
                     }
                 }
         });
     } catch (error){
         console.log(error);
         catchErrorTemplate("015-000", error);
 
     }
}

function router (){
    let routes= new (Backbone.Router.extend({
    
        routes:{
            "": "index" ,
            "content": "content", 
            "userprefs": "userprefs",
            "cp": "cp",
            "logout": "logout",
            "tree/:id": "tree",
            "experimental/:id":"experimental"
        },
        
        content:function(){
            try {
                getDataFields(routes).then(function (response){
      
            });
            } catch (error){
                console.log(error);
                catchErrorTemplate("015-005", error);
            }
    
        },
    
        index:function(){
            webix.ajax("/init/default/api/whoami",{
                success:function(text, data, XmlHttpRequest){
                    try {
                        Backbone.history.navigate("content", { trigger:true});
                    } catch (error){
                        console.log(error);
                        catchErrorTemplate("015-005", error);
    
                    }
                },
                error:function(text, data, XmlHttpRequest){
                    $$("mainLayout").hide();
                    $$("userAuth").show();
                    ajaxErrorTemplate("015-015",XmlHttpRequest.status,XmlHttpRequest.statusText,XmlHttpRequest.responseURL);
                }
            }).catch(error => {
                console.log(error);
                ajaxErrorTemplate("015-000",error.status,error.statusText,error.responseURL);
            });      
        }, 
        tree: function(id){
            try {
                if ($$("tree").data.order.length == 0){
                    getDataFields (routes);
                    let idTree = id;
                   
                    $$("tree").attachEvent("onAfterLoad", function (id) {
                    
                        id = idTree;
                        let parentId;
                     
                        if ($$("tree").getItem(id)){
                          
                            parentId = $$("tree").getParentId(id);
                            $$("tree").open(parentId);
                            $$("tree").select(id);
                           
                        } else {
                         
                            setTimeout(function(){
                                webix.ui({
                                    view:"popup",
                                    id:"popupNotFound",
                                    css:"webix_popup-prev-href",
                                    width:340,
                                    height:125,
                                    position:"center",
                                    body:{
                                        rows:[
                                        {rows: [ 
                                            { cols:[
                                            {template:"Что-то пошло не так...", width:250,css:"webix_template-not-found", borderless:true, height:20 },
                                            {},
                                            {
                                                view:"button",
                                                id:"buttonClosePopup",
                                                css:"webix_close-btn",
                                                type:"icon",
                                                width:35,
                                               
                                                icon: 'wxi-close',
                                                click:function(){
                                                    $$("popupNotFound").hide();
                                                }
                                            },
                                            ]},
                                            {   template:"Страница не найдена",
                                                css:"webix_template-not-found-descr", 
                                                borderless:true, 
                                                height:35 },
                                            {
                                                view:"button",
                                                css:"webix_btn-not-found-back",
                                                height:46,
                                                value:"Вернуться на главную",
                                                click:function(){
                                                    if ($$("popupNotFound")){
                                                        $$("popupNotFound").destructor();
                                                    }
                                                    
                                                    Backbone.history.navigate("content", { trigger:true});
                                                    window.location.reload();
                                                   
                                                }
                                            },
                                            {height:20}
                                        ]}]
                                        
                                    },

                                }).show();
                            }, 1500);
                        }

                        
                    });
                }

               
                
            } catch (error){
                console.log(error);
                catchErrorTemplate("015-005", error);
    
            }
        
    
        },
        
        cp: function(){
            try {
                if($$("webix__null-content")){
                    $$("container").removeView($$("webix__null-content"));
                }
    
                hideAllElements ();
    
    
                $$("webix__none-content").hide();
                if ($$("tree").data.order.length == 0){
                    getDataFields (routes,"cp");
                }
    
                if($$("user_auth")){
                    $$("user_auth").show();
                }else {
                    createElements("cp");
                    $$("user_auth").show();
    
                    if (userInfo.length > 0){
                        $$("authName").setValues(userInfo[0].toString());
                    }
                    
                }
    
                $$("tree").closeAll();
            } catch (error){
                console.log(error);
                catchErrorTemplate("015-005", error);
            }
        
        },
    
        userprefs: function(){
            try {
                if($$("webix__null-content")){
                    $$("container").removeView($$("webix__null-content"));
                }
            
                hideAllElements ();
    
                $$("webix__none-content").hide();
                if ($$("tree").data.order.length == 0){
                    getDataFields (routes,"userprefs");
                }
    
                if ($$("userprefs")){
                    $$("userprefs").show();
                } else {
                    createElements("userprefs");

                    webix.ajax().get("/init/default/api/userprefs/", {
                        success:function(text, data, XmlHttpRequest){
                            data = data.json().content;
                            if (data.err_type == "e"){
                                setLogValue("error",data.error);
                            }

                            data.forEach(function(el,i){
                                if (el.name.includes("userprefs")){
                                    $$(el.name).setValues(JSON.parse(el.prefs));
                                }
                            });
                        },
                        error:function(text, data, XmlHttpRequest){
                            ajaxErrorTemplate("016-000",XmlHttpRequest.status,XmlHttpRequest.statusText,XmlHttpRequest.responseURL);
                        }
                    }).catch(error => {
                        console.log(error);
                        ajaxErrorTemplate("016-000",error.status,error.statusText,error.responseURL);
                    });


                    $$("userprefs").show();
                    if (userInfo.length > 0){
                        $$("userprefsName").setValues(userInfo[0].toString());
                    }
                }
    
                $$("tree").closeAll();
            } catch (error){
                console.log(error);
                catchErrorTemplate("016-005", error);
            }
        
        },

        experimental: function (){
            console.log("exp");

            try {
                if($$("webix__null-content")){
                    $$("container").removeView($$("webix__null-content"));
                }
            
                hideAllElements ();
    
                $$("webix__none-content").hide();


                if ($$("tree").data.order.length == 0){
                    getDataFields (routes);
                }
    
                if($$("treeTempl")){
                    $$("treeTempl").show();
                    getInfoEditTree();
                }else {
                    createElements("treeTempl");
                    getInfoEditTree();
                    $$("treeTempl").show();
                    console.log($$("treeTempl"))
                    console.log($$("treeTempl").isVisible())
                }
    
                $$("tree").closeAll();
            } catch (error){
                console.log(error);
                catchErrorTemplate("015-005", error);
            }
        },
    
        logout: function (){
            webix.ajax().post("/init/default/logout/",{
                success:function(text, data, XmlHttpRequest){
                    try {
                        history.back();
                        removeElements();
                        $$("webix__none-content").show();
                        $$("tree").clearAll();
                        webix.storage.local.clear();
                    } catch (error){
                        console.log(error);
                        setLogValue("error","Не удалось выполнить выход");
                        webix.message({type:"error",expire:3000, text:"Не удалось выполнить выход"});
                        catchErrorTemplate("015-000", error);
                    }
                    
                },
                error:function(text, data, XmlHttpRequest){
                    setLogValue("error","Не удалось выполнить выход");
                    webix.message({type:"error",expire:3000, text:"Не удалось выполнить выход"});
                    ajaxErrorTemplate("015-006",XmlHttpRequest.status,XmlHttpRequest.statusText,XmlHttpRequest.responseURL);
    
                }
            }).catch(error => {
                console.log(error);
                ajaxErrorTemplate("015-006",error.status,error.statusText,error.responseURL);
            });
            
        }
    
    }));

    return routes;
}

export {
    router,
    createElements,
    removeElements,
    tableNames
};
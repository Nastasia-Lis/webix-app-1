import {notify} from "./editTableForm.js";
import {typeTable} from "./header.js";
import { tableId, tableIdView,editFormId,findElementsId, pagerIdView, searchIdView, exportBtnView, 
    findElementsIdView, pagerId, searchId, exportBtn} from "./setId.js";

import {lib} from "./expalib.js";
lib ();

// tree elements
import  {dashboardLayout} from "../treeItems/dashboardView.js";
import  {tableToolbar,table, onFuncTable, onFuncTableView} from "../treeItems/tableTemplate.js";
import {authCpLayout} from "../treeItems/authItems.js";

// other blocks
import {editTableBar} from "./editTableForm.js";
import {propertyTemplate} from "./viewPropertyTable.js";




let tableNames = [];
let userInfo=[];

function createElements(specificElement){

    $$("container").addView(
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
    3);
    
  
    $$("container").addView(
        {view:"layout",id:"dashboards", hidden:true, scroll:"auto",
            rows: dashboardLayout()
        },
    4);


    $$("container").addView(
        {view:"layout",id:"forms", css:"webix_tableView",hidden:true, 
                                    
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
    5);
   
    if (specificElement == "cp"){
        $$("container").addView(
            {view:"layout",id:"user_auth", css:"webix_auth",hidden:true, 
                rows:[
                    authCpLayout,
                    {}
                ],
            }, 
        6);
    }
    

}

function removeElements(){
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
}

function getDataFields (routes, menuItem){
   return  webix.ajax("/init/default/api/whoami",{
        success:function(text, data, XmlHttpRequest){
            $$("userAuth").hide();
            $$("mainLayout").show();
            userInfo = data.json();
            createElements();
            webix.ajax().get("/init/default/api/fields.json",false).then(function (data) {
                $$("tree").unselectAll();
                let srcTree = data.json().content;

                let obj = Object.keys(srcTree);
                //let actionsCheck;

                let dataChilds = {tables:[], forms:[], dashboards:[]};

                obj.forEach(function(data) {
                    if (srcTree[data].actions){
                       // actionsCheck = Object.keys(srcTree[data].actions)[0]; 
                    } 
                    
                    if (srcTree[data].type == "dbtable"){
                        if(srcTree[data].plural){
                            dataChilds.tables.push({"id":data, "value":srcTree[data].plural, "type":srcTree[data].type});
                            tableNames.push({name:srcTree[data].plural , id:data});
                        } else if (srcTree[data].singular) {
                            dataChilds.tables.push({"id":data, "value":srcTree[data].singular, "type":srcTree[data].type});
                            tableNames.push({name:srcTree[data].singular , id:data});
                        }
    
                    } else if (srcTree[data].type == "tform"){
                        if(srcTree[data].plural){
                            dataChilds.forms.push({"id":data, "value":srcTree[data].plural, "type":srcTree[data].type});
                            tableNames.push({name:srcTree[data].plural , id:data}); 
                        }else if (srcTree[data].singular) {
                            dataChilds.forms.push({"id":data, "value":srcTree[data].singular, "type":srcTree[data].type});
                            tableNames.push({name:srcTree[data].singular , id:data}); 
    
                        }
                    }  else if (srcTree[data].type == "dashboard" ){
                   
                        if(srcTree[data].plural){
                            dataChilds.dashboards.push({"id":data, "value":srcTree[data].plural, "type":srcTree[data].type});
                            tableNames.push({name:srcTree[data].plural , id:data}); 
                        }else if (srcTree[data].singular) {
                            dataChilds.dashboards.push({"id":data, "value":srcTree[data].singular, "type":srcTree[data].type});
                            tableNames.push({name:srcTree[data].singular , id:data}); 
    
                        }
                    }   
                    
                });
    
    
                webix.ajax().get("/init/default/api/mmenu.json").then(function (data) {

                    let menu = data.json().mmenu;
                    let menuTree = [];
               
                    menu.push({
                        "id": 7,
                        "name": "sales11",
                        "title": "sales11",
                        "mtype": 1,
                        "ltype": 1,
                        "typeof":"dashboard",
                        "action": "all_aa",
                        "childs": []
                    });

                    let dataAuth=[];
                    let dataNotAuth=[];
                    menu.forEach(function(el,i){
                       
                        if (el.name == "user_auth" || el.name=="userprefs" ){
                            if (el.childs.length > 0){
                                el.childs.forEach(function(child,i){
                                        if(child.name == "login"){
                                            dataNotAuth.push({id:child.name,value:child.title, href:"#"+child.name });
                                        }else if (child.name !== "logout") {
                                         dataAuth.push({id:child.name,value:child.title, href:"#"+child.name });
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
                                dataAuth.push({id:el.name, value:el.title, href:"#"+el.name });
                            }


                        } else {
                       
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
                        }

                    });

                    $$("tree").clearAll();
                   
                    $$("tree").parse(menuTree);
                    $$("button-context-menu").config.popup.data = dataAuth;
                    $$("button-context-menu").enable();
                });

                
                $$("tree").attachEvent("onAfterSelect", function (id) {
                    routes.navigate("tree/"+id, { trigger:true }); 
                });


                if (menuItem == "userprefs"){
                    let prefsFields = data.json().content.userprefs.fields;
                    let columnsData=[];
                   
                    Object.keys(prefsFields).forEach(function(data) {
                   
                        if (prefsFields[data].type == "datetime"){
                            prefsFields[data].format = webix.i18n.fullDateFormatStr;
                        }
                        prefsFields[data].id = data;
                     
                        prefsFields[data].fillspace = true;
                        prefsFields[data].header= prefsFields[data]["label"];
                        if(prefsFields[data].id == "id"){
                            prefsFields[data].hidden = true;
                        }
                        columnsData.push(prefsFields[data]);
                    });

                    $$("tables").show();
                    $$("webix__none-content").hide();

                    $$(tableId).refreshColumns(columnsData);
                    typeTable(tableId,columnsData,"userprefs");
                }
 
            });
        },
        error:function(text, data, XmlHttpRequest){
            routes.navigate("", { trigger:true});
        }
    });
}



function hideAllElements (){
    $$("container").getChildViews().forEach(function(el,i){
            if(el.config.view=="scrollview"|| el.config.view=="layout"){

                if ($$(el.config.id).isVisible()){
                    $$(el.config.id).hide();
                }

            }
    });
}


function login () {

    let routes = new (Backbone.Router.extend({
    routes:{
        "": "index" ,
        "content": "content", 
        "userprefs": "userprefs",
        "cp": "cp",
        "logout": "logout",
        "tree/:id": "tree",
    },
  
    content:function(){
        getDataFields (routes);
    },
    index:function(){
        webix.ajax("/init/default/api/whoami",{
            success:function(text, data, XmlHttpRequest){
               routes.navigate("content", { trigger:true});
            },
            error:function(text, data, XmlHttpRequest){
                $$("mainLayout").hide();
                $$("userAuth").show();
            }
        });      
    }, 
    tree: function(id){

        if ($$("tree").data.order.length == 0){
            getDataFields (routes);
            let idTree = id;
            
            $$("tree").attachEvent("onAfterLoad", function (id) {
                id = idTree;
                let parentId = $$("tree").getParentId(id);

                $$("tree").open(parentId);
                $$("tree").select(id);
            });

        }
      

    },
    
    cp: function(){
        
        if($$("webix__null-content")){
            $$("container").removeView($$("webix__null-content"));
        }

        hideAllElements ();


        $$("webix__none-content").hide();
        if ($$("tree").data.order.length == 0){
            getDataFields (routes);
        }

        if($$("user_auth")){
            $$("user_auth").show();
        }else {
            createElements("cp");
            $$("user_auth").show();
        }

        $$("tree").closeAll();
     
    },

    userprefs: function(){

        if($$("webix__null-content")){
            $$("container").removeView($$("webix__null-content"));
        }
       
        hideAllElements ();
        if ($$("tree").data.order.length == 0){
            getDataFields (routes,"userprefs");
        } else {
            if ($$(tableId)){
                $$(tableId).clearAll();
            }else if ( $$(tableIdView)){
                $$(tableIdView).clearAll();
            }
            $$("tables").show();
            $$("webix__none-content").hide();
        }
        
        $$("tree").closeAll();
     
    },

    logout: function (){

        webix.ajax().post("/init/default/logout/",{
            success:function(text, data, XmlHttpRequest){
                history.back();
                removeElements();
                $$("webix__none-content").show();
                $$("tree").clearAll();
            },
            error:function(text, data, XmlHttpRequest){
                notify ("error","Не удалось выполнить выход",true);
            }
        });
        
    }

    }));

    function getLogin(){
        $$("formAuth").validate();
        let userData = $$("formAuth").getValues();
        let loginData = [];
    
        loginData.push("un"+"="+userData.username);
        loginData.push("np"+"="+userData.password);
    
        webix.ajax("/init/default/login"+"?"+loginData.join("&"),{
            success:function(text, data, XmlHttpRequest){
                webix.ajax("/init/default/api/whoami",{
                    success:function(text, data, XmlHttpRequest){
                        routes.navigate("");
                        routes.navigate("content", { trigger:true});
                        $$('formAuth').clear();
                        window.location.reload();
                    },
                    error:function(text, data, XmlHttpRequest){
                        if ($$("formAuth").isDirty()){
                            notify ("error","Неверный логин или пароль");
                        }
                    }
                });
            },
            error:function(text, data, XmlHttpRequest){
            }
        });

    }
    
    
    return {
        view:"form",
        id:"formAuth",
        maxWidth: 300,
        borderless:true,
        elements: [
            {view:"text", label:"Логин", name:"username",invalidMessage:"Поле должно быть заполнено"  },
            {view:"text", label:"Пароль", name:"password",invalidMessage:"Поле должно быть заполнено",
            type:"password"},
            {view:"button", value: "Войти", css:"webix_primary",
            hotkey: "enter", align:"center", click:getLogin}, 
        ],
    
        rules:{
    
            "username":webix.rules.isNotEmpty,
            "password":webix.rules.isNotEmpty,
    
          },
    
    
        elementsConfig:{
            labelPosition:"top"
        }
    
    };

}






export {
    login,
    tableNames,
    createElements,
    removeElements
};
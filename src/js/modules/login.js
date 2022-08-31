import {notify} from "./editTableForm.js";
import { tableId, tableIdView,findElementsId,filterElementsId,filterId,editTableBtnId,editTableBtnIdView, searchIdView, exportBtnView, 
    findElementsIdView,filterElementsIdView,filterIdView,searchId, exportBtn} from "./setId.js";

import {lib} from "./expalib.js";
lib ();

// tree elements
import  {dashboardLayout} from "../treeItems/dashboardView.js";
import  {tableToolbar,table, onFuncTable} from "../treeItems/tableTemplate.js";
import {authCpLayout} from "../treeItems/authItems.js";
import {userprefsLayout} from "../treeItems/userprefsItems.js";

// other blocks
import {editTableBar} from "./editTableForm.js";
import {propertyTemplate} from "./viewPropertyTable.js";
import {filterForm} from "./filterTableBar.js";


let tableNames = [];
let userInfo=[];

function createElements(specificElement){
   
    
  
    $$("container").addView(
        {view:"layout",id:"dashboards", hidden:true, scroll:"auto",
            rows: dashboardLayout()
        },
    4);

    $$("container").addView(
        {id:"tables", hidden:true, view:"scrollview", body: { view:"flexlayout", cols:[
                                        
            {   id:"tableContainer",
                    rows:[
                        tableToolbar( searchId, exportBtn,editTableBtnId, findElementsId,filterElementsId, tableId,filterId),
                        { view:"resizer",class:"webix_resizers",},
                        table (tableId, onFuncTable,true)
                    ]
                },
            
                {  view:"resizer",class:"webix_resizers",},
                
                editTableBar,filterForm]
            }
        
        },
    3);

    $$("container").addView(
        {view:"layout",id:"forms", css:"webix_tableView",hidden:true, 
                                    
            rows:[
                tableToolbar(searchIdView, exportBtnView,editTableBtnIdView, findElementsIdView,filterElementsIdView, tableIdView,filterIdView, true ),
                { view:"resizer",class:"webix_resizers",},
                
                {view:"scrollview", body:  
                
                {view:"flexlayout",cols:[
                    table (tableIdView),
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

    if (specificElement == "userprefs"){
        $$("container").addView(
            {view:"layout",id:"userprefs", css:"webix_auth",hidden:true, 
                rows:[
                    userprefsLayout,
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
            userInfo.push(data.json().content.first_name, data.json().content.username)

            createElements();
            webix.ajax().get("/init/default/api/fields.json",false).then(function (data) {
                $$("tree").unselectAll();
                let srcTree = data.json().content;

                let obj = Object.keys(srcTree);

                let dataChilds = {tables:[], forms:[], dashboards:[]};

                obj.forEach(function(data) {
                    
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
                }).catch(err => {
                    console.log(err);
                    notify ("error","Не удалось загрузить данные меню",true);
                 });

                
                $$("tree").attachEvent("onAfterSelect", function (id) {
                    routes.navigate("tree/"+id, { trigger:true }); 
                });
             
                
                if (menuItem == "userprefs" || menuItem == "cp"){
                    $$("userprefsName").setValues(userInfo[0].toString());
       
                }
 
            }).catch(err => {
               console.log(err);
               notify ("error","Не удалось загрузить данные меню",true);
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
        
        let userLocation = webix.storage.local.get("userLocation");

        if (userLocation){

            if (userLocation.tableName !== undefined){

                 setTimeout(function(){
                    webix.ui({
                        view:"popup",
                        id:"popupPrevHref",
                        css:"webix_popup-prev-href",
                        width:340,
                        height:150,
                        position:"center",
                        body:{
                            rows:[
                            {rows: [ 
                                { cols:[
                                {template:"Прошлая сессия", width:200,css:"webix_template-recover", borderless:true, height:40 },
                                {},
                                {
                                    view:"button",
                                    id:"buttonClosePopup",
                                    css:"webix_close-btn",
                                    type:"icon",
                                    width:25,
                                    icon: 'wxi-close',
                                    click:function(){
                                        $$("popupPrevHref").hide();
                                    }
                                },
                                ]},
                                {   template:"В прошлый раз Вы остановились во вкладке"+" «"+userLocation.tableName+"»",
                                    css:"webix_template-recover-descr", 
                                    borderless:true, 
                                    height:50 },
                                {
                                    view:"button",
                                    id:"btnRecover",
                                    css:"webix_btn-recover",
                                    height:38,
                                    value:"Перейти ко вкладке",
                                    click:function(){
                                        window.location.replace(userLocation.href)
                                        
                                        if(userLocation.href.includes("tree")){
                                            let treeItemParent = $$("tree").getItem(userLocation.tableId).$parent;
                                            if (treeItemParent !==0){
                                                $$("tree").open(treeItemParent);
                                            }
                                            $$("tree").select(userLocation.tableId);
                                        }
                                        
                                    $$("popupPrevHref").hide();
                                    }
                                },
                                {height:20}
                            ]}]
                            
                        },

                    }).show();
                }, 1500);
                
            }
       
    }

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
            getDataFields (routes,"cp");
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

        $$("webix__none-content").hide();
        if ($$("tree").data.order.length == 0){
            getDataFields (routes,"userprefs");
        }

        if($$("userprefs")){
            $$("userprefs").show();
        }else {
            createElements("userprefs");
            $$("userprefs").show();
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
    createElements,
    removeElements,
    tableNames
};
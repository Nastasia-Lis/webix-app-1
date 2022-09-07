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
import {editTreeLayout,contextMenu} from "../treeItems/editTreeTemplate.js";
import {catchErrorTemplate,ajaxErrorTemplate} from "./logBlock.js";




let tableNames = [];
let userInfo=[];

function createElements(specificElement){
   
    
    try {
        $$("container").addView(
            {view:"layout",id:"dashboards", hidden:true, scroll:"auto",
                rows: dashboardLayout()
            },
        4);

        $$("container").addView(
            {view:"layout",id:"treeTempl", hidden:true, scroll:"auto",
                rows: editTreeLayout()
                //rows: dashboardLayout()
            },
        4);

        webix.ui(contextMenu());

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
    } catch (error){
        console.log(error);
        catchErrorTemplate("007-004", error);
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
        catchErrorTemplate("007-004", error);
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
                //console.log(srcTree)
  
                srcTree.treeTemplate={
                    
                    "fields": {
                        "id": {
                            "type": "id",
                            "unique": false,
                            "notnull": false,
                            "length": 512,
                            "label": "Id",
                            "comment": null,
                            "default": "None"
                        },
                        "pid": {
                            "type": "reference trees",
                            "unique": false,
                            "notnull": false,
                            "length": 512,
                            "label": "Родитель",
                            "comment": null,
                            "default": "None"
                        },
                        "owner": {
                            "type": "reference auth_user",
                            "unique": false,
                            "notnull": false,
                            "length": 512,
                            "label": "Владелец",
                            "comment": null,
                            "default": "None"
                        },
                        "ttype": {
                            "type": "integer",
                            "unique": false,
                            "notnull": false,
                            "length": 512,
                            "label": "Тип",
                            "comment": "Тип записи|1=системная;2=пользовательская|Перечисление",
                            "default": "1"
                        },
                        "name": {
                            "type": "string",
                            "unique": false,
                            "notnull": false,
                            "length": 100,
                            "label": "Наименование",
                            "comment": null,
                            "default": ""
                        },
                        "descr": {
                            "type": "string",
                            "unique": false,
                            "notnull": false,
                            "length": 1000,
                            "label": "Описание",
                            "comment": null,
                            "default": ""
                        },
                        "value": {
                            "type": "string",
                            "unique": false,
                            "notnull": false,
                            "length": 1000,
                            "label": "Значение",
                            "comment": null,
                            "default": ""
                        },
                        "cdt": {
                            "type": "datetime",
                            "unique": false,
                            "notnull": false,
                            "length": 512,
                            "label": "Создано",
                            "comment": null,
                            "default": "now"
                        }
                    },
                    "singular": "Классификатор-пример",
                    "ref_name": "name",
                    "plural": "Классификаторы-пример",
                    "type": "treeConf"
                    
                };



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
                   // console.log(dataChilds)
                    //dataChilds.forms.push({"id":123, "value":"Дерево-пример", "type":"tform"})
                } catch (error){
                    console.log(error);
                    catchErrorTemplate("007-000", error);

                }
    

                webix.ajax().get("/init/default/api/mmenu.json").then(function (data) {

                    let menu = data.json().mmenu;
                   // console.log(menu)
                    let menuTree = [];

                    let dataAuth=[];
                    let dataNotAuth=[];
                    try {
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
                        menuTree.push({id:"treeTempl", value:"Классификатор-пример", data:dataChilds.treeConf});
                        $$("tree").parse(menuTree);
                        $$("button-context-menu").config.popup.data = dataAuth;
                        $$("button-context-menu").enable();
                    } catch (error){
                        console.log(error);
                        catchErrorTemplate("007-000", error);

                    }
                        
                }).catch(err => {
                    console.log(err);
                   // notify ("error","Не удалось загрузить данные меню",true);
                    ajaxErrorTemplate("007-000",XmlHttpRequest.status,XmlHttpRequest.statusText,XmlHttpRequest.responseURL);

                 });

                
                $$("tree").attachEvent("onAfterSelect", function (id) {
                    routes.navigate("tree/"+id, { trigger:true }); 
                });
             
                
                if (menuItem == "userprefs" || menuItem == "cp"){
                    $$("userprefsName").setValues(userInfo[0].toString());
       
                }
 
            }).catch(err => {
               console.log(err);
               //notify ("error","Не удалось загрузить данные меню",true);
               ajaxErrorTemplate("007-000",XmlHttpRequest.status,XmlHttpRequest.statusText,XmlHttpRequest.responseURL);

            });
        },
        error:function(text, data, XmlHttpRequest){
            routes.navigate("", { trigger:true});
            ajaxErrorTemplate("007-006",XmlHttpRequest.status,XmlHttpRequest.statusText,XmlHttpRequest.responseURL);

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
        catchErrorTemplate("007-000", error);

    }
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
            try {
                getDataFields (routes).then(function (response){

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

            });
            } catch (error){
                console.log(error);
                catchErrorTemplate("007-005", error);
            }

        },

        index:function(){
            webix.ajax("/init/default/api/whoami",{
                success:function(text, data, XmlHttpRequest){
                    try {
                    routes.navigate("content", { trigger:true});
                    } catch (error){
                        console.log(error);
                        catchErrorTemplate("007-005", error);

                    }
                },
                error:function(text, data, XmlHttpRequest){
                    $$("mainLayout").hide();
                    $$("userAuth").show();
                    ajaxErrorTemplate("007-007",XmlHttpRequest.status,XmlHttpRequest.statusText,XmlHttpRequest.responseURL);
                }
            });      
        }, 
        tree: function(id){
            try {
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
            } catch (error){
                console.log(error);
                catchErrorTemplate("007-005", error);

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
                        $$("userprefsName").setValues(userInfo[0].toString());
                    }
                    
                }

                $$("tree").closeAll();
            } catch (error){
                console.log(error);
                catchErrorTemplate("007-005", error);
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

                if($$("userprefs")){
                    $$("userprefs").show();
                }else {
                    createElements("userprefs");
                    $$("userprefs").show();
                    if (userInfo.length > 0){
                        $$("userprefsName").setValues(userInfo[0].toString());
                    }
                }

                $$("tree").closeAll();
            } catch (error){
                console.log(error);
                catchErrorTemplate("007-005", error);
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
                    } catch (error){
                        console.log(error);
                        notify ("error","Не удалось выполнить выход",true,true);
                        catchErrorTemplate("007-000", error);
                    }
                    
                },
                error:function(text, data, XmlHttpRequest){
                    notify ("error","Не удалось выполнить выход",true,true);
                    ajaxErrorTemplate("007-006",XmlHttpRequest.status,XmlHttpRequest.statusText,XmlHttpRequest.responseURL);

                }
            });
            
        }

    }));

    function getLogin(){
        
        let userData = $$("formAuth").getValues();
        let loginData = [];

        try {
            $$("formAuth").validate();
            loginData.push("un"+"="+userData.username);
            loginData.push("np"+"="+userData.password);
        
            webix.ajax("/init/default/login"+"?"+loginData.join("&"),{
                success:function(text, data, XmlHttpRequest){
                    webix.ajax("/init/default/api/whoami",{
                        success:function(text, data, XmlHttpRequest){
                            try {
                                routes.navigate("");
                                routes.navigate("content", { trigger:true});
                                if ( $$('formAuth')){
                                    $$('formAuth').clear();
                                }
                                window.location.reload();
                            } catch (error){
                                console.log(error);
                                catchErrorTemplate("007-005", error);
                            }
                        },
                        error:function(text, data, XmlHttpRequest){
                            if ($$("formAuth")&&$$("formAuth").isDirty()){
                                notify ("error","Неверный логин или пароль",true,true);
                            }

                            ajaxErrorTemplate("007-006",XmlHttpRequest.status,XmlHttpRequest.statusText,XmlHttpRequest.responseURL);

                        }
                    });
                },
                error:function(text, data, XmlHttpRequest){
                    notify ("error","Не удалось выполнить выход",true,true);
                    ajaxErrorTemplate("007-006",XmlHttpRequest.status,XmlHttpRequest.statusText,XmlHttpRequest.responseURL);
                }
            });
        } catch (error){
            console.log(error);
            catchErrorTemplate("007-000", error);

        }

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
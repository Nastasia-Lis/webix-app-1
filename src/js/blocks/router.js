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
import {getInfoTable, getInfoEditTree,getInfoDashboard} from "./content.js";
import {setStorageData} from "./storageSetting.js";

import  {STORAGE,getData} from "../blocks/globalStorage.js";





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
                                    tableToolbar ( "table-search", "table-exportBtn","table-editTableBtnId", "table-findElements","table-idFilterElements", "table","table-filterId","table-templateHeadline"),
                                    { view:"resizer",class:"webix_resizers",},
                                    table ("table", onFuncTable,true)
                                ]
                            },
                        
                            {  view:"resizer",class:"webix_resizers",},
                            
                            editTableBar(),filterForm(),
                            
                            
                        ]
                        }
                    
                    },

                 
                5);
            }

            if (!$$("forms")){
                $$("container").addView(
                    {view:"layout",id:"forms", css:"webix_tableView",hidden:true, 
                                                
                        rows:[
                            tableToolbar("table-view-search", "table-view-exportBtn","table-view-editTableBtnId", "table-view-findElements","table-view-idFilterElements", "table-view","table-view-filterIdView","table-view-templateHeadline", true ),
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


function getWorkspace (){

    async function getMenuTree() {

        if (!STORAGE.mmenu){
        
            await getData("mmenu"); 
            
        }


        function generateChildsTree  (el){
            let childs = [];
    
            try {
                el.childs.forEach(function(child,i){
                    childs.push({
                        id:child.name, 
                        value:child.title,
                        action:child.action
                    });
                });
            } catch (err){
                console.log(err);
                setLogValue("error","generateChildsTree: "+err );
            }
            return childs;
        }

        function generateParentTree  (el){ 
            let menuItem;
            try {                  
                menuItem = {
                    id:el.name, 
                    value:el.title,
                    action:el.action,
                };


                if (!(el.title)){
                    menuItem.value="Без названия";
                }

                if (el.action !== "dbtable"   && 
                    el.action !== "tform"     && 
                    el.action !== "dashboard" &&
                    el.action !== "none"      ) {

                    if (el.childs.length == 0){
                        menuItem.webix_kids = true; 
                    } else {
                        menuItem.data = generateChildsTree (el);
                    }         
                } else {
                    
                }
            } catch (err){
                console.log(err);
                setLogValue("error","generateParentTree: "+err );
            }
            return menuItem;
        } 

       

        function generateHeaderMenu  (el){
            let items = [];
            
            try{
                items.push({id:"userprefs", value:"Настройки"});

                el.childs.forEach(function(child,i){
                    let item = {
                        id:child.name,
                        value:child.title
                    };

                    
                    if (child.name !== "logout"){
                        items.push(item);
                    } 
                });

                items.push({id:"logout", value:"Выйти", css:"webix_logout"});
            } catch (err){
                console.log(err);
                setLogValue("error","generateHeaderMenu: "+err );
            }

            return items;
        }

        function generateMenuTree (){ 
            let menu,
                menuTree = [],
                menuHeader = []
            ;

            try {
                menu = STORAGE.mmenu.mmenu;
        
                // menu.push ({
                //     "id": 77,
                //     "name": "sales",
                //     "title": "Sales",
                //     "mtype": 1,
                //     "ltype": 1,
                //     "action": "dashboard",
                //     "childs": []
                // });

             
                menu.forEach(function(el,i){
                    menuTree.push  ( generateParentTree (el, menu, menuTree  ) );
                    if (el.childs.length !==0){
                        menuHeader = generateHeaderMenu (el, menu, menuHeader);
                    }
                });

                $$("tree").clearAll();
                $$("tree").parse(menuTree);
                if ($$("button-context-menu").config.popup.data !== undefined){
                    $$("button-context-menu").config.popup.data = menuHeader;
                    $$("button-context-menu").enable();
                }
            } catch (err){
                console.log(err);
                setLogValue("error","generateMenuTree: "+err );
            }
        }

        generateMenuTree (); 
    }

    function createContent (){ 
 
        function showMainContent(){
            try {
                $$("userAuth").hide();
                $$("mainLayout").show();
            } catch (err){
                console.log(err);
                window.alert("showMainContent: "+err+ " (Подробности: ошибка в отрисовке контента)");
                setLogValue("error","showMainContent: "+err );
            }
        }

        function setUserData(){
            let userStorageData = {};
            userStorageData.id = STORAGE.whoami.content.id;
            userStorageData.name = STORAGE.whoami.content.first_name;
            userStorageData.username = STORAGE.whoami.content.username;
            setStorageData("user", JSON.stringify(userStorageData));
        }

            showMainContent();

            setUserData(); //??

            createElements();

            getMenuTree();
    }

    async function getAuth () {

        if (!STORAGE.whoami){
            await getData("whoami"); 
        }

        if (STORAGE.whoami){
            createContent (); 
        }
    }

    getAuth ();

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
    } catch (err){
        console.log(err);
        setLogValue("error","hideAllElements: "+err );

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
                getWorkspace();
            } catch (err){
                console.log(err);
                setLogValue("error","router/content: "+err+ " (Подробности: ошибка роутера)" );
            }
    
        },
    
        index:function(){
            async function getAuth () {

                if (!STORAGE.whoami ){
                    await getData("whoami"); 
                }
        
                if (STORAGE.whoami){

                    try {
                        Backbone.history.navigate("content", { trigger:true});
                    } catch (err){
                        console.log(err);
                        setLogValue("error","router/index: "+err+ " (Подробности: ошибка роутера)" );
                    }

                } else {
                    try{
                        $$("mainLayout").hide();
                        $$("userAuth").show();
                    } catch (err){
                        console.log(err);
                        window.alert("getAuth: "+err+ " (Подробности: ошибка в отрисовке контента)");
                        setLogValue("error","getAuth: "+err );
                    }
                }
            }

            getAuth ();
   
        }, 
        tree: function(id){

            function notFoundPopup (){
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
            function showTableData (){
                let fieldsData;
                let checkFound = false;
                fieldsData = STORAGE.fields.content;
            
            
                Object.values(fieldsData).forEach(function(field,i){
                  
                    if (Object.keys(fieldsData)[i] == id){
                        checkFound=true;
                        if (field.type == "dbtable" || 
                            field.type == "tform"   || 
                            field.type == "dashboard"){
                            
                            if ($$("webix__none-content").isVisible()){
                                $$("webix__none-content").hide();
                            }
                            if (field.type == "dbtable"){
                                if ($$("tables")){
                                    $$("tables").show();
                                }
                                getInfoTable ("table", id);
                                
                            } else if (field.type == "tform"){
                                if ($$("forms")){
                                    $$("forms").show();
                                }
                                getInfoTable ("table-view", id);
                            } else if (field.type == "dashboard"){
                                if ($$("dashboards")){
                                    $$("dashboards").show();
                                }
                                getInfoDashboard(id);
                            }
                            
                        } 
                    }
                });

                if (!checkFound){
                    notFoundPopup ();
                }
            }
            
            function setTableName (){

                if ($$("table-templateHeadline") ){
                    
                    STORAGE.tableNames.forEach(function(el,i){
                        if (el.id == id){
                            $$("table-templateHeadline").setValues(el.name);
                        }
                        
                    });
                } 
                
                if ($$("table-view-templateHeadline")){
                    STORAGE.tableNames.forEach(function(el,i){
                        if (el.id == id){
                            $$("table-view-templateHeadline").setValues(el.name);
                        }
                        
                    });
                }
            }
            async function getTableData (){

        
                if (!STORAGE.fields){
                    await getData("fields"); 
                }
             
                if (STORAGE.fields){
                    showTableData ();
                    setTableName ();
                }
            }

            async function createTable (){
                await getWorkspace ();
       
                $$("tree").attachEvent("onAfterLoad", function () {
                let parentId;

                if ($$("tree").getItem(id)){
                  
                    parentId = $$("tree").getParentId(id);
                    $$("tree").open(parentId);
                    $$("tree").select(id);
                 
                } else if (!STORAGE.fields) {
                    getTableData ();
            
                } else if (STORAGE.fields){
                    showTableData ();
                    setTableName ();
                } 
                
                });
            }

            try {
            
                if ($$("tree").data.order.length == 0){
                    createTable ();
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
                    getWorkspace ();
                }
    
                if($$("user_auth")){
                    $$("user_auth").show();
                }else {
                    createElements("cp");
                    $$("user_auth").show();

                }
    
                $$("tree").closeAll();

                let user = webix.storage.local.get("user");
                if (user){
                    $$("authName").setValues(user.name.toString());
                }
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
                    getWorkspace ();
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

                }

                let user = webix.storage.local.get("user");
                if (user){
                    $$("userprefsName").setValues(user.name.toString());
                }
    
                $$("tree").closeAll();

       
            } catch (error){
                console.log(error);
                catchErrorTemplate("016-005", error);
            }
        
        },

        experimental: function (){
            try {
                if($$("webix__null-content")){
                    $$("container").removeView($$("webix__null-content"));
                }
            
                hideAllElements ();
    
                $$("webix__none-content").hide();


                if ($$("tree").data.order.length == 0){
                    getWorkspace ();
                }
    
                if($$("treeTempl")){
                    $$("treeTempl").show();
                    getInfoEditTree();
                }else {
                    createElements("treeTempl");
                    getInfoEditTree();
                    $$("treeTempl").show();
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
    removeElements
};
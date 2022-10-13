import {lib} from "../expalib.js";

lib ();
// tree elements
import  {dashboardLayout} from "../components/dashboard.js";
import  {table, onFuncTable} from "../components/table.js";
import {authCpLayout} from "../components/authSettings.js";
import {userprefsLayout} from "../components/userprefs.js";
 
// other blocks
import {tableToolbar} from "./toolbarTable.js";
import {editTableBar} from "./editTableForm.js";
import {propertyTemplate} from "./viewPropertyTable.js";
import {filterForm} from "./filterTableForm.js";
import {editTreeLayout,contextMenu} from "../components/editTree.js";
import {getInfoTable, getInfoEditTree,getInfoDashboard} from "./content.js";
import {setStorageData} from "./storageSetting.js";

import  {STORAGE,getData} from "../blocks/globalStorage.js";


import {setAjaxError,setFunctionError} from "./errors.js";





function createElements(specificElement){

    function createDashboards(){
        try{
            if (!$$("dashboards")){
                $$("container").addView(
                    {   view:"layout",
                        id:"dashboards", 
                        hidden:true, 
                        scroll:"auto",
                        rows: dashboardLayout()
                    },
                3);
            }
        } catch (err){
            setFunctionError(err,"router","createDashboards");
        }
    }

    function createTables(){
        try{
            if (!$$("tables")){

                $$("container").addView(
                    {   id:"tables", 
                        hidden:true, 
                        view:"scrollview", 
                        body: { 
                            view:"flexlayout", 
                            cols:[
                                                        
                                {   id:"tableContainer",
                                    rows:[
                                        tableToolbar ("table"),
                                        { view:"resizer",class:"webix_resizers",},
                                        table ("table", onFuncTable,true)
                                    ]
                                },
                            
                                {  view:"resizer",class:"webix_resizers"},
                                
                                editTableBar(),filterForm(),
                                
                                
                            ]
                        }
                    
                    },

                
                5);
            }
        } catch (err){
            setFunctionError(err,"router","createTables")
        }
    }

    function createForms(){
        try{
            if (!$$("forms")){
                $$("container").addView(
                    {   view:"layout",
                        id:"forms", 
                        css:"webix_tableView",
                        hidden:true,                       
                        rows:[
                            tableToolbar("table-view", true ),
                            { view:"resizer",class:"webix_resizers",},
                            
                            {   view:"scrollview", 
                                body: {
                                    view:"flexlayout",
                                    cols:[
                                        table ("table-view"),
                                        {   view:"resizer",
                                            class:"webix_resizers", 
                                            id:"propResize", 
                                            hidden:true
                                        },
                                        propertyTemplate("propTableView")
                                    ]
                                }
                            }, 
                        ],

                        
                    },
                6);
            }
        } catch (err){
            setFunctionError(err,"router","createForms")
        }
    }

    function createDefaultWorkspace(){
        if(!specificElement){
            createDashboards();
            createTables();
            createForms();
        }
    }

    function createTreeTempl(){
        try{
            if (specificElement == "treeTempl"){
                if (!$$("treeTempl")){
                    $$("container").addView(
                        {   view:"layout",
                            id:"treeTempl", 
                            hidden:true, 
                            scroll:"auto",
                            rows: editTreeLayout()
                        },
                    4);
                    webix.ui(contextMenu());
                }
            }
        } catch (err){
            setFunctionError(err,"router","createTreeTempl")
        }
    }

    function createCp(){
        try{
            if (specificElement == "cp"){
                $$("container").addView(
                    {   view:"layout",
                        id:"user_auth", 
                        css:"webix_auth",
                        hidden:true, 
                        rows:[
                            authCpLayout,
                            {}
                        ],
                    }, 
                7);
            }
        } catch (err){
            setFunctionError(err,"router","createCp")
        }
    }

    function createUserprefs(){
        try{
            if (specificElement == "userprefs"){

                $$("container").addView(
                    {   view:"layout",
                        id:"userprefs", 
                        css:"webix_auth",
                        hidden:true, 
                        rows:[
                            userprefsLayout,
                        ],
                    }, 
                8);
            }
        } catch (err){
            setFunctionError(err,"router","createUserprefs")
        }
    }

    function createSpecificWorkspace (){
        createTreeTempl();
        createCp();
        createUserprefs();
    }
   

    createDefaultWorkspace();
    createSpecificWorkspace ();

}


function removeElements(){

    function removeElement(idElement){
        try {
            if ($$(idElement)){
                $$("container").removeView($$(idElement));
            }
        } catch (err){
            setFunctionError(err,"router","removeElement (element: "+idElement+")")
        }
    }
    removeElement ("tables");
    removeElement ("dashboards");
    removeElement ("forms");
    removeElement ("user_auth");
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
                setFunctionError(err,"router","generateChildsTree");
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
                setFunctionError(err,"router","generateParentTree");
            }
            return menuItem;
        } 

       

        function generateHeaderMenu  (el){
            let items = [];
            
            try{ 
                items.push({id:"favs", value:"Избранное", icon: "fas fa-star"});
                items.push({id:"userprefs", value:"Настройки", icon: "fas fa-gear"});
                items.push({id:"cp", value:"Смена пароля", icon: "fas fa-lock"});
                items.push({id:"logout", value:"Выйти", css:"webix_logout", icon: "fas fa-right-from-bracket"});
                // el.childs.forEach(function(child,i){
                //     let item = {
                //         id:child.name,
                //         value:child.title
                //     };

                    
                //     if (child.name !== "logout"){
                //         items.push(item);
                //     } 
                // });

              
            } catch (err){
                setFunctionError(err,"router","generateHeaderMenu");
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
                setFunctionError(err,"router","generateMenuTree");
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
                window.alert("showMainContent: "+err+ " (Подробности: ошибка в отрисовке контента)");
                setFunctionError(err,"router","showMainContent");
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

        setUserData();

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
        setFunctionError(err,"router","hideAllElements");
    }
}

function removeNullContent(){
    try{
        if($$("webix__null-content")){
            $$("container").removeView($$("webix__null-content"));
        }
    } catch (err){
        setFunctionError(err,"router","router function removeNullContent");
    }
}

function hideNoneContent(){
    try{
        if ( $$("webix__none-content")){
            $$("webix__none-content").hide();
        }
    } catch (err){
        setFunctionError(err,"router","router function hideNoneContent");
    }
}

function checkTreeOrder(){
    try{
        if ($$("tree").data.order.length == 0){
            getWorkspace ();
        }
    } catch (err){
        setFunctionError(err,"router","router function checkTreeOrder");
    }
}

function closeTree(){
    try{
        if($$("tree")){
            $$("tree").closeAll();
        }
    } catch (err){
        setFunctionError(err,"router","closeTree");
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
                setFunctionError(err,"router","router:content");
            }
    
        },
    
        index:function(){

            function goToContentPage(){

                try {
                    Backbone.history.navigate("content", { trigger:true});
                } catch (err){
                    setFunctionError(err,"router","router:index function goToContentPage");
                }
            }

            function showWorkspace(){
                try{
                    if($$("mainLayout")){
                        $$("mainLayout").hide();
                    }

                    if(  $$("userAuth")){
                        $$("userAuth").show();
                    }
                     
                } catch (err){
                    window.alert("getAuth: "+err+ " (Подробности: ошибка в отрисовке контента, router:index function showWorkspace)");
                    setFunctionError(err,"router","router:index function showWorkspace");
                }
            }

            async function getAuth () {

                if (!STORAGE.whoami ){
                    await getData("whoami"); 
                }
         
                if (STORAGE.whoami){
                    goToContentPage();

                } else {
                    showWorkspace();
                }
            }
            getAuth ();
   
        }, 

        tree: function(id){
        
            function notFoundPopup(){

                const popupHeadline = {   
                    template:"Что-то пошло не так...", 
                    width:250,
                    css:"popup-headline", 
                    borderless:true, 
                    height:20 
                };
                const btnClosePopup = {
                    view:"button",
                    id:"buttonClosePopup",
                    css:"popup_close-btn",
                    type:"icon",
                    width:35,
                   
                    icon: 'wxi-close',
                    click:function(){
                        try{
                            if ($$("popupNotFound")){
                                $$("popupNotFound").hide();
                            }
                        } catch (err){
                            setFunctionError(err,"router","router:tree, btnClosePopup click");
                        }
                    
                    }
                };

                const popupSubtitle = {   
                    template:"Страница не найдена",
                    css:"webix_template-not-found-descr", 
                    borderless:true, 
                    height:35 
                };

                const mainBtnPopup = {
                    view:"button",
                    css:"webix_btn-not-found-back",
                    height:46,
                    value:"Вернуться на главную",
                    click:function(){
                        function destructPopup(){
                            try{
                                if ($$("popupNotFound")){
                                    $$("popupNotFound").destructor();
                                }
                            } catch (err){
                                setFunctionError(err,"router","router:tree, mainBtnPopup click destructPopup");
                            }
                        }
                        function navigate(){
                            try{
                                Backbone.history.navigate("content", { trigger:true});
                                window.location.reload();
                            } catch (err){
                                setFunctionError(err,"router","router:tree, mainBtnPopup click navigate");
                            }
                        }
                        destructPopup();
                        navigate();
                     
                   
                    }
                };

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
                                popupHeadline,
                                {},
                                btnClosePopup,
                            ]},
                            popupSubtitle,
                            mainBtnPopup,
                            {height:20}
                        ]}]
                        
                    },

                }).show();
            }
            function showNotFoundPopup (){
                try{
                    setTimeout(function(){
                        notFoundPopup();
                    }, 1500);
                } catch (err){
                    setFunctionError(err,"router","router:tree function showNotFoundPopup");
                }
            }

            function showTableData (){
                let fieldsData;
                let checkFound = false;
                fieldsData = STORAGE.fields.content;
            
                function showElem(idElem){
                    try{
                        if ($$(idElem)){
                            $$(idElem).show();
                        }
                    } catch (err){
                        setFunctionError(err,"router","router:tree function showTableData (element: "+idElem+")");
                    }
                }

            
                function createElem(){
                    try{
                        Object.values(fieldsData).forEach(function(field,i){
                        
                            if (Object.keys(fieldsData)[i] == id){
                                checkFound=true;
                                
                                if (field.type == "dbtable" || 
                                    field.type == "tform"   || 
                                    field.type == "dashboard"){
                                    
                                    hideNoneContent();

                                    if (field.type == "dbtable"){
                                        showElem("tables");
                                        getInfoTable ("table", id);
                                        
                                    } else if (field.type == "tform"){
                                        showElem("forms");
                                        getInfoTable ("table-view", id);

                                    } else if (field.type == "dashboard"){
                                        showElem("dashboards");
                                        getInfoDashboard(id);
                                    }
                                    
                                } 
                            }
                        });
                    } catch (err){
                        setFunctionError(err,"router","router:tree function createElem");
                    }
                }
                createElem();

                if (!checkFound){
                    showNotFoundPopup ();
                }
            }
            
            function setTableName (){

                if ($$("table-templateHeadline") ){
                    try{
                        STORAGE.tableNames.forEach(function(el,i){
                            if (el.id == id){
                                if($$("table-templateHeadline")){
                                    $$("table-templateHeadline").setValues(el.name);
                                }
                            }
                            
                        });
                    } catch (err){
                        setFunctionError(err,"router","router:tree function setTableName element table-templateHeadline");
                    }
                } 
                
                if ($$("table-view-templateHeadline")){
                    try{
                        STORAGE.tableNames.forEach(function(el,i){
                            if (el.id == id){
                                if($$("table-view-templateHeadline")){
                                    $$("table-view-templateHeadline").setValues(el.name);
                                }
                            
                            }
                            
                        });
                    } catch (err){
                        setFunctionError(err,"router","router:tree function setTableName element table-view-templateHeadline");
                    }
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

                try{
       
                    $$("tree").attachEvent("onAfterLoad", function () {
                        let parentId;

                        function treeselectItem(){
                            parentId = $$("tree").getParentId(id);
                            $$("tree").open(parentId);
                            $$("tree").select(id);
                        }

                        if ($$("tree").getItem(id)){
                        
                            treeselectItem();
                        
                        } else if (!STORAGE.fields) {
                            getTableData ();
                    
                        } else if (STORAGE.fields){
                            showTableData ();
                            setTableName ();
                        } 
                    
                    });
                } catch (err){
                    setFunctionError(err,"router","router:tree function createTable");
                }
            }

            function checkTable(){
                try {
                    if ($$("tree").data.order.length == 0){
                        createTable ();
                    }
                } catch (err){
                    setFunctionError(err,"router","router:tree function checkTable");
        
                }
            }

            checkTable();
    
        },
        
        cp: function(){
            function showUserAuth(){
                try{
                    if ($$("user_auth")){
                        $$("user_auth").show();
                    }
                } catch (err){
                    setFunctionError(err,"router","router:cp function showUserAuth");
                }
            }
               
            function setUserValues(){
                let user = webix.storage.local.get("user");
                try{
                    if (user){
                        $$("authName").setValues(user.name.toString());
                    }
                } catch (err){
                    setFunctionError(err,"router","router:cp function setUserValues");
                }
            }

           

            removeNullContent();
            hideAllElements ();
            hideNoneContent();
            checkTreeOrder();


            if($$("user_auth")){
                showUserAuth();
            } else {
                createElements("cp");
                showUserAuth();
            }

            closeTree();
            setUserValues();

        
        },
    
        userprefs: function(){
       
            function showUserprefs(){
                try{
                    $$("userprefs").show();
                } catch (err){
                  
                    setFunctionError(err,"router","router:userprefs function showUserprefs");
                }
            }

            function setUserprefsNameValue (){
                let user = webix.storage.local.get("user");
                try{
                    if (user){
                        $$("userprefsName").setValues(user.name.toString());
                    }
                } catch (err){
                  
                    setFunctionError(err,"router","router:userprefs function setUserprefsNameValue");
                }
    
            }

        
    
            removeNullContent();
            hideAllElements ();
            hideNoneContent();

            checkTreeOrder();

            if ($$("userprefs")){
                showUserprefs();
            } else {
                createElements("userprefs");

                const userprefsData = webix.ajax().get("/init/default/api/userprefs/");

                userprefsData.then(function(data){

                    data = data.json().content;

                    function setTemplateValue(){
                        try{
                            data.forEach(function(el,i){
                                if (el.name.includes("userprefs")){
                                    $$(el.name).setValues(JSON.parse(el.prefs));
                                }
                            });
                        } catch (err){
                            setFunctionError(err,"router","router:cp function setUserValues");
                        }
                    }

                    setTemplateValue();
                    
                });

                userprefsData.fail(function(err){
                    setAjaxError(err, "router","router:userprefs userprefsData");
                });

                showUserprefs();

            }

            setUserprefsNameValue ();
            closeTree();
        
        },

        experimental: function (){
            function showTreeTempl(){
                try{
                    $$("treeTempl").show();
                } catch (err){
                    setFunctionError(err,"router","router:experimental function showTreeTempl");
                }
            }
        
            removeNullContent();
        
            hideAllElements ();

            hideNoneContent();


            checkTreeOrder();


            if($$("treeTempl")){
                showTreeTempl ();
                getInfoEditTree();
            }else {
                createElements("treeTempl");
                getInfoEditTree();
                showTreeTempl();
            }

            closeTree();

        },
    
        logout: function (){
            const logoutData = webix.ajax().post("/init/default/logout/");

            logoutData.then(function(data){
                function showNoneContent(){
                    try{
                        if($$("webix__none-content")){
                            $$("webix__none-content").show();
                        }
                    } catch (err){
                        setFunctionError(err,"router","router:logout function showNoneContent");
                    }
                }
                function clearTree (){
                    try{
                        if( $$("tree")){
                            $$("tree").clearAll();
                        }
                    } catch (err){
                        setFunctionError(err,"router","router:logout function clearTree");
                    }
                }

                function clearStorage(){
                    try{
                        webix.storage.local.clear();
                    } catch (err){
                        setFunctionError(err,"router","router:logout function clearStorage");
                    }
                }

                function backPage(){
                    try{
                        history.back();
                    } catch (err){
                        setFunctionError(err,"router","router:logout function backPage");
                    }
                }

                backPage();
                showNoneContent();
                clearTree ();
                clearStorage();
               
            });

            logoutData.fail(function(err){
                setAjaxError(err, "router","router:logout logoutData");
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
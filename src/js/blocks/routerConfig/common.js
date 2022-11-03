
// tree elements
import {dashboardLayout}            from "../../components/dashboard.js";
import {table}                      from "../../components/table/layout.js";
import {onFuncTable}                from "../../components/table/onFuncs.js";
import {authCpLayout}               from "../../components/authSettings.js";
import {userprefsLayout}            from "../../components/userprefs.js";
import {editTreeLayout,contextMenu} from "../../components/editTree.js";
import {sortTable, scrollTableLoad} from "../../components/table/lazyLoad.js";
import {setColsWidthStorage}        from "../columnsSettings/columnsWidth.js"
 
// other blocks
import {tableToolbar}               from "../toolbarTable.js";
import {editTableBar}               from "../tableEditForm/layout.js";
import {propertyTemplate}           from "../viewPropertyTable.js";
import {filterForm}                 from "../tableFilter/layout.js"
import {setStorageData}             from "../storageSetting.js";
import {viewTools}                  from "../viewTools.js";


import {STORAGE,getData}           from "../globalStorage.js";

import {setFunctionError}           from "../errors.js";





const logNameFile = "router => common";
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
            setFunctionError(err,logNameFile,"createDashboards");
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
                            id:"flexlayoutTable", 
                            cols:[
                                                        
                                {   id:"tableContainer",
                                    rows:[
                                        tableToolbar ("table"),
                                        { view:"resizer",class:"webix_resizers"},
                                        table ("table", onFuncTable,true)
                                    ]
                                },
                            
                                
                               {  view:"resizer",class:"webix_resizers", id:"tableBarResizer" },
                          
                                editTableBar(),
                                filterForm(),
                               
                             
                                
                                
                            ]
                        }
                    
                    },

                
                5);
                sortTable          ($$("table"));
                scrollTableLoad    ($$("table"));
                setColsWidthStorage($$("table"));
            }
        } catch (err){
            setFunctionError(err,logNameFile,"createTables");
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
                            {cols:[
                                {id:"formsContainer",rows:[
                                    tableToolbar("table-view", true ),
                                    { view:"resizer",class:"webix_resizers",},
                                    
                                    {   view:"scrollview", 
                                        body: {
                                            view:"flexlayout",
                                            cols:[
                                                table ("table-view"),
                                        
                                            ]
                                        }
                                    }, 
                                ]}, 

                                { view:"resizer",id:"formsTools-resizer",hidden:true,class:"webix_resizers",},
                                propertyTemplate("propTableView"),
                                {id:"formsTools",hidden:true,rows:[
                                    viewTools,                                
                                ]},
                            ]},
                        
                         
                        ],

                        
                    },
                6);

               sortTable          ($$("table-view"));
               setColsWidthStorage($$("table-view"));
              //  scrollTableLoad($$("table-view"));
           
            }
        } catch (err){
            setFunctionError(err,logNameFile,"createForms");
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
            setFunctionError(err,logNameFile,"createTreeTempl")
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
            setFunctionError(err,logNameFile,"createCp")
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
            setFunctionError(err,logNameFile,"createUserprefs")
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
            const elem   = $$(idElement);
            const parent = $$("container");
            if (elem){
                parent.removeView(elem);
            }
        } catch (err){
            setFunctionError(err,logNameFile,"removeElement (element: "+idElement+")")
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
                setFunctionError(err,logNameFile,"generateChildsTree");
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

          
                if ( !(el.title) ){
                    menuItem.value="Без названия";
                }

                if ( el.mtype == 2 ) {

                    if ( el.childs.length == 0 ){
                        menuItem.webix_kids = true; 
                    } else {
                        menuItem.data = generateChildsTree (el);
                    }         
                } 
            

            } catch (err){
                setFunctionError(err,logNameFile,"generateParentTree");
            }
            return menuItem;
        } 

       

        function generateHeaderMenu  (el){
            let items = [];
            
            try{ 
                items.push({id:"favs", value:"Избранное", icon: "icon-star"});
                items.push({id:"userprefs", value:"Настройки", icon: "icon-cog"});
                items.push({id:"cp", value:"Смена пароля", icon: "icon-lock"});
                items.push({id:"logout", value:"Выйти", css:"webix_logout", icon: "icon-sign-out"});
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
                setFunctionError(err,logNameFile,"generateHeaderMenu");
            }

            return items;
        }

        function generateMenuTree (){ 
            let menu,
                menuTree   = [],
                menuHeader = []
            ;

            const delims     = [];
            const tree       = $$("tree");
            const btnContext = $$("button-context-menu");

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
                    if (el.mtype !== 3){
                        menuTree.push  ( generateParentTree (el, menu, menuTree  ) );
                        if (el.childs.length !==0){
                            menuHeader = generateHeaderMenu (el, menu, menuHeader);
                        }
                    } else {
                        delims.push(el.name);
                        menuTree.push({id:el.name, disabled:true,value:""})
                    }
              
                });

                

                tree.clearAll();
                tree.parse(menuTree);
                if (btnContext.config.popup.data !== undefined){
                    btnContext.config.popup.data = menuHeader;
                    btnContext.enable();
                }

         
                delims.forEach(function(el){
                    tree.addCss(el, "tree_delim-items");

                });
            } catch (err){
                setFunctionError(err,logNameFile,"generateMenuTree");
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
                setFunctionError(err,logNameFile,"showMainContent");
            }
        }

        function setUserData(){
            let userStorageData      = {};
            userStorageData.id       = STORAGE.whoami.content.id;
            userStorageData.name     = STORAGE.whoami.content.first_name;
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


function checkTreeOrder(){

    try{
        if ($$("tree").data.order.length == 0){
            getWorkspace ();
        }
    } catch (err){
        setFunctionError(err,logNameFile,"checkTreeOrder");
    }
}

function closeTree(){
    try{
        if($$("tree")){
            $$("tree").closeAll();
        }
    } catch (err){
        setFunctionError(err,logNameFile,"closeTree");
    }
    
}

function hideAllElements (){

    try {
        $$("container").getChildViews().forEach(function(el,i){
           
            if(el.config.view=="scrollview"|| el.config.view=="layout"){
                const element = $$(el.config.id);
                
                if (element.isVisible()){
                    element.hide();
                }
            }
        });
    } catch (err){
        setFunctionError(err,logNameFile,"hideAllElements");
    }
  
     
}



export {
    createElements,
    removeElements,
    getWorkspace,
    hideAllElements,
    checkTreeOrder,
    closeTree
};
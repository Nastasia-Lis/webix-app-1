

import { setStorageData }           from "../../blocks/storageSetting.js";
import { STORAGE, getData, 
         LoadServerData, GetMenu}   from "../../blocks/globalStorage.js";
import {setFunctionError}           from "../../blocks/errors.js";
import { mediator }                 from "../../blocks/_mediator.js";

const logNameFile = "router => common";
function createElements(specificElement){

    function createDefaultWorkspace(){
        if(!specificElement){
            mediator.dashboards.create();
            mediator.tables    .create();
            mediator.forms     .create();
        }
    }

    function createTreeTempl(){
        try{
            if (specificElement == "treeTempl"){
                mediator.treeEdit.create();
            }
        } catch (err){
            setFunctionError(
                err,
                logNameFile,
                "createTreeTempl"
            );
        }
    }

    function createCp(){
        try{
            if (specificElement == "cp"){
                mediator.user_auth.create();
            }
        } catch (err){
            setFunctionError(
                err,
                logNameFile,
                "createCp"
            );
        }
    }

    function createUserprefs(){
        try{
            if (specificElement == "settings"){
                mediator.settings.create();
            }
        } catch (err){
            setFunctionError(
                err,
                logNameFile,
                "createUserprefs"
            );
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
            setFunctionError(
                err,
                logNameFile,
                "removeElement (element: " + idElement + ")"
            );
        }
    }
    removeElement ("tables");
    removeElement ("dashboards");
    removeElement ("forms");
    removeElement ("user_auth");
}


function getWorkspace (){

    function getMenuTree() {

        function generateChildsTree  (el){
            let childs = [];
    
            try {
                el.childs.forEach(function(child,i){
                    childs.push({
                        id     : child.name, 
                        value  : child.title,
                        action : child.action
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
                    id     : el.name, 
                    value  : el.title,
                    action : el.action,
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

            const items = [];

            function pustItem(id, value, icon){
                const item = {
                    id    : id, 
                    value : value, 
                    icon  : icon
                };

                if (id == "logout"){
                    item.css = "webix_logout";
                }
              
                items.push(item);
            
                return items;
            }
            
            pustItem ("favs",       "Избранное",     "icon-star"     );
            pustItem ("settings",  "Настройки",      "icon-cog"      );
            pustItem ("cp",         "Смена пароля",  "icon-lock"     );
            pustItem ("logout",     "Выйти",         "icon-sign-out" );

              
           
            return items;
        }

        function generateMenuTree (menu){ 


            const menuTree   = [];
            const delims     = [];
            const tree       = $$("tree");
            const btnContext = $$("button-context-menu");

            let menuHeader = [];

            menu.forEach(function(el,i){
                if (el.mtype !== 3){
                    menuTree.push  ( generateParentTree (el, menu, menuTree  ) );
                    if (el.childs.length !==0){
                        menuHeader = generateHeaderMenu (el, menu, menuHeader);
                    }
                } else {
                    delims.push(el.name);
                    menuTree.push({
                        id       : el.name, 
                        disabled : true,
                        value    : ""
                    });
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
   

        }

        LoadServerData.content("mmenu")
        
        .then(function (){
            const menu = GetMenu.content;
            generateMenuTree (menu); 
        });
 
    }

    function createContent (){ 
 
        function showMainContent(){
            try {
                $$("userAuth").hide();
                $$("mainLayout").show();
            } catch (err){
                window.alert
                ("showMainContent: " + err +  " (Подробности: ошибка в отрисовке контента)");
                setFunctionError(err,logNameFile,"showMainContent");
            }
        }

        function setUserData(){
            const userStorageData      = {};
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
        setFunctionError(
            err,
            logNameFile,
            "checkTreeOrder"
        );
    }
}

function closeTree(){
    const tree = $$("tree");
    try{
        if(tree){
            tree.closeAll();
        }

    } catch (err){
        setFunctionError(
            err,
            logNameFile,
            "closeTree"
        );
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
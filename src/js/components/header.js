///////////////////////////////
//
// Меню пользователя. Загрузка                  (create load data)
//
// Дефолтное состояние header после адаптива    (create default state)
//
// Кнопка пользовательских функций              (create user prefs btn)
//
// Кнопка сокрытия лога                         (create log btn)
//
// Кнопка сокрытия дерева                       (create collapse btn)
// 
// Layout                                       (create layout)
//
// Медиатор                                     (create mediator)
//
// Copyright (c) 2022 CA Expert
//
///////////////////////////////

import { Action, isArray}       from "../blocks/commonFunctions.js";
import { checkFonts }           from "../blocks/checkFonts.js";
import { setFunctionError }     from "../blocks/errors.js";
import { Button }               from "../viewTemplates/buttons.js";
import { favsPopup }            from "./favorites.js";
import { returnOwner }          from "../blocks/commonFunctions.js";
import { mediator }             from "../blocks/_mediator.js";
import { ServerData }           from "../blocks/getServerData.js";


const logNameFile = "header";

//create load data
function createItems (){

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

function generateHeaderMenu (menu){

    const btnContext = $$("button-context-menu");
    let menuHeader;

    if (isArray(menu, "header/loadContextMenu", "generateHeaderMenu")){
        menu.forEach(function(el,i){
            if (el.mtype !== 3){
                if (el.mtype !== 3 && el.childs.length !==0){
                    menuHeader = createItems (el, menu, menuHeader);
                }
            }
        
        });
    
        if (btnContext.config.popup.data !== undefined){
            btnContext.config.popup.data = menuHeader;
            btnContext.enable();
        }
    
    }
 

}





//create default state
function headerDefState(){
    const headerChilds = $$("header").getChildViews();

    if (isArray(headerChilds, "header/setDefaultState", "headerDefState")){
        headerChilds.forEach(function(el){
            if (el.config.id.includes("search")){
                el.show();
            }
        });
    }
  
}
//create user prefs btn

function navigateTo (path){
    return Backbone.history.navigate(path, {trigger : true});
}

function clearTree(){
    const tree = $$("tree");
    if (tree){
        tree.unselectAll();
        tree.closeAll();

    }
}

function clickMenu(id, path = id){
    mediator.getGlobalModalBox(id).then(function(result){
        if (result){
            clearTree();
            navigateTo (path);
        }
    });

}

function itemClickContext(id){

    if (id=="logout"){
        clickMenu("logout", "logout?auto=true");

    } else if (id == "cp"){
      //  clickMenu("cp", "/cp");
      clearTree();
      navigateTo ("/cp");

    } else if (id == "settings"){
       // clickMenu("settings", "/settings");
       clearTree();
       navigateTo ("/settings");

    } else if (id == "favs"){
        const popup = $$("popupFavsLink");
        if (!popup){
            favsPopup();
        } else {
            popup.show();
        }
    }
 
}

function putUserprefs(id, sentObj){
    const path = "userprefs/" + id;

    new ServerData({
        id : path
    }).put(sentObj);
}

function postUserprefsData (sentObj){
    const path = "userprefs";
    new ServerData({
        id : path,
    }).post(sentObj);
}



async function onItemClickBtn(){
    const owner       = await returnOwner();

    const localUrl    = "/index.html/content";
    const spawUrl     = "/init/default/spaw/content";
    const path        = window.location.pathname;

    const prefName    = "userLocationHref";

    if (owner && owner.id){
        new ServerData({
            id : `smarts?query=userprefs.name=${prefName}+and+userprefs.owner=${owner.id}&limit=80&offset=0`
           
        }).get().then(function(data){
          
    
            if (data && path !== localUrl && path !== spawUrl){
               
                const location = {
                    href : window.location.href
                };
    
                const sentObj = {
                    name  : prefName,
                    owner : ownerId.id,
                    prefs : location
                };
    
                const content = data.content;
        
                if (content && content.length){ // запись с таким именем уже существует
                    const id = content[0].id;
                    putUserprefs(id, sentObj);
                } else {
                    postUserprefsData (sentObj);
                }
            }
             
        });
    } else {
        setFunctionError(
            `owner is not defined`, 
            "commonFunctions", 
            "onItemClickBtn"
        );
    }
    

 
}


const userContextBtn = new Button({
    
    config   : {
        id       : "button-context-menu",
        hotkey   : "Ctrl+L",
        icon     : "icon-user", 
        disabled : true,
        popup   : {

            view    : 'contextmenu',
            id      : "contextmenu",
            css     : "webix_contextmenu",
            data    : [],
            on      : {
                onItemClick: function(id){
                    itemClickContext(id);
                     
 
                }
            }
        },
    },
    onFunc   :{
        onItemClick: function(){
            onItemClickBtn();
        }
    },
    titleAttribute : "Пользователь"

   
}).minView();

//create log btn

function logBtnClick(id){
    const btn = $$(id);

    if (btn.getValue() == 1){
        btn.setValue(2);

    } else {
        btn.setValue(1);
    }
}


function onChangeLogBtn(newValue){

    const list      = $$("logBlock-list");
    const logLayout = $$("logLayout");
    const logBtn    = $$("webix_log-btn");

    const lastItemList = list.getLastId();

    const minHeight = 5;
    
    const maxHeight = 90;

    function setState (height,icon){
        logBtn.config.badge     = "";

        logLayout.config.height = height;
        logLayout.resize();

        logBtn.config.icon      = icon;
        logBtn.refresh();
    }

    if (newValue == 2){
        setState (maxHeight, "icon-eye-slash");
        list.showItem(lastItemList);

    } else {
       
        setState (minHeight, "icon-eye");
    }
}


const logBtn = new Button({
    
    config   : {
        id       : "webix_log-btn",
        hotkey   : "Ctrl+M",
        icon     : "icon-eye", 
        badge    : 0,
        click   : function(id){
            logBtnClick(id)
        },
    },
    onFunc   :{
        onChange:function(newValue){
        
            onChangeLogBtn(newValue);
        },
        setStorageData:function(){

        }
    },
    titleAttribute : "Показать/скрыть системные сообщения"

   
}).minView();

//create collapse btn
function isIdIncludes(el){
    if (el.config.id.includes("search" )      || 
        el.config.id.includes("log-btn")      || 
        el.config.id.includes("context-menu") )
    {
        return true;
    }
}

function setSearchInputState(visible = false){
    const headerChilds = $$("header").getChildViews();

    if (isArray(headerChilds, logNameFile, "setSearchInputState")){
        headerChilds.forEach(function(el){
            if (isIdIncludes(el)){
                
                if(visible){
                    el.show();
                } else {
                    el.hide();
                }
                
            }
        });
    }

   
}


function collapseClick (){
    const treeContainer = $$("sidebarContainer");
    const tree          = $$("tree");
    const resizer       = $$("sideMenuResizer");

    function showTree(){
        Action.showItem(treeContainer);
        Action.showItem(tree);

        const minWidthResizer = 600;

        if(window.innerWidth >= minWidthResizer){
            Action.showItem(resizer);
        } 
     
    }

    function hideTree(){
        Action.hideItem(treeContainer);
        Action.hideItem(tree);
        Action.hideItem(resizer);
        
    }

    try {

        const minWidth = 850;
        if (window.innerWidth > minWidth ){
            if (tree.isVisible()){
                hideTree()

            } else {
                showTree(); 
 
            }
        } else {
            if (tree.isVisible()){
                hideTree();
                setSearchInputState(true);

            } else {
                showTree();

                tree.config.width = window.innerWidth;
                tree.resize();
        
                setSearchInputState();
            }
        }
        this.refresh();
       
    } catch (err){
        setFunctionError(
            err,
            logNameFile,
            "collapseClick"
        );

    }
}


const collapseBtn = {   
    view    : "button",
    type    : "icon",
    id      : "collapseBtn",
    icon    : "icon-bars",
    css     : "webix_collapse",
    title   : "текст",
    height  : 42, 
    width   : 40,
    click   : collapseClick,
    on      : {
        onAfterRender: function () {
            this.getInputNode()
            .setAttribute("title", "Видимость бокового меню");
            checkFonts();
        }
    }    
};

//create layout
const logo = {
    view        : "template",
    borderless  :true,
    css         :{"background-color":"transparent!important"},
    template    : "<img src='/init/static/images/expalogo.png' "+
        " style='height:30px; margin: 10px;'>", 
    height      : 25,
};

const search = {
    view        : "search", 
    id          : "headerSearch",
    placeholder : "Поиск (Alt+Shift+F)", 
    css         : "searchTable",
    height      : 42, 
    hotkey      : "alt+shift+f",
    maxWidth    : 250, 
    minWidth    : 40, 
    on:{
        onViewResize:function(){
            console.log(12)
        }
    }
};

const header = {
    view    : "toolbar", 
    id      : "header",
    padding : 10,
    css     : "webix_header-style",
    elements: [
        {cols: [
            collapseBtn,
            logo
        ]},
        
        {},
        search,
        logBtn,
        userContextBtn,
    ]
};


//create mediator
class Header {
    constructor (){
        this.name = "tree";
    }

    create(){
        return header;
    }

    showView(){
        Action.showItem($$(this.name));   
    }

    load(data){
        generateHeaderMenu(data);
    }

    defaultState(){
        headerDefState ();
    }

}

export {
    Header
};
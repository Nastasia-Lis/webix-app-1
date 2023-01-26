  
///////////////////////////////
//
// Медиатор                             (create mediator)
//
// Отрисовка неизвестного компонента    (create null content)
//
// Отрисовка компонента выбранного      (create select component)
//
// Дефолтные состояния всех компонентов (create default states)
//
// Навигация по дереву                  (create navigate)
//
// Загрузка menu                        (create load menu logic)
//
// Загрузка fields                      (create load fields logic)
//
// Загрузка дерева с ошибкой            (create error load)
//
// Адаптив дерева                       (create adaptive)
//
// Layout дерева                        (create layout)
//
// Copyright (c) 2022 CA Expert
//
///////////////////////////////

import { mediator }             from "../blocks/_mediator.js"; 
import { Action, isArray }      from "../blocks/commonFunctions.js";
import { setFunctionError }     from "../blocks/errors.js";
import { createOverlayTemplate }from "../viewTemplates/loadTemplate.js";
import { setLogValue }          from "./logBlock.js";
import { LoadServerData, 
        GetMenu, GetFields }    from "../blocks/globalStorage.js";

const logNameFile = "treeSidebar";



//create mediator

class Tree {
    constructor (){
        this.name = "tree";
    }

    create(){
        return treeSidebar();
    }

    showView(){
        Action.showItem($$(this.name));   
    }

    load(data){
        generateMenuTree(data);
    }

    selectItem(id){
        return selectElem(id);
    }

    dataLength(){
        return $$(this.name).data.order.length;
    }

    close (){
        const tree = $$(this.name);

        if (tree){
            tree.closeAll();
        }

    }

    clear (){
        const tree = $$(this.name);
    
        if (tree){
            tree.clearAll();
        }

    }

}

//create null content
function createNullContent(id){
    const view = {
        view  : "align", 
        align : "middle,center",
        id    : id,
        body  : {  
            borderless : true, 
            template   : "Блок в процессе разработки", 
            height     : 50, 
            width      : 220,
            css        : {
                "color"     : "#858585",
                "font-size" : "14px!important"
            }
        }
        
    };

    return view;
}

//create select component
function setNameToTab(){
    mediator.tabs.changeTabName(false, false);
    const data = mediator.tabs.getInfo();
    data.tree  = {none:true};
    mediator.tabs.setInfo(data);
 
}

function createUndefinedView(){

    const id = "webix__null-content";

    // const view = {
    //     view  : "align", 
    //     align : "middle,center",
    //     id    : id,
    //     body  : {  
    //         borderless : true, 
    //         template   : "Блок в процессе разработки", 
    //         height     : 50, 
    //         width      : 220,
    //         css        : {
    //             "color"     : "#858585",
    //             "font-size" : "14px!important"
    //         }
    //     }
        
    // };
     
    if ( !($$(id)) ){
        try{

            if (mediator.tabs.isOtherViewTab()){
                mediator.tabs.addTab(true);
            } else {
                setNameToTab();
            }

            $$("container").addView(createNullContent(id), 2);
        } catch (err){ 
            setFunctionError(
                err, 
                logNameFile, 
                "createUndefinedView"
            );
        }
     
    }
   
}

function selectItemAction(type, id){
    const visiualElements = mediator.getViews();
    let selectElem;

    if (type){
        const values = {
            tree : {
                type  : type, 
                field : id
            }
        };

        mediator.tabs.setInfo(values);
    }
  
    if (type == "dbtable"){
        selectElem = "tables";
        mediator.tables.load(id);

    } else if(type == "tform"){
        selectElem = "forms";
        mediator.forms.load(id);

    } else if(type == "dashboard"){
        selectElem = "dashboards";
        mediator.dashboards.load(id);
        Action.hideItem($$("propTableView"));

    } 


    if (visiualElements && visiualElements.length){
        visiualElements.forEach(function(elem){
            if (elem !== selectElem){
                Action.hideItem($$(elem));
            } 
    
            if (elem == id){
                Action.removeItem($$("webix__null-content"));
                Action.showItem  ($$("webix__none-content"));
            }
        });
    
        Action.showItem($$(selectElem));
    }
  

}

function removeTreeEdit(){
    Action.removeItem($$("treeTempl")); 
    Action.destructItem($$("contextMenuEditTree")); 
    
}

function selectElem(id){
 
    const type = GetFields.attribute (id, "type");

    Action.hideItem($$("webix__none-content"));

    removeTreeEdit();

    const isBranch = $$("tree").isBranch(id);
    
    if (!type && !isBranch){
        createUndefinedView();
    } else {
        Action.removeItem($$("webix__null-content")); 
    }
 
    selectItemAction (type, id);
}






//create default states
async function getSingleTreeItem(data) {

    await LoadServerData.content("fields");

    const keys   = GetFields.keys;
  
    if (keys){
        selectElem(data);
    }   
}

function preparationView(id){
  
    mediator.header    .defaultState();
    mediator.treeEdit  .defaultState(id);
    mediator.dashboards.defaultState();
    mediator.tables    .defaultState();
    mediator.forms     .defaultState();
    getSingleTreeItem  (id) ;
 
    
}




//create navigate

function getFields (id){
    const menu  = GetMenu.content;
    
    if (menu){
        try{
            Backbone.history.navigate("tree/" + id, { trigger : true });
        } catch (err){
            setFunctionError(err, logNameFile, "getFields");
        }
    }
}



//create load menu logic

function generateChildsTree  (el){
    let childs = [];

    
    const childsElems = el.childs;
    if (childsElems && childsElems.length){
        childsElems.forEach(function(child){
            childs.push({
                id     : child.name, 
                value  : child.title,
                action : child.action
            });
        });
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
        setFunctionError(
            err,
            logNameFile,
            "generateParentTree"
        );
    }
    return menuItem;
} 


function generateMenuTree (menu){ 

    const menuTree   = [];
    const delims     = [];
    const tree       = $$("tree");
    const btnContext = $$("button-context-menu");

    let menuHeader = [];

    // menu.push ({
    //     "id": 77,
    //     "name": "sales",
    //     "title": "Sales",
    //     "mtype": 1,
    //     "ltype": 1,
    //     "action": "dashboard",
    //     "childs": []
    // });

    if(isArray(menu, logNameFile, "generateMenuTree")){
        menu.forEach(function(el,i){
            if (el.mtype !== 3){
                menuTree.push  ( generateParentTree (el, menu, menuTree  ) );
                if (el.childs.length !==0){
                    //menuHeader = generateHeaderMenu (el, menu, menuHeader);
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
        Action.hideItem($$("loadTreeOverlay"));

        let popupData = btnContext.config.popup.data;
        if (popupData !== undefined){
            popupData = menuHeader;
            btnContext.enable();
        }


        if (delims && delims.length){
            delims.forEach(function(el){
                tree.addCss(el, "tree_delim-items");
    
            });
        }
      

    }
}





//create load fields logic
let tree;
let id;
let selectItem;

function returnId(type, uid){
    return "q-" + type + "_data-tree_" + uid;
}

function addDisableItem(idLoadElement, value, idParent = id){
    tree.data.add({
        id      :idLoadElement,
        disabled:true,
        value   :value
    }, 0, idParent );  
}

function createLoadEl(uid){
    const id = returnId("none", uid);
    addDisableItem (id, "Загрузка ...");
    tree.addCss    (id, "tree_load-items");
}

function createNoneEl(uid, idParent){
    const id = returnId("none", uid);
    addDisableItem (id, "Раздел пуст", idParent);
}


function isUniqueItem (menu, data){
    let check  = true;

    if (isArray(menu, logNameFile, "isUniqueItem")){
        menu.forEach(function(el, i){
            if (el.name == data){
                check = false;
                
            }
        });
    }
   
    return check;
}

function isTrueType(values, typeChild){

    return values.type == typeChild;
}


function removeTreeEls( noneEl = false, uid ){
    const load = "q-load_data-tree_" + uid;
    const none = "q-none_data-tree_" + uid;
    try{
        if( tree.exists(load)){
            tree.remove(load);
        }
        
        if( tree.exists(none) && noneEl){
            tree.remove(none);
        }
    } catch (err){
        setFunctionError(
            err, 
            logNameFile, 
            "removeTreeEls"
        );
    }
}

async function generateMenuData (typeChild, idParent, uid){
    await LoadServerData.content("fields");
    await LoadServerData.content("mmenu");

    const menu   = GetMenu  .content;
    const keys   = GetFields.keys;
    const values = GetFields.values;

    let itemsExists = false;

    if (keys && keys.length){
        try{
        
            keys.forEach(function(data, i) {
    
                if (isTrueType(values[i], typeChild) && isUniqueItem(menu, data)){
            
                    tree.data.add({
                            id      : data, 
                            value   : (values[i].plural) ? 
                            values[i].plural : values[i].singular, 
                            "type"  : values[i].type
                    }, 0, idParent ); 

                    if (!itemsExists){
                        itemsExists = true;
                    }
                
                    removeTreeEls(true, uid);
            
                } 

            });

            if (!itemsExists){
                removeTreeEls(false, uid);
                const noneEl =  "q-none_data-tree_" + uid;
            
                if( !(tree.exists(noneEl)) ){
                    createNoneEl(uid, idParent);
                    tree.addCss(noneEl, "tree_none-items");
                }
            }
        } catch (err){
            setFunctionError(
                err, 
                logNameFile, 
                "generateMenuData"
            );
        }
    }

}


async function getMenuChilds(uid) {

    const selectedItem  = tree.getItem(id);
    if (selectedItem.action.includes("all_")){
        const index = selectedItem.action.indexOf("_");
        const type  = selectedItem.action.slice  (index + 1);
  
        generateMenuData (type, id, uid);
    }
   
}



function loadFields(selectId, treeItem){
 
    const uid = webix.uid();
  
    tree = $$("tree");
    id   = selectId;
    selectItem = treeItem;

    const item = tree.getItem(id);

    if (tree.getItem(id) && item.$count === -1){
        createLoadEl (uid);
        getMenuChilds(uid);
    }
  
}





//create error load
function setErrLoad(err){
    Action.hideItem($$("loadTreeOverlay"));
                
    const container = $$("sidebarContainer");
    const id        = "treeErrOverlay"; 

    if ( !$$(id) && container){

        const errOverlay  = createOverlayTemplate(
            id,
            "Ошибка"
        );

        container.addView(errOverlay, 0);
    }

    if (err){
        setLogValue(
            "error", 
            err.status + " " + err.statusText + " " +
            err.responseURL + " (" + err.responseText + "). " +
            "Меню не загружено sidebar => onLoadError",
            "version"
        );
    } else {
        setLogValue(
            "error", 
            "Меню не загружено sidebar => onLoadError", 
            "version"
        );
    }
}


//create adaptive
const minWidth    = 850;
function setAdaptiveState(){
    try{
        if (window.innerWidth < minWidth ){
            $$("tree").hide();
        }
    } catch (err){
        setFunctionError(
            err, 
            logNameFile, 
            "setAdaptiveState"
        );
    }
}



//create layout

function isBranch(id){
    return $$("tree").isBranch(id);
}

function treeSidebar () {
    const tree = {
        view        : "edittree",
        id          : "tree",
        css         : "webix_tree-main",
        minWidth    : 100,
        width       : 300,
        editable    : false,
        select      : true,
        editor      : "text",
        editValue   : "value",
        activeTitle : true,
        clipboard   : true,
        data        : [],
        on          : {

            onAfterLoad:function(){
                Action.hideItem($$("treeErrOverlay"));
            },

            onLoadError:function(xhr){
                setErrLoad(xhr);
            },

            onItemClick: function(id) {
       
                if (!isBranch(id)){
                    mediator.getGlobalModalBox()
                    .then(function(result){
                        if (result){
                            $$("tree").select(id);
                        }
                    
                    });
                    return false;
                }
    
            },

            onBeforeSelect: function(id) {
                const tabbar       = $$("globalTabbar");
                const isTabsExists = tabbar.config.options.length;

                if (!isTabsExists){
                    tabbar.addOption({
                        id    : id, 
                        value : "Новая вкладка", 
                        info  : {
                            tree:{
                                none:true
                            }
                        },
                        close : true, 
                    }, true);
                }
       
              
                if (!this.config.isTabSelect){  // !(tree select by tab click)
                    const item = this.getItem(id);

                    if (!isBranch(id) || item.webix_kids){
                        this.open(id);
                    }
                    preparationView(id);
                } else {
                    mediator.forms.defaultState();
                }
            },

            onBeforeOpen:function (id, selectItem){
                loadFields(id, selectItem);
            },

            onAfterSelect:function(id){
                
                if (!this.config.isTabSelect){ // !(tree select by tab click)
                  //  mediator.tabs.changeTabName(id);
                    getFields (id);
                    setAdaptiveState();
                } else {
                    this.config.isTabSelect = false;
                }
     
            },

        },

        ready:function(){
           
        }

    };

    return tree;
}

export{
    Tree
};
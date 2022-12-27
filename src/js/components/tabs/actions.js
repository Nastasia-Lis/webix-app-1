import { mediator }          from "../../blocks/_mediator.js";
import { Action }            from "../../blocks/commonFunctions.js";
import { showTreeItem }      from "./showItem.js";
import { restoreTempData }   from "./restoreTempData.js";


/// add tab 

function clearTree(){
    const tree = $$("tree");
    if (tree){
        tree.unselectAll();
    }
  
}

function createEmptySpace(show, hide){
    Action.showItem (show);  
    Action.hideItem (hide);
}

function createSpace(isNull){
    const nullContent = $$("webix__null-content");
    const noneContent = $$("webix__none-content");

   
    if (isNull){
        createEmptySpace(nullContent, noneContent);
    } else {
        createEmptySpace(noneContent, nullContent);
    }
}

function setPath(){
    Backbone.history.navigate(
        "tree/tab?new=true", 
        { trigger : true }
    );
}

function setToStorage(idTab){
    const options = $$("globalTabbar").config.options;
 
    if (options){

        const data = {
            tabs   : options,
            select : idTab
        };

        webix.storage.local.put   ("tabbar", data);
    } else {
        webix.storage.local.remove("tabbar");
    }   
}


function setDefaultState(){
    mediator.tables     .defaultState();
    mediator.dashboards .defaultState();
    mediator.forms      .defaultState();
}

function add(isNull, open){
    const tabbar = $$("globalTabbar");
    const id     = webix.uid();

   // let pathParam;

    const treeConfig =  {
        tree:{
            none : true
        }
    };


    tabbar.addOption({
        id    : id, 
        value : "Новая вкладка", 
        info  : treeConfig,
        close : true, 
    }, open);

    clearTree();

    if (open){
        setDefaultState();
    }

    mediator.hideAllContent(false);


    setToStorage();

    createSpace (isNull);

    setPath     ();

    return id;
}


// remove tab

function setEmptyTabLink(){
    Backbone.history.navigate(
        "tree/tab?new=true", 
        { trigger : true }
    );
}

function emptyTabsLogic(lastTab){
    const tabbar = $$("globalTabbar");

    tabbar.setValue(lastTab);
    const options = tabbar.config.options;

    let conutEmptyTabs = 0;
    options.forEach(function(el, i){
        if (el.info.tree.none){ // empty tab
            conutEmptyTabs ++;
        }
    });

     
    if (options.length == conutEmptyTabs){ // all tabs is empty
        setEmptyTabLink();
    }
}

function createConfigSpace(lastTab){
    const option = $$("globalTabbar").getOption(lastTab);

    const treeConfig = option.info.tree;
    const tempConfig = option.info.temp;


    if (treeConfig){
        showTreeItem(treeConfig, true, option.isOtherView);
    }

    if (tempConfig){
        restoreTempData(tempConfig);
    }  
}






function remove(lastTab){

    setDefaultState();

    if (lastTab.length){
        emptyTabsLogic(lastTab);

        mediator.tables.filter.clearAll();

        createConfigSpace(lastTab);
        
    } else {   
        setEmptyTabLink();
        mediator.hideAllContent();

    }

    clearTree();

    setToStorage(lastTab);
}

export {
    add,
    remove
};
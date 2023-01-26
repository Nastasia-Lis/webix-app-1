
///////////////////////////////
//
// Медиатор                                                 (create mediator)
//
// Кнопка с историей и восстановлением последней вкладки    (create restore btn)
//
// Клик на таб                                              (create tab click logic)
//
// Восстановление утерянных вкладок после перезагрузки      (create restore data logic)
//
// layout кнопки добавления вкладки                         (create add btn layout)
//
// Добавление и удаление вкладок                            (create add tab logic)
//
// Layout панели вкладок                                    (create layout)
//
// Copyright (c) 2022 CA Expert
//
///////////////////////////////

import { Button }            from "../viewTemplates/buttons.js";
import { mediator }          from "../blocks/_mediator.js";
import { GetFields }         from "../blocks/globalStorage.js";
import { setFunctionError }  from "../blocks/errors.js";
import { Action }            from "../blocks/commonFunctions.js";
import { getTable }          from '../blocks/commonFunctions.js'; 
import { Popup }             from "../viewTemplates/popup.js";
import { setLogValue }       from "./logBlock.js";
import { modalBox }          from "../blocks/notifications.js";

//create mediator
const TABS_HISTORY  = [];
const TABS_REMOVED  = [];

function isOtherViewTab(id){
    const option = $$("globalTabbar").getOption (id);

    if (option && option.isOtherView){
        return true;
    }

}

function createTab(){
    $$("globalTabbar").addOption({
        id    : webix.uid(), 
        value : " ", 
        info  : {
        },
        close : true, 
    }, true);
    
}

function changeName(self, values){
    
    if (values && values.tree){
        const id = values.tree.field;
        self.changeTabName(id);
    }
   
}

function getFieldsname(id){
    const field    = GetFields.item(id);
    let name; 

    if (field){
        const plural   = field.plural ;
        const singular = field.singular ;
    
      
    
        if (field){
            name = plural ? plural : singular;
        } else {
            name = "Новая вкладка";
        }
    } else {
        setFunctionError(
            "Ссылки с id " + id + " не существует" , 
            "tabs/_tabMediator", 
            "getFieldsname"
        );
    }




    return name;
}

function setName(name){
    const tabbar   = $$("globalTabbar");
    const tabId    = tabbar.getValue   ();

    const tabIndex = tabbar.optionIndex(tabId);


    if (tabIndex > -1){
        tabbar.config.options[tabIndex].value = name;
        tabbar.refresh();
    }
}

function hasDirtyForms(){
    const forms = mediator.getForms();
    let check = {
        dirty:false
    };

    if (forms && forms.length){
        forms.forEach(function(form){

            if (form && form.isDirty() && !check.dirty){
                check = {
                    dirty : true,
                    id    : form.config.id
                };
            }
        });
    }

 
    return check;
}

function copyHistory(currHistory){
    
    let res = currHistory;

    
    if (currHistory.length > 4){
        res = res.slice(1);
    } 

    return res;
}

function checkAlreadyExists(history, currLastPage){
 
    const lastIndex = history.length - 1;
    const lastElem  = history[lastIndex];

    if (lastElem && lastElem.field == currLastPage.field){
        return true;
    }
 
}

function addLastPage(treeData, history){
    const lastPage = treeData;
    
    if (treeData && !treeData.none){ // isn't empty page
      
        const alreadyExists = checkAlreadyExists(history, lastPage);  //already exists in history
      
        if (!alreadyExists){
            mediator.tabs.addTabHistory(lastPage);
            history.push               (lastPage);  
        }
        
    } 
    
    return history;
}


function returnHistory(tabbar, tabIndex){
    const conf        = tabbar.config.options[tabIndex].info;
    const currHistory = conf.history;

    let history     = [];

    if (currHistory){
        history = copyHistory(currHistory); 
    } 

    history = addLastPage(conf.tree, history);

    return history;
}
function getTabConfig(){
    const tabbar = $$("globalTabbar");
    const id     = tabbar.getValue();
    return tabbar.getOption(id);
}

function unblockHistoryBtns(){
    const prevBtn = document.querySelector('.historyBtnLeft');
    const nextBtn = document.querySelector('.historyBtnRight');

    if (prevBtn && nextBtn){
        const option = getTabConfig();

        if (option){
            const history = option.info.history;
           
             if (history.length > 1){
                const id = prevBtn.getAttribute("view_id");
                
                Action.enableItem($$(id));
                


                // prev btn
            }

 
        }
       
    }
}

 
class Tabs {
    addTab(isNull, open = true){
        return add(isNull, open);
    }

    
    removeTab(lastTab){
        remove(lastTab);
    }

    setDataToStorage(tabbar, tabId){
        const options = tabbar.config.options;
                
        const data = {
            tabs   : options,
            select : tabId
        };
    
        webix.storage.local.put("tabbar", data);
    }
     
    

    isOtherViewTab(){
        const tabbar = $$("globalTabbar");
        const id     = tabbar.getValue();
        const option = $$("globalTabbar").getOption (id);
    
        if (option.isOtherView){
            return true;
        } 
    }

    clearTemp(name, type){
        webix.storage.local.remove(name);

        const tabbar = $$("globalTabbar");
        const idTab  = tabbar.getValue();
        const tab    = tabbar.getOption(idTab);
    
        if (tab.info.temp){
            if (type == "filter"){
                if (tab.info.temp.filter){
                    delete tab.info.temp.filter;
                }
            } else if (type == "edit"){
                if (tab.info.temp.edit){
                    delete tab.info.temp.edit;
                }
            }
            
        }
    }

    setInfo(values, addHistory=true){
  

        const tabbar = $$("globalTabbar");
        let tabId    = tabbar.getValue();
    

        if ( isOtherViewTab(tabId)){
            createTab();
            tabId = tabbar.getValue();
        }
       
        const tabIndex = tabbar.optionIndex(tabId);
 
        if (tabIndex > -1){

           
            const oldHistory = tabbar.config.options[tabIndex].info.history;
        
            tabbar.config.options[tabIndex].info = values;
            tabbar.refresh();


            changeName(this, values);


            
            if (addHistory){
                values.history = oldHistory;
                const history  = returnHistory(tabbar, tabIndex);
                values.history = history;
                
            }
        
            this.setDataToStorage(tabbar, tabId);
        }
    }

    getInfo(){
        const tabbar   = $$("globalTabbar");
        const tabId    = tabbar.getValue();
        const tabIndex = tabbar.optionIndex(tabId);

        return tabbar.config.options[tabIndex].info;
     
    }
    
    changeTabName(id, value){

        let name;
 
        if (!id && !value){
            name = "Новая вкладка";
        } else {
            if (id){
                name = getFieldsname(id);
            } else {
                name = value;
            }

         
      
        }
 
        setName(name);

    }

    setDirtyParam(){

        const tabbar = $$("globalTabbar");
        const id     = tabbar.getValue();
        const option = tabbar.getOption(id);

        if (option && option.info){
            option.info.dirty = hasDirtyForms().dirty;  
        }
    
     
    }

    openInNewTab(config){
        const newTabId = this.addTab();

        mediator.tabs.setInfo(config);

        tabbarClick("onBeforeTabClick", newTabId);
        tabbarClick("onAfterTabClick" , newTabId);
    }

    getTabHistory(){
        return TABS_HISTORY;
    }

    saveTabHistory(){
        const sentObj = {
            history : mediator.tabs.getTabHistory()
        };
    
        webix.storage.local.put("tabsHistory", sentObj);
    }

    addTabHistory(page){

        console.log()
      
        if (TABS_HISTORY.length > 10){
            TABS_HISTORY.shift();
        }

       
        unblockHistoryBtns();
        TABS_HISTORY.push(page);

        this.saveTabHistory();
    }

    removeTabHistoryPage(index){
        TABS_HISTORY.splice(index,  1);

        this.saveTabHistory();
    }

    clearTabHistory(){
        TABS_HISTORY.length = 0;

        this.saveTabHistory();
    }

    addRemovedTab(page){
        if (TABS_REMOVED.length > 10){
            TABS_REMOVED.shift();
        }
        TABS_REMOVED.push(page);
        
    }

    deleteOpenRemovedTab(index){
        TABS_REMOVED.splice(index,  1);
        
    }

    getRemovedTabs(){
        return TABS_REMOVED;
    }


    setHistoryBtnState(isNextBtn, enable = true){
        const id   = isNextBtn ? "Right" : "Left";
        const css  = `historyBtn${id}`;

        const node = document.querySelector(`.${css}`);
        
        if (node){
            const id  = node.getAttribute("view_id");

            if (enable){
                Action.enableItem($$(id));
            } else {
                Action.disableItem($$(id));
            }
           
        
        }
    }

 

}




//create restore btn

function getSelectedOption(){
    const radio      = $$("tabsHistoryList");
    const selectedId = radio.getValue();
    return radio.getOption(selectedId);
}


function returnEmptyOption(){
    return {   
        id       : "radioNoneContent", 
        disabled : true, 
        value    : "История пуста"
    };
}

function returnItem(config, index){
    
    const item = GetFields.item(config.field);
    const name = item.plural ? item.plural : item.singular;
  
    return {
        id    : webix.uid(),
        value : name,
        config: config,
        index : index
    };
   
}

function returnListItems(){
    const history = mediator.tabs.getTabHistory();
    const items = [];

    if (history && history.length){
     
        history.forEach(function(el, i){
            items.push(returnItem(el, i));
        });

    } else {
        items.push(returnEmptyOption());
    }

    return items;
}


function returnRadio(){
    const radio = {
        view     : "radio", 
        id       : "tabsHistoryList",
        vertical : true,
        options  : returnListItems(),
        on       : {
            onChange:function(newValue, oldValue){
                if (newValue !== oldValue){
                    Action.enableItem($$("tabsHistoryBtn"));
                }
            }
        }
    };

    return radio;
}

function returnRadioList(){
    const container = {
        view       : "scrollview",
        scroll     : "y",
        maxHeight  : 300,
        borderless : true,
        body       : {
            rows: [
                returnRadio()
            ]
        }
    };

    return container;
}


function openLink(){
    const option = getSelectedOption();
 
    const createConfig = {
        tree: option.config
    };

    mediator.tabs.openInNewTab(createConfig);

    Action.destructItem($$("popupTabsHistory"));
}

function returnOpenBtn(){
    const btn = new Button({
        config   : {
            id       : "tabsHistoryBtn",
            hotkey   : "Ctrl+Shift+Space",
            value    : "Открыть ссылку", 
            disabled : true,
            click    : function(){
                openLink();
            },
        },
        titleAttribute : "Открыть ссылку"
    
       
    }).maxView("primary");

    return btn;
}

function returnSuccessNotify(text){
    setLogValue ("succcess", text, '"expa'); 
}



function clearAllClick(){

    modalBox("История будет очищена полностью", 
        "Вы уверены?", 
        ["Отмена", "Продолжить"]
    )
    .then(function (result){
        if (result == 1){
            mediator.tabs.clearTabHistory();
            Action.destructItem($$("popupTabsHistory"));
            returnSuccessNotify("История успешно очищена");
        }

    });

}

function removeOptionState (option){
    const radio = $$("tabsHistoryList");
    try{

        option.value = option.value + " (запись удалена)";
        radio.refresh();
        
        radio.disableOption(option.id);

    } catch (err){
        setFunctionError(
            err, 
            "tabs / tabsHistory", 
            "removeOptionState"
        );
    }
}

function removeItemClick(){
    const option = getSelectedOption();
 
    if (option){
        const name = option.value;
        modalBox("Запись «" + name + "» будет удалена из истории", 
            "Вы уверены?", 
            ["Отмена", "Продолжить"]
        )
        .then(function (result){
            if (result == 1){
                
                mediator.tabs.removeTabHistoryPage(option.index);
                removeOptionState (option);
                returnSuccessNotify("Запись «" + name + "» удалена из истории");
            }
    
        });
    } else {
        webix.message({
            text :"Запись не выбрана",
            type :"error", 
        });
    }
 
   
}



function returnRemoveBtn(){
    const removeBtn = new Button({

        config   : {
            id       : "removeTabsHistory",
            hotkey   : "Alt+Shift+R",
            icon     : "icon-trash",
            popup   : {

                view    : 'contextmenu',
                css     : "webix_contextmenu",
                data    : [
                    { id: 'clearSingle', value: 'Удалить ссылку'   },
                    { id: 'clearAll',    value: 'Очистить историю' }
                ],
                on      : {
                    onItemClick: function(id){
                        if (id == "clearAll"){
                            clearAllClick();
                        } else if (id == "clearSingle"){
                            removeItemClick();
                            // проверить выбрана ли ссылка
                        }
     
                    }
                }
            },

        },
        titleAttribute : "Очистить историю / удалить выбранную ссылку"
       
    }).minView("delete");

    return removeBtn;
}


function openHistoryPopup(){
 
    const popup = new Popup({
        headline : "История",
        config   : {
            id    : "popupTabsHistory",
            width : 500,
    
        },

        elements : {
            rows : [
                returnRadioList(),
                {cols:[
                    returnOpenBtn(),
                    returnRemoveBtn()
                ]}
            ]
          
        }
    });

    popup.createView ();
    popup.showPopup  ();
}

function findLastRemovedTab(){
    const removedHistory = mediator.tabs.getRemovedTabs();

    if (removedHistory){
        const index = removedHistory.length - 1;
        const tab   =  removedHistory[index];

        mediator.tabs.deleteOpenRemovedTab(index);

        return tab;

    }

}

function openClosedTab(){
    const lastRemovedTabConfig = findLastRemovedTab();
    if (lastRemovedTabConfig){
        mediator.tabs.openInNewTab({tree:lastRemovedTabConfig});
    }
   
    
}

function tabsHistoryBtn(){
    const btn = new Button({
        
        config   : {
            id       : "historyTabBtn",
           // hotkey   : "Ctrl+Shift+A",
            icon     : "icon-file", //wxi-plus
            popup   : {

                view    : 'contextmenu',
               
                css     : "webix_contextmenu",
                data    : [
                    { id: 'addTab' , value: 'Новая вкладка'            },
                    { id: 'history', value: 'Открыть историю'          },
                    { id: 'restore', value: 'Открыть закрытую вкладку' },
                    { id: 'empty'  , value: '',                        }
                ],
                on      : {
                    onItemClick: function(id){
                        if (id == "addTab"){
                            mediator.tabs.openInNewTab({tree:{none:true}});

                        } else if (id == "history"){
                            openHistoryPopup();

                        } else if (id == "restore"){
                           openClosedTab();
                        }  
     
                    }
                }
            },
            // click    : function(){
            //     openHistoryPopup();
            // },
        },
        titleAttribute : "Действия с вкладками"
    
       
    }).transparentView();

    return btn;
}






//create tab click logic


function returnSelectElem(type){
   
    let selectElem; 
        
    if (type == "dbtable"){
        selectElem = "tables";

    } else if(type == "tform"){
        selectElem = "forms";

    } else if(type == "dashboard"){
        selectElem = "dashboards";
    // Action.hideItem($$("propTableView"));

    }  

    return selectElem;
}

function hideOtherElems(selectElem){
    const visiualElements = mediator.getViews();


    if (visiualElements && visiualElements.length){
        visiualElements.forEach(function(elem){
            if (elem !== selectElem){
                Action.hideItem($$(elem));
            } 
        });
    }

    Action.hideItem ($$("webix__null-content"));
    Action.hideItem ($$("webix__none-content"));

}


function showContent(selectElem, id){
    if (selectElem == "tables" || selectElem == "forms"){
        mediator.tables.showExists(id);
    } else if (selectElem == "dashboards"){
        mediator.dashboards.showExists(id);
    }

}

function selectTree(id, isOtherTab){
   
    const tree = $$("tree");
    if ( tree.exists(id) && isOtherTab){
        tree.config.isTabSelect = true;
        tree.select(id);
       // tree.showItem(id);
    }

    // if parent is closed ??
}

function setLink(id){

    const path = "tree/" + id;
    
    Backbone.history.navigate(path);
 
}

function setEmptyState(){
    mediator.hideAllContent();
    Backbone.history.navigate("tree/tab?new=true", { trigger : true });
    Action.showItem ($$("webix__none-content"));
}

function changeHistoryBtnsState(){
    const config = mediator.tabs.getInfo();
 
    if (config && config.history){
        const history  = config.history;
        const nextPage = config.nextPage;

        if (history.length > 1){
            mediator.tabs.setHistoryBtnState(false);
        } else {
            mediator.tabs.setHistoryBtnState(false, false);
        }
 
        if (nextPage){
            mediator.tabs.setHistoryBtnState(true);
        } else {
            mediator.tabs.setHistoryBtnState(true, false);
        }
 
    }
    
}

function showTreeItem(config, isOtherTab, isOtherView){

    if (isOtherView){
        Backbone.history.navigate("/" + config.view, { trigger : true });
    } else {

        const id              = config.field;
        const type            = config.type;
    
        if (config.none){ //none-content
            setEmptyState();

        } else {
            const selectElem = returnSelectElem(type);

            hideOtherElems(selectElem);

            Action.showItem ($$(selectElem));
    

            if (id){
                setLink    (id);
                showContent(selectElem, id);
                selectTree (id, isOtherTab);

            }

        }


        changeHistoryBtnsState();
       
    }

}







//create restore data logic

function restoreTempData(tempConfig, field){
  
    const filter = tempConfig.filter;
    const edit   = tempConfig.edit;

    if (filter){
    
        if (filter.dashboards){
            const data = {
                content : filter.values
            };
            
            webix.storage.local.put("dashFilterState", data);
        } else {
       
            if (tempConfig.queryFilter){
                const table = getTable();
                if (table){
                    table.config.filter = {
                        table : filter.id,
                        query : tempConfig.queryFilter
                    };
                  
                }

             
            }
            webix.storage.local.put("currFilterState", filter);
        }
    
        window.history.pushState('', '', "?view=filter");
  
    }  
 
    if (edit){
         
        webix.storage.local.put("editFormTempData", edit.values);
        if (edit.selected){
            window.history.pushState('', '', "?id=" + edit.selected);
        }

    }


   
}







//create add btn layout

function createAddBtn(){
    const btn = new Button({
    
        config   : {
            id       : "addTabBtn",
           // hotkey   : "Ctrl+Shift+A",
            icon     : "icon-plus", //wxi-plus
            click    : function(){
                mediator.tabs.addTab();
            },
        },
        titleAttribute : "Добавить вкладку"
    
       
    }).transparentView();

    return btn;
}






//create add tab logic


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
    if (options && options.length){
        options.forEach(function(el, i){
            if (el.info && el.info.tree && el.info.tree.none){ // empty tab
                conutEmptyTabs ++;
            }
        });
    }
  
     
    if (options.length == conutEmptyTabs){ // all tabs is empty
        setEmptyTabLink();
    }
}

function createConfig(lastTab){
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

        createConfig(lastTab);
        
    } else {   
        setEmptyTabLink();
        mediator.hideAllContent();

    }

    clearTree();

    setToStorage(lastTab);
}






//create layout


let prevValue;

function setStateToStorage(idTab){
    const tabbar  = $$("globalTabbar");
    const options = tabbar.config.options;
    
 
    const data = {
        tabs   : options,
        select : idTab
    };

    webix.storage.local.put("tabbar", data);
}

function isOtherTab(id){
    let check = true;

    if (id == prevValue){
        check = false;
    }

    return check;
}

function createConfigSpace(id){
    const option     = $$("globalTabbar").getOption(id);
  
    const treeConfig = option.info.tree;
    const tempConfig = option.info.temp;
  
    if (treeConfig){
        showTreeItem(
            treeConfig, 
            isOtherTab(), 
            option.isOtherView
        );

 
        if (tempConfig){
            restoreTempData(
                tempConfig, 
                treeConfig.field
            );
        }
    }    
}

function tabbarClick(ev, id){
    $$("globalTabbar").callEvent(ev, [ id ]);
}



function restoreTabbar(data){
    const tabbar = $$("globalTabbar");
    const tabs   = data.tabs;
    const select = data.select;

    if (tabs && tabs.length){
        tabs.forEach(function(option){
            tabbar.addOption(option, false); 
        });
    }
   
  
    if (select){
    
        tabbar.setValue(select);
 
        tabbarClick("onBeforeTabClick", select);
   
        tabbarClick("onAfterTabClick" , select);
  
    } else {
        const options = tabbar.config.options;
        const index   = options.length - 1;
        const lastOpt = options[index]; 
        if (lastOpt){
            const id  = lastOpt.id;
            tabbar.setValue(id);
        }

   
    }
}

function addNewTab(){
    $$("globalTabbar").addOption( { 
        id    : "container", 
        value : "Новая вкладка", 
        info  : {},
        close : true
    }, true); 
}


function isSelectedOption(id){
    const selectOpt = $$("globalTabbar").getValue();
    if ( selectOpt == id ){
        return true;
    }
}




function createTabbar(){
    const tabbar = {
        view    : "tabbar",
        id      : "globalTabbar",
        css     : "global-tabbar",
        value   : "container",
        tooltip : "#value#",
        optionWidth: 300,
        multiview  : true, 
        options : [
           
        ],
        on:{


            onBeforeTabClick:function(){
        
                const clearDirty = false;
                mediator.tables     .defaultState("edit", clearDirty);
                
                mediator.tables     .defaultState("filter");
                
                mediator.dashboards .defaultState();
               
                mediator.forms      .defaultState();

                prevValue = this.getValue();
         
            },

            onAfterTabClick:function(id){
            
                mediator.tables.filter.clearAll();

                createConfigSpace(id);

                setStateToStorage(id);
        
            },


            setStorageData:function(){
                const data  = webix.storage.local.get("tabbar");
          
                
                if (data && data.tabs.length){
                 
                    restoreTabbar(data);
                  
                } else {
                    addNewTab();
                }
            },

            onBeforeTabClose: function(id){
               
                const tabConfig = this.getOption(id);
                if (tabConfig && tabConfig.info){
                    mediator.tabs.addRemovedTab(tabConfig.info.tree);
                }
                
                const tabbar     = this;
                const option     = tabbar.getOption(id);
                const isTabDirty = option.info.dirty;
   

                if (isSelectedOption(id)){ // текущая вкладка

                    mediator.getGlobalModalBox().then(function(result){

                        if (result){
                            tabbar.removeOption(id);
                        }
    
                    });

                } else { // другая вкладка
        
                    if (isTabDirty){
                        tabbar.setValue(id);
                 
                        tabbarClick("onBeforeTabClick", id);
                        tabbarClick("onAfterTabClick" , id);
    
                        const optionData = mediator.tabs.getInfo();
                        optionData.isClose = true;
                        mediator.tabs.setInfo(optionData);
                    } else {
                        tabbar.removeOption(id);
                    }
              
                } 
            
                return false;
            },

            // onOptionAdd:function(){
            //     this.config.addedTabs ++; 

            // },

            onOptionRemove:function(removedTab, lastTab){
      
                mediator.tabs.removeTab(lastTab);

            },

           
          
        }
     
    };

    const layout = {
        cols:[
            createAddBtn(),
            tabbar,
            tabsHistoryBtn()
        ]
    };

    return layout;
}

export{
    createTabbar,
    Tabs
};
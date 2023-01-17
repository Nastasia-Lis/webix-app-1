
import { add, remove }          from "./actions.js";
import { GetFields }            from "../../blocks/globalStorage.js";
import { setFunctionError }     from "../../blocks/errors.js";
import { mediator }             from "../../blocks/_mediator.js";
 
 
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

    if (forms){
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

function tabbarClick(ev, id){
    $$("globalTabbar").callEvent(ev, [ id ]);
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

            if (addHistory){
                const history  = returnHistory(tabbar, tabIndex);
                values.history = history;
                
            }
           
            tabbar.config.options[tabIndex].info = values;
            tabbar.refresh();

            changeName(this, values);
        
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
        if (TABS_HISTORY.length > 10){
            TABS_HISTORY.shift();
        }
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

 

}

export {
    Tabs
};

import { add, remove }          from "./actions.js";
import { GetFields }            from "../../blocks/globalStorage.js";
import { setFunctionError }     from "../../blocks/errors.js";
import { mediator }             from "../../blocks/_mediator.js";

function isOtherViewTab(id){
    const option = $$("globalTabbar").getOption (id);

    if (option.isOtherView){
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

    setInfo(values){
  
     
        const tabbar = $$("globalTabbar");
        let tabId = tabbar.getValue();

        if ( isOtherViewTab(tabId)){
            createTab();
            tabId = tabbar.getValue();
        }
       
        const tabIndex = tabbar.optionIndex(tabId);
 
        if (tabIndex > -1){

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
}

export {
    Tabs
};
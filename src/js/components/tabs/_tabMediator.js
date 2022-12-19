
import { add, remove }  from "./actions.js";
import { GetFields }    from "../../blocks/globalStorage.js";

class Tabs {
    addTab(){
        add();
    }

    removeTab(id){
        remove(id);
    }

    setInfo(values){
        const tabbar   = $$("globalTabbar");
        const tabId    = tabbar.getValue();
        const tabIndex = tabbar.optionIndex(tabId);
        tabbar.config.options[tabIndex].info = values;
        tabbar.refresh();
    }

    getInfo(){
        const tabbar   = $$("globalTabbar");
        const tabId    = tabbar.getValue();
        const tabIndex = tabbar.optionIndex(tabId);
        return tabbar.config.options[tabIndex].info;
     
    }
    
    changeTabName(id, value){
        let name;

        if (id){
            const field = GetFields.item(id);
            if (field){
                name = field.plural ? field.plural : field.singular;
            } else {
                name = "Новая вкладка";
            }
      
           
        } else {
            name = value;
        }
        const tabbar   = $$("globalTabbar");
        const tabId    = tabbar.getValue   ();
        const tabIndex = tabbar.optionIndex(tabId);

        tabbar.config.options[tabIndex].value = name;
        tabbar.refresh();
    }
}

export {
    Tabs
};
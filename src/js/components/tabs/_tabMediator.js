
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

        if (tabIndex > -1){

            tabbar.config.options[tabIndex].info = values;
            tabbar.refresh();

            if (values && values.tree){
                const id = values.tree.field;
                this.changeTabName(id);
            }

        
            const options = tabbar.config.options;
            
            const data = {
                tabs   : options,
                select : tabId
            };

            webix.storage.local.put("tabbar", data);
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
                const field = GetFields.item(id);
                if (field){
                    name = field.plural ? field.plural : field.singular;
                } else {
                    name = "Новая вкладка";
                }
          
               
            } else {
                name = value;
            }
      
        }
      
        const tabbar   = $$("globalTabbar");
        const tabId    = tabbar.getValue   ();
  
        const tabIndex = tabbar.optionIndex(tabId);

   
        if (tabIndex > -1){
            tabbar.config.options[tabIndex].value = name;
            tabbar.refresh();
        }

    }
}

export {
    Tabs
};
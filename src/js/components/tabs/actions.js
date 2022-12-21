import { mediator } from "../../blocks/_mediator.js";
import { Action }   from "../../blocks/commonFunctions.js";

function add(){
    const tabbar = $$("globalTabbar");
    const id     = webix.uid();

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

    tabbar.showOption(id);

    const visiualElements = mediator.getViews();

    
    visiualElements.forEach(function(elem){

        Action.hideItem($$(elem));

    });


    

   const options = $$("globalTabbar").config.options;
 
    if (options){

        const data = {
            tabs   : options,
        };

        webix.storage.local.put   ("tabbar", data);
    } else {
        webix.storage.local.remove("tabbar");
    }
    

    Action.showItem ($$("webix__none-content"));
    Action.hideItem ($$("webix__null-content"));
    Backbone.history.navigate("tree/tab?new=true", { trigger : true });
 //   window.history.pushState('', '', "?new=true");
}

function remove(){
    console.log('remove')
}

export {
    add,
    remove
};
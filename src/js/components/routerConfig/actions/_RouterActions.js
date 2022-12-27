import { Action }           from "../../../blocks/commonFunctions.js";
import { mediator }         from "../../../blocks/_mediator.js";

import { hideAllElements }  from "./hideAllElements.js";
import { createContent }    from "./createContent.js";
import { createElements }   from "./createElements.js";

class RouterActions {
    static hideEmptyTemplates(){
        Action.removeItem($$("webix__null-content"));
        Action.hideItem  ($$("webix__none-content"));     
    }

    static hideContent   (){
        hideAllElements();
    }

    static async createContentSpace (){
        await createContent  ();
    }

    static async loadSpace(){
        const isSidebarData = mediator.sidebar.dataLength();

        if (!isSidebarData){
            await createContent();
        }
    }

    static createContentElements(id){
        createElements (id);
    }

}

export {
    RouterActions
};
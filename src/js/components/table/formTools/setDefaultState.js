import { Action }     from "../../../blocks/commonFunctions.js";

function toolsDefState(){
    const property = $$("propTableView");
    
    if (property && property.isVisible()){
        property.clear();
        Action.hideItem(property);
    }
   
    Action.hideItem($$("formsTools"    ));
    Action.showItem($$("formsContainer"));

}

export {
    toolsDefState
};


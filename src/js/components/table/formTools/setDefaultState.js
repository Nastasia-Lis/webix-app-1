import { Action }                     from "../../../blocks/commonFunctions.js";

function toolsDefState(){
    const formsTools     = $$("formsTools");
    const formsContainer = $$("formsContainer");

    Action.hideItem(formsTools);
    Action.showItem(formsContainer);

}

export {
    toolsDefState
};


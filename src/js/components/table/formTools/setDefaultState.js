import { Action }     from "../../../blocks/commonFunctions.js";

function toolsDefState(){
    Action.hideItem($$("formsTools"    ));
    Action.showItem($$("formsContainer"));

}

export {
    toolsDefState
};


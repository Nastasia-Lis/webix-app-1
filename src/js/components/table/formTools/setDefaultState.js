 
///////////////////////////////

// Дефолтное состояние компонента с динамич. полями в формах

// Copyright (c) 2022 CA Expert

///////////////////////////////

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


 
///////////////////////////////

// Layout таба с выбором шаблона

// Copyright (c) 2022 CA Expert

///////////////////////////////


import { Action }   from "../../../../../blocks/commonFunctions.js";
import { Filter }   from "../../actions/_FilterActions.js";

function onChangeLibBtn (){
    const submitBtn = $$("popupFilterSubmitBtn");

    const template      = Filter.getActiveTemplate();
    const selectedValue = template ? template : null;

    const lib        = $$("filterEditLib");
    const libValue   = lib.getValue ();
    const radioValue = lib.getOption(libValue);

    if (radioValue && radioValue.id !== selectedValue){
        Action.enableItem ($$("editFormPopupLibRemoveBtn"));
        Action.enableItem (submitBtn);
    } else {
        Action.disableItem(submitBtn);
    }


}

const radioLibBtn =  {   
    view    : "radio", 
    id      : "filterEditLib",
    vertical: true,
    options : [],
    on      : {
        onChange: function(){
            onChangeLibBtn ();
        }
    }
};

const tabLibrary = {  
    view        : "form", 
    scroll      : true ,
    id          : "editFormPopupLib",
    css         : "webix_multivew-cell",
    borderless  : true,
    elements    : [
        radioLibBtn
    ],

};


export {
    tabLibrary
};
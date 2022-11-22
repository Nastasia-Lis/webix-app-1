import { Action }           from "../../../../../blocks/commonFunctions.js";
import { SELECT_TEMPLATE }  from "../../userTemplate.js";


function onChangeLibBtn (){
    const submitBtn = $$("popupFilterSubmitBtn");

    const selectedValue = SELECT_TEMPLATE.id;

    const lib        = $$("filterEditLib");
    const libValue   = lib.getValue ();
    const radioValue = lib.getOption(libValue);

    if (radioValue && radioValue.id !== selectedValue){
        Action.enableItem($$("editFormPopupLibRemoveBtn"));
        Action.enableItem (submitBtn);
    } else {
        Action.disableItem (submitBtn);
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

import { propertyLayout }   from "./property.js";
import { editFormBtns }     from "./buttons.js";
import { mediator }         from "../../../blocks/_mediator.js";

const editForm = {
    view        : "form", 
    id          : "table-editForm",
    hidden      : true,
    css         : "webix_form-edit",
    minHeight   : 350,
    minWidth    : 230,
    borderless  : true,
    scroll      : true,
    elements    : [
        editFormBtns,
        propertyLayout,  
    
    ],
    on:{
        onViewShow: webix.once(function(){
            this.config.width = 350;
            this.resize();
            mediator.setForm(this);
        }),
    },
   
    rules       : {
        $all:webix.rules.isNotEmpty
    },

    ready       : function(){
        this.validate();
    },

};



function editTableBar (){
    return editForm;
      
}


export {
    editTableBar
};
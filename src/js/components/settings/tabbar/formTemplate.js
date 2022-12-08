 
import { Action }    from "../../../blocks/commonFunctions.js";
import { mediator }  from "../../../blocks/_mediator.js";

function returnFormTemplate(id, elems){
    const form =  {    
        view       : "form", 
        id         : id,
        borderless : true,
        elements   : [
            {cols  : elems},
        ],
    
        on        :{
            onViewShow: webix.once(function(){
               mediator.setForm(this);
            }),
    
            onChange:function(){
                const form     = this;
                const isDirty  = form.isDirty();

                const saveBtn  = $$("userprefsSaveBtn");
                const resetBtn = $$("userprefsResetBtn");
 
    
                function setSaveBtnState(){
                    if ( isDirty ){
                        Action.enableItem(saveBtn);
    
                    } else if ( !isDirty ){
                        Action.disableItem(saveBtn);
    
                    }
                }
    
                function setResetBtnState(){
                    if (isDirty){
                        Action.enableItem(resetBtn);
    
                    } else if ( !isDirty ){
                        Action.disableItem(resetBtn);
    
                    }  
                 
                }
          
                setSaveBtnState ();
                setResetBtnState();
            }
        },
    
        
    };

    return form;
}

export {
    returnFormTemplate
};
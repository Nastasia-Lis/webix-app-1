import { Action }             from "../../../blocks/commonFunctions.js";
import { setFunctionError }   from "../../../blocks/errors.js";


function hideAllElements (){

    try {
        const container = $$("container");
        const childs    = container.getChildViews();
        
        childs.forEach(function(el){
            const view = el.config.view;
            if(view == "scrollview" || view == "layout"){
                Action.hideItem($$(el.config.id));
            }
        });
    } catch (err){
        setFunctionError(
            err,
            "routerConfig => hideAllElements",
            "hideAllElements"
        );
    }
  
     
}

export {
    hideAllElements
};
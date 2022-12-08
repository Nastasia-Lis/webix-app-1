
import { GetMenu }          from "../../blocks/globalStorage.js";
import { setFunctionError }  from "../../blocks/errors.js";

const logNameFile = "treeSidebar => navigate";

function getFields (id){
    const menu  = GetMenu.content;
    
    if (menu){
        try{
            Backbone.history.navigate("tree/" + id, { trigger : true });
        } catch (err){
            setFunctionError(err, logNameFile, "getFields");
        }
    }
}

export {
    getFields
};
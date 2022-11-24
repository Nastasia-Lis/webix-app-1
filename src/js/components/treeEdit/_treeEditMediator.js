
import { editTreeLayout }     from "./_layout.js";
import { contextMenu }        from "./contextMenu.js";
import { getInfoEditTree }    from "./getInfoEditTree.js";

import { setFunctionError }   from "../../blocks/errors.js";
import { Action }             from "../../blocks/commonFunctions.js";

const logNameFile = "treeEdit => _treeEditMediator";

class TreeEdit {
    constructor (){
        this.name = "treeTempl";
    }

    create(){
        try{
            if (!$$(this.name)){
                $$("container").addView(
                    {   view:"layout",
                        id:this.name, 
                        hidden:true, 
                        scroll:"auto",
                        rows: editTreeLayout()
                    },
                4);
                
                webix.ui(contextMenu());
            }
          
        } catch (err){
            setFunctionError(
                err,
                logNameFile,
                "createTreeTempl"
            );
        }
    }

    showView(){
        Action.showItem($$(this.name));   
    }

    load(){
        getInfoEditTree();
    }

}


export {
    TreeEdit
};
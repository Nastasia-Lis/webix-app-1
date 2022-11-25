import { Action }               from "../../blocks/commonFunctions.js";
import { setFunctionError }     from "../../blocks/errors.js";
import { treeSidebar }          from "./_layout.js";
import { generateMenuTree }     from "./loadMenu.js";
import { selectElem }           from "./selectVisualElem.js";

const logNameFile = "treeSidebar => treeMediator";

class Tree {
    constructor (){
        this.name = "tree";
    }

    create(){
        return treeSidebar();
    }

    showView(){
        Action.showItem($$(this.name));   
    }

    load(data){
        generateMenuTree(data);
    }

    selectItem(id){
        return selectElem(id);
    }

    dataLength(){
        return $$(this.name).data.order.length;
    }

    close(){
        const tree = $$(this.name);
        try{
            if (tree){
                tree.closeAll();
            }
        } catch (err){
            setFunctionError(
                err,
                logNameFile,
                "close"
            );
        }
    }

    // defaultState(){
    //     editTableDefState ();
    //     filterFormDefState();
    // }

}


export {
    Tree
};
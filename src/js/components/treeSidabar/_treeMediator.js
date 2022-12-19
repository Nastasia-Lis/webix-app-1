import { Action }               from "../../blocks/commonFunctions.js";
import { treeSidebar }          from "./_layout.js";
import { generateMenuTree }     from "./loadMenu.js";
import { selectElem }           from "./selectVisualElem.js";


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

    close (){
        const tree = $$(this.name);

        if (tree){
            tree.closeAll();
        }

    }

    clear (){
        const tree = $$(this.name);
    
        if (tree){
            tree.clearAll();
        }

    }

}


export {
    Tree
};
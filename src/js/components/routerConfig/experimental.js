import { mediator }          from "../../blocks/_mediator.js";
import { RouterActions }     from "./actions/_RouterActions.js";

function loadSpace(){
    const isTreeData = mediator.sidebar.dataLength();
    if (!isTreeData){
        RouterActions.createContentSpace();
    }
}

function createTreeTemplate(){
    const id = "treeTempl";
    if (!$$(id)){
        RouterActions.createContentElements(id);
    }

    mediator.treeEdit.showView();
    mediator.treeEdit.load();
}


function experimentalRouter(){
    RouterActions.hideEmptyTemplates();
   
    RouterActions.hideContent();

    loadSpace          ();
    
    createTreeTemplate ();
    
    mediator.sidebar.close();
}


export {
    experimentalRouter
};
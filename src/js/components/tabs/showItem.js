import { mediator }          from "../../blocks/_mediator.js";
import { Action }            from "../../blocks/commonFunctions.js";

function returnSelectElem(type){
   
    let selectElem; 
        
    if (type == "dbtable"){
        selectElem = "tables";

    } else if(type == "tform"){
        selectElem = "forms";

    } else if(type == "dashboard"){
        selectElem = "dashboards";
    // Action.hideItem($$("propTableView"));

    }  

    return selectElem;
}

function hideOtherElems(selectElem){
    const visiualElements = mediator.getViews();


    if (visiualElements && visiualElements.length){
        visiualElements.forEach(function(elem){
            if (elem !== selectElem){
                Action.hideItem($$(elem));
            } 
        });
    }

    Action.hideItem ($$("webix__null-content"));
    Action.hideItem ($$("webix__none-content"));

}


function showContent(selectElem, id){
    if (selectElem == "tables" || selectElem == "forms"){
        mediator.tables.showExists(id);
    } else if (selectElem == "dashboards"){
        mediator.dashboards.showExists(id);
    }

}

function selectTree(id, isOtherTab){
   
    const tree = $$("tree");
    if ( tree.exists(id) && isOtherTab){
        tree.config.isTabSelect = true;
        tree.select(id);
       // tree.showItem(id);
    }

    // if parent is closed ??
}

function setLink(id){

    const path = "tree/" + id;
    
    Backbone.history.navigate(path);
 
}

function setEmptyState(){
    mediator.hideAllContent();
    Backbone.history.navigate("tree/tab?new=true", { trigger : true });
    Action.showItem ($$("webix__none-content"));
}

function changeHistoryBtnsState(){
    const config = mediator.tabs.getInfo();
 
    if (config && config.history){
        const history  = config.history;
        const nextPage = config.nextPage;

        if (history.length > 1){
            mediator.tabs.setHistoryBtnState(false);
        } else {
            mediator.tabs.setHistoryBtnState(false, false);
        }
 
        if (nextPage){
            mediator.tabs.setHistoryBtnState(true);
        } else {
            mediator.tabs.setHistoryBtnState(true, false);
        }
 
    }
    
}

function showTreeItem(config, isOtherTab, isOtherView){

    if (isOtherView){
        Backbone.history.navigate("/" + config.view, { trigger : true });
    } else {

        const id              = config.field;
        const type            = config.type;
    
        if (config.none){ //none-content
            setEmptyState();

        } else {
            const selectElem = returnSelectElem(type);

            hideOtherElems(selectElem);

            Action.showItem ($$(selectElem));
    

            if (id){
                setLink    (id);
                showContent(selectElem, id);
                selectTree (id, isOtherTab);

            }

        }


        changeHistoryBtnsState();
       
    }

}

export {
    showTreeItem
};
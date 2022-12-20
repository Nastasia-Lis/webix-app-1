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


    if (visiualElements){
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
    }
}

function setLink(id){
    console.log(id)


    const path = "tree/" + id;
    Backbone.history.navigate(path, { trigger : true });
    const search = window.location.search;
    // if (search.length){
    //     const link    = window.location.href;
    //     const index   = link.lastIndexOf("?");
    //     const newLink = link.slice(0, index);
    //     console.log(newLink)
      
    // }


  
    // const params    = new URLSearchParams(search);
    // const param = params.get("new"); 
    // console.log(search)
    // if (param){
        
    //     params.delete('new');
    // }

   
}

function setEmptyState(){
    mediator.hideAllContent();
    window.history.pushState('', '', "?new=true");
  
    Action.showItem ($$("webix__none-content"));
}


function showTreeItem(config, isOtherTab){
    const id              = config.field;
    const type            = config.type;
 
    if (config.none){ //none-content
        setEmptyState();

    } else {
        const selectElem = returnSelectElem(type);

        hideOtherElems(selectElem);

        Action.showItem ($$(selectElem));
  

        if (id){
            showContent(selectElem, id);
            setLink    (id);
            selectTree (id, isOtherTab);

        }

    }
   

}

export {
    showTreeItem
};
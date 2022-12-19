import { createAddBtn }         from "./logic.js";
import { mediator }             from "../../blocks/_mediator.js";
import { getTable, Action }     from "../../blocks/commonFunctions.js";

function showTreeItem(config){
    const id   = config.field;
    const type = config.type;


    const visiualElements = mediator.getViews();
 
    let selectElem;
    if (type == "dbtable"){
        selectElem = "tables";

    } else if(type == "tform"){
        selectElem = "forms";

    } else if(type == "dashboard"){
        selectElem = "dashboards";
       // Action.hideItem($$("propTableView"));

    } 

    visiualElements.forEach(function(elem){
        if (elem !== selectElem){
            Action.hideItem($$(elem));
        } 

        if (elem == id){
            Action.removeItem($$("webix__null-content"));
            Action.showItem  ($$("webix__none-content"));
        }
    });


    Action.showItem($$(selectElem));


    const tree = $$("tree");
    
    if (id){
        if (selectElem == "tables" || selectElem == "forms"){
            mediator.tables.showExists(id);
        }
        Backbone.history.navigate("tree/" + id, { trigger : true });
    }

    tree.config.isTabSelect = true;
    tree.select(id);

}

function restoreTempData(tempConfig){
    console.log(tempConfig)
}

function createTabbar(){
    const tabbar = {
        view    : "tabbar",
        id      : "globalTabbar",
        css     : "global-tabbar",
        value   : "container",
        tooltip : "#value#",
        optionWidth: 300,
        multiview  : true, 
        options : [
            { 
                id    : "container", 
                value : "Имя вкладки", 
                info  : {},
                close : true
            },
        ],
        on:{
            onItemClick:function(){
                webix.message({
                    text  :"Блок находится в разработке",
                    type  :"debug", 
                    expire: 10000,
                });
            },
            onBeforeTabClick:function(id){
        

              
          
                mediator.tables.filter.clearAll();

                const option = this.getOption(id);

                const treeConfig = option.info.tree;
                const tempConfig = option.info.temp;

                if (treeConfig){
                    showTreeItem(treeConfig);
                }

                if (tempConfig){
                    restoreTempData(tempConfig);
                }
            },

        }
     
    };

    const layout = {
        cols:[
            createAddBtn(),
            tabbar,
        ]
    };

    return layout;
}

export{
    createTabbar
};
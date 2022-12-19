import { createAddBtn }  from "./logic.js";
import { mediator }      from "../../blocks/_mediator.js";

function showTreeItem(config){
    console.log(config)
    // показать элемент но не загружать с сервера
    //mediator.sidebar.selectItem(config.field);
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
                const option = this.getOption(id);

                const treeConfig = option.info.tree;
                if (treeConfig){
                    showTreeItem(treeConfig);
                }
            }
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
import { createAddBtn }      from "./logic.js";
import { mediator }          from "../../blocks/_mediator.js";
import { restoreTempData }   from "./restoreTempData.js";
import { showTreeItem }      from "./showItem.js";


let prevValue;



function setStateToStorage(idTab){
    const tabbar  = $$("globalTabbar");
    const options = tabbar.config.options;
    

    const data = {
        tabs   : options,
        select : idTab
    };

    webix.storage.local.put("tabbar", data);
}

function setEmptyTabLink(){
    Backbone.history.navigate("tree/tab?new=true", { trigger : true });
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
           
        ],
        on:{

            onBeforeTabClick:function(id){
                mediator.tables     .defaultState();
                mediator.dashboards .defaultState();
                mediator.forms      .defaultState();
                prevValue = this.getValue();
            },

            onAfterTabClick:function(id){

                let isOtherTab = true;

                if (id == prevValue){
                    isOtherTab = false;
                }

                mediator.tables.filter.clearAll();

                const option = this.getOption(id);

                const treeConfig = option.info.tree;
                const tempConfig = option.info.temp;

                if (treeConfig){
                    showTreeItem(treeConfig, isOtherTab, option.isOtherView);

             
                    if (tempConfig){
                        restoreTempData(tempConfig, treeConfig.field);
                    }
                }
 

                setStateToStorage(id);

            },

            onAfterRender:webix.once(function(id){
                const data   = webix.storage.local.get("tabbar");
                const tabbar = $$("globalTabbar");

                if (data){
                    const tabs   = data.tabs;
                    const select = data.select;
                 
                    tabs.forEach(function(option, i){
                        tabbar.addOption(option, false); 
                    });

                    
                    if (select){
                        tabbar.setValue(select);

                    } else {
                        const options = this.config.options;
                        const index   = options.length - 1;
                        const lastOpt = options[index]; 
                        if (lastOpt){
                            const id  = lastOpt.id;
                            this.setValue(id);
                        }
                
                   
                    }
                    
                
                } else {
                    this.addOption( { 
                        id    : "container", 
                        value : "Имя вкладки", 
                        info  : {},
                        close : true
                    }, true); 
                }
            }),
            
            // сделать параметр для единственной пустой вкладки

            onOptionRemove:function(removedTab, lastTab){
              
                const tabbar = this;

                if (lastTab.length){
              
                    tabbar.setValue(lastTab);
                    const options = tabbar.config.options;
            
                    let conutEmptyTabs = 0;
                    options.forEach(function(el, i){
                        if (el.info.tree.none){ // empty tab
                            conutEmptyTabs ++;
                        }
                    });

                     
                    if (options.length == conutEmptyTabs){ // all tabs is empty
                        setEmptyTabLink();
                    }


                    mediator.tables.filter.clearAll();

                    const option = this.getOption(lastTab);
    
                    const treeConfig = option.info.tree;
                    const tempConfig = option.info.temp;

                  
    
                    if (treeConfig){
                        showTreeItem(treeConfig, true, option.isOtherView);
                    }
    
                    if (tempConfig){
                        restoreTempData(tempConfig);
                    }
                } else {   
                    setEmptyTabLink();
                    mediator.hideAllContent();

                }

                setStateToStorage(lastTab);
           
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
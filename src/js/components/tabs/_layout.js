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

function isOtherTab(id){
    let check = true;

    if (id == prevValue){
        check = false;
    }

    return check;
}

function createConfigSpace(id){
    const option     = $$("globalTabbar").getOption(id);
  
    const treeConfig = option.info.tree;
    const tempConfig = option.info.temp;
  
    if (treeConfig){
        showTreeItem(
            treeConfig, 
            isOtherTab(), 
            option.isOtherView
        );

 
        if (tempConfig){
            restoreTempData(
                tempConfig, 
                treeConfig.field
            );
        }
    }    
}

function tabbarClick(ev, id){
    $$("globalTabbar").callEvent(ev, [ id ]);
}



function restoreTabbar(data){
    const tabbar = $$("globalTabbar");
    const tabs   = data.tabs;
    const select = data.select;
 
    tabs.forEach(function(option){
        tabbar.addOption(option, false); 
    });

  
    if (select){
  
        tabbar.setValue(select);

        tabbarClick("onBeforeTabClick", select);
        tabbarClick("onAfterTabClick" , select);
 
    } else {
        const options = tabbar.config.options;
        const index   = options.length - 1;
        const lastOpt = options[index]; 
        if (lastOpt){
            const id  = lastOpt.id;
            tabbar.setValue(id);
        }

   
    }
}

function addNewTab(){
    $$("globalTabbar").addOption( { 
        id    : "container", 
        value : "Новая вкладка", 
        info  : {},
        close : true
    }, true); 
}


function isSelectedOption(id){
    const selectOpt = $$("globalTabbar").getValue();
    if ( selectOpt == id ){
        return true;
    }
}




function createTabbar(){
    const tabbar = {
        view    : "tabbar",
        id      : "globalTabbar",
        css     : "global-tabbar",
        value   : "container",
        tooltip : "#value#",
      //  addedTabs:0,
        optionWidth: 300,
        multiview  : true, 
        options : [
           
        ],
        on:{

            onBeforeTabClick:function(){
        
                const clearDirty = false;
                mediator.tables     .defaultState("edit", clearDirty);
                mediator.tables     .defaultState("filter");

                mediator.dashboards .defaultState();
                mediator.forms      .defaultState();

                prevValue = this.getValue();
            },

            onAfterTabClick:function(id){
            
                mediator.tables.filter.clearAll();

                createConfigSpace(id);

                setStateToStorage(id);
        
            },


            setStorageData:function(){
                const data  = webix.storage.local.get("tabbar");
               
                if (data && data.tabs.length){
                    restoreTabbar(data);
                    
                } else {
                    addNewTab();
                }
            },

            onBeforeTabClose: function(id){
             
                
                const tabbar     = this;
                const option     = tabbar.getOption(id);
                const isTabDirty = option.info.dirty;
   

                if (isSelectedOption(id)){ // текущая вкладка

                    mediator.getGlobalModalBox().then(function(result){

                        if (result){
                            tabbar.removeOption(id);
                        }
    
                    });

                } else { // другая вкладка
        
                    if (isTabDirty){
                        tabbar.setValue(id);
                 
                        tabbarClick("onBeforeTabClick", id);
                        tabbarClick("onAfterTabClick" , id);
    
                        const optionData = mediator.tabs.getInfo();
                        optionData.isClose = true;
                        mediator.tabs.setInfo(optionData);
                    } else {
                        tabbar.removeOption(id);
                    }
              
                } 
            
                return false;
            },

            // onOptionAdd:function(){
            //     this.config.addedTabs ++; 

            // },

            onOptionRemove:function(removedTab, lastTab){
                mediator.tabs.removeTab(lastTab);

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
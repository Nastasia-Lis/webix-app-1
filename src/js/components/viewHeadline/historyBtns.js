
import { Button }     from "../../viewTemplates/buttons.js";

import { mediator }   from "../../blocks/_mediator.js";
import { Action }     from "../../blocks/commonFunctions.js";

function returnProp(name){
    const tabInfo = mediator.tabs.getInfo();
    return tabInfo[name];
}

function selectPage(config, id, changeHistory=false){
    mediator.tabs.setInfo(config, changeHistory);
    tabbarClick("onBeforeTabClick", id);
    tabbarClick("onAfterTabClick" , id);
}

function blockBtn(css){
    const prevBtn = document.querySelector('.' + css);

    if (prevBtn){
        const id = prevBtn.getAttribute("view_id");
                
        Action.disableItem($$(id));
                
    }
}


function unblockBtn(css){
    const nextBtn = document.querySelector('.' + css);

    if (nextBtn){
        const id  = nextBtn.getAttribute("view_id");

        Action.enableItem($$(id));
       
    }
}

function isThisPage(history){
    const lastHistory = history[history.length - 1];
    const tabConfig   = mediator.tabs.getInfo();

    if (tabConfig && lastHistory){
        const id        = tabConfig.tree ? tabConfig.tree.field : null;
        const historyId = lastHistory.field;

        if (id == historyId){
            return true;
        }
   
    }
   
}
function returnPrevPageConfig(history){
  
    if (history && history.length){

        let index = 1;

        if (isThisPage(history)){
            index = 2;
        }
        const lastIndex     = history.length - index;
        const modifyHistory = history.slice(0, lastIndex);
        console.log(lastIndex)
        if (lastIndex <= 1){
            blockBtn  ("historyBtnLeft");
            unblockBtn("historyBtnRight");
        }
       
        if (history[lastIndex]){
            return{ 
                tree    : history[lastIndex],
                history : modifyHistory,
            };
        }
     
    }

}

function tabbarClick(ev, id){
    $$("globalTabbar").callEvent(ev, [ id ]);
}


function returnSelectTabId(){
    const tabbar   = $$("globalTabbar");
    return tabbar.getValue();  
}

function addNextPageConfig(prevPageConfig){
    const tree = returnProp ("tree");
    prevPageConfig.nextPage = tree;
}


function prevBtnClick (){
    const tabId          = returnSelectTabId    ();
    const history        = returnProp           ("history");
    const prevPageConfig = returnPrevPageConfig (history);
  
    if (prevPageConfig){
        addNextPageConfig(prevPageConfig);
        selectPage(prevPageConfig, tabId);
        
    }
}

function returnNextPageConfig(nextPage){
    const history = returnProp("history");
    return {
        tree   : nextPage,
        history: history
    };
}

function isNextPageExists(nextPage){
    if (nextPage){
        return nextPage;
    }
}

function nextBtnClick (){
    const nextPage = returnProp("nextPage");

    if (isNextPageExists(nextPage)){
        const tabId          = returnSelectTabId   ();
        const nextPageConfig = returnNextPageConfig(nextPage);

        selectPage(nextPageConfig, tabId, true);

        blockBtn  ("historyBtnRight");
        unblockBtn("historyBtnLeft");
    }

}   

function createHistoryBtns(){

    
    const prevBtn = new Button({
        
        config   : {
            id       : `historyBtnLeft_${webix.uid()}`,
            hotkey   : "Ctrl+Shift+P",
            icon     : "icon-arrow-left",
            disabled : true, 
            css      : "historyBtnLeft",
            click    : function(){
                prevBtnClick();
            },
        },
        titleAttribute : "Вернуться назад"

    
    }).transparentView();

    const nextBtn = new Button({
        
        config   : {
            id       : `historyBtnRight_${webix.uid()}`,
            hotkey   : "Ctrl+Shift+B",
            icon     : "icon-arrow-right",
            css      : "historyBtnRight",
            disabled : true, 
            click    : function(){
                nextBtnClick();
            },
        },
        titleAttribute : "Перейти вперёд "

    
    }).transparentView();
   

    return {
        css  : "btn-history",
        cols : [
            prevBtn,
            nextBtn,
        ]
    };
}

 
 
export {
    createHistoryBtns
};
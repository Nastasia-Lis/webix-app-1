  
///////////////////////////////

// Кнопки с историей

// Copyright (c) 2022 CA Expert

///////////////////////////////


import { Button }     from "../../viewTemplates/buttons.js";

import { mediator }   from "../../blocks/_mediator.js";
 

function returnProp(name){
    const tabInfo = mediator.tabs.getInfo();
    return tabInfo[name];
}

function selectPage(config, id, changeHistory=false){
    mediator.tabs.setInfo(config, changeHistory);
    tabbarClick("onBeforeTabClick", id);
    tabbarClick("onAfterTabClick" , id);
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
   
        if (lastIndex <= 1){
            mediator.tabs.setHistoryBtnState(false, false); // disable prev btn

        }

        mediator.tabs.setHistoryBtnState(true); // enable next btn
       
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
    const prevPage = returnProp("tree");
    history.push(prevPage);
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

        mediator.tabs.setHistoryBtnState(true, false);// disable next btn
        mediator.tabs.setHistoryBtnState(); // enable prev btn
         
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
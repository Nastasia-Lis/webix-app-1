  
///////////////////////////////

// Кнопка с историей и восстановлением последней вкладки

// Copyright (c) 2022 CA Expert

///////////////////////////////


import { Button }           from "../../viewTemplates/buttons.js";
import { Popup }            from "../../viewTemplates/popup.js";
import { mediator }         from "../../blocks/_mediator.js";
import { GetFields }        from "../../blocks/globalStorage.js";
import { Action }           from "../../blocks/commonFunctions.js";
import { setLogValue }      from "../logBlock.js";
import { modalBox }         from "../../blocks/notifications.js";
import { setFunctionError } from "../../blocks/errors.js";



function getSelectedOption(){
    const radio      = $$("tabsHistoryList");
    const selectedId = radio.getValue();
    return radio.getOption(selectedId);
}


function returnEmptyOption(){
    return {   
        id       : "radioNoneContent", 
        disabled : true, 
        value    : "История пуста"
    };
}

function returnItem(config, index){
    
    const item = GetFields.item(config.field);
    const name = item.plural ? item.plural : item.singular;
  
    return {
        id    : webix.uid(),
        value : name,
        config: config,
        index : index
    };
   
}

function returnListItems(){
    const history = mediator.tabs.getTabHistory();
    const items = [];

    if (history && history.length){
     
        history.forEach(function(el, i){
            items.push(returnItem(el, i));
        });

    } else {
        items.push(returnEmptyOption());
    }

    return items;
}


function returnRadio(){
    const radio = {
        view     : "radio", 
        id       : "tabsHistoryList",
        vertical : true,
        options  : returnListItems(),
        on       : {
            onChange:function(newValue, oldValue){
                if (newValue !== oldValue){
                    Action.enableItem($$("tabsHistoryBtn"));
                }
            }
        }
    };

    return radio;
}

function returnRadioList(){
    const container = {
        view       : "scrollview",
        scroll     : "y",
        maxHeight  : 300,
        borderless : true,
        body       : {
            rows: [
                returnRadio()
            ]
        }
    };

    return container;
}


function openLink(){
    const option = getSelectedOption();
 
    const createConfig = {
        tree: option.config
    };

    mediator.tabs.openInNewTab(createConfig);

    Action.destructItem($$("popupTabsHistory"));
}

function returnOpenBtn(){
    const btn = new Button({
        config   : {
            id       : "tabsHistoryBtn",
            hotkey   : "Ctrl+Shift+Space",
            value    : "Открыть ссылку", 
            disabled : true,
            click    : function(){
                openLink();
            },
        },
        titleAttribute : "Открыть ссылку"
    
       
    }).maxView("primary");

    return btn;
}

function returnSuccessNotify(text){
    setLogValue ("succcess", text, '"expa'); 
}



function clearAllClick(){

    modalBox("История будет очищена полностью", 
        "Вы уверены?", 
        ["Отмена", "Продолжить"]
    )
    .then(function (result){
        if (result == 1){
            mediator.tabs.clearTabHistory();
            Action.destructItem($$("popupTabsHistory"));
            returnSuccessNotify("История успешно очищена");
        }

    });

}

function removeOptionState (option){
    const radio = $$("tabsHistoryList");
    try{

        option.value = option.value + " (запись удалена)";
        radio.refresh();
        
        radio.disableOption(option.id);

    } catch (err){
        setFunctionError(
            err, 
            "tabs / tabsHistory", 
            "removeOptionState"
        );
    }
}

function removeItemClick(){
    const option = getSelectedOption();
 
    if (option){
        const name = option.value;
        modalBox("Запись «" + name + "» будет удалена из истории", 
            "Вы уверены?", 
            ["Отмена", "Продолжить"]
        )
        .then(function (result){
            if (result == 1){
                
                mediator.tabs.removeTabHistoryPage(option.index);
                removeOptionState (option);
                returnSuccessNotify("Запись «" + name + "» удалена из истории");
            }
    
        });
    } else {
        webix.message({
            text :"Запись не выбрана",
            type :"error", 
        });
    }
 
   
}



function returnRemoveBtn(){
    const removeBtn = new Button({

        config   : {
            id       : "removeTabsHistory",
            hotkey   : "Alt+Shift+R",
            icon     : "icon-trash",
            popup   : {

                view    : 'contextmenu',
                css     : "webix_contextmenu",
                data    : [
                    { id: 'clearSingle', value: 'Удалить ссылку'   },
                    { id: 'clearAll',    value: 'Очистить историю' }
                ],
                on      : {
                    onItemClick: function(id){
                        if (id == "clearAll"){
                            clearAllClick();
                        } else if (id == "clearSingle"){
                            removeItemClick();
                            // проверить выбрана ли ссылка
                        }
     
                    }
                }
            },

        },
        titleAttribute : "Очистить историю / удалить выбранную ссылку"
       
    }).minView("delete");

    return removeBtn;
}


function openHistoryPopup(){
 
    const popup = new Popup({
        headline : "История",
        config   : {
            id    : "popupTabsHistory",
            width : 500,
    
        },

        elements : {
            rows : [
                returnRadioList(),
                {cols:[
                    returnOpenBtn(),
                    returnRemoveBtn()
                ]}
            ]
          
        }
    });

    popup.createView ();
    popup.showPopup  ();
}

function findLastRemovedTab(){
    const removedHistory = mediator.tabs.getRemovedTabs();

    if (removedHistory){
        const index = removedHistory.length - 1;
        const tab   =  removedHistory[index];

        mediator.tabs.deleteOpenRemovedTab(index);

        return tab;

    }

}

function openClosedTab(){
    const lastRemovedTabConfig = findLastRemovedTab();
    if (lastRemovedTabConfig){
        mediator.tabs.openInNewTab({tree:lastRemovedTabConfig});
    }
   
    
}

function tabsHistoryBtn(){
    const btn = new Button({
        
        config   : {
            id       : "historyTabBtn",
           // hotkey   : "Ctrl+Shift+A",
            icon     : "icon-file", //wxi-plus
            popup   : {

                view    : 'contextmenu',
               
                css     : "webix_contextmenu",
                data    : [
                    { id: 'addTab' , value: 'Новая вкладка'            },
                    { id: 'history', value: 'Открыть историю'          },
                    { id: 'restore', value: 'Открыть закрытую вкладку' },
                    { id: 'empty'  , value: '',                        }
                ],
                on      : {
                    onItemClick: function(id){
                        if (id == "addTab"){
                            mediator.tabs.openInNewTab({tree:{none:true}});

                        } else if (id == "history"){
                            openHistoryPopup();

                        } else if (id == "restore"){
                           openClosedTab();
                        }  
     
                    }
                }
            },
            // click    : function(){
            //     openHistoryPopup();
            // },
        },
        titleAttribute : "Действия с вкладками"
    
       
    }).transparentView();

    return btn;
}

export {
    tabsHistoryBtn
};
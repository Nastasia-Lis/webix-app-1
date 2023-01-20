///////////////////////////////

// Кнопка сокрытия лога

// Copyright (c) 2022 CA Expert

///////////////////////////////

import { Button } from "../../viewTemplates/buttons.js";

function logBtnClick(id){
    const btn = $$(id);

    if (btn.getValue() == 1){
        btn.setValue(2);

    } else {
        btn.setValue(1);
    }
}


function onChangeLogBtn(newValue){

    const list      = $$("logBlock-list");
    const logLayout = $$("logLayout");
    const logBtn    = $$("webix_log-btn");

    const lastItemList = list.getLastId();

    const minHeight = 5;
    
    const maxHeight = 90;

    function setState (height,icon){
        logBtn.config.badge     = "";

        logLayout.config.height = height;
        logLayout.resize();

        logBtn.config.icon      = icon;
        logBtn.refresh();
    }

    if (newValue == 2){
        setState (maxHeight, "icon-eye-slash");
        list.showItem(lastItemList);

    } else {
       
        setState (minHeight, "icon-eye");
    }
}


const logBtn = new Button({
    
    config   : {
        id       : "webix_log-btn",
        hotkey   : "Ctrl+M",
        icon     : "icon-eye", 
        badge    : 0,
        click   : function(id){
            logBtnClick(id)
        },
    },
    onFunc   :{
        onChange:function(newValue){
        
            onChangeLogBtn(newValue);
        },
        setStorageData:function(){

        }
    },
    titleAttribute : "Показать/скрыть системные сообщения"

   
}).minView();

export {
    logBtn
};
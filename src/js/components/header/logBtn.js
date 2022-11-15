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

    function setState (height,icon){
        logBtn.config.badge     = "";

        logLayout.config.height = height;
        logLayout.resize();

        logBtn.config.icon      = icon;
        logBtn.refresh();
    }

    if (newValue == 2){
        setState (90, "icon-eye-slash");
        list.showItem(lastItemList);

    } else {
        setState (5, "icon-eye");
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
        }
    },
    titleAttribute : "Показать/скрыть системные сообщения"

   
}).minView();

export {
    logBtn
};
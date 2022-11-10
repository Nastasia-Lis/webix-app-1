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
        logBtn.config.badge = "";

        logLayout.config.height = height;
        logLayout.resize();

        logBtn.config.icon = icon;
        logBtn.refresh();
    }

    if (newValue == 2){
        setState (90, "icon-eye-slash");
        list.showItem(lastItemList);

    } else {
        setState (5, "icon-eye");
    }
}


const logBtn = {   
    view    : "button",  
    id      : "webix_log-btn",
    type    : "icon", 
    icon    : "icon-eye",
    height  : 42, 
    badge   : 0,
    width   : 50,
    hotkey  : "ctrl+m",
    css     : "webix_log-btn",
    click   : function(id){
        logBtnClick(id)
    }  ,

    on: {
        onAfterRender: function () {
            this.getInputNode().setAttribute("title","Показать/скрыть системные сообщения (Ctrl+M)");
        },

        onChange:function(newValue, oldValue, config){
            onChangeLogBtn(newValue);
        }
    },

};


export {
    logBtn
};
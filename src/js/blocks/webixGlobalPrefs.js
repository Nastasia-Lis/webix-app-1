
function createCustomEditor(){
    webix.editors.customDate = webix.extend({
        render:function(){
            return webix.html.create("div", {
            "class":"webix_dt_editor"
            }, "<input class='webix_custom-date-editor' id='custom-date-editor' type='text'>");
    }}, webix.editors.text);
    
}

function setDateFormat(){
    webix.i18n.setLocale("ru-RU");   
    webix.i18n.parseFormat = "%d.%m.%Y %H:%i:%s";
    webix.i18n.setLocale();
    webix.Date.startOnMonday = true;
}

function setMsgPosition(){
    webix.message.position = "bottom";
}

function protoUIEdittree () {
    webix.protoUI({
        name:"edittree"
    }, webix.EditAbility, webix.ui.tree);
}


function webixGlobalPrefs (){
    createCustomEditor  ();
    setDateFormat       ();
    setMsgPosition      ();
}


export {
    webixGlobalPrefs,
    protoUIEdittree
};
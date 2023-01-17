import { Button }               from "../../../viewTemplates/buttons.js";
import { Filter }               from "./actions/_FilterActions.js";
 
import { ServerData }           from "../../../blocks/getServerData.js";
import { setLogValue }          from "../../logBlock.js"
import { Action }               from "../../../blocks/commonFunctions.js"
 

function putUserprefsTemplate(id, sentObj, nameTemplate){

    new ServerData({
    
        id : `userprefs/${id}`
       
    }).put(sentObj).then(function(data){
    
        if (data){
    
            setLogValue(
                "success",
                "Шаблон" +
                " «" +
                nameTemplate +
                "» " +
                " обновлён"
            );

            Action.hideItem($$("templateInfo"));
        }
         
    });
}


function saveClick(){

    const selectTemplate = Filter.getActiveTemplate();
    const newValues = Filter.getFilter().values;

    const prefs  = JSON.parse(selectTemplate.prefs.prefs);
    prefs.values = newValues;

    const sentObj = {
        prefs : prefs
    };

    const id           = selectTemplate.prefs.id;
    const nameTemplate = prefs.name;

    putUserprefsTemplate(id, sentObj, nameTemplate);
    
    
}


function saveTemplateNotify(){
    const template = {
        template   : "Есть несохранённые изменения в шаблоне", 
        height     : 65, 
        borderless : true
    };

    const btn = new Button({
    
        config   : {
            id       : "putTemplateBtn",
            inputHeight:40,
            icon     : "icon-pencil",
            click    : function(){
                saveClick();
            },
        },
        titleAttribute : "Сохранить изменения"
    
       
    }).transparentView();

    const layout = {  
        id        : "templateInfo",
        hidden    : true,
        css       : "filter-template-info",
        cols      : [
            template,
            {rows : [
                {},
                btn,
                {}
            ]},
            {width : 5}
            
        ],
    };

    return layout;
}


export{
    saveTemplateNotify
};
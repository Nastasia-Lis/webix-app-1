import { Button }               from "../../../viewTemplates/buttons.js";
import { Filter }               from "./actions/_FilterActions.js";
import { setFunctionError, 
        setAjaxError }          from "../../../blocks/errors.js";

import { setLogValue }          from "../../logBlock.js"
import { Action }               from "../../../blocks/commonFunctions.js"

const logNameFile = "filterFrom => SaveTemplateNotify";


function putUserprefsTemplate(id, sentObj, nameTemplate){
    const path    = "/init/default/api/userprefs/" + id;
    const putData = webix.ajax().put(path, sentObj);

    putData.then(function(data){
        data = data.json();
        if (data.err_type == "i"){
            setLogValue(
                "success",
                "Шаблон" +
                " «" +
                nameTemplate +
                "» " +
                " обновлён"
            );

            Action.hideItem($$("templateInfo"));

        } else {
            setFunctionError(
                data.err,
                logNameFile,
                "saveExistsTemplate"
            );
        }
    });

    putData.fail(function(err){
        setAjaxError(
            err, 
            logNameFile,
            "putUserprefsData"
        );
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
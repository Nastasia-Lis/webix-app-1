import { setFunctionError, setAjaxError}    from "../../blocks/errors.js";
import { mediator }                         from "../../blocks/_mediator.js";
import { Action }                           from "../../blocks/commonFunctions.js";
import { RouterActions }                    from "./actions/_RouterActions.js";

const logNameFile = "router => settings";



function setUserprefsNameValue (){
    const user = webix.storage.local.get("user");
    try{
        if (user){
            const name = user.name.toString();
            $$("settingsName").setValues(name);
        }
    } catch (err){
      
        setFunctionError(
            err, 
            logNameFile,
            "setUserprefsNameValue"
        );
    }

}



function setTemplateValue(data){

    try{
        data.forEach(function(el){
            const name    = el.name;
            const prefsId = "userprefs";
            if (name.includes   (prefsId)     && 
                name.lastIndexOf(prefsId) == 0){

                const prefs = JSON.parse(el.prefs);
                const form  = $$(name);
                form.setValues(prefs);
                form.config.storagePrefs = prefs;
            }
        });
    } catch (err){
        setFunctionError(
            err, 
            logNameFile, 
            "getDataUserprefs"
        );
    }


}

function getDataUserprefs(){
    const path          = "/init/default/api/userprefs/";
    const userprefsData = webix.ajax().get(path);

    userprefsData.then(function(data){
        data = data.json().content;
        setTemplateValue(data);
        
    });

    userprefsData.fail(function (err){
        setAjaxError(
            err, 
            logNameFile, 
            "getDataUserprefs"
        );
    });
}

function setTab(id){
    $$("globalTabbar").addOption({
        id    : id, 
        value : "Настройки", 
        isOtherView : true,
        info  : {
            tree:{
                view : "settings"
            }
        },
        close : true, 
    }, true);
}

function settingsRouter(){

    const id   = "settings";
    const elem = $$(id);
    
    RouterActions.hideContent();

    if (mediator.sidebar.dataLength() == 0){
        RouterActions.createContentSpace();
    }

    setTab(id);


    if (elem){
        Action.showItem(elem);
    } else {
        RouterActions.createContentElements (id);
        getDataUserprefs();
        Action.showItem($$(id));
    }

    setUserprefsNameValue   ();

    mediator.sidebar.close  ();
    RouterActions.hideEmptyTemplates();
    
  
}

export{
    settingsRouter
};
import { setFunctionError, setAjaxError}    from "../../blocks/errors.js";
import { hideAllElements, checkTreeOrder, 
        closeTree, createElements }         from "./common.js";


const logNameFile = "router => settings";

function showUserprefs(){
    try{
        $$("settings").show();
    } catch (err){
      
        setFunctionError(err, logNameFile, "showUserprefs");
    }
}

function setUserprefsNameValue (){
    const user = webix.storage.local.get("user");
    try{
        if (user){
            $$("settingsName").setValues(user.name.toString());
        }
    } catch (err){
      
        setFunctionError(err, logNameFile, "setUserprefsNameValue");
    }

}

function hideNoneContent(){
    try{
        const elem = $$("webix__none-content");
        if(elem){
            elem.hide();
        }
    } catch (err){
        
        setFunctionError(err, logNameFile, "hideNoneContent");
    }
}

function getDataUserprefs(){
    const userprefsData = webix.ajax().get("/init/default/api/userprefs/");

    userprefsData.then(function(data){

        data = data.json().content;
    
        function setTemplateValue(){
            try{
                data.forEach(function(el,i){
        
                    if (el.name.includes   ("userprefs")     && 
                        el.name.lastIndexOf("userprefs") == 0){
                        $$(el.name).setValues(JSON.parse(el.prefs));
                    }
                });
            } catch (err){
                setFunctionError(err, logNameFile, "getDataUserprefs");
            }
        }

        setTemplateValue();
        
    });

    userprefsData.fail(function(err){
        setAjaxError(err, logNameFile, "getDataUserprefs");
    });
}

function removeNullContent(){
    try{
        const elem = $$("webix__null-content");
        if(elem){
            const parent = elem.getParentView();
            parent.removeView(elem);
        }
    } catch (err){
        setFunctionError(err, logNameFile, "removeNullContent");
    }
}


function settingsRouter(){

    hideAllElements ();
  
    checkTreeOrder();

    if ($$("settings")){
        showUserprefs();
    } else {
        createElements("settings");
        getDataUserprefs();
        showUserprefs();
      

    }

    setUserprefsNameValue   ();
    closeTree               ();
    hideNoneContent         ();
    removeNullContent       ();
  
}

export{
    settingsRouter
};
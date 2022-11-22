import { setLogValue }                      from "../../logBlock.js";
import { setStorageData }                   from "../../../blocks/storageSetting.js";
import { setFunctionError, setAjaxError  }  from "../../../blocks/errors.js";

import { Button }                           from "../../../viewTemplates/buttons.js";

import { defaultValue }                     from "./commonTab.js";

const logNameFile   = "settings => tabbar => buttons";

function saveSettings (){
    const tabbar    = $$("userprefsTabbar");
    const value     = tabbar.getValue();
    const tabbarVal = value + "Form" ;
    const form      = $$(tabbarVal);
    
    function getUserprefsData(){
        const url     = "/init/default/api/userprefs/";
        const getData =  webix.ajax().get(url);
     
        getData.then(function(data){
            data = data.json().content;

            let settingExists = false;

            const values = form.getValues();

            const sentObj = {
                name :tabbarVal,
                prefs:values,
            };

            function putPrefs(el){
                const url     = "/init/default/api/userprefs/" + el.id;
                const putData = webix.ajax().put(url, sentObj);

                putData.then(function(data){
                    data = data.json();
                    if (data.err_type == "i"){
                        const formVals = JSON.stringify(form.getValues());
                        setStorageData (tabbarVal, formVals);
                        setLogValue("success", "Настройки сохранены");

                    } if (data.err_type !== "i"){
                        setLogValue("error", data.error);
                    }

                    const name         = tabbar.getValue();
                    defaultValue[name] = values;

                    form.setDirty(false);
                });

                putData.fail(function(err){
                    setAjaxError(err, logNameFile, "putPrefs");
                });
            }
     
            function findExistsData(){
                try{
                    data.forEach(function(el,i){
                       
                        if (el.name == tabbarVal){
                            settingExists = true;
                            putPrefs(el);
                        } 
                    });
                } catch (err){
                    setFunctionError(err, logNameFile, "findExistsData");
                }
            }

            findExistsData();


            function getOwnerData(){
                const getData = webix.ajax("/init/default/api/whoami");
                getData.then(function(data){
                    data = data.json().content;
                    sentObj.owner = data.id;

                    const userData = {};

                    userData.id       = data.id;
                    userData.name     = data.first_name;
                    userData.username = data.username;
                    
                    setStorageData("user", JSON.stringify(userData));
                });

                getData.fail(function(err){  
                    setAjaxError(err, logNameFile, "getOwnerData");
                });
            }

            function postPrefs(){
       
                const url      = "/init/default/api/userprefs/";
  
                const postData = webix.ajax().post(url,sentObj);
 
                postData.then(function(data){
                    data = data.json();

                    if (data.err_type == "i"){
                        setLogValue("success", "Настройки сохранены");

                    } else {
                        setLogValue("error", data.error);
                    }

                    const tabbarVal         = tabbar.getValue();
                    defaultValue[tabbarVal] = values;

                    form.setDirty(false);
                });

                postData.fail(function(err){
                    setAjaxError(err, logNameFile, "postPrefs");
                });
            }

          
            if (!settingExists){
                
                const ownerId = webix.storage.local.get("user").id;
     
                if (ownerId){
                    sentObj.owner = ownerId;
                } else {
                    getOwnerData();
                }
       
                postPrefs();
            }

        });
        getData.fail(function(err){
            setAjaxError(err, logNameFile, "getUserprefsData");
        });
    }

    if ( form.isDirty() ){
        getUserprefsData();
    } else {
        setLogValue("debug","Сохранять нечего");
    }
}

function clearSettings (){
    const tabbar    = $$("userprefsTabbar");
    const value     = tabbar.getValue();
    const tabbarVal = value + "Form" ;
    const form      = $$(tabbarVal);

    if (tabbarVal === "userprefsWorkspaceForm"){
        form.setValues({
            logBlockOpt    : '1', 
            LoginActionOpt : '1'
        });

    } else if (tabbarVal === "userprefsOtherForm"){
        form.setValues({
            autorefOpt        : '1', 
            autorefCounterOpt : 15000, 
            visibleIdOpt      : '1'
        });
    }

    form.setDirty(true);

    saveSettings ();
}


const clearBtn = new Button({
    
    config   : {
        id       : "userprefsResetBtn",
        hotkey   : "Shift+X",
        disabled : true,
        value    : "Сбросить", 
        click    : clearSettings,
    },
    titleAttribute : "Вернуть начальные настройки"

   
}).maxView();

const submitBtn = new Button({
    
    config   : {
        id       : "userprefsSaveBtn",
        hotkey   : "Shift+Space",
        disabled : true,
        value    : "Сохранить настройки", 
        click    : saveSettings,
    },
    titleAttribute : "Применить настройки"

   
}).maxView("primary");


const buttons =  { 
    id:"adaptiveUp", 
    rows:[
        {   responsive : "adaptiveUserprefs",
            cols:[
                clearBtn,
                submitBtn,
            ]
        }
    ]
};

export {
    buttons,
    saveSettings
};
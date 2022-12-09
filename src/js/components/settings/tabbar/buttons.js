import { setLogValue }                      from "../../logBlock.js";
import { setStorageData }                   from "../../../blocks/storageSetting.js";
import { setFunctionError, setAjaxError  }  from "../../../blocks/errors.js";

import { Button }                           from "../../../viewTemplates/buttons.js";

import { defaultValue }                     from "./commonTab.js";

import { pushUserDataStorage, 
         getUserDataStorage }               from "../../../blocks/commonFunctions.js";

const logNameFile   = "settings => tabbar => buttons";

let tabbar;
let tabbarVal;
let form;

let values;
let sentObj;

function putPrefs(el){
 
    const path    = "/init/default/api/userprefs/" + el.id;
    const putData = webix.ajax().put(path, sentObj);

    return putData.then(function(data){

        data = data.json();

        if (data.err_type == "i"){

            const formVals = JSON.stringify(values);
            setStorageData (tabbarVal, formVals);

            const name         = tabbar.getValue();
            defaultValue[name] = values;

            form.setDirty(false);

            setLogValue(
                "success", 
                "Настройки сохранены"
            );
            return true;
        } else {
            setLogValue("error", data.error);
            return false;
        }

    }).fail(function(err){
        setAjaxError(
            err, 
            logNameFile, 
            "putPrefs"
        );
        return false;
    });
}


function findExistsData(data){
    const result = {
        exists : false
    };

    try{
        data.forEach(function(el){
           
            if (el.name == tabbarVal){
                result.exists = true;
                result.findElem = el;
            } 
        });
    } catch (err){
        setFunctionError(
            err, 
            logNameFile, 
            "findExistsData"
        );
    }
    return result;
}


function postPrefs(){
   
    const path = "/init/default/api/userprefs/";

    const postData = webix.ajax().post(path, sentObj);

    return postData.then(function(data){
        data = data.json();

        if (data.err_type == "i"){
            const tabbarVal         = tabbar.getValue();
            defaultValue[tabbarVal] = values;

            form.setDirty(false);

            setLogValue(
                "success", 
                "Настройки сохранены"
            );

            return true;
        } else {
            setLogValue(
                "error", 
                data.error
            );

            return false;
        }

    }).fail(function(err){
        setAjaxError(
            err, 
            logNameFile, 
            "postPrefs"
        );

        return false;
    });
}


async function savePrefs(){
    let ownerId = getUserDataStorage();

    if (!ownerId){
        await pushUserDataStorage();
        ownerId = getUserDataStorage();
    }

    const url     = "/init/default/api/userprefs/";
    const getData =  webix.ajax().get(url);
 
    return getData.then(function(data){
        data = data.json().content;

        values = form.getValues();
 
        sentObj = {
            name  : tabbarVal,
            owner : ownerId.id,
            prefs : values,
        };

   

        const result          = findExistsData(data);
        const isExistsSetting = result.exists;

        if (!isExistsSetting){
            return postPrefs();
        } else {
            const findElem = result.findElem;
            return putPrefs(findElem);
        }

    }).fail(function(err){
        setAjaxError(
            err, 
            logNameFile, 
            "savePrefs"
        );
    });
}


async function saveSettings (){
    tabbar    = $$("userprefsTabbar");
    const value     = tabbar.getValue();
    tabbarVal = value + "Form" ;
    form      = $$(tabbarVal);

    if (form.isDirty()){
        return savePrefs();   
   
    } else {
        setLogValue(
            "debug", 
            "Сохранять нечего"
        );
        return true;
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
        //    LoginActionOpt : '1'
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
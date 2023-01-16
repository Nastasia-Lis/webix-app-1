import { setLogValue }                      from "../../logBlock.js";
import { setStorageData }                   from "../../../blocks/storageSetting.js";
import { ServerData }                       from "../../../blocks/getServerData.js";
import { Button }                           from "../../../viewTemplates/buttons.js";

import { defaultValue }                     from "./commonTab.js";

import { pushUserDataStorage, 
         getUserDataStorage }               from "../../../blocks/commonFunctions.js";


let tabbar;
let tabbarVal;
let form;

let values;
let sentObj;

function putPrefs(id){

    return new ServerData({
        id : `userprefs/${id}`
       
    }).put(sentObj).then(function(data){

        if (data){
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
        }
         
    });

}


function postPrefs(){

    return new ServerData({
        id : "userprefs"
       
    }).post(sentObj).then(function(data){

        if (data){
            const tabbarVal         = tabbar.getValue();
            defaultValue[tabbarVal] = values;

            form.setDirty(false);

            setLogValue(
                "success", 
                "Настройки сохранены"
            );

            return true;
        }
         
    });
   
}

function createSentObj(owner, values){
    const sentObj = {
        name  : tabbarVal,
        owner : owner,
        prefs : values,
    };

    return sentObj;
}


async function savePrefs(){
    let ownerId = getUserDataStorage();

    if (!ownerId){
        await pushUserDataStorage();
        ownerId = getUserDataStorage();
    }

    return new ServerData({
        id : `smarts?query=userprefs.name='${tabbarVal}'+and+userprefs.owner=${ownerId.id}&limit=80&offset=0`
       
    }).get().then(function(data){

        if (data){
            values  = form.getValues();
            sentObj = createSentObj(ownerId.id, values);

            if (data.content && data.content.length){ // запись уже существует
                const content   = data.content;
                const firstPost = content[0];
    
                if (firstPost){
                    return putPrefs(firstPost.id);
                }
              
            } else {
                return postPrefs(); 
            }
        }
         
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
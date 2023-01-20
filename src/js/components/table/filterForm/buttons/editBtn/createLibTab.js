 
///////////////////////////////

// Создание таба с библиотекой шаблонов

// Copyright (c) 2022 CA Expert

///////////////////////////////

import { getItemId, returnOwner }   from "../../../../../blocks/commonFunctions.js";
import { setFunctionError }         from "../../../../../blocks/errors.js";
import { ServerData }               from "../../../../../blocks/getServerData.js";


let user;
let prefsData;
let lib;

 

function clearOptionsPull() {
    
    const oldOptions = [];

    const options     = lib.config.options;
    const isLibExists = options.length;

    if (lib && isLibExists && options && oldOptions){

        options.forEach(function(el){
            oldOptions.push(el.id);
        });

        oldOptions.forEach(function(el){
            lib.removeOption(el);
        });

    }
}


function createOption(i, data){
    const prefs   = JSON.parse(data.prefs);
    const idPrefs = prefs.table;
    const currId  = getItemId ();

    if (idPrefs == currId){
        lib.addOption( {
            id    : i + 1, 
            value : prefs.name,
            prefs : data
        });

    }
}

function isThisOption(data){
    const dataOwner = data.owner;
    const currOwner = user.id;

    const name           = "filter-template_";
    const isNameTemplate = data.name.includes(name);

    if (isNameTemplate && dataOwner == currOwner){
        return true;
    }

}
function setTemplates(){
   
    clearOptionsPull();

    if (prefsData && prefsData.length){
        prefsData.forEach(function(data, i){
            if(isThisOption(data)){
                createOption(i, data);
            }
        
        });
    } else {
        setFunctionError(
            "array is null",
            "table/filterForm/buttons/editBtn/createLibTab",
            "setTemplates"
        );
    }


}

function setEmptyOption(){
    $$("filterEditLib").addOption(
        {   id      : "radioNoneContent",
            disabled: true, 
            value   : "Сохранённых шаблонов нет"
        }
    );
}

async function createLibTab(){ 
    lib  = $$("filterEditLib");
    user = await returnOwner();

    new ServerData({
        id : "userprefs"
       
    }).get().then(function(data){
    
        if (data){
    
            const content = data.content;
    
            if (content){

                prefsData = content;

                if(user){
                    setTemplates();
        
                    const lib = $$("filterEditLib");
                    
                    if (lib && lib.data.options.length == 0 ){
                        setEmptyOption();
                    }
                
                }
            }
        }
         
    });

   
}

export {
    createLibTab
};
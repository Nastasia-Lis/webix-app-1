
import { setFunctionError, setAjaxError }     from "../../../../../blocks/errors.js";
import { getItemId, pushUserDataStorage, 
        getUserDataStorage }                  from "../../../../../blocks/commonFunctions.js";


const logNameFile = "filterForm => buttons => editBtn => createLibTab";
let user;
let prefsData;
let lib;

function clearOptionsPull() {
    
    const oldOptions = [];

    const options     = lib.config.options;
    const isLibExists = options.length;

    if (lib && isLibExists){
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

    const dataSrc = prefsData.json().content;
    try {
        dataSrc.forEach(function(data, i){
            if(isThisOption(data)){
                createOption(i, data);
            }
        
        });
    } catch (err) {
        setFunctionError(
            err, 
            logNameFile, 
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
    user = getUserDataStorage();

    if (!user){
        await pushUserDataStorage ();
        user =  getUserDataStorage();
    }

    const path = "/init/default/api/userprefs/";
    const userprefsGetData = webix.ajax(path);

    userprefsGetData.then(function(getData){
        prefsData = getData;
        if(user){
            setTemplates();

            const lib = $$("filterEditLib");
            
            if (lib && lib.data.options.length == 0 ){
                setEmptyOption();
            }
        
        }
       
        
    });
    
    userprefsGetData.fail(function(err){
        setAjaxError(
            err, 
            logNameFile, 
            "saveTemplate"
        );
    });
   
}

export {
    createLibTab
};
import { LoadServerData, GetFields }        from "../../blocks/globalStorage.js";

import { setLogValue }                      from "../logBlock.js";
import { setAjaxError, setFunctionError }   from "../../blocks/errors.js";
import { getItemId, pushUserDataStorage, 
         getUserDataStorage, 
         Action}                            from "../../blocks/commonFunctions.js";

import { Popup }                            from "../../viewTemplates/popup.js";
import { Button }                           from "../../viewTemplates/buttons.js";


const logNameFile = "viewHeadline => favoriteBtn";

function findName (id, names){

    try{
        const nameTemplate = $$("favNameLink");
        names.forEach(function(el){
            if (el.id == id){
                if(nameTemplate){
                    nameTemplate.setValues(el.name);
                }
            }
            
        });
    } catch (err){
        setFunctionError(
            err, 
            logNameFile, 
            "findName"
        );
    }
}

async function getLinkName(){
        
    await LoadServerData.content("fields");
    const names = GetFields.names;

    if (names){
        const id = getItemId();
        findName (id, names);
    }
  
}

function getLink(){
    try{
        let link    = window.location.href;
        const index = link.lastIndexOf("?");
        link        = link.slice(0, index);

        const favTemplate = $$("favLink");
        if (favTemplate){
            favTemplate.setValues(link);
        }
    } catch (err){
        setFunctionError(
            err, 
            logNameFile, 
            "getLink"
        );
    }
}


function createDivTemplate(name, text){
    return "<div style='font-weight:600'>" + 
            name + ": </div>" + text;
}
 
function createTemplate(id, name, nonName){
    return {   
        id          : id,
        css         : "popup_subtitle", 
        borderless  : true, 
        height      : 20 ,
        template    : function(){
            const value = $$(id).getValues();
            const keys  = Object.keys(value);

            if (keys.length !== 0){
                return createDivTemplate(name, value);

            } else {
                return createDivTemplate(name, nonName);

            }
      
        }
    };
}

function getValue(elem){
    return  $$(elem).getValues();   
}



async function postContent(namePref){
    const favNameLinkVal = getValue("favNameLink");
    const favLinkVal     = getValue("favLink");

    let user = getUserDataStorage();

    if (!user){
        await pushUserDataStorage();
        user = getUserDataStorage();
    }


    if (user){

        const postObj = {
            name : "fav-link_" + namePref,
            owner: user.id,
            prefs:{
                name: favNameLinkVal,
                link: favLinkVal,
                id  : namePref,
            }
        };

        const path     = "/init/default/api/userprefs/";
        const postData = webix.ajax().post(path, postObj);

        postData.then(function(data){
            data = data.json();
    
            if (data.err_type == "i"){
                setLogValue(
                    "success", 
                    "Ссылка" + " «" + favNameLinkVal + "» " + 
                    " сохранёна в избранное");
            } else {
                setFunctionError(
                    data.err, 
                    logNameFile, 
                    "postContent msg" 
                );
            }

            Action.destructItem($$("popupFavsLinkSave"));
        });

        postData.fail(function(err){
            setAjaxError(
                err, 
                logNameFile, 
                "postContent"
            );
        });
    }
}

function getFavPrefs(data){
    const prefs = [];
    try{
        data.forEach(function(pref){

            if (pref.name.includes("fav-link")){
                prefs.push(pref.name);
            }
    
        });
    } catch (err){
        setFunctionError(
            err,
            logNameFile,
            "getFavPrefs"
        );
    }
    return prefs;
}

function returnId(el){
    const index = el.indexOf("_") + 1;
    return el.slice(index);
}

function getNotUniquePref(favPrefs, namePref){
    let unique = true;
    favPrefs.forEach(function(el){
                
        if (el.includes(namePref)){
            const id = returnId(el);

            if (id == namePref && unique){
                unique = false;
                setLogValue(
                    "success", 
                    "Такая ссылка уже есть в избранном"
                );
            } 
        } 
    });

    return unique;
}


function getNotUniquePrefs (data, namePref){
    const favPrefs = getFavPrefs(data);
    let unique = true;
    try{
        if (favPrefs.length){
            unique = 
            getNotUniquePref(favPrefs, namePref);
        } 
        
        
        if (!(favPrefs.length) || unique) {
            postContent(namePref);
        } else if (!unique){
            Action.destructItem($$("popupFavsLinkSave"));
        }
    } catch (err){
        setFunctionError(
            err,
            logNameFile,
            "getNotUniquePrefs"
        );
    }
}

function btnSaveLinkClick(){
  
    const namePref = getItemId();
    const path     = "/init/default/api/userprefs/";
    const getData  = webix.ajax().get(path);
    getData.then(function(data){
        data = data.json().content;
        getNotUniquePrefs (data, namePref);
    
    });
    getData.fail(function(err){
        setAjaxError(
            err, 
            logNameFile,
            "btnSaveLinkClick"
        );
    });

}

const btnSaveLink = new Button({

    config   : {
        value    : "Сохранить ссылку", 
        click    : function(){
            btnSaveLinkClick();
        },
    },
    titleAttribute : "Сохранить ссылку в избранное"

   
}).maxView("primary");


function saveFavsClick(){

    const popup = new Popup({
        headline : "Сохранить ссылку",
        config   : {
            id    : "popupFavsLinkSave",
            width : 500,
    
        },

        elements : {
            rows : [
                createTemplate("favNameLink", "Имя",    "не указано"),
                {height : 5},
                createTemplate("favLink",     "Ссылка", "не указана"),
                {height : 10},
                {   padding:{
                        left  : 8,
                        right : 8
                    },
                    rows:[
                        btnSaveLink,
                    ]
                },
                
                {}
            ]
          
        }
    });

    popup.createView ();
    popup.showPopup  ();


    getLinkName();
    getLink();
}


function createFavoriteBtn(){

       
    const favsBtn = new Button({
    
        config   : {
            id       : webix.uid(),
            hotkey   : "Ctrl+Shift+L",
            icon     : "icon-star",
            click    : function(){
                saveFavsClick();
            },
        },
        titleAttribute : "Добавить ссылку в избранное"
    
       
    }).transparentView();

    return favsBtn;
}



export {
    createFavoriteBtn
};
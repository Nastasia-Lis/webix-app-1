  
///////////////////////////////

// Кнопка сохранения страницы в закладки

// Copyright (c) 2022 CA Expert

///////////////////////////////

import { LoadServerData, GetFields }        from "../../blocks/globalStorage.js";

import { setLogValue }                      from "../logBlock.js";
import { setFunctionError }                 from "../../blocks/errors.js";
import { ServerData }                       from "../../blocks/getServerData.js";
import { getItemId, returnOwner, Action}    from "../../blocks/commonFunctions.js";

import { Popup }                            from "../../viewTemplates/popup.js";
import { Button }                           from "../../viewTemplates/buttons.js";


const logNameFile = "viewHeadline => favoriteBtn";

function findName (id, names){

    try{
        const nameTemplate = $$("favNameLink");

        if (names && names.length){
            names.forEach(function(el){
                if (el.id == id){
                    if(nameTemplate){
                        nameTemplate.setValues(el.name);
                    }
                }
                
            });
        }
      
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
        let index   = link.lastIndexOf("?");
 
        if (index !== -1){ // if url params is exists
            link        = link.slice(0, index);
        }

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

    const user = await returnOwner();

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

        new ServerData({
            id : "userprefs"
           
        }).post(postObj).then(function(data){
        
            if (data){
        
                setLogValue(
                    "success", 
                    "Ссылка" + " «" + favNameLinkVal + "» " + 
                    " сохранёна в избранное"
                );
            }
            Action.destructItem($$("popupFavsLinkSave")); 
        });

    }
}

function getFavPrefs(data){
    const prefs = [];

    if (data && data.length){
        data.forEach(function(pref){

            if (pref.name.includes("fav-link")){
                prefs.push(pref.name);
            }
    
        });
    }
     

    return prefs;
}

function returnId(el){
    const index = el.indexOf("_") + 1;
    return el.slice(index);
}

function getNotUniquePref(favPrefs, namePref){
    let unique = true;

    if (favPrefs && favPrefs.length){
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
    
    }

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

    new ServerData({
        id : "userprefs"
       
    }).get().then(function(data){
    
        if (data){
            const content = data.content;

            if (content && content.length){
                getNotUniquePrefs (content, namePref);
            }
            
        }

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
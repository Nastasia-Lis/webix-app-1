
import { setAjaxError, setFunctionError }           from "../blocks/errors.js";
import { pushUserDataStorage, getUserDataStorage, Action }  from "../blocks/commonFunctions.js";

import { Popup }                                    from "../viewTemplates/popup.js";
import { Button }                                   from "../viewTemplates/buttons.js";



function setAdaptiveSize(popup){
    if (window.innerWidth < 1200 ){
        const size  = window.innerWidth * 0.89;
        try{
            popup.config.width = size;
            popup.resize();
        } catch (err){
            setFunctionError(
                err,
                "favsLink",
                "setAdaptiveSize"
            );
        }
    }
 
}

function findFavsInUserData(data, id){
    const collection = [];
    try{

        data.forEach(function(el){
            if (el.name.includes("fav-link") && id == el.owner){
                collection.push(JSON.parse(el.prefs));
            }
        });

    } catch (err){
        setFunctionError(err ,"favsLink", "findFavsisUserData");
    }
    
    return collection;
}


function createOptions(data, user){
    const favCollection = findFavsInUserData(data, user.id);
    const radio         = $$("favCollectionLinks");
    try{
        if (favCollection.length){
            favCollection.forEach(function(el){
                radio.addOption(
                    {   id      : el.id,
                        value   : el.name,
                        favLink : el.link
                    }
                );
                radio.removeOption(
                    "radioNoneContent"
                );
            });
        }

        $$("popupFavsLink").show();

    } catch (err){
        setFunctionError(
            err, 
            "favsLink", 
            "createOptions"
        );
    }
 
}

async function favsPopupCollectionClick (){

    let user =  getUserDataStorage();

    if (!user){
        await pushUserDataStorage();
        user =  getUserDataStorage();
    }

    const path    = "/init/default/api/userprefs/";
    const getData = webix.ajax().get(path);
    
    getData.then(function(data){
        data = data.json().content;
        if (user){
            createOptions(data, user);
        }

    });

    getData.fail(function(err){
        setAjaxError(
            err, 
            "favsLink",
            "favsPopupCollectionClick"
        );
    });

    
}

function favsPopupSubmitClick(){
    try{
        const radio  = $$("favCollectionLinks");
        const value  = radio.getValue();
        const option = radio.getOption(value);
        window.location.replace(option.favLink);
    } catch (err){
        setFunctionError(err,"favsLink","favsPopupSubmitClick");
    }
}

function returnEmptyOption(){
    return {   
        id       : "radioNoneContent", 
        disabled : true, 
        value    : "Здесь будут сохранены Ваши ссылки"
    };
}

const radioLinks = {
    view:"radio", 
    id:"favCollectionLinks",
    vertical:true,
    options:[
        returnEmptyOption()
    ],
    on:{
        onChange:function(newValue, oldValue){
            if (newValue !== oldValue){
                Action.enableItem($$("favLinkSubmit"));
            }
        }
    }
};

const container = {
    view       : "scrollview",
    scroll     : "y",
    maxHeight  : 300,
    borderless : true,
    body       : {
        rows: [
            radioLinks
        ]
    }
};

const btnSaveLink = new Button({

    config   : {
        id       : "favLinkSubmit",
        hotkey   : "Ctrl+Shift+Space",
        value    : "Открыть ссылку", 
        disabled : true,
        click    : function(){
            favsPopupSubmitClick();
        },
    },
    titleAttribute : "Открыть ссылку"

   
}).maxView("primary");


function favsPopup(){

    const popupFavsLink = new Popup({
        headline : "Избранное",
        config   : {
            id    : "popupFavsLink",
            width     : 400,
            minHeight : 300,
    
        },

        elements : {
            padding:{
                left  : 5,
                right : 5
            },
            rows : [
                container,
                {height:15},
                btnSaveLink,
            ]
          
        }
    });

    popupFavsLink.createView ();
    
    favsPopupCollectionClick ();
    setAdaptiveSize($$("popupFavsLink"));
}



export{
    favsPopup,
};
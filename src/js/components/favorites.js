  
///////////////////////////////
//
// Попап с избранными страницами
//
// Copyright (c) 2022 CA Expert

///////////////////////////////

import { setFunctionError }                 from "../blocks/errors.js";
import { ServerData }                       from "../blocks/getServerData.js";
import { returnOwner, Action }              from "../blocks/commonFunctions.js";

import { Popup }                            from "../viewTemplates/popup.js";
import { Button }                           from "../viewTemplates/buttons.js";
import { modalBox }                         from "../blocks/notifications.js";
import { mediator }                         from "../blocks/_mediator.js";

import { setLogValue }                      from "./logBlock.js";


const logNameFile = "favorites";
const minWidth    = 1200;
const k           = 0.89;
function setAdaptiveSize(popup){
    if (window.innerWidth < minWidth ){
        const size  = window.innerWidth * k;
        try{
            popup.config.width = size;
            popup.resize();
        } catch (err){
            setFunctionError(
                err,
                logNameFile,
                "setAdaptiveSize"
            );
        }
    }
 
}

function findFavsInUserData(data, id){
    const collection = [];
    try{

        if (data && data.length){
            data.forEach(function(el){
                if (el.name.includes("fields/") && id == el.owner){
             
                    const prefs  = JSON.parse(el.prefs);

                    if (prefs && prefs.favorite){
                        prefs.favorite.dataId = el.id;
                        collection.push(prefs.favorite);
                    }
         
                    
                }
            });
        }
       
    } catch (err){
        setFunctionError(
            err, 
            logNameFile, 
            "findFavsisUserData"
        );
    }
    
    return collection;
}


function createOptions(data, user){
    const favCollection = findFavsInUserData(data, user.id);
    const radio         = $$("favCollectionLinks");
    try{
        if (favCollection && favCollection.length){
            favCollection.forEach(function(el){
         
                radio.addOption(
                    {   id      : el.id,
                        value   : el.name,
                        favLink : el.link,
                        dataId  : el.dataId
                    }
                );
                radio.removeOption(
                    "radioNoneContent"
                );
            });
        }

        Action.showItem($$("popupFavsLink"));

    } catch (err){
        setFunctionError(
            err, 
            logNameFile, 
            "createOptions"
        );
    }
 
}

async function favsPopupCollectionClick (){

    const user = await returnOwner();

    new ServerData({
        id : "userprefs"
       
    }).get().then(function(data){
    
        if (data){
    
            const content = data.content;
    
            if (content){
                if (user){
                    createOptions(content, user);
                }
    
            }
        }
         
    });


    
}

function favsPopupSubmitClick(){
    try{
        const radio   = $$("favCollectionLinks");
        const value   = radio.getValue();
        const option  = radio.getOption(value);
        const fieldId = option.id;

        if (fieldId){
            const infoData = {
                tree:{
                    field : fieldId,
                    type  : "dbtable" 
                },
            };
    
            mediator.tabs.openInNewTab(infoData);    
        }
        Action.destructItem($$("popupFavsLink"));

    } catch (err){
        setFunctionError(
            err,
            logNameFile,
            "favsPopupSubmitClick"
        );
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
    view     : "radio", 
    id       : "favCollectionLinks",
    vertical : true,
    options  : [
        returnEmptyOption()
    ],
    on       : {
        onChange:function(newValue, oldValue){
            if (newValue !== oldValue){
                Action.enableItem($$("favLinkSubmit"));
            }

            Action.enableItem($$("removeFavsBtn"));
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


function removeOption(options, option){
      
    const length = options.data.options.length;
    if (length == 1){
        const emptyOpt = returnEmptyOption();
        options.addOption(emptyOpt);
    }

    options.removeOption(option.id);

}

function putItem(item, options, option){

    new ServerData({
        id : `userprefs/${item.id}`
       
    }).put(item).then(function(data){
    
        if (data && data.content){
            
            setLogValue(
                "success", 
                "Ссылка удалена из избранного"
            );
            
            removeOption(options, option);
        }
         
    });
}


async function deleteUserprefsData(options, option){
 
    if (option && options){
        const owner   = await returnOwner();
        const name    = `userprefs.name+=+%27fields/${option.id}%27`;
        const ownerId = `userprefs.owner+=+${owner.id}`;
        new ServerData({
            id : `smarts?query=${name}+and+${ownerId}&limit=80&offset=0`,
           
        }).get().then(function(data){
        
            if (data && data.content){
                const item = data.content[0];

                if (item){
                    const prefs = JSON.parse(item.prefs);
                  
                    if (prefs.favorite){
                        delete prefs.favorite;
                    }

                    item.prefs = prefs;

                    putItem(item, options, option);
                }

            }
             
        });
    }

}
function removeBtnClick(){
    const options = $$("favCollectionLinks");
    const value   = options.getValue();
    const option  = options.getOption(value);
    
    modalBox("Закладка будет удалена из избранного", 
        "Вы уверены?", 
        ["Отмена", "Удалить"]
    )
    .then(function (result){

        if (result == 1){

            deleteUserprefsData(options, option);
            setLogValue (
                "success",
                `Закладка «${option.value}» удалена из избранного`
            );
        }
    });

}

function returnRemoveBtn(){
    const removeBtn = new Button({

        config   : {
            id       : "removeFavsBtn",
            hotkey   : "Alt+Shift+R",
            icon     : "icon-trash",
            disabled : true,
            click    : function(){
                removeBtnClick();
            },
        },
        titleAttribute : "Удалить ссылку из избранного"
       
    }).minView("delete");

    return removeBtn;
}

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
                {
                    cols:[
                        btnSaveLink,
                        returnRemoveBtn()
                    ]
                }
               
            ]
          
        }
    });

    popupFavsLink.createView ();
    
    favsPopupCollectionClick ();
    setAdaptiveSize($$("popupFavsLink"));
}



export {
    favsPopup,
};
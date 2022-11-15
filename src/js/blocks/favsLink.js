import { STORAGE ,getData }                 from "./globalStorage.js";
import { setLogValue }                      from "./logBlock.js";
import { setAjaxError, setFunctionError }   from "./errors.js";
import { setStorageData }                   from "./storageSetting.js";
import { getItemId }                        from "./commonFunctions.js";


import { Popup }                            from "../viewTemplates/popup.js";

function getUserData(){
    const userprefsGetData = webix.ajax("/init/default/api/whoami");
    userprefsGetData.then(function(data){
        data = data.json().content;

        let userData = {};
    
        userData.id       = data.id;
        userData.name     = data.first_name;
        userData.username = data.username;
        
        setStorageData("user", JSON.stringify(userData));
        
    });
    userprefsGetData.fail(function(err){
        setAjaxError(err, "favsLink","btnSaveLpostContentinkClick => getUserData");
    });
}

function setAdaptiveSize(popup){
    if (window.innerWidth < 1200 ){
        const size  = window.innerWidth * 0.89;
        try{
            popup.config.width = size;
            popup.resize();
        } catch (err){
            setFunctionError(err,"favsLink","function setAdaptiveSize");
        }
    }
 
}

function favsPopupCollectionClick (){
    const getData = webix.ajax().get("/init/default/api/userprefs/");
    
    getData.then(function(data){
        data = data.json().content;
        const favCollection = [];

        let user = webix.storage.local.get("user");

        if (!user){
            getUserData();
            user = webix.storage.local.get("user");
        }
    
        
        function getFavsCollection(){
            try{
                data.forEach(function(el){
                    if (el.name.includes("fav-link") && user.id == el.owner){
                        favCollection.push(JSON.parse(el.prefs));
                    }
                });
            } catch (err){
                setFunctionError(err,"favsLink","favsPopupCollectionClick => getFavsCollection");
            }
        }

        function createOptions(){
            const radio = $$("favCollectionLinks");
            try{
                if (favCollection.length){
                    favCollection.forEach(function(el){
                        radio.addOption(
                            {   id:el.id,
                                value:el.name,
                                favLink: el.link
                            }
                        );
                        radio.removeOption(
                            "radioNoneContent"
                        );
                    });
                }
                $$("popupFavsLink").show();
            } catch (err){
                setFunctionError(err,"favsLink","favsPopupCollectionClick => createOptions");
            }
         
        }
        
        if (user){
            getFavsCollection();
            createOptions();
        }
   
    
    });

    getData.fail(function(err){
        setAjaxError(err, "favsLink","favsPopupCollectionClick getData");
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

function favsPopup(){


    const radioLinks = {
        view:"radio", 
        id:"favCollectionLinks",
        vertical:true,
        options:[
            {   id:"radioNoneContent", disabled:true, value:"Здесь будут сохранены Ваши ссылки"}
        ],
        on:{
            onChange:function(newValue, oldValue){
                try{
                    const submitBtn = $$("favLinkSubmit");
                    if (newValue !== oldValue){
                        if (submitBtn && !(submitBtn.isEnabled())){
                            submitBtn.enable();
                        }
                    }
                } catch (err){
                    setFunctionError(err,"favsLink","favsPopup => radioLinks");
                }
            }
        }
    };

    const btnSaveLink = {
        view:"button",
        id:"favLinkSubmit", 
        value:"Открыть ссылку", 
        css:"webix_primary", 
        disabled:true,
        click:function(){
            favsPopupSubmitClick();
        }
 
    };
 
 
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
                radioLinks,
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
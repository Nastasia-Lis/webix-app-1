
import { setAjaxError, setFunctionError }           from "../blocks/errors.js";
import { pushUserDataStorage, getUserDataStorage }  from "../blocks/commonFunctions.js";

import { Popup }                                    from "../viewTemplates/popup.js";
import { Button }                                   from "../viewTemplates/buttons.js";



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

async function favsPopupCollectionClick (){

    let user =  getUserDataStorage();

    if (!user){
        await pushUserDataStorage();
        user =  getUserDataStorage();
    }

 
    const getData = webix.ajax().get("/init/default/api/userprefs/");
    
    getData.then(function(data){
        data = data.json().content;

        const favCollection = [];

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
                            {   id      :el.id,
                                value   :el.name,
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
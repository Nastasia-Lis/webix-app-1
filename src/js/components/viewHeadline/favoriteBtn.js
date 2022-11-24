import { LoadServerData, GetFields }        from "../../blocks/globalStorage.js";

import { setLogValue }                      from "../logBlock.js";
import { setAjaxError, setFunctionError }   from "../../blocks/errors.js";
import { getItemId, pushUserDataStorage, 
        getUserDataStorage }                from "../../blocks/commonFunctions.js";

import { Popup }                            from "../../viewTemplates/popup.js";
import { Button }                           from "../../viewTemplates/buttons.js";
function saveFavsClick(){


    async function getLinkName(){
        
        await LoadServerData.content("fields");
        const names = GetFields.names;

        function findName (id){
    
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
                setFunctionError(err, "favsLink", "findName");
            }
        }


        if (names){
            const id = getItemId();
            findName (id);
        }
      
    }

    function getLink(){
        try{
            const link = window.location.href;
            const favTemplate = $$("favLink");
            if (favTemplate){
                favTemplate.setValues(link);
            }
        } catch (err){
            setFunctionError(err,"favsLink","getLink");
        }
    }

    function destructPopupSave(){
        const popup = $$("popupFavsLinkSave");
        try{
            if (popup){
                popup.destructor();
            }
        } catch (err){
            setFunctionError(err,"favsLink","destrucPopupSave");
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
                const keys = Object.keys(value);

                if (keys.length !== 0){
                    return createDivTemplate(name, value);

                } else {
                    return createDivTemplate(name, nonName);

                }
          
            }
        };
    }

    function btnSaveLinkClick(){
   
        let favNameLinkVal;
        let favLinkVal;
        const namePref = getItemId();
        function getData(){
            try{
                favNameLinkVal = $$("favNameLink").getValues();
                favLinkVal     = $$("favLink")    .getValues();
            } catch (err){
                setFunctionError(err, "favsLink", "btnSaveLinkClick => getData");
            }
        }


        async function postContent(){
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
                const postData = webix.ajax().post("/init/default/api/userprefs/", postObj);

                postData.then(function(data){
                    data = data.json();
            
                    if (data.err_type == "i"){
                        setLogValue("success", "Ссылка" + " «" + favNameLinkVal + "» " + " сохранёна в избранное");
                    } else {
                        setFunctionError(data.err, "favsLink", "btnSaveLinkClick => postContent msg" );
                    }

                    destructPopupSave();
                });

                postData.fail(function(err){
                    setAjaxError(err, "favsLink", "btnSaveLinkClick => postContent");
                });
            }
        }


        function getUserprefs(){
            const getData = webix.ajax().get("/init/default/api/userprefs/");
            getData.then(function(data){
                data = data.json().content;
                const favPrefs = [];

                function getFavPrefs(){
                    try{
                        data.forEach(function(pref){
            
                            if (pref.name.includes("fav-link")){
                                favPrefs.push(pref.name);
                            }
                    
                        });
                    } catch (err){
                        setFunctionError(err,"favsLink","getUserprefs => getFavPrefs");
                    }
                }

                function getNotUniquePrefs (){
                    try{
                        let unique = true;
                        if (favPrefs.length){
                            favPrefs.forEach(function(el){
                             
                                if (el.includes(namePref)){
                                    
                                    const index = el.indexOf("_")+1;
                                    const id = el.slice(index);
                            
                                    if (id == namePref && unique){
                                        unique = false;
                                        setLogValue("success", "Такая ссылка уже есть в избранном");
                                    } 
                                } 
                            });
                        } 
                        
                     
                        if (!(favPrefs.length) || unique) {
                            postContent();
                        } else if (!unique){
                            destructPopupSave();
                        }
                    } catch (err){
                        setFunctionError(err,"favsLink","getUserprefs => getNotUniquePrefs");
                    }
                }
      
                getFavPrefs();
                getNotUniquePrefs ();
           
            });
            getData.fail(function(err){
                setAjaxError(err, "favsLink","getUserprefs getData");
            });
            }


       
        getData();
        getUserprefs();
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
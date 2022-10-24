import  {STORAGE,getData} from "./globalStorage.js";
import  {setLogValue} from "./logBlock.js";
import {setAjaxError,setFunctionError} from "./errors.js";
import {setStorageData} from "./storageSetting.js";



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

    const popupHeadline = {   
        template:"Избранное", 
        width:250,
        css:"popup_headline", 
        borderless:true, 
        height:20 
    };

    const btnClosePopup = {
        view:"button",
        id:"buttonClosePopup",
        css:"popup_close-btn",
        type:"icon",
        width:35,
        icon: 'wxi-close',
        click:function(){
            try{
                if ($$("popupFavsLink")){
                    $$("popupFavsLink").destructor();
                }
            } catch (err){
                setFunctionError(err,"favsLink","favsPopup click");
            }
        
        }
    };

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
 
    webix.ui({
        view:"popup",
        id:"popupFavsLink",
        css:"webix_popup-prev-href",
        width:400,
        minHeight:300,
        escHide:true,
        modal:true,
        position:"center",
        body:{
            rows:[
            {rows: [ 
                { cols:[
                    popupHeadline,
                    {},
                    btnClosePopup,
                ]},
                radioLinks,
                {height:15},
                btnSaveLink,
            ]}]
            
        },

    });
    
    favsPopupCollectionClick ();

}


function getCurrId(){
    let id;
    try{
        const tree = $$("tree");
        
        if (tree && tree.getSelectedId()){
            id = tree.getSelectedId();
        } else {
            const url = window.location.pathname;
            const index =  window.location.pathname.lastIndexOf("/")+1;
            id = url.slice(index);
        
        }
    } catch (err){
        setFunctionError(err,"favsLink","getCurrId");
    }
    return id;
}

function saveFavsClick(){

    async function getLinkName(){
        
        if (!STORAGE.fields){
            await getData("fields"); 
        }

        function findName (id){
            try{
                const nameTemplate = $$("favNameLink");
                STORAGE.tableNames.forEach(function(el,i){
                    if (el.id == id){
                        if(nameTemplate){
                            nameTemplate.setValues(el.name);
                        }
                    }
                    
                });
            } catch (err){
                setFunctionError(err,"favsLink","findName");
            }
        }
        if (STORAGE.tableNames){
            const id = getCurrId();
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
        try{
            if ($$("popupFavsLinkSave")){
                $$("popupFavsLinkSave").destructor();
            }
        } catch (err){
            setFunctionError(err,"favsLink","destrucPopupSave");
        }
    }
     
    function createTemplate(id, name,nonName){
        return {   
            id:id,
            css:"popup_subtitle", 
            borderless:true, 
            height:20 ,
            template: function(){
                if (Object.keys($$(id).getValues()).length !==0){
                    return "<div style='font-weight:600'>"+name+": </div>"+$$(id).getValues();
                } else {
                    return "<div style='font-weight:600'>"+name+": </div>"+name+" "+nonName;
                }
          
            }
        }
    }

    function btnSaveLinkClick(){
   
        let favNameLinkVal;
        let favLinkVal ;
        const namePref = getCurrId();
        function getData(){
            try{
                favNameLinkVal = $$("favNameLink").getValues();
                favLinkVal     = $$("favLink").getValues();
            } catch (err){
                setFunctionError(err,"favsLink","btnSaveLinkClick => getData");
            }
        }


        function postContent(){
            let user = webix.storage.local.get("user");
            let ownerData;


            if (!user){
                getUserData();
                user = webix.storage.local.get("user");
            }

            if (user){
                ownerData = user.id;

                const postObj = {
                    name:"fav-link_"+namePref,
                    owner:ownerData,
                    prefs:{
                        name: favNameLinkVal,
                        link: favLinkVal,
                        id:namePref,
                    }
                };
                const postData = webix.ajax().post("/init/default/api/userprefs/",postObj);

                postData.then(function(data){
                    data = data.json();
            
                    if (data.err_type == "i"){
                        setLogValue("success","Ссылка"+" «"+favNameLinkVal+"» "+" сохранёна в избранное");
                    } else {
                        setFunctionError(data.err,"favsLink","btnSaveLinkClick => postContent msg" );
                    }

                    destructPopupSave();
                });

                postData.fail(function(err){
                    setAjaxError(err, "favsLink","btnSaveLinkClick => postContent");
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
   
    const popupHeadline = {   
        template:"Сохранить ссылку", 
        width:250,
        css:"popup_headline", 
        borderless:true, 
        height:20 
    };

    const btnClosePopup = {
        view:"button",
        id:"buttonClosePopup",
        css:"popup_close-btn",
        type:"icon",
        width:35,
        icon: 'wxi-close',
        click:function(){
            destructPopupSave();
        
        }
    };

    
    const btnSaveLink = {
        view:"button", 
        value:"Сохранить ссылку", 
        css:"webix_primary", 
        click:function(){
            btnSaveLinkClick();
        }
 
    };



    webix.ui({
        view:"popup",
        id:"popupFavsLinkSave",
        css:"popup_padding-container",
        escHide:true,
        width:500,
        //height:300,
        modal:true,
        position:"center",
        body:{
            rows:[
            {rows: [ 
                { cols:[
                    popupHeadline,
                    {},
                    btnClosePopup,
                   
                ]},
                createTemplate("favNameLink","Имя","не указано"),
                {height:5},
                createTemplate("favLink","Ссылка","не указана"),
                {height:10},
                btnSaveLink,
                {}
                //{height:10}
            ]}]
            
        },

    }).show();

    getLinkName();
    getLink();
}



export{
    favsPopup,
    saveFavsClick
};
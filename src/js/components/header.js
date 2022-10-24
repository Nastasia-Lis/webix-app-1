
import {modalBox} from "../blocks/notifications.js";
import {setLogValue} from '../blocks/logBlock.js';
import {setStorageData,setUserLocation} from "../blocks/storageSetting.js";
import {catchErrorTemplate,ajaxErrorTemplate} from "../blocks/logBlock.js";

import {saveItem, saveNewItem} from "../blocks/tableEditForm/buttons.js";
import {setAjaxError,setFunctionError} from "../blocks/errors.js";

import {favsPopup} from "../blocks/favsLink.js";


let userLocation;
let headerContextId;

function header() {
    function collapseClick (){

        function setSearchInputState(visible=false){
            const headerChilds = $$("header").getChildViews();

            headerChilds.forEach(function(el){
                if (el.config.id.includes("search" )      || 
                    el.config.id.includes("log-btn")      || 
                    el.config.id.includes("context-menu") ){
                    if(visible){
                        el.show();
                    } else {
                        el.hide();
                    }
                  
                }
            });
        }
        try {

            if (window.innerWidth > 850 ){
                if ($$("tree").isVisible()){
                  // this.config.icon ="wxi-angle-double-right";
                    this.refresh();
                    $$("tree").hide();
                    if($$("sideMenuResizer")){
                        $$("sideMenuResizer").hide();
                    } 

                } else {
                    $$("tree").show();
                  //  this.config.icon ="wxi-angle-double-left";
                    this.refresh();
                    if(window.innerWidth >= 800){
                        if($$("sideMenuResizer")){
                            $$("sideMenuResizer").show();
                        }
                    } 
                
                    
                }
            } else {
                if ($$("tree").isVisible()){
                   // this.config.icon ="wxi-angle-double-right";
                    this.refresh();
                    $$("tree").hide();
                    if($$("sideMenuResizer")){
                        $$("sideMenuResizer").hide();
                    } 
                    setSearchInputState(true);

                } else {
                    $$("tree").show();
                    $$("tree").config.width = window.innerWidth;
                    $$("tree").resize()
                    
                   // this.config.icon ="wxi-angle-double-left";
                    this.refresh();
                    if(window.innerWidth >= 800){
                        if($$("sideMenuResizer")){
                            $$("sideMenuResizer").show();
                        }
                    } 

                    setSearchInputState();
                }
            }

           
        } catch (error){
            console.log(error);
            catchErrorTemplate("009-000", error);
    
        }
    }

    const header = {
        view: "toolbar", 
        id: "header",
        padding:10,
        css:"webix_header-style",
        elements: [
            {cols:[
                {   
                    view:"button",
                    type:"icon",
                    id:"collapseBtn",
                    icon:"icon-bars",
                    css:"webix_collapse",
                    title:"текст",
                    height:42, 
                    width:40,
                    click:collapseClick,
                    on: {
                        onAfterRender: function () {
                            this.getInputNode().setAttribute("title","Видимость бокового меню");
                        }
                    }    
                },
                {
                    view:"label",
                    label:"<img src='/init/static/images/expalogo.png' style='height:30px; margin: 10px;'>", 
                    height:25
               }
            ]},
            
            {},
            {view:"search", 
                placeholder:"Поиск", 
                css:"searchTable",
                height:42, 
                maxWidth:250, 
                minWidth:40, 
            },
            {   view:"button",  
                id:"webix_log-btn",
                type:"icon", 
                icon:"icon-eye",
                height:42, 
                badge:0,
                width: 50,
                css:"webix_log-btn",
                click:function (){
                    if (this.getValue() == 1){
                        this.setValue(2);
                    } else {
                        this.setValue(1);
                    }
                },
                on: {
                    onAfterRender: function () {
                        this.getInputNode().setAttribute("title","Показать/скрыть системные сообщения");
                    },
                    onChange:function(newValue, oldValue, config){

                        let lastItemList = $$("logBlock-list").getLastId();
                        if (newValue == 2){
                            this.config.badge = "";
                            $$("logBlock-list").showItem(lastItemList);
                        
                            $$("logLayout").config.height = 90;
                        
                            $$("logLayout").resize();
                            this.config.icon ="icon-eye-slash";
                            this.refresh();
                           // setStorageData("LogVisible", JSON.stringify("show"));
                        } else {
                            $$("logLayout").config.height = 5;
                            $$("logLayout").resize();
                            this.config.icon ="icon-eye";
                            this.refresh();
                            //setStorageData("LogVisible", JSON.stringify("hide"));
            
                            $$("webix_log-btn").config.badge = "";
                            $$("webix_log-btn").refresh();
                        }
            
                    }
                },
               
            },

            {   view:"button",
                id:"button-context-menu",
                type:"icon",
                disabled:true,
                icon: 'icon-user',
                height:38, 
                width: 50,
                popup: {
                    view: 'contextmenu',
                    id:"contextmenu",
                    css:"webix_contextmenu",
                    data: [],
                    on:{
                        onItemClick:function(id, e, node){
                            function clearTree(){
                                if ($$("tree")){
                                    $$("tree").clearAll();
                                }
                            }

                            function modalBoxTable (navPath){
                                try{
                                    modalBox().then(function(result){
                                        const saveBtn    = $$("table-saveBtn");
                                        if (result == 1){
                                            Backbone.history.navigate(navPath, { trigger:true});
                                            
                                            $$("editTableFormProperty").config.dirty = false;
                                            $$("editTableFormProperty").refresh();
                                            clearTree();
                                        } else if (result == 2){
                                            if ($$("editTableFormProperty") && $$("editTableFormProperty").config.dirty){
                                                if (saveBtn.isVisible()){
                                                    saveItem(false,false,true);
                                                } else {
                                                    saveNewItem(); 
                                                }

                                                $$("editTableFormProperty").config.dirty = false;
                                                $$("editTableFormProperty").refresh();
                                                Backbone.history.navigate(navPath, { trigger:true});
                                                clearTree();
                                            }
                                            
                                        }
                                    });
                                } catch (error){
                                    console.log(error);
                                    catchErrorTemplate("005-000", error);
                                }
                               
                            }

                            function hideContentElements(id){
                                $$("container").getChildViews().forEach(function(el){
                                
                                    if ( el.config.id !== id && $$(el.config.id).isVisible() ){
                                        $$(el.config.id).hide();
                                    }
                                }); 
                            }

                            // function createPath(){
                            //     if (window.location.href.includes("localhost:3000/index.html/")){
                            //         return "/index.html/";
                            //     } else {
                            //         return "/init/default/spaw/";
                            //     }
                            // }
                      
                            try {
                              //  const path = createPath();
                            
                                if (id=="logout"){
                                    if($$("editTableFormProperty") && $$("editTableFormProperty").config.dirty || $$("cp-form") && $$("cp-form").isDirty()){
                                       
                                        
                                        try{
                                            modalBox().then(function(result){
                                                if (result == 1){
                                                    Backbone.history.navigate("logout", { trigger:true});
                                                    
                                                    $$("editTableFormProperty").config.dirty = false;
                                                    $$("editTableFormProperty").refresh();
                                                } else if (result == 2){

                                                    if ($$("cp-form") || $$("editTableFormProperty")){
                                                        if ($$("cp-form") && $$("cp-form").isDirty() && $$("cp-form").validate()){
                                                            let objPass = {op:"",np:""};
                                                            let passData = $$("cp-form").getValues();
                                                            objPass.np = passData.newPass;
                                                            objPass.op = passData.oldPass;
                                                            webix.ajax().post("/init/default/api/cp", objPass, {
                                                                success:function(text, data, XmlHttpRequest){
                                                                    data = data.json()
                                                                    if (data.err_type == "i"){
                                                                        setLogValue("success",data.err);
                                                                    
                                                                    } else if (data.err_type == "e"){
                                                                        setLogValue("error",data.err);
                                                                    }
                                                                },
                                                                error:function(text, data, XmlHttpRequest){
                                                                    ajaxErrorTemplate("011-000",XmlHttpRequest.status,XmlHttpRequest.statusText,XmlHttpRequest.responseURL);
                                                                }
                                                            });
                                                            Backbone.history.navigate("logout", { trigger:true});
                                                        
                                                        } else if ($$("editTableFormProperty") && $$("editTableFormProperty").config.dirty){
                                                            if ($$("editTableFormProperty").getValues().id){
                                                                saveItem(false,false,true);
                                                            } else {
                                                                saveNewItem(); 
                                                            }
                                                            
                                                            $$("editTableFormProperty").config.dirty = false;
                                                            $$("editTableFormProperty").refresh();
                                                            Backbone.history.navigate("logout", { trigger:true});
                                                        
                                                        }else {
                                                            setLogValue("error","Заполните пустые поля");
                                                            return false;
                                                        }
                                                    } 
                                                }
                                            });
                                        } catch (error){
                                            console.log(error);
                                            catchErrorTemplate("005-000", error);
                                        }
         
                                        return false;
                                    } else {
                                        Backbone.history.navigate("logout", { trigger:true});
                                       // window.location.replace(logoutPath);
                                    }
                                } else if (id == "cp"){
                                    if ($$("editTableFormProperty") && $$("editTableFormProperty").config.dirty){
                                    modalBoxTable ("cp");
                                    } else {
                                        clearTree();
                                       Backbone.history.navigate("/cp", { trigger:true});
                                        //console.log( window.location.hostname)
                                       
                                       // window.location.replace(path+"cp");
                                    }
                                    hideContentElements("user_auth");
                                } else if (id == "userprefs"){
                                    if ($$("editTableFormProperty") && $$("editTableFormProperty").config.dirty){
                                    modalBoxTable ("userprefs");
                                    } else {
                                        clearTree();
                                       Backbone.history.navigate("/userprefs", { trigger:true});
                                       // window.location.replace("/index.html/userprefs");
                                      
                                      // window.location.replace(path+"userprefs");
                                    }
                                    hideContentElements("userprefs");
                                } else if (id == "favs"){
                                   
                                    favsPopup();
                                }
                            } catch (error){
                                console.log(error);
                                catchErrorTemplate("005-000", error);
                            }
 

                  
                        }
                    }
                },
                on:{
                    onItemClick:function(){
                        try {

                            webix.ajax().get("/init/default/api/userprefs/", {
                                success:function(text, data, XmlHttpRequest){
                                    data = data.json().content;
                                    if (data.err_type == "e"){
                                        setLogValue("error",data.error);
                                    }

                                    if (window.location.pathname !== "/index.html/content" &&  window.location.pathname!=="/init/default/spaw/content"){
                                        
                                        let settingExists = false;
                                        let location = {};
                                        location.href = window.location.href;

                                        let sentObj = {
                                            name:"userLocationHref",
                                            prefs:location
                                        };
                                    
                                        try{
                                            data.forEach(function(el,i){
                                                if (el.name == "userLocationHref"){
                                                    settingExists = true;

                                                    webix.ajax().put("/init/default/api/userprefs/"+el.id, sentObj, {
                                                        success:function(text, data, XmlHttpRequest){
                                                            data = data.json();
                                                            if (data.err_type == "e"){
                                                                setLogValue("error",data.error);
                                                            }
                                                        
                                                        },
                                                        error:function(text, data, XmlHttpRequest){
                                                            ajaxErrorTemplate("005-011",XmlHttpRequest.status,XmlHttpRequest.statusText,XmlHttpRequest.responseURL);
                                                        }
                                                    }).catch(error => {
                                                        console.log(error);
                                                        ajaxErrorTemplate("005-011",error.status,error.statusText,error.responseURL);
                                                    });
                                                
                                                } 
                                            });
                                        } catch (error){
                                            console.log(error);
                                            catchErrorTemplate("005-000", error);
                                        }


                                        try{
                                            if (!settingExists){
                                
                                                let ownerId = webix.storage.local.get("user").id;
            
                                                if (ownerId){
                                                    sentObj.owner = ownerId;
                                                } else {
                                                    webix.ajax("/init/default/api/whoami",{
                                                        success:function(text, data, XmlHttpRequest){
                                                            
                                                            sentObj.owner = data.json().content.id;
            
                                                            let userData = {};
                                                            userData.id = data.json().content.id;
                                                            userData.name = data.json().content.first_name;
                                                            userData.username = data.json().content.username;
                                                            
                                                            setStorageData("user", JSON.stringify(userData));
                                                        },
                                                        error:function(text, data, XmlHttpRequest){
                                                            ajaxErrorTemplate("005-011",XmlHttpRequest.status,XmlHttpRequest.statusText,XmlHttpRequest.responseURL);
                                                        }
                                                    }).catch(error => {
                                                        console.log(error);
                                                        ajaxErrorTemplate("005-000",error.status,error.statusText,error.responseURL);
                                                    });
                                                }

                                                webix.ajax().post("/init/default/api/userprefs/",sentObj, {
                                                    success:function(text, data, XmlHttpRequest){
                                                        data = data.json();
                                
                                                        if (data.err_type == "e"){
                                                            setLogValue("error",data.error);
                                                        }
                                                        
                                                    },
                                                    error:function(text, data, XmlHttpRequest){
                                                        ajaxErrorTemplate("005-001",XmlHttpRequest.status,XmlHttpRequest.statusText,XmlHttpRequest.responseURL);
                                                    }
                                                }).catch(error => {
                                                    console.log(error);
                                                    ajaxErrorTemplate("005-001",error.status,error.statusText,error.responseURL);
                                                });
                                            }
                                        } catch (error){
                                            console.log(error);
                                            catchErrorTemplate("005-000", error);
                                        }
                                    }
                                },
                                error:function(text, data, XmlHttpRequest){
                                    ajaxErrorTemplate("005-000",XmlHttpRequest.status,XmlHttpRequest.statusText,XmlHttpRequest.responseURL);
                                }
                            }).catch(error => {
                                console.log(error);
                                ajaxErrorTemplate("005-000",error.status,error.statusText,error.responseURL);
                            });
                        } catch (error){
                            console.log(error);
                            catchErrorTemplate("005-000", error);
                        }
                    }
                }
            },

        ]
    };

    return header;

}

export {
    header,
    headerContextId,
    userLocation
};
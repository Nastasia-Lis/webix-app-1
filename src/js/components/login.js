import {router,createElements,removeElements} from "../blocks/router.js";
import {catchErrorTemplate,ajaxErrorTemplate} from "../blocks/logBlock.js";
import {setUserLocation} from "../blocks/storageSetting.js";

 
if ( window.location.pathname !== "/index.html" && window.location.pathname !=="/" && window.location.pathname !=="/init/default/spaw/"){
    setUserLocation ("",window.location.href);
} 

function login () {
    router();
    
    function getLogin(){
       
        let userData = $$("formAuth").getValues();
        let loginData = [];

        try {
           
            $$("formAuth").validate();
            loginData.push("un"+"="+userData.username);
            loginData.push("np"+"="+userData.password);
        
            webix.ajax("/init/default/login"+"?"+loginData.join("&"),{
                success:function(text, data, XmlHttpRequest){
                    webix.ajax("/init/default/api/whoami",{
                        success:function(text, data, XmlHttpRequest){
                            try {
                              
                                let userLocation = webix.storage.local.get("userLocation");
                                
                                let http = new XMLHttpRequest();
                                http.open('HEAD', userLocation.href, false);
                                http.send();
                          
                                if (userLocation&&userLocation.href&&http.status==200){
                                    window.location.replace(userLocation.href);
                                    console.log(userLocation.href,"oeoeoeo")
                                    localStorage.removeItem("userLocation");
                                    if ( $$('formAuth')){
                                        $$('formAuth').clear();
                                    }
                                } else {
                                    Backbone.history.navigate("content", { trigger:true});
                                    if ( $$('formAuth')){
                                        $$('formAuth').clear();
                                    }
                                    console.log("content")
                                    window.location.reload();
                                }

                                
                            } catch (error){
                                console.log(error);
                                catchErrorTemplate("007-005", error);
                            }
                        },
                        error:function(text, data, XmlHttpRequest){
                            if ($$("formAuth")&&$$("formAuth").isDirty()){
                                webix.message({type:"error",expire:3000, text:"Неверный логин или пароль"});
                            }

                            ajaxErrorTemplate("007-006",XmlHttpRequest.status,XmlHttpRequest.statusText,XmlHttpRequest.responseURL);

                        }
                    });
                },
                error:function(text, data, XmlHttpRequest){
                    webix.message({type:"error",expire:3000, text:"Не удалось выполнить выход"});
                    ajaxErrorTemplate("007-006",XmlHttpRequest.status,XmlHttpRequest.statusText,XmlHttpRequest.responseURL);
                }
            }).catch(error => {
                console.log(error);
                ajaxErrorTemplate("007-006",error.status,error.statusText,error.responseURL);
            });
        } catch (error){
            console.log(error);
            catchErrorTemplate("007-000", error);

        }

    }
    
    
    return {
        view:"form",
        id:"formAuth",
        maxWidth: 300,
        borderless:true,
        elements: [
            {view:"text", label:"Логин", name:"username",invalidMessage:"Поле должно быть заполнено"  },
            {view:"text", label:"Пароль", name:"password",invalidMessage:"Поле должно быть заполнено",
            type:"password"},
            {view:"button", value: "Войти", css:"webix_primary",
            hotkey: "enter", align:"center", click:getLogin}, 
        ],
    
        rules:{
    
            "username":webix.rules.isNotEmpty,
            "password":webix.rules.isNotEmpty,
    
          },
    
    
        elementsConfig:{
            labelPosition:"top"
        }
    
    };

}

export {
    login,
    createElements,
    removeElements
};
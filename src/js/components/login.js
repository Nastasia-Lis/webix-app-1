import {router,createElements,removeElements} from "../blocks/router.js";
import {catchErrorTemplate,ajaxErrorTemplate} from "../blocks/logBlock.js";
import {setStorageData} from "../blocks/storageSetting.js";


function login () {
    router();
    
    function getLogin(){
       
        let userData = $$("formAuth").getValues();
        let loginData = {};

        try {
           
            $$("formAuth").validate();
            loginData.un = userData.username;
            loginData.np = userData.password;

            webix.ajax().post("/init/default/login",loginData,{
                success:function(text, data, XmlHttpRequest){
 
                    webix.ajax("/init/default/api/whoami",{
                        success:function(text, data, XmlHttpRequest){
                            try {
                   
                                let userData = {};
                                userData.id = data.json().content.id;
                                userData.name = data.json().content.first_name;
                                userData.username = data.json().content.username;
                                
                                setStorageData("user", JSON.stringify(userData));


                                if ( $$('formAuth')){
                                    $$('formAuth').clear();
                                }
                    
                   
                                Backbone.history.navigate("content", { trigger:true});
                                window.location.reload();
                            

                                
                            } catch (error){
                                console.log(error);
                                catchErrorTemplate("007-005", error);
                            }
                        },
                        error:function(text, data, XmlHttpRequest){
                            if ($$("formAuth")&&$$("formAuth").isDirty()){
                                $$("formAuth").markInvalid("username", "");
                                $$("formAuth").markInvalid("password", "Неверный логин или пароль");
                            }

                            ajaxErrorTemplate("007-006",XmlHttpRequest.status,XmlHttpRequest.statusText,XmlHttpRequest.responseURL);

                        }
                    }).then(function(data){
                        webix.ajax().get("/init/default/api/userprefs/", {
                            success:function(text, data, XmlHttpRequest){


                            
                            },
                            error:function(text, data, XmlHttpRequest){
                                ajaxErrorTemplate("007-000",XmlHttpRequest.status,XmlHttpRequest.statusText,XmlHttpRequest.responseURL);
                            }
                        }).catch(error => {
                            console.log(error);
                            ajaxErrorTemplate("007-000",error.status,error.statusText,error.responseURL);
                        });



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
        width:250,
        borderless:true,
        elements: [
            {   view:"text", 
                label:"Логин", 
                name:"username",
                invalidMessage:"Поле должно быть заполнено",
                on:{
                    onItemClick:function(){
                        $$('formAuth').clearValidation();
                    }
                }  
            },
                {view:"text", 
                label:"Пароль", 
                name:"password",
                invalidMessage:"Поле должно быть заполнено",
                type:"password",
                on:{
                    onItemClick:function(){
                        $$('formAuth').clearValidation();
                    }
                } 
            },
            {   view:"button", 
                value: "Войти", 
                css:"webix_primary",
                hotkey: "enter", 
                align:"center", 
                click:getLogin
            }, 
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
// $$("formAuth").getChildViews().forEach(function(el,i){
//     if (el.config.view == "text"){
//         $$(el.config.id).define("css",'webix_invalid')
//         $$(el.config.id).refresh();
//     }
// });

export {
    login,
    createElements,
    removeElements
};
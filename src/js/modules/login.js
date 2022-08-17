import {notify} from "./editTableForm.js";

function login () {
    let routes = new (Backbone.Router.extend({
        routes:{
            "":"index", 
            "content":"content" ,
        },
        content:function(){
            $$("mainLayout").show(); 
        },
        index:function(){
            $$("userAuth").show();
        }, 
    
    }));
    
    // function checkUserLogin () {
    //     //let userAuthSuccess;
    //     webix.ajax("/init/default/api/whoami",{
    //         success:function(text, data, XmlHttpRequest){
    //             window.location.replace('http://localhost:3000/index.html#content');
    //             //return userAuthSuccess == true;
    //         },
    //         error:function(text, data, XmlHttpRequest){
               
    //         }
    //     });
    // }
    
    
    
    function getLogin(){
        $$("formAuth").validate();
        let userData = $$("formAuth").getValues();
        let loginData = [];
    
        loginData.push("un"+"="+userData.username);
        loginData.push("np"+"="+userData.password);
    
        webix.ajax("/init/default/login"+"?"+loginData.join("&"),{
            success:function(text, data, XmlHttpRequest){
                console.log(data.json(), "login");
                webix.ajax("/init/default/api/whoami",{
                    success:function(text, data, XmlHttpRequest){
                        routes.navigate("content", { trigger:true});
                        console.log(data.json())
                       
                    },
                    error:function(text, data, XmlHttpRequest){
                        if ($$("formAuth").isDirty()){
                            notify ("error","Неверный логин или пароль");
                        }
                    }
                });
                //checkUserLogin ();
    
            },
            error:function(text, data, XmlHttpRequest){
               
                //notify ("error","Ошибка");
            }
        });
    
     
        
    
    
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
    //loginCheck ,
    //hideInterfaceElements,
    // formLogin, 
    // checkUserLogin,
    // getLogin,
    // routes
    login
};
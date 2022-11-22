import { router }                                 from "./routerConfig/_router.js";
import { createElements, removeElements }         from "./routerConfig/common.js";


function createSentObj(){
    const loginData = {};
    const form      = $$("formAuth");
    try{
     
        const userData  = form.getValues();

        loginData.un    = userData.username;
        loginData.np    = userData.password;
        
    } catch (err){
        console.log(err + " login function createSentObj");
    }

    return loginData;
}

function postLoginData(){
    const loginData = createSentObj();
    const form      = $$("formAuth");

    const postData  = webix.ajax().post("/init/default/login",loginData);

    postData.then(function(data){

        if (data.json().err_type == "i"){

            data = data.json().content;
            const userData     = {};


            userData.id        = data.id;
            userData.name      = data.first_name;
            userData.username  = data.username;

            if (form){
                form.clear();
            }

            Backbone.history.navigate("content", { trigger:true});
            window.location.reload();
 
        } else {
            if (form && form.isDirty()){
                form.markInvalid("username", "");
                form.markInvalid("password", "Неверный логин или пароль");
            }
        }

    });

    postData.fail(function(err){
        console.log(err + " login function postLoginData");
    });
}

function getLogin(){

    const form = $$("formAuth");

    form.validate();
    postLoginData();

}

function login () {
  
    router();

    const invalidMsgText = "Поле должно быть заполнено";

    const login =  {   
        view            : "text", 
        label           : "Логин", 
        name            : "username",
        invalidMessage  : invalidMsgText,
        on              : {
            onItemClick:function(){
                $$('formAuth').clearValidation();
            }
        }  
    };

    const pass =  {   
        view            : "text", 
        label           : "Пароль", 
        name            : "password",
        invalidMessage  : invalidMsgText,
        type            : "password",
        icon            : "password-icon wxi-eye",   
        on              : {
            onItemClick:function(id, event){
                const className = event.target.className;
                const input     = this.getInputNode();

                function removeCss(className){
                    webix.html.removeCss(event.target, className);
                }

                function updateInput(type, className){
                    webix.html.addCss(event.target, className);
                    input.type = type;
                }
       
                if (className.includes("password-icon")){
                    removeCss("wxi-eye-slash");
                    removeCss("wxi-eye");

                    if(input.type == "text"){    
                        updateInput("password", "wxi-eye"); 
                    } else {
                        updateInput("text", "wxi-eye-slash"); 
 

                    }
 
                }
                
                $$('formAuth').clearValidation();
     
            },
        } 
    };

    const btnSubmit = {   
        view    : "button", 
        value   : "Войти", 
        css     : "webix_primary",
        hotkey  : "enter", 
        align   : "center", 
        click   :getLogin
    };

    const form = {
        view        : "form",
        id          : "formAuth",
        width       : 250,
        borderless  : true,
        elements    : [
            login,
            pass,
            btnSubmit, 
        ],

        rules:{
            
            "username" : webix.rules.isNotEmpty,
            "password" : webix.rules.isNotEmpty,
    
          },
    
    
        elementsConfig:{
            labelPosition:"top"
        }
    
    };
    
    
    return form;

}

const auth = {
    hidden  : true, 
    id      : "userAuth", 
    cols    : [
        {
            view    : "align", 
            align   : "middle,center",
            body    : login()
        },

    ]
}; 

export {
    createElements,
    removeElements,
    auth
};
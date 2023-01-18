import { router }       from "./routerConfig/_router.js";
import { ServerData }   from "../blocks/getServerData.js";


function createSentObj(){
    const loginData = {};
    const form      = $$("formAuth");
    try{
     
        const userData  = form.getValues();

        loginData.un    = userData.username;
        loginData.np    = userData.password;
        
    } catch (err){
        console.log(
            err + 
            " login function createSentObj"
        );
    }

    return loginData;
}


function errorActions (){
    const form      = $$("formAuth");

    if (form && form.isDirty()){
        form.markInvalid(
            "username", 
            ""
        );
        form.markInvalid(
            "password", 
            "Неверный логин или пароль"
        );
    }
}

function postLoginData(){
    const loginData = createSentObj();
    const form      = $$("formAuth");

    new ServerData({
    
        id           : "/init/default/login",
        isFullPath   : true,
        errorActions : errorActions
       
    }).post(loginData).then(function(data){
    
        if (data){
    
            const content = data.content;
    
            if (content){
    
                if (form){
                    form.clear();
                }
                
                Backbone.history.navigate("content", { trigger:true});
                window.location.reload();
            }
        } else {
            errorActions (); 
        }
         
    });

}

const invalidMsgText = "Поле должно быть заполнено";

function returnLogin(){
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

    return login;
}


function clickPass(event, self){
    const className = event.target.className;
    const input     = self.getInputNode();

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
}


function returnPass(){
    const pass =  {   
        view            : "text", 
        label           : "Пароль", 
        name            : "password",
        invalidMessage  : invalidMsgText,
        type            : "password",
        icon            : "password-icon wxi-eye", 
        keyPressTimeout :  120000,  // 120000  = 2 min
        on              : {
            onItemClick:function(id, event){
                clickPass(event, this);
     
            },
            onTimedKeyPress:function(){
                this.setValue(""); // auto clear
            }
        } 
    };

    return pass;
}

function getLogin(){

    const form = $$("formAuth");

    form.validate();
    postLoginData();

}

function returnBtnSubmit(){
    const btnSubmit = {   
        view    : "button", 
        value   : "Войти", 
        css     : "webix_primary",
        hotkey  : "enter", 
        align   : "center", 
        click   :getLogin
    };

    return btnSubmit;
}

function returnForm(){
    const form = {
        view        : "form",
        id          : "formAuth",
        width       : 250,
        borderless  : true,
        elements    : [
            returnLogin     (),
            returnPass      (),
            returnBtnSubmit (), 
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


function login () {
    router();
    return returnForm();
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
    auth 
};
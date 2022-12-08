import { router }              from "./routerConfig/_router.js";


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

    const path      = "/init/default/login";
    const postData  = webix.ajax().post(path, loginData);

    postData.then(function(data){

        if (data.json().err_type == "i"){

            data = data.json().content;

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
        on              : {
            onItemClick:function(id, event){
                clickPass(event, this);
     
            },
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
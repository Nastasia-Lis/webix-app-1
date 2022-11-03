import {router}                                 from "../blocks/routerConfig/router.js";
import {createElements,removeElements}          from "../blocks/routerConfig/common.js";

import {setStorageData, setUserPrefs}           from "../blocks/storageSetting.js";

import {setFunctionError, setAjaxError}         from "../blocks/errors.js";

function createSentObj(){
    const loginData = {};
    const form      = $$("formAuth");
    try{
     
        const userData  = form.getValues();

        loginData.un    = userData.username;
        loginData.np    = userData.password;
        
    } catch (err){
        setFunctionError(err,"login","createSentObj");
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
        setAjaxError(err, "login","postLoginData");
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
        on              : {
            onItemClick:function(){
                $$('formAuth').clearValidation();
            }
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
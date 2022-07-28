
var routes = new (Backbone.Router.extend({
    routes:{
        "":"index", 
        "content":"content" 
    },
    content:function(){
        $$("mainLayout").show(); 
    },
    index:function(){
        $$("userAuth").show();
    }
}));

// function loginCheck () {
//     let authSuccessVal = webix.storage.local.get("authSuccess");
//     if (authSuccessVal){
//         showInterfaceElements();
//     }
// }

function submit(){
    // $$("formAuth").attachEvent("onAfterSelect", function(){
    //     routes.navigate("app/", { trigger:true });
    //     $$("mainContent").show();
    // });

    routes.navigate("content", { trigger:true });
    $$("mainContent").show();
    //$$("mainContent").show();

    //Backbone.history.start();

    
    // this.getParentView().validate();
    
    // let userData = (($$("formAuth").getValues()));
    // if (userAuthData.userAuthData().username ===userData.username&&userAuthData.userAuthData().password ===userData.password){
    //     showInterfaceElements ();
    //     localStorage.setItem("authSuccess", 1);
    // } else {
    //     webix.message({ type:"error", text:"Неправильный логин или пароль" });
    //     localStorage.setItem("authSuccess", 0);
    // }
}

// function showInterfaceElements (){
//     $$("formAuth").hide();
//     $$("header").show();
//     $$("sidebarMain").show();
//     $$("sidebarMain").remove("userAuth");
//     $$("sidebarMain").select("userProf");
// }

// function hideInterfaceElements (){
//     $$("formAuth").show();
//     $$("header").hide(); 
//     $$("sidebarMain").add({id: "userAuth", icon: "mdi mdi-account", value:"Аутентификация"},0);
//     $$("sidebarMain").select("userAuth");
//     $$("sidebarMain").hide();
// }

const formLogin = {
    view:"form",
    id:"formAuth",
    maxWidth: 300,
    borderless:true,
    elements: [
        {view:"text", label:"Логин", name:"username", },
        {view:"text", label:"Пароль", name:"password",
        type:"password"},
        {view:"button", value: "Войти", css:"webix_primary",
        hotkey: "enter", align:"center", click:submit}, 
    ],

    on:{
        onValidationError:function(key, obj){
            var text;
            if (key == "username")
            text = "Username can't be empty";
            if (key == "password")
            text = "Password can't be empty";
            webix.message({ type:"error", text:text });
        }
    },

    elementsConfig:{
        labelPosition:"top"
    }

};


export {
    //loginCheck ,
    //hideInterfaceElements,
    formLogin, 
    routes
};
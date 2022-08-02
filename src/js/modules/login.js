
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
    }, 

}));


function submit(){
    // $$("formAuth").attachEvent("onAfterSelect", function(){
    //     routes.navigate("app/", { trigger:true });
    //     $$("mainContent").show();
    // });

    // routes.navigate("content", { trigger:true});
    // $$("mainContent").show();


    
    //Backbone.Transitions.transit(content, slideUpDown);
    //$$("mainContent").show();

    //Backbone.history.start();
}


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
    //routes
};
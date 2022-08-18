import {notify} from "./editTableForm.js";
let tableNames = [];

function login () {

    let routes = new (Backbone.Router.extend({
    routes:{
        "":"index" ,
        "content":"content", 
        
    },
    content:function(){
        webix.ajax("/init/default/api/whoami",{
            success:function(text, data, XmlHttpRequest){
                $$("userAuth").hide();
                $$("mainLayout").show();
               
                
                
                webix.ajax().get("/init/default/api/fields.json",false).then(function (data) {

                    let srcTree = data.json().content;
                    let obj = Object.keys(srcTree);
                    let actionsCheck;
                    //let dataTree = [];
                    let dataChilds = {tables:[], forms:[], dashboards:[]};

                    obj.forEach(function(data) {
                        if (srcTree[data].actions){
                            actionsCheck = Object.keys(srcTree[data].actions)[0]; 
                        } 
                        
                        if (srcTree[data].type == "dbtable"){
                            if(srcTree[data].plural){
                                dataChilds.tables.push({"id":data, "value":srcTree[data].plural, "type":srcTree[data].type});
                                tableNames.push({name:srcTree[data].plural , id:data});
                            } else if (srcTree[data].singular) {
                                dataChilds.tables.push({"id":data, "value":srcTree[data].singular, "type":srcTree[data].type});
                                tableNames.push({name:srcTree[data].singular , id:data});
                            }
        
                        } else if (srcTree[data].type == "tform"){
                            if(srcTree[data].plural){
                                dataChilds.forms.push({"id":data, "value":srcTree[data].plural, "type":srcTree[data].type});
                                tableNames.push({name:srcTree[data].plural , id:data}); 
                            }else if (srcTree[data].singular) {
                                dataChilds.forms.push({"id":data, "value":srcTree[data].singular, "type":srcTree[data].type});
                                tableNames.push({name:srcTree[data].singular , id:data}); 
        
                            }
                        }  else if (srcTree[data].type == "dashboard" ){
                   
                            if(srcTree[data].plural){
                                dataChilds.dashboards.push({"id":data, "value":srcTree[data].plural, "type":srcTree[data].type});
                                tableNames.push({name:srcTree[data].plural , id:data}); 
                            }else if (srcTree[data].singular) {
                                dataChilds.dashboards.push({"id":data, "value":srcTree[data].singular, "type":srcTree[data].type});
                                tableNames.push({name:srcTree[data].singular , id:data}); 
        
                            }
                        }   
                        
                    });
        
        
                    webix.ajax().get("/init/default/api/mmenu.json").then(function (data) {
 
                        let menu = data.json().mmenu;
                        let menuTree = [];
                     
                        menu.forEach(function(el,i){
                               
                            if (el.childs.length > 0){
                                dataChilds[el.name]=[];
                                el.childs.forEach(function(child,i){
                                    dataChilds[el.name].push({id:child.name, value:child.title });
                                });
                            }
        
                            if (el.name.includes("delim")){
                            } else {
                                let singleItem;
                                obj.forEach(function(data) {
                                 
                                    if (data==el.name){
                                        singleItem = el.title;
                             
                                        menuTree.push({id:el.name+"-single", value:el.title, typeof:srcTree[data].type});
                                    }
                                });
                                if (!singleItem){
                                    if (el.title){
                                        menuTree.push({id:el.name, value:el.title, data:dataChilds[el.name]});
                                    } else {
                                        menuTree.push({id:el.name, value:"Без названия", data:dataChilds[el.name]});
                                    }
                                }
                            }
                                
                        });
 
                        $$("tree").clearAll();
                        $$("tree").parse(menuTree);
 
                    });
                        
                   
                });
            },
            error:function(text, data, XmlHttpRequest){
               // window.location.replace('/index.html');
                routes.navigate("", { trigger:true});
            }
        });
    },
    index:function(){
        webix.ajax("/init/default/api/whoami",{
            success:function(text, data, XmlHttpRequest){
               // window.location.replace('/index.html#content'); 
               routes.navigate("content", { trigger:true});
            },
            error:function(text, data, XmlHttpRequest){
                $$("mainLayout").hide();
                $$("userAuth").show();
            }
        });      
    }, 

    }));

    function getLogin(){
        $$("formAuth").validate();
        let userData = $$("formAuth").getValues();
        let loginData = [];
    
        loginData.push("un"+"="+userData.username);
        loginData.push("np"+"="+userData.password);
    
        webix.ajax("/init/default/login"+"?"+loginData.join("&"),{
            success:function(text, data, XmlHttpRequest){
                webix.ajax("/init/default/api/whoami",{
                    success:function(text, data, XmlHttpRequest){
                        routes.navigate("content", { trigger:true});
                    },
                    error:function(text, data, XmlHttpRequest){
                        if ($$("formAuth").isDirty()){
                            notify ("error","Неверный логин или пароль");
                        }
                    }
                });
            },
            error:function(text, data, XmlHttpRequest){
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
    login,
    tableNames
};

import {modalBox} from "../blocks/notifications.js";
import {setLogValue} from '../blocks/logBlock.js';
import {tableNames} from "../blocks/router.js";
import {setStorageData,setUserLocation} from "../blocks/storageSetting.js";
import {catchErrorTemplate,ajaxErrorTemplate} from "../blocks/logBlock.js";
import {saveItem, saveNewItem} from "../blocks/editTableForm.js";

let userLocation;
let headerContextId;

function header() {
    function collapseClick (){
        try {

            if (window.innerWidth > 850 ){
                if ($$("tree").isVisible()){
                    this.config.icon ="wxi-angle-double-right";
                    this.refresh();
                    $$("tree").hide();
                    if($$("sideMenuResizer")){
                        $$("sideMenuResizer").hide();
                    } 

                } else {
                    $$("tree").show();
                    this.config.icon ="wxi-angle-double-left";
                    this.refresh();
                    if(window.innerWidth >= 800){
                        if($$("sideMenuResizer")){
                            $$("sideMenuResizer").show();
                        }
                    } 
                
                    
                }
            } else {
                if ($$("tree").isVisible()){
                    this.config.icon ="wxi-angle-double-right";
                    this.refresh();
                    $$("tree").hide();
                    if($$("sideMenuResizer")){
                        $$("sideMenuResizer").hide();
                    } 

                } else {
                    $$("tree").show();
                    console.log(window.innerHeight )
                   $$("tree").config.width = window.innerWidth;
                    $$("tree").resize()
                    
                    this.config.icon ="wxi-angle-double-left";
                    this.refresh();
                    if(window.innerWidth >= 800){
                        if($$("sideMenuResizer")){
                            $$("sideMenuResizer").show();
                        }
                    } 
                
                    
                }
            }
        } catch (error){
            console.log(error);
            catchErrorTemplate("009-000", error);
    
        }
    }

    // function logVisibleClick () {
    //     try {
    //         if ( this.config.icon =="wxi-eye-slash"){
    //             $$("logLayout").config.height = 5;
    //             $$("webix_log-btn").setValue(1);
    //             $$("logLayout").resize();
    //             this.config.icon ="wxi-eye";
    //             this.refresh();
    //             setStorageData("LogVisible", JSON.stringify("hide"));

    //             $$("webix_log-btn").config.badge = "";
    //             $$("webix_log-btn").refresh();

    //         } else if (this.config.icon =="wxi-eye"){
    //             $$("logLayout").config.height = 90;
    //             $$("webix_log-btn").setValue(2);
    //             $$("logLayout").resize();
    //             this.config.icon ="wxi-eye-slash";
    //             this.refresh();
    //             setStorageData("LogVisible", JSON.stringify("show"));
    //         }
    //     } catch (error){
    //         console.log(error);
    //         catchErrorTemplate("005-000", error);
    //     }
    // }


    const header = {
        view: "toolbar", 
        id: "header",
        padding:10,
        css:"webix_header-style",
        elements: [
            {cols:[
                {   
                    view:"button",
                    type:"icon",
                    id:"collapseBtn",
                    icon:"wxi-angle-double-left",
                    css:"webix_collapse",
                    title:"текст",
                    height:45,
                    width:40,
                    click:collapseClick,
                    on: {
                        onAfterRender: function () {
                            this.getInputNode().setAttribute("title","Видимость бокового меню");
                        }
                    }    
                },
                {
                    view:"label",
                    label:"<img src='/init/static/images/expalogo.png' style='height:30px; margin: 10px;'>", 
                    height:30
               }
            ]},
            
            {},
            {view:"search", 
                placeholder:"Поиск", 
                css:"searchTable", 
                maxWidth:250, 
                minWidth:40, 
            },
            {   view:"button",  
                id:"webix_log-btn",
                type:"icon", 
                icon:"wxi-eye-slash",
                height:48,
                badge:0,
                width: 60,
                css:"webix_log-btn",
                click:function (){
                    if (this.getValue() == 1){
                        this.setValue(2);
                    } else {
                        this.setValue(1);
                    }
                },
                on: {
                    onAfterRender: function () {
                        this.getInputNode().setAttribute("title","Показать/скрыть системные сообщения");
                    },
                    onChange:function(newValue, oldValue, config){

                        let lastItemList = $$("logBlock-list").getLastId();
                        if (newValue == 2){
                            this.config.badge = "";
                            $$("logBlock-list").showItem(lastItemList);
                        
                            $$("logLayout").config.height = 90;
                        
                            $$("logLayout").resize();
                            this.config.icon ="wxi-eye-slash";
                            this.refresh();
                           // setStorageData("LogVisible", JSON.stringify("show"));
                        } else {
                            $$("logLayout").config.height = 5;
                            $$("logLayout").resize();
                            this.config.icon ="wxi-eye";
                            this.refresh();
                            //setStorageData("LogVisible", JSON.stringify("hide"));
            
                            $$("webix_log-btn").config.badge = "";
                            $$("webix_log-btn").refresh();
                        }
            
                    }
                },
               
            },

            {   view:"button",
                id:"button-context-menu",
                type:"icon",
                disabled:true,
                icon: 'wxi-user',
                height:48,
                width: 60,
                popup: {
                    view: 'contextmenu',
                    id:"contextmenu",
                    css:"webix_contextmenu",
                    data: [],
                    on:{
                        onItemClick:function(id, e, node){
                            try {
                                // let logoutPath;
                                // console.log(window.location.pathname)
                                // if (window.location.host.includes("localhost:3000")){
                                //     logoutPath = "/index.html/logout";
                                // } else {
                                //     logoutPath = "/init/default/spaw/logout";
                                // }
                            
                                if (id=="logout"){
                                    if($$("table-editForm") && $$("table-editForm").isDirty() || $$("cp-form") && $$("cp-form").isDirty()){
                                       
                                        modalBox().then(function(result){
                                            if (result == 1){
                                                //window.location.replace(logoutPath);
                                                Backbone.history.navigate("logout", { trigger:true});
                                            } else if (result == 2){

                                                if ($$("cp-form") || $$("table-editForm")){
                                                    if ($$("cp-form") && $$("cp-form").isDirty() && $$("cp-form").validate()){
                                                        let objPass = {op:"",np:""};
                                                        let passData = $$("cp-form").getValues();
                                                        objPass.np = passData.newPass;
                                                        objPass.op = passData.oldPass;
                                                        webix.ajax().post("/init/default/api/cp", objPass, {
                                                            success:function(text, data, XmlHttpRequest){
                                                                data = data.json()
                                                                if (data.err_type == "i"){
                                                                    setLogValue("success",data.err);
                                                                
                                                                } else if (data.err_type == "e"){
                                                                    setLogValue("error",data.err);
                                                                }
                                                            },
                                                            error:function(text, data, XmlHttpRequest){
                                                                ajaxErrorTemplate("011-000",XmlHttpRequest.status,XmlHttpRequest.statusText,XmlHttpRequest.responseURL);
                                                            }
                                                        });
                                                        //window.location.replace(logoutPath);
                                                        Backbone.history.navigate("logout", { trigger:true});
                                                    
                                                    } else if ($$("table-editForm") && $$("table-editForm").isDirty() && $$("table-editForm").validate()){
                                                        if ($$("table-editForm").getValues().id){
                                                            saveItem();
                                                        } else {
                                                            saveNewItem(); 
                                                        }
                                                     //   window.location.replace(logoutPath);
                                                        Backbone.history.navigate("logout", { trigger:true});
                                                    
                                                    }else {
                                                        setLogValue("error","Заполните пустые поля");
                                                        return false;
                                                    }
                                                } 
                                            }
                                        });
                                        return false;
                                    } else {
                                        Backbone.history.navigate("logout", { trigger:true});
                                       // window.location.replace(logoutPath);
                                    }
                                }
                            } catch (error){
                                console.log(error);
                                catchErrorTemplate("005-000", error);
                            }
 
                        }
                    }
                },
                on:{
                    onItemClick:function(){
                        try {
                            setUserLocation (tableNames,userLocation);
                        } catch (error){
                            console.log(error);
                            catchErrorTemplate("005-000", error);
                        }
                    }
                }
            },

        ]
    };

    return header;

}

export {
    header,
    headerContextId,
    userLocation
};
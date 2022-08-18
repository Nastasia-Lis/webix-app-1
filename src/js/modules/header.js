import {headerSidebar} from "./sidebar.js";
import {setStorageData} from "./userSettings.js";
 

export function header() {
    const header = {
        view: "toolbar", 
        id: "header",
        padding:10,
        css:"webix_header-style",
        //hidden:true, 
        elements: [
            headerSidebar(),
            {},
            // {   view:"button",  
            //     type:"icon", 
            //     icon:"wxi-file",
            //     css:"webix_btn-import", 
            //     label:"Импорт", 
            //     height:48,
            //     width: 130,
            //     on: {
            //         onAfterRender: function () {
            //             this.getInputNode().setAttribute("title","Импорт файла с таблицами");
            //         }
            //     }  
            // },
            {   view:"button",  
                id:"webix_log-btn",
                type:"icon", 
                icon:"wxi-eye-slash",
                //label:"Системные сообщения", 
                height:48,
                width: 60,
                css:"webix_log-btn",
                on: {
                    onAfterRender: function () {
                        this.getInputNode().setAttribute("title","Показать/скрыть системные сообщения");
                    }
                },
                click: function() {
                    if ($$("logLayout").isVisible()){
                        $$("logLayout").hide();
                        $$("log-resizer").hide();
                        this.config.icon ="wxi-eye";
                        this.refresh();
                        setStorageData("LogVisible", JSON.stringify("hide"));
                    } else {
                        $$("logLayout").show();
                        $$("log-resizer").show();
                        this.config.icon ="wxi-eye-slash";
                        this.refresh();
                        setStorageData("LogVisible", JSON.stringify("show"));
                    }
                }
            },
            {   view:"button", 
                label:"Выйти",
                height:48, 
                width: 120,
                on: {
                    onAfterRender: function () {
                        this.getInputNode().setAttribute("title","Выйти из аккаунта");
                    }
                } ,
                click: function() {
                    webix.ajax().post("/init/default/logout/",{
                        success:function(text, data, XmlHttpRequest){
                            history.back();
                            $$("tree").clearAll();
                        },

                    });
                    
                }
            },
            
        ]
    };

    return header;
}
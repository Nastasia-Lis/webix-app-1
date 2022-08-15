//import {hideInterfaceElements} from './userLogin.js';
import {headerSidebar} from "./sidebar.js";

export function header() {
    // function logoutClick () {
    //     localStorage.setItem("authSuccess", 0);
    //     hideInterfaceElements ();
    // }
    
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
                    } else {
                        $$("logLayout").show();
                        $$("log-resizer").show();
                        this.config.icon ="wxi-eye-slash";
                        this.refresh();
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
                    history.back();
                }
            },
            
        ]
    };

    return header;
}
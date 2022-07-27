//import {hideInterfaceElements} from './userLogin.js';

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
            //{ view: "label", label: "App"},
            {   view:"label",
                label:"<img src='/img/logo.png' style='height:35px; margin: 5px;'>" 
            },
            {   view:"button",  
                type:"icon", 
                icon:"wxi-file",
                css:"webix_btn-import", 
                label:"Импорт", 
                height:48,
                width: 130,
                on: {
                    onAfterRender: function () {
                        this.getInputNode().setAttribute("title","Импорт файла с таблицами");
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
            }
            
        ]
    };

    return header;
}
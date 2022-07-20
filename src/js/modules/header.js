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
            { view: "label", label: "App"},
            { view:"button",  type:"icon", icon:"wxi-file",css:"webix_btn-import", label:"Импорт", height:48,width: 130},
            { view:"button", label:"Выйти",height:48, width: 120}
            
        ]
    };

    return header;
}
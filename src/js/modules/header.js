//import {hideInterfaceElements} from './userLogin.js';

export function header() {
    // function logoutClick () {
    //     localStorage.setItem("authSuccess", 0);
    //     hideInterfaceElements ();
    // }
    
    const header = {
        view: "toolbar", 
        id: "header",
        padding:3,
        //hidden:true, 
        elements: [
            { view: "label", label: "App"},
            { view:"button", label:"Импорт", width: 100},
            { view:"button", label:"Выйти", width: 100}
            
        ]
    };

    return header;
}
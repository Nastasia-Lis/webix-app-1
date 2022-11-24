import { settingsLayout }  from "./_layout.js";

class Settings {
    constructor (){
        this.name = "dashboards";
    }

    create(){
        $$("container").addView(
            {   view    :"layout",
                id      : "settings", 
                css     :"webix_auth",
                hidden  :true, 
                rows    :[
                    settingsLayout,
                ],
            }, 
        8);
    }

}

export {
    Settings
};
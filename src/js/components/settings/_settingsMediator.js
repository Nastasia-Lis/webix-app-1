///////////////////////////////

// Медиатор

// Copyright (c) 2022 CA Expert

///////////////////////////////

import { settingsLayout }  from "./_layout.js";
import { saveSettings }    from "./tabbar/buttons.js";

class Settings {
    constructor (){
        this.name = "dashboards";
    }

    create (){
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

    async put (){
       return await saveSettings();
    }

}

export {
    Settings
};
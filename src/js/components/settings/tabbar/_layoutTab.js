///////////////////////////////

// Layout пользовательских настроек
// Copyright (c) 2022 CA Expert

///////////////////////////////


import { otherFormLayout }  from "./formOther.js";
import { workspaceLayout }  from "./formWorkspace.js";
import { tabbar }           from "./tabbar.js";
import { buttons }          from "./buttons.js";

const layoutTabbar =  {
    rows:[
        tabbar,
        {
            cells:[
                workspaceLayout,
                otherFormLayout
            ]
        },
        buttons
    ]
};

export {
    layoutTabbar
};
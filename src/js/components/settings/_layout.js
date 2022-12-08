
import { layoutHeadline }  from "./headline.js";
import { layoutTabbar }    from "./tabbar/_layoutTab.js";


const settingsLayout = {

    rows:[
        {   padding: {
                top    : 15, 
                bottom : 0, 
                left   : 20, 
                right  : 0
            },
            rows   :layoutHeadline,
        },
        layoutTabbar,
    ]

   
};


export {
    settingsLayout
};
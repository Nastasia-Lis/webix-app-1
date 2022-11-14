console.log("expa 1.0.52"); 

import { textInputClean }                     from "./blocks/commonFunctions.js";
import { auth }                               from "./components/login.js";
import { setUserPrefs }                       from "./blocks/storageSetting.js";
import { header }                             from "./components/header/layout.js";

import { treeSidebar }                        from "./components/treeSidabar/layout.js";

import { logLayout }                          from "./blocks/logBlock.js";
import { resetTimer }                         from  "./blocks/logout/autoLogout.js";

import { setFunctionError }                   from "./blocks/errors.js";
import { resizeAdaptive, adaptivePoints }     from "./blocks/adaptive.js";
import { webixGlobalPrefs, protoUIEdittree }  from "./blocks/webixGlobalPrefs.js";
import { setRouterStart }                     from "./blocks/routerConfig/routerStart.js";
import { backButtonBrowserLogic }             from "./blocks/historyBtns.js";


const emptySpace = {
    view    : "align", 
    align   : "middle,center",
    id      : "webix__none-content",
    body    : {  
        borderless  : true, 
        template    : "Выберите элемент дерева", 
        height      : 50, 
        width       : 210,
        css         : {
            "color"    :"#858585",
            "font-size":"14px!important"
        }
    }

};

const container = {   
    id  : "container",
    cols: [
        emptySpace,
    ]
};

const adaptive = {   
    id  : "adaptive",
    rows: []
};

const sideMenuResizer = {   
    id  : "sideMenuResizer",
    view: "resizer",
    css : "webix_resizer-hide",
};

const logResizer = {
    view : "resizer", 
    id : "log-resizer"
};

const mainLayout = {   
    hidden  : true, 
    id      : "mainLayout",
    rows    : [
    
        {   id  : "mainContent",
            css : "webix_mainContent",
                                            
            cols: [
                { rows  : [
                    header,
                    adaptive,
                
                    {cols : [
                        treeSidebar(), 
                        sideMenuResizer,
                        container,
                    ]}
                ]}, 

            ]
        },
        logResizer,
        logLayout

    ]
};

try{

    webix.ready (function(){

        protoUIEdittree();

        webix.ui({
            view    : "scrollview",
            type    : "clean",
            id      : "layout", 
            css     : "layoutContainer",
            scroll  : "y", 
            body    : {

                cells : [ 
                    {},
                    auth,
                    mainLayout
                ],

            },

        });




        setUserPrefs            ();
        resizeAdaptive          ();
        setRouterStart          ();
        adaptivePoints          ();
        textInputClean          ();

        backButtonBrowserLogic  ();
        resetTimer              ();
        webixGlobalPrefs        ();

    });

} catch(err){
    alert("Ошибка при выполнении "+ err);
    setFunctionError(err,"app","layout");
}

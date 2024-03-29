  
///////////////////////////////
//
// Пустой компонент (create empty)
//
// Приложение
//
// Copyright (c) 2022 CA Expert
//
///////////////////////////////

console.log("expa 1.0.85"); 

import { textInputClean }                     from "./blocks/commonFunctions.js";
import { auth }                               from "./components/login.js";
import { setUserPrefs }                       from "./blocks/storageSetting.js";

import { mediator }                           from "./blocks/_mediator.js";
 

import { logLayout }                          from "./components/logBlock.js";
import { resetTimer }                         from  "./components/logout.js";

import { setFunctionError }                   from "./blocks/errors.js";
import { resizeAdaptive, adaptivePoints }     from "./blocks/adaptive.js";

import { webixGlobalPrefs, protoUIEdittree, 
         backButtonBrowserLogic }             from "./blocks/webixGlobalPrefs.js";
         
import { setRouterStart }                     from "./components/router.js";

import { createOverlayTemplate }              from "./viewTemplates/loadTemplate.js";

import { createTabbar }                       from "./components/tabs.js";

//create empty
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
                    mediator.header.create(),
         
                    adaptive,
                
                    {cols : [
                        {   id   : "sidebarContainer",
                            rows : [
                            createOverlayTemplate("loadTreeOverlay"),
                            mediator.sidebar.create(),
                           
                        ]},
                        sideMenuResizer,
                        {rows:[
                            createTabbar(),
                            {   id    : "globalTabCells",
                                css   : "tabbar_globalCells",
                                cells : [  
                                    container,
                                    
                                ]
                            }
                        ]}
                   
                        //container,
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

console.log("expa 1.0.30");
// import {lib} from "./modules/expalib.js";
// lib ();

import * as textInputClean from "./blocks/textInputSettings.js";
import {login} from "./components/login.js";
import {setUserPrefs} from "./blocks/storageSetting.js";
import {header} from "./components/header.js";
import {treeSidebar} from "./components/sidebar.js";
import {logLayout} from "./blocks/logBlock.js";
import  {resetTimer} from  "./blocks/autoLogout.js";

import {catchErrorTemplate} from "./blocks/logBlock.js";
import {resizeAdaptive,adaptivePoints} from "./blocks/adaptive.js";

try{
    
    webix.ready(function(){
        webix.protoUI({
            name:"edittree"
        }, webix.EditAbility, webix.ui.tree);


     

        webix.ui({
            view:"scrollview",
                    type:"clean",
                    id:"layout", 
                    css:"layoutContainer",
                    scroll:"y", 
                    body:{
                        cells: [ 
                            {},
                            {hidden:true, id: "userAuth", 
                            cols: [
                                {
                                    view:"align", 
                                    align:"middle,center",
                                    body:login()
                                },

                            ]},
                            {hidden:true, id:"mainLayout", rows: [
                                
                        
                                {   id:"mainContent",
                                    css:"webix_mainContent",
                                                                    
                                cols:[
                                        { rows:[
                                            header(),
                                            {   id:"adaptive",
                                                rows:[]
                                            },
                                        
                                        {cols:[
                                               treeSidebar(), 
                                               {id:"sideMenuResizer",view:"resizer",css:"webix_resizer-hide",},
                                            {id:"container",cols:[

                                                {
                                                    view:"align", 
                                                    align:"middle,center",
                                                    id:"webix__none-content",
                                                    body:{  
                                                        borderless:true, 
                                                        template:"Выберите элемент дерева", 
                                                        height:50, 
                                                        width:210,
                                                        css:{"color":"#858585","font-size":"14px!important"}
                                                    }
                                                
                                                },
                                    
                                            ]},
                                            ]}
                                        ]}, 



                                    ]
                                },
                                {view:"resizer", id:"log-resizer"},
                                logLayout
                    
                            ]}
                        ],
                    },

        });
        
        // window.addEventListener('resize', function(event) {
    
        //     if ($$("tree").isVisible()){
        //     } else {
        //         if(window.innerWidth <= 600){
        //             if($$("sideMenuResizer")){
        //                 $$("sideMenuResizer").hide(); 
        //             }
        //         } 
        //     }


        // }, true);
        // console.log(window.innerWidth)

        resizeAdaptive();


        if (window.location.host.includes("localhost:3000")){
            Backbone.history.start({pushState: true, root: '/index.html/'});
        } else {
            Backbone.history.start({pushState: true, root: '/init/default/spaw/'});
        }

        function backButtonLogic (){
            window.addEventListener('popstate', function(event) {
                window.location.replace(window.location.href);
                window.location.reload();
            });
        }


        adaptivePoints();
      
        textInputClean.textInputClean();

        setUserPrefs();

        backButtonLogic ();
        resetTimer();
        webix.message.position = "bottom";
        webix.i18n.setLocale("ru-RU");   
        webix.i18n.parseFormat = "%d.%m.%Y %H:%i:%s";
        webix.i18n.setLocale();
        
    });

} catch(error){
    console.log(error);
    alert("Ошибка при выполнении"+" "+ error);
    catchErrorTemplate("007-005", error);
}
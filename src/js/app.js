console.log("expa 1.0.18");

import {lib} from "./modules/expalib.js";
lib ();

import * as textInputClean from "./modules/textInput.js";
import {login} from "./modules/login.js";
import {getStorageData} from "./modules/userSettings.js";
import {header} from "./modules/header.js";
import {treeSidebar} from "./modules/sidebar.js";
import {logLayout} from "./modules/logBlock.js";
import * as resetTimer from  "./modules/resetTimer.js";

import { catchErrorTemplate} from "./modules/logBlock.js";

try{

    webix.ready(function(){
        webix.protoUI({
            name:"edittree"
        }, webix.EditAbility, webix.ui.tree);

        webix.ui({
            view:"scrollview",
                    type:"clean",
                    id:"layout", 
                    scroll:"y", 
                    body:{
                        cells: [ 
                            {},
                            {hidden:true, id: "userAuth", 
                            cols: [
                                {},
                                {   rows:[
                                        {},
                                        login(),
                                        {}
                                    ]},
                                {}
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
                                        
                                        {id:"container",responsive:"adaptive",cols:[
                                                treeSidebar(), 

                                                {id:"sideMenuResizer",view:"resizer",css:"webix_resizer-hide",},
                                
                                                
                                            {id:"webix__none-content"},
                                            ]},
                                        ]}, 



                                    ]
                                },
                                {view:"resizer", id:"log-resizer"},
                                logLayout
                    
                            ]}
                        ],
                    },

        });
        getStorageData();
        window.addEventListener('resize', function(event) {
    
            if ($$("tree").isVisible()){
            } else {
                if(window.innerWidth <= 600){
                    if($$("sideMenuResizer")){
                        $$("sideMenuResizer").hide(); 
                    }
                } 
            }


        }, true);


    

     //  Backbone.history.start({pushState: true, root: '/'});
       Backbone.history.start();

        textInputClean.textInputClean();

        resetTimer.resetTimer();

        webix.i18n.setLocale("ru-RU");   
        webix.i18n.parseFormat = "%d.%m.%Y %H:%i:%s";
        webix.i18n.setLocale();


    });

} catch(error){
    console.log(error);
    alert("Ошибка при выполнении"+" "+ error);
    catchErrorTemplate("007-005", error);
}
import * as header from "./modules/header.js";
import * as sidebar from "./modules/sidebar.js";
import * as multiviewSidebar from "./modules/multiviewSidebar.js";

import {loginCheck} from './modules/userLogin.js';
import {defaultStorageSettings} from './modules/userSettings.js';

webix.ready(function(){
    
    webix.ui({
        rows: [
            header.header(),
            { id:"mainContent", cols:[
                sidebar.sidebar(),
                multiviewSidebar.multiviewSidebar(),
            ]}
        ]
      
    });
    
    loginCheck();
    defaultStorageSettings();
});













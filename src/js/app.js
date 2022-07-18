import * as header from "./modules/header.js";
import * as sidebar from "./modules/sidebar.js";
//import * as multiviewSidebar from "./modules/multiviewSidebar.js";
//import * as table from "./modules/table.js";
//import {sidebarData} from './modules/data.js';

webix.ready(function(){
    
    webix.ui({
        rows: [
            header.header(),
            { id:"mainContent", cols:[
                sidebar.sidebar(),
               
               
                
                

            ]}
        ]
      
    });
    

});













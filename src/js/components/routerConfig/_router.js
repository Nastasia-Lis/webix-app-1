import { lib }                from "../../expalib.js";

lib ();

import { getWorkspace }       from "./common.js";
import { treeRouter }         from "./tree.js";
import { indexRouter }        from "./index.js";
import { cpRouter }           from "./cp.js";
import { settingsRouter }     from "./settings.js";
import { experimentalRouter } from "./experimental.js";
import { logoutRouter }       from "./logout.js";


function router (){
    let routes = new (Backbone.Router.extend({
    
        routes:{
            ""                : "index" ,
            "content"         : "content", 
            "settings"        : "settings",
            "cp"              : "cp",
            "logout"          : "logout",
            "tree/:id"        : "tree",
            "experimental/:id":"experimental"
        },
        
        content:function(){
            getWorkspace();
        },
    
        index:function(){
            indexRouter();

        }, 

        tree: function(id){
            treeRouter(id);
        },
        
        cp: function(){
            cpRouter();
    
      
        },
    
        settings: function(){
            settingsRouter();
            

        },

        experimental: function (){
            experimentalRouter();
        },
    
        logout: function (){
            logoutRouter();
        }
    
    }));

    return routes;
}

export {
    router
};
import { setAjaxError }     from "../../blocks/errors.js"; 
import { preparationView }  from "./preparationView.js"; 
import { mediator }         from "../../blocks/_mediator.js"; 

import { loadFields }       from "./loadFields.js";
import { getFields }        from "./navigate.js";
import { setAdaptiveState } from "./adaptive.js";

function isBranch(id){
    return $$("tree").isBranch(id);
}

function treeSidebar () {
    const tree = {
        view        : "edittree",
        id          : "tree",
        css         : "webix_tree-main",
        minWidth    : 100,
        width       : 300,
        editable    : false,
        select      : true,
        editor      : "text",
        editValue   : "value",
        activeTitle : true,
        clipboard   : true,
        data        : [],
        on          : {

            onItemClick: function(id) {
   
                if (!isBranch(id)){
                    mediator.getGlobalModalBox()
                    .then(function(result){
                        if (result){
                            $$("tree").select(id);
                        }
                    
                    });
                    return false;
                }
                
            },

            onBeforeSelect: function(id) {
           
                const item     = this.getItem(id);

                if (!isBranch(id) || item.webix_kids){
                    this.open(id);
                }
                preparationView(id);
            },

            onLoadError:function(xhr){
                setAjaxError(
                    xhr, 
                    "sidebar",
                    "onLoadError"
                );
            },

            onBeforeOpen:function (id){
                loadFields(id);
            },

            onAfterSelect:function(id){
                getFields (id);
                setAdaptiveState();
            },

        },

    };

    return tree;
}

export{
    treeSidebar
};
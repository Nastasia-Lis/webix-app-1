import {setAjaxError}       from "../../blocks/errors.js"; 

import {onSelectChangeFunc} from "./onSelectChange.js"; 
import {onItemClickFunc}    from "./onItemClick.js"; 
import {onBeforeSelectFunc} from "./onBeforeSelect.js"; 
import {onBeforeOpenFunc}   from "./onBeforeOpen.js"; 
import {onAfterSelectFunc}  from "./onAfterSelect.js"; 


function treeSidebar () {
    const tree = {
        view        : "edittree",
        id          : "tree",
        css         : "webix_tree-main",
        minWidth    : 100,
        width       : 250,
        editable    : false,
        select      : true,
        editor      : "text",
        editValue   : "value",
        activeTitle : true,
        clipboard   : true,
        data        : [],
        on          : {
            
            onSelectChange:function (ids) {
                onSelectChangeFunc(ids);
            },

            onItemClick:function(id) {
                return onItemClickFunc(id);
            },

            onBeforeSelect: function(data) {
                onBeforeSelectFunc(data);
            },

            onLoadError:function(xhr){
                setAjaxError(xhr, "sidebar","onLoadError");
            },

            onBeforeOpen:function (id){
                onBeforeOpenFunc(id);
            },

            onAfterSelect:function(id){
                onAfterSelectFunc(id);
            },

        },

    };

    return tree;
}

export{
    treeSidebar
};
import {setAjaxError}       from "../../blocks/errors.js"; 

import {createModalBox}     from "./modalBox.js"; 

import { preparationView }  from "./preparationView.js"; 

import { loadFields }       from "./loadFields.js";
import { getFields }        from "./navigate.js";
import { setAdaptiveState } from "./adaptive.js";


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

            onItemClick:function(id) {
                return createModalBox(id);
            },

            onBeforeSelect: function(data) {
                preparationView(data);
            },

            onLoadError:function(xhr){
                setAjaxError(xhr, "sidebar","onLoadError");
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
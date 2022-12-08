import { setLogValue }                   from '../logBlock.js';
import { setAjaxError,setFunctionError } from "../../blocks/errors.js";
import { returnForm }                    from "./form.js";


function renameTree(state, editor){
 
    const url = "/init/default/api/trees/";
    
    if(state.value != state.old){
      
        const pid = $$("treeEdit").getParentId(editor.id);
        
        const postObj = {
            name    : state.value,
            pid     : pid,
            id      : editor.id,
            owner   : null,
            descr   : "",
            ttype   : 1,
            value   : "",
            cdt     : null,
        };

     
        const postData = webix.ajax().put(url + editor.id, postObj);

        postData.then(function(data){
            data = data.json();
            if (data.err_type == "i"){
                setLogValue("success", "Данные изменены");

            } else {
                setFunctionError(
                    data.err,
                    "editTree",
                    "tree onAfterEditStop postData msg"
                );
            }
        });

        postData.fail(function(err){
            setAjaxError(
                err, 
                "editTree",
                "tree onAfterEditStop postData"
            );
        });


    }
  
}


function returnTree(){
    const tree = {
        view       : "edittree",
        id         : "treeEdit",
        editable   : true,
        editor     : "text",
        editValue  : "value",
        css        : "webix_tree-edit",
        editaction : "dblclick",
        data       : [],
        on         : {
            onAfterEditStop:function(state, editor){
                renameTree(state, editor);
            },
        }
    
    };

    return tree;
}

function editTreeLayout () {

    return [
        {   id  : "treeEditContainer", 
            cols: [
                {rows: [
                        returnTree(),
                    ],
                },
                returnForm()
                   
            ]
        }
   
    ];
}


webix.UIManager.addHotKey("Ctrl+Shift+E", function() { 

    Backbone.history.navigate("experimental/treeEdit", { trigger:true});

});

export{
    editTreeLayout,
};
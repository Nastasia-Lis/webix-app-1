import { setLogValue }                   from '../logBlock.js';
import { ServerData }                    from "../../blocks/getServerData.js";
import { returnForm }                    from "./form.js";


function renameTree(state, editor){
    
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

        new ServerData({
            id : `trees/${editor.id}`
           
        }).put(postObj).then(function(data){
        
            if (data){
                setLogValue("success", "Данные изменены");
            }
             
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
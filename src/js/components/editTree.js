import {setLogValue} from '../blocks/logBlock.js';

import {setAjaxError,setFunctionError} from "../blocks/errors.js";

function contextMenu (){

    return {
        view:"contextmenu",
        id:"contextMenuEditTree",
        data:[
                "Добавить",
                "Переименовать",
                { $template:"Separator" },
                "Свернуть всё",
                "Развернуть всё",
                { $template:"Separator" },
                "Удалить"
            ],
        master: $$("treeEdit"),
        on:{
            onMenuItemClick:function(id){
                let context = this.getContext();

                let tree = $$("treeEdit");

                let titem = tree.getItem(context.id); 

                let menu = this.getMenu(id);
                let cmd = menu.getItem(id).value;

                let url = "/init/default/api/trees/";
            
                let postObj = {
                    name : "",
                    pid : "",
                    owner : null,
                    descr : "",
                    ttype : 1,
                    value : "",
                    cdt : null,
                };

          
                switch (cmd) {
                    case "Добавить": {
                    
                        let text = prompt("Имя нового подэлемента '"+titem.value+"'", "");
                    
                        if (text != null) {
                            postObj.name = text;
                            postObj.pid = titem.id;

                            const postData = webix.ajax().post(url, postObj);

                            postData.then(function(data){
                                try{
                                    data = data.json();
                                    if (data.err_type == "i"){
                                        
                                        let idNewItem = data.content.id;
                                    
                                        tree.data.add({
                                            id:idNewItem,
                                            value:text, 
                                            pid:titem.id
                                        }, 0, titem.id);
                                        
                                        tree.open(titem.id);
                                    
                                        setLogValue("success","Данные сохранены");
                                    } else {
                                        setFunctionError( data.err,"editTree","case add post msg");
                                    }
                                } catch (err){
                                    setFunctionError( err,"editTree","case add");
                                }
                            });

                            postData.fail(function(err){
                                setAjaxError(err, "editTree","case add");
                            });


                        }
                        break;
                    }
                
                    case "Переименовать": {
                        var text = prompt("Новое имя", titem.value);
                        if (text != null) { 
                            
                            postObj.name = text;
                            postObj.id = titem.id;
                            postObj.pid = titem.pid;

                            const putData =  webix.ajax().put(url + titem.id, postObj);

                            putData.then(function(data){
                                try{
                                    data = data.json();
                                    if (data.err_type == "i"){
                                        titem.value = text;
                                        tree.updateItem(titem.id, titem);
                                        setLogValue("success","Данные изменены");
                                    } else {
                                        setFunctionError( data.err,"editTree","case rename put msg");
                                    }
                                } catch (err){
                                    setFunctionError( err,"editTree","case rename");
                                }
                            });

                            putData.fail(function(err){
                                setAjaxError(err, "editTree","case rename");
                            });
                        }
                        break;
                    }
                    case "Удалить": {

                        const delData =  webix.ajax().del(url+titem.id,titem);

                        delData.then(function(data){
                            try{
                                data = data.json();
                                if (data.err_type == "i"){
                                    tree.remove(titem.id);
                                    setLogValue("success","Данные удалены");
                                } else {
                                    setFunctionError( data.err,"editTree","case delete del msg");
                                }
                            } catch (err){
                                setFunctionError( err,"editTree","case delete");
                            }
                        });

                        delData.fail(function(err){
                            setAjaxError(err, "editTree","case delete");
                        });

                        break;
                    }

                    case "Развернуть всё": {
                        try{
                            tree.open(titem.id);
                            tree.data.eachSubItem(titem.id, function(obj){ 
                                tree.open(obj.id);
                            });

                        } catch (err){
                            setFunctionError( err,"editTree","case open all");
                        }
                        break;
                    }
                    case "Свернуть всё": {
                        try{
                            tree.close(titem.id);
                            tree.data.eachSubItem(titem.id, function(obj){ 
                                tree.close(obj.id);
                            });
                        } catch (err){
                            setFunctionError( err,"editTree","case close all");
                        }
                        
                        break;
                    }
                    
                }
         
            }
    }
    };
}


function editTreeLayout () {
    const tree = {
        view:"edittree",
        id:"treeEdit",
        editable:true,
        editor:"text",
        editValue:"value",
        css:"webix_tree-edit",
        editaction:"dblclick",
        data:[
        ],
        on:{
            onAfterEditStop:function(state, editor, ignoreUpdate){
            try {
                let url = "/init/default/api/trees/";
                
                if(state.value != state.old){
                    let pid = $$("treeEdit").getParentId(editor.id);
                    
                    let postObj = {
                        name : state.value,
                        pid : pid,
                        id:editor.id,
                        owner : null,
                        descr : "",
                        ttype : 1,
                        value : "",
                        cdt : null,
                    };

                    const postData = webix.ajax().put(url+editor.id, postObj);

                    postData.then(function(data){
                        data = data.json();
                        if (data.err_type == "i"){
                            setLogValue("success","Данные изменены");
                        } else {
                            setFunctionError(data.err,"editTree","tree onAfterEditStop postData msg");
                        }
                    });

                    postData.fail(function(err){
                        setAjaxError(err, "editTree","tree onAfterEditStop postData");
                    });


                }
            } catch (err){
                setAjaxError(err, "editTree","tree onAfterEditStop");
            }
        },
        }
    
    };


    return [

        {id:"treeEditContainer", 
            cols:[
                {rows: [
                        tree,
                    ],
                },
                {}
            ]
        }

        
    ];
}


webix.UIManager.addHotKey("Ctrl+Shift+E", function() { 

    Backbone.history.navigate("experimental/treeEdit", { trigger:true});

});

export{
    editTreeLayout,
    contextMenu
}
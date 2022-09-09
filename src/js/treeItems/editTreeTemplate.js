import {catchErrorTemplate,ajaxErrorTemplate} from "../modules/logBlock.js";
import {notify} from "../modules/editTableForm.js";


function contextMenu (){

    return {
        view:"contextmenu",
        id:"cm",
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

            try {
                switch (cmd) {
                    case "Добавить": {
                    
                        let text = prompt("Имя нового подэлемента '"+titem.value+"'", "");
                    
                        if (text != null) {

                            postObj.name = text;
                            postObj.pid = titem.id

                            webix.ajax().post(url, postObj).then(function (data) {
                                if (data.json().err_type !== "e"&&data.json().err_type !== "x"){
                                    let idNewItem = data.json().content;
                                    tree.data.add({id:idNewItem, value:text}, 0, titem.id);
                                    tree.open(titem.id);
                                    notify ("success","Данные добавлены",true);
                                } else {
                                    catchErrorTemplate("013-001", data.json().err, true);
                                }
                            }).fail(function(error){
                                console.log(error)
                                ajaxErrorTemplate("013-001",error.status,error.statusText,error.responseURL);

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

                            webix.ajax().put(url+titem.id, postObj).then(function (data) {
                                if (data.json().err_type !== "e"&&data.json().err_type !== "x"){
                                    titem.value = text;
                                    tree.updateItem(titem.id, titem);
                                    notify ("success","Данные изменены",true);
                                } else {
                                    catchErrorTemplate("013-011", data.json().err, true);
                                }
                                
                            }).fail(function(error){
                                console.log(error);
                                ajaxErrorTemplate("013-011",error.status,error.statusText,error.responseURL);
                            });
                        }
                        break;
                    }
                    case "Удалить": {

                        webix.ajax().del(url+titem.id).then(function (data) {
                            if (data.json().err_type !== "e"&&data.json().err_type !== "x"){
                                tree.remove(titem.id);
                                notify ("success","Данные удалены",true);
                            } else {
                                catchErrorTemplate("013-002", data.json().err, true);
                            }
                        }).fail(function(error){
                            console.log(error)
                            ajaxErrorTemplate("013-002",error.status,error.statusText,error.responseURL);

                        });

                        break;
                    }

                    case "Развернуть всё": {
                        try{
                            tree.open(titem.id);
                            tree.data.eachSubItem(titem.id, function(obj){ 
                                tree.open(obj.id);
                            });

                        } catch (error){
                            console.log(error);
                            catchErrorTemplate("013-000", error);
                        }
                        break;
                    }
                    case "Свернуть всё": {
                        try{
                            tree.close(titem.id);
                            tree.data.eachSubItem(titem.id, function(obj){ 
                                tree.close(obj.id);
                            });
                        } catch (error){
                            console.log(error);
                            catchErrorTemplate("013-000", error);
                        }
                        
                        break;
                    }
                    
                }
            } catch(error){
                console.log(error);
                catchErrorTemplate("013-000", error);
            }
        }
    }
    };
}


function editTreeLayout () {
   
    return [

        {id:"treeEditContainer", cols:[
            {rows: [
                {
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

                            webix.ajax().put(url+editor.id, postObj).then(function (data) {
                                if (data.json().err_type !== "e"&&data.json().err_type !== "x"){
                                    //titem.value = text;
                                //  tree.updateItem(titem.id, titem);
                                    notify ("success","Данные изменены",true);
                                } else {
                                    catchErrorTemplate("013-011", data.json().err, true);
                                }
                            
                            }).fail(function(error){
                                console.log(error)
                                ajaxErrorTemplate("013-011",error.status,error.statusText,error.responseURL);

                            });

                        }
                        } catch (error){
                            console.log(error);
                            catchErrorTemplate("012-011", error);
                        }
                    },
                    }
                   
                },
            ],},
            {}
        ]}

        
    ];
}


export{
    editTreeLayout,
    contextMenu
}
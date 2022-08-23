//     

function contextMenu (){

    function getPrevNode(tree_node)
    {
        var res = null;
        var tree = $$("tree");

        if (tree_node.id == tree_node.content.pid) {
            var id = tree.getFirstId();
            while (id != null) {
                var node = tree.getItem(id);
                
                if (node.id == node.content.pid) {
                    //console.log("root: ",id,node.content.name);
                    if (node.id == tree_node.id) {
                        break;
                    };
                    res = node;
                };
                
                id = tree.getNextId(id);
            }
        } else {
            res = tree.getPrevSiblingId(tree_node.id);
            if (res) {
                res = tree.getItem(res);
            }
        }

        return res;
    }

    function tree_get_next_node(tree_node)
    {
        var res = null;
        var tree = $$("tree");

        if (tree_node.id == tree_node.content.pid) {
            var id = tree.getLastId();
            while (id != null) {
                var node = tree.getItem(id);
                
                if (node.id == node.content.pid) {
                    //console.log("root: ",id,node.content.name);
                    if (node.id == tree_node.id) {
                        break;
                    };
                    res = node;
                };
                
                id = tree.getPrevId(id);
            }
        } else {
            res = tree.getNextSiblingId(tree_node.id);
            if (res) {
                res = tree.getItem(res);
            }
        }

        return res;
    }





    return {
        view:"contextmenu",
        id:"cm",
        data:[
               // "Добавить",
                "Переименовать",
                { $template:"Separator" },
                "Поднять",
                "Опустить",
                { $template:"Separator" },
                "Свернуть всё",
                "Развернуть всё",
                { $template:"Separator" },
                "Удалить"
            ],
    master: $$("tree"),
    on:{
        onMenuItemClick:function(id){
            let context = this.getContext();
            
            console.log("Context: ",context);

            let tree = $$("tree");

            let titem = tree.getItem(context.id); 
            console.log()

            let menu = this.getMenu(id);
            let cmd = menu.getItem(id).value;

            console.log(cmd,"cmd"); // название действия 

            switch (cmd) {
                // case "Добавить": {
                //     var text = prompt("Имя нового подэлемента '"+titem.value+"'", "");
                //     if (text != null) {
                //         let postObg = 
                //         {"name1":{
                //                 fields:{},
                //                 plural:text,
                //                 type:"dbtable"
                //             }
                //         };
                //         webix.ajax().post("/init/default/api/fields.json"+titem.id+"&name="+text).then(function (data) {
                //             msg = data.text()
                //             console.log(msg);
                //             const newid = parseInt(msg, 10);
                //             if (isNaN(newid)) {
                //                 webix.message("Ошибка при добавлении: "+msg);
                //             } else {
                //                 webix.message("Элемент с id="+msg+" добавлен.");
                //                 tree.add({value: text, content:{name:text}, id: newid}, 0, context.id);
                //                 tree.refresh();
                //             }
                //             return msg;
                //         })
                //     }
                //     break;
                // }
               
                case "Переименовать": {
                    var text = prompt("Новое имя", titem.value);
                    if (text != null) { 
                        // console.log(titem.id, text)
                        // let postData;
                        // webix.ajax().put("/init/default/api/fields/auth_user", postData).then(function (data) {
                        //     msg = data.text()
                        //     console.log(titem, text)
                        //     console.log(msg);
                        //     if (msg=="OK") {
                        //         webix.message("Элемент с id="+titem.id+" переименован.");
                        //         titem.value = text;
                        //         tree.refresh();
                        //     } else {
                        //         webix.message("Ошибка при переименовании: "+msg);
                        //     }
                        //     return msg;
                        // })
                    }
                    break;
                }
                case "Удалить": {
                    var r = confirm("Удалить элемент '"+titem.value+"'?");
                    if (r == true) {
                        webix.ajax().get("/del/"+titem.id).then(function (data) {
                            msg = data.text()
                            console.log(msg);
                            if (msg=="OK") {
                                webix.message("Элемент с id="+titem.id+" удалён.");
                                tree.remove(context.id);
                                tree.refresh();
                            } else {
                                webix.message("Ошибка при удалении: "+msg);
                            }
                            return msg;
                        })
                    }
                    break;
                }
                case "Поднять": {
                    var parent_item = tree.getParentId(titem.id);
                    console.log("parent:",parent_item);
                    var nexts_item = tree.getPrevSiblingId(titem.id);
                    console.log("prev sibling:",nexts_item);
                    var next_item = tree.getPrevId(titem.id);
                    console.log("prev item:",next_item);
                    var nexts_item = tree.getNextSiblingId(titem.id);
                    console.log("next sibling:",nexts_item);
                    var next_item = tree.getNextId(titem.id);
                    console.log("next item:",next_item);
                    var index = tree.getIndexById(titem.id);
                    console.log("index:",index);
                    var index = tree.getBranchIndex(titem.id);
                    console.log("branch index:",index);
                    var index = tree.getFirstId();
                    console.log("tree first id:",index);
                    var index = tree.getLastId();
                    console.log("tree last id:",index);
                    var pnode = getPrevNode(titem);
                    console.log("prev", pnode);
                    var nnode = tree_get_next_node(titem);
                    console.log("next", nnode);
                    //tree_list_root();

                    var prev = getPrevNode(titem);
                    if (prev) {
                        console.log("Предыдущий элемент: "+prev.id);

                        var details = {};
                        //console.log(parent_item);
                        if (titem.content.id == titem.content.pid) { // for root items
                            var cur_index  = tree.getBranchIndex(titem.id);
                            if (cur_index <= 0) {
                                var cur_index  = tree.getIndexById(titem.id);
                                details.parent = "0"; //tree.getParentId(titem.id);
                                var new_index  = cur_index - 1;
                                webix.message("Корневые папки перемещаются только изменением поля Порядок");
                            } else {
                                //details.parent = tree.getParentId(titem.id);
                                var new_index  = cur_index - 1;
                            }
                        } else {
                            var cur_index  = tree.getBranchIndex(titem.id);
                            details.parent = tree.getParentId(titem.id);
                            var new_index  = cur_index - 1;
                        }

                        tree.move(titem.id, new_index,undefined,details);
                        //tree.move(titem.id, new_index);
                        console.log("Index: "+cur_index+" => "+new_index);
                        tree.refresh();

                        var prev_order = prev.content.order;
                        prev.content.order = titem.content.order;
                        titem.content.order = prev_order;

                        webix.ajax().post("/item/"+titem.content.id, titem.content).then(function (data) {
                            console.log("Order "+titem.content.id+" updated to "+titem.content.order+".");
                            data = data.json();
                            console.log(data);
                        });
                        
                        webix.ajax().post("/item/"+prev.content.id, prev.content).then(function (data) {
                            console.log("Order "+prev.content.id+" updated to "+prev.content.order+".");
                            data = data.json();
                            console.log(data);
                        });
                    } else {
                        webix.message("Ошибка: нет предыдущего элемента");
                        console.log("Ошибка: нет предыдущего элемента");
                    }
                    break;
                }
                case "Опустить": {
                    var prev = tree_get_next_node(titem);
                    if (prev) {
                        console.log("Следующий элемент: "+prev.id);

                        var details = {};
                        //console.log(parent_item);
                        if (titem.content.id == titem.content.pid) { // for root items
                            var cur_index  = tree.getBranchIndex(titem.id);
                            if (cur_index <= 0) {
                                var cur_index  = tree.getIndexById(titem.id);
                                details.parent = "0"; //tree.getParentId(titem.id);
                                var new_index  = cur_index + 1;
                                webix.message("Корневые папки перемещаются только изменением поля Порядок");
                            } else {
                                //details.parent = tree.getParentId(titem.id);
                                var new_index  = cur_index + 1;
                            }
                        } else {
                            var cur_index  = tree.getBranchIndex(titem.id);
                            details.parent = tree.getParentId(titem.id);
                            var new_index  = cur_index + 1;
                        }

                        if (details.parent == "0") {
                            tree.move(titem.id, new_index, tree, details);
                        } else {
                            tree.move(titem.id, new_index,undefined,details);
                        };
                        //tree.move(titem.id, new_index);
                        console.log("Index: "+cur_index+" => "+new_index);
                        tree.refresh();

                        var prev_order = prev.content.order;
                        prev.content.order = titem.content.order;
                        titem.content.order = prev_order;

                        webix.ajax().post("/item/"+titem.content.id, titem.content).then(function (data) {
                            console.log("Order "+titem.content.id+" updated to "+titem.content.order+".");
                            data = data.json();
                            console.log(data);
                        });
                        
                        webix.ajax().post("/item/"+prev.content.id, prev.content).then(function (data) {
                            console.log("Order "+prev.content.id+" updated to "+prev.content.order+".");
                            data = data.json();
                            console.log(data);
                        });
                    } else {
                        webix.message("Ошибка: нет следующего элемента");
                        console.log("Ошибка: нет предыдущего элемента");
                    }
                    break;
                }
                case "Развернуть всё": {
                    console.log("Развернуть всё");
                    tree.openAll();
                    break;
                }
                case "Свернуть всё": {
                    console.log("Свернуть всё");
                    tree.closeAll();
                    break;
                }
            }
        }
    }
    };
}



export {
    contextMenu
}
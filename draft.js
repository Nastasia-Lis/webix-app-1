webix.ready(function(){

    function getObjStruct(obj)
    {
        var res = [];
        for(var m in obj) {
            type = typeof obj[m];
            res.push(m+":"+type);
            console.log(m+":"+type);
        }
        return res;
    }
  
    var webix_ver = "(webix "+webix.name +" "+ webix.version+")";
    console.log(webix);
  
  
    var cur_obj = {};
    var cur_obj_tree_id = "";
  
    function getCurObj() {
      return cur_obj;
    }
  
    function setCurObj(obj, tree_id) {
      if ((tree_id == undefined) || (tree_id == "")) {
        tree_id = cur_obj_tree_id;
      }
  
      cur_obj = obj;
      cur_obj_tree_id = tree_id;
  
      var tree = $$("tree");
      var titem = tree.getItem(tree_id);
      tree.updateItem(tree_id, { content:obj});
      tree.refresh();
  
      var proped = $$("proped");
      elems = proped.config.elements;
      elems = [
               //{ label:"value", type:"text", id:"value", value: titem.value}
              ];
  
      if (titem.content != undefined) {
        propsobj = titem.content;
        //
        //for (var prop in propsobj ){
        //    title = prop
        //    if (prop == "name"    ) title = "Имя"     ;
        //    if (prop == "img_url" ) title = "Картинка";
        //    if (prop == "lnk_url" ) title = "Ссылка"  ;
        //    if (prop == "tags"    ) title = "Хеш-теги";
        //    if (prop == "lnk_type") title = "Тип"     ;
        //    if (prop == "id"      ) title = "Код"     ; 
        //    if (prop == "pid"     ) title = "Родитель";
        //    if (prop == "order"   ) title = "Порядок" ;
        //
        //    if (typeof(propsobj[prop]) == 'object'){
        //        continue;
        //    }
        //    if (typeof(propsobj[prop]) == 'function'){
        //        continue;
        //    }
        //    if (typeof(propsobj[prop]) == 'integer'){
        //        elems.push({ label:title, type:"integer", id:prop, value:propsobj[prop]});
        //    } else {
        //        elems.push({ label:title, type:"text"   , id:prop, value:propsobj[prop]});
        //    }
        //}
  
        elems.push({ label:"Имя"     , type:"text", id:"name"    , value:propsobj["name"    ]});
        elems.push({ label:"Картинка", type:"text", id:"img_url" , value:propsobj["img_url" ]});
        elems.push({ label:"Ссылка"  , type:"text", id:"lnk_url" , value:propsobj["lnk_url" ]});
        elems.push({ label:"Хеш-теги", type:"text", id:"tags"    , value:propsobj["tags"    ]});
        elems.push({ label:"Тип"     , type:"text", id:"lnk_type", value:propsobj["lnk_type"]});
        elems.push({ label:"Код"     , type:"text", id:"id"      , value:propsobj["id"      ]});
        elems.push({ label:"Родитель", type:"text", id:"pid"     , value:propsobj["pid"     ]});
        elems.push({ label:"Порядок" , type:"text", id:"order"   , value:propsobj["order"   ]});
        
        proped.define("elements", elems);
        proped.setValues(propsobj);
        proped.refresh();
  
        webix.ajax().post("/item/"+titem.content.id, titem.content).then(function (data) {
            webix.message("Item "+titem.content.id+" updated.");
            data = data.json();
            console.log(data);
        });
  
      }
  
      proped.define("elements",elems);
      proped.refresh();
    }
  
    var toolbar = {
        view:"toolbar",
        elements:[
            { view:"label", width:200, label:"<img src='https://any2any.herokuapp.com/static/logo_e-xpert.org_avtomatizatsiya_1x.png'>"},
            { view:"label", label:"Редактор структуры сайта 1.0"},
        ]
    };
  
     webix.protoUI({
         name:"edittree"
     }, webix.EditAbility, webix.ui.tree);
      
     var tree = {
        // container:"box",
        //view:"tree",
        view:"edittree",
        id:"tree",
        minWidth:50,
        //template:"{common.icon()} {common.checkbox()} {common.folder()} #value#",
        editable:false,
        editor:"text",
        editValue:"value",
  
        activeTitle:true,
        select: true,
        clipboard: true,
        
        //drag: true,
        //datatype:"plainjs",
        //url: proxy,
        //save: proxy,
        url: "/tree/",
  
        on:{
            onSelectChange:function (ids) {
                console.log("Selected ids:",ids);
                var tree = $$("tree");
                var titem = tree.getItem(ids[0]);
                if (titem.content == undefined) {
                  webix.ajax().get("/item/"+ids[0]).then(function (data) {
                      titem.content = data.json();
                      console.log("await /item/"+ids[0],titem.content);
                      setCurObj(titem.content, ids[0]);
                  });
                } else {
                  setCurObj(titem.content, ids[0]);
                }
            },
  
            onDataRequest: function (id) {
              webix.message("Getting children of " + id);
              this.parse(
                webix.ajax().get("/childs/"+id).then(function (data) {
                  return data = data.json();
                })
              );
              return false;
            },
  
            onBeforeDrop:function(context){
              console.log("Drop context:", context);
              context.parent = context.target; //drop as child
              context.index = -1;              //as last child
            }
        },
  
        ready:function(){
          //console.log('called after ready tree'); 
          var tree = $$("tree");
          var id = tree.getFirstId();
          while (id != null) {
              //console.log("load root /item/"+id);
              webix.ajax().get("/item/"+id).then(function (data) {
                  data = data.json();
                  //console.log("loaded id=",data.id," for id=",id);
                  $$("tree").updateItem(data.id, { content:data});
              });
              id = tree.getNextId(id);
          }
        }
    };
  
    function tree_is_root(id)
    {
        var res = undefined;
        var tree = $$("tree");
        var titem = tree.getItem(id);
        if (titem) {
            res = (titem.$level == 1);
        }
        return res;
    }
  
    function tree_list_root()
    {
        var tree = $$("tree");
        var id = tree.getFirstId();
        while (id != null) {
            var tree_node = tree.getItem(id);
            
            if (tree_node.id == tree_node.content.pid) {
                console.log("root: ",id,tree_node.content.name);
            };
            
            id = tree.getNextId(id);
        }
    }
  
    function tree_get_prev_node(tree_node)
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
  
    var proped = {
        view:"property",  
        id:"proped", 
        minWidth:50,
        //height:300,
        scroll:"xy",
        //elements:[
        //   { label:"Свойства элемента", type:"label"},
        //],
  
        on:{
            onAfterEditStop:function (state, item, ignoreUpdate) {
                if(state.value != state.old){
                    obj = getCurObj();
                    obj[item.id] = state.value;
                    obj = setCurObj(obj);
                } 
            },
            onItemClick: function(id, e, node){
                console.log("clicked", id, e, node)
                //var edit = this.getEditor();
                //console.log("editor", edit);
            }
  
        }
    };
  
    webix.ui({
         id:"mylayout",
         rows: [toolbar, 
                 { cols: [
                          {id:"placeh1", rows: [{view:"template", 
                                                 type:"header", 
                                                 template:"Структура сайта"},
                                                tree]
                          },
                          {view:"resizer"},
                          {id:"placeh2", rows: [{view:"template", 
                                                 type:"header", 
                                                 template:"Свойства элемента"},
                                                proped]
                          }
                         ]
                 },
                { view:"label", label:"Copyright  &copy; ООО ИнфоИнт 2021", align:"center"}
               ]
    });
  
    
    var add_ctx = {
        view:"contextmenu",
        id:"cm",
        data:[
                "Добавить",
                "Переименовать",
                { $template:"Separator" },
                "Поднять",
                "Опустить",
                { $template:"Separator" },
                "Свернуть всё",
                "Развернуть всё",
                { $template:"Separator" },
                "Удалить"
               /* "Add many",
                "Add to root",
                { $template:"Separator" },
                "Copy",
                "Paste",
                "Cut",
                { $template:"Separator" },
                "Expand",
                "Collapse",
                { $template:"Separator" },
                "Info"*/
            ],
       master: $$("tree"),
       on:{
           onMenuItemClick:function(id){
               var context = this.getContext();
               console.log("Context: ",context);
               var tree = $$("tree");
               var titem = tree.getItem(context.id);
               //var titem = tree.getSelectedId();
               console.log("Tree item",titem);
  
               var menu = this.getMenu(id);
               var cmd = menu.getItem(id).value
               webix.message(cmd);
               console.log(cmd);
  
               switch (cmd) {
                   case "Добавить": {
                       var text = prompt("Имя нового подэлемента '"+titem.value+"'", "");
                       if (text != null) { // null if cancel pressed
                           webix.ajax().get("/add?pid="+titem.id+"&name="+text).then(function (data) {
                               msg = data.text()
                               console.log(msg);
                               const newid = parseInt(msg, 10);
                               if (isNaN(newid)) {
                                   webix.message("Ошибка при добавлении: "+msg);
                               } else {
                                   webix.message("Элемент с id="+msg+" добавлен.");
                                   tree.add({value: text, content:{name:text}, id: newid}, 0, context.id);
                                   tree.refresh();
                               }
                               return msg;
                           })
                       }
                       break;
                   }
                   case "Add to root": {
                       var text = prompt("Enter name (new child of root)", "");
                       if (text != null) { // null if cancel pressed
                           tree.add({value: text}, 0);
                       }
                       break;
                   } 
                   case "Add many": {
                       var text = prompt("Enter names (new child of '"+titem.value+"')", " ");
                       if ((text != null) && (text.length > 0)) { // null if cancel pressed
                           sep = text[0];
                           flds = text.substr(1).split(sep);
                           flds.reverse();
                           flds.forEach(function(item){
                               tree.add({value: item, opt:item+"_opt"}, 0, context.id);
                           })
                       }
                       break;
                   }
                   case "Переименовать": {
                       var text = prompt("Новое имя", titem.value);
                       if (text != null) { // null if cancel pressed
                           webix.ajax().get("/ren?pid="+titem.id+"&name="+text).then(function (data) {
                               msg = data.text()
                               console.log(msg);
                               if (msg=="OK") {
                                   webix.message("Элемент с id="+titem.id+" переименован.");
                                   titem.value = text;
                                   tree.refresh();
                               } else {
                                   webix.message("Ошибка при переименовании: "+msg);
                               }
                               return msg;
                           })
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
                       var pnode = tree_get_prev_node(titem);
                       console.log("prev", pnode);
                       var nnode = tree_get_next_node(titem);
                       console.log("next", nnode);
                       //tree_list_root();
  
                       var prev = tree_get_prev_node(titem);
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
                           /*
                           if (titem.content.id == titem.content.pid) { // for root items
                               var cur_index  = tree.getIndexById(titem.id);
                               var new_index  = tree.getIndexById(prev.id);
                               if (tree.getParentId(prev.id)) {
                                   details.parent = tree.getParentId(prev.id);
                               }
                           } else {
                               var cur_index  = tree.getBranchIndex(titem.id);
                               details.parent = tree.getParentId(titem.id);
                               var new_index  = cur_index - 1;
                           }
                           */
  
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
                   case "Info": {
                       var propsText = $$("propsarea");
                       console.log(titem.config);
                       propsText.setValue(getObjStruct(tree).sort().join("\n"));
                       //for(s in getObjStruct(tree)) {
                       //    propsText.setValue(propsText.getValue()+"\n"+s);
                       //}
                       break;
                   }
               }
           }
       }
    };
    webix.ui(add_ctx);
  
  
    function open_subtree() {
        var tree = $$("tree");
        var titem = tree.getSelectedId();
        console.log("open",titem);
        if (titem != null) {
            tree.open(titem);
            console.log("opened",titem);
        }
    }
  
    function close_subtree() {
        var tree = $$("tree");
        var titem = tree.getSelectedId();
        if (titem != null) {
            tree.close(titem);
        }
    }
  
    function enter_subtree() {
        var tree = $$("tree");
        var nodeid = tree.getSelectedId();
        if (nodeid != null) {
            titem = tree.getItem(nodeid);
            childs_count = titem.$count;
            console.log(titem.value, childs_count);
  
            if (childs_count > 0) {
                if (tree.isBranchOpen(nodeid)) {
                    tree.close(nodeid);
                } else {
                    tree.open(nodeid);
                }
            } else {
                var text = prompt("Enter new name", titem.value);
                if (text != null) { // null if cancel pressed
                    titem.value = text;
                    tree.refresh();
                }
            }
        }
    }
  
  
    webix.UIManager.addHotKey("subtract", open_subtree, $$("tree"));
    webix.UIManager.addHotKey("ctrl-up", close_subtree, $$("tree"));
    webix.UIManager.addHotKey("enter", enter_subtree, $$("tree"));
  
  
    //$$("tree").attachEvent("onAfterRender", webix.once(function(){ 
    //}));
  
    console.log("Worked!!!")
  });
  
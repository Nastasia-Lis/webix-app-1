import {tableId, pagerId,editFormId, saveBtnId,saveNewBtnId, addBtnId, delBtnId, findElemetsId, searchId,  exportBtn} from './modules/setId.js';

import {formLogin} from "./modules/login.js";
import * as header from "./modules/header.js";
import * as tableToolbar from "./modules/tableToolbar.js";
import {editTableBar, defaultStateForm,createEditFields,popupExec, checkFormSaved,clearItem} from "./modules/editTable.js";

webix.ready(function(){
    
    let countRows;
    let currItemTree;
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
      
      var tableTemplate = $$("tableTemplate");
      let elems = tableTemplate.config.elements;
      elems = [
               //{ label:"value", type:"text", id:"value", value: titem.value}
              ];
  
    //   if (titem.content != undefined) {
    //     let propsobj = titem.content;
  
    //     elems.push({ label:"Имя"     , type:"text", id:"name"    , value:propsobj["name"    ]});
    //     elems.push({ label:"Картинка", type:"text", id:"img_url" , value:propsobj["img_url" ]});
    //     elems.push({ label:"Ссылка"  , type:"text", id:"lnk_url" , value:propsobj["lnk_url" ]});
    //     elems.push({ label:"Хеш-теги", type:"text", id:"tags"    , value:propsobj["tags"    ]});
    //     elems.push({ label:"Тип"     , type:"text", id:"lnk_type", value:propsobj["lnk_type"]});
    //     elems.push({ label:"Код"     , type:"text", id:"id"      , value:propsobj["id"      ]});
    //     elems.push({ label:"Родитель", type:"text", id:"pid"     , value:propsobj["pid"     ]});
    //     elems.push({ label:"Порядок" , type:"text", id:"order"   , value:propsobj["order"   ]});
        
    //     tableTemplate.define("elements", elems);
    //     tableTemplate.setValues(propsobj);
    //     tableTemplate.refresh();
  
    //     webix.ajax().post("/item/"+titem.content.id, titem.content).then(function (data) {
    //         webix.message("Item "+titem.content.id+" updated.");
    //         data = data.json();
            
    //     });
  
    //   }
  
      tableTemplate.define("elements",elems);
      tableTemplate.refresh();
    }

  
     webix.protoUI({
         name:"edittree"
     }, webix.EditAbility, webix.ui.tree);
      
     
     // -- SIDEBAR
     
     var tree = {
        view:"edittree",
        id:"tree",
        minWidth:200,
        width: 300,
        minHeight:150,
        editable:false,
        editor:"text",
        editValue:"value",
        activeTitle:true,
        select: true,
        clipboard: true,
        data: webix.ajax().get("/init/default/api/fields.json").then(function (data) {
            let srcTree = data.json().content;
            let obj = Object.keys(srcTree);
            let dataTree = [];
            obj.forEach(function(data) {
                dataTree.push({"id":data, "value":srcTree[data].plural});
            });
            return dataTree;
        }),
        
        
        on:{
            onSelectChange:function (ids) {
                $$(addBtnId).enable();
                $$(searchId).enable();
                $$(exportBtn).enable();
                var tree = $$("tree");
                var titem = tree.getItem(ids[0]);
                $$(tableId).clearAll();
                if (titem == undefined) {
                    webix.ajax().get("init/default/api/fields.json").then(function (data) {
                        data = data.json().content; //список всех items
                        titem.content = data.json();
                        console.log(titem.content, "err");
                    });
                } else {
                    
                    webix.ajax().get("init/default/api/fields.json").then(function (data) {
                        
                        data = data.json().content[ids[0]]; //полный item
                        
                        let dataFields = data.fields;
                        let obj = Object.keys(data.fields) //id список полей 
                        let columnTable = [];
                        obj.forEach(function(data) {
                           dataFields[data].id = data;
                           dataFields[data].fillspace = true;
                           dataFields[data].header= dataFields[data]["label"];
                           columnTable.push(dataFields[data]);
                        });
                        $$(tableId).refreshColumns(columnTable);
                        $$(tableId).parse();
                        
                        countRows = $$(tableId).count();
                        $$(findElemetsId).setValues(countRows.toString());
                    });
                }  
            },
  
            onBeforeSelect: function(data, preserve) {

                if($$(editFormId).isDirty()){
                    
                    checkFormSaved().then(function(result){
                        if(result) {
                            console.log(data, preserve);
                            clearItem();
                            $$("tree").select(data);
                        } 
                    });
                    
                    return false;
                }

            },
            onDataRequest: function (id) {
            // submenu render

            //let findId = info.child.find(child=> child.parent === id);

            // webix.ajax().get("init/default/api/fields.json").then(function (data) {
            //     console.log(data.json());
            // });

            webix.message("Getting children of " + id);
           
            this.parse(
                webix.ajax().get("init/default/api/tables.json").then(function (data) {
                    
                    return data.content;
                })
            );
            
            
            //this.parse (findId);
            //return findId;
            //return false;
            },
  
            onBeforeDrop:function(context){
              console.log("Drop context:", context);
              context.parent = context.target; //drop as child
              context.index = -1;              //as last child
            }
        },
  
        // ready:function(){
        //     //--menu
        //     let tree = $$("tree");
        //     let id = tree.getFirstId();
        //     while ( id != null) {
                
        //         // Object.keys(data)[1] = получить идентификатор item'а
        //         // data[dataIndex]  = получить весь item
    
        //         webix.ajax().get("init/default/api/fields.json").then(function (data) {
                    
        //             data = data.json().content; //список всех items
        //             let dataContent =  data[dataIndex];
        //             //$$("tree").updateItem(dataIndex, { content:dataContent});

        //             });
                    
        //             id = tree.getNextId(id);
        //         }
                
        //     }
        };
  


    // function tree_is_root(id)
    // {
    //     var res = undefined;
    //     var tree = $$("tree");
    //     var titem = tree.getItem(id);
    //     if (titem) {
    //         res = (titem.$level == 1);
    //     }
    //     return res;
    // }
  
    // function tree_list_root()
    // {
    //     var tree = $$("tree");
    //     var id = tree.getFirstId();
    //     while (id != null) {
    //         var tree_node = tree.getItem(id);
            
    //         if (tree_node.id == tree_node.content.pid) {
    //             console.log("root: ",id,tree_node.content.name);
    //         };
            
    //         id = tree.getNextId(id);
    //     }
    // }
  
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
  

    // --- TABLE
    var tableTemplate = {
        view:"datatable",
        id: tableId,
        css:"webix_table-style webix_header_border webix_data_border",
        resizeColumn: true,
        autoConfig: true,
        pager:pagerId,
        minHeight:300,
        footer: true,
        minWidth:500, 
        select:true,
        minColumnWidth:200,
        on:{
            onAfterSelect(id){

                let values = $$(tableId).getItem(id); 
                function toEditForm () {
                    console.log(values)
                    $$(editFormId).setValues(values);
                    $$(saveNewBtnId).hide();
                    $$(saveBtnId).show();
                    $$(addBtnId).hide(); 
                }
                
                if($$(editFormId).isDirty()){
                    popupExec("Данные не сохранены").then(
                        function(){
                            $$(editFormId).clear();
                            $$(delBtnId).enable();
                            toEditForm();
                    }); 
                } else {
                    createEditFields();
                    toEditForm();
                }
                
            },


            onAfterLoad:function(){
                $$(editFormId).removeView("inputsTable");
                defaultStateForm ();
                
                if (!this.count())
                  this.showOverlay("Ничего не найдено");
                
                if (this.count())
                  this.hideOverlay();  

                  
            },  

            // "onResize":function(){ 
            //     let width = window.innerWidth;
            //     if (width > 1200){
            //         console.log("больше");
            //         $$(tableId).define("width", 800);
            //     } else {
            //         console.log("меньше");
            //     }
                
            // },

            onAfterDelete: function() {
                if (!this.count())
                  this.showOverlay("Ничего не найдено");
            },

            onAfterAdd: function() {
                countRows+=1;
                $$(findElemetsId).setValues(countRows.toString());
                this.hideOverlay();
            }
        },
        ready:function(){
            if (!this.count()){ 
                webix.extend(this, webix.OverlayBox);
                this.showOverlay("<div style='...'>Ничего не найдено</div>");
            }
        }
    };
  


    /// LAYOUT

    // webix.ui({
    //     view:"scrollview",
    //             id:"layout", 
    //             scroll:"y", 
    //             body:{
    //                 rows: [
    //                     header.header(),
    //                     {   id:"adaptive",
    //                         rows:[ ]
    //                     },
    //                     {   id:"mainContent",
    //                         responsive:"adaptive", 
    //                         cols:[
    //                             tree,
    //                             {   view:"resizer", 
    //                                 id:"resizeOne", 
    //                                 class:"webix_resizers",
    //                             },
    //                             {   id:"tableContainer",
    //                                 rows:[
    //                                     tableToolbar.tableToolbar(),
    //                                     tableTemplate,
    //                                 ]
    //                             },
    //                             {   view:"resizer", 
    //                                 id:"resizeTwo", 
    //                                 class:"webix_resizers"
    //                             },
    //                                 editTableBar,
                                
    //                         ]
    //                     },
              
    //                 ]
    //             },

    // });
  

    webix.ui({
        view:"scrollview",
                id:"layout", 
                scroll:"y", 
                body:{
                    cells: [ 
                        {id: "userAuth", 
                        cols: [
                            {},
                            {   rows:[
                                    {},
                                    formLogin,
                                    {}
                                ]},
                            {}
                        ]},
                        //{ template:"Details page<br>not implemented :)<br><button >Back</button>", id:"mainContent" },
                        {id:"mainLayout", rows: [
                            
                            header.header(),
                            {   id:"adaptive",
                                rows:[ ]
                            },
                            {   id:"mainContent",
                                responsive:"adaptive", 
                                cols:[
                                    tree,
                                    {   view:"resizer", 
                                        id:"resizeOne", 
                                        class:"webix_resizers",
                                    },
                                    {   id:"tableContainer",
                                        rows:[
                                            tableToolbar.tableToolbar(),
                                            tableTemplate,
                                        ]
                                    },
                                    {   view:"resizer", 
                                        id:"resizeTwo", 
                                        class:"webix_resizers"
                                    },
                                        editTableBar,
                                    
                                ]
                            },
                
                        ]}
                    ],
                },

    });

   
    Backbone.history.start();

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
  

});






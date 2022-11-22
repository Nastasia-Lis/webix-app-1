import { setLogValue }                   from '../logBlock.js';
import { setAjaxError,setFunctionError } from "../../blocks/errors.js";
 
function contextMenu (){
    const combo      = $$("editTreeCombo");
    const comboData  = combo.getPopup().getList();

    function returnPullValues(){
        const comboData  = combo.getPopup().getList();
        return Object.values(comboData.data.pull);
    }

    function addOption(option){     
  
        const pullValues = returnPullValues();
        pullValues.forEach(function(el,i){

            if (el.id !== option.id){
                comboData.parse(option);
            }

        });

    }

    function renameOption(option){
        const pullValues = returnPullValues();
   
        pullValues.forEach(function (el, i){

            if (el.id == option.id){
                comboData.parse(option);
            }
           
        });
      
    }

    function removeOption(option){
        const pullValues = returnPullValues();
   
        pullValues.forEach(function (el, i){

            if (el.id == option.id){
                combo.getList().remove(option.id);
            }
           
        });
    }

    return {
        view : "contextmenu",
        id   : "contextMenuEditTree",
        data : [
                "Добавить",
                "Переименовать",
                { $template : "Separator" },
                "Свернуть всё",
                "Развернуть всё",
                { $template : "Separator" },
                "Удалить"
            ],
        master: $$("treeEdit"),
        on:{
            onMenuItemClick:function(id){
             
                const context = this.getContext();
                const tree    = $$("treeEdit");
                const titem   = tree.getItem(context.id); 
                const menu    = this.getMenu(id);
                const cmd     = menu.getItem(id).value;
                const url     = "/init/default/api/trees/";
            
                let postObj = {
                    name  : "",
                    pid   : "",
                    owner : null,
                    descr : "",
                    ttype : 1,
                    value : "",
                    cdt   : null,
                };

          
                switch (cmd) {
                    case "Добавить": {
                    
                        const text = prompt("Имя нового подэлемента '"+titem.value+"'", "");

                    
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
                                            id    : idNewItem,
                                            value : text, 
                                            pid   : titem.id
                                        }, 0, titem.id);
                                        
                                        tree.open(titem.id);

                          
                                        const comboOption = {
                                            id      : titem.id, 
                                            value   : titem.value
                                        };
       
                                        addOption(comboOption);
                                    
                                        setLogValue("success","Данные сохранены");
                                    } else {
                                        setFunctionError( 
                                            data.err,
                                            "editTree",
                                            "case add post msg"
                                        );
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
                                        renameOption({
                                            id    : titem.id, 
                                            value : titem.value
                                        });
                                        setLogValue("success","Данные изменены");
                                    } else {
                                        setFunctionError( 
                                            data.err,
                                            "editTree",
                                            "case rename put msg"
                                        );
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

                        const delData =  webix.ajax().del(url + titem.id, titem);

                        delData.then(function(data){
                            try{
                                data = data.json();
                                if (data.err_type == "i"){
                                    tree.remove(titem.id);
                                    removeOption({
                                        id    : titem.id, 
                                        value : titem.value
                                    });
                                    setLogValue("success","Данные удалены");
                                } else {
                                    setFunctionError( 
                                        data.err, 
                                        "editTree", 
                                        "case delete del msg"
                                    );
                                }
                            } catch (err){
                                setFunctionError(err, "editTree", "case delete");
                            }
                        });

                        delData.fail(function(err){
                            setAjaxError(err, "editTree", "case delete");
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




function editTreeClick (){
    const tree  = $$("treeEdit");

    
    function cssItems(action, selectItems){
        const pull       = tree.data.pull;
        const values     = Object.values(pull);
        const css        = "tree_disabled-item";

        values.forEach(function(item, i){

            if (action == "remove"){
                tree.removeCss(item.id, css);

            } else if (action == "add" && selectItems) {
                const result = selectItems.find((id) => id == item.id);

                if (!result){
                    tree.addCss   (item.id, css);
                }
            }
        
        });
    }

    cssItems("remove");

    const combo  = $$("editTreeCombo");
    const value  = combo.getValue();
    const branch = [];

    function openFullBranch(value){
       const parent = tree.getParentId(value);
      
        if (parent && tree.getParentId(parent)){
            tree  .open   (parent);
            branch.push   (parent);
            openFullBranch(parent);
        } else {
            tree.open(value);
        }  
    }

    function returnSelectItems(){
        const res = [value];
        tree.data.eachSubItem(value,function(obj){ 
            res.push(obj.id);
        });   

        return res;
    }
    

    if (tree.exists(value)){
        openFullBranch  (value);
        tree.showItem   (value);
        tree.open       (value);

        const selectItems = returnSelectItems();

        cssItems("add", selectItems);
    }
}


function editTreeLayout () {
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
                try {
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

        {   id  : "treeEditContainer", 
            cols: [
                {rows: [
                        tree,
                    ],
                },
                {rows: [
                    {
                        view          :"combo", 
                        id            :"editTreeCombo",
                        labelPosition :"top",
                        label         :"Выберите элемент для редактирования", 
                        options       :[]
                    },

                    {   view  : "button", 
                        value : "Применить" ,
                        css   : "webix_primary",
                        click : editTreeClick
                    },
                    {},
                ]},
                
                  
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
};
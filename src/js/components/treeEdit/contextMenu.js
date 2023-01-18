import { setLogValue }          from '../logBlock.js';
import { setFunctionError }     from "../../blocks/errors.js";
import { ServerData }           from "../../blocks/getServerData.js";

let tree;
let context ;
let titem ;
let menu ;  
let cmd ;  
let url ;
let postObj;

class Option {

    constructor (){
        this.combo     = $$("editTreeCombo");
        this.comboData = this.combo.getPopup().getList();
        this.pull      = Object.values(this.comboData.data.pull);
    }

    static returnCombo(){
        return $$("editTreeCombo");
    }


    static returnComboData(){
        const combo = this.returnCombo();
        return combo.getPopup().getList();
    }


    static returnPullValues(){
        const data = this.returnComboData();
        return Object.values(data.data.pull);
    }


    static add(option){  
        const data       = this.returnComboData();
        const pullValues = this.returnPullValues();

        if (pullValues && pullValues.length){
            pullValues.forEach(function(el,i){
                if (el.id !== option.id){
                    data.parse(option);
                }
            });
        }
       

    }

    static rename(option){
        const data       = this.returnComboData();
        const pullValues = this.returnPullValues();
   
        if (pullValues && pullValues.length){
            pullValues.forEach(function (el){

                if (el.id == option.id){
                    data.parse(option);
                }
            
            });
        }
      
    }

    static remove(option){
        const data       = this.returnComboData();
        const pullValues = this.returnPullValues();

        function removeSubItemOptions(id){
            const res = [id];

            tree.data.eachSubItem(id, function(obj){ 
                res.push(obj.id);
            }); 

            return res;
        }

        function isExists(element){
            let check = false;
            if (pullValues && pullValues.length){
                pullValues.forEach(function (el){

                    if (el.id == element){
                        check = true;
                    }
                });
            }
            return check;
        }

        const removeItems = removeSubItemOptions(option.id);
        if (removeItems && removeItems.length){
            removeItems.forEach(function (item){
                if (isExists(item)){
                    data.remove(item);
                }

            });
        }
    
    }

}


function addItem(text){
    postObj.name = text;
    postObj.pid = titem.id;

    new ServerData({
        id : url 
       
    }).post(postObj).then(function(data){
    
        if (data){
    
            const content = data.content;
    
            if (content){
                let idNewItem = content.id;
            
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

                Option.add(comboOption);
            
                setLogValue("success","Данные сохранены");
    
            }
        }
         
    });


}

function renameItem(text){
    postObj.name = text;
    postObj.id = titem.id;
    postObj.pid = titem.pid;

    new ServerData({
        id : url + titem.id
       
    }).put(postObj).then(function(data){
    
        if (data){

            titem.value = text;
            tree.updateItem(titem.id, titem);

            const option = {
                id    : titem.id, 
                value : titem.value
            };

            Option.rename(option);

            setLogValue("success", "Данные изменены");
    
            
        }
         
    });

}

function removeItem(){

    new ServerData({
        id : url + titem.id
       
    }).del(titem).then(function(data){
    
        if (data){
            const option = {
                id    : titem.id, 
                value : titem.value
            };

            Option.remove(option);

            tree.remove(titem.id);

            setLogValue("success", "Данные удалены"); 
    
        }
         
    });

}

function expandItem(){
    try{
        tree.open(titem.id);
        tree.data.eachSubItem(titem.id, function (obj){ 
            tree.open(obj.id);
        });

    } catch (err){
        setFunctionError( 
            err,
            "editTree",
            "case open all"
        );
    }
}

function collapseItem(){
    try{
        tree.close(titem.id);
        tree.data.eachSubItem(titem.id, function (obj){ 
            tree.close(obj.id);
        });
    } catch (err){
        setFunctionError( 
            err,
            "editTree",
            "case close all"
        );
    }
}


function contextLogic(id, self){
    context = self.getContext();
    tree    = $$("treeEdit");
    titem   = tree.getItem(context.id); 
    menu    = self.getMenu(id);
    cmd     = menu.getItem(id).value;
    url     = "trees/";

    postObj = {
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
        
            const text = 
            prompt
            ("Имя нового подэлемента '" + titem.value + "'", "");

            if (text != null) {
                addItem(text);
            }
            break;
        }
    
        case "Переименовать": {
            const text = prompt("Новое имя", titem.value);
            if (text != null) { 
                renameItem(text);
            }
            break;
        }
        case "Удалить": {
            removeItem();
            break;
        }

        case "Развернуть всё": {
            expandItem();
            break;
        }
        case "Свернуть всё": {
            collapseItem();
            break;
        }
        
    }
}

function contextMenu (){

    const contextMenu = {
        view : "contextmenu",
        id   : "contextMenuEditTree",
        data : [
                "Добавить",
                "Переименовать",
                { $template : "Separator" },
                "Развернуть всё",
                "Свернуть всё",
                { $template : "Separator" },
                "Удалить"
            ],
        master: $$("treeEdit"),
        on:{
            onMenuItemClick:function(id){
             
                contextLogic(id, this);
         
            }
        }
    };

    return contextMenu;
}

export {
    contextMenu
};
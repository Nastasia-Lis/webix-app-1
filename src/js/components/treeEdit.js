  
///////////////////////////////
//
// Медиатор                             (create mediator)
//
// Контекстное меню                     (create context menu)
//
// Формы с заданием условий для дерева  (create tree forms)
//
// Создание дерева                      (create tree data)
//
// Layout компонента                    (create layout)
//
// Copyright (c) 2022 CA Expert
//
///////////////////////////////

import { setLogValue }                      from './logBlock.js';
import { ServerData }                       from "../blocks/getServerData.js";
import { setFunctionError }                 from "../blocks/errors.js";
import { GetFields, LoadServerData }        from "../blocks/globalStorage.js";
import { Action }                           from "../blocks/commonFunctions.js";

const logNameFile = "treeEdit";


//create mediator
class TreeEdit {
    constructor (){
        this.name = "treeTempl";
    }

    create(){
        try{
            if (!$$(this.name)){
                $$("container").addView(
                    {   view:"layout",
                        id:this.name, 
                        hidden:true, 
                        scroll:"auto",
                        rows: editTreeLayout()
                    },
                4);
                
                webix.ui(contextMenu());
            }
          
        } catch (err){
            setFunctionError(
                err,
                logNameFile,
                "createTreeTempl"
            );
        }
    }

    showView(){
        Action.showItem($$(this.name));   
    }

    load(){
        getInfoEditTree();
    }


    defaultState(id){
        try{
            const elem = $$("treeTempl");
            if(!($$(id))){
                Action.hideItem(elem);
            }
        } catch (err){
            setFunctionError(err, logNameFile, "hideTreeTempl");
        }
    }

}


//create context menu
let treeItem;
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
            
                treeItem.data.add({
                    id    : idNewItem,
                    value : text, 
                    pid   : titem.id
                }, 0, titem.id);
                
                treeItem.open(titem.id);
  
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
            treeItem.updateItem(titem.id, titem);

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

            treeItem.remove(titem.id);

            setLogValue("success", "Данные удалены"); 
    
        }
         
    });

}

function expandItem(){
    try{
        treeItem.open(titem.id);
        treeItem.data.eachSubItem(titem.id, function (obj){ 
            treeItem.open(obj.id);
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
        treeItem.close(titem.id);
        treeItem.data.eachSubItem(titem.id, function (obj){ 
            treeItem.close(obj.id);
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
    context     = self.getContext();
    treeItem    = $$("treeEdit");
    titem       = treeItem.getItem(context.id); 
    menu        = self.getMenu(id);
    cmd         = menu.getItem(id).value;
    url         = "trees/";

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



//create tree forms
let tree;

const cssDisable = "tree_disabled-item";

function cssItems(action, selectItems){

    if (tree){
        const pull = tree.data.pull;

        if (pull){
            const values = Object.values(pull);

            if (values && values.length){
                values.forEach(function(item){
        
                    if (action == "remove"){
                        tree.removeCss(item.id, cssDisable);
            
                    } else if (action == "add" && selectItems) {
                        const result = 
                        selectItems.find((id) => id == item.id);
            
                        if (!result){
                            tree.addCss   (item.id, cssDisable);
                        }
                    }
                
                });
            }
          
        }
    }
   
   
}


function openFullBranch(value){
    const parent = tree.getParentId(value);
    if (parent && tree.getParentId(parent)){
        tree.open     (parent);
        openFullBranch(parent);
    } else {
        tree.open(value);
        tree.open(parent);
    }  



    return value;
}

function returnSelectItems(value){
    const res = [value];
    tree.data.eachSubItem(value, function(obj){ 
        res.push(obj.id);
    });   

    return res;
}

function parentsLogic(value){
    let topParent;

    if (tree.exists(value)){
     
        topParent = openFullBranch(value);

        tree.showItem   (value);
        tree.open       (value);

        const selectItems = returnSelectItems(value);

        cssItems("add", selectItems);
    }

    return topParent;
}


function getAvailableItems(topParent){
    const res = [topParent];
    tree.data.eachSubItem(topParent, function(obj){ 
        res.push(obj.id);
    });   

    return res;
}

function showLastItem(resultItems){
    const index = resultItems.length - 1;
    const item  = resultItems[index];
    tree.showItem (item);
}
 

function ownersLogic(value, topParent){
    const pull   = tree.data.pull;
    const values = Object.values(pull);

    const resultItems = [];

   
    if (topParent){ // если уже выбран элемент для редактирования
        const items = getAvailableItems(topParent);

        if (items && items.length){
            items.forEach(function(id, i){
                const item  = tree.getItem(id);
                const owner = item.owner;
        
                if (owner == value){
                    resultItems.push(id);
                  
                }
    
            });
    
            cssItems("add", resultItems);
        }
        
    } else {

        if (values && values.length){
            values.forEach(function(el){
                const owner = el.owner; 
                if (owner && owner == value){
                    resultItems.push(el.id);
                
                }
            });
        }
   

    }

    cssItems("add", resultItems);

    showLastItem(resultItems);

    if (resultItems && resultItems.length){
        resultItems.forEach(function(id){
            openFullBranch(id);
        });
    }
   
 
}   


function editTreeClick (){
    tree  = $$("treeEdit");

    cssItems("remove");

    const formVals = $$("editTreeForm").getValues();

    const parents = formVals.parents;
    const owners  = formVals.owners;

    let topParent;

    if (parents && parents !== "111"){
        topParent = parentsLogic(parents);
    }

    if (owners && owners !== "111"){
        ownersLogic(owners, topParent);
    }


}



function returnParentCombo(){
    const combo = {
        view          : "combo", 
        id            : "editTreeCombo",
        name          : "parents",
        value         : 111,
        labelPosition : "top",
        label         : "Выберите элемент для редактирования", 
        options       : []
    };

    return combo;
}

function returnOwnerCombo(){
    const combo = {
        view          : "combo", 
        id            : "editTreeComboOwner",
        name          : "owners",
        labelPosition : "top",
        value         : 111,
        label         : "Выберите владельца", 
        options       : []
 
    };

    return combo;
}


function returnBtn(){
    const btn = {   
        view  : "button", 
        value : "Применить" ,
        css   : "webix_primary",
        click : editTreeClick
    };

    return btn;
}


function returnForm(){
    const form = {
        view    : "form", 
        id      : "editTreeForm",
        width   : 300,
        elements: [
            returnParentCombo(),
            returnOwnerCombo (),
            returnBtn(),
            {}, 
        ]
    };

    return form;
}


//create tree data

let treeEdit;

function returnEmptyOption(){
    const options = [
        { 
            id    : 111, 
            value : "Не выбрано" 
        }
    ];

    return options;
}


//set combo parents
function isParent(el){
    let res          = false;
    const firstChild = treeEdit.getFirstChildId(el);

    if (firstChild){
        res = true;
    }

    return res;
}

function findParents(treeData){
    const parents = [];

    if (treeData && treeData.length){
        treeData.forEach(function(item,i){

            if (isParent(item.id)){
                parents.push(item);
            }
           
        });
    
    }

    return parents;
}


function setComboValues(treeData){
    const parents = findParents(treeData);
 

    if (parents && parents.length){

        const options = returnEmptyOption();
        const combo   = $$("editTreeCombo");

        parents.forEach(function(parent){
            options.push({
                id    : parent.id,
                value : parent.value
            });
        });
    
        combo.getPopup().getList().parse(options);
    
        const firstOption = options[0].id;
        combo.setValue(firstOption);
    }


}


//set combo owners
async function getRefField(){
    await LoadServerData.content("fields");
    const field = GetFields.item("trees");

    const ownerConfig = field.fields.owner;
    const refAttr     = ownerConfig.type;

    return refAttr.slice(10); //slice "reference" 
}

function getOptions(data){
    const options = returnEmptyOption();

    if (data && data.length){
        data.forEach(function(el){
            options.push({
                id    : el.id, 
                value : el.first_name
            });
        });
    }
 

    return options;
}

function setOptionsToCombo(options){
    const combo   = $$("editTreeComboOwner");
    combo.getPopup().getList().parse(options);
}

async function setOwnerComboValues(){

    const refField = await getRefField();

    new ServerData({
        id : refField 
       
    }).get().then(function(data){
    
        if (data){
    
            const content = data.content;
            if (content){
                const options = getOptions(content);
                setOptionsToCombo(options);
            }
        }
         
    });


}



// create tree struct
function createTreeItem(el){
    return {
        id    : el.id, 
        value : el.name, 
        owner : el.owner,
        pid   : el.pid, 
        data  : []
    };
}


function pushTreeData(data){
    const treeData = [];       
 

    if (data && data.length){
        data.forEach(function(el){
            if (el.pid == 0){
                const rootElement = createTreeItem(el);

                rootElement.open  = true;
                treeData.push ( rootElement );

            } else {
                const element = createTreeItem(el);

                treeData.push (element );
            }
        });
    }


    return treeData;
}

function createStruct(treeData){
    const treeStruct = [];
    const map        = {};
    try{

        if (treeData && treeData.length){
            treeData.forEach(function(el, i){

                map[el.id] = i; 
    
                if ( el.pid !== 0 && el.pid !== el.id && el.pid !== null ) {
                    treeData[map[el.pid]].data.push(el);
                } else {
                    treeStruct.push(el);
                }
            });
        }
    
    } catch (err) {
        setFunctionError(err, logNameFile, "createStruct");
    }
    return treeStruct;
}

function getTrees(){

    new ServerData({
    
        id : "trees"
       
    }).get().then(function(data){
    
        if (data){
    
            const content = data.content;
    
            if (content){
                
                content[0].pid = 0;
        
                const treeData   = pushTreeData(content);
                const treeStruct = createStruct(treeData);
        
                treeEdit.parse      (treeStruct);
        
                setComboValues      (treeData);
                setOwnerComboValues ();
    
            }
        }
         
    });

}

function getInfoEditTree() {
    treeEdit  = $$("treeEdit");

    getTrees();

    if (treeEdit){
        treeEdit.clearAll();
    }   
 
}



//create layout


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
    TreeEdit
};
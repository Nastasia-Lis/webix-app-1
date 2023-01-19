///////////////////////////////

// Кнопки перемещения между list компонентами

// Copyright (c) 2022 CA Expert

///////////////////////////////

import { Button } from "../../../../viewTemplates/buttons.js";
import { Action } from "../../../../blocks/commonFunctions.js";

function createMsg(){
    if(!($$("visibleColsMsg")) ){
        webix.message({
            id:"visibleColsMsg",
            type:"debug", 
            text:"Элемент не выбран",
        });
    }
}


let list;
let listSelect;

function findPullLength(listName){
    return Object.keys(listName.data.pull).length;
}

function listActions(type){

    const currList  = 
    type == "available" ? list       : listSelect;

    const otherList = 
    type == "available" ? listSelect : list;

    const btn = $$("visibleColsSubmit");
    
    const selectedItem  = currList.getSelectedItem();
    const selectedId    = currList.getSelectedId  ();

    if (selectedItem){
   
        otherList.add   (selectedItem);
        currList .remove(selectedId);
 
        if (type == "available"){
            const pullLength = findPullLength(otherList);
            if (!pullLength){
                Action.disableItem(btn);
            } else {
                Action.enableItem (btn); 
            }
        } else {
            const pullLength = findPullLength(currList);
    
            if (!pullLength){
                Action.disableItem(btn);
            } else {
                Action.enableItem (btn);
            }
        }

    } else {
        createMsg();
    }
}


function colsPopupSelect(action){
    list                  = $$("visibleList");
    listSelect            = $$("visibleListSelected");

    if ( action == "add"){
        listActions("available");

    } else if ( action == "remove" ){
        listActions("selected");

    }

}

function returnListBtns(){
    const addColsBtn = new Button({

        config   : {
            id       : "addColsBtn",
            hotkey   : "Shift+A",
            icon     : "icon-arrow-right",
            disabled : true,
            click    : function(){
                colsPopupSelect("add");
            },
        },
        titleAttribute : "Добавить выбранные колонки"
       
    }).transparentView();

    const removeColsBtn = new Button({

        config   : {
            id       : "removeColsBtn",
            hotkey   : "Shift+D",
            icon     : "icon-arrow-left",
            disabled : true,
            click    : function(){
                colsPopupSelect("remove");
            },
        },
        titleAttribute : "Убрать выбранные колонки"
       
    }).transparentView();

    const moveBtns = {
        rows:[
            addColsBtn,
            removeColsBtn,
        ]
    };

    return moveBtns;
}

export {
    returnListBtns
};
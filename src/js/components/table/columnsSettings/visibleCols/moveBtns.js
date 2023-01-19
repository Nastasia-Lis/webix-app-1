///////////////////////////////

// Кнопки перемещения колонок вверх/вниз

// Copyright (c) 2022 CA Expert

///////////////////////////////

import { Button }   from "../../../../viewTemplates/buttons.js";

function setBtnSubmitState(state){
    const btnSubmit  = $$("visibleColsSubmit");
    const check      = btnSubmit.isEnabled();

    if (state == "enable" && !(check) ){
        btnSubmit.enable();
    } else if ( state == "disable" && check ){
        btnSubmit.disable();
    }
}

function createMsg(){
    if(!($$("visibleColsMsg")) ){
        webix.message({
            id:"visibleColsMsg",
            type:"debug", 
            text:"Элемент не выбран",
        });
    }
}


function colsMove(action){
    const list        = $$("visibleListSelected");
    const listElement = list.getSelectedId();
    
    if( listElement ){
        if (action == "up"){
            list.moveUp(listElement,1);
            setBtnSubmitState("enable");
        } else if (action == "down"){
            list.moveDown(listElement,1);
            setBtnSubmitState("enable");
        }   
    } else {
        createMsg();
    }
}


function returnMoveBtns(){

    const moveUpBtn = new Button({

        config   : {
            id       : "moveSelctedUp",
            hotkey   : "Shift+U",
            icon     : "icon-arrow-up",
            click   : function(){
                colsMove("up");
            },
        },

        titleAttribute : "Поднять выбраную колонку вверх"
       
    }).transparentView(); 

    const moveDownBtn = new Button({

        config   : {
            id       : "moveSelctedDown",
            hotkey   : "Shift+W",
            icon     : "icon-arrow-down",
            click   : function(){
                colsMove("down");
            },
        },

        titleAttribute : "Опустить выбраную колонку вниз"
       
    }).transparentView(); 

    const moveSelcted =  {
        cols : [
            moveUpBtn,
            moveDownBtn,
            {},
        ]
    };

    return moveSelcted;
}

export {
    returnMoveBtns
};

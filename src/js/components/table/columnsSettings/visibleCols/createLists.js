///////////////////////////////

// Создание list компонентов попапа

// Copyright (c) 2022 CA Expert

///////////////////////////////


import { createEmptyTemplate } from "../../../../viewTemplates/emptyTemplate.js";
import { Action }              from "../../../../blocks/commonFunctions.js";

function generateEmptyTemplate(id, text){

    const layout = {
        css:"list-filter-empty",
        rows:[
            createEmptyTemplate(text, id)
        ]
    };

    return  layout;
}

function selectPrevItem(self, id){
    
    const prevItem =  self.getNextId(id);
    if(prevItem){
        self.select(prevItem);
    }
}

function hideEmptyTemplate(self, id){
    const pullLength = Object.keys(self.data.pull).length;
    if (!pullLength){
        Action.showItem($$(id));
    }
}
function returnAvailableList(){
    const emptyElId = "visibleColsEmptyTempalte";
    const scrollView = [
        {   template    : "Доступные колонки", 
            css         : "list-filter-headline",
            height      : 25, 
            borderless  : true
        },
        generateEmptyTemplate(
            emptyElId,
            "Нет доступных колонок"
        ),

        {
            view      : "list", 
            id        : "visibleList",
            template  : "#label#",
            select    : true,
            css       : "list-filter-borders",
            borderless: true,
            data      : [],
            on        : {
                onAfterAdd:function(){
                    Action.enableItem($$("addColsBtn"));
                    Action.hideItem  ($$(emptyElId));
                },
                onAfterDelete:function(id){
                    hideEmptyTemplate(this, emptyElId);
                    selectPrevItem   (this, id);
                },
            }
        }
        
    ];

    return scrollView;
}


function returnSelectedList(){
    const emptyElId = "visibleColsEmptyTempalteSelected";
    const scrollViewSelected = [
        {   template    : "Выбранные колонки",
            css         : "list-filter-headline",
            height      : 25, 
            borderless  : true,
         
        },
        generateEmptyTemplate(
            emptyElId,
            "Выберите колонки из доступных"
        ),

        {
            view      : "list", 
            id        : "visibleListSelected",
            template  : "#label#",
            css       : "list-filter-borders",
            select    : true,
            borderless: true,
            data      : [],
            on        : {
                onAfterAdd : function(){
                    Action.enableItem($$("removeColsBtn"));
                    Action.hideItem  ($$(emptyElId));
                },
                onAfterDelete : function(id){
                    hideEmptyTemplate(this, emptyElId);
                    selectPrevItem   (this, id);
                },
            
            }
        }

    ];

    return scrollViewSelected;
}

export {
    returnAvailableList,
    returnSelectedList
};
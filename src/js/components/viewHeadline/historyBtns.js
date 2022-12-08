
import { Button }                     from "../../viewTemplates/buttons.js";

function prevBtnClick (){
    history.back();
}

function nextBtnClick (){
    history.forward();
}   

function createHistoryBtns(){

    
    const prevBtn = new Button({
        
        config   : {
            id       : webix.uid(),
            hotkey   : "Ctrl+Shift+P",
            icon     : "icon-arrow-left", 
            click    : function(){
                prevBtnClick();
            },
        },
        titleAttribute : "Вернуться назад"

    
    }).transparentView();

    const nextBtn = new Button({
        
        config   : {
            id       : webix.uid(),
            hotkey   : "Ctrl+Shift+B",
            icon     : "icon-arrow-right", 
            click    : function(){
                nextBtnClick();
            },
        },
        titleAttribute : "Перейти вперёд "

    
    }).transparentView();
   

    return {
        css  : "btn-history",
        cols : [
            prevBtn,
            nextBtn,
        ]
    };
}

 
 
export {
    createHistoryBtns
};
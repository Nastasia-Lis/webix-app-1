import {setFunctionError}           from "./errors.js";
import {saveFavsClick}              from "./favsLink.js";
import {prevBtnClick, nextBtnClick} from "./historyBtns.js";

function setHeadlineBlock ( idTemplate, title=null ){
    let templateTitle;
    try{
        if(title){
            templateTitle = title;
        } else {
            templateTitle = function(){
                const value = $$(idTemplate).getValues();
                if (Object.keys(value).length !==0){
                    return "<div class='no-wrap-headline'>" + value + "</div>";
                } else {
                    return "<div class='no-wrap-headline'> Имя не указано </div>";
                }
            };
        }
    } catch (err){
        setFunctionError(err,"blockHeadline","setHeadlineBlock");
    }

    const headline = {   
        view        : "template",
        id          : idTemplate,
        borderless  : true,
        css         : "webix_block-headline",
        height      : 34,
        template    : templateTitle,
        on:{

        }
    };


    const favsBtn = {
        view    : "button", 
        css     : "webix-transparent-btn",
        type    : "icon",
        icon    : "icon-star",
        hotkey  : "ctrl+shift+l",
        width   : 50,
        click   : function(){
            saveFavsClick();
        },
        on      : {
            onAfterRender: function () {
                this.getInputNode().setAttribute("title","Добавить ссылку в избранное (Ctrl+Shift+L)");
            },
        }
    
        
    };

    const prevBtn = {
        view    : "button", 
        css     : "webix-transparent-btn btn-history",
        type    : "icon",
        icon    : "icon-arrow-left",
        width   : 50,
        hotkey  : "ctrl+shift+p",
        click   : function(){
            prevBtnClick();
        },
        on      : {
            onAfterRender: function () {
                this.getInputNode().setAttribute("title","Вернуться назад (Ctrl+Shift+P)");
            },
        }
    
        
    };
 
    const nextBtn = {
        view    : "button", 
        css     : "webix-transparent-btn btn-history",
        type    : "icon",
        icon    : "icon-arrow-right",
        width   : 50,
        hotkey  : "ctrl+shift+b",
        click   : function(){
            nextBtnClick();
        },
        on      : {
            onAfterRender: function () {
                this.getInputNode().setAttribute("title","Перейти вперёд (Ctrl+Shift+B)");
            },
        }
    
        
    };
 


    const headlineLayout = {
        css : "webix_block-headline",
        cols: [
            headline,
            {},
            {   cols:[
                    prevBtn,
                    nextBtn,
                ]
            },
            favsBtn
        ]
    };

    return headlineLayout;
}

export {
    setHeadlineBlock
};
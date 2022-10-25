import {setFunctionError}           from "./errors.js";
import {saveFavsClick}              from "./favsLink.js";
import {prevBtnClick, nextBtnClick} from "./historyBtns.js";

function setHeadlineBlock (idTemplate, title=null){
    let templateTitle;
    try{
        if(title){
            templateTitle = title;
        } else {
            templateTitle = function(){
                if (Object.keys($$(idTemplate).getValues()).length !==0){
                    return $$(idTemplate).getValues();
                } else {
                    return "Имя не указано";
                }
            };
        }
    } catch (err){
        setFunctionError(err,"blockHeadline","setHeadlineBlock");
    }

    const headline = {   
        view:"template",
        id:idTemplate,
        borderless:true,
        css:"webix_block-headline",
        height:34,
        template:templateTitle,
    };


    const favsBtn = {
        view:"button", 
        css:"webix-transparent-btn",
        type:"icon",
        icon:"icon-star",
        width:50,
        click:function(){
            saveFavsClick();
        },
        on:{
            onAfterRender: function () {
                this.getInputNode().setAttribute("title","Добавить ссылку в избранное");
            },
        }
    
        
    };

    const prevBtn = {
        view:"button", 
        css:"webix-transparent-btn btn-history",
        type:"icon",
        icon:"icon-arrow-left",
        width:50,
        click:function(){
            prevBtnClick();
        },
        on:{
            onAfterRender: function () {
                this.getInputNode().setAttribute("title","Вернуться назад");
            },
        }
    
        
    };
 
    const nextBtn = {
        view:"button", 
        css:"webix-transparent-btn btn-history",
        type:"icon",
        icon:"icon-arrow-right",
        width:50,
        click:function(){
            nextBtnClick();
        },
        on:{
            onAfterRender: function () {
                this.getInputNode().setAttribute("title","Перейти вперёд");
            },
        }
    
        
    };
 


    const headlineLayout = {
        css:"webix_block-headline",
        cols:[
            headline,
            {},
            {cols:[
                prevBtn,
                nextBtn,
            ]},
            favsBtn
        ]
    };

    return headlineLayout;
}

export {
    setHeadlineBlock
};
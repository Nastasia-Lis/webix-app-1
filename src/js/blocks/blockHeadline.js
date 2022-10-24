import {setFunctionError} from "./errors.js";
import {saveFavsClick} from "./favsLink.js";

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

    const headlineLayout = {
        css:"webix_block-headline",cols:[
            headline,
            {},
            favsBtn
        ]
    }

    return headlineLayout;
}

export {
    setHeadlineBlock
};
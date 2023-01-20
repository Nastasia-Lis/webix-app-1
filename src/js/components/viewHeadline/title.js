  
///////////////////////////////

// Название страницы

// Copyright (c) 2022 CA Expert

///////////////////////////////

import { setFunctionError }           from "../../blocks/errors.js";
import { mediator }           from "../../blocks/_mediator.js";
const logNameFile = "viewHeadline => title";

function returnHeadline(idTemplate, templateTitle){
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

    return headline;
}
function returnDiv(title = "Имя не указано"){
    return "<div class='no-wrap-headline'>" + title + "</div>";
}

function setHeadlineBlock ( idTemplate, title ){
    let templateTitle;
    try{
        if(title){
            templateTitle = title;
        } else {
            templateTitle = function(){
                const value      = $$(idTemplate).getValues();
                const valLength  = Object.keys(value).length;
                
                //changeTabName(id)
                if (valLength !== 0){
                   // mediator.tabs.changeTabName(null, value);
                    return returnDiv(title = value);
                } else {
                    return returnDiv();
                }
            };
        }
    } catch (err){
        setFunctionError(err, logNameFile, "setHeadlineBlock");
    } 

    return returnHeadline(idTemplate, templateTitle);
}

export {
    setHeadlineBlock
};
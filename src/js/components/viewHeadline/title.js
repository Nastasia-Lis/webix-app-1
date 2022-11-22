import { setFunctionError }           from "../../blocks/errors.js";

function setHeadlineBlock ( idTemplate, title ){
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

    return headline;
}

export {
    setHeadlineBlock
};
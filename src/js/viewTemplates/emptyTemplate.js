
function createEmptyTemplate(text, id){
    const formEmptyTemplate = {   
        css         : "webix_empty-template",
        template    : text,
        borderless  : true,
        height      : 47
    };

    if (id){
        formEmptyTemplate.id = id;
    }

    return formEmptyTemplate;
     
}

export {
    createEmptyTemplate
};
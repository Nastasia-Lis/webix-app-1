  
///////////////////////////////

// Шаблон загрузки

// Copyright (c) 2022 CA Expert

///////////////////////////////


function createOverlayTemplate(id, text = "Загрузка...", hidden = false){

    const template = {
        view    : "align", 
        hidden  :  hidden,
        align   : "middle,center",
        body    : {  
            borderless : true, 
            template   : text, 
            width      : 100,
            height     : 50, 
        },
        css     : "global_loadTemplate"

    };
 

    if (id){
        template.id = id;
    }

    return template;
     
}

export {
    createOverlayTemplate
};
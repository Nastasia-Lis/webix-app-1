function createTemplateCounter(idEl, text){
    const view = {   
        view    : "template",
        id      : idEl,
        css     : "webix_style-template-count",
        height  : 30,
        template:function () {
            const values = $$(idEl).getValues();
            const keys   = Object.keys(values);
            if (keys.length !==0){
                
                return "<div style='color:#999898;'>" + 
                        text + ": " + values + 
                        " </div>";
            } else {
                return "";
            }
        }
    };

    return view;
}

export {
    createTemplateCounter
};
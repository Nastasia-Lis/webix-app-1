function headerDefState(){
    const headerChilds = $$("header").getChildViews();

    headerChilds.forEach(function(el){
        if (el.config.id.includes("search")){
            el.show();
        }
    });
}


export {
    headerDefState
};
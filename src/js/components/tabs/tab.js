function createTabView(tabName){
    const name = {
        template   : tabName, 
        width      : 169, 
        borderless : true,
        css        : "tab-name"
    };

    const btn = {
        view        : "button", 
        type        : "icon", 
        css         : "webix-transparent-btn",
        width       : 30,
        inputHeight : 30,
        icon        : "wxi-close"
    };

    const tab = {    
        id   : "tab",
        width: 200,
        css  : "webix-tab-item",
        cols : [
            name,
            btn

        ]   ,
        on:{
            onItemClick:function(){
               // console.log(111)
            }
            
        }
    };

    return tab;
}

export{
    createTabView
};
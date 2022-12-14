import { Button }  from "../../viewTemplates/buttons.js";


function setNewTab(){

}


function createAddBtn(){
    const visibleCols = new Button({
    
        config   : {
            id       : "addTabBtn",
           // hotkey   : "Ctrl+Shift+A",
            icon     : "icon-plus", //wxi-plus
            click    : function(){
                setNewTab();
            },
        },
        titleAttribute : "Показать/скрыть колонки"
    
       
    }).transparentView();

    return visibleCols;
}


export {
    setNewTab,
    createAddBtn
};
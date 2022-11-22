import { checkFonts }               from "../../blocks/checkFonts.js";
import { setFunctionError }         from "../../blocks/errors.js";
import { Action }                   from "../../blocks/commonFunctions.js";


function setSearchInputState(visible = false){
    const headerChilds = $$("header").getChildViews();

    headerChilds.forEach(function(el){
        if (el.config.id.includes("search" )      || 
            el.config.id.includes("log-btn")      || 
            el.config.id.includes("context-menu") ){
            
            if(visible){
                el.show();
            } else {
                el.hide();
            }
          
        }
    });
}


function collapseClick (){
    const tree      = $$("tree");
    const resizer   = $$("sideMenuResizer");

    function showTree(){
        try {
            tree.show();
            if(window.innerWidth >= 800){
                Action.showItem(resizer);
            } 
        } catch (err){
            setFunctionError(err,"header","showTree");

        }
    }

    try {

        if (window.innerWidth > 850 ){
            if (tree.isVisible()){
                tree.hide();
                Action.hideItem(resizer);

            } else {
                showTree(); 
 
            }
        } else {
            if (tree.isVisible()){
                tree.hide();
                Action.hideItem(resizer);

                setSearchInputState(true);

            } else {
                showTree();

                tree.config.width = window.innerWidth;
                tree.resize();
        
                setSearchInputState();
            }
        }
        this.refresh();
       
    } catch (err){
        setFunctionError(err,"header","collapseClick");

    }
}


const collapseBtn = {   
    view:"button",
    type:"icon",
    id:"collapseBtn",
    icon:"icon-bars",
    css:"webix_collapse",
    title:"текст",
    height:42, 
    width:40,
    click:collapseClick,
    on: {
        onAfterRender: function () {
            this.getInputNode().setAttribute("title","Видимость бокового меню");
            checkFonts();
        }
    }    
};



export {
    collapseBtn
};

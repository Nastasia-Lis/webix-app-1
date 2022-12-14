import { checkFonts }               from "../../blocks/checkFonts.js";
import { setFunctionError }         from "../../blocks/errors.js";
import { Action }                   from "../../blocks/commonFunctions.js";

const logNameFile = "header => collapseBtn";


function isIdIncludes(el){
    if (el.config.id.includes("search" )      || 
        el.config.id.includes("log-btn")      || 
        el.config.id.includes("context-menu") )
    {
        return true;
    }
}

function setSearchInputState(visible = false){
    const headerChilds = $$("header").getChildViews();

    headerChilds.forEach(function(el){
        if (isIdIncludes(el)){
            
            if(visible){
                el.show();
            } else {
                el.hide();
            }
            
        }
    });
}


function collapseClick (){
    const treeContainer = $$("sidebarContainer");
    const tree          = $$("tree");
    const resizer       = $$("sideMenuResizer");

    function showTree(){
        Action.showItem(treeContainer);
        Action.showItem(tree);

        if(window.innerWidth >= 600){
            Action.showItem(resizer);
        } 
     
    }

    function hideTree(){
        Action.hideItem(treeContainer);
        Action.hideItem(tree);
        Action.hideItem(resizer);
        
    }

    try {

        if (window.innerWidth > 850 ){
            if (tree.isVisible()){
                hideTree()

            } else {
                showTree(); 
 
            }
        } else {
            if (tree.isVisible()){
                hideTree();
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
        setFunctionError(
            err,
            logNameFile,
            "collapseClick"
        );

    }
}


const collapseBtn = {   
    view    : "button",
    type    : "icon",
    id      : "collapseBtn",
    icon    : "icon-bars",
    css     : "webix_collapse",
    title   : "текст",
    height  : 42, 
    width   : 40,
    click   : collapseClick,
    on      : {
        onAfterRender: function () {
            this.getInputNode()
            .setAttribute("title", "Видимость бокового меню");
            checkFonts();
        }
    }    
};



export {
    collapseBtn
};

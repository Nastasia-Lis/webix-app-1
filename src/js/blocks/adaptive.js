import { setFunctionError } from "./errors.js";
import { Action }           from "./commonFunctions.js";


function resizeSidebar(){
    const tree = $$("tree");

    function resizeTree(){
        try{
            if (tree){
                tree.config.width = 250;
                tree.resize();
            }
        } catch (err){
            setFunctionError(
                err, 
                "adaptive", 
                "resizeSidebar => resizeTree"
            );
        }
    } 

    
    if (window.innerWidth < 850){
        Action.hideItem(tree);
    }

    if (!tree.isVisible()  && 
        window.innerWidth <= 800 ){
        Action.hideItem($$("sideMenuResizer"));
    }

    if (window.innerWidth > 850 && $$("tree")){
        resizeTree();
    }
    
}

function setMinView(element, container, backBtn){
    if (element.isVisible()){
        element.config.width = window.innerWidth - 45;
        element.resize();
        Action.hideItem($$("tree"));
        Action.hideItem(container);
        Action.showItem(backBtn);
    }
}

function setMaxWidth(tools, сontainer, backBtn){
    if (tools.isVisible()          && 
        tools.config.width !== 350 ){
        tools.config.width  = 350;
        tools.resize();
        Action.showItem(сontainer);
        Action.hideItem(backBtn);
    }
}


function resizeForms(){

    const tools       = $$("formsTools");    
    const сontainer   = $$("formsContainer");
    const formResizer = $$("formsTools-resizer");
    const backBtn     = $$("table-backFormsBtnFilter");

    if (window.innerWidth < 850){
        setMinView(tools,сontainer, backBtn);
        Action.hideItem(formResizer);
    }


    if (window.innerWidth > 850){
        setMaxWidth(tools, сontainer, backBtn);
        Action.showItem(formResizer);
    }

  
}


function resizeContext(){
    const dashContainer = $$("dashboardInfoContainer");
    const contextWindow = $$("dashboardContext");
    
    if (window.innerWidth < 850){
        setMinView(contextWindow, dashContainer);
    }


    if (window.innerWidth > 850){
        setMaxWidth(contextWindow, dashContainer);
    }
}

function resizeTools(){
    const dashTool      = $$("dashboardTool");
    const dashContainer = $$("dashboardInfoContainer");
    const backBtn       = $$("dash-backDashBtn");

    
    if (window.innerWidth < 850){
        setMinView(dashTool, dashContainer, backBtn);
    }


    if (window.innerWidth > 850){
        setMaxWidth(dashTool, dashContainer, backBtn);
    }
            
}



function resizeTableEditForm(){
    const container = $$("tableContainer");
    const editForm  = $$("table-editForm");
    const backBtn   = $$("table-backTableBtn");
    const tree      = $$("tree");

    
    if ($$("container").$width < 850 && editForm.isVisible()){
        Action.hideItem(tree);
    }


    if (window.innerWidth < 850){
        setMinView(editForm, container, backBtn);
    }

    if (window.innerWidth > 850){
        setMaxWidth(editForm, container, backBtn);
    }

}

function resizeTableFilterForm (){

    const filterForm = $$("filterTableBarContainer");
    
    const container  = $$("tableContainer");
    const backBtn    = $$("table-backTableBtnFilter");
    const tree       = $$("tree");
 
    if (window.innerWidth < 850){
        setMinView(filterForm, container, backBtn);
    }

    if ($$("container").$width < 850 && filterForm.isVisible()){
        Action.hideItem(tree);
    }


    if (window.innerWidth > 850){
        setMaxWidth(filterForm, container, backBtn);
    }

}

function setSearchInputState(){
    const headerChilds = $$("header").getChildViews();

    headerChilds.forEach(function(el){
        if (el.config.id.includes("search")){
            el.show();
        }
    });
}


function resizeAdaptive (){

    window.addEventListener('resize', function() {
  
        async function getActiveView (){  

            function setAdaptiveLogic(visibleEl){
                if (visibleEl == "forms"){
                    resizeForms();

                } else if (visibleEl == "dashboards"){
                    resizeTools();  
                    resizeContext();
                } else if (visibleEl == "tables"){
                    resizeTableEditForm();
                    resizeTableFilterForm ();

                } else if (visibleEl == "userprefs"){
                    //none

                } else if (visibleEl == "user_auth"){
                    //none

                }
            }

            function initLogic(){

                const elements = [
                    "forms", 
                    "dashboards", 
                    "tables", 
                    "userprefs", 
                    "user_auth"
                ];

                elements.forEach(function(el,i){
                    const elem = $$(el);
                    if(elem && elem.isVisible()){
                        setAdaptiveLogic(el);
                    }
                });
                    
                
            }

            initLogic();
        
        }
    
        getActiveView ();
        resizeSidebar();

        if(window.innerWidth > 850){
            setSearchInputState();
        }

    }, true);
}



function adaptivePoints (){

    const tree = $$("tree");

    function hideTree(){
        if (window.innerWidth < 850 && tree){
            tree.hide();
        }
    }

    function addTreeEvent(){
        if (window.innerWidth < 1200 ){
            const editContainer = $$("editTableBarContainer");

            tree.attachEvent("onAfterLoad", function(){
                Action.hideItem(editContainer);
            });
 
            Action.hideItem(editContainer);

        }
    }


    hideTree();
    addTreeEvent();


}
export {
    resizeAdaptive,
    adaptivePoints
};
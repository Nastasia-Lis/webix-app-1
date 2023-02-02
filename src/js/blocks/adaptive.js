///////////////////////////////
//
// Адаптив для сайдбара, таблиц, дашбордов, форм
//
// Copyright (c) 2022 CA Expert
//
///////////////////////////////

import { setFunctionError } from "./errors.js";
import { Action }           from "./commonFunctions.js";

const minWidth = 850;

function resizeSidebar(){
    const tree          = $$("tree");
    const resizer       = $$("sideMenuResizer");
    const treeContainer = $$("sidebarContainer");
    const treeWidth     = 250;

    function resizeTree(){
        try{
            if (tree){
                tree.config.width = treeWidth;
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


    
    if (window.innerWidth < minWidth){
        Action.hideItem(tree   );
        Action.hideItem(resizer);
        Action.hideItem(treeContainer);
        tree.config.adaptiveState = true;

    } else if (tree.config.adaptiveState){
        Action.showItem(tree   );
        Action.showItem(resizer);
        Action.showItem(treeContainer);
        tree.config.adaptiveState = false;

    }

    if (window.innerWidth > minWidth && $$("tree")){
        resizeTree();
  
    }

 
}

function setMinView(element, container, backBtn){
    if (element.isVisible()){
        element.config.width = window.innerWidth - 45;
        element.resize();
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

    if (window.innerWidth < minWidth){
        setMinView(tools,сontainer, backBtn);
        Action.hideItem(formResizer);
    }


    if (window.innerWidth > minWidth){
        setMaxWidth(tools, сontainer, backBtn);
        Action.showItem(formResizer);
    }

  
}


function resizeContext(){
    const dashContainer = $$("dashboardInfoContainer");
    const contextWindow = $$("dashboardContext");
    
    if (window.innerWidth < minWidth){
        setMinView(contextWindow, dashContainer);
    }


    if (window.innerWidth > minWidth){
        setMaxWidth(contextWindow, dashContainer);
    }
}

function resizeTools(){
    const dashTool      = $$("dashboardTool");
    const dashContainer = $$("dashboardInfoContainer");
    const backBtn       = $$("dash-backDashBtn");

    
    if (window.innerWidth < minWidth){
        setMinView(dashTool, dashContainer, backBtn);
    }


    if (window.innerWidth > minWidth){
        setMaxWidth(dashTool, dashContainer, backBtn);
    }
            
}



function resizeTableEditForm(){
    const container = $$("tableContainer");
    const editForm  = $$("table-editForm");
    const backBtn   = $$("table-backTableBtn");
    const tree      = $$("tree");

    
    if ($$("container").$width < minWidth && editForm.isVisible()){
        Action.hideItem(tree);
    }


    if (window.innerWidth < minWidth){
        setMinView(editForm, container, backBtn);
    }

    if (window.innerWidth > minWidth){
        setMaxWidth(editForm, container, backBtn);
    }

}

function resizeTableFilterForm (){

    const filterForm = $$("filterTableBarContainer");
    
    const container  = $$("tableContainer");
    const backBtn    = $$("table-backTableBtnFilter");
    const tree       = $$("tree");
 
    if (window.innerWidth < minWidth){
        setMinView(filterForm, container, backBtn);
    }

    if ($$("container").$width < minWidth && filterForm.isVisible()){
        Action.hideItem(tree);
    }


    if (window.innerWidth > minWidth){
        setMaxWidth(filterForm, container, backBtn);
    }

}

function setSearchInputState(){
    const headerChilds = $$("header").getChildViews();

    
    headerChilds.forEach(function(el){
        el.show();
  
    });


   
}

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
function resizeAdaptive (){

    window.addEventListener('resize', function() {
  
        async function getActiveView (){  
            initLogic();
        }
    
        getActiveView ();
        resizeSidebar();
       

        if(window.innerWidth > minWidth){
            setSearchInputState();
        }

    }, true);
}



function adaptivePoints (){

    const tree = $$("tree");

    function hideTree(){
        if (window.innerWidth < minWidth && tree){
          //  tree.hide();
        }
    }

    function addTreeEvent(){
        const minWidthEditProp = 1200;
        if (window.innerWidth < minWidthEditProp ){
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
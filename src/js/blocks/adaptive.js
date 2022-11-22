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
            setFunctionError(err, "adaptive", "resizeSidebar => resizeTree");
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

function resizeForms(){

    const tools       = $$("formsTools");    
    const сontainer   = $$("formsContainer");
    const formResizer = $$("formsTools-resizer");
    const backBtn     = $$("table-backFormsBtnFilter");
  
    function createFormAdaptive(){
        
        if (tools.isVisible()){
            tools.config.width = window.innerWidth - 45;
            tools.resize();

            Action.hideItem(сontainer);
            Action.hideItem(formResizer);
            Action.hideItem($$("tree"));
            Action.showItem(backBtn);
          
        }
    }

    function createFormMain(){
        if (tools.isVisible()          && 
            tools.config.width !== 350 ){
            tools.config.width  = 350;
            tools.resize();
            Action.showItem(formResizer);
            Action.showItem(сontainer);
            Action.hideItem(backBtn);
        }
    }
 
    if (window.innerWidth < 850){
        createFormAdaptive();
    }


    if (window.innerWidth > 850){
        createFormMain();
    }

  
}



function resizeDashboards(){
    const dashTool      = $$("dashboardTool");
    const dashContainer = $$("dashboardInfoContainer");
    const tree          = $$("tree");
    const backBtn       = $$("dash-backDashBtn");
   
    function createDashAdaptive(){
        
        if (dashTool.isVisible()){
            dashTool.config.width = window.innerWidth-45;
            dashTool.resize();

            Action.hideItem(dashContainer);
            Action.showItem(tree);
            Action.showItem(backBtn);
        }
    }


    function createDashMain(){
        if (dashTool.isVisible()          && 
            dashTool.config.width !== 350 ){

            dashTool.config.width = 350;
            dashTool.resize();

            const tools = $$("dashboardTool");

            tools.config.width = 350;
            tools.resize();

            Action.showItem(dashContainer);
            Action.hideItem(backBtn);
        }
     
    }
    
    if (window.innerWidth < 850){
        createDashAdaptive();
    }


    if (window.innerWidth > 850){
   
        createDashMain();
    }
            
}



function resizeTableEditForm(){
    const container = $$("tableContainer");
    const editForm  = $$("table-editForm");
    const backBtn   = $$("table-backTableBtn");
    const tree      = $$("tree");

    function tableAdaptiveView(){

        if (editForm.isVisible()){
            editForm.config.width = window.innerWidth-45;
            editForm.resize();

            Action.hideItem(container);
            Action.hideItem(tree);
            Action.showItem(backBtn);
        }
    }

    function tableMainView(){

        if (editForm.isVisible()          && 
            editForm.config.width !== 350 ){

            editForm.config.width = 350;
            editForm.resize();

            Action.showItem(container);
            Action.hideItem(backBtn);
        }

    }

    
    if ($$("container").$width < 850 && editForm.isVisible()){
        Action.hideItem(tree);
    }


    if (window.innerWidth < 850){
        tableAdaptiveView();
    }

    if (window.innerWidth > 850){
        tableMainView();
    }

}

function resizeTableFilterForm (){

    const filterForm = $$("filterTableBarContainer");
    
    const container  = $$("tableContainer");
    const backBtn    = $$("table-backTableBtnFilter");
    const tree       = $$("tree");

    function filterAdaptive(){
        if (filterForm.isVisible()){
            filterForm.config.width = window.innerWidth-45;
            filterForm.resize();

            Action.hideItem(container);
            Action.hideItem(tree);
            Action.showItem(backBtn);

        }
    }

    function filterMain(){
        if (filterForm.isVisible()          && 
            filterForm.config.width !== 350 ){

        filterForm.config.width = 350;
        filterForm.resize();

        Action.showItem(container);
        Action.hideItem(backBtn);
    }
    }
   
    if (window.innerWidth < 850){
        filterAdaptive();
    }

    if ($$("container").$width < 850 && filterForm.isVisible()){
        Action.hideItem(tree);
    }


    if (window.innerWidth > 850){
        filterMain();
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

    window.addEventListener('resize', function(event) {
  
        async function getActiveView (){  

            function setAdaptiveLogic(visibleEl){
                if (visibleEl == "forms"){
                    resizeForms();

                } else if (visibleEl == "dashboards"){
                    resizeDashboards();

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
import {setFunctionError} from "./errors.js";
import  {STORAGE,getData} from "./globalStorage.js";

import  {hideElem,showElem} from "./commonFunctions.js";


function resizeSidebar(){
    const tree = $$("tree");

    function resizeTree(){
        try{
            if (tree){
                tree.config.width = 250;
                tree.resize();
            }
        } catch (err){
            setFunctionError(err,"adaptive","resizeSidebar => resizeTree");
        }
    } 

    
    if (window.innerWidth < 850){
        hideElem(tree);
    }

    if (!tree.isVisible()  && 
        window.innerWidth <= 800 ){
        hideElem($$("sideMenuResizer"));
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

            hideElem (сontainer  );
            hideElem (formResizer);
            hideElem (tree       );
            showElem (backBtn    );
        }
    }

    function createFormMain(){
        if (tools.isVisible()          && 
        tools.config.width !== 350 ){

            tools.config.width = 350;
            tools.resize();
            showElem (formResizer);
            showElem (сontainer  );
            hideElem (backBtn    );
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
    const dashTool      = $$("dashboard-tool-main");
    const dashContainer = $$("dashboardInfoContainer");
    const tree          = $$("tree");
    const backBtn       = $$("dash-backDashBtn");
   
    function createDashAdaptive(){
        
        if (dashTool.isVisible()){
            dashTool.config.width = window.innerWidth-45;
            dashTool.resize();

            hideElem (dashContainer);
            hideElem (tree         );
            showElem (backBtn      );
        }
    }


    function createDashMain(){
        if (dashTool.isVisible()          && 
        dashTool.config.width !== 350 ){

            dashTool.config.width = 350;
            dashTool.resize();

            showElem (dashContainer);
            hideElem (backBtn      );
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

            hideElem (container);
            hideElem (tree);
            showElem (backBtn);
        }
    }

    function tableMainView(){

        if (editForm.isVisible()          && 
            editForm.config.width !== 350 ){

            editForm.config.width = 350;
            editForm.resize();

            showElem (container);
            hideElem (backBtn);
        }

    }

    
    if ($$("container").$width < 850 && editForm.isVisible()){
        hideElem (tree);
    }


    if (window.innerWidth < 850){
        tableAdaptiveView();
    }

    if (window.innerWidth > 850){
        tableMainView();
    }

}

function resizeTableFilterForm (){
    const filterForm = $$("filterTableForm");
    const container  = $$("tableContainer");
    const backBtn    = $$("table-backTableBtnFilter");
    const tree       = $$("tree");

    function filterAdaptive(){
        if (filterForm.isVisible()){
            filterForm.config.width = window.innerWidth-45;
            filterForm.resize();

            hideElem (container);
            hideElem (tree     );
            showElem (backBtn  );

        }
    }

    function filterMain(){
        if (filterForm.isVisible()          && 
            filterForm.config.width !== 350 ){

        filterForm.config.width = 350;
        filterForm.resize();

        showElem (container);
        hideElem (backBtn  );
    }
    }
   
    if (window.innerWidth < 850){
        filterAdaptive();
    }

    if ($$("container").$width < 850 && filterForm.isVisible()){
        hideElem (tree);
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

            if (!STORAGE.mmenu){
                await getData("mmenu"); 
            }

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
                if (STORAGE.mmenu){
                    const menuData = STORAGE.mmenu.mmenu;
                    menuData.forEach(function(el,i){
                        if($$(el.name) && $$(el.name).isVisible()){
                            let visibleEl = el.name;
                            setAdaptiveLogic(visibleEl);
                        }
                    });
                    
                }
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
                hideElem(editContainer);
            });
 
            hideElem(editContainer);

        }
    }


    hideTree();
    addTreeEvent();


}
export {
    resizeAdaptive,
    adaptivePoints
};
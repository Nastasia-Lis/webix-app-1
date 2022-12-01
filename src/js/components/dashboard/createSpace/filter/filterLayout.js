import { setFunctionError }               from "../../../../blocks/errors.js";
import { Action }                         from '../../../../blocks/commonFunctions.js';
import { Button }                         from '../../../../viewTemplates/buttons.js';
const logNameFile = "dashboard => createSpace => dynamicElements => filterLayout";



function backBtnClick (){
    Action.hideItem ($$( "dashboardTool"));
    Action.showItem ($$( "dashboardInfoContainer"));
}


function createMainView(inputsArray){

    const headline = {  
        template    : "Фильтр",
        height      : 30, 
        css         : "webix_dash-filter-headline",
        borderless  : true
    };

    const filterBackBtn = new Button({
    
        config   : {
            id       : "dash-backDashBtn",
            hotkey   : "Esc",
            hidden   : true,  
            icon     : "icon-arrow-right", 
            click   : function(){
                backBtnClick();
            },
        },
        titleAttribute : "Вернуться к дашбордам"
    
       
    }).minView();
    
 
    const mainView = {
        id      : "dashboard-tool-main",
        padding : 20,
        hidden  : true,
        minWidth: 250,
        rows    : [
            {   id  : "dashboardToolHeadContainer",
                cols: [
                    headline,
                    filterBackBtn,
                ]
            },
            
            { rows : inputsArray }
        ], 
    };

    try{
      
        $$("dashboardTool").addView( mainView );
    } catch (err){  
        setFunctionError(err, logNameFile, "createMainView");
    }
}


function filterBtnClick (){
    const dashTool      = $$("dashboard-tool-main");
    const container     = $$("dashboardContainer" );
    const tree          = $$("tree");
    const backBtn       = $$("dash-backDashBtn");
    const tools         = $$("dashboardTool");
    const infoContainer = $$("dashboardInfoContainer");

    function filterMinAdaptive(){

        Action.hideItem (tree);
        Action.hideItem (infoContainer);
        Action.showItem (tools);
        Action.showItem (backBtn);

        tools.config.width = window.innerWidth - 45;
        tools.resize();
    }

    function filterMaxAdaptive(){
        Action.removeItem($$("dashContextLayout"));
        Action.hideItem  ($$("dashboardContext" ));
        if (dashTool.isVisible()){
            Action.hideItem (tools);

        } else {
            Action.showItem (tools);
            Action.showItem (dashTool);
        }
    }

    filterMaxAdaptive();


    if (container.$width < 850){
        Action.hideItem(tree);

        if (container.$width  < 850 ){
            filterMinAdaptive();
        }

    } else {
        Action.hideItem(backBtn);      
    }


}


function addViewToContainer(filterBtn){
 
    const container     = $$("dash-template").getParentView();
    const containerView = $$(container.config.id);
  
    if (!$$("dashFilterBtn")){
      
        containerView.addView(
            {   id  : "dashboard-tool-btn",
                cols: [
                    filterBtn
                ]
            }
        ,2);
    }
}


function createFilterBtn(){

    const filterBtn = new Button({
        config   : {
            id       : "dashFilterBtn",
            hotkey   : "Ctrl+Shift+F",
            icon     : "icon-filter", 
            click   : function(){
                filterBtnClick();
            },
        },
        titleAttribute : "Показать/скрыть фильтры"
    
       
    }).transparentView();

  
    addViewToContainer(filterBtn);
  
}



function createFilterLayout(inputsArray){

    createMainView (inputsArray);
    createFilterBtn();
}

export {
    createFilterLayout
};
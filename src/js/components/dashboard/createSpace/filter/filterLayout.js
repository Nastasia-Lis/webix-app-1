import { setFunctionError }               from "../../../../blocks/errors.js";
import { Action }                         from '../../../../blocks/commonFunctions.js';

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

    
    const filterBackBtn = { 
        view    : "button", 
        id      : "dash-backDashBtn",
        type    : "icon",
        icon    : "icon-arrow-right",
        value   : "Вернуться к дашбордам",
        hidden  : true,  
        height  : 15,
        hotkey  : "esc",
        minWidth: 50,
        width   : 55,
        
        click:function(){
            backBtnClick();
        },
        
        on: {
            onAfterRender: function () {
                this.getInputNode().setAttribute("title","Вернуться к дашбордам");
            }
        } 
    };
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
        const tool = $$("dashboardTool");
        if (tool.config.width !== 350){
            tool.config.width  = 350;
            tool.resize();
        }

        
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

    const filterBtn = {
        view    : "button", 
        id      : "dashFilterBtn", 
        css     : "webix-transparent-btn",
        type    : "icon",
        icon    : "icon-filter",
        width   : 50,
        click   : function() {
            filterBtnClick();
        },
        on      : {
            onAfterRender: function () {
                this.getInputNode().setAttribute("title","Показать/скрыть фильтры");
            },
        }
    
        
    };
  
    addViewToContainer(filterBtn);
  
}



function createFilterLayout(inputsArray){

    createMainView (inputsArray);
    createFilterBtn();
}

export {
    createFilterLayout
};
import { LoadServerData, GetFields }  from "../../blocks/globalStorage.js";
import { setFunctionError }           from "../../blocks/errors.js";
import { setStateFilterBtn }          from "./common.js";
import { Action }                     from "../../blocks/commonFunctions.js";
import { selectElem }                 from "./selectVisualElem.js";

const logNameFile = "treeSidebar => onBeforeSelect";

function onBeforeSelectFunc(data){


    const tree          = $$("tree");
    const selectItem    = tree.getItem(data);
    const filterForm    = $$("filterTableForm");
    const inputs        = $$("inputsFilter");

    if (data.includes("q-none_data-tree_") || 
        data.includes("q-load_data-tree_") ||
        selectItem.webix_kids              ){
        return false;
    }
    
    function setFilterDefaultState(){
        try{
            if (filterForm && filterForm.isVisible()){

                filterForm.hide();
                setStateFilterBtn();
                Action.showItem($$("table-editForm"));
            
            }

            if (inputs){
                Action.removeItem(inputs);
            }
        } catch (err){
            setFunctionError(err,logNameFile,"setFilterDefaultState");
        }
    }

    function setBtnCssState(){
        const btnClass          = document.querySelector(".webix_btn-filter");
        const primaryBtnClass   = "webix-transparent-btn--primary";
        const secondaryBtnClass = "webix-transparent-btn";

        if ( btnClass && btnClass.classList.contains(primaryBtnClass) ){

            btnClass.classList.add   (secondaryBtnClass);
            btnClass.classList.remove(primaryBtnClass);
        }
      
    }
    function setFormToolsDefaultState(){
        const formsTools     = $$("formsTools");
        const formsContainer = $$("formsContainer");
  
        Action.hideItem(formsTools);
        Action.showItem(formsContainer);


    }

    function adaptiveViewEditTable(){

        const container = $$("tableContainer");
        const tables    = $$("tables");
        Action.hideItem($$("editTableBarContainer"));
        Action.hideItem($$("table-backTableBtn"));
        Action.hideItem($$("table-editForm"));
        Action.showItem($$("tableContainer"));

        if(tables.$width - container.$width > 9){
            $$("tableContainer").resize();
        }

    }

    function adaptiveViewDashFilter(){
        const dashTool      = $$("dashboardTool");
        const dashContainer = $$("dashboardInfoContainer");

        Action.hideItem(dashTool);
        Action.showItem(dashContainer);
    }

    function disableVisibleBtn(){
        const viewBtn =  $$("table-view-visibleCols");
        const btn     =  $$("table-visibleCols");
        
        function disableBtn(el){
            if (el){
                el.disable();
            }
        }

        if ( viewBtn.isVisible() ){
            disableBtn(viewBtn);
        } else if ( btn.isVisible() ){
            disableBtn(btn);
        }
      
    }

    setBtnCssState();
    setFilterDefaultState();
    Action.hideItem($$("editTableFormProperty"));
 
    setFormToolsDefaultState();

    adaptiveViewDashFilter();

    adaptiveViewEditTable();

    disableVisibleBtn();

    async function getSingleTreeItem() {

        await LoadServerData.content("fields");

        const keys   = GetFields.keys;
    
        if (keys){
            selectElem(data);
        }   
    }
    getSingleTreeItem() ;

    
}

export{
    onBeforeSelectFunc
};
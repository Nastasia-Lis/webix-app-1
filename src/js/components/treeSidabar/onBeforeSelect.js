//import {getInfoTable,getInfoDashboard} from "../../blocks/content.js";
import {getInfoTable}                               from "../../blocks/getContent/getInfoTable.js";
import {getInfoDashboard}                           from "../../blocks/getContent/getInfoDashboard.js";

import {STORAGE,getData}                            from "../../blocks/globalStorage.js";

import {setFunctionError}                           from "../../blocks/errors.js";
import {setStateFilterBtn}                          from "./common.js";
import {hideElem,showElem,removeElem}               from "../../blocks/commonFunctions.js";


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
            
                showElem ($$("table-editForm"));
            
            }

            if (inputs){
                removeElem (inputs);
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
  
        hideElem (formsTools);
        showElem (formsContainer);

    }

    function adaptiveViewEditTable(){

        const container = $$("tableContainer");
        const tables    = $$("tables");
        
        hideElem  ($$("editTableBarContainer"));
        hideElem  ($$("table-backTableBtn"));
        hideElem  ($$("table-editForm"));
        showElem  ($$("tableContainer"));

        if(tables.$width - container.$width > 9){
           // $$("flexlayoutTable").config.width = tables.$width - 9;
            $$("tableContainer").resize();
            //tables.resize();
        }

    }

    function adaptiveViewDashFilter(){
        const dashTool      = $$("dashboard-tool-main");
        const dashContainer = $$("dashboardInfoContainer");

        hideElem (dashTool);
        showElem (dashContainer);
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

    hideElem   ($$("editTableFormProperty"));

    setFormToolsDefaultState();

    adaptiveViewDashFilter();

    adaptiveViewEditTable();

    disableVisibleBtn();

    async function getSingleTreeItem() {

        if (!STORAGE.fields){
            await getData("fields"); 
        }
      
        const content   = STORAGE.fields.content;
        const obj       = Object.keys(content); 

    
        function generateItem (){
            try{
                obj.forEach(function(el) {
                    if (el == data){ 
                        hideElem ($$("webix__none-content"));
                        removeElem ($$("webix__null-content"));

                        if (content[el].type == "dbtable"){
                            showElem ($$("tables"));
                            getInfoTable ("table", data);
                            
                        } else if (content[el].type == "tform"){
                            showElem ($$("forms"));
                            getInfoTable ("table-view", data);

                        } else if (content[el].type == "dashboard"){
                            showElem ($$("dashboards"));
                            getInfoDashboard(data);
                            
                        }
    
                    }
                });
            } catch (err){
                setFunctionError(err,logNameFile,"generateItem");
            }
        }

        generateItem ();
        
    }
    getSingleTreeItem() ;

    
}

export{
    onBeforeSelectFunc
};
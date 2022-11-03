import {setFunctionError}                           from "../../blocks/errors.js"; 
//import {getInfoTable,getInfoDashboard}              from "../../blocks/content.js";

import {getInfoTable}                               from "../../blocks/getContent/getInfoTable.js";
import {getInfoDashboard}                           from "../../blocks/getContent/getInfoDashboard.js";
 
import {defaultStateForm}                           from "../../blocks/tableEditForm/states.js";

import {hideElem,showElem,disableElem,removeElem}   from "../../blocks/commonFunctions.js";

import {STORAGE,getData}                            from "../../blocks/globalStorage.js";

import {setStateFilterBtn}                          from "./common.js";


const logNameFile = "treeSidebar => onSelectChange";

function onSelectChangeFunc(ids){
    const tree          = $$("tree");
    const treeItemId    = tree.getSelectedItem().id;
    const getItemParent = tree.getParentId(treeItemId);
    const treeArray     = tree.data.order;
    let parentsArray    = [];

    function setWidthEditForm(){
        try{
            const editForm = $$("table-editForm");
      
            if (editForm && editForm.config.width < 320){
                editForm.config.width = 320;
                editForm.refresh();
            }
        } catch (err){
            setFunctionError(err,logNameFile,"setWidthEditForm");
        }
    }

    function hideTreeTempl(){
        try{
            let elem = $$("treeTempl");
            if(elem && !($$(ids)) ){
                elem.hide();
            }
        } catch (err){
            setFunctionError(err,logNameFile,"hideTreeTempl");
        }
    }


    function getTreeParents(){
        let parents = [];
        try{
            treeArray.forEach(function(el,i){
                if (tree.getParentId(el) == 0){
                    parents.push(el);
                }
            });
        } catch (err){
            setFunctionError(err,logNameFile,"getTreeParents");
        }
        return parents;
    }

    function hideNoneContent(){
        try{
            if (ids[0] && getItemParent!==0){
                hideElem ($$("webix__none-content"));
            }
        } catch (err){
            setFunctionError(err,logNameFile,"hideNoneContent");
        }
    }
 
    function setTableName (id){
        try{
           
            const tableHeadline = $$("table-templateHeadline");
            const tableViewHeadline = $$("table-view-templateHeadline");
       
            if (tableHeadline){
                STORAGE.tableNames.forEach(function(el,i){
                    if (el.id == id){
                        tableHeadline.setValues(el.name);
                    }
                });
            } 
            
            if (tableViewHeadline){
                STORAGE.tableNames.forEach(function(el,i){
                    if (el.id == id){
                        tableViewHeadline.setValues(el.name);
                    }
                    
                });
            }
        } catch (err){
            setFunctionError(err,logNameFile,"setTableName");
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
    removeElem  ($$("propertyRefbtnsContainer"));
    hideElem    ($$("tablePropBtnsSpace"));
    hideElem    ($$("editTableFormProperty"));
    
    setSearchInputState();
    
    hideElem    ($$("filterTableBarContainer"));

    showElem    ($$("filterEmptyTempalte"));
    showElem    ($$("EditEmptyTempalte"));

    disableElem ($$("btnFilterSubmit"));
    disableElem ($$("filterLibrarySaveBtn"));
    disableElem ($$("resetFilterBtn"));
    
    setWidthEditForm  ();
    
    setStateFilterBtn ();
    
    hideTreeTempl     ();

    hideNoneContent   ();

    function visibleTreeItem(idsUndefined){

        async function findSingleEl () {
            let single;
            if (!STORAGE.fields){
                await getData("fields"); 
            }

            if (STORAGE.fields){
                let storageData = STORAGE.fields.content;
                single = false;
                    if (storageData[idsUndefined]){
                      
                        single = true;
                        if        (storageData[idsUndefined].type == "dbtable"  ){
                            showElem ($$("tables"));

                        } else if (storageData[idsUndefined].type == "tform"    ){
                            showElem ($$("forms"));

                        } else if (storageData[idsUndefined].type == "dashboard"){
                            showElem ($$("dashboards"));
                        }

                        setTableName (idsUndefined);
                    }
           
            }

            return single;

        }

        function removeNullContent(){
            try{
                let viewEl  = $$("webix__null-content");
                
                if(viewEl){
                    removeElem (viewEl);
                }
            } catch (err){
                setFunctionError(err,logNameFile,"removeNullContent");
            }
        }  

    
        removeNullContent();
        hideElem ($$("user_auth"));
        hideElem ($$("userprefs"));


        function createUndefinedMsg(){
            $$("container").addView(
            {
                view:"align", 
                align:"middle,center",
                id:"webix__null-content",
                body:{  
                    borderless:true, 
                    template:"Блок в процессе разработки", 
                    height:50, 
                    width:220,
                    css:{"color":"#858585","font-size":"14px!important"}
                }
                
            },
            
            2);
        }
        
        
        function initUndefinedElement(){

            findSingleEl().then(function(response) {
                if (!response){
         
                    hideElem ($$("webix__none-content"));
                     
                    if(!($$("webix__null-content"))){
                        createUndefinedMsg();
                    } 
                }
            });
        }

        parentsArray = getTreeParents();

        function viewSingleElements(){
            parentsArray.forEach(function(el,i){
                let singleAction = $$("tree").getItem(idsUndefined).action; //dashboard
                let treeItemAct  = $$("tree").getItem(el).action;
                if (idsUndefined){
                    initUndefinedElement();
                } 
  
                if (singleAction !== treeItemAct && treeItemAct){
                    if (treeItemAct == "dbtable" || treeItemAct == "all_dbtable"){
                        hideElem ($$("tables"));
                    } else if (treeItemAct == "tform" || treeItemAct == "all_tform"){
                        hideElem ($$("forms"));
                    } else if (treeItemAct == "dashboard" || getItemParent !== "dashboards"){
                        hideElem ($$("dashboards"));
                    }
                }
                            
            }); 
        }

        function viewDefaultElements(){
            try{
                parentsArray.forEach(function(el,i){

                    if (el == getItemParent){
                       
                        if ($$(el)){
                            $$(el).show();

                        } else {
                            if(!($$("webix__null-content"))){
                                createUndefinedMsg();
                            } 
                        }
                    } else if ($$(el) || el=="treeTempl"){
                        
                        if ($$(el)){
                            $$(el).hide();
                        }
                        
                    } else {
                   
                        const treeItemAct  = $$("tree").getItem(el).action;
                       
                        if (treeItemAct == "dbtable" && getItemParent !== "tables"){
                            hideElem ($$("tables"));
                        } else if (treeItemAct == "tform" && getItemParent !== "forms"){
                            hideElem ($$("forms"));
                        } else if (treeItemAct == "dashboard" && getItemParent !== "dashboards"){
                           
                            hideElem ($$("dashboards"));
                        }
                    }     
                    
                }); 
            } catch (err){
                setFunctionError(err,logNameFile,"viewDefaultElements");
            }
        }

        if(idsUndefined !== undefined){
            viewSingleElements();

        } else {
            viewDefaultElements();

        }

    }


    function selectItemAction(){

        if (       getItemParent == "tables"    ){
            visibleTreeItem();

        } else if( getItemParent == "dashboards"){
            visibleTreeItem(); 

        } else if( getItemParent == "forms"     ){
            hideElem ($$("propTableView"));
            visibleTreeItem();

        } else if ( getItemParent == 0           && 
                    treeItemId   !=="tables"     && 
                    treeItemId   !=="user_auth"  && 
                    treeItemId   !=="dashboards" && 
                    treeItemId   !=="forms"      ){
      
            visibleTreeItem(ids[0]); 
          
        } else if (getItemParent !==0){
            visibleTreeItem(ids[0]); 
        }
    }


    function getInfoSelectElement (){
        if (       getItemParent   == "tables"     ){
            defaultStateForm();
          //  getInfoTable ("table", ids[0]);
            setTableName (treeItemId); 

        } else if (getItemParent   == "dashboards" ){
            getInfoDashboard ();

        } else if (getItemParent   == "forms"      ){
          //  getInfoTable ("table-view", ids[0]);
            setTableName (treeItemId);

        }
    }

    selectItemAction     ();
    getInfoSelectElement ();
}

export {
    onSelectChangeFunc
};
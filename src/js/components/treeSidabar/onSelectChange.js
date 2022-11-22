import { setFunctionError }                           from "../../blocks/errors.js"; 

import { createDashboard }                            from "../dashboard/createDashboard.js";
 
import { defaultStateForm }                           from "../table/editForm/states.js";

import { Action }                                     from "../../blocks/commonFunctions.js";

import { LoadServerData, GetFields }                  from "../../blocks/globalStorage.js";

import { setStateFilterBtn }                          from "./common.js";


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
            setFunctionError(err, logNameFile, "setWidthEditForm");
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
                Action.hideItem($$("webix__none-content"));
            }
        } catch (err){
            setFunctionError(err,logNameFile,"hideNoneContent");
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
    Action.removeItem($$("propertyRefbtnsContainer"));
    Action.hideItem($$("tablePropBtnsSpace"));
    Action.hideItem($$("editTableFormProperty"));
    
    setSearchInputState();
    
    Action.hideItem($$("filterTableBarContainer"));

    Action.showItem($$("filterEmptyTempalte"));
    Action.showItem($$("EditEmptyTempalte"));


    Action.disableItem($$("btnFilterSubmit"));
    Action.disableItem($$("filterLibrarySaveBtn"));
    Action.disableItem($$("resetFilterBtn"));
  
    
    setWidthEditForm  ();
    
    setStateFilterBtn ();
    
    hideTreeTempl     ();

    hideNoneContent   ();

    function visibleTreeItem(idsUndefined){

        async function findSingleEl () {
            await LoadServerData.content("fields");
            const keys   = GetFields.keys;
       
            let single = false;

            function isExists(key) {
                return key === idsUndefined;
            }
 
        
            if (keys.find(isExists)){
                const type = GetFields.attribute (idsUndefined, "type");
                
                single = true;
                if        (type == "dbtable"  ){
                    Action.showItem($$("tables"));

                } else if (type == "tform"    ){
                    Action.showItem($$("forms"));

                } else if (type == "dashboard"){
                  
                    Action.showItem($$("dashboards"));
                }

            }

            return single;

        }

        function removeNullContent(){
            try{
                let viewEl  = $$("webix__null-content");
                
                if(viewEl){
                    Action.removeItem(viewEl);

                }
            } catch (err){
                setFunctionError(err,logNameFile,"removeNullContent");
            }
        }  

    
        removeNullContent();
        Action.hideItem($$("user_auth"));
        Action.hideItem($$("settings" ));
 


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
                    Action.hideItem($$("webix__none-content"));
                     
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
                        Action.hideItem($$("tables"));
                    } else if (treeItemAct == "tform" || treeItemAct == "all_tform"){
                        Action.hideItem($$("forms"));
                    } else if (treeItemAct == "dashboard" || getItemParent !== "dashboards"){
                        Action.hideItem($$("dashboards"));
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
                            Action.hideItem($$("tables"));
                        } else if (treeItemAct == "tform" && getItemParent !== "forms"){
                            Action.hideItem($$("forms"));
                        } else if (treeItemAct == "dashboard" && getItemParent !== "dashboards"){
                            Action.hideItem($$("dashboards"));
                 
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
            Action.hideItem($$("propTableView"));
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

    selectItemAction     ();
}

export {
    onSelectChangeFunc
};
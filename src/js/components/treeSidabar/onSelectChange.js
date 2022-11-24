import { setFunctionError }   from "../../blocks/errors.js"; 
import { Action }             from "../../blocks/commonFunctions.js";
import { setStateFilterBtn }  from "./common.js";
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
            if(!($$(ids))){
                Action.hideItem(elem);
            }
        } catch (err){
            setFunctionError(err, logNameFile, "hideTreeTempl");
        }
    }


    function getTreeParents(){
        let parents = [];
        try{
            treeArray.forEach(function(el){
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

}

export {
    onSelectChangeFunc
};
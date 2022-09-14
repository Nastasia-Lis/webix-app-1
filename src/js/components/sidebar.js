import {saveItem,saveNewItem,clearItem,defaultStateForm} from "../blocks/editTableForm.js";
import {modalBox} from "../blocks/notifications.js";
import {setLogValue} from '../blocks/logBlock.js';
import {getInfoTable,getInfoDashboard,getInfoEditTree} from "../blocks/content.js";
import {catchErrorTemplate} from "../blocks/logBlock.js";

let itemTreeId = "";

let inpObj={};
let customInputs = [];

 
function treeSidebar () {
    let tree = {
        view:"edittree",
        id:"tree",
        css:"webix_tree-main",
        minWidth:100,
        width: 250,
        editable:false,
        select:true,
        editor:"text",
        editValue:"value",
        activeTitle:true,
        clipboard: true,
        data:[],
        on:{
            onSelectChange:function (ids) {
                    itemTreeId = ids[0];
                    let treeItemId = $$("tree").getSelectedItem().id;
              
                    let getItemParent = $$("tree").getParentId(treeItemId);
        
                    let treeArray = $$("tree").data.order;
                    let parentsArray = [];

                    let singleItemContent="";
                    try {
                        if($$("inputsTable")){
                            $$("table-editForm").removeView($$("inputsTable"));
                            $$("EditEmptyTempalte").show();
                        }

                        treeArray.forEach(function(el,i){
                            if ($$("tree").getParentId(el) == 0){
                                parentsArray.push(el);
                            }
                        });

                        if (treeItemId.includes("single")){
                            singleItemContent = $$("tree").getSelectedItem().typeof;
                        }

                        if (ids[0]&&getItemParent!==0 || singleItemContent ){
                            $$("webix__none-content").hide();
                        }
                    } catch (error){
                        console.log(error);
                        catchErrorTemplate("009-000", error);

                    }
                
                    function visibleTreeItem(singleType, idsUndefined){
                        try{
                            if($$("webix__null-content")){
                                $$("container").removeView($$("webix__null-content"));
                            }

                            if($$("user_auth")){
                                if ($$("user_auth").isVisible()){
                                    $$("user_auth").hide();
                                }
                            }

                            if($$("userprefs")){
                                if ($$("userprefs").isVisible()){
                                    $$("userprefs").hide();
                                }
                            }
                            
                            if(idsUndefined !== undefined){
                              
                                return parentsArray.forEach(function(el,i){
                                    if (el.includes("single")){
                                        if(singleType){
                                            $$(singleType).hide();
                                        }
                                    } else {

                                        

                                        if (idsUndefined!=="treeTempl"){
                                            if($$("webix__none-content").isVisible()){
                                                $$("webix__none-content").hide();
                                            }

                                            if(!($$("webix__null-content"))){
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
                                        } else {
                                            if(!($$("webix__none-content").isVisible())){
                                                $$("webix__none-content").show();
                                            }
                                        }

                                        if (el!==idsUndefined && $$(el)){
                                            $$(el).hide();
                                        } 
                                        
                                    }     
                                });  
                             
                                
                            } else {
                            
                                return parentsArray.forEach(function(el,i){
                                    if (el.includes("single")){
                                        if (singleType){
                                            $$(singleType).show();
                                        } 
                                    } else {
                                        if (el == getItemParent){
                                            $$(el).show();
                                        } else if (el=="tables" || el=="dashboards" || el=="forms" || el=="user_auth" || el=="treeTempl"){
                                            $$(el).hide();
                                        }
                                
                                    }
                                        
                                    
                                });  
                            }
                        } catch (error){
                            console.log(error);
                            catchErrorTemplate("009-000", error);
    
                        }
                    
                    }
                try {

                    if (getItemParent=="tables" || singleItemContent == "dbtable"){
                        visibleTreeItem("tables"); 
                    }else if(getItemParent=="dashboards" || singleItemContent == "dashboard"){
                        visibleTreeItem("dashboards"); 
                    } else if(getItemParent=="forms" || singleItemContent == "tform"){
                        if ($$("propTableView") && $$("propTableView").isVisible()){
                            $$("propTableView").hide();
                        }
                        visibleTreeItem("forms"); 
                    } else if (getItemParent=="user_auth"){
                        visibleTreeItem(); 
                    } else if (getItemParent == 0 && treeItemId!=="tables"&& treeItemId!=="user_auth"&& treeItemId!=="dashboards" && treeItemId!=="forms" && !singleItemContent){
                        visibleTreeItem(false, ids[0]); 
                    } else if (getItemParent=="treeTempl"){
                        visibleTreeItem(); 
                    } 

              

// --- контент tree items
             

                    if(getItemParent=="tables" || singleItemContent == "dbtable"){
                    
                        defaultStateForm();
                        
                        if(Object.keys($$("table-editForm").elements).length!==0){
                            $$("inputsTable").hide();
                        }
                        if (singleItemContent == "dbtable"){
                            getInfoTable ("table", "table-search", ids[0], "table-findElements", true);
                        }else {
                            getInfoTable ("table", "table-search", ids[0], "table-findElements");
                        }
                        

                    } else if(getItemParent=="dashboards") {
                    getInfoDashboard ();

                    } else if(singleItemContent == "dashboard") {
                        getInfoDashboard (ids[0],true);
                    }else if(getItemParent=="forms") {
                        getInfoTable ("table-view", "table-view-search", ids[0], "table-view-findElements");
                    }else if(singleItemContent == "tform") {
                        getInfoTable ("table-view", "table-view-search", ids[0], "table-view-findElements", true);
                    } else if (getItemParent=="treeTempl"){
                        getInfoEditTree() ;
                    }
                } catch (error){
                    console.log(error);
                    catchErrorTemplate("009-000", error);
            
                }
                
            },
            onItemClick:function(id, e, node){
                if($$("table-editForm").isDirty()){
                       
                    modalBox().then(function(result){
                        if (result == 1){
                            clearItem();
                            $$("tree").select(id);
                        
                        } else if (result == 2){
                            if ($$("table-editForm").validate()){
                                if ($$("table-editForm").getValues().id){
                                    saveItem();
                                } else {
                                    saveNewItem(); 
                                }
                                $$("tree").select(id);
                            
                            } else {
                                setLogValue("error","Заполните пустые поля");
                                return false;
                            }
                            
                        }
                    });
                    return false;
                }
            },

            onBeforeSelect: function(data) {
               
                let getItemParent = $$("tree").getParentId(data);
                if(getItemParent=="tables"){

                    if ($$("filterTableForm")&&$$("filterTableForm").isVisible){

                        $$("filterTableForm").hide();
                        if($$("inputsFilter")){
                            $$("filterTableForm").removeView( $$("inputsFilter"));
                        }
                        let btnClass = document.querySelector(".webix_btn-filter");
                        if (btnClass&&!(btnClass.classList.contains("webix_secondary"))){
                            btnClass.classList.add("webix_secondary");
                            btnClass.classList.remove("webix_primary");
                        }
                        $$("table-editTableBtnId").hide();
                        $$("table-editForm").show();
                    }
                }
            },

            onBeforeRender:function() {
                if(window.innerWidth <= 550){
                    $$("sideMenuResizer").hide();
                } else {
                    $$("sideMenuResizer").show();
                }
               
            },

        },

    };

    return tree;
}

export{
    treeSidebar,
    inpObj,
    customInputs,
};
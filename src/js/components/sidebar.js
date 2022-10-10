import {saveItem,saveNewItem,defaultStateForm,validateProfForm} from "../blocks/editTableForm.js";
import {modalBox} from "../blocks/notifications.js";
import {getInfoTable,getInfoDashboard,getInfoEditTree} from "../blocks/content.js";
import {catchErrorTemplate,setLogValue} from "../blocks/logBlock.js";
import  {STORAGE,getData} from "../blocks/globalStorage.js";


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

                        $$("EditEmptyTempalte").show();
                    }

                    if ($$("filterEmptyTempalte")){
                        $$("filterEmptyTempalte").show();
                    }

               
                    if ($$("table-editTableBtnId").isVisible() ){
                        $$("table-editTableBtnId").hide();
                    }
                    
                    if ($$("filterTableBarContainer") && $$("filterTableBarContainer").isVisible()){
                        $$("filterTableBarContainer").hide();
                    }
    
                
                    if ($$("editTableBarContainer") && !($$("editTableBarContainer").isVisible())){
                        $$("editTableBarContainer").show();
                    }
                    if ($$("table-editForm") && !($$("table-editForm").isVisible())){
                        $$("table-editForm").show();
                    }
        
                    if ($$("btnFilterSubmit").isEnabled()){
                        $$("btnFilterSubmit").disable();
                    }
                    if ($$("filterLibrarySaveBtn").isEnabled()){
                        $$("filterLibrarySaveBtn").disable();
                    }
                    if ($$("resetFilterBtn").isEnabled()){
                        $$("resetFilterBtn").disable();
                    }

                    if ($$("table-editForm") && $$("table-editForm").config.width < 320){
                        $$("table-editForm").config.width = 320;
                        $$("table-editForm").refresh();
                    }

                    let btnClass = document.querySelector(".webix_btn-filter");
                    if (btnClass && btnClass.classList.contains("webix_primary")){
                        btnClass.classList.add("webix_secondary");
                        btnClass.classList.remove("webix_primary");
                    }
               
                    

                    if($$("treeTempl") && !($$(ids)) ){
                        $$("treeTempl").hide();
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
                    
                    function setTableName (id){

                        if ($$("table-templateHeadline") ){
                            
                            STORAGE.tableNames.forEach(function(el,i){
                                if (el.id == id){
                                    $$("table-templateHeadline").setValues(el.name);
                                }
                                
                            });
                        } 
                        
                        if ($$("table-view-templateHeadline")){
                            STORAGE.tableNames.forEach(function(el,i){
                                if (el.id == id){
                                    $$("table-view-templateHeadline").setValues(el.name);
                                }
                                
                            });
                        }
                    }
        

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
                                    if (storageData[idsUndefined].type == "dbtable"){
                                        if ($$("tables")){
                                            $$("tables").show();
                                        }
                                    } else if (storageData[idsUndefined].type == "tform"){
                                        if ($$("forms")){
                                            $$("forms").show();
                                        }
                                    } else if (storageData[idsUndefined].type == "dashboard"){
                                        if ($$("dashboards")){
                                            $$("dashboards").show();
                                        }
                                    }

                                    setTableName (idsUndefined);
                                }
                       
                        }

                        return single;

                    }

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

                                        findSingleEl () .then(function(response) {
                                            if (!response){
                                            
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
                                            }
                                        });

                                       
                                    } else {
                                   
                                        if(!($$("webix__none-content").isVisible())){
                                            $$("webix__none-content").show();
                                            $$("container").getChildViews().forEach(function(el,i){
                                                if (el.config.id!=="webix__none-content" &&  el.config.hidden == false ){
                                                    $$(el.config.id).hide();
                                                }
                                            });
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
                                        if ($$(el)){
                                            $$(el).show();
                                        } else {
                                     
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
                                        }
                                    } else if ($$(el) || el=="treeTempl"){
                                       if ($$(el)){
                                            $$(el).hide();
                                       }
                                       
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
                            getInfoTable ("table", ids[0]);
                        }else {
                            getInfoTable ("table", ids[0]);
                        }
                        

                    } else if(getItemParent=="dashboards") {
                        getInfoDashboard ();

                    } else if(singleItemContent == "dashboard") {
                        getInfoDashboard (ids[0],true);
                    }else if(getItemParent=="forms") {
                        getInfoTable ("table-view", ids[0]);
                    }else if(singleItemContent == "tform") {
                        getInfoTable ("table-view", ids[0]);
                    } else if (getItemParent=="treeTempl"){
                        getInfoEditTree() ;
                    }
                } catch (error){
                    console.log(error);
                    catchErrorTemplate("009-000", error);
            
                }


                // headline у таблиц
            
                if ($$("table-templateHeadline") && $$("table-templateHeadline").isVisible()){
                    STORAGE.tableNames.forEach(function(el,i){
                        if (el.id == $$("tree").getSelectedId()){
                            $$("table-templateHeadline").setValues(el.name);
                        }
                        
                    });
                } else if ($$("table-view-templateHeadline") && $$("table-view-templateHeadline").isVisible()){
                    STORAGE.tableNames.forEach(function(el,i){
                        if (el.id == $$("tree").getSelectedId()){
                            $$("table-view-templateHeadline").setValues(el.name);
                        }
                        
                    });
                }
                
            },
            onItemClick:function(id, e, node){

                function getItemId (){
                    let idTable;
                    if ($$("tree").getSelectedItem()){
                        idTable = $$("tree").getSelectedItem().id;
                    } else {
                        let href = window.location.pathname;
                        let index = href.lastIndexOf("/");
                        idTable = href.slice(index+1);

                    }
                    return idTable;
                }

                let valuesProp = $$("editTableFormProperty").getValues();
                let currId = getItemId ();

                function setDirtyProperty (){
                    $$("editTableFormProperty").config.dirty = false;
                    $$("editTableFormProperty").refresh();
                }

                function removePrefBtns (){
                    if ($$("propertyRefbtnsContainer")){
                        $$("propertyRefbtns").removeView($$("propertyRefbtnsContainer")) 
                    }
                }
              
                function setDefaultStateProperty (){
                    if ($$("editTableFormProperty") && $$("editTableFormProperty").isVisible()){
                        $$("editTableFormProperty").clear();
                        $$("editTableFormProperty").hide();
                    }
                }

                function setDefaultStateBtns (){
                    if ($$("table-saveNewBtn").isVisible()) {
                        $$("table-saveNewBtn").hide();
                    } else if ($$("table-saveBtn").isVisible()){
                        $$("table-saveBtn").hide();
                    }
                    $$("table-delBtnId").disable();
                }

                function validateError (){
                    validateProfForm ().forEach(function(el,i){
        
                        let nameEl;
        
                        $$("table").getColumns().forEach(function(col,i){
                            if (col.id == el.nameCol){
                                nameEl = col.label;
                            }
                        });
        
                        setLogValue("error",el.textError+" (Поле: "+nameEl+")");
                    });
                }

                function uniqueData (itemData){
                    let validateData = {};
                    Object.values(itemData).forEach(function(el,i){
                        let oldValues = $$("table").getItem(itemData.id)
                        let oldValueKeys = Object.keys(oldValues);
      
                        function compareVals (){
                            let newValKey = Object.keys(itemData)[i];
                            
                            oldValueKeys.forEach(function(oldValKey){
                                
                                if (oldValKey == newValKey){
                                    
                                    if (oldValues[oldValKey] !== Object.values(itemData)[i]){
                                        validateData[Object.keys(itemData)[i]] = Object.values(itemData)[i];
                                    } 
                                    
                                }
                            }); 
                        }
                        compareVals ();
                    });

                    return validateData;
                }
        

                function postNewData (){
                    if (!(validateProfForm().length)){
                        webix.ajax().post("/init/default/api/"+currId, valuesProp,{
                            success:function(text, data, XmlHttpRequest){
                                data = data.json();
                                if (data.content.id !== null){
                                    setDirtyProperty ();
                                    removePrefBtns ();
                                    $$("tree").select(id);
                                    setLogValue("success","Данные успешно добавлены",currId);
                                } else {
        
                                    let errs = data.content.errors;
                                    let msg = "";
                                    Object.values(errs).forEach(function(err,i){
                                        msg +=err+" (Поле: "+Object.keys(errs)[i] +"); ";
                                    });
        
                                    setLogValue("error",msg);
                                }
                                
                            },
                            error:function(text, data, XmlHttpRequest){
                                setLogValue("error","table modalBox (post new data): "+XmlHttpRequest.status+" "+XmlHttpRequest.statusText+" "+XmlHttpRequest.responseURL);
                            }
                        });
        
                    } else {
                        validateError ();
                    }
                }

                function putData (){
                    if (!(validateProfForm().length)){

                        if (valuesProp.id){
                         
                            webix.ajax().put("/init/default/api/"+currId+"/"+valuesProp.id, uniqueData (valuesProp), {
                                success:function(text, data, XmlHttpRequest){
                                    data = data.json()
                                    if (data.err_type == "i"){
                                        setDirtyProperty ();
                                        
                                        removePrefBtns ();
                                        $$("tree").select(id);
                                        setLogValue("success","Данные успешно добавлены",currId);
                                
                                    } if (data.err_type == "e"){
                                        setLogValue("error",data.error);
                                    }
                                
                                },
                                error:function(text, data, XmlHttpRequest){
                                    setLogValue("error","table function putData: "+XmlHttpRequest.status+" "+XmlHttpRequest.statusText+" "+XmlHttpRequest.responseURL);
                                }
                            }).catch(error => {
                                console.log(error);
                                setLogValue("error","table function putData ajax: "+error.status+" "+error.statusText+" "+error.responseURL);
                            });
                        }
        
                    } else {
                        validateError ();
                    }
                }
            

                function modalBoxTree (){
                    modalBox().then(function(result){
                    
                        if (result == 1){

                            setDefaultStateBtns ();
                            setDefaultStateProperty ();
                            setDirtyProperty ();

                            $$("tree").select(id);
                        } else if (result == 2){
                            if ($$("editTableFormProperty").getValues().id){
                                putData ();
                          
                            } else {
                                postNewData ();  
                            }
                            setDirtyProperty ();
                        }

                        if (result !== 0){
                            removePrefBtns ();
                        }

                    });
                }
                if($$("editTableFormProperty").config.dirty){
                    try{  
                        modalBoxTree ();
                    } catch (error){
                        console.log(error);
                        catchErrorTemplate("009-000", error);
                
                    }
                    return false;
                }

            },

            onBeforeSelect: function(data) {
               
                let getItemParent = $$("tree").getParentId(data);
                if(getItemParent=="tables"){

                    if ($$("filterTableForm")&&$$("filterTableForm").isVisible){

                        try{
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
                        } catch (error){
                            console.log(error);
                            catchErrorTemplate("009-000", error);
                    
                        }
                    }


                    if ($$("propertyRefbtnsContainer")){
                        $$("propertyRefbtns").removeView($$("propertyRefbtnsContainer"))
                    }
                    if ($$("editTableFormProperty") && $$("editTableFormProperty").isVisible()){
                        $$("editTableFormProperty").hide();
                    }
                 
                }


                async function getSingleTreeItem() {

                    if (!STORAGE.fields){
                        await getData("fields"); 
                    }
                  
                    let content = STORAGE.fields.content;
                    let obj = Object.keys(content); 

                
                    function generateItem (){
                        obj.forEach(function(el) {
                       
                            if (el == data){ // userprefs убрать, добавить меню в storage и сравнить
                             
                                if ($$("webix__none-content").isVisible()){
                                    $$("webix__none-content").hide();
                                }
                          
                                if($$("webix__null-content")){
                                    $$("container").removeView($$("webix__null-content"));
                                }
                         
                                if (content[el].type == "dbtable"){
                                    if ($$("tables")){
                                        $$("tables").show();
                                    }
                                    getInfoTable ("table", data);
                                    
                                } else if (content[el].type == "tform"){
                                    if ($$("forms")){
                                        $$("forms").show();
                                    }
                                    getInfoTable ("table-view", data);
                                } else if (content[el].type == "dashboard"){
                                    if ($$("dashboards")){
                                        $$("dashboards").show();
                                    }
                                    getInfoDashboard(data);
                                }
                            
            
                            }
                            
                            
                        });
                    }

                    generateItem ()
                
                    
                }
                getSingleTreeItem() 

            
            },

            onBeforeOpen:function (id){

                const selectedItem = $$("tree").getItem(id);

                if ($$("tree").getItem(id).$count===-1){

                    async function getMenuChilds() {

                        if (!STORAGE.fields){
                            await getData("fields"); 
                        }
                        let content = STORAGE.fields.content;
                        let obj = Object.keys(content); 
    
                        function findNotUniqueItem (data){
                            let check = false;
                            STORAGE.mmenu.mmenu.forEach(function(el,i){
                                if (el.name == data){
                                    check = true;
                                    
                                }
                            });
                            return check;
                        }
                        function generateMenuData (typeChild){
                            obj.forEach(function(data) {
                                if (content[data].type == typeChild && !findNotUniqueItem(data)){ // userprefs убрать, добавить меню в storage и сравнить
                           
                                    $$("tree").data.add({
                                        id:data, 
                                        value:(content[data].plural) ? content[data].plural : content[data].singular, 
                                        "type":content[data].type
                                    }, 0, id ); 
                
                                }
                                
                                
                            });
                        }

                        if (selectedItem.action.includes("all_")){
                            let index = selectedItem.action.indexOf("_");
                            let type = selectedItem.action.slice(index+1);

                            generateMenuData (type);
                        }
                    
                        
                    }
                    getMenuChilds();


                }
      
            },

            onAfterSelect:function(id){
              
                async function getFields (){
                    if (!STORAGE.mmenu){
                        await getData("fields"); 
                    }

                    if (STORAGE.fields){
                        Backbone.history.navigate("tree/"+id, { trigger:true });
                    }
                }

                getFields ();
            
                
                if (window.innerWidth < 850 ){
                    this.hide();
                }
            }
        },

    };

    return tree;
}

export{
    treeSidebar,
    inpObj,
    customInputs,
};
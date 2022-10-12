import {defaultStateForm,validateProfForm} from "../blocks/editTableForm.js";
import {modalBox} from "../blocks/notifications.js";
import {getInfoTable,getInfoDashboard} from "../blocks/content.js";
import {setLogValue} from "../blocks/logBlock.js";
import  {STORAGE,getData} from "../blocks/globalStorage.js";

import {setAjaxError,setFunctionError} from "../blocks/errors.js";


let inpObj={};
let customInputs = [];

function removeElements (element){
    try{
    
        if (element){
            const parent = element.getParentView();
            parent.removeView(element);
        }
    } catch (err){
        setFunctionError(err,"sidebar","removeElements");
    }
}

function hideElements (element){
    try{
        if (element && element.isVisible()){
            element.hide();
        }
    } catch (err){
        setFunctionError(err,"sidebar","hideElements");
    }
}

function showElements (element){
    try{
        if (element && !(element.isVisible())){
            element.show();
        }
    } catch (err){
        setFunctionError(err,"sidebar","showElements");
    }
}

function disableElements(element){
    try{
        if (element && element.isEnabled()){
            element.disable();
        }
    } catch (err){
        setFunctionError(err,"sidebar","disableElements");
    }
}

function setStateFilterBtn(){
    try{
        let btnClass = document.querySelector(".webix_btn-filter");
        if (btnClass && btnClass.classList.contains("webix-transparent-btn--primary")){
            btnClass.classList.add("webix-transparent-btn");
            btnClass.classList.remove("webix-transparent-btn--primary");
        }
    } catch (err){
        setFunctionError(err,"sidebar","setStateFilterBtn");
    }
}

 
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

                let treeItemId = $$("tree").getSelectedItem().id;
                let getItemParent = $$("tree").getParentId(treeItemId);
                let treeArray = $$("tree").data.order;
                let parentsArray = [];

                function setWidthEditForm(){
                    try{
                        let editForm = $$("table-editForm");
                  
                        if (editForm && editForm.config.width < 320){
                            editForm.config.width = 320;
                            editForm.refresh();
                        }
                    } catch (err){
                        setFunctionError(err,"sidebar","onSelectChange => setWidthEditForm");
                    }
                }

                function hideTreeTempl(){
                    try{
                        let elem = $$("treeTempl");
                        if(elem && !($$(ids)) ){
                            elem.hide();
                        }
                    } catch (err){
                        setFunctionError(err,"sidebar","onSelectChange => hideTreeTempl");
                    }
                }


                function getTreeParents(){
                    let parents = [];
                    try{
                        treeArray.forEach(function(el,i){
                            if ($$("tree").getParentId(el) == 0){
                                parents.push(el);
                            }
                        });
                    } catch (err){
                        setFunctionError(err,"sidebar","onSelectChange => getTreeParents");
                    }
                    return parents;
                }

                function hideNoneContent(){
                    try{
                        if (ids[0] && getItemParent!==0){
                            hideElements ($$("webix__none-content"));
                        }
                    } catch (err){
                        setFunctionError(err,"sidebar","onSelectChange => hideNoneContent");
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
                        setFunctionError(err,"sidebar","onSelectChange => setTableName");
                    }
                }
              

                hideElements ($$("table-editTableBtnId"));
                hideElements ($$("filterTableBarContainer"));

                showElements ($$("filterEmptyTempalte"));
                showElements ($$("EditEmptyTempalte"));
                showElements ($$("editTableBarContainer"));
                showElements ($$("table-editForm"));

                disableElements     ($$("btnFilterSubmit"));
                disableElements     ($$("filterLibrarySaveBtn"));
                disableElements     ($$("resetFilterBtn"));
                
                setWidthEditForm    ();
                
                setStateFilterBtn   ();
                
                hideTreeTempl       ();
           
                hideNoneContent     ();

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
                                        showElements ($$("tables"));

                                    } else if (storageData[idsUndefined].type == "tform"    ){
                                        showElements ($$("forms"));

                                    } else if (storageData[idsUndefined].type == "dashboard"){
                                        showElements ($$("dashboards"));
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
                                removeElements (viewEl);
                            }
                        } catch (err){
                            setFunctionError(err,"sidebar","onSelectChange => removeNullContent");
                        }
                    }  

                
                    removeNullContent();
                    hideElements ($$("user_auth"));
                    hideElements ($$("userprefs"));


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
                     
                                hideElements ($$("webix__none-content"));
                                 
                                if(!($$("webix__null-content"))){
                                    createUndefinedMsg();
                                } 
                            }
                        });
                    }

                    parentsArray = getTreeParents();

                    function viewSingleElements(){
                        parentsArray.forEach(function(el,i){
                     
                            if (idsUndefined){
                                initUndefinedElement();
                            } 
                    
                            if (el !== idsUndefined){
                                hideElements ($$(el));
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
                                    
                                }      
                                
                            }); 
                        } catch (err){
                            setFunctionError(err,"sidebar","onSelectChange => viewDefaultElements");
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
                        hideElements ($$("propTableView"));
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
                        getInfoTable ("table", ids[0]);
                        setTableName (treeItemId); 
    
                    } else if (getItemParent   == "dashboards" ){
                        getInfoDashboard ();
    
                    } else if (getItemParent   == "forms"      ){
                        getInfoTable ("table-view", ids[0]);
                        setTableName (treeItemId);
    
                    }
                }

                selectItemAction     ();
                getInfoSelectElement ();

            },


            onItemClick:function(id){

                function getItemId (){
                    let idTable;
                 
                    if ($$("tables").isVisible()){
                        idTable = $$("table").config.idTable;

                    } else if ($$("forms").isVisible()){

                        idTable = $$("table-view").config.idTable;
                    }
                    return idTable;
                }
                const prop       = $$("editTableFormProperty");
                const valuesProp = prop.getValues();
                const currId     = getItemId ();


                function setDirtyProperty (){
                    try{
                        prop.config.dirty = false;
                        prop.refresh();
                    } catch (err){
                        setFunctionError(err,"sidebar","onItemClick => setDirtyProperty");
                    }
                }

                function setDefaultStateProperty (){
                    try{
                        if (prop && prop.isVisible()){
                            prop.clear();
                            prop.hide();
                        }
                    } catch (err){
                        setFunctionError(err,"sidebar","onItemClick => setDirtyProperty");
                    }
                }

                function setDefaultStateBtns (){
                    try{
                        const saveNewBtn = $$("table-saveNewBtn");
                        const saveBtn    = $$("table-saveBtn");
                        const delBtn     = $$("table-delBtnId");
                        
                        if (saveNewBtn.isVisible()) {
                            saveNewBtn.hide();

                        } else if (saveBtn.isVisible()){
                            saveBtn.hide();
                        }

                        delBtn.disable();

                    } catch (err){
                        setFunctionError(err,"sidebar","onItemClick => setDefaultStateBtns");
                    }
                }

                function validateError (){
                    try{
                        validateProfForm ().forEach(function(el,i){
                            let nameEl;

                            $$("table").getColumns().forEach(function(col,i){
                                if (col.id == el.nameCol){
                                    nameEl = col.label;
                                }
                            });
            
                            setLogValue("error",el.textError+" (Поле: "+nameEl+")");
                        });
                    } catch (err){
                        setFunctionError(err,"sidebar","onItemClick => validateError");
                    }
                }

                function uniqueData (itemData){
                    let validateData = {};

                    function compareVals (i){
                        try{
                            let oldValues = $$("table").getItem(itemData.id);
                            let oldValueKeys = Object.keys(oldValues);

                            let newValKey = Object.keys(itemData)[i];
                            let newVal = Object.values(itemData)[i];
                            
                            oldValueKeys.forEach(function(oldValKey){
                                
                                if (oldValKey == newValKey){

                                    if (oldValues[oldValKey] !== newVal){
                                        validateData[newValKey] = newVal;
                                    } 
                                    
                                }
                            }); 
                        } catch (err){
                            setFunctionError(err,"sidebar","onItemClick => compareVals");
                        }
                    }

                    Object.values(itemData).forEach(function(el,i){         
                        compareVals (i);
                    });

                    return validateData;
                }
        
                function selectTree(id){
                    if ($$("tree")){
                        $$("tree").select(id);
                    }
                }
          
                function postNewData (){
                    if (!(validateProfForm().length)){
                        const url = "/init/default/api/"+currId;
                        const postData = webix.ajax().post(url, valuesProp);

                        postData.then(function(data){
                            data = data.json();
                            if (data.content.id !== null){
                                setDirtyProperty ();
                                removeElements ($$("propertyRefbtnsContainer"));
                                selectTree(id);
                                setLogValue("success","Данные успешно добавлены",currId);
                            } else {
    
                                let errs = data.content.errors;
                                let msg = "";
                                Object.values(errs).forEach(function(err,i){
                                    msg +=err+" (Поле: "+Object.keys(errs)[i] +"); ";
                                });
    
                                setLogValue("error",msg);
                            }

                            if(data.err_type !== "i"){
                                setFunctionError(data.err,"sidebar","onItemClick => postNewData");
                            }
                        });

                        postData.fail(function(err){
                            setAjaxError(err, "sidebar","onItemClick => postNewData");
                        });

                    } else {
                        validateError ();
                    }
                }

                function putData (){
                    if (!(validateProfForm().length)){

                        if (valuesProp.id){
                            const url= "/init/default/api/"+currId+"/"+valuesProp.id;
                            const putValue = uniqueData (valuesProp);
                            const putData = webix.ajax().put(url, putValue);

                            putData.then(function(data){
                                data = data.json()
                            
                                if (data.err_type == "i"){
                                    setDirtyProperty ();
                                    removeElements ($$("propertyRefbtnsContainer"));
                                    selectTree(id);
                                    setLogValue("success","Данные успешно добавлены",currId);
                            
                                } else {
                                    setFunctionError(data.err,"sidebar","onItemClick => putData")
                                }
                            });

                            putData.fail(function(err){
                                setAjaxError(err, "sidebar","onItemClick => putData");
                            });

                        }
        
                    } else {
                        validateError ();
                    }
                }
            

                function modalBoxTree (){
                    const saveBtn    = $$("table-saveBtn");
                    modalBox().then(function(result){
                    
                        if (result == 1){

                            setDefaultStateBtns ();
                            setDefaultStateProperty ();
                            setDirtyProperty ();

                            $$("tree").select(id);
                        } else if (result == 2){

                            if (saveBtn.isVisible()){
                                putData ();
                          
                            } else {
                                postNewData ();  
                            }
                            setDirtyProperty ();
                        }

                        if (result !== 0){
                            removeElements ($$("propertyRefbtnsContainer"));
                        }

                    });
                }
                if(prop.config.dirty){
                    modalBoxTree ();
                    return false;
                }

            },

            onBeforeSelect: function(data) {
               
                const getItemParent = $$("tree").getParentId(data);
                const filterForm = $$("filterTableForm");
                
                function setFilterDefaultState(){
                    try{
                        if (filterForm && filterForm.isVisible()){

                            filterForm.hide();

                            removeElements ($$("inputsFilter"));
                           setStateFilterBtn();

                            hideElements ($$("table-editTableBtnId"));
                            showElements ($$("table-editForm"));
                        
                        }
                    } catch (err){
                        setFunctionError(err,"sidebar","onBeforeSelect => setFilterDefaultState");
                    }
                }


                if(getItemParent=="tables"){
                    setFilterDefaultState();
                    removeElements ($$("propertyRefbtnsContainer"));
                    hideElements ($$("editTableFormProperty"));
                }


                async function getSingleTreeItem() {

                    if (!STORAGE.fields){
                        await getData("fields"); 
                    }
                  
                    let content = STORAGE.fields.content;
                    let obj = Object.keys(content); 

                
                    function generateItem (){
                        try{
                            obj.forEach(function(el) {
                                if (el == data){ 
                                    hideElements ($$("webix__none-content"));
                                    removeElements ($$("webix__null-content"));

                                    if (content[el].type == "dbtable"){
                                        showElements ($$("tables"));
                                        getInfoTable ("table", data);
                                        
                                    } else if (content[el].type == "tform"){
                                        showElements ($$("forms"));
                                        getInfoTable ("table-view", data);
                                    } else if (content[el].type == "dashboard"){
                                        showElements ($$("dashboards"));
                                        getInfoDashboard(data);
                                    }
                
                                }
                            });
                        } catch (err){
                            setFunctionError(err,"sidebar","onBeforeSelect => generateItem");
                        }
                    }

                    generateItem ();
                    
                }
                getSingleTreeItem() ;

            
            },

            onLoadError:function(xhr){
                setAjaxError(xhr, "content","sidebar onLoadError");
            },

            onBeforeOpen:function (id){

                const selectedItem = $$("tree").getItem(id);
                const idLoadElement = "load_data-tree_"+ webix.uid();

                function createLoadEl(){
                    $$("tree").data.add({
                        id:idLoadElement,
                        value:"Загрузка ..."
                    }, 0, id );  
                }

                async function getMenuChilds() {

                    if (!STORAGE.fields){
                        await getData("fields"); 
                    }
                    let content = STORAGE.fields.content;
                    let obj = Object.keys(content); 

                    function findNotUniqueItem (data){
                        let check = false;
                        try{
                            STORAGE.mmenu.mmenu.forEach(function(el,i){
                                if (el.name == data){
                                    check = true;
                                    
                                }
                            });
                        } catch (err){
                            setFunctionError(err,"sidebar","onBeforeOpen => findNotUniqueItem");
                        }
                        return check;
                    }

                    function removeTreeLoadEl(){
                        try{
                            if($$("tree").exists(idLoadElement)){
                                $$("tree").remove(idLoadElement);
                            }
                        } catch (err){
                            setFunctionError(err,"sidebar","onBeforeOpen => removeTreeLoadEl");
                        }
                    }

                    function generateMenuData (typeChild){
                        try{
                            obj.forEach(function(data) {
                                if (content[data].type == typeChild && !findNotUniqueItem(data)){ 

                                    $$("tree").data.add({
                                            id:data, 
                                            value:(content[data].plural) ? 
                                            content[data].plural         : 
                                            content[data].singular       , 
                                            "type":content[data].type
                                    }, 0, id ); 
                                    
                                    removeTreeLoadEl();
                            
                                }
                            });
                        } catch (err){
                            setFunctionError(err,"sidebar","onBeforeOpen => generateMenuData");
                        }
                
                    }

                    if (selectedItem.action.includes("all_")){
                        let index = selectedItem.action.indexOf("_");
                        let type = selectedItem.action.slice(index+1);
                        generateMenuData (type);
                    }
                
                    
                }

                if ($$("tree").getItem(id).$count===-1){
                    createLoadEl();
                    getMenuChilds();
                }
      
            },

            onAfterSelect:function(id){
              
                async function getFields (){
                    if (!STORAGE.mmenu){
                        await getData("fields"); 
                    }

                    if (STORAGE.fields){
                        try{
                            Backbone.history.navigate("tree/"+id, { trigger:true });
                        } catch (err){
                            setFunctionError(err,"sidebar","onAfterSelect => getFields");
                        }
                    }
                }
                function setAdaptiveState(){
                    try{
                        if (window.innerWidth < 850 ){
                            $$("tree").hide();
                        }
                    } catch (err){
                        setFunctionError(err,"sidebar","onAfterSelect => setAdaptiveState");
                    }
                }

                getFields ();
                setAdaptiveState();
                
              
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
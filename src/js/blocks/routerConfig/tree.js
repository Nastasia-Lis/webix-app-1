
import {setFunctionError} from "../errors.js";
import {STORAGE,getData} from "../globalStorage.js";
import {hideElem,showElem} from "../commonFunctions.js";

import {getInfoTable,getInfoDashboard} from "../content.js";

import {getWorkspace} from "./common.js";


function treeRouter(id){
    
    function notFoundPopup(){

        const popupHeadline = {   
            template:"Что-то пошло не так...", 
            width:250,
            css:"popup-headline", 
            borderless:true, 
            height:20 
        };
        const btnClosePopup = {
            view:"button",
            id:"buttonClosePopup",
            css:"popup_close-btn",
            type:"icon",
            width:35,
           
            icon: 'wxi-close',
            click:function(){
                try{
                    if ($$("popupNotFound")){
                        $$("popupNotFound").hide();
                    }
                } catch (err){
                    setFunctionError(err,"router","router:tree, btnClosePopup click");
                }
            
            }
        };
    
        const popupSubtitle = {   
            template:"Страница не найдена",
            css:"webix_template-not-found-descr", 
            borderless:true, 
            height:35 
        };
    
        const mainBtnPopup = {
            view:"button",
            css:"webix_btn-not-found-back",
            height:46,
            value:"Вернуться на главную",
            click:function(){
                function destructPopup(){
                    try{
                        if ($$("popupNotFound")){
                            $$("popupNotFound").destructor();
                        }
                    } catch (err){
                        setFunctionError(err,"router","router:tree, mainBtnPopup click destructPopup");
                    }
                }
                function navigate(){
                    try{
                        Backbone.history.navigate("content", { trigger:true});
                        window.location.reload();
                    } catch (err){
                        setFunctionError(err,"router","router:tree, mainBtnPopup click navigate");
                    }
                }
                destructPopup();
                navigate();
             
           
            }
        };
    
        webix.ui({
            view:"popup",
            id:"popupNotFound",
            css:"webix_popup-prev-href",
            width:340,
            height:125,
            position:"center",
            body:{
                rows:[
                {rows: [ 
                    { cols:[
                        popupHeadline,
                        {},
                        btnClosePopup,
                    ]},
                    popupSubtitle,
                    mainBtnPopup,
                    {height:20}
                ]}]
                
            },
    
        }).show();
    }
    function showNotFoundPopup (){
        try{
            setTimeout(function(){
                notFoundPopup();
            }, 1500);
        } catch (err){
            setFunctionError(err,"router","router:tree function showNotFoundPopup");
        }
    }
    
    function showTableData (){
        let fieldsData;
        let checkFound = false;
        fieldsData = STORAGE.fields.content;
    
        function showElem(idElem){
            try{
                if ($$(idElem)){
                    $$(idElem).show();
                }
            } catch (err){
                setFunctionError(err,"router","router:tree function showTableData (element: "+idElem+")");
            }
        }
    
    
        function createElem(){
            try{
                Object.values(fieldsData).forEach(function(field,i){
                
                    if (Object.keys(fieldsData)[i] == id){
                        checkFound=true;
                        
                        if (field.type == "dbtable" || 
                            field.type == "tform"   || 
                            field.type == "dashboard"){
                            
                                hideElem($$("webix__none-content"));
    
                            if (field.type == "dbtable"){
                                showElem("tables");
                                getInfoTable ("table", id);
                        
                                
                            } else if (field.type == "tform"){
                                showElem("forms");
                                getInfoTable ("table-view", id);
    
                            } else if (field.type == "dashboard"){
                                showElem("dashboards");
                                getInfoDashboard(id);
                            }
                            
                        } 
                    }
                });
            } catch (err){
                setFunctionError(err,"router","router:tree function createElem");
            }
        }
        createElem();
    
        if (!checkFound){
            showNotFoundPopup ();
        }
    }
    
    function setTableName (){
    
        if ($$("table-templateHeadline") ){
            try{
                STORAGE.tableNames.forEach(function(el,i){
                    if (el.id == id){
                        if($$("table-templateHeadline")){
                            $$("table-templateHeadline").setValues(el.name);
                        }
                    }
                    
                });
            } catch (err){
                setFunctionError(err,"router","router:tree function setTableName element table-templateHeadline");
            }
        } 
        
        if ($$("table-view-templateHeadline")){
            try{
                STORAGE.tableNames.forEach(function(el,i){
                    if (el.id == id){
                        if($$("table-view-templateHeadline")){
                            $$("table-view-templateHeadline").setValues(el.name);
                        }
                    
                    }
                    
                });
            } catch (err){
                setFunctionError(err,"router","router:tree function setTableName element table-view-templateHeadline");
            }
        }
    }
    
    async function getTableData (){
    
    
        if (!STORAGE.fields){
            await getData("fields"); 
        }
     
        if (STORAGE.fields){
            showTableData ();
            setTableName ();
        }
    }
    
    async function createTable (){
        await getWorkspace ();
    
        try{
    
            $$("tree").attachEvent("onAfterLoad", function () {
                let parentId;
    
                function treeselectItem(){
                    parentId = $$("tree").getParentId(id);
                    $$("tree").open(parentId);
                    $$("tree").select(id);
                }
    
                if ($$("tree").getItem(id)){
                
                    treeselectItem();
                
                } else if (!STORAGE.fields) {
                    getTableData ();
            
                } else if (STORAGE.fields){
                    showTableData ();
                    setTableName ();
                } 
            
            });
        } catch (err){
            setFunctionError(err,"router","router:tree function createTable");
        }
    }
    
    function checkTable(){
        try {
            if ($$("tree").data.order.length == 0){
                createTable ();
            }
        } catch (err){
            setFunctionError(err,"router","router:tree function checkTable");
    
        }
    }
   
    checkTable();

   
}

export {
    treeRouter
};
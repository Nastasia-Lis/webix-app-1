
import { setFunctionError }     from "../errors.js";
import { STORAGE, getData }     from "../globalStorage.js";
import { hideElem }             from "../commonFunctions.js";

import { getInfoTable }         from "../getContent/getInfoTable.js";
import { getInfoDashboard }     from "../getContent/getInfoDashboard.js";

import { getWorkspace }         from "./common.js";

const logNameFile = "router => tree";

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
                    const popup = $$("popupNotFound");
                    if (popup){
                        popup.hide();
                    }
                } catch (err){
                    setFunctionError(err,logNameFile,"btnClosePopup click");
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
                        setFunctionError(err,logNameFile,"mainBtnPopup click destructPopup");
                    }
                }
                function navigate(){
                    try{
                        Backbone.history.navigate("content", { trigger:true});
                        window.location.reload();
                    } catch (err){
                        setFunctionError(err,logNameFile,"mainBtnPopup click navigate");
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
            setTimeout( function (){
                notFoundPopup();
            }, 1500);
        } catch (err){
            setFunctionError(err, logNameFile, "showNotFoundPopup");
        }
    }
    
    function showTableData (){
        let fieldsData;
        let checkFound = false;
        fieldsData = STORAGE.fields.content;
    
        function showElem(idElem){
            try{
                const elem = $$(idElem);
                if (elem){
                    elem.show();
                }
            } catch (err){
                setFunctionError(err, logNameFile, "showTableData (element: " + idElem + ")");
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
                setFunctionError(err,logNameFile,"createElem");
            }
        }
        createElem();


    
        if (!checkFound){
            showNotFoundPopup ();
        }
    }
    
    function setTableName (){
        const tempalte     = "table-templateHeadline";
        const tempalteView = "table-view-templateHeadline";
         
        if ($$(tempalte)){
            const headline = $$(tempalte);
            try{
                STORAGE.tableNames.forEach(function(el,i){
                    if (el.id == id){
                        if(headline){
                            headline.setValues(el.name);
                        }
                    }
                    
                });
            } catch (err){
                setFunctionError(err, logNameFile, "setTableName");
            }
        } 
        
        if ($$(tempalteView)){
            const headline = $$(tempalteView);
            try{
                STORAGE.tableNames.forEach(function(el,i){
                    if (el.id == id){
                        if(headline){
                            headline.setValues(el.name);
                        }
                    
                    }
                    
                });
            } catch (err){
                setFunctionError(
                    err, 
                    logNameFile, 
                    "setTableName element table-view-templateHeadline"
                );
            }
        }
    }
    
    function selectTreeItem(){
        const tree = $$("tree");
        const firstId = tree.getFirstId();


        const pull = $$("tree").data.pull;
        const values = Object.values(pull);
      
        let topParent;
        values.forEach(function(el,i){
       
            if (el.webix_kids && !(tree.exists(id))){

                const obj = [el.id];

                tree.callEvent("onBeforeOpen", obj);

                topParent = el.id;
            }

        });

        function setScroll(){
            const scroll = tree.getScrollState();
            tree.scrollTo(0, scroll.y); 
        }

        if (tree.exists(id)){
            if (topParent){
            
                tree.open     (topParent, true);
                tree.select   (id);
                tree.showItem (id);

                setScroll();
            }

        }

    }

    async function getTableData (){
        
      
    
        if (!STORAGE.fields){
            await getData("fields"); 
        }
     
        if (STORAGE.fields){
            showTableData   ();
            setTableName    ();
            selectTreeItem  ();

        }
    }
    
    async function createTable (){
        await getWorkspace ();

        try{   
            const tree = $$("tree");
            tree.attachEvent("onAfterLoad", function () {

                function treeselectItem(){
                    const parentId = tree.getParentId(id);
                    tree.open(parentId);
                    tree.select(id);
                }
    
                if (tree.getItem(id)){
                
                    treeselectItem();
                
                } else if (!STORAGE.fields) {
                    getTableData ();
            
                } else if (STORAGE.fields){
                    showTableData ();
                    setTableName ();
                } 
                    
            });
        } catch (err){
            setFunctionError(err,logNameFile,"createTable");
        }
    }
    
    function checkTable(){
        try {
            const tree = $$("tree");
            if (tree.data.order.length == 0){
                createTable ();
                
            }
        } catch (err){
            setFunctionError(err,logNameFile,"checkTable");
    
        }    
      
    }
   
    checkTable();
  
}

export {
    treeRouter
};
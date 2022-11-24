
import { setFunctionError }             from "../../blocks/errors.js";
import { LoadServerData, GetFields }    from "../../blocks/globalStorage.js";
import { Action }                       from "../../blocks/commonFunctions.js";
import { mediator }                     from "../../blocks/_mediator.js";

import { getWorkspace }                 from "./common.js";

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
     
        let checkFound = false;
    
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
                const keys   = GetFields.keys;
                const values = GetFields.values;
               
                values.forEach(function(field, i){
           
                    if (keys[i] == id){
                       
                        checkFound = true;
                   
                        if (field.type == "dbtable" || 
                            field.type == "tform"   || 
                            field.type == "dashboard"){    
                                Action.hideItem($$("webix__none-content"));
    
                            if (field.type == "dbtable"){
                                mediator.tables.showView();
                                mediator.tables.load(id);

                                
                            } else if (field.type == "tform"){
                                mediator.forms.showView(id);
                                mediator.forms.load(id);
    
                            } else if (field.type == "dashboard"){
                                mediator.dashboards.showView();
                                mediator.dashboards.load(id);
                            }
                            
                        } 
                    }
                });
            } catch (err){
                setFunctionError(err, logNameFile, "createElem");
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
        const names        = GetFields.names;

        function setName(element){
            if (element){
                const headline = element;
                try{
                    names.forEach(function(el, i){
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
        }
        setName($$(tempalte));
        setName($$(tempalteView));
 
    }
    
    function selectTreeItem(){
        const tree = $$("tree");

        const pull = tree.data.pull;
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

        await LoadServerData.content("fields");
        const keys = GetFields.keys;
     
        if (keys){
            showTableData   ();
            setTableName    ();
            selectTreeItem  ();
        }

  
    }
    
    async function createTableSpace (){
        await getWorkspace ();
        const isFieldsExists = GetFields.keys;
        try{   
            const tree = $$("tree");
            tree.attachEvent("onAfterLoad", webix.once(function(id){
                if (!isFieldsExists) {
                    getTableData ();
                } 
            }));         
           
        } catch (err){
            setFunctionError(err, logNameFile, "createTable");
        }

    }
    
    function checkTable(){
        try {
            const tree = $$("tree");
            if (tree.data.order.length == 0){
                createTableSpace ();
                
            }
        } catch (err){
            setFunctionError(err, logNameFile, "checkTable");
    
        }    
      
    }

    checkTable();
  
}

export {
    treeRouter
};
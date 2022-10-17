import {setFunctionError} from "./errors.js";
import  {STORAGE,getData} from "./globalStorage.js";

function hideElem(elem){
    try{
        if (elem && elem.isVisible()){
            elem.hide();
        }
    } catch (err){
        setFunctionError(err,"adaptive","hideElem");
    }
}

function showElem (elem){
    try{
        if (elem && !(elem.isVisible())){
            elem.show();
        }
    } catch (err){
        setFunctionError(err,"adaptive","showElem");
    }
}

function removeElem (elem){
    try{
    
        if (elem){
            const parent = elem.getParentView();
            parent.removeView(elem);
        }
    } catch (err){
        setFunctionError(err,"adaptive","removeElem");
    }
}



// function resizeAdaptive (){

//     function autoResizePopup (popupId,k=1.3){

//         function decreasePopup(){
//             try{
//                 if($$(popupId) && window.innerWidth/$$(popupId).$width < k){

//                     if( $$(popupId).$width > 100){
//                         let size = $$(popupId).$width - 20;
//                         $$(popupId).config.width = size;
            
//                         $$(popupId).resize();
        
//                     }
        
//                 } 
//             } catch (err){
//                 setFunctionError(err,"adaptive"," autoResizePopup => decreasePopup")
//             }
//         }

//         function increasePopup(){

//             try{
                
//                 if($$(popupId) && window.innerWidth/$$(popupId).$width > k){

//                     let size = $$(popupId).$width + 20;

//                     $$(popupId).config.width = size;
            
//                     $$(popupId).resize();

                
//                 }
//             } catch (err){
//                 setFunctionError(err,"adaptive","autoResizePopup => increasePopup")
//             }
//         }
//         decreasePopup();
//         increasePopup();
      
    
//     }

//     window.addEventListener('resize', function(event) {
  
//     function resizeSidebar(){

    
//     function resizeTree(){
//         try{
//             if ($$("tree")){
//                 $$("tree").config.width = 250;
//                 $$("tree").resize();
//             }
//         } catch (err){
//             setFunctionError(err,"adaptive","resizeSidebar => resizeTree");
//         }
//     } 

    
//     if (window.innerWidth < 850){
//         hideElem($$("tree"));
//     }

//     if (!$$("tree").isVisible()  && 
//         window.innerWidth <= 800 ){
//         hideElem($$("sideMenuResizer"));
//     }

//     if (window.innerWidth > 850 && $$("tree")){
//         resizeTree();
//     }
    
//     }

//     function resizeForms(){

//         function createPopupForms (){
//             const filterBar = $$("table-view-filterId").getParentView();
//             let inputs = Object.values($$("customInputs")._collection);
//             let customInputsCollection = inputs; 
//             let inputsContainer = $$("customInputsMain").getParentView();
          
//             function setInputParameters(){
//                 try{
//                     if(customInputsCollection.length){
//                         customInputsCollection.forEach(function(el,i){
//                             el.bottomPadding = 10;
//                             if (el.width){
//                                 delete el.width;
//                             }

//                             if (el.minWidth){
//                                 delete el.minWidth;
//                             }

//                             if (el.maxWidth){
//                                 delete el.maxWidth;
//                             }
//                         });
//                     }
//                 } catch (err){
//                     setFunctionError(err,"adaptive","resizeForms => createPopupForms");
//                 }
//             }

//             customInputsCollection = {
//                 id:"customInputsAdaptive",
//                 rows:[
//                     {   id:"customInputs",
//                         rows:customInputsCollection
//                     }
//                 ]
//             }; 
            
//             setInputParameters();
//             removeElem ($$("customInputsMain"));

//             const formPopupHeadline ={
//                 template:"Доступные действия", 
//                 css:"webix_template-actions", 
//                 borderless:true, 
//                 height:40 
//             };

//             const formPopupCloseBtn = {
//                 view:"button",
//                 id:"buttonClosePopupActions",
//                 css:"popup_close-btn",
//                 type:"icon",
//                 hotkey: "esc",
//                 width:25,
//                 icon: 'wxi-close',
//                 click:function(){
//                     hideElem($$("contextActionsPopup"));
                
//                 }
//             };
            
//             const formPopupContsiner = {
//                 view:"scrollview",
//                 borderless:true,
//                 scroll:"y", 
//                 body:{ 
//                     id:"contextActionsPopupContainer",
//                     css:"webix_context-actions-popup",
//                     rows:[ 
//                         customInputsCollection
//                     ]
//                 }
//             };

//             const popupForm = webix.ui({
//                 view:"popup",
//                 css:"webix_popup-actions-container webix_popup-config",
//                 modal:true,
//                 id:"contextActionsPopup",
//                 escHide:true,
//                 position:"center",
//                 width:400,
//                 body:{
//                     rows:[
//                         {cols:[
//                             formPopupHeadline,
//                             formPopupCloseBtn,
//                         ]},
//                         formPopupContsiner
//                     ]
//                 }
//             });

//             const popupShowBtn = {
//                 view:"button", 
//                 id:"contextActionsBtnAdaptive",
//                 maxWidth:100, 
//                 value:"Действия", 
//                 css:"webix_primary", 
//                 popup:popupForm,
//                 click:function(){
//                     function setPopupHeight (){
//                         try{
//                             if ( $$("contextActionsPopup").config.height !== $$("customInputsAdaptive").$height +60){
//                                 $$("contextActionsPopup").config.height = $$("customInputsAdaptive").$height +60
//                                 $$("contextActionsPopup").resize();
//                             }
//                         } catch (err){
//                             setFunctionError(err,"adaptive","resizeForms => popupShowBtn click");
//                         }
//                     }
//                     setPopupHeight ();
//                 }
                
                
//             };

//             function addAdaptiveFormView(){
//                 try{
//                     if($$(filterBar.config.id)){
//                         $$(filterBar.config.id).addView(popupShowBtn,2);
//                     }
//                 } catch (err){
//                     setFunctionError(err,"adaptive","resizeForms => addAdaptiveFormView");
//                 }
//             }

//             addAdaptiveFormView();

//         }

//         function removePopupForms(){
//             const  filterBar = $$("table-view-filterId").getParentView();
//             const inputs = $$("customInputsAdaptive")._collection[0].rows;
//             const collection = {
//                 id:"customInputs",
//                 cols:inputs
//             };

//             function destructPopupForms(){
//                 try{
//                     if ($$("contextActionsPopup")){
//                         $$("contextActionsPopup").destructor();
//                     }
//                 } catch (err){
//                     setFunctionError(err,"adaptive","resizeForms => destructPopupForms");
//                 }
//             }

//             function addAdaptiveInputs(){
//                 try{
//                     $$(filterBar.config.id).addView( 
//                         {id:"customInputsMain",cols:
//                             [
//                                 collection
//                             ]
//                         }
//                     ,2);
//                 } catch (err){
//                     setFunctionError(err,"adaptive","resizeForms => addAdaptiveInputs");
//                 }
//             }
//             removeElem ($$("contextActionsBtnAdaptive"));
//             destructPopupForms();

//             if (!($$("customInputs"))){
//                 addAdaptiveInputs();
//             }
//         }


     
//         if (window.innerWidth < 830 && !($$("contextActionsBtn"))){

//             if ($$("customInputsMain")){
//                 createPopupForms ();
//             }

//         } else if (window.innerWidth > 830 && $$("contextActionsBtnAdaptive")||window.innerWidth > 830 && $$("contextActionsBtn")){
            
//             if ($$("customInputsAdaptive")){
//                 removePopupForms();
                
//             } 

//         }


//         autoResizePopup ("contextActionsPopup");

      
//     }

//     function resizeDashboards(){

//         function createDashAdaptive(){
//             let tools;
           
//             function getTools(){
//                 let tools;
//                 if ($$("dashboard-tool-main")){
//                     tools = $$("dashboard-tool-main")._collection;
//                 }
//                 return tools;
//             }

//             function createFilterPopupBtn (){
//                 return {
//                     view:"button", 
//                     id:"dashFilterBtn", 
//                     value:"Фильтры", 
//                     css:{"margin":"10px 0px!important"}, 
//                     height:46,
//                     margin:10,
//                     popup:webix.ui({
//                         view:"popup",
//                         css:"webix_popup-dash-container webix_popup-config",
//                         modal:true,
//                         id:"contextDashFilterPopup",
//                         escHide:true,
//                         position:"center",
//                         body:{
//                             id:"contextDashFilterPopupContainer",
//                             rows:[]
//                         }
//                     }),
//                     click:function(){
//                         showElem ($$("contextDashFilterPopup"));
//                         showElem ($$("buttonClosePopupDashFilter"));
//                     }
//                 };
//             }

//             function addDashAdaptive(){
//                 try{
//                     $$("dashboardInfoContainer").addView(
//                         {   id:"dashboard-tool-adaptive",
//                             cols:[
//                                 createFilterPopupBtn ()
//                             ]
//                         }
//                     ,0);
              
//                 } catch (err){
//                     setFunctionError(err,"adaptive","resizeDashboards => addDashAdaptive");
//                 }
//             }
          
//             function removeDashTool(){
//                 tools = getTools();
//                 removeElem ($$("dashboard-tool-main"));
//             }

//             function addAdaptiveInputs(tools){
//                 try{
//                     $$("contextDashFilterPopupContainer").addView( {
//                         id:"dashToolInputsAdaptive",  
//                         rows:tools
//                     });
//                 } catch (err){
//                     setFunctionError(err,"adaptive","resizeDashboards => addAdaptiveInputs");
//                 }
//             }


//             if ($$("dashboard-tool-main") && $$("dashboard-tool-main").isVisible()){
                    
//                 hideElem($$("dashboard-tool-main"));
//                 if (!($$("dashFilterBtn"))){ //id:"dashboard-tool-adaptive"
           
//                     addDashAdaptive();
//                 }

//                 removeDashTool();

//                 if (!$$("dashToolInputsAdaptive")){
                                        
//                     addAdaptiveInputs(tools);
//                 } 
//             }
//         }


//         function createDashMain(){
         
//             let tools;
//             function removeDashAdaptiveTools(){

//                 tools = $$("dashToolInputsAdaptive")._collection;
//                 removeElem ($$("dashboard-tool-adaptive"));
//             }
            
//             function destructDashPopup(){
      
//                 try{
//                     if ($$("contextDashFilterPopup")){
//                         $$("contextDashFilterPopup").destructor();
//                     }
//                 } catch (err){
//                     setFunctionError(err,"adaptive","resizeDashboards => destructDashPopup");
//                 }
                
//             }

//             function addMainTool(){

//                 try{
//                     $$("dashboardTool").addView({  
//                         id:"dashboard-tool-main",
//                         padding:20,
//                         minWidth:250,
//                         rows:tools, 
//                     });
//                 } catch (err){
//                     setFunctionError(err,"adaptive","resizeDashboards => addMainTool");
//                 }
                    
//             }

//             if($$("dashFilterBtn")){
//                 removeDashAdaptiveTools();
//                 destructDashPopup();
//                 removeElem ($$("dashFilterBtn"));
//                 addMainTool();
//                 hideElem($$("buttonClosePopupDashFilter"));
//             }
//         }
        
//         if (window.innerWidth < 850){
//             createDashAdaptive();
//         }


//         if (window.innerWidth > 850){
       
//             createDashMain();
//         }

//         autoResizePopup ("contextDashFilterPopupContainer");
                
//     }

//     function resizeTableEditForm(){
        
//         function tableAdaptiveView(){
      


//             function createTablePopup(){
//                 return webix.ui({
//                     view:"popup",
//                     css:"webix_popup-table-container webix_popup-config",
//                     modal:true,
//                     id:"tableEditPopup",
//                     escHide:true,
//                     position:"center",
//                     body:{
//                         id:"tableEditPopupContainer",
//                         rows:[]
//                     }
//                 }).show();
//             }
      
//             function addPopupElements(){
//                 try{
//                     if($$("tableEditPopupContainer")){
//                         $$("tableEditPopupContainer").addView($$("editTableBarAdaptive"));
//                     }
//                 } catch (err){
//                     setFunctionError(err,"adaptive","resizeTableEditForm => addPopupElements");
//                 }
//             }


//             function enableNewAddBtn(){
//                 try{
//                     if ($$("table-newAddBtnId") && !($$("table-newAddBtnId").isEnabled())){
//                         $$("table-newAddBtnId").enable();
//                     }
//                 } catch (err){
//                     setFunctionError(err,"adaptive","resizeTableEditForm => enableNewAddBtn");
//                 }
//             }

//             function addEditElements(){
//                 try{
//                     if ($$("tableEditPopupContainer")){
//                         $$("tableEditPopupContainer").addView($$("editTableBarAdaptive"));
//                     }
//                 } catch (err){
//                     setFunctionError(err,"adaptive","resizeTableEditForm => addEditElements");
//                 }
//             }
      
//             function setBtnState(){
//                 try{
//                     if($$("table-saveNewBtn").isEnabled() && $$("table-newAddBtnId").isEnabled()){
//                         $$("table-newAddBtnId").disable();
//                     } else {
//                         $$("table-newAddBtnId").enable();
//                     }
//                 } catch (err){
//                     setFunctionError(err,"adaptive","resizeTableEditForm => setBtnState");
//                 }
//             }
//           //  showElem ($$("table-editTableBtnId"));
//             hideElem($$("editTableBarContainer"));
           

//             if ($$("table-editForm") && $$("table-editForm").isDirty()){
//                if (!($$("tableEditPopup"))){
//                 createTablePopup();
//                 addPopupElements();
//                 showElem ($$("editTableBarHeadline"));

//                 } else {
//                     showElem ($$("tableEditPopup"));

//                     if ($$("tableEditPopupContainer").getChildViews().length){
//                         enableNewAddBtn();
//                         showElem ($$("editTableBarContainer"));

//                     } else {
//                         addEditElements();
//                         showElem ($$("editTableBarHeadline"));
//                     }
//                 }
//                 setBtnState();
//             }

//             autoResizePopup ("editFilterBarAdaptive", 1.5);
//         }

//         function tableMainView(){



//             function addEditElements(){
//                 try{
//                     if ( $$("editTableBarContainer")){
//                         $$("editTableBarContainer").addView($$("editTableBarAdaptive"))
//                     }
//                 } catch (err){
//                     setFunctionError(err,"adaptive","resizeTableEditForm => addEditElements");
//                 }
//             }

//             function setEditBarWidth(){
//                 try{
//                     if ( $$("editTableBarAdaptive")){
//                         $$("editTableBarAdaptive").config.width = 350;
//                         $$("editTableBarAdaptive").resize();
//                     }
//                 } catch (err){
//                     setFunctionError(err,"adaptive","resizeTableEditForm => setEditBarWidth");
//                 }
//             }
     
  
//             hideElem($$("tableEditPopup"));

//             if (!($$("editTableBarContainer")   &&  $$("editTableBarContainer").isVisible  ()  || 
//                   $$("filterTableBarContainer") &&  $$("filterTableBarContainer").isVisible()) ){
                
//                 showElem ($$("editTableBarContainer"));
//                 hideElem($$("filterTableForm"));
//                 showElem ($$("table-editForm"));
//             }
        
//             addEditElements();
//             showElem ($$("editTableBarAdaptive"));
//           //  hideElem($$("table-editTableBtnId"));
//             setEditBarWidth();
//             hideElem($$("editTableBarHeadline"));

//         }

    
//         if (window.innerWidth < 1200){
//             tableAdaptiveView();

//         }

//         if (window.innerWidth > 1200){
//             tableMainView();
//         }

//         autoResizePopup ("editTableBarAdaptive", 1.5);

//     }

//     function resizeTableFilterForm (){
//         function filterAdaptive(){

//             function setBtnState(){
//                 let btnClass = document.querySelector(".webix_btn-filter");
//                 try{
//                     if(btnClass && btnClass.classList.contains(".webix-transparent-btn--primary")){
//                         btnClass.classList.add(".webix-transparent-btn");
//                         btnClass.classList.remove(".webix-transparent-btn--primary");
//                     }
//                 } catch (err){
//                     setFunctionError(err,"adaptive","resizeTableFilterForm => setBtnState");
//                 }
//             }


//             function getFilterValues(){
//                 let filterFormValues;
//                 try{
//                     if ($$("filterTableForm") && $$("filterTableForm").getValues()){
//                         filterFormValues = $$("filterTableForm").getValues();
                        
//                     }
//                 } catch (err){
//                     setFunctionError(err,"adaptive","resizeTableFilterForm => getFilterValues");
//                 }
//                 return filterFormValues;
//             }

//             function addAdaptiveElements(){
//                 try{
//                     if ($$("tableFilterPopupContainer")){
//                         $$("tableFilterPopupContainer").addView($$("editFilterBarAdaptive"));
//                     }
//                 } catch (err){
//                     setFunctionError(err,"adaptive","resizeTableFilterForm => addAdaptiveElements");
//                 }
//             }


//             function setFilterValues(){
//                 let filterFormValues =getFilterValues();
//                 try{
//                     if (filterFormValues &&  $$("filterTableForm")){
//                         $$("filterTableForm").setValues(filterFormValues);
//                         $$("filterTableForm").setDirty();
//                         filterFormValues = null;
//                     }
//                 } catch (err){
//                     setFunctionError(err,"adaptive","resizeTableFilterForm => setFilterValues");
//                 }
//             }

//             setBtnState();
//             hideElem($$("filterTableBarContainer"));

           

//             if ($$("filterTableForm") && $$("filterTableForm").isDirty()){
//                 hideElem($$("editTableBarContainer"));
//                 showElem ($$("tableFilterPopup"));
//                 showElem ($$("tableFilterPopupContainer"));
//                 addAdaptiveElements();
//                 showElem ($$("editFilterBarHeadline"));
//                 showElem ($$("filterTableForm"));
//                 setFilterValues();
//             }

//             autoResizePopup ("popupFilterEdit", 1.5);
//         }

//         function filterMain(){


//             function getFormValues(){
//                 let filterFormValues;
//                 try{
//                     if ($$("filterTableForm") && $$("filterTableForm").getValues()){
//                         filterFormValues = $$("filterTableForm").getValues();
//                     }
//                 } catch (err){
//                     setFunctionError(err,"adaptive","resizeTableFilterForm => getFormValues");
//                 }
//                 return filterFormValues;
//             }

//             function addFilterElements(){
//                 const filterContainerParent = $$("editFilterBarAdaptive").getParentView();
//                 try{
//                     if (filterContainerParent.config.id !==  "filterTableBarContainer"){
//                         $$("filterTableBarContainer").addView($$("editFilterBarAdaptive"));
//                     }
//                 } catch (err){
//                     setFunctionError(err,"adaptive","resizeTableFilterForm => addFilterElements");
//                 }
//             }


//             function setSizeFilterContainer(){
//                 try{
//                     if($$("editFilterBarAdaptive")){
//                         $$("editFilterBarAdaptive").config.width = 350;
//                         $$("editFilterBarAdaptive").resize();
//                     }
//                 } catch (err){
//                     setFunctionError(err,"adaptive","resizeTableFilterForm => hideFilterHeadline");
//                 }
//             }

//             function setBtnState(){
//                 let btnClass = document.querySelector(".webix_btn-filter");
//                 try{
//                     btnClass.classList.add(".webix-transparent-btn--primary");
//                     btnClass.classList.remove(".webix-transparent-btn");
//                 } catch (err){
//                     setFunctionError(err,"adaptive","resizeTableFilterForm => setBtnState");
//                 }
//             }

//             function setFilterValues(filterFormValues){
//                 try{
//                     if (filterFormValues && $$("filterTableForm")){
//                         $$("filterTableForm").setValues(filterFormValues);
//                         filterFormValues = null;
//                     }
//                 } catch (err){
//                     setFunctionError(err,"adaptive","resizeTableFilterForm => setFilterValues");
//                 }
//             }

        
//             if ($$("tableFilterPopup").isVisible()){
//                 hideElem($$("tableFilterPopup"));

//                 let filterFormValues = getFormValues();
                
//                 addFilterElements();
//                 hideElem($$("editFilterBarHeadline"));
//                 setSizeFilterContainer();

//                 if ($$("filterTableBarContainer") && !($$("filterTableBarContainer").isVisible())){
//                     showElem ($$("filterTableForm"));
//                     hideElem($$("table-editForm"));
//                     setFilterValues(filterFormValues);
//                    setBtnState();

//                     hideElem($$("editTableBarContainer"));
//                     showElem ($$("filterTableBarContainer"));
//                 }
                
//             }
//         }
       
//         if (window.innerWidth < 1200){
//             filterAdaptive();
//         }


//         if (window.innerWidth > 1200){
//             filterMain();
//         }

//     }

//     async function getActiveView (){ // SINGLE ELS

//         if (!STORAGE.mmenu){
//             await getData("mmenu"); 
//         }

//         function setAdaptiveLogic(visibleEl){
//             if (visibleEl == "forms"){
//                 resizeForms();
//             } else if (visibleEl == "dashboards"){
//                 resizeDashboards();
//             } else if (visibleEl == "tables"){
//                 resizeTableEditForm();
//                 resizeTableFilterForm ();
//             } else if (visibleEl == "userprefs"){
//                 //none
//             } else if (visibleEl == "user_auth"){
//                 //none
//             }
//         }

//         if (STORAGE.mmenu){
//             const menuData = STORAGE.mmenu.mmenu;
//             menuData.forEach(function(el,i){
//                 if($$(el.name) && $$(el.name).isVisible()){
//                     let visibleEl = el.name;
//                     setAdaptiveLogic(visibleEl);
//                 }
//             });
        
             
//         }
//     }
  
//     getActiveView ();
//     resizeSidebar();

//     }, true);
// }


function resizeAdaptive (){

    function autoResizePopup (popupId,k=1.3){

        function decreasePopup(){
            try{
                if($$(popupId) && window.innerWidth/$$(popupId).$width < k){

                    if( $$(popupId).$width > 100){
                        let size = $$(popupId).$width - 20;
                        $$(popupId).config.width = size;
            
                        $$(popupId).resize();
        
                    }
        
                } 
            } catch (err){
                setFunctionError(err,"adaptive"," autoResizePopup => decreasePopup")
            }
        }

        function increasePopup(){

            try{
                
                if($$(popupId) && window.innerWidth/$$(popupId).$width > k){

                    let size = $$(popupId).$width + 20;

                    $$(popupId).config.width = size;
            
                    $$(popupId).resize();

                
                }
            } catch (err){
                setFunctionError(err,"adaptive","autoResizePopup => increasePopup")
            }
        }
        decreasePopup();
        increasePopup();
      
    
    }

    window.addEventListener('resize', function(event) {
  
    function resizeSidebar(){

    
        function resizeTree(){
            try{
                if ($$("tree")){
                    $$("tree").config.width = 250;
                    $$("tree").resize();
                }
            } catch (err){
                setFunctionError(err,"adaptive","resizeSidebar => resizeTree");
            }
        } 

        
        if (window.innerWidth < 850){
            hideElem($$("tree"));
        }

        if (!$$("tree").isVisible()  && 
            window.innerWidth <= 800 ){
            hideElem($$("sideMenuResizer"));
        }

        if (window.innerWidth > 850 && $$("tree")){
            resizeTree();
        }
        
    }



    function resizeForms(){

        function createPopupForms (){
            const filterBar = $$("table-view-filterId").getParentView();
            let inputs = Object.values($$("customInputs")._collection);
            let customInputsCollection = inputs; 
            let inputsContainer = $$("customInputsMain").getParentView();
          
            function setInputParameters(){
                try{
                    if(customInputsCollection.length){
                        customInputsCollection.forEach(function(el,i){
                            el.bottomPadding = 10;
                            if (el.width){
                                delete el.width;
                            }

                            if (el.minWidth){
                                delete el.minWidth;
                            }

                            if (el.maxWidth){
                                delete el.maxWidth;
                            }
                        });
                    }
                } catch (err){
                    setFunctionError(err,"adaptive","resizeForms => createPopupForms");
                }
            }

            customInputsCollection = {
                id:"customInputsAdaptive",
                rows:[
                    {   id:"customInputs",
                        rows:customInputsCollection
                    }
                ]
            }; 
            
            setInputParameters();
            removeElem ($$("customInputsMain"));

            const formPopupHeadline ={
                template:"Доступные действия", 
                css:"webix_template-actions", 
                borderless:true, 
                height:40 
            };

            const formPopupCloseBtn = {
                view:"button",
                id:"buttonClosePopupActions",
                css:"popup_close-btn",
                type:"icon",
                hotkey: "esc",
                width:25,
                icon: 'wxi-close',
                click:function(){
                    hideElem($$("contextActionsPopup"));
                
                }
            };
            
            const formPopupContsiner = {
                view:"scrollview",
                borderless:true,
                scroll:"y", 
                body:{ 
                    id:"contextActionsPopupContainer",
                    css:"webix_context-actions-popup",
                    rows:[ 
                        customInputsCollection
                    ]
                }
            };

            const popupForm = webix.ui({
                view:"popup",
                css:"webix_popup-actions-container webix_popup-config",
                modal:true,
                id:"contextActionsPopup",
                escHide:true,
                position:"center",
                width:400,
                body:{
                    rows:[
                        {cols:[
                            formPopupHeadline,
                            formPopupCloseBtn,
                        ]},
                        formPopupContsiner
                    ]
                }
            });

            const popupShowBtn = {
                view:"button", 
                id:"contextActionsBtnAdaptive",
                maxWidth:100, 
                value:"Действия", 
                css:"webix_primary", 
                popup:popupForm,
                click:function(){
                    function setPopupHeight (){
                        try{
                            if ( $$("contextActionsPopup").config.height !== $$("customInputsAdaptive").$height +60){
                                $$("contextActionsPopup").config.height = $$("customInputsAdaptive").$height +60
                                $$("contextActionsPopup").resize();
                            }
                        } catch (err){
                            setFunctionError(err,"adaptive","resizeForms => popupShowBtn click");
                        }
                    }
                    setPopupHeight ();
                }
                
                
            };

            function addAdaptiveFormView(){
                try{
                    if($$(filterBar.config.id)){
                        $$(filterBar.config.id).addView(popupShowBtn,2);
                    }
                } catch (err){
                    setFunctionError(err,"adaptive","resizeForms => addAdaptiveFormView");
                }
            }

            addAdaptiveFormView();

        }

        function removePopupForms(){
            const  filterBar = $$("table-view-filterId").getParentView();
            const inputs = $$("customInputsAdaptive")._collection[0].rows;
            const collection = {
                id:"customInputs",
                cols:inputs
            };

            function destructPopupForms(){
                try{
                    if ($$("contextActionsPopup")){
                        $$("contextActionsPopup").destructor();
                    }
                } catch (err){
                    setFunctionError(err,"adaptive","resizeForms => destructPopupForms");
                }
            }

            function addAdaptiveInputs(){
                try{
                    $$(filterBar.config.id).addView( 
                        {id:"customInputsMain",cols:
                            [
                                collection
                            ]
                        }
                    ,2);
                } catch (err){
                    setFunctionError(err,"adaptive","resizeForms => addAdaptiveInputs");
                }
            }
            removeElem ($$("contextActionsBtnAdaptive"));
            destructPopupForms();

            if (!($$("customInputs"))){
                addAdaptiveInputs();
            }
        }


     
        if (window.innerWidth < 830 && !($$("contextActionsBtn"))){

            if ($$("customInputsMain")){
                createPopupForms ();
            }

        } else if (window.innerWidth > 830 && $$("contextActionsBtnAdaptive")||window.innerWidth > 830 && $$("contextActionsBtn")){
            
            if ($$("customInputsAdaptive")){
                removePopupForms();
                
            } 

        }


        autoResizePopup ("contextActionsPopup");

      
    }

    function resizeDashboards(){

        function createDashAdaptive(){
            let tools;
           
            function getTools(){
                let tools;
                if ($$("dashboard-tool-main")){
                    tools = $$("dashboard-tool-main")._collection;
                }
                return tools;
            }

            function createFilterPopupBtn (){
                return {
                    view:"button", 
                    id:"dashFilterBtn", 
                    value:"Фильтры", 
                    css:{"margin":"10px 0px!important"}, 
                    height:46,
                    margin:10,
                    popup:webix.ui({
                        view:"popup",
                        css:"webix_popup-dash-container webix_popup-config",
                        modal:true,
                        id:"contextDashFilterPopup",
                        escHide:true,
                        position:"center",
                        body:{
                            id:"contextDashFilterPopupContainer",
                            rows:[]
                        }
                    }),
                    click:function(){
                        showElem ($$("contextDashFilterPopup"));
                        showElem ($$("buttonClosePopupDashFilter"));
                    }
                };
            }

            function addDashAdaptive(){
                try{
                    $$("dashboardInfoContainer").addView(
                        {   id:"dashboard-tool-adaptive",
                            cols:[
                                createFilterPopupBtn ()
                            ]
                        }
                    ,0);
              
                } catch (err){
                    setFunctionError(err,"adaptive","resizeDashboards => addDashAdaptive");
                }
            }
          
            function removeDashTool(){
                tools = getTools();
                removeElem ($$("dashboard-tool-main"));
            }

            function addAdaptiveInputs(tools){
                try{
                    $$("contextDashFilterPopupContainer").addView( {
                        id:"dashToolInputsAdaptive",  
                        rows:tools
                    });
                } catch (err){
                    setFunctionError(err,"adaptive","resizeDashboards => addAdaptiveInputs");
                }
            }


            if ($$("dashboard-tool-main") && $$("dashboard-tool-main").isVisible()){
                    
                hideElem($$("dashboard-tool-main"));
                if (!($$("dashFilterBtn"))){ //id:"dashboard-tool-adaptive"
           
                    addDashAdaptive();
                }

                removeDashTool();

                if (!$$("dashToolInputsAdaptive")){
                                        
                    addAdaptiveInputs(tools);
                } 
            }
        }


        function createDashMain(){
         
            let tools;
            function removeDashAdaptiveTools(){

                tools = $$("dashToolInputsAdaptive")._collection;
                removeElem ($$("dashboard-tool-adaptive"));
            }
            
            function destructDashPopup(){
      
                try{
                    if ($$("contextDashFilterPopup")){
                        $$("contextDashFilterPopup").destructor();
                    }
                } catch (err){
                    setFunctionError(err,"adaptive","resizeDashboards => destructDashPopup");
                }
                
            }

            function addMainTool(){

                try{
                    $$("dashboardTool").addView({  
                        id:"dashboard-tool-main",
                        padding:20,
                        minWidth:250,
                        rows:tools, 
                    });
                } catch (err){
                    setFunctionError(err,"adaptive","resizeDashboards => addMainTool");
                }
                    
            }

            if($$("dashFilterBtn")){
                removeDashAdaptiveTools();
                destructDashPopup();
                removeElem ($$("dashFilterBtn"));
                addMainTool();
                hideElem($$("buttonClosePopupDashFilter"));
            }
        }
        
        if (window.innerWidth < 850){
            createDashAdaptive();
        }


        if (window.innerWidth > 850){
       
            createDashMain();
        }

        autoResizePopup ("contextDashFilterPopupContainer");
                
    }

    function resizeTableEditForm(){
     
        function tableAdaptiveView(){

            if (window.innerWidth < 850){
                console.log("меньше")
                console.log($$("table-editForm").config.width)
                $$("table-editForm").config.width = window.innerWidth;
                // $$("editTableBarContainer").config.width = window.innerWidth;
                $$("table-editForm").resize();
               // $$("tableContainer").hide()
            }
      
          
        }

        function tableMainView(){

            function addEditElements(){
                try{
                    if ( $$("editTableBarContainer")){
                        $$("editTableBarContainer").addView($$("editTableBarAdaptive"))
                    }
                } catch (err){
                    setFunctionError(err,"adaptive","resizeTableEditForm => addEditElements");
                }
            }

            function setEditBarWidth(){
                try{
                    if ( $$("editTableBarAdaptive")){
                        $$("editTableBarAdaptive").config.width = 350;
                        $$("editTableBarAdaptive").resize();
                    }
                } catch (err){
                    setFunctionError(err,"adaptive","resizeTableEditForm => setEditBarWidth");
                }
            }
     
  
            hideElem($$("tableEditPopup"));

            if (!($$("editTableBarContainer")   &&  $$("editTableBarContainer").isVisible  ()  || 
                  $$("filterTableBarContainer") &&  $$("filterTableBarContainer").isVisible()) ){
                
                showElem ($$("editTableBarContainer"));
                hideElem($$("filterTableForm"));
                showElem ($$("table-editForm"));
            }
        
            addEditElements();
            showElem ($$("editTableBarAdaptive"));
          //  hideElem($$("table-editTableBtnId"));
            setEditBarWidth();
            hideElem($$("editTableBarHeadline"));

        }

    
        if (window.innerWidth < 1200){
            tableAdaptiveView();

        }

        if (window.innerWidth > 1200){
           // tableMainView();
        }

     //   autoResizePopup ("editTableBarAdaptive", 1.5);

    }

    function resizeTableFilterForm (){
        function filterAdaptive(){

            function setBtnState(){
                let btnClass = document.querySelector(".webix_btn-filter");
                try{
                    if(btnClass && btnClass.classList.contains(".webix-transparent-btn--primary")){
                        btnClass.classList.add(".webix-transparent-btn");
                        btnClass.classList.remove(".webix-transparent-btn--primary");
                    }
                } catch (err){
                    setFunctionError(err,"adaptive","resizeTableFilterForm => setBtnState");
                }
            }


            function getFilterValues(){
                let filterFormValues;
                try{
                    if ($$("filterTableForm") && $$("filterTableForm").getValues()){
                        filterFormValues = $$("filterTableForm").getValues();
                        
                    }
                } catch (err){
                    setFunctionError(err,"adaptive","resizeTableFilterForm => getFilterValues");
                }
                return filterFormValues;
            }

            function addAdaptiveElements(){
                try{
                    if ($$("tableFilterPopupContainer")){
                        $$("tableFilterPopupContainer").addView($$("editFilterBarAdaptive"));
                    }
                } catch (err){
                    setFunctionError(err,"adaptive","resizeTableFilterForm => addAdaptiveElements");
                }
            }


            function setFilterValues(){
                let filterFormValues =getFilterValues();
                try{
                    if (filterFormValues &&  $$("filterTableForm")){
                        $$("filterTableForm").setValues(filterFormValues);
                        $$("filterTableForm").setDirty();
                        filterFormValues = null;
                    }
                } catch (err){
                    setFunctionError(err,"adaptive","resizeTableFilterForm => setFilterValues");
                }
            }

            setBtnState();
            hideElem($$("filterTableBarContainer"));

           

            if ($$("filterTableForm") && $$("filterTableForm").isDirty()){
                hideElem($$("editTableBarContainer"));
                showElem ($$("tableFilterPopup"));
                showElem ($$("tableFilterPopupContainer"));
                addAdaptiveElements();
                showElem ($$("editFilterBarHeadline"));
                showElem ($$("filterTableForm"));
                setFilterValues();
            }

            autoResizePopup ("popupFilterEdit", 1.5);
        }

        function filterMain(){


            function getFormValues(){
                let filterFormValues;
                try{
                    if ($$("filterTableForm") && $$("filterTableForm").getValues()){
                        filterFormValues = $$("filterTableForm").getValues();
                    }
                } catch (err){
                    setFunctionError(err,"adaptive","resizeTableFilterForm => getFormValues");
                }
                return filterFormValues;
            }

            function addFilterElements(){
                const filterContainerParent = $$("editFilterBarAdaptive").getParentView();
                try{
                    if (filterContainerParent.config.id !==  "filterTableBarContainer"){
                        $$("filterTableBarContainer").addView($$("editFilterBarAdaptive"));
                    }
                } catch (err){
                    setFunctionError(err,"adaptive","resizeTableFilterForm => addFilterElements");
                }
            }


            function setSizeFilterContainer(){
                try{
                    if($$("editFilterBarAdaptive")){
                        $$("editFilterBarAdaptive").config.width = 350;
                        $$("editFilterBarAdaptive").resize();
                    }
                } catch (err){
                    setFunctionError(err,"adaptive","resizeTableFilterForm => hideFilterHeadline");
                }
            }

            function setBtnState(){
                let btnClass = document.querySelector(".webix_btn-filter");
                try{
                    btnClass.classList.add(".webix-transparent-btn--primary");
                    btnClass.classList.remove(".webix-transparent-btn");
                } catch (err){
                    setFunctionError(err,"adaptive","resizeTableFilterForm => setBtnState");
                }
            }

            function setFilterValues(filterFormValues){
                try{
                    if (filterFormValues && $$("filterTableForm")){
                        $$("filterTableForm").setValues(filterFormValues);
                        filterFormValues = null;
                    }
                } catch (err){
                    setFunctionError(err,"adaptive","resizeTableFilterForm => setFilterValues");
                }
            }

        
            if ($$("tableFilterPopup").isVisible()){
                hideElem($$("tableFilterPopup"));

                let filterFormValues = getFormValues();
                
                addFilterElements();
                hideElem($$("editFilterBarHeadline"));
                setSizeFilterContainer();

                if ($$("filterTableBarContainer") && !($$("filterTableBarContainer").isVisible())){
                    showElem ($$("filterTableForm"));
                    hideElem($$("table-editForm"));
                    setFilterValues(filterFormValues);
                   setBtnState();

                    hideElem($$("editTableBarContainer"));
                    showElem ($$("filterTableBarContainer"));
                }
                
            }
        }
       
        if (window.innerWidth < 1200){
            filterAdaptive();
        }


        if (window.innerWidth > 1200){
            filterMain();
        }

    }

    async function getActiveView (){  

        if (!STORAGE.mmenu){
            await getData("mmenu"); 
        }

        function setAdaptiveLogic(visibleEl){
            if (visibleEl == "forms"){
              //  resizeForms();
            } else if (visibleEl == "dashboards"){
              //  resizeDashboards();
            } else if (visibleEl == "tables"){
                resizeTableEditForm();
              //  resizeTableFilterForm ();
            } else if (visibleEl == "userprefs"){
                //none
            } else if (visibleEl == "user_auth"){
                //none
            }
        }

        if (STORAGE.mmenu){
            const menuData = STORAGE.mmenu.mmenu;
            menuData.forEach(function(el,i){
                if($$(el.name) && $$(el.name).isVisible()){
                    let visibleEl = el.name;
                    setAdaptiveLogic(visibleEl);
                }
            });
        
             
        }
    }
  
    getActiveView ();
    resizeSidebar();

    }, true);
}



function adaptivePoints (){


    function hideTree(){
        if (window.innerWidth < 850 && $$("tree") && $$("tree").isVisible()){
            hideElem($$("tree"));
        }
    }

    function addTreeEvent(){
        if (window.innerWidth < 1200 ){
         

            $$("tree").attachEvent("onAfterLoad", function(){
                hideElem($$("editTableBarContainer"));
            });
 
            hideElem($$("editTableBarContainer"));

    
        }
    }
    function createFilterPopup(){
        if(!$$("tableFilterPopup")){
            webix.ui({
                view:"popup",
                css:"webix_popup-table-container webix_popup-config",
                modal:true,
                id:"tableFilterPopup",
                escHide:true,
                position:"center",
                body:{
                    id:"tableFilterPopupContainer",
                    rows:[]
                }
            });
        }
    }


    hideTree();
    addTreeEvent();
 //   createFilterPopup();


}
export {
    resizeAdaptive,
    adaptivePoints
};
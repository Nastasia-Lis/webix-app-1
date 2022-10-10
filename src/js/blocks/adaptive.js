import {setFunctionError} from "./errors.js";
import  {STORAGE,getData} from "./globalStorage.js";


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

    function hideTree(){
        try{
            if ( $$("tree") && $$("tree").isVisible()){
                $$("tree").hide();
            }
        } catch (err){
            setFunctionError(err,"adaptive","resizeSidebar => hideTree");
        }
    }


    function hideTreeResizer(){
        try{
            if($$("sideMenuResizer")){
                $$("sideMenuResizer").hide(); 
            }
        } catch (err){
            setFunctionError(err,"adaptive","resizeSidebar => hideTreeResizer");
        }
    }

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
        hideTree();
    }

    if (!$$("tree").isVisible()  && 
        window.innerWidth <= 800 ){
        hideTreeResizer();
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

            function removeInputs(){
                try{
                    if($$("customInputsMain")){
                        inputsContainer.removeView($$("customInputsMain"));
                    }
                } catch (err){
                    setFunctionError(err,"adaptive","resizeForms => removeInputs");
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
            removeInputs();

            const formPopupHeadline ={
                template:"Доступные действия", 
                css:"webix_template-actions", 
                borderless:true, 
                height:40 
            };

            const formPopupCloseBtn = {
                view:"button",
                id:"buttonClosePopupActions",
                css:"webix_close-btn",
                type:"icon",
                hotkey: "esc",
                width:25,
                icon: 'wxi-close',
                click:function(){
                    try{
                        if ($$("contextActionsPopup")){
                            $$("contextActionsPopup").hide();
                        }
                    } catch (err){
                        setFunctionError(err,"adaptive","resizeForms => formPopupCloseBtn");
                    }
                
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

            const adaptiveBtnContainer = $$("contextActionsBtnAdaptive").getParentView();

            function removeAdaptiveBtn(){
                try{
                    if($$("contextActionsBtnAdaptive")){
                        adaptiveBtnContainer.removeView($$("contextActionsBtnAdaptive"));
                    }
                } catch (err){
                    setFunctionError(err,"adaptive","resizeForms => removeAdaptiveBtn");
                }
            }

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

            removeAdaptiveBtn();
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
            function hideDashTool(){
                try{
                    if($$("dashboard-tool-main")){
                        $$("dashboard-tool-main").hide();
                    }
                } catch (err){
                    setFunctionError(err,"adaptive","resizeDashboards => hideDashTool");
                }
            }

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
                    
                        function showDashPopup(){
                            try{
                                if($$("contextDashFilterPopup")){
                                    $$("contextDashFilterPopup").show();
                                }
                            } catch (err){
                                setFunctionError(err,"adaptive","resizeDashboards => dashFilterBtn click showDashPopup");
                            }
                        
                        }
    
                        function showDashCloseBtn(){
                            try{
                                if ($$("buttonClosePopupDashFilter")                && 
                                    !($$("buttonClosePopupDashFilter").isVisible()) ){
                                    $$("buttonClosePopupDashFilter").show();
                                }
                            } catch (err){
                                setFunctionError(err,"adaptive","resizeDashboards => dashFilterBtn click showDashCloseBtn");
                            }
                        }
    
    
                        showDashPopup();
                        showDashCloseBtn();
    
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
                const toolContainer = $$("dashboard-tool-main").getParentView();
                try{
                    if($$("dashboard-tool-main")){
                        toolContainer.removeView( $$("dashboard-tool-main")); 
                    }
                } catch (err){
                    setFunctionError(err,"adaptive","resizeDashboards => removeDashTool");
                }
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
                    
                hideDashTool();

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
                const toolParent = $$("dashboard-tool-adaptive").getParentView();
                try{
                    if($$("dashboard-tool-adaptive")){
                        toolParent.removeView($$("dashboard-tool-adaptive"));
                    }
                } catch (err){
                    setFunctionError(err,"adaptive","resizeDashboards => removeDashAdaptiveTools");
                }
            }

            function removeDashAdaptiveBtn(){
                try{
                    if($$("dashFilterBtn")){
                        let btnParent =  $$("dashFilterBtn").getParentView();
                        btnParent.removeView($$("dashFilterBtn"));
                    }
                } catch (err){
                    setFunctionError(err,"adaptive","resizeDashboards => removeDashAdaptiveBtn");
                }
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

            function hideBtnClosePopup(){
                try{ 
                    if( $$("buttonClosePopupDashFilter")){
                        $$("buttonClosePopupDashFilter").hide();
                    }
                } catch (err){
                    setFunctionError(err,"adaptive","resizeDashboards => hideBtnClosePopup");
                }
            }


          //  if($$("dashboard-tool-adaptive")){
            if($$("dashFilterBtn")){
                removeDashAdaptiveTools();
                destructDashPopup();
                removeDashAdaptiveBtn();
                addMainTool();
                hideBtnClosePopup();
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

            function showEditTableBtn(){
                try{
                    if( $$("table-editTableBtnId") && !( $$("table-editTableBtnId").isVisible())){
                        $$("table-editTableBtnId").show();
                    }
                } catch (err){
                    setFunctionError(err,"adaptive","resizeTableEditForm => showEditTableBtn");
                }
            }

            function hideEditFormContainer(){
                try{
                    if ($$("editTableBarContainer") && $$("editTableBarContainer").isVisible()){
                        $$("editTableBarContainer").hide();
                    }
                } catch (err){
                    setFunctionError(err,"adaptive","resizeTableEditForm => hideEditFormContainer");
                }   
            }

            function createTablePopup(){
                return webix.ui({
                    view:"popup",
                    css:"webix_popup-table-container webix_popup-config",
                    modal:true,
                    id:"tableEditPopup",
                    escHide:true,
                    position:"center",
                    body:{
                        id:"tableEditPopupContainer",
                        rows:[]
                    }
                }).show();
            }

            function addPopupElements(){
                try{
                    if($$("tableEditPopupContainer")){
                        $$("tableEditPopupContainer").addView($$("editTableBarAdaptive"));
                    }
                } catch (err){
                    setFunctionError(err,"adaptive","resizeTableEditForm => addPopupElements");
                }
            }

            function showTablePopupheadline(){
                try{
                    if($$("editTableBarHeadline") && !($$("editTableBarHeadline").isVisible())){
                        $$("editTableBarHeadline").show();
                    }
                } catch (err){
                    setFunctionError(err,"adaptive","resizeTableEditForm => showTablePopupheadline");
                }
            }

            function showTablePopup(){
                try{
                    if($$("tableEditPopup")){
                        $$("tableEditPopup").show();
                    }
                } catch (err){
                    setFunctionError(err,"adaptive","resizeTableEditForm => showTablePopup");
                }
            }

            function enableNewAddBtn(){
                try{
                    if ($$("table-newAddBtnId") && !($$("table-newAddBtnId").isEnabled())){
                        $$("table-newAddBtnId").enable();
                    }
                } catch (err){
                    setFunctionError(err,"adaptive","resizeTableEditForm => enableNewAddBtn");
                }
            }

            function showContainer(){
                try{
                    if ($$("editTableBarContainer") ){
                        $$("editTableBarContainer").show();
                    }
                } catch (err){
                    setFunctionError(err,"adaptive","resizeTableEditForm => showContainer");
                }
            }

            function addEditElements(){
                try{
                    if ($$("tableEditPopupContainer")){
                        $$("tableEditPopupContainer").addView($$("editTableBarAdaptive"));
                    }
                } catch (err){
                    setFunctionError(err,"adaptive","resizeTableEditForm => addEditElements");
                }
            }
            function showEditHeadline(){
                try{
                    if($$("editTableBarHeadline") && !($$("editTableBarHeadline").isVisible())){
                        $$("editTableBarHeadline").show();
                    }
                } catch (err){
                    setFunctionError(err,"adaptive","resizeTableEditForm => showEditHeadline");
                }
            }

            function setBtnState(){
                try{
                    if($$("table-saveNewBtn").isEnabled() && $$("table-newAddBtnId").isEnabled()){
                        $$("table-newAddBtnId").disable();
                    } else {
                        $$("table-newAddBtnId").enable();
                    }
                } catch (err){
                    setFunctionError(err,"adaptive","resizeTableEditForm => setBtnState");
                }
            }

            showEditTableBtn();

            hideEditFormContainer();
           

            if ($$("table-editForm") && $$("table-editForm").isDirty()){
               if (!($$("tableEditPopup"))){
                createTablePopup();
                addPopupElements();
                showTablePopupheadline();

                } else {
                    showTablePopup();

                    if ($$("tableEditPopupContainer").getChildViews().length){
                        enableNewAddBtn();
                        showContainer();

                    } else {
                        addEditElements();
                        showEditHeadline();
                    }
                }
                setBtnState();
            }

            autoResizePopup ("editFilterBarAdaptive", 1.5);
        }

        function tableMainView(){
            function hidePopup(){
                try{
                    if ($$("tableEditPopup")){
                        $$("tableEditPopup").hide();
                    } 
                } catch (err){
                    setFunctionError(err,"adaptive","resizeTableEditForm => hidePopup");
                }
            }

            function showContainer(){
                try{
                    if ($$("editTableBarContainer") && !($$("editTableBarContainer").isVisible())){
                        $$("editTableBarContainer").show();
                    }
                } catch (err){
                    setFunctionError(err,"adaptive","resizeTableEditForm => showContainer");
                }
            }

            function hideFilterForm(){
                try{
                    if ($$("filterTableForm")){
                        $$("filterTableForm").hide();
                    }
                } catch (err){
                    setFunctionError(err,"adaptive","resizeTableEditForm => hideFilterForm");
                }
            }

            function showEditForm(){
                try{
                    if ($$("table-editForm")){
                        $$("table-editForm").show();
                    }
                } catch (err){
                    setFunctionError(err,"adaptive","resizeTableEditForm => showEditForm");
                }
            }

            function addEditElements(){
                try{
                    if ( $$("editTableBarContainer")){
                        $$("editTableBarContainer").addView($$("editTableBarAdaptive"))
                    }
                } catch (err){
                    setFunctionError(err,"adaptive","resizeTableEditForm => addEditElements");
                }
            }

            function showEditBar(){
                try{
                    if ( $$("editTableBarAdaptive") && !( $$("editTableBarAdaptive").isVisible())){
                        $$("editTableBarAdaptive").show();
                    }
                } catch (err){
                    setFunctionError(err,"adaptive","resizeTableEditForm => showEditBar");
                }
            }

            function hideEditFormBtn(){
                try{
                    if( $$("table-editTableBtnId") && $$("table-editTableBtnId").isVisible()){
                        $$("table-editTableBtnId").hide();
                    }
                } catch (err){
                    setFunctionError(err,"adaptive","resizeTableEditForm => hideEditFormBtn");
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

            function hideEditheadline () {
                try{
                    if($$("editTableBarHeadline") && $$("editTableBarHeadline").isVisible()){
                        $$("editTableBarHeadline").hide();
                    } 
                } catch (err){
                    setFunctionError(err,"adaptive","resizeTableEditForm => hideEditheadline");
                }
            }
      
            hidePopup();

            if (!($$("editTableBarContainer")   &&  $$("editTableBarContainer").isVisible  ()  || 
                  $$("filterTableBarContainer") &&  $$("filterTableBarContainer").isVisible()) ){

                showContainer();
                hideFilterForm();
                showEditForm();
            }
        
            addEditElements();

            showEditBar();
            hideEditFormBtn();
            setEditBarWidth();
            hideEditheadline ();

        }

    
        if (window.innerWidth < 1200){
            tableAdaptiveView();

        }

        if (window.innerWidth > 1200){
            tableMainView();
        }

        autoResizePopup ("editTableBarAdaptive", 1.5);

    }

    function resizeTableFilterForm (){
        function filterAdaptive(){

            function setBtnState(){
                let btnClass = document.querySelector(".webix_btn-filter");
                try{
                    if(btnClass && btnClass.classList.contains("webix_primary")){
                        btnClass.classList.add("webix_secondary");
                        btnClass.classList.remove("webix_primary");
                    }
                } catch (err){
                    setFunctionError(err,"adaptive","resizeTableFilterForm => setBtnState");
                }
            }

            function hideFilterContainer(){
                try{
                    if ($$("filterTableBarContainer") && $$("filterTableBarContainer").isVisible()){
                        $$("filterTableBarContainer").hide();
        
                    }
                } catch (err){
                    setFunctionError(err,"adaptive","resizeTableFilterForm => hideFilterContainer");
                }
            }

            function hideEditContainer (){
                try{
                    if ($$("editTableBarContainer") && $$("editTableBarContainer").isVisible()){
                        $$("editTableBarContainer").hide();
                    }
                } catch (err){
                    setFunctionError(err,"adaptive","resizeTableFilterForm => hideEditContainer");
                }
            }

            function showFilterPopup(){
                try{
                    if ($$("tableFilterPopup")){
                        $$("tableFilterPopup").show();
                    }
                } catch (err){
                    setFunctionError(err,"adaptive","resizeTableFilterForm => showFilterPopup");
                }
            }

            function showFilterAdaptiveContainer(){
                try{
                    if ($$("tableFilterPopupContainer") && !($$("tableFilterPopupContainer").isVisible())){
                        $$("tableFilterPopupContainer").show();
                    }
                } catch (err){
                    setFunctionError(err,"adaptive","resizeTableFilterForm => showFilterPopup");
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
            

            function showFilterHeadline(){
                try{
                    if($$("editFilterBarHeadline") && !($$("editFilterBarHeadline").isVisible())){
                        $$("editFilterBarHeadline").show();
                    }
                } catch (err){
                    setFunctionError(err,"adaptive","resizeTableFilterForm => showFilterHeadline");
                }
            }

            function showFilterElements(){
                try{
                    if($$("filterTableForm")){
                        $$("filterTableForm").show();
                    }
                } catch (err){
                    setFunctionError(err,"adaptive","resizeTableFilterForm => showFilterElements");
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
            hideFilterContainer();

           

            if ($$("filterTableForm") && $$("filterTableForm").isDirty()){
                hideEditContainer ();
                showFilterPopup();
                showFilterAdaptiveContainer();
                addAdaptiveElements();
                showFilterHeadline();
                showFilterElements();
                setFilterValues();
            }

            autoResizePopup ("popupFilterEdit", 1.5);
        }

        function filterMain(){
            function hideFilterPopup(){
                try{
                    if( $$("tableFilterPopup")){
                        $$("tableFilterPopup").hide();
                    }
                } catch (err){
                    setFunctionError(err,"adaptive","resizeTableFilterForm => hideFilterPopup");
                }
            }

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

            function hideFilterHeadline(){
                try{
                    if($$("editFilterBarHeadline")){
                        $$("editFilterBarHeadline").hide();
                    }
                } catch (err){
                    setFunctionError(err,"adaptive","resizeTableFilterForm => hideFilterHeadline");
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
                    btnClass.classList.add("webix_primary");
                    btnClass.classList.remove("webix_secondary");
                } catch (err){
                    setFunctionError(err,"adaptive","resizeTableFilterForm => setBtnState");
                }
            }

            function showFilterContainer(){
                try{
                    if( $$("filterTableForm")){
                        $$("filterTableForm").show();
                    }
                } catch (err){
                    setFunctionError(err,"adaptive","resizeTableFilterForm => setBtnState");
                }
            }

            function hideEditForm(){
                try{
                    if($$("table-editForm")){
                        $$("table-editForm").hide();
                    }
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

            function hideEditContainer(){
                try{
                    if ($$("editTableBarContainer") && $$("editTableBarContainer").isVisible()){
                        $$("editTableBarContainer").hide();
                    }
                } catch (err){
                    setFunctionError(err,"adaptive","resizeTableFilterForm => hideEditContainer");
                }
            }

            function showFilter(){
                try{
                    if ($$("filterTableBarContainer") && !($$("filterTableBarContainer").isVisible())){
                        $$("filterTableBarContainer").show();
                    }
                } catch (err){
                    setFunctionError(err,"adaptive","resizeTableFilterForm => showFilter");
                }
            }

        
            if ($$("tableFilterPopup").isVisible()){
                hideFilterPopup();

                let filterFormValues = getFormValues();
                
                addFilterElements();
                hideFilterHeadline();
                setSizeFilterContainer();

                if ($$("filterTableBarContainer") && !($$("filterTableBarContainer").isVisible())){

                    showFilterContainer();
                    hideEditForm();
                    setFilterValues(filterFormValues);
                    setBtnState();

                    hideEditContainer();
                    showFilter();
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

    async function getActiveView (){ // SINGLE ELS

        if (!STORAGE.mmenu){
            await getData("mmenu"); 
        }

        function setAdaptiveLogic(visibleEl){
            if (visibleEl == "forms"){
                resizeForms();
            } else if (visibleEl == "dashboards"){
                resizeDashboards();
            } else if (visibleEl == "tables"){
                resizeTableEditForm();
                resizeTableFilterForm ();
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
            if( $$("tree")){
                $$("tree").hide();
            }
        }
    }

    function addTreeEvent(){
        if (window.innerWidth < 1200 ){
         

            $$("tree").attachEvent("onAfterLoad", function(){
                if ($$("editTableBarContainer") && $$("editTableBarContainer").isVisible()){
                    $$("editTableBarContainer").hide();
                }
            });
 

            if ($$("editTableBarContainer") && $$("editTableBarContainer").isVisible()){
                $$("editTableBarContainer").hide();
            }
    
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
    createFilterPopup();


}
export {
    resizeAdaptive,
    adaptivePoints
};
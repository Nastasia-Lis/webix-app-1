import {catchErrorTemplate} from "./logBlock.js";

function resizeAdaptive (){

    function autoResizePopup (popupId,k=1.3){

        if($$(popupId) && window.innerWidth/$$(popupId).$width < k){

            if( $$(popupId).$width > 100){
                let size = $$(popupId).$width - 20;
                $$(popupId).config.width = size;
    
                $$(popupId).resize();

            }

        } 
    
        if($$(popupId) && window.innerWidth/$$(popupId).$width > k){

            let size = $$(popupId).$width + 20;

            $$(popupId).config.width = size;
    
            $$(popupId).resize();

        
        }
    }

    window.addEventListener('resize', function(event) {
   
        
      // sidebar
        try{
            if (window.innerWidth < 850 && $$("tree") && $$("tree").isVisible()){
                $$("tree").hide();
            }
        
            if ($$("tree").isVisible()){
            } else {
                if(window.innerWidth <= 800){
                    if($$("sideMenuResizer")){
                        $$("sideMenuResizer").hide(); 
                    }
                } 
            }

            if (window.innerWidth > 850 && $$("tree")){
                $$("tree").config.width = 250;
                $$("tree").resize();
            }
        } catch (error){
            console.log(error);
            catchErrorTemplate("017-007", error);
        }





        // form actions popup
        try{
            if (window.innerWidth < 830 && !($$("contextActionsBtn"))){

                if ($$("customInputsMain")){
                    const filterBar = $$("table-view-filterIdView").getParentView();
                    let customInputsCollection;
                    customInputsCollection = Object.values($$("customInputs")._collection); 

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
                    $$("customInputsMain").getParentView().removeView($$("customInputsMain"));

                    customInputsCollection = {id:"customInputsAdaptive",rows:[{id:"customInputs",rows:customInputsCollection}]} 

        
                    $$(filterBar.config.id).addView( {
                        view:"button", 
                        id:"contextActionsBtnAdaptive",
                        maxWidth:100, 
                        value:"Действия", 
                        css:"webix_primary", 
                        popup:webix.ui({
                                view:"popup",
                                css:"webix_popup-actions-container webix_popup-config",
                                modal:true,
                                id:"contextActionsPopup",
                                escHide:true,
                                position:"center",
                            //  height:400,
                                width:400,
                                body:{

                                    rows:[
                                        {cols:[
                                            {template:"Доступные действия", css:"webix_template-actions", borderless:true, height:40 },
                                        //   {},
                                            {
                                                view:"button",
                                                id:"buttonClosePopupActions",
                                                css:"webix_close-btn",
                                                type:"icon",
                                                hotkey: "esc",
                                                width:25,
                                                icon: 'wxi-close',
                                                click:function(){
                                                    if ($$("contextActionsPopup")){
                                                        $$("contextActionsPopup").hide();
                                                    }
                                                
                                                }
                                            },
                                        ]},
                                        {
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
                                        }
                                
                                    ]
                        
                                
                                }

                            
                            }),
                            click:function(){
                                if ( $$("contextActionsPopup").config.height !== $$("customInputsAdaptive").$height +60){
                                    $$("contextActionsPopup").config.height = $$("customInputsAdaptive").$height +60
                                    $$("contextActionsPopup").resize();
                                }
                            }
                        
                        
                    },2);
                }

            } else if (window.innerWidth > 830 && $$("contextActionsBtnAdaptive")||window.innerWidth > 830 && $$("contextActionsBtn")){

                if ($$("customInputsAdaptive")){
                    const  filterBar = $$("table-view-filterIdView").getParentView();
                    const collection = {id:"customInputs",cols:$$("customInputsAdaptive")._collection[0].rows}

                    if($$("contextActionsBtnAdaptive")){
                      $$("contextActionsBtnAdaptive").getParentView().removeView($$("contextActionsBtnAdaptive"));
                    }
                    $$("contextActionsPopup").destructor();

                    if (!($$("customInputs"))){
                    $$(filterBar.config.id).addView( 
                        {id:"customInputsMain",cols:
                            [
                                collection
                            ]
                        }
                    ,2);
                }
                } 

            }


            autoResizePopup ("contextActionsPopup");
    
        } catch (error){
            console.log(error);
            catchErrorTemplate("017-007", error);
        }



        // dashboards
        try{
            if (window.innerWidth < 850){
                
                if ($$("dashboard-tool-main") && $$("dashboard-tool-main").isVisible()){
                  
                    $$("dashboard-tool-main").hide();
                    let tools;

                         
                    if ($$("dashboard-tool-main")){
                        tools = $$("dashboard-tool-main")._collection;
                    }

               
                    if (!$$("dashFilterBtn")){ //id:"dashboard-tool-adaptive"
                        $$("dashboardInfoContainer").addView(
                            {id:"dashboard-tool-adaptive",cols:[
                                {
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
                                            id:"contextDashFilterPopupContainer",rows:[

                                            ]
                                        }
                                    }),
                                    click:function(){
                                    
                                        $$("contextDashFilterPopup").show();
 
                                        if ($$("buttonClosePopupDashFilter") && !($$("buttonClosePopupDashFilter").isVisible())){
                                            $$("buttonClosePopupDashFilter").show();
                                        }

                                    }
                                }
                            ]}
                        ,0);
                    }

                    if($$("dashboard-tool-main")){
                       
                        $$("dashboard-tool-main").getParentView().removeView( $$("dashboard-tool-main"));
                      
                    }

                    if (!$$("dashToolInputsAdaptive")){
                                            
                        $$("contextDashFilterPopupContainer").addView( {id:"dashToolInputsAdaptive",  rows:tools});

                        if( $$("dashboard-tool-main")){
                            $$("dashboard-tool-main").getParentView().removeView( $$("dashboard-tool-main"));
                        }
                    }



                   

                    
             }
            }


            if (window.innerWidth > 850){

                if($$("dashboard-tool-adaptive")){

                   let tools = $$("dashToolInputsAdaptive")._collection;
            
                    if($$("dashboard-tool-adaptive")){
                        $$("dashboard-tool-adaptive").getParentView().removeView($$("dashboard-tool-adaptive"));
                    }

                    if ($$("contextDashFilterPopup")){
                        $$("contextDashFilterPopup").destructor();
                    }

                    if($$("dashFilterBtn")){
                        $$("dashFilterBtn").getParentView().removeView($$("dashFilterBtn"));
                    }

                    $$("dashboardTool").addView({  
                        id:"dashboard-tool-main",
                        padding:20,
                        minWidth:250,
                        rows:tools, 
                    });
                    

                    if($$("buttonClosePopupDashFilter") && $$("buttonClosePopupDashFilter").isVisible()){
                        $$("buttonClosePopupDashFilter").hide();
                    }
                }
               
            }

            autoResizePopup ("contextDashFilterPopupContainer");
             
        } catch (error){
            console.log(error);
            catchErrorTemplate("017-007", error);
        }




        // table edit bar
        try{
            if (window.innerWidth < 1200){


                $$("table-editForm").clear();
                $$("table-editForm").clearValidation();

                if ($$("table-saveNewBtn").isVisible()) {
                    $$("table-saveNewBtn").hide();
                } else if ($$("table-saveBtn").isVisible()){
                    $$("table-saveBtn").hide();
                }
                $$("table-delBtnId").disable();
                $$("table-newAddBtnId").enable();

                if ($$("inputsTable")){
                    $$("inputsTable").getParentView().removeView($$("inputsTable"))
                }

                if( $$("table-editTableBtnId") && !( $$("table-editTableBtnId").isVisible())){
                    $$("table-editTableBtnId").show();
                }

                if ($$("editTableBarContainer") && $$("editTableBarContainer").isVisible()){
                    $$("editTableBarContainer").hide();
                }
             
            }


            if (window.innerWidth > 1200){

                if( $$("table-editTableBtnId") && $$("table-editTableBtnId").isVisible()){
                    $$("table-editTableBtnId").hide();
                }

                if ($$("editTableBarContainer") && !($$("editTableBarContainer").isVisible())){
                    $$("editTableBarContainer").show();
                }

                $$("editTableBarAdaptive").config.width = 350;
                $$("editTableBarAdaptive").resize();

                $$("editTableBarContainer").addView($$("editTableBarAdaptive"))

                

                if ($$("tableEditPopup")){
                    $$("tableEditPopup").destructor();
                }

                if($$("editTableBarHeadline") && $$("editTableBarHeadline").isVisible()){
                    $$("editTableBarHeadline").hide();
                } 
   
            }

            autoResizePopup ("editTableBarAdaptive", 1.5);
             
        } catch (error){
            console.log(error);
            catchErrorTemplate("017-007", error);
        }



        // table filter bar
        try{
            if (window.innerWidth < 1200){
                if ($$("editTableBarContainer") && $$("editTableBarContainer").isVisible()){
                    $$("editTableBarContainer").hide();
                }

                if ($$("filterTableBarContainer") && $$("filterTableBarContainer").isVisible()){
                    $$("filterTableBarContainer").hide();
                }
             
            }


            if (window.innerWidth > 1200){

            }

            autoResizePopup ("editFilterBarAdaptive", 1.5);
            autoResizePopup ("popupFilterEdit", 1.5);
             
        } catch (error){
            console.log(error);
            catchErrorTemplate("017-007", error);
        }


    }, true);
}




function adaptivePoints (){
    try{
        if (window.innerWidth < 850 && $$("tree") && $$("tree").isVisible()){
            $$("tree").hide();
        }


       // table filter popup
        if(!$$("tableFilterPopup")){
            webix.ui({
                view:"popup",
                css:"webix_popup-table-container webix_popup-config",
                modal:true,
                id:"tableFilterPopup",
                escHide:true,
                position:"center",
                body:{
                    id:"tableFilterPopupContainer",rows:[

                    ]
                }
            });
        }
           

      

    } catch (error){
        console.log(error);
        catchErrorTemplate("017-007", error);
    }





    // if(window.innerWidth < 550 && $$("sideMenuResizer")){
    //     $$("sideMenuResizer").hide();
    // } else {
    //     $$("sideMenuResizer").show();
    // }

    // if (window.innerWidth < 460){

    //     $$("contextActionsPopup").config.width = 500;
    //     $$("contextActionsPopup").resize()


    // }
}
export {
    resizeAdaptive,
    adaptivePoints
};
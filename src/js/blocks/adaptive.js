import {catchErrorTemplate} from "./logBlock.js";

function resizeAdaptive (){

    window.addEventListener('resize', function(event) {
   
        
      // sidebar
        try{
            if (window.innerWidth< 850 && $$("tree") && $$("tree").isVisible()){
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
                
                    $$("contextActionsPopup").destructor();

                $$("contextActionsBtnAdaptive").getParentView().removeView($$("contextActionsBtnAdaptive"));

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
    
            if($$("contextActionsPopup") && window.innerWidth/$$("contextActionsPopup").$width < 1.3){

                if( $$("contextActionsPopup").$width > 100){
                    let size = $$("contextActionsPopup").$width - 20;

                $$("contextActionsPopup").config.width = size;
        
                $$("contextActionsPopup").resize();

                }
                //$$("sideMenuResizer").hide();
            } 
            
            if($$("contextActionsPopup") && window.innerWidth/$$("contextActionsPopup").$width > 1.3){

                let size = $$("contextActionsPopup").$width + 20;

                $$("contextActionsPopup").config.width = size;
        
                $$("contextActionsPopup").resize();

            
            }
        } catch (error){
            console.log(error);
            catchErrorTemplate("017-007", error);
        }



         // dashboards
        try{
            if (window.innerWidth < 850){
          
                if ($$("dashboard-tool") && $$("dashboard-tool").isVisible()){
                    $$("dashboard-tool").hide();
                    console.log($$("dashboard-tool")._collection)
                    
                    if (!$$("my_button")){
                        $$("dashboardInfoContainer").addView({
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

                                    rows:[
                                        {cols:[
                                            {template:"Фильтр", css:"webix_template-filter", borderless:true, height:40 },
                                        //   {},
                                            {
                                                view:"button",
                                                id:"buttonClosePopupDashFilter",
                                                css:"webix_close-btn",
                                                type:"icon",
                                                hotkey: "esc",
                                                width:25,
                                                icon: 'wxi-close',
                                                click:function(){
                                                    if ($$("contextDashFilterPopup")){
                                                        $$("contextDashFilterPopup").hide();
                                                    }
                                                
                                                }
                                            },
                                        ]},
                                        {
                                            view:"scrollview",
                                            borderless:true,
                                            scroll:"y", 
                                            body:{ 
                                          //  id:"contextActionsPopupContainer",
                                            css:"webix_context-actions-popup",
                                            rows:[ 
                                              ///////
                                            ]
                                            }
                                        }
                                
                                    ]
                          
                                   
                                }
                            }),
                            click:function(){
                                if ( !($$("dashboard-tool").isVisible())){
                                    $$("dashboard-tool").show();
                                } else {
                                    $$("dashboard-tool").hide();
                                }
                            }
                        },0);
                    }
             }
            }
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
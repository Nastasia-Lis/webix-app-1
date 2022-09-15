
function resizeAdaptive (){

    window.addEventListener('resize', function(event) {
        
        if ($$("tree").isVisible()){
        } else {
            if(window.innerWidth <= 800){
                if($$("sideMenuResizer")){
                    $$("sideMenuResizer").hide(); 
                }
            } 
        }

        if (window.innerWidth < 830 && !($$("contextActionsBtn"))){
            console.log("min")
            if ($$("customInputsMain")){
                const  filterBar = $$("table-view-filterIdView").getParentView();
                let customInputsCollection;


                customInputsCollection = Object.values($$("customInputs")._collection); 

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
                                            id:"buttonClosePopup",
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
                                        rows:[ 
                                            customInputsCollection
                                        ]
                                        }
                                    }
                            
                                ]
                    
                            
                            }

                         
                        }),
                        click:function(){
                            //$$("contextActionsPopupContainer").addView(customInputsCollection,2);
                            if ( $$("contextActionsPopup").config.height !== $$("customInputsAdaptive").$height +60){
                                $$("contextActionsPopup").config.height = $$("customInputsAdaptive").$height +60
                                $$("contextActionsPopup").resize();
                            }
                        }
                     
                    
                },2);
            }

        } else if (window.innerWidth > 830 && $$("contextActionsBtnAdaptive")||window.innerWidth > 830 && $$("contextActionsBtn")){
            if ($$("customInputsAdaptive")){
                console.log("miax")
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
        // if (window.innerWidth < 550){
        //           $$("contextActionsPopup").config.width = 300;
      
        //          $$("contextActionsPopup").resize();
        // }
       // console.log(window.innerWidth ,  $$("contextActionsPopup").$width, window.innerWidth/$$("contextActionsPopup").$width)
        if($$("contextActionsPopup") && window.innerWidth/$$("contextActionsPopup").$width < 1.3){
            console.log($$("contextActionsPopup").$width)
            if( $$("contextActionsPopup").$width > 100){
                let size = $$("contextActionsPopup").$width - 20;
                console.log(size)
             $$("contextActionsPopup").config.width = size;
      
            $$("contextActionsPopup").resize();
                console.log("mmdmmfmf")
            }
            //$$("sideMenuResizer").hide();
        } else {
           // $$("sideMenuResizer").show();
        }



    }, true);
}




function adaptivePoints (){
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
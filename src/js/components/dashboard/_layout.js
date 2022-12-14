function returnTemplate(id){
    return {
        id      : "dashboard" + id,
        css     : "webix_dashTool", 
        minWidth: 200,
        width   : 350,
        hidden  : true,
        rows    : [{}],
        on:{
            onViewShow:function(){
                if (window.innerWidth > 850){
                    this.config.width = 350;
                    this.resize();
                }
            }
        }
    };
}

const dashboardTool    = returnTemplate("Tool");
const dashboardContext = returnTemplate("Context");

function dashboardLayout () {
        return [
            {  // view : "scrollview", 
                //id   : "dashScroll",  
               // body: 
               
                  //  {   
                       // view: "flexlayout",
                        id  : "dashboardContainer",
                
                        rows: [

                            {cols:[
                                {   id      : "dashboardInfoContainer",
                                    minWidth: 250, 
                                    rows    : [] 
                                },
                                {view: "resizer"},
                                dashboardTool,
                                dashboardContext
                            ]},
                        
                          
                        
                        ]
                    //} 
            }
        ];
}

export {
    dashboardLayout,
};
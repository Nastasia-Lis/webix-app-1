///////////////////////////////

// Общий layout дашборда

// Copyright (c) 2022 CA Expert

///////////////////////////////


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
            {  
                id  : "dashboardContainer",
        
                rows: [

                    {cols:[
                        {   id      : "dashboardInfoContainer",
                            css     : "dash_container",
                            minWidth: 250, 
                            rows    : [
                                {id : "dash-none-content"}
                            ] 
                        },
                        {view: "resizer"},
                        dashboardTool,
                        dashboardContext
                    ]},
                
                    
                
                ]
                    
            }
        ];
}

export {
    dashboardLayout,
};
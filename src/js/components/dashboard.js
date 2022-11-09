const dashboardTool = {
    id      : "dashboardTool",
    css     : "webix_dashTool", 
    minWidth: 200,
    width   : 350,
    hidden  : true,
    rows    : []
};

function dashboardLayout () {
        return [
            {   view : "scrollview", 
                id   : "dashScroll",  
                body: 
                    {   
                        view: "flexlayout",
                        id  : "dashboardContainer",
                
                        cols: [
                            {   id      : "dashboardInfoContainer",
                                minWidth: 250, 
                                rows    : [] 
                            },
                            {view: "resizer"},
                            dashboardTool,
                          
                        
                        ]
                    } 
            }
        ];
}

export {
    dashboardLayout,
};
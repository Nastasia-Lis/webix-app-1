const dashboardTool = {id:"dashboardTool",css:"webix_dashTool", rows:[
  
]};
function dashboardLayout () {
        return [
            { view:"scrollview", id:"dashScroll", body: 
            
                {   
                    view:"flexlayout",
                    id:"dashboardContainer",
                  
                    cols:[
                        {   id:"dashboardInfoContainer",
                            minWidth:250, 
                            rows:[] 
                        },
                        {view:"resizer"},
                        dashboardTool,
                    ]
                } 
            }
        ];
}

export {
    dashboardLayout,
};
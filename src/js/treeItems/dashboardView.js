const dashboardBody = {
    view:"scrollview", 
    scroll:"auto",
    borderless:true, 
    body:{
        id:"dashboardBody",
        css:"dashboardBody",
        view:"flexlayout",
        cols:[
            {id:"dashEmpty"},
        ]
    }
};
const dashboardTool = {id:"dashboardTool",css:"webix_dashTool", rows:[
  
]};
function dashboardLayout () {
        return [
            { view:"scrollview", body: 
            
                {   
                    view:"flexlayout",
                    id:"dashboardContainer",
                    cols:[
                        {   id:"dashboardInfoContainer",
                            rows:[
                                {minWidth:250,cols:[dashboardBody]},
                                
                            ] 
                        },
                        {view:"resizer"},
                        dashboardTool,
                    ]
                } 
            }
        ];
}


// {view:"scrollview", body:  
                            
// {view:"flexlayout",cols:[
//     table (tableIdView),
//     { view:"resizer",class:"webix_resizers", id:"propResize", hidden:true},
//     propertyTemplate("propTableView")
// ]}}, 
// ],
export {
    dashboardLayout,
};
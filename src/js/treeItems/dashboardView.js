const dashboardBody = {id:"dashboardBody", rows:[
 
    {id:"dashEmpty"},
]};
const dashboardTool = {id:"dashboardTool",css:"webix_dashTool", rows:[
  
]};
function dashboardLayout () {
        return [
    
            {id:"dashboardContainer", cols:[
                {rows: [dashboardTool,
                dashboardBody],}
            ]}
        ];
    }
export {
    dashboardLayout,
};
const dashboardBody = {id:"dashboardBody", css:"dashboardBody",cols:[
    {id:"dashEmpty"}
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
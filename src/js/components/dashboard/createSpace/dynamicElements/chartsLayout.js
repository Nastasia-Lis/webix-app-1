import { setFunctionError }             from "../../../../blocks/errors.js";
import { updateSpace }                  from "../click/updateSpace.js";
import { returnEl, setAttributes }      from '../click/itemClickLogic.js';
import { getDashId }                    from '../common.js';

const logNameFile = "dashboards => createSpace => dynamicElements => chartsLayout";

function returnHeadline (titleTemplate){
    const headline = {   
        template    : titleTemplate,
        borderless  : true,
        height      : 35,
        css         : "dash-HeadlineBlock",
    };
 
    return headline;
}
const action = {
    navigate: true,
    field   : "auth_group",
  //  context : true,
    params  :{
       // filter : "auth_group.id = 3" 
     filter : "auth_group.id != '1' or auth_group.id != '3' and auth_group.role contains 'р' or auth_group.role = 'а'" 
    } 
};

function createChart(dataCharts){
    const layout = [];
  
    try{

        const labels =  [
          { "view":"label", "label":"Больше 15 минут: 10"   ,"minWidth":200,"action":action,"css":{"background-color":"#FFAAAA","text-align":"center"}},
          { "view":"label", "label":"Без комментария:  3"   ,"minWidth":200,"action":action,"css":{"background-color":"#FFAAAA","text-align":"center"}},
          { "view":"label", "label":"За сегодня всего: 20"  ,"minWidth":200,"action":action,"css":{"background-color":"#AAFFAA","text-align":"center"}},
          { "view":"label", "label":"За сегодня закрыто: 15","minWidth":200,"action":action,"css":{"background-color":"#AAFFAA","text-align":"center"}},
          { "view":"label", "label":"За сегодня в работе: 5","minWidth":200,"action":action,"css":{"background-color":"#AAFFFF","text-align":"center"}},
          { "view":"label", "label":"Всего не закрыто: 130" ,"minWidth":200,"action":action,"css":{"background-color":"#AAFFFF","text-align":"center"}},
          { "view":"label", "label":"Без цвета: ???"        ,"minWidth":200,"action":action,"css":{"text-align":"center"}},
        ]

        const res =  
            // {
            //     "title"  :"Статусы заявок",
            //     "margin" :10,
            //     "height" :300,
            //     "padding":10,
            //     "rows"   :[
            //       { "view":"scrollview", 
            //         "body":{    
            //             "view":"flexlayout",
            //             "height" :200,
            //             "margin":10, 
            //             "padding":0,
            //             "cols":labels
            //         },
            //       }
            //     ]  
            // }

            {   title  :"Статусы заявок",
                cols : labels
            };
                
                
            // };

            // {
            //     "title":"Монитор заявок по стадиям (открытых: %d)",
            //     "view":"chart",
            //     "type":"bar",
            //     "value":"#count#",
            //     "label":"#count#",
            //     "barWidth":30,
            //     "radius":0,
            //     "height":250,
            //     "tooltip":{
            //         "template":"#stage# - #count#"
            //     },
            //     "yAxis":{
            //         "title":"Количество"
            //     },
            //     "xAxis":{
            //         "template":"#stage#",
            //         "title":"Стадия"
            //     },
            //     "data":stages_data
            // },

            // {
            //     "title":"Монитор заявок (открытых: %d)" % len(data),
            //     "view":"datatable",
            //     "id":"btx_deals",
            //     "height":1000,
            //     "scroll":"xy",
            //     "columns":columns,
            //     "data":data,
            // },

        // const table = {
        //     "view": "datatable",
        //     "id"  : "auth_group",
        //     "height": 300,
        //     "scroll": "xy",
        //     "columns": [
        //         {
        //             "id": "id",
        //             "header": [
        //                 {
        //                     "text": "id"
        //                 }
        //             ],
        //             "width": 100,
        //         },
        //         {
        //             "id": "role",
        //             "header": [
        //                 {
        //                     "text": "роль"
        //                 }
        //             ],
                    
        //         },
        //         {
        //             "id": "description",
        //             "header": [
        //                 {
        //                     "text": "описание"
        //                 }
        //             ],
                    
        //         }
        //     ],
        //     "data": [
        //         {
        //             "id": 1,
        //             "role": "222",
        //             "description": "333",
        //         },
                
        //     ],
        //     "_inner": {
        //         "top": false
        //     },
        //     "onDblClick": {}
        // };
     
      // dataCharts.push(table)
        //dataCharts.push(res)
      
        dataCharts.forEach(function(el){
          
            if (el.cols || el.rows){
                returnEl(el, el.action);
                el.view   = "flexlayout";
                el.margin = 10;
                el.padding= 0;
            } else {
                el = setAttributes(el);
            }

        
            const titleTemplate = el.title;

            delete el.title;
         
            layout.push({
                css : "webix_dash-chart",
             
                rows: [ 
                    {template:' ', height:20, css:"dash-delim"},
                    returnHeadline (titleTemplate),
                    {   margin     : 10,
                        height     : 300,
                        padding    : 10,
                        borderless : true,
                        rows       : [
                            {   
                                view : "scrollview", 
                                body : el,
                            },
                        ] 
               
                    }
  
                ]
            });


        });

   
    } catch (err){  
        setFunctionError(
            err, 
            logNameFile, 
            "createChart"
        );
    }

    return layout;
}


function setIdAttribute(idsParam){
    const container = $$("dashboardContainer");
    if (container){
        container.config.idDash = getDashId (idsParam);
    }
}


function createDashLayout(dataCharts){
    const layout = createChart(dataCharts);
 
    const dashLayout = [
        {  
            rows : layout
            
        }
    ];
 
    const dashCharts = {
        id  : "dashboard-charts",
        view: "flexlayout",
        css : "webix_dash-charts-flex",
        rows: dashLayout,
    };

    return dashCharts;
}

function createScrollContent(dataCharts){
    const content = {
        view        : "scrollview", 
        scroll      : "y",
        id          : "dashBodyScroll",
        borderless  : true, 
        body        : {
            id  : "dashboardBody",
            css : "dashboardBody",
            cols: [
                createDashLayout(dataCharts)
            ]
        }
    };

    return content;
}

 

function isContextTableValues(){
    const href   = window.location.search;
    const params = new URLSearchParams (href);

    const src      = params.get("src");
    const isFilter = params.get("filter");
 
    if (src && isFilter){
        return true;
    } else {
        webix.storage.local.remove("dashTableContext"); // last context data
        return false;
    }
   
   
}

function createTableContext(){

    const data = webix.storage.local.get("dashTableContext");

    if (data){
        updateSpace(data);
    }

}

function createDashboardCharts(idsParam, dataCharts){
    
    const container = $$("dashboardInfoContainer");

    const inner =  {   
        id  : "dashboardInfoContainerInner",
        rows: [
            createScrollContent(dataCharts)
            
        ]
    };

    try{
        container.addView(inner);
    } catch (err){  
        setFunctionError(
            err, 
            logNameFile, 
            "createFilterLayout"
        );
    } 

    setIdAttribute(idsParam);
    
    if (isContextTableValues()){
        createTableContext();
    }
    
}


export {
    createDashboardCharts
};
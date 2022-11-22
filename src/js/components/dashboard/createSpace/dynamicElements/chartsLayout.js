import { setFunctionError }             from "../../../../blocks/errors.js";
import { returnEl, setAttributes }      from '../click/itemClickLogic.js';
import { createHeadline }               from '../../../viewHeadline/_layout.js';
import { getDashId }                    from '../common.js';
import { LoadServerData, GetFields }    from "../../../../blocks/globalStorage.js";

const logNameFile = "dashboards => createSpace => dynamicElements => chartsLayout";

function returnHeadline (titleTemplate){
    const headline = {   
        template    : titleTemplate,
        borderless  : true,
        height      : 35,
        css         : {  
            "font-weight" : "400!important", 
            "font-size"   : "17px!important"
        }, 
    };

    return headline;
}

function createChart(dataCharts){
    const layout = [];
  
    try{
        // const table = {
        //     "view": "datatable",
        //     "height": 300,
        //     "scroll": "xy",
        //     "columns": [
        //         {
        //             "id": "1",
        //             "header": [
        //                 {
        //                     "text": "заголовок"
        //                 }
        //             ],
        //             "width": 100,
        //         },
        //         {
        //             "id": "2",
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
        //             "1": "Нет данных",
        //             "2": "2343225"
        //         },
        //         {
        //             "id": 2,
        //             "1": "23222222",
        //             "2": "3333"
        //         }
        //     ],
        //     "_inner": {
        //         "top": false
        //     },
        //     "id": "$datatable1",
        //     "onDblClick": {}
        // };
     
        // dataCharts.push(table)
        dataCharts.forEach(function(el,i){
    
            if (el.cols || el.rows){
                returnEl(el);
            } else {
                el = setAttributes(el);
            }
        
            const titleTemplate = el.title;

            delete el.title;
        
            layout.push({
                css : "webix_dash-chart",
                rows: [ 
                    returnHeadline (titleTemplate),
                    el
                ]
            });


        });

   
    } catch (err){  
        setFunctionError(err, logNameFile, "createChart");
    }

    return layout;
}

async function setTableName(idsParam) {
    const itemTreeId = getDashId(idsParam);
    try{
        await LoadServerData.content("fields");

        const names = GetFields.names;

        if (names){

            names.forEach(function(el,i){
                if (el.id == itemTreeId){
                    const template  = $$("dash-template");
                    const value     = el.name.toString();
                    template.setValues(value);
                }
            });
        }
     
        
    } catch (err){  
        setFunctionError(err, logNameFile, "setTableName");
    }
} 


function createDashLayout(dataCharts){
    const layout       = createChart(dataCharts);

    const dashLayout = [
        {   type : "wide",
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

function createDashboardCharts(idsParam, dataCharts){

    const template  = createHeadline("dash-template");
    const container = $$("dashboardInfoContainer");

    const inner =  {   
        id  : "dashboardInfoContainerInner",
        rows: [
            template,
            createScrollContent(dataCharts)
        ]
    };

    try{
        container.addView(inner);
    } catch (err){  
        setFunctionError(err, logNameFile, "createFilterLayout");
    } 

    setTableName( idsParam );
        
}


export {
    createDashboardCharts
};
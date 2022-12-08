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
            "font-weight" : "400 !important", 
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
        //             "description": "333"
        //         },
                
        //     ],
        //     "_inner": {
        //         "top": false
        //     },
        //     "onDblClick": {}
        // };
     
        // dataCharts.push(table)
        dataCharts.forEach(function(el){
          
            if (el.cols || el.rows){
                returnEl(el, el.action);
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
        setFunctionError(
            err, 
            logNameFile, 
            "createChart"
        );
    }

    return layout;
}

async function setDashName(idsParam) {
    const itemTreeId = getDashId (idsParam);
    try{
        await LoadServerData.content("fields");

        const names = GetFields.names;

        if (names){

            names.forEach(function(el){
                if (el.id == itemTreeId){
                    const template  = $$("dash-template");
                    const value     = el.name.toString();
                    template.setValues(value);
                }
            });
        }
     
        
    } catch (err){  
        setFunctionError(
            err, 
            logNameFile, 
            "setDashName"
        );
    }
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
        setFunctionError(
            err, 
            logNameFile, 
            "createFilterLayout"
        );
    } 

    setDashName( idsParam );
    setIdAttribute(idsParam);
}


export {
    createDashboardCharts
};
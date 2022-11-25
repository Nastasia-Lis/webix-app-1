import { setLogValue }                    from '../../../logBlock.js';
import { setAjaxError, setFunctionError } from "../../../../blocks/errors.js";
import { Action }                         from '../../../../blocks/commonFunctions.js';

import { createFilterLayout }             from '../filter/filterLayout.js';
import { createDashboardCharts }          from './chartsLayout.js';

const logNameFile = "dashboards => createSpace => dynamicElems";

let inputsArray;
let idsParam;
let action;
let url;

function removeCharts(){
    Action.removeItem ($$("dashboardInfoContainerInner"));
    Action.removeItem ($$("dash-template"              ));
}

function removeFilter(){
    Action.removeItem ($$("dashboard-tool-main"        ));
    Action.removeItem ($$("dashboard-tool-adaptive"    ));
}

function setLogHeight(height){
    try{
        const log = $$("logLayout");

        log.config.height = height;
        log.resize();
    } catch (err){  
        setFunctionError(err, logNameFile, "setScrollHeight");
    }
}

function setScrollHeight(){
    const logBth = $$("webix_log-btn");

    if ( logBth.config.icon == "icon-eye" ){
        setLogHeight(90);
        setLogHeight(5);
    } else {
        setLogHeight(5);
        setLogHeight(90);
    }
   
}

function addSuccessView (dataCharts){

    if (!action){
    
        createDashboardCharts  (idsParam, dataCharts);
        createFilterLayout     (inputsArray);
       
    } else {
        Action.removeItem       ($$("dashboardInfoContainerInner"));
        Action.removeItem       ($$("dash-template"              ));
        createDashboardCharts   (idsParam, dataCharts);

    }
    
}

function setUpdate(dataCharts){
    if (dataCharts == undefined){
        setLogValue   ("error", "Ошибка при загрузке данных");
    } else {
        addSuccessView(dataCharts);
    }
}

function setUserUpdateMsg(){
    if ( url.includes("?") || url.includes("sdt") && url.includes("edt") ){
        setLogValue("success", "Данные обновлены");
    } 
}

function addLoadElem(){
    if (!($$("dashLoad"))){
        const view = {
            view  : "align", 
            align : "middle, center",
            id    : "dashLoad",
            borderless : true, 
            body  : {  
                borderless : true, 
                template   : "Загрузка ...", 
                height     : 50, 
                css        : {
                    "color"     : "#858585",
                    "font-size" : "14px!important"
                }
            }
            
        };
    
        $$("dashboardInfoContainer").addView(view, 2);
    }   
}

function getChartsLayout(){
    addLoadElem()
    const getData = webix.ajax().get(url);
  
    getData.then(function(data){
        Action.removeItem($$("dashLoad"));
        const dataCharts    = data.json().charts;
  
        Action.removeItem($$("dashBodyScroll"));
 
        if ( !action ){ //не с помощью кнопки фильтра
            removeFilter();
        }
        
        removeCharts    ();
        setUpdate       (dataCharts);
        setUserUpdateMsg();
        setScrollHeight ();
    });
   
    getData.fail(function(err){
        setAjaxError(err, logNameFile, "getAjax");
    });
    
}


function createDynamicElems ( path, array, ids, btnPress = false ) {
    inputsArray = array;
    idsParam    = ids;
    action      = btnPress;
    url         = path;
    
    getChartsLayout();

}

export {
    createDynamicElems
};
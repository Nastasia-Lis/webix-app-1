import { setLogValue }                    from '../../../logBlock.js';
import { setAjaxError, setFunctionError } from "../../../../blocks/errors.js";
import { Action }                         from '../../../../blocks/commonFunctions.js';
import { createHeadline }                 from '../../../viewHeadline/_layout.js';
import { createFilterLayout }             from '../filter/filterLayout.js';
import { createDashboardCharts }          from './chartsLayout.js';
import { createOverlayTemplate }          from '../../../../viewTemplates/loadTemplate.js';
import { LoadServerData, GetFields }      from "../../../../blocks/globalStorage.js";
import { getDashId }                      from '../common.js';

import { returnLostFilter }               from '../returnLostFilter.js';


const logNameFile = "dashboards => createSpace => dynamicElems";

let inputsArray;
let idsParam;
let action;
let url;

function removeCharts(){
    Action.removeItem ($$("dashboardInfoContainerInner"));
    //Action.removeItem ($$("dash-template"              ));
}

function removeFilter(){
    Action.removeItem ($$("dashboard-tool-main"    ));
    Action.removeItem ($$("dashboard-tool-adaptive"));
}

function setLogHeight(height){
    try{
        const log = $$("logLayout");

        log.config.height = height;
        log.resize();
    } catch (err){  
        setFunctionError(
            err, 
            logNameFile, 
            "setScrollHeight"
        );
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
function createDashHeadline(){
    $$("dashboardInfoContainer").addView(
        {id:"dash-headline-container", cols:[createHeadline("dash-template")]}
        
    );
    setDashName(idsParam);
}

function addSuccessView (dataCharts){
  
    if (!action){
   
        Action.removeItem      ($$("dash-headline-container"));
        createDashHeadline     ();
        createDashboardCharts  (idsParam, dataCharts);
        createFilterLayout     (inputsArray);
        returnLostFilter       (idsParam);

    } else { // charts updated by click button
        Action.removeItem       ($$("dashboardInfoContainerInner"));
        createDashboardCharts   (idsParam, dataCharts);
    }
    
}

function setUpdate(dataCharts){
    if (dataCharts == undefined){
        setLogValue   (
            "error", 
            "Ошибка при загрузке данных"
        );
    } else {
        addSuccessView(dataCharts);
    }
}

function setUserUpdateMsg(){
    if ( url.includes("?")   || 
         url.includes("sdt") && 
         url.includes("edt") )
        {
        setLogValue(
            "success", 
            "Данные обновлены"
        );
    } 
}

function addLoadElem(){
    const id = "dashLoad";
    if (!($$(id))){
        Action.removeItem($$("dashLoadErr"));

        const view = createOverlayTemplate(id);
        $$("dashboardInfoContainer").addView(view);
    }   
}


function removeLoadView(){
    Action.removeItem($$("dash-load-charts"));
}

function getChartsLayout(){
    addLoadElem();
    const getData = webix.ajax().get(url);
  
    getData.then(function(data){
   
        const err = data.json();
        if (err.err_type == "i"){

            Action.removeItem($$("dashLoad"));
            const dataCharts    = data.json().charts;
    
            Action.removeItem($$("dashBodyScroll"));
    
            if ( !action ){ //не с помощью кнопки фильтра
                removeFilter();
            }
            
            removeCharts    ();
            setUpdate       (dataCharts);
            setUserUpdateMsg();
            removeLoadView  ();
            setScrollHeight ();
         
        } else {
            setFunctionError(
                err.err, 
                logNameFile, 
                "getChartsLayout"
            );
        }
    });
   
    getData.fail(function(err){
        const id = "dashLoadErr";
        Action.removeItem($$("dashLoad"));
        if ( !$$(id) ){
            $$("dashboardInfoContainer").addView(  
            createOverlayTemplate(id, "Ошибка"));
        }
   
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
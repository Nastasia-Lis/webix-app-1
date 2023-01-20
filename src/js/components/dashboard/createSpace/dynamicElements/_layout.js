///////////////////////////////

// Создание charts

// Copyright (c) 2022 CA Expert

/////////////////////////////// 

import { setLogValue }                    from '../../../logBlock.js';
import { setFunctionError }               from "../../../../blocks/errors.js";
import { Action }                         from '../../../../blocks/commonFunctions.js';
import { ServerData }                     from "../../../../blocks/getServerData.js";

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

    const maxHeight = 90;
    const minHeight = 5;
    if ( logBth.config.icon == "icon-eye" ){
        setLogHeight(maxHeight);
        setLogHeight(minHeight);
    } else {
        setLogHeight(minHeight);
        setLogHeight(maxHeight);
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



function errorActions(){
    const id = "dashLoadErr";
    Action.removeItem($$("dashLoad"));
    if ( !$$(id) ){
        $$("dashboardInfoContainer").addView(  
        createOverlayTemplate(id, "Ошибка"));
    }
}


function getChartsLayout(){
    addLoadElem();

    new ServerData({
    
        id           : url,
        isFullPath   : true,
        errorActions : errorActions
       
    }).get().then(function(data){

        if (data){

            const charts = data.charts;

            if (charts){

                Action.removeItem($$("dashLoad"));
        
                Action.removeItem($$("dashBodyScroll"));
        
                if ( !action ){ //не с помощью кнопки фильтра
                    removeFilter();
                }
                
                removeCharts    ();
                setUpdate       (charts);
                setUserUpdateMsg();
                removeLoadView  ();
                setScrollHeight ();

            }
        }
         
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
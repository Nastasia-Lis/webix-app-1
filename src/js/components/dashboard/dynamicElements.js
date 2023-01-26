///////////////////////////////

// Очищение рабочего пространства, 

// создание charts (create charts),

// пересоздание утерянного после перезагрузки
// фильтра (return lost filter)

// создание фильтра (create filter):
// создание inputs  (create inputs)
// кнопка Применить (create submit btn)
// создание layout  (create filter layout)

// обработка клика на элемент (create item click)
// Навигация на другую страницу (navigate other page), обновление таблицы 
// в данном дашборде (update space), показ контекстного окна (context window)


// Copyright (c) 2022 CA Expert

/////////////////////////////// 

import { setLogValue }                    from '../logBlock.js';
import { setFunctionError }               from "../../blocks/errors.js";
import { Action }                         from '../../blocks/commonFunctions.js';
import { ServerData }                     from "../../blocks/getServerData.js";

import { createHeadline }                 from '../viewHeadline.js.js';
import { createOverlayTemplate }          from '../../viewTemplates/loadTemplate.js';
import { LoadServerData, GetFields }      from "../../blocks/globalStorage.js";
import { mediator }                       from "../../blocks/_mediator.js";

import { Button }               from '../../viewTemplates/buttons.js';
 

const logNameFile = "dashboard/dynamicElements";

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
    const itemTreeId = idsParam;
    
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






// create charts


function returnHeadline (titleTemplate){
    const headline = {   
        template    : titleTemplate,
        borderless  : true,
        height      : 35,
        css         : "dash-HeadlineBlock",
    };
 
    return headline;
}
// const action = {
//     navigate: true,
//     field   : "auth_group",
//   //  context : true,
//     params  :{
//        // filter : "auth_group.id = 3" 
//      filter : "auth_group.id != '1' or auth_group.id != '3' and auth_group.role contains 'р' or auth_group.role = 'а'" 
//     } 
// };

function returnDefaultWidthChart(){
    const container = $$("dashboardInfoContainer");
    if (container){
        const width = container.$width;
        const k     = 2;

        return width/k;
    } else {
        return 500;
    }
}
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
          { "view":"label", "label":"Без цвета: ???"        ,"minWidth":200,"action":action,"css":{"text-align":"center"}}
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
        //     "minWidth":200,
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
     
        //  dataCharts.push(table);
       // dataCharts.push(res);
      
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
       
            const heightElem = el.height   ? el.height   : 300;
            const widthElem  = el.minWidth ? el.minWidth : returnDefaultWidthChart();
    
 
            layout.push({
                css : "webix_dash-chart",
             
                rows: [ 
                    {template:' ', height:20, css:"dash-delim"},
                    returnHeadline (titleTemplate),
                    {   margin     : 4,
                        minHeight  : heightElem,
                        minWidth   : widthElem,
                        padding    : 4,
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
        container.config.idDash = idsParam;
    }
}


function createDashLayout(dataCharts){
    const layout = createChart(dataCharts);
 
    // const dashLayout = [
    //     {  
    //         cols : layout
            
    //     }
    // ];
 
    const dashCharts = {
        id  : "dashboard-charts",
        view: "flexlayout",
        css : "webix_dash-charts-flex",
        cols: layout,
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




// return lost filter


function setDataToTab(currState){
    const data = mediator.tabs.getInfo();
 
    if (data){
        if(!data.temp){
            data.temp = {};
        }
        if(!data.temp.filter){
            data.temp.filter = {};
        }

        data.temp.filter.dashboards = true;
        data.temp.filter.values     = currState;

        mediator.tabs.setInfo(data);
    }
}


function returnLostFilter (id){
    const url       = window.location.search;
    const params    = new URLSearchParams(url);
    const viewParam = params.get("view"); 

    
    if (viewParam == "filter"){
        $$("dashFilterBtn").callEvent("clickEvent", [ "" ]);

        const data = webix.storage.local.get("dashFilterState");
  
        if (data){
       
            const content = data.content;

         
            if (content){
                setDataToTab(content);

                content.forEach(function(el){
                    const input = $$(el.id);
                    if (input){
                        let value = el.value;

                        if (input.config.id.includes("-time")){
                            const formatting = webix.Date.dateToStr("%H:%i:%s");
                            value = formatting(value);
                        }
                        
                        
                        input.setValue(value);
                    }
                });

            }
        
        }
      
    }
}


//create filter

function setTabInfo(sentVals){
    
    const tabData =  mediator.tabs.getInfo();

    if (tabData){
        if (!tabData.temp){
            tabData.temp = {};
        }
        tabData.temp.filter = {
            dashboards: true,
            values    : sentVals,
        };
    }
}

function setToStorage(input){

    const container = input.getParentView();
    const childs    = container.getChildViews();
    const newValues = [];

    childs.forEach(function(el){

        if (el.config.view == "datepicker"){
            newValues.push({
                id    : el.config.id,
                value : el.config.value
            });
        }
    });
  
    if (newValues.length){
        const content = {
            content : newValues
        };
        webix.storage.local.put("dashFilterState", content);

        setTabInfo(newValues);
    }

   
}



// create inputs

const dynamicInputs = [];
let   findAction;
let   idsParameter;

function setAdaptiveWidth(elem){
    const child       = elem.getNode().firstElementChild;
    child.style.width = elem.$width + "px";

    const inp         = elem.getInputNode();
    inp.style.width   = elem.$width - 5 + "px";
}

function resetInvalidView(self){
    const node   = self.getNode();
    const input  = node.getElementsByTagName("input")[0];
    const css    = "dash-filter-invalid";
    if (input){
        const isInvalid = input.classList.contains(css);
        if (isInvalid){
            webix.html.removeCss(input, css);
        }   
    } 
}

function setNullTimeValue(self){
    const value = self.getText();
    if (!value){
        this.setValue("00:00:00");
    }
}

function createDate(input, id){

    const dateTemplate = {
        view        : "datepicker",
        id          : `dashDatepicker_${id}`,
        format      : "%d.%m.%y",
        sentAttr    : id,
        editable    : true,
        value       : new Date(),
        placeholder : input.label,
        keyPressTimeout:900,
        height      : 42,
        on          : {
            onItemClick:function(){
                resetInvalidView(this);
            },
            onAfterRender : function () {
                this.getInputNode().setAttribute(
                    "title",
                    input.comment
                );

               setAdaptiveWidth(this);
            },

            onChange:function(newV, oldV, config){
                if(config){
                    setToStorage(this);
                }
               
            },

            onTimedKeyPress:function(){
                setToStorage(this);
            },
        }
    };


    return dateTemplate;

}



function createTime (id){
    const timeTemplate =  {   
        view        : "datepicker",
        id          :`dashDatepicker_${id}-time`,
        sentAttr    : id,
        format      : "%H:%i:%s",
        placeholder : "Время",
        height      : 42,
        editable    : true,
        keyPressTimeout:900,
        value       : "00:00:00",
        type        : "time",
        seconds     : true,
        suggest     : {

            type    : "timeboard",
            css     : "dash-timeboard",
            hotkey  : "enter",
            body    : {
                button  : true,
                seconds : true,
                value   : "00:00:00",
                twelve  : false,
                height  : 110, 
            },
        },
        on: {
            onItemClick:function(){
                resetInvalidView(this);
            },

            onTimedKeyPress:function(){
                setNullTimeValue(this);
                setToStorage(this);
            },
            onAfterRender: function () {
                this.getInputNode()
                .setAttribute(
                    "title",
                    "Часы, минуты, секунды"
                );
                setAdaptiveWidth(this);
            },

        }
    };

    return timeTemplate;
}


function createBtn (input, i){

    const btnFilter = new Button({
        
        config   : {
            id       : "dashBtn" + i,
            hotkey   : "Ctrl+Shift+Space",
            value    : input.label,
            click    : function(){
                clickBtn(
                    i, 
                    dynamicInputs, 
                    idsParameter, 
                    findAction
                );
            },
        },
        titleAttribute : input.comment,
        onFunc :{
            onViewResize:function(){
              setAdaptiveWidth(this);
            }
        }

    
    }).maxView("primary");

    return  btnFilter;
}


function createHead(text){
    return {   
        template   : text,
        height     : 30, 
        borderless : true,
        css        : "webix_template-datepicker"
    };
}


function createDatepicker(input, id){

    const inputs = {   
        width   : 200,
        rows    : [ 
            createHead (input.label),
            createDate (input, id),
            createTime (id),
            { height:20 },
        ]
    };
    if (dynamicInputs){
        dynamicInputs.push( inputs );
    }
       
}

function createText(input, id){
    
    const value = input.value ? input.value : "";
    const inputs = {   
        width   : 200,
        rows    : [ 

            createHead (input.label),
            { 
                view        : "text", 
                value       : value, 
                sentAttr    : id,
                placeholder : input.label,
            },
            { height:20 },
        ]
    };
   

    if (dynamicInputs){
        dynamicInputs.push( inputs );
    }
}



function dataTemplate(i, valueElem){
    const template = { 
            id    : i + 1, 
            value : valueElem
        };
    return template;
}


function createOptions(content){
    const dataOptions = [];
    if (content && content.length){
        content.forEach(function(name, i) {
     
            let title = name;
            if ( typeof name == "object"){
                title = name.name;
            }

            const optionElement = dataTemplate(i, title);
            dataOptions.push(optionElement); 
        });
    }

    return dataOptions;
}

function getOptionData (field){

    return new webix.DataCollection({url:{
        $proxy:true,
        load: function(){
            return ( 
                
                new ServerData({
                    id : field.apiname,
                
                }).get().then(function(data){
                
                    if (data){
                
                        const content = data.content;
                   
                        if (content && content.length){
                            return createOptions(content);
                        } else {
                            return [
                                { 
                                    id    : 1, 
                                    value : ""
                                }
                            ];
                        }
                    }
                    
                })

            );
            
        
            
        }
    }});
}


function createCombo(input, id){
 
    const inputs = {   
        width   : 200,
        rows    : [ 

            createHead (input.label),
            {
                view          : "combo", 
                placeholder   : input.label,
                sentAttr      : id,
                options       : getOptionData (input)
            },
            { height:20 },
        ]
    };

    if (dynamicInputs){
        dynamicInputs.push( inputs );
    }
}

function createFilter (inputs, el, ids){

    idsParameter         = ids;
    dynamicInputs.length = 0;

    const keys   = Object.keys(inputs);
    const values = Object.values(inputs);

    values.forEach(function(input, i){
 
        if (input.type == "datetime"){ 
            createDatepicker(input, keys[i]);

        } else if (input.type == "string"){
            createText(input, keys[i]);
        } else if (input.type == "apiselect"){
            createCombo(input, keys[i])

        } else if (input.type == "submit"){

            const actionType    = input.action;
            findAction          = el.actions[actionType];
            
            dynamicInputs.push(
                {height : 15}
            );
            dynamicInputs.push(
                createBtn (input, i)
            );

        }


    });

    return dynamicInputs;
  
}





// create submit btn


let inputs;
let ids;
let fieldAction;


let sdtDate;
let edtDate;


const dateArray     = [];
const compareDates  = [];



function createTimeFormat(id, type){
    const formatTime     = webix.Date.dateToStr("%H:%i:%s");
    const value          = $$(id).getValue();
    const formattedValue = " " + formatTime(value);
    try{
        if (value){
            
            if (type == "sdt"){
                sdtDate = sdtDate.concat(formattedValue);
            } else if (type == "edt"){
                edtDate = edtDate.concat(formattedValue);
            }
    
        } else {
          //  validateEmpty = false;
        }
    } catch (err){  
        setFunctionError(
            err,
            logNameFile,
            "createTimeFormat"
        );
    }
}

function createDateFormat(id, type){
    try{
        if ( $$(id).getValue() !== null ){

            const value      = $$(id).getValue();
            const formatDate = webix.Date.dateToStr("%d.%m.%y");

            if (type == "sdt"){
                sdtDate = formatDate(value); 
            } else if ( type ==  "edt"){
                edtDate = formatDate(value);
            }
        
        } else {
          //  validateEmpty = false;
        }
    } catch (err){  
        setFunctionError(
            err,
            logNameFile,
            "createDateFormat"
        );
    }
}

function createFilterElems(id, type){
    if (id.includes(type)){

        if (id.includes("time")){
            createTimeFormat(id, type);

        } else {
            createDateFormat(id, type);

        }
    }
}

function enumerationElements(el){
   
    const childs = $$(el.id).getChildViews();

    childs.forEach(function(elem){
        const id = elem.config.id;
        createFilterElems(id, "sdt");
        createFilterElems(id, "edt");
    });

}


function setInputs(){
    try{
        inputs.forEach(function(el){
            if ( el.id.includes("container") ){
                enumerationElements(el);
            }
        });
    } catch (err){  
        setFunctionError(
            err,
            logNameFile,
            "setInputs"
        );
    }
}
function createQuery(type, val){
    dateArray.push( type + "=" + val );
    compareDates.push( val ); 
}



function getDataInputs(){
    setInputs   ();
    createQuery("sdt", sdtDate);
    createQuery("edt", edtDate);
}


function loadView(){
    const charts = $$("dashboard-charts");
    const parent = charts.getParentView();
    Action.removeItem(charts);
    parent.addView({
        id       : "dash-load-charts",
        template : "Загрузка..."
    }); 
}

function findInputs(arr, result){

    arr.forEach(function(el){
        const view = el.config.view;

        if (view){
            result.push(el);
        }
    });

}
function findElems(){
    const container = $$("dashboardFilterElems");
    const result = [];
    if (container){
        const elems =  container.getChildViews();

        if (elems && elems.length){
            elems.forEach(function(el){
    
                const view = el.config.view;
                if (!view || view !=="button"){
                    const childs = el.getChildViews();
                    if (childs && childs.length){
                        findInputs(childs, result);
                        
                    }
         
                }
            });
        }
       
    }

    return result;
}

function returnFormattingTime(date){
    const format = webix.Date.dateToStr("%H:%i:%s");

    return format(date);
}

function returnFormattingDate(date){
    const format = webix.Date.dateToStr("%d.%m.%y");

    return format(date);
}

function findEachTime(obj, id){
    const res = obj.time.find(elem => elem.id === id);
    return res;
}

function createFullDate(obj, resultValues){
 
    obj.date.forEach(function(el){
        const id    = el.id;
        const value = el.value;
        if (id){
            const time  = findEachTime(obj, id);

            resultValues.push(id + "=" + value + "+" + time.value);
    
        }
    });

 

}


function formattingValues(values){

    const resultValues = [];

    let emptyValues = 0;
    const dateCollection = {
        time : [],
        date : []
    };

 

    values.forEach(function(el){

        let   value  = el.getValue();
        const view   = el.config.view;

        const sentAttr = el.config.sentAttr;
        const type     = el.config.type;

        if (value){

            if (view == "datepicker"){

                if(type && type == "time"){
                    value = returnFormattingTime(value);
                    dateCollection.time.push({
                        id   : sentAttr,
                        value: value
                    });
                } else {
                    value = returnFormattingDate(value);
                    dateCollection.date.push({
                        id   : sentAttr,
                        value: value
                    });
                }  

            } else {
                resultValues.push(sentAttr + "=" + value);
            }
           
        } else {
            emptyValues ++;
        }
    
    });

    
    if (dateCollection.time.length && dateCollection.date.length){
        createFullDate(dateCollection, resultValues);
 
    }

    return {
        values     : resultValues,
        emptyValues: emptyValues
    };

}


function sentQuery (){
    const inputs = findElems();
    let values;
    let empty = 0;

    if (inputs && inputs.length){
        const result = formattingValues(inputs);
        values = result.values;
        empty  = result.emptyValues;
    }
 
    if (!empty){

        const getUrl = fieldAction.url + "?" + values.join("&");
    
        loadView();

        createDynamicElems(
            getUrl, 
            inputs,
            ids, 
            true
        );


    } else {
      
        //setInvalidView("empty", childs);
     
        setLogValue(
            "error", 
            "Не все поля заполнены"
        );
    }
}

function clickBtn(i, inputsArr, ids, action){

  //  index       = i;
    inputs      = inputsArr;
    ids         = ids;
    fieldAction = action;

    dateArray   .length = 0;
    compareDates.length = 0;


    sdtDate         = "";
    edtDate         = "";
   // validateEmpty   = true;

    getDataInputs();
    sentQuery ();
}





//create filter layout


function backBtnClick (){
    Action.hideItem ($$( "dashboardTool"));
    Action.showItem ($$( "dashboardInfoContainer"));
}


function createMainView(inputsArray){

    const headline = {  
        template    : "Фильтр",
        height      : 30, 
        css         : "webix_dash-filter-headline",
        borderless  : true
    };

    const filterBackBtn = new Button({
    
        config   : {
            id       : "dash-backDashBtn",
            hotkey   : "Esc",
            hidden   : true,  
            icon     : "icon-arrow-right", 
            click   : function(){
                backBtnClick();
            },
        },
        titleAttribute : "Вернуться к дашбордам"
    
       
    }).minView();
    
 
    const mainView = {
        id      : "dashboard-tool-main",
        padding : 20,
        hidden  : true,
        minWidth: 250,
        rows    : [
            {   id  : "dashboardToolHeadContainer",
                cols: [
                    headline,
                    filterBackBtn,
                ]
            },
            
            {   id  : "dashboardFilterElems",
                rows : inputsArray }
        ], 
    };

    try{
      
        $$("dashboardTool").addView( mainView, 0);
    } catch (err){  
        setFunctionError(
            err, 
            logNameFile, 
            "createMainView"
        );
    }
}



function filterBtnClick (){
    const dashTool      = $$("dashboard-tool-main");
    const container     = $$("dashboardContainer" );
    const tree          = $$("tree");
    const backBtn       = $$("dash-backDashBtn");
    const tools         = $$("dashboardTool");
    const infoContainer = $$("dashboardInfoContainer");

    function filterMinAdaptive(){

        Action.hideItem (tree);
        Action.hideItem (infoContainer);
        Action.showItem (tools);
        Action.showItem (backBtn);

        tools.config.width = window.innerWidth - 45;
        tools.resize();
    }

    function filterMaxAdaptive(){
        Action.removeItem($$("dashContextLayout"));
        Action.hideItem  ($$("dashboardContext" ));
        if (dashTool.isVisible()){
            Action.hideItem (tools);
        
            mediator.linkParam(false, "view");
            mediator.tabs.clearTemp("dashFilterState", "filter");
          

        } else {
            Action.showItem (tools);
            Action.showItem (dashTool);
        
            mediator.linkParam(true, {"view": "filter"});
            mediator.tabs.clearTemp("dashTableContext", "context");
        }
    }

    filterMaxAdaptive();


    const minWidth = 850;
    if (container.$width < minWidth){
        Action.hideItem(tree);

        if (container.$width  < minWidth ){
            filterMinAdaptive();
        }

    } else {
        Action.hideItem(backBtn);      
    }


}


function addViewToContainer(filterBtn){
 
    const container     = $$("dash-template").getParentView();
    const containerView = $$(container.config.id);
  
    if (!$$("dashFilterBtn")){
      
        containerView.addView(
            {   id  : "dashboard-tool-btn",
                cols: [
                    filterBtn
                ]
            }
        ,2);
    }
}


function createFilterBtn(){

    const filterBtn = new Button({
        config   : {
            id       : "dashFilterBtn",
            hotkey   : "Ctrl+Shift+F",
            icon     : "icon-filter", 
            click   : function(){
                filterBtnClick();
            },
        },
        titleAttribute : "Показать/скрыть фильтры",
        onFunc:{
            clickEvent:function(){
                filterBtnClick();
            }
        }
    
       
    }).transparentView();
  
  
    addViewToContainer(filterBtn);
  
}



function createFilterLayout(inputsArray){

    createMainView (inputsArray);
    createFilterBtn();
}





// create item click



const actionExample = {
    navigate: "true - переход на другую страницу, false - обновление в данном дашборде",
    context : "true - открыть окно с записью таблицы, false - обновить таблицу",
    field   : "название из fields (id таблицы должен быть идентичным, если navigate = false)",
    params  :{
        // sorts
        filter : "auth_group.id > 3", 
    }
   
};

// const action2 = {
//     navigate: false,
//     field   : "auth_group", 
//     context : true,
//     params  : {
//        filter : "auth_group.id = 1" 
//     // filter : "auth_group.id != '1' or auth_group.id != '3' and auth_group.role contains 'р' or auth_group.role = 'а'" 
//        // filter:"auth_user.registration_key != '3dg' and auth_user.registration_id = 'dfgg'"
//     } 
// };

function setCursorPointer(areas, fullElems, idElem){

    areas.forEach(function(el){
        if (el.tagName){
            const attr = el.getAttribute("webix_area_id");

            if (attr == idElem || fullElems){
                el.style.cursor = "pointer";
            }
            
        }
    });

}

function cursorPointer(self, elem){

    const node           = self.getNode();
    const htmlCollection = node.getElementsByTagName('map');
    const mapTag         = htmlCollection.item(0);

    if (mapTag){
        const areas      = mapTag.childNodes;
    
        if (elem.action){
            setCursorPointer(areas, true);
        } else if (elem.data){
            elem.data.forEach(function(el, i){

                // if (i == 1 || i == 4 ){
                //     el.action = action2; 
                // }
            
                if (el.action){
                    setCursorPointer(areas, false, el.id);
                }
            });
        }

       
    } else if (node){
        node.style.cursor = "pointer";
    }
}

async function findField(chartAction){
    await LoadServerData.content("fields");
    const keys = GetFields.keys;

    let field = chartAction;

    if (chartAction && chartAction.field){
        field = chartAction.field;
    }

    let isExists = false;

    keys.forEach(function(key){
       
        if ( key == field ){
            isExists = true;
            if (chartAction.navigate){
                navigate(chartAction.field, chartAction.params.filter);
            } else {
       
                updateSpace(chartAction);
                webix.storage.local.put("dashTableContext", chartAction);
            } 
        
        }
    });

    if (!isExists){ 
        setFunctionError(
            "Key «" + field + "» doesn't exist", 
            "dashboard / create space / click / itemClickLogic", 
            "findField"
        );

        mediator.linkParam(false, "src");
        mediator.linkParam(false, "filter");
    }

 
}

function findInnerChartField(elem, idEl){
    // найти выбранный элемент в data
    const collection = elem.data;
        
    let selectElement;

    collection.forEach( function (el){
        if (el.id == idEl){
            selectElement = el;
        }
    });

    const chartAction = selectElement.action;

    if (chartAction){
        findField(chartAction);

    } 
}

function setAttributes(elem, topAction){
    if (topAction){
        elem.action = topAction;
    }
  //  elem.action = action2;
    elem.borderless = true;
    elem.minWidth   = 250;
    elem.on         = {
        onAfterRender: function(){
            cursorPointer(this, elem);
        },

        onItemClick  : function(idEl){

            console.log("пример: ", actionExample);
    
            if (elem.action){ // action всего элемента
                findField(elem.action);
                
            } else {          // action в data
                findInnerChartField(elem, idEl);
            }
            
        },

    };
     
    return elem;
}


function iterateArr(container, topAction){
    let res;
    const elements = [];

    function loop(container){

        if (container) {
            container.forEach(function(el){
              
                if (el){
                    const nextContainer = el.rows || el.cols || [el.body];
            
                    if (!el.rows && !el.cols){
                     
                        if (el.view && el.view !=="scrollview" && el.view !== "flexlayout"){
                            el = setAttributes(el, topAction);
                        }
                        
                        elements.push(el);
                    } else {
                        loop(nextContainer);
                    }
                }
            });
        }
    }

    loop (container);

    if (elements.length){
        res = elements;
    }

    return res;
}



function returnEl(element, topAction){

    const container = element.rows || element.cols || [element.body];
   
  
    let resultElem;
    
    container.forEach(function(el){
        const nextContainer = el.rows || el.cols || [el.body];
     
        if (nextContainer[0]){
            resultElem = iterateArr(nextContainer, topAction);
        } else {
            resultElem = setAttributes(el, topAction);
        }

    });

    return resultElem;
}




//////// navigate other page

function returnConditions(filter){
    const array = filter.split(' ');

    const conditions = [];
    let r            = "";
    let counter      = 0;

    array.forEach(function(el, i){
        const length = array.length;

        if (length - 1 === i){
            r += " " + el;
            counter ++;
        }

        if (counter >= 4 || length - 1 === i){
            conditions.push(r);
            r       = "";
            counter = 0;
        }

        if (counter < 4){
            r += " " + el;
            counter ++;
        }

        
    });
   

    return conditions;
}



const filterArr = [];
const idsElem   = [];


function setInputValue(value){
    let trueValue;
    if (value){
        trueValue = value.replace(/['"]+/g, '');
    }

    return trueValue;
  
}

function checkCondition(arr, index){
    let parent  = null;
   
    let id      = arr[1];
    const i     = id.lastIndexOf(".") + 1;
    id          = id.slice(i);

    let logic   = arr[4];
    const value = setInputValue(arr[3]);

    idsElem.push(id);
  
    const isUnique = idsElem.filter(elem => elem == id);

    if (isUnique.length > 1){ // isnt unique

        parent  = id; 
        id      = id + "_filter-child-"+ webix.uid();

    } else {
        id = id + "_filter";
    }


    if (logic == "and"){
        logic = "1";
    } else {
        logic = "2";
    }
    
 
    
    filterArr.push({
        id        : id,
        value     : value,
        operation : arr[2],
        logic     : logic,
        parent    : parent,
        index     : index
    });
}


function iterateConditions(conditions){

    conditions.forEach(function(el, i){
        const arr = el.split(' ');
        checkCondition(arr, i);
     
    });

    return filterArr;

}



function returnFilter(query){

    const conditions = returnConditions(query);
 
    iterateConditions(conditions);
}
function checkFieldType(field){

    const item = GetFields.item(field);

    if (item){
        return item.type;
    } else {
        LoadServerData("fields").then(function(data){
            checkFieldType(field);
        });
    }
 
}

function navigate(field, filter){
    const type = checkFieldType(field);
  
    if (type){
        let infoData ;

        if (type == "dbtable"){
            filterArr.length = 0;
            idsElem.length       = 0;
        
            if (field){
        
                returnFilter(filter);
            
                infoData = {
                    tree:{
                        field : field,
                        type  : "dbtable"
                    },
                    temp:{
                        filter     : {
                            id     : field, 
                            values : {values : filterArr}
                        },
                        queryFilter :  filter
                    }
                };
        
              
        
            } 
        } else if (type == "tform"){
            infoData = {
                tree:{
                    field : field,
                    type  : "tform"
                },
            };
        } else if (type == "dashboard"){
            infoData = {
                tree:{
                    field : field,
                    type  : "dashboard"
                },
            };
        }
    
        if (infoData){
            mediator.tabs.openInNewTab(infoData);
        }
    

    }
  
  
}







////////update space
function createSentQuery(filter, sorts){
 
    const query = [ 
        "query=" + filter , 
        "sorts=" + sorts  , 
        "limit=" + 80, 
        "offset="+ 0
    ];

    return query;
}


function scrollToTable(tableElem){
    const node = tableElem.getNode();
    node.scrollIntoView();
}



function setToTab(field, filter){
    const data = mediator.tabs.getInfo();
  
    if (data){
        if(!data.temp){
            data.temp = {};
        }
        if(data.temp.filter){
            delete data.temp.filter;
        }

        data.temp.context = {};

        data.temp.context.id     = field;
        data.temp.context.filter = filter;
  
        mediator.tabs.setInfo(data);

    } 

   
}

function setParamsToLink(id){
    mediator.linkParam(true, {
        "src"    : id , 
        "filter" : true  
    });
}

function clearParams(){
    mediator.linkParam(false, "src");
    mediator.linkParam(false, "filter");
}

function setDataToTable(table, data){

    const tableElem = $$(table);

    if (tableElem){
        tableElem.clearAll();
        tableElem.parse(data);

        setParamsToLink(table);
        scrollToTable  (tableElem);
    } else {    
        setFunctionError(
            "Таблица с id «" + table + 
            "» не найдена на странице", 
            logNameFile, 
            "setDataToTable"
        );

        clearParams();
    }
  
}

function getTableData(tableId, query, onlySelect){

    const fullQuery = query.join("&");

    new ServerData({
    
        id           : "smarts?" + fullQuery,
        isFullPath   : false,
        errorActions : clearParams
       
    }).get().then(function(data){
  
        if (data){

            const content = data.content;

            if (content){
                const item = content[0];
        
                if (!onlySelect){
                    setToTab   (tableId, fullQuery);
                    setDataToTable (tableId, content);
                } else if (item){
                    createContextProperty (item, tableId);
                }

            }
        }
         
    });

}

function updateSpace(chartAction){
 
    const tableId     = chartAction.field;

    const filter      = chartAction.params.filter;
    const filterParam = filter || tableId + ".id > 0" ;

    const sorts     = chartAction.params.sorts;
    const sortParam = sorts || tableId + ".id" ;
    const query     = createSentQuery(filterParam, sortParam);

    const onlySelect= chartAction.context;

    getTableData(tableId, query, onlySelect);
    

}








//context window

let container;
let item;
let field;

const headline  = {
    template    : "<div class='no-wrap-headline'>Подробности</div>", 
    css         : "webix_popup-headline", 
    borderless  : true, 
    height      : 40 
};

function closeBtnClick(){
    Action.removeItem($$("dashContextLayout"));
    Action.hideItem  (container);
    Action.showItem  ($$("dashboardInfoContainer"));

    mediator.linkParam(false, "id");
    mediator.linkParam(false, "src");
}

const closeBtn  = new Button({
    config   : {
        id     : "dashContexCloseBtn",
        hotkey : "Esc",
        icon   : "icon-arrow-right", 
        click  : function (){
            closeBtnClick();
        }
    },
    css            : "webix-transparent-btn",
    titleAttribute : "Скрыть конекстное окно"

   
}).minView();

async function findLabels(){
    await LoadServerData.content("fields");

    const tableData = GetFields.item(field);
    const fields    = Object.values (tableData.fields);
    const labels    = [];
    fields.forEach(function(el){
        labels.push(el.label);
    });

    return labels;
}

async function createPropElements(){

    const data = [];
        if (item){
        const values = Object.values(item);
        const keys   = Object.keys(item);
        const labels = await findLabels();

        values.forEach(function(val, i){

            data.push({
                id    : keys[i],
                label : labels[i], 
                value :  val
            });
        });
    }


    return data;
}

async function returnProperty(){
    const property  = {
        view    : "property",  
        id      : "dashContextProperty", 
        minHeight:100,
        elements: await createPropElements(),
    };

    const propertyLayout = {   
        scroll     : "y", 
        rows       : [
            property,
            {height : 20}
        ]
    };

    return propertyLayout;
}


function goToTableBtnClick(){
    const id = item.id;

    if (item && item.id){

        const propValues = $$("dashContextProperty").getValues();
 
        const infoData = {

            tree : {
                field : field,
                type  : "dbtable" 
            },
            temp : {
                edit  : {
                    selected : id, 
                    values   : {
                        status : "put",
                        table  : field,
                        values : propValues
                    }
                },
              
            }
        };

        mediator.tabs.openInNewTab(infoData);

    }
 
}

const goToTableBtn = new Button({
    
    config   : {
        id       : "goToTableBtn",
        hotkey   : "Ctrl+Shift+Space",
        value    : "Редактировать", 
        click    : function (){
            goToTableBtnClick();
        }
    },
    titleAttribute : "Перейти в таблицу для редактирования записи"

   
}).maxView("primary");



async function createLayout(){
 
    const layout = {
        id      : "dashContextLayout",
        padding : 15,
        rows    : [
            {cols: [
                headline,
                {},
                closeBtn 
            ]},
            await returnProperty(),
           // {height : 20},
            goToTableBtn,
            {}
        ]
      
    };

    return layout;
}

async function createSpace(){
    const content = $$("dashContextLayout");
    if (content){
        Action.removeItem(content);
    }

    if (container){
        container.addView(await createLayout(), 0);
    }
   
}


function setLinkParams(){
    const params = {
        src : field, 
        id  : item.id
    };
    
    mediator.linkParam(true, params);
}

function setToTabStorage(){
    const data = mediator.tabs.getInfo();
  
    if (data){
        if(!data.temp){
            data.temp = {};
        }
        if(data.temp.filter){
            delete data.temp.filter;
        }

        data.temp.context = {};

        data.temp.context.open  = true; // open context window
        data.temp.context.field = field;
        data.temp.context.id    = item.id;
  
        mediator.tabs.setInfo(data);
    } 

    
}

function createContextProperty(data, idTable){
    item  = data;
    field = idTable;

    const filters = $$("dashboardTool");
    Action.hideItem(filters);
    
    container = $$("dashboardContext");
    Action.showItem(container);

    const minWidth   = 850;
    const emptySpace = 45;
    if (window.innerWidth < minWidth){

        container.config.width = window.innerWidth - emptySpace;
 
        container.resize();
        Action.hideItem($$("dashboardInfoContainer"));
    }

    setLinkParams   ();
    createSpace     ();
    setToTabStorage ();
    
}








export {
    createDynamicElems,
    createFilter,
    returnEl,
    setAttributes,
    updateSpace,
    createContextProperty
};
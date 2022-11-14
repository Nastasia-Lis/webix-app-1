import { setLogValue }                    from '../logBlock.js';
import { STORAGE, getData }               from "../globalStorage.js";

import { setAjaxError, setFunctionError } from "../errors.js";

import { setHeadlineBlock }               from '../blockHeadline.js';
import { showElem, hideElem }             from '../commonFunctions.js';



const logNameFile = "getContent => getInfoDashboard";

function getDashId ( idsParam ){
    const tree = $$("tree");
    let itemTreeId;

    if (idsParam){
        itemTreeId = idsParam;
    } else if (tree.getSelectedItem()){
        itemTreeId = tree.getSelectedItem().id;
    }

    return itemTreeId;
}

function removeScroll (){
    try{
        const elem = $$("dashBodyScroll");
        if (elem){
            const parent = elem.getParentView();
            if (elem){
                parent.removeView(elem);
            }
        }
    } catch (err){  
        setFunctionError(err,logNameFile,"removeScroll");
    }
}

function addErrorView(){
          
    function createTools(){
        const dashboardTool = $$("dashboardTool");

        const tools = {
            view:"scrollview",
            id:"dashboard-tool-main",
            borderless:true,
            css:{"margin":"20px!important","height":"50px!important"},
            body: {
                view:"flexlayout",
                padding:20,
                rows:[]
            }
        };

        const headline = {
            rows:[{
                template:"",
                id:"dash-template",
                css:"webix_style-template-count webix-block-title",
                borderless:false,
                height:40,
            }]
        };

        dashboardTool.addView({
            rows:[
                tools,
                headline
            ]
        },0);
    }

    function createBody(){
        const container = $$("dashboardInfoContainer");
        const charts =  {
            id:"dashboard-charts",
            borderless:true,
            body: {
                view:"flexlayout",
                rows:[]
            }
        };

        const dashBody =   {
            view:"scrollview", 
            scroll:"auto",
            id:"dashBodyScroll",
            borderless:true, 
            body:{
                id:"dashboardBody",
                css:"dashboardBody",
                cols:[
                    charts
                ]
            }
        };

        container.addView(dashBody);
    }
   
    createTools();
    createBody();    
}

async function setTableName(idsParam) {
    const itemTreeId = getDashId(idsParam);
    try{
        if (!STORAGE.tableNames){
            await getData("fields"); 
        }

        if (STORAGE.tableNames){
            STORAGE.tableNames.forEach(function(el,i){
                if (el.id == itemTreeId){
                    const template  = $$("dash-template");
                    const value     = el.name.toString();
                    template.setValues(value);
                }
            });
        }
    } catch (err){  
        setFunctionError(err,logNameFile,"setTableName");
    }
}

function removeItems (){

    function setVars(elem){
   
        if (elem){
            try{
                const parent = elem.getParentView();
                if (elem){
                    parent.removeView(elem);
                } 
            } catch (err){
                setFunctionError(err,logNameFile,"getAjax => setVars");
            } 
        }
     
    }

    setVars ($$("dashboardInfoContainerInner")  );
    setVars ($$("dash-template")                );
    setVars ($$("dashboard-tool-main")          );
    setVars ($$("dashboard-tool-adaptive")      );
 
}

const dashLayout = [
    {   type : "wide",
        rows : []
    }
];

function clearDashLayout(){
    if ( dashLayout[0].rows.length ){
        dashLayout[0].rows = [];
    }  
}

function goToRefView(chartAction){

    let field = chartAction;

    if (chartAction.field){
        field = chartAction.field;
    }

    const searchParams = new URLSearchParams( chartAction.params ).toString();
    let url            = "tree/" + field;

    if (searchParams.length){
        url = url + "?" + searchParams;
    }

    //query=1&bar=2
    Backbone.history.navigate(url, { trigger : true });
    window.location.reload();
}



const action = {
    field  : "auth_group",
    params :{
        filter : "auth_group.id > 3" 
    //   filter : "auth_group.id != '1' or auth_group.id != '3' and auth_group.role contains 'р' or auth_group.role = 'а'" 
    }
   
};

function setCursorPointer(areas, fullElems, idElem){

    areas.forEach(function(el,i){
        if (el.tagName){
            const attr = el.getAttribute("webix_area_id");

            if (attr == idElem || fullElems){
                el.style.cursor = "pointer";
            }
            
        }
    });

}

function setAttributes(elem){

  //  elem.action = action;
  
    elem.borderless  = true;
    elem.minWidth    = 250;
    elem.on          = {
        onAfterRender:function(){
            const chart          = this.getNode();
            const htmlCollection = chart.getElementsByTagName('map');
            const mapTag         = htmlCollection.item(0);
            const areas          = mapTag.childNodes;
 
            if (elem.action){
                setCursorPointer(areas, true);
            } else if (elem.data){
                elem.data.forEach(function(el,i){
                    if (i == 1 || i == 4 ){
                        el.action = action; 
                    }
                   
                    if (el.action){
                        setCursorPointer(areas, false, el.id);
                    }
                });
            }

        },

        onItemClick:function(idEl, event, html){
            console.log("пример: ", action);

            function findField(chartAction){
      
                let field = chartAction;

                if (chartAction && chartAction.field){
                    field = chartAction.field;
                }

                const fields = STORAGE.fields.content;

                Object.keys(fields).forEach(function(key,i){
                    if ( key == field ){
                        goToRefView(chartAction);
                    }
                });
            } 

    
            if (elem.action){
                findField(elem.action);
                
            } else {
                const collection = elem.data;
    
                let selectElement;
         
                collection.forEach( function (el,i){
                    if (el.id == idEl){
                        selectElement = el;
                    }
                });

                const chartAction = selectElement.action;

                if (chartAction){
                    findField(chartAction);

                } 
          
            }
           
        },


    };

    return elem;
}

function iterateArr(container){
    let res;
    const elements = [];

    function loop(container){
        container.forEach(function(el, i){
         
            const nextContainer = el.rows || el.cols;
     
            if (!el.rows && !el.cols){
                if (el.view && el.view == "chart"){
                    el = setAttributes(el);
                }
                elements.push(el);
            } else {
                loop(nextContainer);
            }
        });
    }

    loop( container );

    if (elements.length){
        res = elements;
    }

    return res;
}

function returnEl(element){
 //   element = obj;
    
    const container = element.rows || element.cols;

    let resultElem;

    function returnElements(arr){
        arr.forEach(function(elem,i){
            if (elem.view && elem.view == "chart"){
                resultElem = elem;
            }
           
        });
    }
    
    container.forEach(function(el,i){
        const nextContainer = el.rows || el.cols;
        const result        = iterateArr(nextContainer);

       // returnElements(result);
    });

 //   console.log(resultElem);
    return resultElem;
}


function createCharts(dataCharts){
 
    clearDashLayout();
    try{
        dataCharts.forEach(function(el,i){

            if (el.cols || el.rows){
                returnEl(el);
            }

            const titleTemplate = el.title;

            delete el.title;

            el = setAttributes(el);

            const headline = {   
                template    : titleTemplate,
                borderless  : true,
                height      : 35,
                css         : {  
                    "font-weight" : "400!important", 
                    "font-size"   : "17px!important"
                }, 
            };
        
            dashLayout[0].rows.push({
                css : "webix_dash-chart-headline",
                rows: [ 
                    headline,
                    el
                ]
            });


        });

   
    } catch (err){  
        setFunctionError(err, logNameFile, "createCharts");
    }
}


function createSpace( inputsArray, idsParam ){

    function backBtnClick (){
        hideElem    ($$( "dashboardTool")); 
        showElem    ($$("dashboardInfoContainer"));
    }

    function createMainView(){

        const headline = {  
            template    : "Фильтр",
            height      : 30, 
            css         : "webix_dash-filter-headline",
            borderless  : true
        };

        
        const filterBackBtn = { 
            view    : "button", 
            id      : "dash-backDashBtn",
            type    : "icon",
            icon    : "icon-arrow-right",
            value   : "Вернуться к дашбордам",
            hidden  : true,  
            height  : 15,
            hotkey  : "esc",
            minWidth: 50,
            width   : 55,
            
            click:function(){
                backBtnClick();
            },
            
            on: {
                onAfterRender: function () {
                    this.getInputNode().setAttribute("title","Вернуться к дашбордам");
                }
            } 
        };
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
                
                { rows:inputsArray }
            ], 
        };

        try{
            $$("dashboardTool").addView( mainView );
        } catch (err){  
            setFunctionError(err, logNameFile, "createMainView");
        }
    }

    createMainView();

  
    function createFilterBtn(){

        function filterBtnClick (){
            const dashTool           = $$("dashboard-tool-main");
            const container          = $$("dashboardContainer" );
            const tree               = $$("tree");
            const backBtn            = $$("dash-backDashBtn");

            function filterMinAdaptive(){

                hideElem (tree);
                hideElem ($$("dashboardInfoContainer"));
                showElem ($$("dashboardTool"));
               // showElem (dashTool);
                showElem (backBtn);
            
                // dashTool.config.width = window.innerWidth-45;
                // dashTool.resize();

                $$("dashboardTool").config.width = window.innerWidth-45;
                $$("dashboardTool").resize();
            }

            function filterMaxAdaptive(){
                if (dashTool.isVisible()){
                    hideElem ($$("dashboardTool"));
                 //   hideElem(dashTool);
                } else {
                    showElem ($$("dashboardTool"));
                    showElem(dashTool);
                }
            }
       
            filterMaxAdaptive();


            if (container.$width < 850){
           
                hideElem(tree);

                if (container.$width  < 850 ){
                    filterMinAdaptive();
                }

            } else {
                hideElem(backBtn);
   
                // if (dashTool.config.width !== 350){
                //     dashTool.config.width  = 350;
                //     dashTool.resize();
                // }

                if ($$("dashboardTool").config.width !== 350){
                    $$("dashboardTool").config.width  = 350;
                    $$("dashboardTool").resize();
                }

                
            }


        }

        const filterBtn = {
            view    : "button", 
            id      : "dashFilterBtn", 
            css     : "webix-transparent-btn",
            type    : "icon",
            icon    : "icon-filter",
            width   : 50,
            click   : function() {
                filterBtnClick();
            },
            on      : {
                onAfterRender: function () {
                    this.getInputNode().setAttribute("title","Показать/скрыть фильтры");
                },
            }
        
            
        };

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

    function createDashInfo(){
        const template  = setHeadlineBlock("dash-template");
        const container = $$("dashboardInfoContainer");

        const dashCharts = {
            id  : "dashboard-charts",
            view: "flexlayout",
            css : "webix_dash-charts-flex",
            rows: dashLayout,
        };

        const content = {
            view        : "scrollview", 
            scroll      : "y",
            id          : "dashBodyScroll",
            borderless  : true, 
            body        : {
                id  : "dashboardBody",
                css : "dashboardBody",
                cols: [
                    dashCharts
                ]
            }
        };

        const inner =  {   
            id  : "dashboardInfoContainerInner",
            rows: [
                template,
                content
            ]
        };

        try{
            container.addView(inner);
        } catch (err){  
            setFunctionError(err,logNameFile,"createDashInfo");
        } 

        setTableName( idsParam );
            
    }
    createDashInfo ();

    createFilterBtn();
}

function updateDash(){

    const inner = $$("dashboardInfoContainerInner");

    const dashCharts = {
        id  : "dashboard-charts",
        view: "flexlayout",
        css : "webix_dash-charts-flex",
        rows: dashLayout,
       
    };
 

    const dashBody = {
        view        : "scrollview", 
        scroll      : "y",
        id          : "dashBodyScroll",
        borderless  : true, 
        body        : {
            id  : "dashboardBody",
            css : "dashboardBody",
            cols: [
                dashCharts
            ]
        }
    };


    try{

       inner.addView(dashBody);
    } catch (err){  
        setFunctionError(err,logNameFile,"updateDash");
    }
}

function getAjax ( url, inputsArray, idsParam, action=false ) {
  
    const getData = webix.ajax().get(url);

    
    getData.then(function(data){
     
        const dataCharts    = data.json().charts;
        removeScroll();
        
        if ( !action ){ //не с помощью кнопки фильтра
            removeItems ();
        }
      
        function addSuccessView (){

            createCharts( dataCharts );

            if (!action){
                createSpace( inputsArray,idsParam );
            } else {
                updateDash();
            }
            
        }

        if (dataCharts == undefined){
            addErrorView  ();
            setLogValue   ("error","Ошибка при загрузке данных");
        } else {
            addSuccessView();
        }

        function setScrollHeight(){
            const log    = $$("logLayout");
            const logBth = $$("webix_log-btn");
            
            function setLogHeight(height){
                log.config.height = height;
                log.resize();
            }

            try{
                if ( logBth.config.icon == "icon-eye" ){
                    setLogHeight(90);
                    setLogHeight(5);
                } else {
                    setLogHeight(5);
                    setLogHeight(90);
                }
            } catch (err){  
                setFunctionError(err,logNameFile,"setScrollHeight");
            }
        }

        setScrollHeight();

        if ( url.includes("?") || url.includes("sdt") && url.includes("edt") ){
            setLogValue("success", "Данные обновлены");
        } 
      
    });
   
    getData.fail(function(err){
        setAjaxError(err, logNameFile,"getAjax");
    });
    
}

async function getFieldsData ( idsParam ){
    
    if (!STORAGE.fields){
        await getData("fields"); 
    }

    function createDashSpace (){
     
        let findAction;
        let singleItemContent;
        let fields = STORAGE.fields.content;
        let inputsArray= [];

        function setAdaptiveWidth(elem){
            const child       = elem.getNode().firstElementChild;
            child.style.width = elem.$width+"px";

            const inp         = elem.getInputNode();
            inp.style.width   = elem.$width-5+"px";
        }
     
        function createFilterElems (inputs,el){
           
            function createDate(type,input){
                const dateTemplate = {
                    view        : "datepicker",
                    format      : "%d.%m.%y",
                    editable    : true,
                    value       : new Date(),
                    placeholder : input.label,
                    height      : 48,
                    on          : {
                        onAfterRender : function () {
                            this.getInputNode().setAttribute("title",input.comment);
   
                           setAdaptiveWidth(this);
                        },
                    }
                };

                if (type == "first"){
                    const dateFirst = dateTemplate;
                    dateFirst.id    = "dashDatepicker_"+"sdt";
                    return dateFirst;
                } else if (type == "last"){
                    const dateLast  = dateTemplate;
                    dateLast.id     = "dashDatepicker_"+"edt";
                    return dateLast;
                }

            }

            function createTime (type){
                let timeTemplate =  {   
                    view        : "datepicker",
                    format      : "%H:%i:%s",
                    placeholder : "Время",
                    height      : 48,
                    editable    : true,
                    value       : "00:00:00",
                    type        : "time",
                    seconds     : true,
                    suggest     : {

                        type    : "timeboard",
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
                        onAfterRender: function () {
                            this.getInputNode().setAttribute("title","Часы, минуты, секунды");
                            setAdaptiveWidth(this);
                        },
                    }
                };


                if (type == "first"){
                    const timeFirst = timeTemplate;
                    timeFirst.id    = "dashDatepicker_"+"sdt"+"-time";
                    return timeFirst;
                } else if (type == "last"){
                    const timeLast = timeTemplate;
                    timeLast.id    = "dashDatepicker_"+"edt"+"-time"; 
                    return timeLast;
                }
            }

            function createBtn (input, i){

                function clickBtn(){
                    const dateArray     = [];
                    const compareDates  = [];

                    let sdtDate         = "";
                    let edtDate         = "";
                    let validateEmpty   = true;

                    function enumerationElements(el){
                   
                        const childs         = $$(el.id).getChildViews();
                        const postformatTime = webix.Date.dateToStr("%H:%i:%s");

                        childs.forEach(function(elem,i){

                            function createTime(type){
                                const value = $$(elem.config.id).getValue();
                          
                                try{
                                    if (value !==null ){

                                        if (type == "sdt"){
                                            sdtDate = sdtDate.concat( " " + postformatTime(value) );
                                        } else if (type == "edt"){
                                            edtDate = edtDate.concat( " " + postformatTime(value) );
                                        }
                                
                                    } else {
                                        validateEmpty = false;
                                    }
                                } catch (err){  
                                    setFunctionError(err,logNameFile,"createTime");
                                }
                            }

                            function createDate(type){
                                try{
                                    if ( $$(elem.config.id).getValue() !== null ){

                                        const value          = $$(elem.config.id).getValue();
                                        const postFormatData = webix.Date.dateToStr("%d.%m.%y");

                                        if (type == "sdt"){
                                            sdtDate = postFormatData(value); 
                                        } else if ( type ==  "edt"){
                                            edtDate = postFormatData(value);
                                        }
                                    
                                    } else {
                                        validateEmpty=false;
                                    }
                                } catch (err){  
                                    setFunctionError(err,logNameFile,"createDate");
                                }
                            }
                            
                            if (elem.config.id.includes("sdt")){

                                if (elem.config.id.includes("time")){
                                    createTime("sdt");
                                } else {
                                    createDate("sdt");
                                }
                            } else if (elem.config.id.includes("edt")){
                            
                                if (elem.config.id.includes("time")){
                                    createTime("edt");
                                } else {
                                    createDate("edt");
                                }
                            
                                
                            }
                        });
                   
                    }

                    function setInputs(){
                        try{
                            inputsArray.forEach(function(el,i){
                                if ( el.id.includes("container") ){
                                    enumerationElements(el);
                                }
                            });
                        } catch (err){  
                            setFunctionError(err,logNameFile,"setInputs");
                        }
                    }

                    function createQuery(){
                        dateArray.push( "sdt" + "=" + sdtDate );
                        dateArray.push( "edt" + "=" + edtDate );
                     
                        compareDates.push( sdtDate ); 
                        compareDates.push( edtDate );
                    }

                    function getDataInputs(){
                        setInputs   ();
                        createQuery ();
                    }

                    function sentQuery (){

                        function removeCharts(){
                            try{
                                const charts = $$("dashboard-charts");
                                const body   = $$("dashboardBody");
                      
                                if (charts){
                                    body.removeView(charts);
                                }
                            } catch (err){  
                                setFunctionError(err,logNameFile,"removeCharts");
                            }
                        }

                        function setStateBtn(){
                            try{
                                const btn = $$("dashBtn"+i);
                                btn.disable();
                                setInterval(function () {
                                    btn.enable();
                                }, 1000);
                            } catch (err){  
                                setFunctionError(err,logNameFile,"setStateBtn");
                            }
                        }

                        if (validateEmpty){

                            const compareFormatData = webix.Date.dateToStr ("%Y/%m/%d %H:%i:%s");
                            const start             = compareFormatData    (compareDates[0]);
                            const end               = compareFormatData    (compareDates[1]);

                            const compareValue      = webix.filters.date.greater(start,end);
                            
                            if ( !(compareValue) || compareDates[0] == compareDates[1] ){

                                const getUrl = findAction.url+"?"+dateArray.join("&");
                                removeCharts();
                                getAjax(getUrl, inputsArray,idsParam, true);
                                setStateBtn();

                            } else {
                                setLogValue("error", "Начало периода больше, чем конец");
                            }
                        } else {
                            setLogValue("error", "Не все поля заполнены");
                        }
                    }
            
                    getDataInputs();
                    sentQuery ();
                }


                

                const btnFilter = {   
                    rows: [
                        { height:10 },
                        {   view        :"button", 
                            css         :"webix_primary", 
                            id          :"dashBtn"+i,
                            inputHeight :48,
                            height      :48, 
                            minWidth    :100,
                            maxWidth    :200,
                            value       :input.label,
                            click       :function () {
                                clickBtn();
                            },
                            on          : {
                                onAfterRender: function () {
                                    this.getInputNode().setAttribute("title",input.comment);
                                    setAdaptiveWidth(this);
                                },
                            },

                        },
                        {}
                    ]
                };

                return  btnFilter;
            }

            function createHead(text){
                return {   
                    template:text,
                    height:30, 
                    borderless:true,
                    css:"webix_template-datepicker"
                };
            }
            
            function createFilter (el){

        
         
                Object.values(inputs).forEach(function(input,i){
                    function createInputs(){

                        const inputs = {   
                            width   : 200,
                            id      : "datepicker-container"+"sdt",
                            rows    : [ 

                                createHead ( "Начиная с:"  ),
                                createDate ( "first",input ),

                                { height:10 },

                                createTime ("first"),


                                { height:20 },


                                createHead ( "Заканчивая:" ),
                                createDate ( "last", input ),

                                { height:10 },

                                createTime ("last"),

                            ]
                        };
                 
                        try{
                            inputsArray.push( inputs );
                        } catch (err){  
                            setFunctionError(err,logNameFile,"createInputs");
                        }
                    }

                    if (input.type == "datetime"&& input.order == 3){ //-------------- order
                        let key = Object.keys(inputs)[i]; // заменены на sdt и edt
                        createInputs();

                    } else if (input.type == "submit"){

                        const actionType    = input.action;
                        findAction          = el.actions[actionType];
                    
                        inputsArray.push(
                            createBtn (input, i)
                        );

                    }


                });
            }

            createFilter (el);

            return inputsArray;
          
        }
 
        function autorefresh (el) {
            if (el.autorefresh){

                const userprefsOther = webix.storage.local.get("userprefsOtherForm");
                const counter        = userprefsOther.autorefCounterOpt;

                const url            = singleItemContent.actions.submit.url;

                try{
                    if ( counter !== undefined ){

                        if ( counter >= 15000 ){
                            setInterval(function(){
                                getAjax(url, inputsArray, idsParam);
                            },  counter );
            
                        } else {
                            setInterval(function(){
                                getAjax(url, inputsArray, idsParam);
                            }, 50000);
                        }
                    }

                } catch (err){  
                    setFunctionError(err,logNameFile,"autorefresh");
                }
            }
        }


        const itemTreeId = getDashId(idsParam);
        const fieldsVals = Object.values(fields);
        
        fieldsVals.forEach(function(el,i){

            const fieldId = Object.keys(fields)[i];

            if (el.type == "dashboard" && fieldId == itemTreeId) {
      
                const url    = el.actions.submit.url;
                const inputs = createFilterElems (el.inputs,el);

                getAjax(url, inputs,idsParam);
                autorefresh (el);  
            }
        });
    }

    if (STORAGE.fields){
        createDashSpace ();
    }

}



function getInfoDashboard ( idsParam ){

    removeScroll();

    if(!($$("dashBodyScroll"))){
        getFieldsData (idsParam);
    }  
    
}

export {
    getInfoDashboard
};
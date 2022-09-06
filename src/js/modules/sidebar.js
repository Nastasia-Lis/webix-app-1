import { tableId, tableIdView,findElementsId,exportBtn, filterId,filterElementsId,editFormId,searchId,editTableBtnId,newAddBtnId,
     searchIdView,findElementsIdView,
} from './setId.js';
import {notify, checkFormSaved,clearItem,defaultStateForm} from "./editTableForm.js";
import {tableNames} from "./login.js";
import {catchErrorTemplate,ajaxErrorTemplate} from "./logBlock.js";

let itemTreeId = "";
let prevCountRows ;
let inpObj={};
let customInputs = [];
let urlFieldAction ;
let checkAction = false;

function submitBtn (idElements, url, verb, rtype){
   
    let valuesArray = [];

    if (verb=="get"){ 

        if(rtype=="refresh"){
            try {
                idElements.forEach((el,i) => {
                    if (el.id.includes("customCombo")){
                        valuesArray.push(el.name+"="+$$(el.id).getText());
                    } else if (el.id.includes("customInputs")) {
                        valuesArray.push(el.name+"="+$$(el.id).getValue());
                    } else if (el.id.includes("customDatepicker")) {
                        valuesArray.push(el.name+"="+$$(el.id).getValue());
                    }    
                });

                webix.ajax(url+"?"+valuesArray.join("&"),{
                    success:function(text, data, XmlHttpRequest){
                        try {
                            $$(tableIdView).clearAll();
                            data = data.json().content;
                            if (data.length !== 0){
                                $$(tableIdView).hideOverlay("Ничего не найдено");
                                $$(tableIdView).parse(data);
                            } else {
                                $$(tableIdView).showOverlay("Ничего не найдено");
                            }
                            prevCountRows = $$(tableIdView).count();
                            $$(findElementsIdView).setValues(prevCountRows.toString());
                        } catch (error){
                            console.log(error);
                            catchErrorTemplate("009-000", error);
            
                        }  
                    },
                    error:function(text, data, XmlHttpRequest){
                        //notify ("error","Ошибка при загрузке данных",true);
                        ajaxErrorTemplate("009-000",XmlHttpRequest.status,XmlHttpRequest.statusText,XmlHttpRequest.responseURL);

                        if($$(newAddBtnId)&&!($$(newAddBtnId).isEnabled())){
                            $$(newAddBtnId).enable();
                        }
                    }
                });
            } catch (error){
                console.log(error);
                catchErrorTemplate("009-000", error);

            }


        } else if (rtype=="download"){
            webix.ajax().response("blob").get(url, function(text, blob, xhr) {
                try {
                    webix.html.download(blob, "table.docx");
                } catch (error){
                    console.log(error);
                    catchErrorTemplate("009-000", error);
                } 
            });
        } 
    } else if (verb=="post"){
        try{
            idElements.forEach((el,i) => {
                if (el.id.includes("customUploader")){
                    $$(el.id).send(function(data){
                        if (data.err_type == "e"){
                            $$(tableIdView).parse($$(el.id).getValue())
                            notify ("error",data.err,true);
                        } else if (data.err_type == "i"){
                            notify ("success",data.err,true);
                            $$(tableIdView).refresh();
                        } else if (data.err_type == "x"){
                            notify ("debug",data.err,true);
                        }
                    
                    });
                }
            });
        } catch (error){
            console.log(error);
            catchErrorTemplate("009-000", error);
        } 
    } 
    
}

function getComboOptions (refTable){
    return new webix.DataCollection({url:{
        $proxy:true,
        load: function(){
            return ( webix.ajax().get("/init/default/api/"+refTable).then(function (data) {
                        try{
                            data = data.json().content;
                            let dataArray=[];
                            let keyArray;
                            data.forEach((el,i) =>{
                                let l = 0;
                                while (l <= Object.values(el).length){
                                    if (typeof Object.values(el)[l] == "string"){
                                        keyArray = Object.keys(el)[l];
                                        break;
                                    } 
                                    l++;
                                }

                                if (el[keyArray] == undefined){

                                    while (l <= Object.values(el).length) {
                                        if (typeof Object.values(el)[1] == "number"){
                                            keyArray = Object.keys(el)[1];
                                            break;
                                        }
                                        l++;
                                    }
                                }
                                dataArray.push({ "id":el.id, "value":el[keyArray]});
                            });
                            return dataArray;
                        } catch (error){
                            console.log(error);
                            catchErrorTemplate("009-000", error);
                        } 
                }).catch(error => {
                    console.log(error);
                    //notify ("error","Не удалось загрузить данные",true);
                    catchErrorTemplate("009-000", error);

                })
            );
            
        }
    }});
}

function getInfoTable (idCurrTable, idSearch, idsParam, idFindElem, single=false) {
  
    itemTreeId = idsParam;
    let titem = $$("tree").getItem(idsParam);

    try {
        $$(idCurrTable).clearAll();

        if (titem == undefined) {
            notify ("error","Данные не найдены");
        } else {
            let inpObj;
            if (idCurrTable == tableIdView){
                ($$("filterBar").removeView( "customInputs" ));
            }
            
            webix.ajax().get("/init/default/api/fields.json").then(function (data) {
                
                data = data.json().content[idsParam];

                let dataFields = data.fields;
                let obj = Object.keys(data.fields);
                let columnsData = [];

    // ---- Таблица - данные cols     
                try {
                    if (single){
                        let singleSearch = idsParam.search("-single");
                        idsParam = idsParam.slice(0,singleSearch); 
                    }
                    obj.forEach(function(data) {
                    
                        if (dataFields[data].type.includes("reference")){
                            let findTableId = dataFields[data].type.slice(10);
                            dataFields[data].editor = "combo";
                            dataFields[data].collection = getComboOptions (findTableId);
                            dataFields[data].template = function(obj, common, val, config){
                            let item = config.collection.getItem(obj[config.id]);
                            return item ? item.value : "";
                            };
                        } else if (dataFields[data].type == "datetime"){
                            dataFields[data].format = webix.i18n.fullDateFormatStr; 
                            dataFields[data].editor = "date";
                        } else {
                            dataFields[data].editor = "text";
                        }
                        dataFields[data].id = data;
                        dataFields[data].fillspace = true;
                        dataFields[data].header= dataFields[data]["label"];
                        if(dataFields[data].id == "id"){
                            dataFields[data].hidden = true;
                        } 

                        columnsData.push(dataFields[data]);
                    });
                    $$(idCurrTable).refreshColumns(columnsData);
                } catch (error){
                    console.log(error);
                    catchErrorTemplate("009-000", error);
                } 

    // ---- Таблица - action detail у fields            

                let idCol;
                let actionKey;
                checkAction = false;

                try{
                    columnsData.forEach(function(field,i){
                        if( field.type == "action" && data.actions[field.id].rtype == "detail"){
                            checkAction = true;
                            idCol = i;
                            actionKey = field.id;
                        } 
                    });
                    
                    if (actionKey !== undefined){
                        urlFieldAction = data.actions[actionKey].url;
                    
                        if (checkAction){
                            let columns = $$(idCurrTable).config.columns;
                            columns.splice(0,0,{ id:"action-first"+idCol, maxWidth:130, header:"Подробнее", template:"<span class='webix_icon wxi-angle-down'></span> "});
                            $$(idCurrTable).refreshColumns();
                        }
                    }
                } catch (error){
                    console.log(error);
                    catchErrorTemplate("009-000", error);
                } 

    

    // -----  Array с кастомными полями
                try{
                    if (data.inputs || idsParam == "trees"){  //-----------------------------------------------------------------
                        
                        if (idsParam == "trees"){

                            customInputs.push(
                            {   view:"text",
                                id: "12314",
                                maxWidth:300,
                                minWidth:150,
                                height:48,
                                labelPosition:"top",
                            });
                            console.log(idsParam)
                        
                        
                        }else {

                        let objInuts = Object.keys(data.inputs);
                        
                        let customInputs = [];
                        let idElements = [];
                    
                        let dataInputsArray = data.inputs;

                    
                        objInuts.forEach((el,i) => {
                            if (dataInputsArray[el].type == "string"){
                                customInputs.push(
                                {   view:"text",
                                    placeholder:dataInputsArray[el].label, 
                                    id: "customInputs"+i,
                                    maxWidth:300,
                                    minWidth:150,
                                    height:48,
                                    labelPosition:"top",
                                    on: {
                                        onAfterRender: function () {
                                            this.getInputNode().setAttribute("title",dataInputsArray[el].comment);
                                        },
                                    }
                                });
                            } else if (dataInputsArray[el].type == "apiselect") {

                                let optionData = new webix.DataCollection({url:{
                                    $proxy:true,
                                    load: function(){
                                        return ( webix.ajax().get("/init/default/api/"+dataInputsArray[el].apiname).then(function (data) {   
                                                
                                                let dataSrc = data.json().content;
                                                    
                                                let dataOptions=[];

                                                try{
                                                    if (dataSrc[0].name !== undefined){
                                                        
                                                        dataSrc.forEach(function(data, i) {
                                                            dataOptions.push( 
                                                                {id:i+1, value:data.name},
                                                            );
                                                        });
                                                    
                                                    } else {
                                                        dataSrc.forEach(function (data, i) {
                                                            dataOptions.push(
                                                                { id: i + 1, value: data },
                                                            );
                                                        });

                                                    }
                                            
                                                    return dataOptions;
                                                } catch (error){
                                                    console.log(error);
                                                    catchErrorTemplate("009-000", error);
                                                } 
                                                }).catch(error => {
                                                    console.log(error);
                                                    catchErrorTemplate("009-000", error);

                                                    //notify ("error","Не удалось загрузить данные",true);
                                                })
                                            );
                                        
                                    
                                        
                                    }
                                }});


                                customInputs.push(
                                    { view:"combo",
                                    width:250,
                                    height:48,
                                    id: "customCombo"+i,
                                    placeholder:dataInputsArray[el].label, 
                                    labelPosition:"top", 
                                    options:{
                                        data:optionData
                                    },
                                    on: {
                                        onAfterRender: function () {
                                            this.getInputNode().setAttribute("title",dataInputsArray[el].comment);
                                        },
                                    }               
                                });

                            } else if (dataInputsArray[el].type == "submit" || dataInputsArray[el].type == "button") {
                                let actionType = dataInputsArray[el].action;
                                let findAction = data.actions[actionType];

                                if (findAction.verb == "DELETE" && actionType !== "submit"){
                                    let countCols = $$(idCurrTable).getColumns().length;
                                    let columns = $$(idCurrTable).config.columns;
                                    columns.splice(countCols,0,{ id:"action"+i, header:"Действие",maxWidth:100, template:"{common.trashIcon()}"});

                                    $$(idCurrTable).refreshColumns();
                                } else if (findAction.verb == "DELETE") {
                                    customInputs.push(

                                            {   view:"button", 
                                                id:"customBtnDel"+i,
                                                css:"webix_danger", 
                                                type:"icon", 
                                                icon:"wxi-trash", 
                                                inputHeight:48,
                                                height:48,
                                                width:100,
                                                value:dataInputsArray[el].label,
                                                click:function (id) {
                                                    submitBtn(idElements,findAction.url,"delete");
                                                },
                                                on: {
                                                    onAfterRender: function () {
                                                        this.getInputNode().setAttribute("title",dataInputsArray[el].comment);
                                                    },
                                                },
                                                
                                                
                                            }, 

                                    );
                                } else {
                                    customInputs.push(

                                            {   view:"button", 
                                                css:"webix_primary", 
                                                id:"customBtn"+i,
                                                inputHeight:48,
                                                height:48, 
                                                minWidth:100,
                                                maxWidth:550,
                                                value:dataInputsArray[el].label,
                                                click:function (id) {

                                                    if (findAction.verb== "GET"){
                                                        if ( findAction.rtype== "refresh") {
                                                            submitBtn(idElements,findAction.url, "get", "refresh");
                                                        } else if (findAction.rtype== "download") {
                                                            submitBtn(idElements,findAction.url, "get", "download");
                                                        }
                                                        
                                                    } else if (findAction.verb == "POST"){
                                                        submitBtn(idElements,findAction.url,"post");
                                                    
                                                    } 
                                                    else if (findAction.verb == "download"){
                                                        submitBtn(idElements,findAction.url, "get", "download",id);
                                                    }
                                                
                                                },
                                                on: {
                                                    onAfterRender: function () {
                                                        this.getInputNode().setAttribute("title",dataInputsArray[el].comment);
                                                    },
                                                },
                                            }, 
                                    );
                                }
                            } else if (dataInputsArray[el].type == "upload"){
                                customInputs.push(
                                        {   view: "uploader", 
                                            value: "Upload file", 
                                            id:"customUploader"+i, 
                                            height:48,
                                            autosend:false,
                                            upload: data.actions.submit.url,
                                            label:dataInputsArray[el].label, 
                                            labelPosition:"top",
                                            on: {
                                                onAfterRender: function () {
                                                    this.getInputNode().setAttribute("title",dataInputsArray[el].comment);
                                                },
                                            }
                                        }
                                );
                            } else if (dataInputsArray[el].type == "datetime"){
                                customInputs.push(
                                        {   view: "datepicker",
                                            format: "%d.%m.%Y %H:%i:%s",
                                            placeholder:dataInputsArray[el].label,  
                                            id:"customDatepicker"+i, 
                                            timepicker: true,
                                            labelPosition:"top",
                                            width:300,
                                            minWidth:100,
                                            height:48,
                                            on: {
                                                onAfterRender: function () {
                                                    this.getInputNode().setAttribute("title",dataInputsArray[el].comment);
                                                },
                                            }
                                        }
                                );
                            }else if (dataInputsArray[el].type == "checkbox"){
                            
                                customInputs.push(
                                        {   view:"checkbox", 
                                            id:"customСheckbox"+i, 
                                            minWidth:220,
                                            css:"webix_checkbox-style",
                                            labelRight:dataInputsArray[el].label, 
                                            on: {
                                                onAfterRender: function () {
                                                    this.getInputNode().setAttribute("title",dataInputsArray[el].comment);
                                                },
                                            }
                                        }
                                );

                            } 
                        customInputs.push({width:10});
                        });
                        
                    

                        customInputs.forEach((el,i) => {
                            if (el.id !== undefined){
                                if (el.view=="text"){
                                    idElements.push({id:el.id, name:"substr"});
                                } 
                                else if (el.view=="combo") {
                                    idElements.push({id:el.id, name:"valtype"});
                                } else if (el.view=="uploader"){
                                    idElements.push({id:el.id});
                                } else if (el.view=="datepicker"){
                                    idElements.push({id:el.id});
                                }
                            }

                        });

                        }
                    

                        
                    
                        inpObj = {id:"customInputs",css:"webix_custom-inp", cols:customInputs};
                        
                        ($$("filterBar").addView( inpObj,2));
                    }
                } catch (error){
                    console.log(error);
                    catchErrorTemplate("009-000", error);
                } 
                
            


    // ----- Таблица - получение данных rows

                if (single){
                    itemTreeId = idsParam;
                }

                function getItemData (table){

                    $$(table).load({
                        $proxy:true,
                        load:function(view, params){
                            return webix.ajax().get("/init/default/api/"+itemTreeId,{
                            success:function(text, data, XmlHttpRequest){
                                try {
                                    $$(idCurrTable).clearAll();
                                    if(!($$(newAddBtnId).isEnabled())){
                                        $$(newAddBtnId).enable();
                                    }
                                    if(!($$(filterId).isEnabled())){
                                        $$(filterId).enable();
                                    }
                                    if(!($$(exportBtn).isEnabled())){
                                        $$(exportBtn).enable();
                                    }
                    
                                    data = data.json().content;
                                
                        
                                    if (data.length !== 0){
                                        
                                        $$(idCurrTable).hideOverlay("Ничего не найдено");
                                    
                                        $$(idCurrTable).parse(data);
                                
                                    
                                    } else {
                                        $$(idCurrTable).showOverlay("Ничего не найдено");
                                        $$(idCurrTable).clearAll();
                                    }
                            
                                    prevCountRows = $$(idCurrTable).count();
                                    $$(idFindElem).setValues(prevCountRows.toString());
                                    if(idCurrTable == tableId){
                                        $$(filterElementsId).setValues(prevCountRows.toString());
                                    }
                                } catch (error){
                                    console.log(error);
                                    catchErrorTemplate("009-000", error);
                                } 
                        
                            },
                            error:function(text, data, XmlHttpRequest){
                               // notify ("error","Ошибка при загрузке данных",true);
                                ajaxErrorTemplate("009-000",XmlHttpRequest.status,XmlHttpRequest.statusText,XmlHttpRequest.responseURL);
                                prevCountRows = "-";
                                try {
                                    $$(idFindElem).setValues(prevCountRows.toString());
                                    $$(filterElementsId).setValues(prevCountRows.toString());
                                    if($$(newAddBtnId).isEnabled()){
                                        $$(newAddBtnId).disable();
                                    }
                                    if($$(filterId)){
                                        $$(filterId).disable();
                                    }

                                    if($$(exportBtn)){
                                        $$(exportBtn).disable();
                                    }
                                } catch (error){
                                    console.log(error);
                                    catchErrorTemplate("009-000", error);

                                }
                            
                        }, 
                    });     }
                });
                }

                if($$(tableId)){
                    getItemData (tableId);
                } else if ($$(tableIdView)){
                    getItemData (tableIdView);
                }
                
                if (data.autorefresh){
                    setInterval(function(){
                        getItemData ();
                    }, 50000);
                }
            }).catch(err => {
                console.log(err);

                notify ("error","Не удалось загрузить данные",true);

                if($$("btnFilterSubmit")&&$$("btnFilterSubmit").isEnabled()){
                    $$("btnFilterSubmit").disable();
                }
                
            
            });
        } 
    } catch (error){
        console.log(error);
        catchErrorTemplate("009-000", error);
    } 
}

function getInfoDashboard (idsParam,single=false){
    
    function getAjax(url,inputsArray, action=false) {
        webix.ajax().get(url, {
            success:function(text, data, XmlHttpRequest){
                let dashLayout=[];
                let dataCharts = data.json().charts;
                let titleTemplate = {};

                try {
                    if (dataCharts == undefined){

                        $$("dashboardTool").addView({
                            view:"scrollview",
                            id:"dashboard-tool",
                            borderless:true,
                            css:{"margin":"20px!important","height":"50px!important"},
                            body: {
                                view:"flexlayout",
                                rows:[]
                            }
                        },0);

                        $$("dashboardTool").addView({
                            rows:[{
                                template:"",
                                id:"dash-temlate",
                                css:"webix_style-template-count webix_dash-title",
                                borderless:false,
                                height:40,
                            }]
                        },1);
        
                        $$("dashboardBody").addView({
                            view:"scrollview", 
                            id:"dashboard-charts",
                            borderless:true,
                            body: {
                                view:"flexlayout",
                                cols:[]
                            }
                        },2);
                        
                        $$("dashboardBody").removeView($$("dashEmpty"));

                        notify ("error","Ошибка при загрузке данных", true);
                    } else {
                    
                        dataCharts.forEach(function(el,i){
                            titleTemplate = el.title;
                            delete el.title;
                            el.borderless = true;
                            el.minWidth = 500;
                            dashLayout.push({rows:[ {template:titleTemplate,borderless:true,css:{"padding-left":"25px!important","margin-top":"20px!important", "font-weight":"400!important", "font-size":"17px!important"}, height:35},el]});
                        });

                        
                        $$("dashboardTool").addView({
                            view:"scrollview",
                            id:"dashboard-tool",
                            borderless:true,
                            css:{"margin":"20px!important","height":"50px!important"},
                            body: {
                                view:"flexlayout",
                                rows:inputsArray
                            }
                        },0);
                
                        let dashTitle;

                        if (itemTreeId.includes("single")){
                            itemTreeId = itemTreeId.slice(0,itemTreeId.search("-single"));  
                            
                        }
                        tableNames.forEach(function(el,i){
                            if (el.id == itemTreeId){
                                dashTitle= el.name;
                            }
                        });

                        $$("dashboardTool").addView({
                            rows:[{
                                template:dashTitle,
                                id:"dash-temlate",
                                css:"webix_style-template-count webix_dash-title",
                                borderless:false,
                                height:40,
                            }]
                        },1);

                        $$("dashboardBody").addView({
                            view:"scrollview", 
                            id:"dashboard-charts",
                            borderless:true,
                            body: {
                                view:"flexlayout",
                                
                                css:"webix_dash-charts-flex",
                                type: "space", 
                                cols:dashLayout
                            }
                        },1);

                        $$("dashboardBody").removeView($$("dashEmpty"));
                    }
                    
                    if (url.includes("?")||url.includes("sdt")&&url.includes("edt")){
                        notify ("success", "Данные обновлены", true);
                    }
                } catch (error){
                    console.log(error);
                    catchErrorTemplate("009-004", error);
                } 
                
            },
            error:function(text, data, XmlHttpRequest){
                //notify ("error","Ошибка при сохранении данных",true);
                ajaxErrorTemplate("009-000",XmlHttpRequest.status,XmlHttpRequest.statusText,XmlHttpRequest.responseURL);

            }
        }); 
    }

    try {
        if ($$("dashboard-charts")){
            $$("dashboardBody").removeView( $$("dashboard-charts"));
        }

        if(!($$("dashboard-charts"))){
            webix.ajax().get("/init/default/api/fields",{
                success:function(text, data, XmlHttpRequest){

                    let inputsArray=[];
                    let actionType ;
                    let findAction;
                    let singleItemContent;
                    data = data.json().content;
                    try {
                        if (single){
                            let singleSearch = idsParam.search("-single");
                            idsParam = idsParam.slice(0,singleSearch); 
                        }
                    
                        
                        Object.values(data).forEach(function(el,i){
                            el.nameObj = Object.keys(data)[i];
                            if (el.nameObj== idsParam){
                                singleItemContent =el;
                            }
                        });

                        if (single){
                            let inputs = singleItemContent.inputs;
                            
                            inputsArray.push({width:20});
                            let keys = Object.keys(inputs);
                            Object.values(inputs).forEach(function(input,i){

                                if (input.type == "datetime"){
                                    inputsArray.push(
                                            {   view: "datepicker",
                                                format:"%d.%m.%Y %H:%i:%s",  
                                                id:"dashDatepicker_"+keys[i], 
                                                timepicker: true,
                                                placeholder:input.label,
                                                width:300,
                                                minWidth:100,
                                                height:48,
                                                on: {
                                                    onAfterRender: function () {
                                                        this.getInputNode().setAttribute("title",input.comment);
                                                    },
                                                }
                                            }
                                    );
                                
                                } else if (input.type == "submit"){
                                    
                                    actionType = input.action;
                                    findAction = singleItemContent.actions[actionType];
                                    inputsArray.push(

                                            {   view:"button", 
                                                css:"webix_primary", 
                                                id:"dashBtn"+i,
                                                inputHeight:48,
                                                height:48, 
                                                minWidth:100,
                                                maxWidth:200,
                                                value:input.label,
                                                click:function () {
                                                    let dateArray = [];
                                                    let postFormatData = webix.Date.dateToStr("%d.%m.%Y %H:%i:%s");
                                                    let getUrl;
                                                    
                                                    inputsArray.forEach(function(el,i){
                                                        
                                                        if (el.id.includes("sdt")){
                                                            
                                                            dateArray.push("sdt"+"="+postFormatData($$(el.id).getValue()));
                                                            
                                                        }else if (el.id.includes("edt")) {
                                                            dateArray.push("edt"+"="+postFormatData($$(el.id).getValue()));
                                                        }
                                                    });
                                                 
                                                    getUrl = findAction.url+"?"+dateArray.join("&");
                                                    if ($$("dashboard-charts")){
                                                        $$("dashboardBody").removeView( $$("dashboard-charts"));
                                                    }
                                                
                                                    getAjax(getUrl, inputsArray);
                                                },
                                                on: {
                                                    onAfterRender: function () {
                                                        this.getInputNode().setAttribute("title",input.comment);
                                                    },
                                                },

                                            }
                                    );
                                }
                                inputsArray.push({width:20});
                            });
                            
                            getAjax(singleItemContent.actions.submit.url, inputsArray);
                            if (singleItemContent.autorefresh){
                                setInterval(function(){
                                    getAjax(singleItemContent.actions.submit.url, inputsArray);
                                }, 50000);
                            }

                        } else {

                            let fields = data;
                            
                            Object.values(fields).forEach(function(el,i){
                            

                                if (el.type == "dashboard" && el.nameObj == itemTreeId) {
                                    let inputs = el.inputs;
                
                                    
                                    inputsArray.push({width:20});
                                    Object.values(inputs).forEach(function(input,i){
                                    
                                        
                                        if (input.type == "datetime"){
                
                                            let key = Object.keys(inputs)[i];
                                            inputsArray.push(
                                                    {   view: "datepicker",
                                                        format:"%d.%m.%Y %H:%i:%s",
                                                        id:"dashDatepicker_"+key,  
                                                       // seconds: true,
                                                        // suggest:{
                                                        //     type:"timeboard",
                                                        //     body:{
                                                        //         button:true
                                                        //     }
                                                        //   },
                                                        //  suggest:{
                                                        //     type:"calendar",
                                                        //   body:{
                                                        //     minDate:new Date() 
                                                        //   }
                                                        // },
                                                        timepicker: true,
                                                        placeholder:input.label,
                                                        width:300,
                                                        minWidth:100,
                                                        height:48,
                                                        on: {
                                                            onAfterRender: function () {
                                                                this.getInputNode().setAttribute("title",input.comment);
                                                            },
                                                            onItemClick: function(id, e){
                                                                console.log(id, e)
                                                            }
                                                        }
                                                    }
                                            );
                                        
                                        } else if (input.type == "submit"){
                                        
                                            actionType = input.action;
                                            findAction = el.actions[actionType];
                                        
                                            inputsArray.push(

                                                    {   view:"button", 
                                                        css:"webix_primary", 
                                                        id:"dashBtn"+i,
                                                        inputHeight:48,
                                                        height:48, 
                                                        minWidth:100,
                                                        maxWidth:200,
                                                        value:input.label,
                                                        click:function () {
                                                            let dateArray = [];
                                                            let postFormatData = webix.Date.dateToStr("%d.%m.%Y %H:%i:%s");
                                                            let getUrl;
                                                            let compareDates=[];
                                                            inputsArray.forEach(function(el,i){
                                                                
                                                                if (el.id.includes("sdt")&&$$(el.id).getValue()){
                                                                    dateArray.push("sdt"+"="+postFormatData($$(el.id).getValue()));
                                                                    compareDates.push(postFormatData($$(el.id).getValue()));
                                                                }else if (el.id.includes("edt")&&$$(el.id).getValue()) {
                                                                    dateArray.push("edt"+"="+postFormatData($$(el.id).getValue()));
                                                                    compareDates.push(postFormatData($$(el.id).getValue()));
                                                                }
                                                            });
                                                      
                                                            if (dateArray.length > 0 && compareDates[0] && compareDates[1]){
                                                                if (compareDates[0]<compareDates[1]){
                                                                    getUrl = findAction.url+"?"+dateArray.join("&");
                                                                
                                                                    if ($$("dashboard-charts")){
                                                                        $$("dashboardBody").removeView( $$("dashboard-charts"));
                                                                    }
                                                                
                                                                    getAjax(getUrl, inputsArray, true);
                                                                } else {
                                                                    notify ("error", "Начало периода больше, чем конец", true); 
                                                                }
                                                            } else {
                                                                notify ("error", "Не все поля заполнены", true);
                                                            }
                                                          
                                                            
                                                        },
                                                        on: {
                                                            onAfterRender: function () {
                                                                this.getInputNode().setAttribute("title",input.comment);
                                                            },
                                                        },

                                                    }, 
                                            );
                                        }
                                        inputsArray.push({width:20});
                                    

                                    });
                                    getAjax(el.actions.submit.url, inputsArray);
                                    if (el.autorefresh){
                                        setInterval(function(){
                                            getAjax(singleItemContent.actions.submit.url, inputsArray);
                                        }, 50000);
                                    }
                                }
                                
                                
                            });

                        }
                    } catch (error){
                        console.log(error);
                        catchErrorTemplate("009-000", error);
                
                    }

                },
                
                error:function(text, data, XmlHttpRequest){
                   // notify ("error","Ошибка при загрузке данных", true);
                    console.log(XmlHttpRequest)
                    ajaxErrorTemplate("009-000",XmlHttpRequest.status,XmlHttpRequest.statusText,XmlHttpRequest.responseURL);
                }
            });     
        }  
    } catch (error){
        console.log(error);
        catchErrorTemplate("009-000", error);

    }
}


function headerSidebar () {
    const headerLogo = {
         view:"label",
         label:"<img src='/init/static/images/expalogo.png' style='height:30px; margin: 10px;'>", 
         height:30
    };
    const collapseBtn = {   
        view:"button",
        type:"icon",
        id:"collapseBtn",
        icon:"wxi-angle-double-left",
        css:"webix_collapse",
        title:"текст",
        height:45,
        width:40,
        click:function() {
            try {
                if ($$("tree").isVisible()){
                    $$("collapseBtn").config.icon ="wxi-angle-double-right";
                    $$("collapseBtn").refresh();
                    $$("tree").hide();
                    if($$("sideMenuResizer")){
                        $$("sideMenuResizer").hide();
                    } 

                } else {
                    $$("tree").show();
                    $$("collapseBtn").config.icon ="wxi-angle-double-left";
                    $$("collapseBtn").refresh();
                    if(window.innerWidth >= 800){
                        if($$("sideMenuResizer")){
                            $$("sideMenuResizer").show();
                        }
                    } 
                
                    
                }
            } catch (error){
                console.log(error);
                catchErrorTemplate("009-000", error);
        
            }
            
        },
        on: {
            onAfterRender: function () {
                this.getInputNode().setAttribute("title","Видимость бокового меню");
            }
    } 
    };

    return {cols:[collapseBtn,headerLogo]}
}

function treeSidebar () {
    let tree = {
        view:"edittree",
        id:"tree",
        minWidth:100,
        width: 250,
        editable:false,
        select:true,
        editor:"text",
        editValue:"value",
        activeTitle:true,
        clipboard: true,
        data:[],
        on:{
            onSelectChange:function (ids) {

                
                    itemTreeId = ids[0];
                    let treeItemId = $$("tree").getSelectedItem().id;
                    let getItemParent = $$("tree").getParentId(treeItemId);

                    let treeArray = $$("tree").data.order;
                    let parentsArray = [];

                    let singleItemContent="";
                    try {
                        if($$("inputsTable")){
                            $$(editFormId).removeView($$("inputsTable"));
                        }

                        treeArray.forEach(function(el,i){
                            if ($$("tree").getParentId(el) == 0){
                                parentsArray.push(el);
                            }
                        });

                        if (treeItemId.includes("single")){
                            singleItemContent = $$("tree").getSelectedItem().typeof;
                        }

                        if (ids[0]&&getItemParent!==0 || singleItemContent ){
                            $$("webix__none-content").hide();
                        }
                    } catch (error){
                        console.log(error);
                        catchErrorTemplate("009-000", error);

                    }
                
                    function visibleTreeItem(singleType, idsUndefined){
                        try{
                            if($$("webix__null-content")){
                                $$("container").removeView($$("webix__null-content"));
                            }

                            if($$("user_auth")){
                                if ($$("user_auth").isVisible()){
                                    $$("user_auth").hide();
                                }
                            }

                            if($$("userprefs")){
                                if ($$("userprefs").isVisible()){
                                    $$("userprefs").hide();
                                }
                            }
                            
                            if(idsUndefined !== undefined){
                                return parentsArray.forEach(function(el,i){
                                    if (el.includes("single")){
                                        if(singleType){
                                            $$(singleType).hide();
                                        }
                                    } else {

                                        if($$("webix__none-content").isVisible()){
                                            $$("webix__none-content").hide();
                                        } 
                                        
                                        if(!($$("webix__null-content"))){
                                            $$("container").addView(
                                                {id:"webix__null-content", template:"Блок в процессе разработки",margin:10},
                                            2);
                                        } 
                                    
                                        if (el=="tables" || el=="dashboards" || el=="forms" || el=="user_auth"){
                                            $$(el).hide();
                                    
                                        }
                                    }     
                                });  
                                
                            } else {
                            
                                return parentsArray.forEach(function(el,i){
                                    if (el.includes("single")){
                                        if (singleType){
                                            $$(singleType).show();
                                        } 
                                    } else {
                                        if (el == getItemParent){
                                            $$(el).show();
                                        } else if (el=="tables" || el=="dashboards" || el=="forms" || el=="user_auth"){
                                            $$(el).hide();
                                        }
                                
                                    }
                                        
                                    
                                });  
                            }
                        } catch (error){
                            console.log(error);
                            catchErrorTemplate("009-000", error);
    
                        }
                    
                    }
                try {
                    if (getItemParent=="tables" || singleItemContent == "dbtable"){
                        visibleTreeItem("tables"); 
                    }else if(getItemParent=="dashboards" || singleItemContent == "dashboard"){
                        visibleTreeItem("dashboards"); 
                    } else if(getItemParent=="forms" || singleItemContent == "tform"){
                        if ($$("propTableView") && $$("propTableView").isVisible()){
                            $$("propTableView").hide();
                        }
                        visibleTreeItem("forms"); 
                    } else if (getItemParent=="user_auth"){
                        visibleTreeItem(); 
                    } else if (getItemParent == 0 && treeItemId!=="tables"&& treeItemId!=="user_auth"&& treeItemId!=="dashboards" && treeItemId!=="forms" && !singleItemContent){
                        visibleTreeItem(false, ids[0]); 
                    }

              

// --- контент tree items
             

                    if(getItemParent=="tables" || singleItemContent == "dbtable"){
                    
                        defaultStateForm();
                        
                        if(Object.keys($$(editFormId).elements).length!==0){
                            $$("inputsTable").hide();
                        }
                        if (singleItemContent == "dbtable"){
                            getInfoTable (tableId, searchId, ids[0], findElementsId, true);
                        }else {
                            getInfoTable (tableId, searchId, ids[0], findElementsId);
                        }
                        

                    } else if(getItemParent=="dashboards") {
                    getInfoDashboard ();

                    } else if(singleItemContent == "dashboard") {
                        getInfoDashboard (ids[0],true);
                    }else if(getItemParent=="forms") {
                        getInfoTable (tableIdView, searchIdView, ids[0], findElementsIdView);
                    }else if(singleItemContent == "tform") {
                        getInfoTable (tableIdView, searchIdView, ids[0], findElementsIdView, true);
                    } else {
                
                    }
                } catch (error){
                    console.log(error);
                    catchErrorTemplate("009-000", error);
            
                }
                
            },

            onBeforeSelect: function(data) {
               
                
                let getItemParent = $$("tree").getParentId(data);
                if(getItemParent=="tables"){
                    if($$(editFormId).isDirty()){
                        checkFormSaved().then(function(result){
                            if(result) {
                                clearItem();
                                $$("tree").select(data);
                            } 
                        });
                        return false;
                    }

                    if ($$("filterTableForm")&&$$("filterTableForm").isVisible){
                        $$("filterTableForm").hide();
                        if($$("inputsTable")){
                            $$("filterTableForm").removeView( $$("inputsTable"));
                        }
                        let btnClass = document.querySelector(".webix_btn-filter");
                        if (btnClass&&!(btnClass.classList.contains("webix_secondary"))){
                            btnClass.classList.add("webix_secondary");
                            btnClass.classList.remove("webix_primary");
                        }
                        $$(editTableBtnId).hide();
                        $$(editFormId).show();
                    }
                }
            },

            onBeforeRender:function() {
                if(window.innerWidth <= 550){
                    $$("sideMenuResizer").hide();
                } else {
                    $$("sideMenuResizer").show();
                }
               
            },

        },

    };

    return tree;
}

export{
    headerSidebar,
    treeSidebar,
    getComboOptions,
    itemTreeId,
    inpObj,
    customInputs,
    urlFieldAction
};
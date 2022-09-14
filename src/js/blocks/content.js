import {setLogValue} from './logBlock.js';
import {catchErrorTemplate,ajaxErrorTemplate} from "./logBlock.js";
import {tableNames} from "./router.js";

let prevCountRows ;
let checkAction = false;
//let urlFieldAction;

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
                            $$("table-view").clearAll();
                            data = data.json().content;
                            if (data.length !== 0){
                                $$("table-view").hideOverlay("Ничего не найдено");
                                $$("table-view").parse(data);
                            } else {
                                $$("table-view").showOverlay("Ничего не найдено");
                            }
                            prevCountRows = $$("table-view").count();
                            $$("table-view-findElements").setValues(prevCountRows.toString());
                        } catch (error){
                            console.log(error);
                            catchErrorTemplate("009-000", error);
            
                        }  
                    },
                    error:function(text, data, XmlHttpRequest){
                        ajaxErrorTemplate("009-000",XmlHttpRequest.status,XmlHttpRequest.statusText,XmlHttpRequest.responseURL);

                        if($$("table-newAddBtnId")&&!($$("table-newAddBtnId").isEnabled())){
                            $$("table-newAddBtnId").enable();
                        }
                    }
                }).catch(error => {
                    console.log(error);
                    ajaxErrorTemplate("009-000",error.status,error.statusText,error.responseURL);
                });
                
                
                //;
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
            }).catch(error => {
                console.log(error);
                ajaxErrorTemplate("009-000",error.status,error.statusText,error.responseURL);
            });
        } 
    } else if (verb=="post"){
        try{
            idElements.forEach((el,i) => {
                if (el.id.includes("customUploader")){
                    $$(el.id).send(function(data){
                        if (data.err_type == "e"){
                            $$("table-view").parse($$(el.id).getValue())
                            setLogValue("error",data.err);
                        } else if (data.err_type == "i"){
                            setLogValue("success",data.err);
                            $$("table-view").refresh();
                        } else if (data.err_type == "x"){
                            setLogValue("debug",data.err);
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
                        ajaxErrorTemplate("009-000",error.status,error.statusText,error.responseURL);
                    })
            );
            
        }
    }});
}

function getInfoTable (idCurrTable, idSearch, idsParam, idFindElem, single=false) {
  
    let itemTreeId = idsParam;
    let titem = $$("tree").getItem(idsParam);
    let filterBar = $$("table-view-filterIdView").getParentView();
    try {
        $$(idCurrTable).clearAll();

        if (titem == undefined) {
            setLogValue("error","Данные не найдены");
        } else {
            let inpObj;
            if (idCurrTable == "table-view"){

                if ($$( "customInputs" )){
                    filterBar.removeView($$( "customInputs" ))
                }
            
            }
            
            webix.ajax().get("/init/default/api/fields.json").then(function (data) {
                
             
                let data1 = data.json().content;
                data1.treeTemplate={
                    
                    "fields": {
                        "id": {
                            "type": "id",
                            "unique": false,
                            "notnull": false,
                            "length": 512,
                            "label": "Id",
                            "comment": null,
                            "default": "None"
                        },
                        "pid": {
                            "type": "reference trees",
                            "unique": false,
                            "notnull": false,
                            "length": 512,
                            "label": "Родитель",
                            "comment": null,
                            "default": "None"
                        },
                        "owner": {
                            "type": "reference auth_user",
                            "unique": false,
                            "notnull": false,
                            "length": 512,
                            "label": "Владелец",
                            "comment": null,
                            "default": "None"
                        },
                        "ttype": {
                            "type": "integer",
                            "unique": false,
                            "notnull": false,
                            "length": 512,
                            "label": "Тип",
                            "comment": "Тип записи|1=системная;2=пользовательская|Перечисление",
                            "default": "1"
                        },
                        "name": {
                            "type": "string",
                            "unique": false,
                            "notnull": false,
                            "length": 100,
                            "label": "Наименование",
                            "comment": null,
                            "default": ""
                        },
                        "descr": {
                            "type": "string",
                            "unique": false,
                            "notnull": false,
                            "length": 1000,
                            "label": "Описание",
                            "comment": null,
                            "default": ""
                        },
                        "value": {
                            "type": "string",
                            "unique": false,
                            "notnull": false,
                            "length": 1000,
                            "label": "Значение",
                            "comment": null,
                            "default": ""
                        },
                        "cdt": {
                            "type": "datetime",
                            "unique": false,
                            "notnull": false,
                            "length": 512,
                            "label": "Создано",
                            "comment": null,
                            "default": "now"
                        }
                    },
                    "singular": "Классификатор-пример",
                    "ref_name": "name",
                    "plural": "Классификаторы-пример",
                    "type": "treeConf"
                    
                };
                data = data1[idsParam];
                //data = data.json().content[idsParam];

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
                        } else if (dataFields[data].type == "string" || dataFields[data].type == "text" ){
                            dataFields[data].editor = "text";
                        } else if (dataFields[data].type == "integer"){
                            dataFields[data].editor = "text";
                            dataFields[data].numberFormat="1 111";
                        } else if (dataFields[data].type == "boolean"){
                            dataFields[data].editor = "combo";
                            dataFields[data].collection = [
                                {id:1, value: "Да"},
                                {id:2, value: "Нет"}
                            ];
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
                        //urlFieldAction = data.actions[actionKey].url;
                    
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
                    if (data.inputs ){  //-----------------------------------------------------------------
                       
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
                                                    ajaxErrorTemplate("009-000",error.status,error.statusText,error.responseURL);

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
                        
                        if (window.innerWidth > 830){
                            inpObj = {id:"customInputs",css:"webix_custom-inp", cols:customInputs};
                            let filterBar = $$("table-view-filterIdView").getParentView();
                            $$(filterBar.config.id).addView( inpObj,2);

                        } else {
                            inpObj = {id:"customInputs",css:"webix_custom-inp", rows:customInputs};
                            $$(filterBar.config.id).addView( {
                                view:"button", 
                                id:"contextActionsBtn",
                                maxWidth:100, 
                                value:"Действия", 
                                css:"webix_primary", 
                                click:function(){
                                    webix.ui({
                                        view:"popup",
                                        css:"webix_popup-filter-container",
                                        modal:true,
                               
                                        id:"contextActionsPopup",
                                        escHide:true,
                                        position:"center",
                                        height:400,
                                        width:400,
                                        body:{
                                            view:"scrollview",
                                            borderless:true,
                                            scroll:"y", 
                                            body:{ 
                                                id:"contextActionsPopupContainer",
                                                rows:[ 
                                                    {cols:[
                                                        {template:"Доступные действия", css:"webix_template-recover", borderless:true, height:40 },
                                                        {width:150},
                                                        {
                                                            view:"button",
                                                            id:"buttonClosePopup",
                                                            css:"webix_close-btn",
                                                            type:"icon",
                                                            hotkey: "esc",
                                                            width:25,
                                                            icon: 'wxi-close',
                                                            click:function(){
                                                                if ($$("contextActionsPopup")){
                                                                    $$("contextActionsPopup").destructor();
                                                                }
                                                            
                                                            }
                                                        },
                                                    ]}
                                                ]
                                            }
                                  
                                           
                                        }
                                    }).show();
                                    console.log(inpObj)
                                    $$("contextActionsPopupContainer").addView(inpObj,2);
                                }
                            },2);


                        }

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
                                        if(!($$("table-newAddBtnId").isEnabled())){
                                            $$("table-newAddBtnId").enable();
                                        }
                                        if(!($$("table-filterId").isEnabled())){
                                            $$("table-filterId").enable();
                                        }
                                        if(!($$("table-exportBtn").isEnabled())){
                                            $$("table-exportBtn").enable();
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
                                        if(idCurrTable == "table"){
                                            $$("table-findElements").setValues(prevCountRows.toString());
                                        }
                                    } catch (error){
                                        console.log(error);
                                        catchErrorTemplate("009-000", error);
                                    } 
                            
                                },
                                error:function(text, data, XmlHttpRequest){
                                    ajaxErrorTemplate("009-000",XmlHttpRequest.status,XmlHttpRequest.statusText,XmlHttpRequest.responseURL);
                                    prevCountRows = "-";
                                    try {
                                        $$(idFindElem).setValues(prevCountRows.toString());
                                        $$("table-findElements").setValues(prevCountRows.toString());
                                        if($$("table-newAddBtnId").isEnabled()){
                                            $$("table-newAddBtnId").disable();
                                        }
                                        if($$("table-filterId")){
                                            $$("table-filterId").disable();
                                        }

                                        if($$("table-exportBtn")){
                                            $$("table-exportBtn").disable();
                                        }
                                    } catch (error){
                                        console.log(error);
                                        catchErrorTemplate("009-000", error);

                                    }
                                
                                }, 
                    
                        }).catch(error => {
                            console.log(error);
                            ajaxErrorTemplate("009-000",error.status,error.statusText,error.responseURL);
                        });
                        }
                });
                }

                if($$("table")){
                    getItemData ("table");
                } else if ($$("table-view")){
                    getItemData ("table-view");
                }
                
                if (data.autorefresh){
                    setInterval(function(){
                        getItemData ();
                    }, 50000);
                }
              
            
            }).catch(error => {
                console.log(error);
                ajaxErrorTemplate("009-000",error.status,error.statusText,error.responseURL);
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
    let itemTreeId = $$("tree").getSelectedItem().id;
    function getAjax(url,inputsArray, action=false) {
   
        webix.ajax().get(url, {
            success:function(text, data, XmlHttpRequest){
                let dashLayout=[{type:"wide",rows:[]}];
                let dataCharts = data.json().charts;
                let titleTemplate = {};

                try {
                    
                    if($$("dashboard-tool")){
                        $$("dashboardTool").removeView($$("dashboard-tool"))
                    }
                    if($$("dash-template")){
                        let parent = $$("dash-template").getParentView()
                        parent.removeView($$("dash-template"))
                    }

                    if($$("dashBodyScroll")){
                        let parent = $$("dashBodyScroll").getParentView()
                        parent.removeView($$("dashBodyScroll"))
                    }


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
                                id:"dash-template",
                                css:"webix_style-template-count webix_dash-title",
                                borderless:false,
                                height:40,
                            }]
                        },1);
        
                        $$("dashboardInfoContainer").addView(
                            {
                                view:"scrollview", 
                                scroll:"auto",
                                id:"dashBodyScroll",
                                borderless:true, 
                                body:{
                                    id:"dashboardBody",
                                    css:"dashboardBody",
                                    //view:"flexlayout",
                                    cols:[
                                        {
                                            id:"dashboard-charts",
                                            borderless:true,
                                            body: {
                                                view:"flexlayout",
                                                rows:[]
                                            }
                                        }
                                    ]
                                }
                            }
                        );

                        setLogValue("error","Ошибка при загрузке данных");
                    } else {

                  
                        dataCharts.forEach(function(el,i){
                            titleTemplate = el.title;
                            delete el.title;
                            el.borderless = true;
                            el.minWidth = 250;
                      
                            dashLayout[0].rows.push({
                                css:"webix_dash-chart-headline",rows:[ 
                                    {   template:titleTemplate,
                                        borderless:true,
                                        css:{  
                                                "font-weight":"400!important", 
                                                "font-size":"17px!important"
                                            }, 
                                        height:35
                                    },
                                    el
                                ]
                            });
                        
                        });


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
                            id:"dashboard-tool",
                            padding:20,
                            minWidth:250,
                            rows:[
                                {rows:[
                                    {  template:"Фильтр",height:30, 
                                        css:"webix_dash-filter-headline",
                                        borderless:true
                                    },
                                ]},
                                
                                { rows:inputsArray}
                            ], 
                        });

                 
                        $$("dashboardInfoContainer").addView(
                            {rows:[

                                { 
                                    template:dashTitle,
                                    id:"dash-template",
                                    css:"webix_style-template-count webix_dash-title",
                                    borderless:false,
                                    height:75,
                
                                },
                                {
                                    view:"scrollview", 
                                    scroll:"auto",
                                    id:"dashBodyScroll",
                                    borderless:true, 
                                    body:{
                                        id:"dashboardBody",
                                        css:"dashboardBody",
                                        //view:"flexlayout",
                                        cols:[
                                            {
                                                id:"dashboard-charts",
                                                view:"flexlayout",
                                                css:"webix_dash-charts-flex",
                                                rows:dashLayout,
                                            }
                                        ]
                                    }
                                }
                            ]}
                        );
                       
                    }

                    // sroll height
                    if ($$("webix_log-btn").config.icon =="wxi-eye"){
                        $$("logLayout").config.height = 90;
                        $$("logLayout").resize();
                        $$("logLayout").config.height = 5;
                        $$("logLayout").resize();
                    } else {
                        $$("logLayout").config.height = 5;
                        $$("logLayout").resize();
                        $$("logLayout").config.height = 90;
                        $$("logLayout").resize();
                    }

                    if (url.includes("?")||url.includes("sdt")&&url.includes("edt")){
                        setLogValue("success", "Данные обновлены");
                    } else {

                    }

                } catch (error){
                    console.log(error);
                    catchErrorTemplate("009-004", error);
                } 
                
            },
            error:function(text, data, XmlHttpRequest){
                ajaxErrorTemplate("009-000",XmlHttpRequest.status,XmlHttpRequest.statusText,XmlHttpRequest.responseURL);

            }
        }).catch(error => {
            console.log(error);
            ajaxErrorTemplate("009-000",error.status,error.statusText,error.responseURL);
        }); 

    }

    try {
        // if ($$("dashboard-charts")){
        //     $$("dashboardBody").removeView( $$("dashboard-charts"));
        // }

        if($$("dashBodyScroll")){
            let parent = $$("dashBodyScroll").getParentView()
            parent.removeView($$("dashBodyScroll"))
        }

        if(!($$("dashBodyScroll"))){
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
                            
                            let keys = Object.keys(inputs);
                            Object.values(inputs).forEach(function(input,i){

                                if (input.type == "datetime"&& input.order == 3){ //------------------ order
                                      
                                    let key = Object.keys(inputs)[i]; // заменены на sdt и edt

                           
                                    inputsArray.push(

                                        {width:200,id:"datepicker-container"+"sdt",rows:[ 
                                            {template:"Начиная с:",height:30, borderless:true,css:"webix_template-datepicker"},
                                            {   view: "datepicker",
                                                format:"%d.%m.%Y",
                                                value :new Date(),
                                                id:"dashDatepicker_"+"sdt",  
                                                placeholder:input.label,
                                                height:48,
                                                on: {
                                                    onAfterRender: function () {
                                                        this.getInputNode().setAttribute("title",input.comment);
                                                    },
             
                                                }
                                            },
                                          {height:10},
                                            {   view: "datepicker",
                                                format:"%H:%i:%s",
                                                id:"dashDatepicker_"+"sdt"+"-time",  
                                                placeholder:"Время",
                                                height:48,
                                                value :"00:00:00",
                                                type:"time",
                                                seconds: true,
                                                  suggest:{
                                                    type:"timeboard",
                                                    body:{
                                                        button:true,
                                                        seconds: true,
                                                        value :"00:00:00",
                                                        twelve :false,
                                                        height :110,
                                                    }
                                                  },
                                                on: {
                                                    onAfterRender: function () {
                                                        this.getInputNode().setAttribute("title","Часы, минуты, секунды");
                                                        
                                                    },
            
                                                }
                                            },
                                            {height:20},

                                            {template:"Заканчивая:",height:30, borderless:true, css:"webix_template-datepicker"},
                                            {   view: "datepicker",
                                                format:"%d.%m.%Y",
                                                value :new Date(),
                                                id:"dashDatepicker_"+"edt",  
                                                placeholder:input.label,
                                              //  width:125,
                                                height:48,
                                                on: {
                                                    onAfterRender: function () {
                                                        this.getInputNode().setAttribute("title",input.comment);
                                                    },
             
                                                }
                                            },
                                            {height:10},
                                            {   view: "datepicker",
                                                format:"%H:%i:%s",
                                                id:"dashDatepicker_"+"edt"+"-time",  
                                                placeholder:"Время",
                                               // width:110,
                                               ////minWidth:100,
                                                height:48,
                                                value :"00:00:00",
                                                type:"time",
                                                seconds: true,
                                                  suggest:{
                                                    type:"timeboard",
                                                    hotkey: "enter",
                                                    body:{
                                                        button:true,
                                                        seconds: true,
                                                        value :"00:00:00",
                                                        twelve :false,
                                                        height :110
                                                    }
                                                  },
                                                on: {
                                                    onAfterRender: function () {
                                                        this.getInputNode().setAttribute("title","Часы, минуты, секунды");
                                                        
                                                    },
            
                                                }
                                            },

                                        ]}
                                    );
                                
                                } else if (input.type == "submit"){
                                
                                    actionType = input.action;
                                    findAction = singleItemContent.actions[actionType];
                                
                                    inputsArray.push(

                                        {   rows: [
                                                {height:10},
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
                                                        let postFormatData = webix.Date.dateToStr("%d.%m.%Y");
                                                        let getUrl;
                                                        let compareDates=[];
                                                        let postformatTime = webix.Date.dateToStr("%H:%i:%s");
                                                    
                                                        let sdtDate = "";
                                                        let edtDate = "";

                                                        inputsArray.forEach(function(el,i){
                                                            
                                                            if (el.id.includes("container")){
                                                                
                                                                $$(el.id).getChildViews().forEach(function(elem,i){
                                                                    if (elem.config.id.includes("sdt")){

                                                                        if (elem.config.id.includes("time")){
                                                                        sdtDate=sdtDate.concat(" "+postformatTime($$(elem.config.id).getValue()))
                                                                        } else {
                                                                            sdtDate = postFormatData($$(elem.config.id).getValue()); 
                                                                        
                                                                        }
                                                                    } else if (elem.config.id.includes("edt")){
                                                                    
                                                                        if (elem.config.id.includes("time")){
                                                                        edtDate=edtDate.concat(" "+postformatTime($$(elem.config.id).getValue()))
                                                                        
                                                                        } else {
                                                                            edtDate = postFormatData($$(elem.config.id).getValue());
                                                                            
                                                                        }
                                                                    
                                                                        
                                                                    }
                                                                });
                                                            }

                                                        });

                                                        dateArray.push("sdt"+"="+sdtDate);
                                                        dateArray.push("edt"+"="+edtDate);

                                                        compareDates.push(sdtDate); 
                                                        compareDates.push(edtDate);
                                                
                                                        if (dateArray.length > 0 && compareDates[0] && compareDates[1]){

                                                            let compareFormatData = webix.Date.dateToStr("%Y/%m/%d %H:%i:%s");

                                                            if (!(webix.filters.date.greater(compareFormatData(compareDates[0]),compareFormatData(compareDates[1])))||compareDates[0]==compareDates[1]){
                                                                getUrl = findAction.url+"?"+dateArray.join("&");
                                                            
                                                                if ($$("dashboard-charts")){
                                                                    $$("dashboardBody").removeView( $$("dashboard-charts"));
                                                                }
                                                                
                                                                if (!($$("dashboard-charts"))){
                                                                    getAjax(getUrl, inputsArray, true);
                                                                }

                                                                
                                                                $$("dashBtn"+i).disable();
                                                                setInterval(function () {$$("dashBtn"+i).enable();}, 10000);
                                                         
                                                            } else {
                                                                setLogValue("error", "Начало периода больше, чем конец"); 
                                                            }
                                                        } else {
                                                            setLogValue("error", "Не все поля заполнены");
                                                        }
                                                    },
                                                    on: {
                                                        onAfterRender: function () {
                                                            this.getInputNode().setAttribute("title",input.comment);
                                                        },
                                                    },

                                                },
                                                {}
                                            ]
                                        }
                                    );
                                  
                                }

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

                                    Object.values(inputs).forEach(function(input,i){
                                    
                                        if (input.type == "datetime"&& input.order == 3){ //------------------ order
                                      
                                            let key = Object.keys(inputs)[i]; // заменены на sdt и edt

                                   
                                            inputsArray.push(

                                                {width:200,id:"datepicker-container"+"sdt",rows:[ 
                                                    {template:"Начиная с:",height:30, borderless:true,css:"webix_template-datepicker"},
                                                    {   view: "datepicker",
                                                        format:"%d.%m.%Y",
                                                        value :new Date(),
                                                        id:"dashDatepicker_"+"sdt",  
                                                        placeholder:input.label,
                                                        height:48,
                                                        on: {
                                                            onAfterRender: function () {
                                                                this.getInputNode().setAttribute("title",input.comment);
                                                            },
                     
                                                        }
                                                    },
                                                  {height:10},
                                                    {   view: "datepicker",
                                                        format:"%H:%i:%s",
                                                        id:"dashDatepicker_"+"sdt"+"-time",  
                                                        placeholder:"Время",
                                                        height:48,
                                                        value :"00:00:00",
                                                        type:"time",
                                                        hotkey: "enter",
                                                        seconds: true,
                                                        suggest:{
                                                            type:"timeboard",
                                                            hotkey: "enter",
                                                            body:{
                                                                button:true,
                                                                seconds: true,
                                                                value :"00:00:00",
                                                                twelve :false,
                                                                height :110,
                                                                
                                                            },
                                                          },
                                                        on: {
                                                            onAfterRender: function () {
                                                                this.getInputNode().setAttribute("title","Часы, минуты, секунды");
                                                                
                                                            },
                                                        }
                                                    },
                                                    {height:20},

                                                    {template:"Заканчивая:",height:30, borderless:true, css:"webix_template-datepicker"},
                                                    {   view: "datepicker",
                                                        format:"%d.%m.%Y",
                                                        value :new Date(),
                                                        id:"dashDatepicker_"+"edt",  
                                                        placeholder:input.label,
                                                        height:48,
                                                        on: {
                                                            onAfterRender: function () {
                                                                this.getInputNode().setAttribute("title",input.comment);
                                                            },
                     
                                                        }
                                                    },
                                                    {height:10},
                                                    {   view: "datepicker",
                                                        format:"%H:%i:%s",
                                                        id:"dashDatepicker_"+"edt"+"-time",  
                                                        placeholder:"Время",
                                                        height:48,
                                                        value :"00:00:00",
                                                        type:"time",
                                                        seconds: true,
                                                          suggest:{
                                                            type:"timeboard",
                                                            body:{
                                                                button:true,
                                                                seconds: true,
                                                                twelve :false,
                                                                height :110
                                                            }
                                                          },
                                                        on: {
                                                            onAfterRender: function () {
                                                                this.getInputNode().setAttribute("title","Часы, минуты, секунды");
                                                                
                                                            },
                    
                                                        }
                                                    },

                                                ]}
                                            );
                                        
                                        } else if (input.type == "submit"){
                                        
                                            actionType = input.action;
                                            findAction = el.actions[actionType];
                                        
                                            inputsArray.push(

                                                {   rows: [
                                                        {height:10},
                                                        {   view:"button", 
                                                            css:"webix_primary", 
                                                            id:"dashBtn"+i,
                                                            hotkey: "enter",
                                                            inputHeight:48,
                                                            height:48, 
                                                            minWidth:100,
                                                            maxWidth:200,
                                                            value:input.label,
                                                            click:function () {
                                                                let dateArray = [];
                                                                let postFormatData = webix.Date.dateToStr("%d.%m.%Y");
                                                                let getUrl;
                                                                let compareDates=[];
                                                                let postformatTime = webix.Date.dateToStr("%H:%i:%s");
                                                            
                                                                let sdtDate = "";
                                                                let edtDate = "";

                                                                inputsArray.forEach(function(el,i){
                                                                    
                                                                    if (el.id.includes("container")){
                                                                        
                                                                        $$(el.id).getChildViews().forEach(function(elem,i){
                                                                            if (elem.config.id.includes("sdt")){

                                                                                if (elem.config.id.includes("time")){
                                                                                sdtDate=sdtDate.concat(" "+postformatTime($$(elem.config.id).getValue()))
                                                                                } else {
                                                                                    sdtDate = postFormatData($$(elem.config.id).getValue()); 
                                                                                
                                                                                }
                                                                            } else if (elem.config.id.includes("edt")){
                                                                            
                                                                                if (elem.config.id.includes("time")){
                                                                                edtDate=edtDate.concat(" "+postformatTime($$(elem.config.id).getValue()))
                                                                                
                                                                                } else {
                                                                                    edtDate = postFormatData($$(elem.config.id).getValue());
                                                                                    
                                                                                }
                                                                            
                                                                                
                                                                            }
                                                                        });
                                                                    }

                                                                });

                                                                dateArray.push("sdt"+"="+sdtDate);
                                                                dateArray.push("edt"+"="+edtDate);

                                                                compareDates.push(sdtDate); 
                                                                compareDates.push(edtDate);
                                                        
                                                                if (dateArray.length > 0 && compareDates[0] && compareDates[1]){
        
                                                                    let compareFormatData = webix.Date.dateToStr("%Y/%m/%d %H:%i:%s");

                                                                    if (!(webix.filters.date.greater(compareFormatData(compareDates[0]),compareFormatData(compareDates[1])))||compareDates[0]==compareDates[1]){
                                                                        getUrl = findAction.url+"?"+dateArray.join("&");
                                                                    
                                                                        if ($$("dashboard-charts")){
                                                                            $$("dashboardBody").removeView( $$("dashboard-charts"));
                                                                        }
                                                                        
                                                                        getAjax(getUrl, inputsArray, true);

                                                                        $$("dashBtn"+i).disable();
                                                                        setInterval(function () {$$("dashBtn"+i).enable();}, 10000);
                                                                    
                                                                    } else {
                                                                        setLogValue("error", "Начало периода больше, чем конец");
                                                                    }
                                                                } else {
                                                                    setLogValue("error", "Не все поля заполнены");
                                                                }
                                                            },
                                                            on: {
                                                                onAfterRender: function () {
                                                                    this.getInputNode().setAttribute("title",input.comment);
                                                                },
                                                            },

                                                        },
                                                        {}
                                                    ]
                                                }
                                            );
                                        }


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
                    console.log(XmlHttpRequest)
                    ajaxErrorTemplate("009-000",XmlHttpRequest.status,XmlHttpRequest.statusText,XmlHttpRequest.responseURL);
                }
            }).catch(error => {
                console.log(error);
                ajaxErrorTemplate("009-000",error.status,error.statusText,error.responseURL);
            });    
        }  
    } catch (error){
        console.log(error);
        catchErrorTemplate("009-000", error);

    }
}

function getInfoEditTree() {
    $$("treeEdit").clearAll();
    let url = "/init/default/api/"+"trees";
    webix.ajax().get(url, {
        success:function(text, data, XmlHttpRequest){
            try {

                data = data.json().content;
                data[0].pid = 0;
                

                let map = {}, 
                    treeStruct = [],
                    treeData = []
                ;

                data.forEach(function(el,i){
                    if (el.pid == 0){
                        treeData.push({id:el.id, open:true, value:el.name, pid:el.pid, data:[]});
                    } else {
                        treeData.push({id:el.id, value:el.name, pid:el.pid, data:[]});
                    }
                });
               
                treeData.forEach(function(el,i){

                    map[el.id] = i; 

                    if (el.pid !== 0 && el.pid !== el.id && el.pid!==null) {
                        treeData[map[el.pid]].data.push(el);
                    } else {
                        treeStruct.push(el);
                    }
                });

                $$("treeEdit").parse(treeStruct);

            } catch (error){
                console.log(error);
                catchErrorTemplate("009-004", error);
            } 
            
        },
        error:function(text, data, XmlHttpRequest){
            ajaxErrorTemplate("009-000",XmlHttpRequest.status,XmlHttpRequest.statusText,XmlHttpRequest.responseURL);

        }
    }).catch(error => {
        console.log(error);
        ajaxErrorTemplate("009-000",error.status,error.statusText,error.responseURL);
    }); 
  
}


export {
    submitBtn,
    getComboOptions,
    getInfoTable,
    getInfoDashboard,
    getInfoEditTree,
   // urlFieldAction
};
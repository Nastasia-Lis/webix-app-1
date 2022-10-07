import {setLogValue} from './logBlock.js';
import {catchErrorTemplate,ajaxErrorTemplate} from "./logBlock.js";
import  {STORAGE,getData} from "./globalStorage.js";

let prevCountRows ;

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
    
                const getData = webix.ajax(url+"?"+valuesArray.join("&"));
                getData.then(function(data){
                    if (data.json().err_type == "i"){
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
                            setLogValue("error","content function submitBtn: "+error);
                        }  
                    } else {
                        setLogValue("error","content function submitBtn: "+data.err);
                    }
                });
                getData.fail(function(err){
                    console.log(err);
                    setLogValue("error","content function submitBtn ajax: "+err.status+" "+err.statusText+" "+err.responseURL);
                });

          
                
                //;
            } catch (error){
                console.log(error);
                catchErrorTemplate("018-000", error);

            }


        } else if (rtype=="download"){
            webix.ajax().response("blob").get(url, function(text, blob, xhr) {
                try {
                    webix.html.download(blob, "table.docx");
                } catch (error){
                    console.log(error);
                    catchErrorTemplate("018-000", error);
                } 
            }).catch(error => {
                console.log(error);
                ajaxErrorTemplate("018-000",error.status,error.statusText,error.responseURL);
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
            catchErrorTemplate("018-000", error);
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
                            catchErrorTemplate("018-000", error);
                        } 
                    }).catch(error => {
                        console.log(error);
                        setLogValue("error", "content function getComboOptions: "+error.status+" "+error.statusText+" "+error.responseURL+" ("+error.responseText+") ");
                  
                    })
            );
            
        }
    }});
}

function getInfoTable (idCurrTable,idsParam) {

    let idSearch,
        idFindElem,
        filterBar,
        itemTreeId,
        titem
    ;

    function getValsTable (){
        itemTreeId = idsParam;
        titem = $$("tree").getItem(idsParam);

        if (!titem){
            titem = idsParam;
        }

        if (idCurrTable.includes("view")){
            idSearch = "table-view-search";
            idFindElem = "table-view-findElements";
            filterBar = $$("table-view-filterIdView").getParentView();
        } else {
            idSearch = "table-search";
            idFindElem = "table-findElements";
            filterBar = $$("table-filterId").getParentView();
        }
    }

    function preparationTable (){
        $$(idCurrTable).clearAll();

        if (idCurrTable == "table-view"){
            if ($$("contextActionsPopup")){
                $$("contextActionsPopup").destructor();
            }

            if ($$("contextActionsBtnAdaptive")){
                filterBar.removeView($$("contextActionsBtnAdaptive"))
            }
            if ($$( "customInputs" )){
                $$( "customInputs" ).getParentView().removeView($$( "customInputs" ))
            }

            if ($$("customInputsMain")){
                $$("customInputsMain").getParentView().removeView($$( "customInputsMain" ))
            }
        
        }
    }


    function createExperementalElement (){
        STORAGE.fields.content.treeTemplate={
    
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
    }

    function createTableCols (){
        let dataContent = STORAGE.fields.content;
        let data = dataContent[idsParam];
        let fieldType;
        let dataFields = data.fields;

        let colsName = Object.keys(data.fields);
        let columnsData = [];

        colsName.forEach(function(data) {

            fieldType = dataFields[data].type;
        
            if (fieldType.includes("reference")){

                let findTableId = fieldType.slice(10);
                dataFields[data].editor = "combo";
                dataFields[data].collection = getComboOptions (findTableId);
                dataFields[data].template = function(obj, common, val, config){
                    let item = config.collection.getItem(obj[config.id]);
                    return item ? item.value : "";
                };

            } else if (fieldType == "datetime"){

               // dataFields[data].format = webix.i18n.fullDateFormatStr; 
               dataFields[data].format = webix.Date.dateToStr("%d.%m.%Y %H:%i:%s:%S");
                dataFields[data].editor = "date";


            } else if (fieldType == "string" || fieldType == "text" ){

                dataFields[data].editor = "text";

            } else if (fieldType == "integer"){

                dataFields[data].editor = "text";
                dataFields[data].numberFormat="1 111";

            } else if (fieldType == "boolean"){

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

        return columnsData;
    }

    function createTableRows (){
        let dataContent = STORAGE.fields.content;
        let data = dataContent[idsParam];
        
        function getItemData (table){

            $$(table).load({
                $proxy:true,
                load:function(view, params){
                    return webix.ajax().get("/init/default/api/"+itemTreeId,{
                        success:function(text, data, XmlHttpRequest){
                            data = data.json().content;
                            $$(table).config.idTable = itemTreeId;
                            function setTableState(){
                                if (table == "table"){
                                    if(!($$("table-newAddBtnId").isEnabled())){
                                        $$("table-newAddBtnId").enable();
                                    }
                                    if(!($$("table-filterId").isEnabled())){
                                        $$("table-filterId").enable();
                                    }
                                    if(!($$("table-exportBtn").isEnabled())){
                                        $$("table-exportBtn").enable();
                                    }
                                }
                            }

                            function datePrefs (){
                                let dateFormat;
        
                                let columns = $$(table).getColumns();
                                let dateCols = [];

                                function searchDateCols (){
                                    columns.forEach(function(col,i){
    
                                        if (col.type == "datetime"){
                                            dateCols.push(col.id);
                                        }
                                    });
                                }
                                searchDateCols ();
                            
                                data.forEach(function(el,i){

                                    function dateFormatting (elType){
                                      
                                        if (el[elType]){
                                            dateFormat = new Date(el[elType]);
                                            el[elType] = dateFormat;
                                            
                                        }
                                    }

                                    function setDateFormatting (){
                                        dateCols.forEach(function(el,i){
                                            dateFormatting (el);
                                        });
                                    }
                                    setDateFormatting ();
                                 

                                });
                            }

                            function parseRowData (){
                                if (data.length !== 0){
                                
                                    $$(idCurrTable).hideOverlay("Ничего не найдено");
                            
                                    $$(idCurrTable).parse(data);
                            
                                
                                } else {
                                    $$(idCurrTable).showOverlay("Ничего не найдено");
                                    $$(idCurrTable).clearAll();
                                }
                            }

                            function setCounterVal (){
                                prevCountRows = $$(idCurrTable).count();
                                $$(idFindElem).setValues(prevCountRows.toString());
                                if(idCurrTable == "table"){
                                    $$("table-findElements").setValues(prevCountRows.toString());
                                }
                            }

                            try {
                                $$(table).clearAll();
                                setTableState();
                                datePrefs ();
                                parseRowData ();
                                setCounterVal ();
                            
                            } catch (error){
                                console.log(error);
                                setLogValue("error", "content createRow: "+error);
                            //  catchErrorTemplate("018-000", error);
                            } 
                    
                        },
                        error:function(text, data, XmlHttpRequest){
                            //ajaxErrorTemplate("018-000",XmlHttpRequest.status,XmlHttpRequest.statusText,XmlHttpRequest.responseURL);          
                            function tableErrorState (){
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
                                    //catchErrorTemplate("018-000", error);

                                }
                            }
                            tableErrorState ();
                        }, 
            
                }).catch(error => {
                    console.log(error);
                    
                    setLogValue("error", "content createRow: "+error.status+" "+error.statusText+" "+error.responseURL);
                });
                }
            });
        }

        function setDataRows (){
            if(data.type == "dbtable"){
                getItemData ("table");
            } else if (data.type == "tform"){
                getItemData ("table-view");
            }
        }

        function autorefreshProperty (){
            if (data.autorefresh){
    
                let userprefsOther = webix.storage.local.get("userprefsOtherForm");

                if (userprefsOther && userprefsOther.autorefCounterOpt !== undefined){
                    if (userprefsOther.autorefCounterOpt >= 15000){
    
                        setInterval(function(){
                            if(data.type == "dbtable"){
                                getItemData ("table");
                            } else if (data.type == "tform"){
                                getItemData ("table-view");
                            }
                        }, userprefsOther.autorefCounterOpt );
                    } else {
                        setInterval(function(){
                            if(data.type == "dbtable"){
                                getItemData ("table");
                            } else if (data.type == "tform"){
                                getItemData ("table-view");
                            }
                        }, 120000);
                    }
                }
            } 
        }

        setDataRows ();
        autorefreshProperty ();

                
    }

    function createDetailAction (columnsData){
        let idCol;
        let actionKey;
        let checkAction = false;

        let dataContent = STORAGE.fields.content;
        let data = dataContent[idsParam];

        columnsData.forEach(function(field,i){
            if( field.type == "action" && data.actions[field.id].rtype == "detail"){
                checkAction = true;
                idCol = i;
                actionKey = field.id;
            } 
        });
        
        if (actionKey !== undefined){
            let urlFieldAction = data.actions[actionKey].url;
        
            if (checkAction){
                let columns = $$(idCurrTable).config.columns;
                columns.splice(0,0,{ id:"action-first"+idCol, maxWidth:130, src:urlFieldAction, header:"Подробнее", template:"<span class='webix_icon wxi-angle-down'></span> "});
                $$(idCurrTable).refreshColumns();
            }
        }
    

    }

    function createDynamicElems (){
        let dataContent = STORAGE.fields.content;
        let data = dataContent[idsParam];  
        let dataInputsArray = data.inputs;

        function generateCustomInputs (){  
            let customInputs = [];
            let objInuts = Object.keys(data.inputs);

            function createTextInput    (el,i){
                return {   
                    view:"text",
                    placeholder:dataInputsArray[el].label, 
                    id: "customInputs"+i,
                    height:48,
                    labelPosition:"top",
                    on: {
                        onAfterRender: function () {
                            this.getInputNode().setAttribute("title",dataInputsArray[el].comment);
                        },
                        onChange:function(){
                            let inputs = $$("customInputs").getChildViews();
                            inputs.forEach(function(el,i){
                                if (el.config.view == "button" && !($$(el.config.id).isEnabled())){
                                    $$(el.config.id).enable();
                                }
                            });
    
                        }
                    }
                }
            }
    
            function getOptionData      (dataInputsArray,el){
               // console.log(dataInputsArray[el], dataInputsArray, el)
                return new webix.DataCollection({url:{
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
                                    catchErrorTemplate("018-000", error);
                                    
                                } 
                                }).catch(error => {
                                    console.log(error);
                                    setLogValue("error", "content function getOptionData: "+error.status+" "+error.statusText+" "+error.responseURL);
    
                                })
                            );
                        
                    
                        
                    }
                }});
            }
    
            function createSelectInput  (el,i){
            
                return   {   
                    view:"combo",
                    height:48,
                    id: "customCombo"+i,
                    placeholder:dataInputsArray[el].label, 
                    labelPosition:"top", 
                    options:{
                        data:getOptionData (dataInputsArray,el)
                    },
                  
                    on: {
                        onAfterRender: function () {
                            this.getInputNode().setAttribute("title",dataInputsArray[el].comment);
                        },
                    }               
                }
            }
    
            function createDeleteAction (i){
                let countCols = $$(idCurrTable).getColumns().length;
                let columns = $$(idCurrTable).config.columns;
                columns.splice(countCols,0,{ id:"action"+i, header:"Действие",maxWidth:100, template:"{common.trashIcon()}"});
    
                $$(idCurrTable).refreshColumns();
            }

            function getInputsId        (element){
                let parent = element.getParentView();
                let childs = parent.getChildViews();
                let idElements = [];

                childs.forEach((el,i) => {
                    if (el.config.id !== undefined){
                        if (el.config.view=="text"){
                            idElements.push({id:el.config.id, name:"substr"});
                        } 
                        else if (el.config.view=="combo") {
                            idElements.push({id:el.config.id, name:"valtype"});
                        } else if (el.config.view=="uploader"){
                            idElements.push({id:el.config.id});
                        } else if (el.config.view=="datepicker"){
                            idElements.push({id:el.config.id});
                        }
                    }

                });
                return idElements;
            }
    
            function createDeleteBtn    (el,findAction,i){
                return {   
                    view:"button", 
                    id:"customBtnDel"+i,
                    css:"webix_danger", 
                    type:"icon", 
                    disabled:true,
                    icon:"wxi-trash", 
                    inputHeight:48,
                    height:48,
                    value:dataInputsArray[el].label,
                    click:function (id) {
                        let idElements = getInputsId (this);
                        submitBtn(idElements,findAction.url,"delete");
                    },
                    on: {
                        onAfterRender: function () {
                            this.getInputNode().setAttribute("title",dataInputsArray[el].comment);
                        },
                    },
                };
            }
    
            function createCustomBtn    (el,findAction,i){
                return {   
                    view:"button", 
                    css:"webix_primary", 
                    id:"customBtn"+i,
                    inputHeight:46,
                    height:46, 
                    value:dataInputsArray[el].label,
                    click:function (id) {
                        let idElements = getInputsId (this);
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
    
    
                        if ($$("contextActionsPopup")){
                            $$("contextActionsPopup").hide();
                        }
                    
                    },
                    on: {
                        onAfterRender: function () {
                            this.getInputNode().setAttribute("title",dataInputsArray[el].comment);
                        },
                    },
                };
            }
    
            function createUpload       (el,i){
                return  {   
                    view: "uploader", 
                    value: "Upload file", 
                    id:"customUploader"+i,
                    height:48,
                    autosend:false,
                    upload: data.actions.submit.url,
                    label:dataInputsArray[el].label, 
                    labelPosition:"top",
                    click:function(){
                        if ($$("contextActionsPopup")){
                            $$("contextActionsPopup").destructor();
                        }
                    },
                    on: {
                        onAfterRender: function () {
                            this.getInputNode().setAttribute("title",dataInputsArray[el].comment);
                        },
                    }
                }
            }
    
            function createDatepicker   (el,i){
                return {   
                    view: "datepicker",
                    format: "%d.%m.%Y %H:%i:%s",
                    placeholder:dataInputsArray[el].label,  
                    id:"customDatepicker"+i, 
                    timepicker: true,
                    labelPosition:"top",
                    height:48,
                    on: {
                        onAfterRender: function () {
                            this.getInputNode().setAttribute("title",dataInputsArray[el].comment);
                        },
                        onChange:function(){
                            let inputs = $$("customInputs").getChildViews();
                            inputs.forEach(function(el,i){
                                if (el.config.view == "button" && !($$(el.config.id).isEnabled())){
                                    $$(el.config.id).enable();
                                }
                            });
    
                        }
                    }
                };
            }
            
            function createCheckbox     (el,i){
                return {   
                    view:"checkbox", 
                    id:"customСheckbox"+i, 
                    css:"webix_checkbox-style",
                    labelRight:dataInputsArray[el].label, 
                    on: {
                        onAfterRender: function () {
                            this.getInputNode().setAttribute("title",dataInputsArray[el].comment);
                        },
    
                        onChange:function(){
                            let inputs = $$("customInputs").getChildViews();
                            inputs.forEach(function(el,i){
                                if (el.config.view == "button" && !($$(el.config.id).isEnabled())){
                                    $$(el.config.id).enable();
                                }
                            });
    
                        }
                    }
                };
            }


            objInuts.forEach((el,i) => {

                if (dataInputsArray[el].type == "string"){
                    customInputs.push(
                        createTextInput(el,i)
                    );
                } else if (dataInputsArray[el].type == "apiselect") {
                   
                    customInputs.push(
                        createSelectInput(el,i)
                    );

                } else if (dataInputsArray[el].type == "submit" || dataInputsArray[el].type == "button") {

                    let actionType = dataInputsArray[el].action;
                    let findAction = data.actions[actionType];
                
                    if (findAction.verb == "DELETE" && actionType !== "submit"){
                        createDeleteAction (i);
                    } else if (findAction.verb == "DELETE") {
                        customInputs.push(
                            createDeleteBtn(el, findAction,i)
                        );
                    } else {
                        customInputs.push(
                            createCustomBtn(el, findAction,i)
                                
                        );
                    }
                } else if (dataInputsArray[el].type == "upload"){
                    customInputs.push(
                        createUpload(el,i)
                    );
                } else if (dataInputsArray[el].type == "datetime"){
                    customInputs.push(
                        createDatepicker(el,i)
                    );
                }else if (dataInputsArray[el].type == "checkbox"){
                
                    customInputs.push(
                        createCheckbox(el,i)
                    );

                } 
            });
     

            return customInputs;
        }

        function adaptiveCustomInputs (){

            function maxInputsSize (customInputs){
             
                customInputs.forEach(function(el,i){
                    if (el.view == "text"){
                        el.maxWidth = 300;
                        el.minWidth = 150;
                    }

                    if (el.view == "combo"){
                        el.width = 250;
                    }

                    if (el.view == "button" && el.icon == "wxi-trash"){
                        el.width = 100;
                    }

                    
                    if (el.view == "button" && el.css == "webix_primary"){
                        el.maxWidth = 550;
                        el.minWidth = 100;
                    }

                    if (el.view == "datepicker"){
                        el.width = 300;
                        el.minWidth = 100;
                    }

                    if (el.view == "checkbox"){
                        el.minWidth = 220;
                    }

                });
                let inpObj = {id:"customInputs",css:"webix_custom-inp", cols:customInputs};
                let filterBar = $$("table-view-filterIdView").getParentView();
           
                $$(filterBar.config.id).addView( 
                    {id:"customInputsMain",cols:[
                        inpObj
                    ]}
                ,2);

            }

            function minInputsSize (customInputs){
                customInputs.forEach(function(el,i){
                    el.bottomPadding = 10;
                });
                customInputs.push({});
                let inpObj = {id:"customInputsAdaptive",rows:[{id:"customInputs",css:"webix_custom-inp", rows:customInputs}]} ;
                $$(filterBar.config.id).addView({
                    view:"button", 
                    id:"contextActionsBtnAdaptive",
                    maxWidth:100, 
                    
                    value:"Действия", 
                    css:"webix_primary", 
                    popup:webix.ui({
                            view:"popup",
                            css:"webix_popup-actions-container webix_popup-config",
                            modal:true,
                            id:"contextActionsPopup",
                            escHide:true,
                            position:"center",
                            body:{

                                rows:[
                                    {cols:[
                                        {template:"Доступные действия", css:"webix_template-actions", borderless:true, height:40 },
                                        {
                                            view:"button",
                                            id:"buttonClosePopupActions",
                                            css:"webix_close-btn",
                                            type:"icon",
                                            hotkey: "esc",
                                            width:25,
                                            icon: 'wxi-close',
                                            click:function(){
                                                if ($$("contextActionsPopup")){
                                                    $$("contextActionsPopup").hide();
                                                }
                                            
                                            }
                                        },
                                    ]},
                                    {
                                        view:"scrollview",
                                        borderless:true,
                                        scroll:"y", 
                                        body:{ 
                                        id:"contextActionsPopupContainer",
                                        css:"webix_context-actions-popup",
                                        rows:[ 
                                            inpObj
                                        ]
                                        }
                                    }
                            
                                ]
                    
                            
                            }
                    }),
                    click:function(){
                        if($$("contextActionsPopup").config.height !== $$("customInputs").$height +50){
                            $$("contextActionsPopup").config.height = $$("customInputs").$height +50;
                            $$("contextActionsPopup").resize();
                        }
                        let size = window.innerWidth - 100;

                        if( $$("contextActionsPopup").$width > 200){
                            $$("contextActionsPopup").config.width = size;
                            $$("contextActionsPopup").resize();
                        }

                    }
                        
                
                },2);
            }


            if ($$("contextActionsBtn")){
                $$(filterBar.config.id).removeView($$("contextActionsBtn"));
            }

            if (data.inputs){  
                let customInputs;
           
                customInputs = generateCustomInputs ();
                
                if (window.innerWidth > 830){
                   maxInputsSize (customInputs);

                } else {
                    minInputsSize (customInputs);
                }
            }
        }
        
        adaptiveCustomInputs ();

    }

    async function generateTable (){ // SINGLE ELS

        if (!STORAGE.fields){
            await getData("fields"); 
        }

        if (STORAGE.fields){

            createExperementalElement ();
            let columnsData = createTableCols ();
            createDetailAction (columnsData);
            createDynamicElems ();
            createTableRows ();
             
        }
    }
  
    
    try {
        getValsTable ();

        if (titem == undefined) {
            setLogValue("error","Данные не найдены");
        } else {
            preparationTable ();
            generateTable ();

        } 
    } catch (error){

        console.log(error);
        catchErrorTemplate("018-000", error);
    } 
}

function getInfoDashboard (idsParam,single=false){
    let itemTreeId;
    if ($$("tree").getSelectedItem()){
        itemTreeId = $$("tree").getSelectedItem().id;
    } else if (idsParam){
        itemTreeId = idsParam;
    }
  
    function getAjax(url,inputsArray, action=false) {
       
        webix.ajax().get(url, {
            success:function(text, data, XmlHttpRequest){
                let dashLayout=[{type:"wide",rows:[]}];
                let dataCharts = data.json().charts;
                let titleTemplate = {};

                try {
                    if($$("dashBodyScroll")){
                        let parent = $$("dashBodyScroll").getParentView();
                        parent.removeView($$("dashBodyScroll"));
                    }

                    if (!action){ //не с помощью кнопки фильтра
                   
                        if($$("dashboardInfoContainerInner")){
                            $$("dashboardInfoContainerInner").getParentView().removeView($$("dashboardInfoContainerInner"))
                        }
                        if($$("dash-template")){
                            $$("dash-template").getParentView().removeView($$("dash-template"));
                        }
                        if($$("dashboard-tool-main")){
                            $$("dashboard-tool-main").getParentView().removeView($$("dashboard-tool-main"));
                        }

                        if($$("dashboard-tool-adaptive")){
                            $$("dashboard-tool-adaptive").getParentView().removeView($$("dashboard-tool-adaptive"));
                        }

                        
                    }

             

                    if (dataCharts == undefined){
                        $$("dashboardTool").addView({
                            view:"scrollview",
                            id:"dashboard-tool-main",
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
                                css:"webix_style-template-count webix-block-title",
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

                        
                        async function setTableName() {

                            if (!STORAGE.tableNames){
                                await getData("fields"); 
                            }

                            if (STORAGE.tableNames){
                                STORAGE.tableNames.forEach(function(el,i){
                                    if (el.id == itemTreeId){
                                        dashTitle= el.name;
                                    }
                                });
                            }
                        }
                    
                        setTableName() ;
                        
                        if (!action){

                            if (window.innerWidth > 830){
                                $$("dashboardTool").addView({
                                    id:"dashboard-tool-main",
                                    padding:20,
                                    minWidth:250,
                                    rows:[
                                        {id:"dashboardToolHeadContainer",cols:[
                                            
                                            {  template:"Фильтр",height:30, 
                                                css:"webix_dash-filter-headline",
                                                borderless:true
                                            },
                                            {
                                                view:"button",
                                                id:"buttonClosePopupDashFilter",
                                                css:"webix_close-btn",
                                                type:"icon",
                                                hotkey: "esc",
                                                hidden:true,
                                                width:25,
                                                icon: 'wxi-close',
                                                click:function(){
                                                    if ($$("contextDashFilterPopup")){
                                                        $$("contextDashFilterPopup").hide();
                                                    }
                                                
                                                }
                                            }
                                        ]},
                                        
                                        { rows:inputsArray}
                                    ], 
                                });
                            } else {
                                //inputsArray
                                if (!$$("dashFilterBtn")){
                                    $$("dashboardInfoContainer").addView(
                                        {id:"dashboard-tool-adaptive",cols:[

                                            {
                                                view:"button", 
                                                id:"dashFilterBtn", 
                                                value:"Фильтры", 
                                                css:{"margin":"10px 0px!important"}, 
                                                height:46,
                                                margin:10,
                                                popup:webix.ui({
                                                    view:"popup",
                                                    css:"webix_popup-dash-container webix_popup-config",
                                                    modal:true,
                                                    id:"contextDashFilterPopup",
                                                    escHide:true,
                                                    position:"center",
                                                    body:{
                                                        id:"contextDashFilterPopupContainer",
                                                        rows:[

                                                            {id:"dashToolInputsAdaptive",rows:[
                                                                {id:"dashboardToolHeadContainer",cols:[
                                                                    
                                                                    {  template:"Фильтр",height:30, 
                                                                        css:"webix_dash-filter-headline",
                                                                        borderless:true
                                                                    },
                                                                    {
                                                                        view:"button",
                                                                        id:"buttonClosePopupDashFilter",
                                                                        css:"webix_close-btn",
                                                                        type:"icon",
                                                                        hotkey: "esc",
                                                                        width:25,
                                                                        icon: 'wxi-close',
                                                                        click:function(){
                                                                            if ($$("contextDashFilterPopup")){
                                                                                $$("contextDashFilterPopup").hide();
                                                                            }
                                                                        
                                                                        }
                                                                    }
                                                                ]},
                                                                
                                                                { rows:inputsArray}
                                                            ]}
                                                        ],
                                                    }
                                                }),
                                                click:function(){
                                                
                                                    let size = window.innerWidth - 130;
                                                    
                                                    if( size > 200){
                                                        $$("contextDashFilterPopupContainer").config.width = size;
                                                        $$("contextDashFilterPopupContainer").resize();
                                                    }
                                                }
                                            }
                                        ]}
                                    ,0);
                                }
                            }

                        
                            $$("dashboardInfoContainer").addView(
                                {id:"dashboardInfoContainerInner",rows:[

                                    { 
                                        template:dashTitle,
                                        id:"dash-template",
                                        css:"webix_style-template-count webix_block-title",
                                        borderless:false,
                                        height:75,
                    
                                    },
                                    {
                                        view:"scrollview", 
                                        //scroll:"auto",
                                        scroll:"y",
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
                        } else {
                            $$("dashboardInfoContainerInner").addView(

                                    {
                                        view:"scrollview", 
                                        scroll:"y",
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
                       
                            );
                        }
                       
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
                    catchErrorTemplate("018-004", error);
                } 
                
            },
            error:function(text, data, XmlHttpRequest){
                ajaxErrorTemplate("018-000",XmlHttpRequest.status,XmlHttpRequest.statusText,XmlHttpRequest.responseURL);

            }
        }).catch(error => {
            console.log(error);
            ajaxErrorTemplate("018-000",error.status,error.statusText,error.responseURL);
        }); 

    }

    async function getFieldsData (){
        if (!STORAGE.fields){
            await getData("fields"); 
        }
        function createDashSpace (){
         
            let actionType ;
            let findAction;
            let singleItemContent;
          //  let data = STORAGE.fields.content;
            let fields = STORAGE.fields.content;
            let inputsArray= [];
         
            function createFilterElems (inputs,el){
               
                function createDate(type,input){
                    let dateTemplate = {
                        view: "datepicker",
                        format:"%d.%m.%y",
                        editable:true,
                        value :new Date(),
                        placeholder:input.label,
                        height:48,
                        on: {
                            onAfterRender: function () {
                                this.getInputNode().setAttribute("title",input.comment);
                            },
                        }
                    };

                    if (type == "first"){
                        let dateFirst = dateTemplate;
                        dateFirst.id = "dashDatepicker_"+"sdt";
                        return dateFirst;
                    } else if (type == "last"){
                        let dateLast = dateTemplate;
                        dateLast.id = "dashDatepicker_"+"edt";
                        return dateLast;
                    }

                }

                function createTime (type){
                    let timeTemplate =  {   
                        view: "datepicker",
                        format:"%H:%i:%s",
                        placeholder:"Время",
                        height:48,
                        editable:true,
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
                                height :110,
                                
                            },
                        },
                        on: {
                            onAfterRender: function () {
                                this.getInputNode().setAttribute("title","Часы, минуты, секунды");
                                
                            },
                        }
                    };


                    if (type == "first"){
                        let timeFirst = timeTemplate;
                        timeFirst.id = "dashDatepicker_"+"sdt"+"-time";
                        return timeFirst;
                    } else if (type == "last"){
                        let timeLast = timeTemplate;
                        timeLast.id = "dashDatepicker_"+"edt"+"-time"; 
                        return timeLast;
                    }
                }

                function createBtn (input, i){
                    return   {   rows: [
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
                                let getUrl;
                                let compareDates=[];
                                let postFormatData = webix.Date.dateToStr("%d.%m.%y");
                                let postformatTime = webix.Date.dateToStr("%H:%i:%s");
                            
                                let sdtDate = "";
                                let edtDate = "";

                                let validateEmpty = true;

                                function getDataInputs(){
                                    inputsArray.forEach(function(el,i){
                                
                                        if (el.id.includes("container")){
                                            
                                            $$(el.id).getChildViews().forEach(function(elem,i){
                                               
                                                if (elem.config.id.includes("sdt")){

                                                    if (elem.config.id.includes("time")){
                                                        if ($$(elem.config.id).getValue()!==null){
                                                            sdtDate=sdtDate.concat(" "+postformatTime($$(elem.config.id).getValue()))
                                                        } else {
                                                            validateEmpty=false;
                                                        }
                                                    } else {
                                                        if ($$(elem.config.id).getValue()!==null){
                                                            sdtDate = postFormatData($$(elem.config.id).getValue()); 
                                                        } else {
                                                            validateEmpty=false;
                                                        }
                                                    }
                                                } else if (elem.config.id.includes("edt")){
                                                
                                                    if (elem.config.id.includes("time")){
                                                        if ($$(elem.config.id).getValue()!==null){
                                                            edtDate=edtDate.concat(" "+postformatTime($$(elem.config.id).getValue()))
                                                        } else {
                                                            validateEmpty=false;
                                                        }
                                                    } else {
                                                        if ($$(elem.config.id).getValue()!==null){
                                                            edtDate = postFormatData($$(elem.config.id).getValue());
                                                        }else {
                                                            validateEmpty=false;
                                                        }
                                                    }
                                                
                                                    
                                                }
                                            });
                                        }

                                    });
                                    dateArray.push("sdt"+"="+sdtDate);
                                    dateArray.push("edt"+"="+edtDate);
                                 
                                    compareDates.push(sdtDate); 
                                    compareDates.push(edtDate);
                                }

                                function sentQuery (){
                                    if (validateEmpty){

                                        let compareFormatData = webix.Date.dateToStr("%Y/%m/%d %H:%i:%s");

                                        if (!(webix.filters.date.greater(compareFormatData(compareDates[0]),compareFormatData(compareDates[1])))||compareDates[0]==compareDates[1]){
                                            getUrl = findAction.url+"?"+dateArray.join("&");
                                        
                                            if ($$("dashboard-charts")){
                                                $$("dashboardBody").removeView( $$("dashboard-charts"));
                                            }
                                            
                                            getAjax(getUrl, inputsArray, true);

                                            $$("dashBtn"+i).disable();
                                            setInterval(function () {$$("dashBtn"+i).enable();}, 1000);
                                        
                                        } else {
                                            setLogValue("error", "Начало периода больше, чем конец");
                                        }
                                    } else {
                                        setLogValue("error", "Не все поля заполнены");
                                    }
                                }

                                getDataInputs();
                                sentQuery ();
                               
                            },
                            on: {
                                onAfterRender: function () {
                                    this.getInputNode().setAttribute("title",input.comment);
                                },
                            },

                        },
                        {}
                    ]
                    };
                }
                
                function createFilter (el){
             
                    Object.values(inputs).forEach(function(input,i){
                     
                        if (input.type == "datetime"&& input.order == 3){ //------------------ order
                      
                            let key = Object.keys(inputs)[i]; // заменены на sdt и edt

                            inputsArray.push(

                                {width:200,id:"datepicker-container"+"sdt",rows:[ 

                                    {   template:"Начиная с:",
                                        height:30, 
                                        borderless:true,
                                        css:"webix_template-datepicker"
                                    },
                                    createDate("first",input),
                                    {height:10},
                                    createTime ("first"),


                                    {height:20},

                                    {   template:"Заканчивая:",
                                        height:30,
                                        borderless:true, 
                                        css:"webix_template-datepicker"
                                    },
                                    createDate("last",input),
                                    {height:10},
                                    createTime ("last"),

                                ]}
                            );
                        
                        } else if (input.type == "submit"){
                          
                            actionType = input.action;
                            findAction = el.actions[actionType];
                        
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

                    let userprefsOther = webix.storage.local.get("userprefsOtherForm");
                    if (userprefsOther.autorefCounterOpt !== undefined){
                        if (userprefsOther.autorefCounterOpt >= 15000){
                            setInterval(function(){
                                getAjax(singleItemContent.actions.submit.url, inputsArray);
                            },  userprefsOther.autorefCounterOpt );
            
                        } else {
                            setInterval(function(){
                                getAjax(singleItemContent.actions.submit.url, inputsArray);
                            }, 50000);
                        }
                    }

                
                
                }
            }
          
            Object.values(fields).forEach(function(el,i){

                if (el.type == "dashboard" && Object.keys(fields)[i] == itemTreeId) {
                    let inputs = el.inputs;
               
                    getAjax(el.actions.submit.url, createFilterElems (inputs,el));
                    autorefresh (el);  
                }
            });
        }

        if (STORAGE.fields){
    
            createDashSpace ();
        }

    }

    try {
  

        if($$("dashBodyScroll")){
            let parent = $$("dashBodyScroll").getParentView()
            parent.removeView($$("dashBodyScroll"))
        }

        

        if(!($$("dashBodyScroll"))){

           

           getFieldsData ();
            // webix.ajax().get("/init/default/api/fields",{
            //     success:function(text, data, XmlHttpRequest){
            //         let inputsArray=[];
            //         let actionType ;
            //         let findAction;
            //         let singleItemContent;
            //         data = data.json().content;
            //         try {
            //             if (single){
            //                 let singleSearch = idsParam.search("-single");
            //                 idsParam = idsParam.slice(0,singleSearch); 
            //             }
                    
                        
            //             Object.values(data).forEach(function(el,i){
            //                 el.nameObj = Object.keys(data)[i];
            //                 if (el.nameObj== idsParam){
            //                     singleItemContent =el;
            //                 }
            //             });

            //             if (single){
            //                 let inputs = singleItemContent.inputs;
                            
            //                 let keys = Object.keys(inputs);
            //                 Object.values(inputs).forEach(function(input,i){

            //                     if (input.type == "datetime"&& input.order == 3){ //------------------ order
                                      
            //                         let key = Object.keys(inputs)[i]; // заменены на sdt и edt

                           
            //                         inputsArray.push(

            //                             {width:200,id:"datepicker-container"+"sdt",rows:[ 
            //                                 {template:"Начиная с:",height:30, borderless:true,css:"webix_template-datepicker"},
            //                                 {   view: "datepicker",
            //                                     format:"%d.%m.%y",
            //                                     editable:true,
            //                                     value :new Date(),
            //                                     id:"dashDatepicker_"+"sdt",  
            //                                     placeholder:input.label,
            //                                     height:48,
            //                                     on: {
            //                                         onAfterRender: function () {
            //                                             this.getInputNode().setAttribute("title",input.comment);
            //                                         },
             
            //                                     }
            //                                 },
            //                               {height:10},
            //                                 {   view: "datepicker",
            //                                     format:"%H:%i:%s",
            //                                     id:"dashDatepicker_"+"sdt"+"-time",  
            //                                     placeholder:"Время",
            //                                     height:48,
            //                                     editable:true,
            //                                     value :"00:00:00",
            //                                     type:"time",
            //                                     seconds: true,
            //                                       suggest:{
            //                                         type:"timeboard",
            //                                         body:{
            //                                             button:true,
            //                                             seconds: true,
            //                                             value :"00:00:00",
            //                                             twelve :false,
            //                                             height :110,
            //                                         }
            //                                       },
            //                                     on: {
            //                                         onAfterRender: function () {
            //                                             this.getInputNode().setAttribute("title","Часы, минуты, секунды");
                                                        
            //                                         },
            
            //                                     }
            //                                 },
            //                                 {height:20},

            //                                 {template:"Заканчивая:",height:30, borderless:true, css:"webix_template-datepicker"},
            //                                 {   view: "datepicker",
            //                                     format:"%d.%m.%y",
            //                                     value :new Date(),
            //                                     editable:true,
            //                                     id:"dashDatepicker_"+"edt",  
            //                                     placeholder:input.label,
            //                                   //  width:125,
            //                                     height:48,
            //                                     on: {
            //                                         onAfterRender: function () {
            //                                             this.getInputNode().setAttribute("title",input.comment);
            //                                         },
             
            //                                     }
            //                                 },
            //                                 {height:10},
            //                                 {   view: "datepicker",
            //                                     format:"%H:%i:%s",
            //                                     id:"dashDatepicker_"+"edt"+"-time",  
            //                                     placeholder:"Время",
            //                                     editable:true,
            //                                     height:48,
            //                                     value :"00:00:00",
            //                                     type:"time",
            //                                     seconds: true,
            //                                       suggest:{
            //                                         type:"timeboard",
            //                                         hotkey: "enter",
            //                                         body:{
            //                                             button:true,
            //                                             seconds: true,
            //                                             value :"00:00:00",
            //                                             twelve :false,
            //                                             height :110
            //                                         }
            //                                       },
            //                                     on: {
            //                                         onAfterRender: function () {
            //                                             this.getInputNode().setAttribute("title","Часы, минуты, секунды");
                                                        
            //                                         },
            
            //                                     }
            //                                 },

            //                             ]}
            //                         );
                                
            //                     } else if (input.type == "submit"){
                                
            //                         actionType = input.action;
            //                         findAction = singleItemContent.actions[actionType];
                                
            //                         inputsArray.push(

            //                             {   rows: [
            //                                     {height:10},
            //                                     {   view:"button", 
            //                                         css:"webix_primary", 
            //                                         id:"dashBtn"+i,
            //                                         inputHeight:48,
            //                                         height:48, 
            //                                         minWidth:100,
            //                                         maxWidth:200,
            //                                         value:input.label,
            //                                         click:function () {
            //                                             let dateArray = [];
            //                                             let postFormatData = webix.Date.dateToStr("%d.%m.%y");
            //                                             let getUrl;
            //                                             let compareDates=[];
            //                                             let postformatTime = webix.Date.dateToStr("%H:%i:%s");
                                                    
            //                                             let sdtDate = "";
            //                                             let edtDate = "";

            //                                             let validateEmpty = true;

            //                                             inputsArray.forEach(function(el,i){
                                                            
            //                                                 if (el.id.includes("container")){
                                                                
            //                                                     $$(el.id).getChildViews().forEach(function(elem,i){
            //                                                         if (elem.config.id.includes("sdt")){

            //                                                             if (elem.config.id.includes("time")){
            //                                                                 if ($$(elem.config.id).getValue()!==null){
            //                                                                     sdtDate=sdtDate.concat(" "+postformatTime($$(elem.config.id).getValue()))
            //                                                                 } else {
            //                                                                     validateEmpty=false;
            //                                                                 }
            //                                                             } else {
            //                                                                 if ($$(elem.config.id).getValue()!==null){
            //                                                                     sdtDate = postFormatData($$(elem.config.id).getValue()); 
            //                                                                 } else {
            //                                                                     validateEmpty=false;
            //                                                                 }
            //                                                             }
            //                                                         } else if (elem.config.id.includes("edt")){
                                                                    
            //                                                             if (elem.config.id.includes("time")){
            //                                                                 if ($$(elem.config.id).getValue()!==null){
            //                                                                     edtDate=edtDate.concat(" "+postformatTime($$(elem.config.id).getValue()))
            //                                                                 } else {
            //                                                                     validateEmpty=false;
            //                                                                 } 
            //                                                             } else {
            //                                                                 if ($$(elem.config.id).getValue()!==null){
            //                                                                     edtDate = postFormatData($$(elem.config.id).getValue());
            //                                                                 } else {
            //                                                                     validateEmpty=false;
            //                                                                 } 
            //                                                             }
                                                                    
                                                                        
            //                                                         }
            //                                                     });
            //                                                 }

            //                                             });

            //                                             dateArray.push("sdt"+"="+sdtDate);
            //                                             dateArray.push("edt"+"="+edtDate);

            //                                             compareDates.push(sdtDate); 
            //                                             compareDates.push(edtDate);
                                                    
            //                                             if (validateEmpty){

            //                                                 let compareFormatData = webix.Date.dateToStr("%Y/%m/%d %H:%i:%s");

            //                                                 if (!(webix.filters.date.greater(compareFormatData(compareDates[0]),compareFormatData(compareDates[1])))||compareDates[0]==compareDates[1]){
            //                                                     getUrl = findAction.url+"?"+dateArray.join("&");
                                                            
            //                                                     if ($$("dashboard-charts")){
            //                                                         $$("dashboardBody").removeView( $$("dashboard-charts"));
            //                                                     }
                                                                
            //                                                     if (!($$("dashboard-charts"))){
            //                                                         getAjax(getUrl, inputsArray, true);
            //                                                     }

                                                                
            //                                                     $$("dashBtn"+i).disable();
            //                                                     setInterval(function () {$$("dashBtn"+i).enable();}, 1000);
                                                         
            //                                                 } else {
            //                                                     setLogValue("error", "Начало периода больше, чем конец"); 
            //                                                 }
            //                                             } else {
            //                                                 setLogValue("error", "Не все поля заполнены");
            //                                             }
            //                                         },
            //                                         on: {
            //                                             onAfterRender: function () {
            //                                                 this.getInputNode().setAttribute("title",input.comment);
            //                                             },
            //                                         },

            //                                     },
            //                                     {}
            //                                 ]
            //                             }
            //                         );
                                  
            //                     }

            //                 });
                            
            //                 getAjax(singleItemContent.actions.submit.url, inputsArray);

            //                 if (singleItemContent.autorefresh){

            //                     let userprefsOther = webix.storage.local.get("userprefsOtherForm");
            //                     if (userprefsOther.autorefCounterOpt !== undefined){
            //                         if (userprefsOther.autorefCounterOpt >= 15000){
            //                             setInterval(function(){
            //                                 getAjax(singleItemContent.actions.submit.url, inputsArray);
            //                             }, userprefsOther.autorefCounterOpt );
                           
            //                         } else {
            //                             setInterval(function(){
            //                                 getAjax(singleItemContent.actions.submit.url, inputsArray);
            //                             },  50000 );
            //                         }
            //                     }

                             
            //                 }

            //             } 
                        
            //             else {

            //                 let fields = data;
                            
            //                 Object.values(fields).forEach(function(el,i){
                            

            //                     if (el.type == "dashboard" && el.nameObj == itemTreeId) {
            //                         let inputs = el.inputs;

            //                         console.log(el)

            //                         Object.values(inputs).forEach(function(input,i){
                                    
            //                             if (input.type == "datetime"&& input.order == 3){ //------------------ order
                                      
            //                                 let key = Object.keys(inputs)[i]; // заменены на sdt и edt

                                   
            //                                 inputsArray.push(

            //                                     {width:200,id:"datepicker-container"+"sdt",rows:[ 
            //                                         {template:"Начиная с:",height:30, borderless:true,css:"webix_template-datepicker"},
            //                                         {   view: "datepicker",
            //                                             format:"%d.%m.%y",
            //                                             editable:true,
            //                                             value :new Date(),
            //                                             id:"dashDatepicker_"+"sdt",
            //                                             placeholder:input.label,
            //                                             height:48,
            //                                             on: {
            //                                                 onAfterRender: function () {
            //                                                     this.getInputNode().setAttribute("title",input.comment);
            //                                                 },
                                                          
            //                                                 'onKeyPress':function(code, e){
            //                                                     console.log(code, e)
            //                                                 }
                                                        
                     
            //                                             }
            //                                         },
            //                                       {height:10},
            //                                         {   view: "datepicker",
            //                                             format:"%H:%i:%s",
            //                                             id:"dashDatepicker_"+"sdt"+"-time",  
            //                                             placeholder:"Время",
            //                                             height:48,
            //                                             editable:true,
            //                                             value :"00:00:00",
            //                                             type:"time",
            //                                             seconds: true,
            //                                             suggest:{
            //                                                 type:"timeboard",
            //                                                 hotkey: "enter",
            //                                                 body:{
            //                                                     button:true,
            //                                                     seconds: true,
            //                                                     value :"00:00:00",
            //                                                     twelve :false,
            //                                                     height :110,
                                                                
            //                                                 },
            //                                               },
            //                                             on: {
            //                                                 onAfterRender: function () {
            //                                                     this.getInputNode().setAttribute("title","Часы, минуты, секунды");
                                                                
            //                                                 },
            //                                             }
            //                                         },
            //                                         {height:20},

            //                                         {template:"Заканчивая:",height:30, borderless:true, css:"webix_template-datepicker"},
            //                                         {   view: "datepicker",
            //                                             format:"%d.%m.%y",
            //                                             editable:true,
            //                                             value :new Date(),
            //                                             id:"dashDatepicker_"+"edt",  
            //                                             placeholder:input.label,
            //                                             height:48,
            //                                             on: {
            //                                                 onAfterRender: function () {
            //                                                     this.getInputNode().setAttribute("title",input.comment);
            //                                                 },
                     
            //                                             }
            //                                         },
            //                                         {height:10},
            //                                         {   view: "datepicker",
            //                                             format:"%H:%i:%s",
            //                                             id:"dashDatepicker_"+"edt"+"-time",  
            //                                             placeholder:"Время",
            //                                             height:48,
            //                                             editable:true,
            //                                             value :"00:00:00",
            //                                             type:"time",
            //                                             seconds: true,
            //                                               suggest:{
            //                                                 type:"timeboard",
            //                                                 body:{
            //                                                     button:true,
            //                                                     seconds: true,
            //                                                     twelve :false,
            //                                                     height :110
            //                                                 }
            //                                               },
            //                                             on: {
            //                                                 onAfterRender: function () {
            //                                                     this.getInputNode().setAttribute("title","Часы, минуты, секунды");
                                                                
            //                                                 },
                    
            //                                             }
            //                                         },

            //                                     ]}
            //                                 );
                                        
            //                             } else if (input.type == "submit"){
                                        
            //                                 actionType = input.action;
            //                                 findAction = el.actions[actionType];
                                        
            //                                 inputsArray.push(

            //                                     {   rows: [
            //                                             {height:10},
            //                                             {   view:"button", 
            //                                                 css:"webix_primary", 
            //                                                 id:"dashBtn"+i,
            //                                                 inputHeight:48,
            //                                                 height:48, 
            //                                                 minWidth:100,
            //                                                 maxWidth:200,
            //                                                 value:input.label,
            //                                                 click:function () {
            //                                                     let dateArray = [];
            //                                                     let postFormatData = webix.Date.dateToStr("%d.%m.%y");
            //                                                     let getUrl;
            //                                                     let compareDates=[];
            //                                                     let postformatTime = webix.Date.dateToStr("%H:%i:%s");
                                                            
            //                                                     let sdtDate = "";
            //                                                     let edtDate = "";

            //                                                     let validateEmpty = true;

            //                                                     inputsArray.forEach(function(el,i){
                                                                
            //                                                         if (el.id.includes("container")){
                                                                        
            //                                                             $$(el.id).getChildViews().forEach(function(elem,i){
                                                                           
            //                                                                 if (elem.config.id.includes("sdt")){

            //                                                                     if (elem.config.id.includes("time")){
            //                                                                         if ($$(elem.config.id).getValue()!==null){
            //                                                                             sdtDate=sdtDate.concat(" "+postformatTime($$(elem.config.id).getValue()))
            //                                                                         } else {
            //                                                                             validateEmpty=false;
            //                                                                         }
            //                                                                     } else {
            //                                                                         if ($$(elem.config.id).getValue()!==null){
            //                                                                             sdtDate = postFormatData($$(elem.config.id).getValue()); 
            //                                                                         } else {
            //                                                                             validateEmpty=false;
            //                                                                         }
            //                                                                     }
            //                                                                 } else if (elem.config.id.includes("edt")){
                                                                            
            //                                                                     if (elem.config.id.includes("time")){
            //                                                                         if ($$(elem.config.id).getValue()!==null){
            //                                                                             edtDate=edtDate.concat(" "+postformatTime($$(elem.config.id).getValue()))
            //                                                                         } else {
            //                                                                             validateEmpty=false;
            //                                                                         }
            //                                                                     } else {
            //                                                                         if ($$(elem.config.id).getValue()!==null){
            //                                                                             edtDate = postFormatData($$(elem.config.id).getValue());
            //                                                                         }else {
            //                                                                             validateEmpty=false;
            //                                                                         }
            //                                                                     }
                                                                            
                                                                                
            //                                                                 }
            //                                                             });
            //                                                         }

            //                                                     });

            //                                                     dateArray.push("sdt"+"="+sdtDate);
            //                                                     dateArray.push("edt"+"="+edtDate);
                                                             
            //                                                     compareDates.push(sdtDate); 
            //                                                     compareDates.push(edtDate);
            //                                                     if (validateEmpty){
        
            //                                                         let compareFormatData = webix.Date.dateToStr("%Y/%m/%d %H:%i:%s");

            //                                                         if (!(webix.filters.date.greater(compareFormatData(compareDates[0]),compareFormatData(compareDates[1])))||compareDates[0]==compareDates[1]){
            //                                                             getUrl = findAction.url+"?"+dateArray.join("&");
                                                                    
            //                                                             if ($$("dashboard-charts")){
            //                                                                 $$("dashboardBody").removeView( $$("dashboard-charts"));
            //                                                             }
                                                                        
            //                                                             getAjax(getUrl, inputsArray, true);

            //                                                             $$("dashBtn"+i).disable();
            //                                                             setInterval(function () {$$("dashBtn"+i).enable();}, 1000);
                                                                    
            //                                                         } else {
            //                                                             setLogValue("error", "Начало периода больше, чем конец");
            //                                                         }
            //                                                     } else {
            //                                                         setLogValue("error", "Не все поля заполнены");
            //                                                     }
            //                                                 },
            //                                                 on: {
            //                                                     onAfterRender: function () {
            //                                                         this.getInputNode().setAttribute("title",input.comment);
            //                                                     },
            //                                                 },

            //                                             },
            //                                             {}
            //                                         ]
            //                                     }
            //                                 );
            //                             }


            //                         });
            //                         getAjax(el.actions.submit.url, inputsArray);
                               
            //                         if (el.autorefresh){

            //                             let userprefsOther = webix.storage.local.get("userprefsOtherForm");
            //                             if (userprefsOther.autorefCounterOpt !== undefined){
            //                                 if (userprefsOther.autorefCounterOpt >= 15000){
            //                                     setInterval(function(){
            //                                         getAjax(singleItemContent.actions.submit.url, inputsArray);
            //                                     },  userprefsOther.autorefCounterOpt );
                                   
            //                                 } else {
            //                                     setInterval(function(){
            //                                         getAjax(singleItemContent.actions.submit.url, inputsArray);
            //                                     }, 50000);
            //                                 }
            //                             }

                                    
                                    
            //                         }
            //                     }
                                
                                
            //                 });

            //             }
            //         } catch (error){
            //             console.log(error);
            //             catchErrorTemplate("018-000", error);
                
            //         }

            //     },
                
            //     error:function(text, data, XmlHttpRequest){
            //         console.log(XmlHttpRequest)
            //         ajaxErrorTemplate("018-000",XmlHttpRequest.status,XmlHttpRequest.statusText,XmlHttpRequest.responseURL);
            //     }
            // }).catch(error => {
            //     console.log(error);
            //     ajaxErrorTemplate("018-000",error.status,error.statusText,error.responseURL);
            // });    
        }  
    } catch (error){
        console.log(error);
        catchErrorTemplate("018-000", error);

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
                catchErrorTemplate("018-004", error);
            } 
            
        },
        error:function(text, data, XmlHttpRequest){
            ajaxErrorTemplate("018-000",XmlHttpRequest.status,XmlHttpRequest.statusText,XmlHttpRequest.responseURL);

        }
    }).catch(error => {
        console.log(error);
        ajaxErrorTemplate("018-000",error.status,error.statusText,error.responseURL);
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
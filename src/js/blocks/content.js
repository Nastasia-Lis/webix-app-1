import {setLogValue} from './logBlock.js';
import  {STORAGE,getData} from "./globalStorage.js";

import {setAjaxError,setFunctionError} from "./errors.js";

import {setHeadlineBlock} from './blockHeadline.js';

function hideElem(elem){
    try{
        if (elem && elem.isVisible()){
            elem.hide();
        }
    } catch (err){
        setFunctionError(err,"content","hideElem");
    }
}

function showElem (elem){
    try{
        if (elem && !(elem.isVisible())){
            elem.show();
        }
    } catch (err){
        setFunctionError(err,"content","showElem");
    }
}

function submitBtn (idElements, url, verb, rtype){

    let valuesArray = [];

    function refreshButton(){

        function createQuery(){
            try{
                idElements.forEach((el,i) => {
                    if (el.id.includes("customCombo")){
                        valuesArray.push(el.name+"="+$$(el.id).getText());
                    } else if (el.id.includes("customInputs")) {
                    
                        valuesArray.push(el.name+"="+$$(el.id).getValue());
                    } else if (el.id.includes("customDatepicker")) {
                        valuesArray.push(el.name+"="+$$(el.id).getValue());
                    }    
                });
            } catch (err){  
                setFunctionError(err,"content","refreshButton => createQuery");
            }
        }
  
        createQuery();

        const getData = webix.ajax(url+"?"+valuesArray.join("&"));
        
        getData.then(function(data){
            function setTableState(){
                data = data.json().content;
                try{
                    $$("table-view").clearAll();
                    if (data.length !== 0){
                        $$("table-view").hideOverlay("Ничего не найдено");
                        $$("table-view").parse(data);
                        setLogValue("success","Данные обновлены");
                    } else {
                        $$("table-view").showOverlay("Ничего не найдено");
                    }
                } catch (err){  
                    setFunctionError(err,"content","refreshButton => setTableState");
                }
            }

            function setTableCounter(){
                let prevCountRows;
                let findElementView = $$("table-view-findElements");
                try{
                    prevCountRows = $$("table-view").count();
                    findElementView.setValues(prevCountRows.toString());
                } catch (err){  
                    setFunctionError(err,"content","refreshButton => setTableCounter");
                }
            }
            if (data.json().err_type == "i"){
                setTableState();
                setTableCounter();
            } else {
                setFunctionError(data.err,"content","refreshButton");
            }
        });
        getData.fail(function(err){
            setAjaxError(err, "content","refreshButton");
        });
    }

    function downloadButton(){

        webix.ajax().response("blob").get(url, function(text, blob, xhr) {
            try {
                webix.html.download(blob, "table.docx");
            } catch (err){
                setFunctionError(err,"content","downloadButton")
            } 
        }).catch(err => {
            setAjaxError(err, "content","downloadButton");
        });
    }

    function postButton(){

        async function uploadData(formData,link){
            fetch(link, {
                method: "POST", 
                body: formData
            })  

            .then((response) => response.json())
            .then(function(data){
                const loadEl = $$("templateLoad");
       
                if (data.err_type == "i"){
                    loadEl.setValues("Файл загружен");
                    setLogValue("success","Файл успешно загружен");
                } else {
                    loadEl.setValues("Ошибка");
                    setLogValue("error",data.err);
                }
            });

        }

        function addLoadEl(container){
            container.addView({
                id:"templateLoad",
                template: function(){
                    if (Object.keys($$("templateLoad").getValues()).length !==0){
                        return $$("templateLoad").getValues();
                    } else {
                        return "Загрузка ...";
                    }
                },
                borderless:true,
            });
        }
        try{
       
            idElements.forEach((el,i) => {
                if (el.id.includes("customUploader")){
                
                    let value = Object.values($$(el.id).files.data.pull)[0];
                    let link = $$(el.id).config.upload;

                    let formData = new FormData();  
                    let container = $$(el.id).getParentView();
                    addLoadEl(container);

                    formData.append("file", value.file);

                    uploadData(formData,link);
                   
                }
            });
        } catch (err){  
            setFunctionError(err,"content","postButton");
        } 
    }

    if (verb=="get"){ 
        if(rtype=="refresh"){
            refreshButton();
        } else if (rtype=="download"){
            downloadButton();
        } 
    } else if (verb=="post"){
        postButton();
    } 
    
}

function getComboOptions (refTable){
    const url = "/init/default/api/"+refTable;
    return new webix.DataCollection({url:{
        $proxy:true,
        load: function(){
            return ( webix.ajax().get(url).then(function (data) {
                        data = data.json().content;
                        let dataArray=[];
                        let keyArray;

                        function stringOption(l,el){
                            try{
                                while (l <= Object.values(el).length){
                                    if (typeof Object.values(el)[l] == "string"){
                                        keyArray = Object.keys(el)[l];
                                        break;
                                    } 
                                    l++;
                                }
                            } catch (err){  
                                setFunctionError(err,"content","getComboOptions => stringOption");
                            }
                        }

                        function numOption(l,el){
                            try{
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
                            } catch (err){  
                                setFunctionError(err,"content","getComboOptions => numOption");
                            }
                        }

                        function createComboValues(){
                            try{
                                data.forEach((el,i) =>{
                                    let l = 0;
                                    stringOption (l,el);
                                    numOption    (l,el);
                                
                                });
                            } catch (err){  
                                setFunctionError(err,"content","getComboOptions => createComboValues");
                            }
                        }
                        createComboValues();
                        return dataArray;
                    
                    }).catch(err => {
                        setAjaxError(err, "content","getComboOptions");
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
            try{ 
                idSearch = "table-view-search";
                idFindElem = "table-view-findElements";
                filterBar = $$("table-view-filterId").getParentView();
            } catch (err){  
                setFunctionError(err,"content","getValsTable");
            }
        } else {
            try{
                idSearch = "table-search";
                idFindElem = "table-findElements";
                filterBar = $$("table-filterId").getParentView();
            } catch (err){  
                setFunctionError(err,"content","getValsTable");
            }
        }
    }

    function preparationTable (){
        try{
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
        } catch (err){  
            setFunctionError(err,"content","preparationTable");
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
  
        const dataContent   = STORAGE.fields.content;
        const data          = dataContent[idsParam];
        const dataFields    = data.fields;
        const colsName      = Object.keys(data.fields);
        const columnsData   = [];
      

        let fieldType;

        function refreshCols(columnsData){
            const table = $$(idCurrTable);
            if(table){
                table.refreshColumns(columnsData);
            }
        }

        try{
            colsName.forEach(function(data) {
                fieldType = dataFields[data].type;
         
            
                function createReferenceCol (){
                    try{
                        let findTableId = fieldType.slice(10);
                        dataFields[data].editor = "combo";
                        dataFields[data].collection = getComboOptions (findTableId);
                        dataFields[data].template = function(obj, common, val, config){
                            let item = config.collection.getItem(obj[config.id]);
                            return item ? item.value : "";
                        };
                    }catch (err){
                        setFunctionError(err,"content","createTableCols => createReferenceCol")
                    }
                }

                function createDatetimeCol  (){
                    try{
                        dataFields[data].format = webix.Date.dateToStr("%d.%m.%Y %H:%i:%s");
                        dataFields[data].editor = "date";
                    }catch (err){
                        setFunctionError(err,"content","createTableCols => createDatetimeCol")
                    }
                }
                
                function createTextCol      (){
                    try{
                        dataFields[data].editor = "text";
                        dataFields[data].sort = "string";
                    }catch (err){
                        setFunctionError(err,"content","createTableCols => createTextCol")
                    }
                }
                function createIntegerCol   (){
                    try{
                        dataFields[data].editor = "text";
                        dataFields[data].sort = "int";
                        dataFields[data].numberFormat="1 111";
                    }catch (err){
                        setFunctionError(err,"content","createTableCols => createIntegerCol");
                    }
                }
                function createBoolCol      (){
                    try{
                        dataFields[data].editor = "combo";
                        dataFields[data].sort = "text";
                        dataFields[data].collection = [
                            {id:1, value: "Да"},
                            {id:2, value: "Нет"}
                        ];
                    }catch (err){
                        setFunctionError(err,"content","createTableCols => createBoolCol");
                    }
                }


                if (fieldType.includes("reference")){
                    createReferenceCol();
                } else if ( fieldType == "datetime"){
                    createDatetimeCol ();
                } else if ( fieldType == "boolean"){
                    createBoolCol     ();
                } else if ( fieldType == "integer"){
                    createIntegerCol  ();
                } else {
                    createTextCol     ();
                }


                function setIdCol       (){
                    dataFields[data].id = data;
                }

                function setFillCOl     (){
                    dataFields[data].fillspace = true;
                }

                function setHeaderCol   (){
                    dataFields[data].header = dataFields[data]["label"];
              
                }

                // function setHiddenAttr (){
                //     if(dataFields[data].hidden && dataFields[data].hidden == true && !(dataFields[data].visibleCol) ){
                //         dataFields[data].hiddenCustomAttr = true;
                //     }
                // }

                function userPrefsId    (){
                    const setting = webix.storage.local.get("userprefsOtherForm");
                    if(setting && setting.visibleIdOpt=="2"){
                        dataFields[data].hidden = true;
                    }
                }  

            

                function pushColsData(){ 
               
                    try{        
                        if (dataFields[data].label){
                            columnsData.push(dataFields[data]);
                        }
        
                    } catch (err){
                        setFunctionError(err,"content","createTableCols => pushColsData");
                    }
             
                }

            
                setIdCol    ();
                setFillCOl  ();
                setHeaderCol();

                if(dataFields[data].id == "id"){
                    userPrefsId();
                }
               
                pushColsData();
        
            });
            refreshCols(columnsData);


 
        } catch (err){
            setFunctionError(err,"content","createTableCols");
        }


        return columnsData;
    }

   

    function createDetailAction (columnsData){
        let idCol;
        let actionKey;
        let checkAction     = false;

        const dataContent   = STORAGE.fields.content;
        const data          = dataContent[idsParam];
   
        columnsData.forEach(function(field,i){
            if( field.type  == "action" && data.actions[field.id].rtype == "detail"){
                checkAction = true;
                idCol       = i;
                actionKey   = field.id;
            } 
        });
        
        if (actionKey !== undefined){
            const urlFieldAction = data.actions[actionKey].url;
        
            if (checkAction){
                const columns = $$(idCurrTable).config.columns;
                columns.splice(0,0,{ 
                    id      :"action-first"+idCol, 
                    maxWidth:130, 
                    src     :urlFieldAction, 
                    css     :"action-column",
                    label   :"Подробнее",
                    header  :"Подробнее", 
                    template:"<span class='webix_icon wxi-angle-down'></span> "
                });
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
                    view            :"text",
                    placeholder     :dataInputsArray[el].label, 
                    id              : "customInputs"+i,
                    height          :48,
                    labelPosition   :"top",
                    on              : {
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
                const url = "/init/default/api/"+dataInputsArray[el].apiname;
                return new webix.DataCollection({url:{
                    $proxy:true,
                    load: function(){
                        return ( webix.ajax().get(url).then(function (data) {   
                                
                                let dataSrc = data.json().content;
                                let dataOptions=[];
                                let optionElement;

                                function dataTemplate(i,valueElem){
                                   let template = {id:i+1, value:valueElem};
                                   return template;
                                }
                 
                                function createOptions(){
                                    try{
                                        if (dataSrc[0].name !== undefined){
                                            
                                            dataSrc.forEach(function(data, i) {
                                                optionElement = dataTemplate(i,data.name);
                                                dataOptions.push(optionElement);
                                            });
                                        
                                        } else {
                                            dataSrc.forEach(function (data, i) {
                                                optionElement = dataTemplate(i,data);
                                                dataOptions.push(optionElement);
                                            });
        
                                        }
                                   
                                    } catch (err){
                                        setFunctionError(err,"content","generateCustomInputs => getOptionData")
                                    } 
                                }
                                createOptions();
                                return dataOptions;
                                }).catch(err => {
                                    console.log(err);
                                    setAjaxError(err, "content","generateCustomInputs => getOptionData");
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
                };
            }
    
            function createDeleteAction (i){
                let countCols = $$(idCurrTable).getColumns().length;
                let columns = $$(idCurrTable).config.columns;
   
                try{
                    columns.splice(countCols,0,{ 
                        id:"action"+i, 
                        header:"Действие",
                        label:"Действие",
                        css:"action-column",
                        maxWidth:100, 
                        template:"{common.trashIcon()}"
                    });
        
                    $$(idCurrTable).refreshColumns();
                } catch (err){
                    setFunctionError(err,"content","generateCustomInputs => createDeleteAction")
                } 

            }

            function getInputsId        (element){
                let parent = element.getParentView();
                let childs = parent.getChildViews();
                let idElements = [];
                try{
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
                } catch (err){
                    setFunctionError(err,"content","generateCustomInputs => getInputsId");
                } 
                return idElements;
            }
    
            function createDeleteBtn    (el,findAction,i){
                return {   
                    view:"button", 
                    id:"customBtnDel"+i,
                    css:"webix_danger", 
                    type:"icon", 
                    disabled:true,
                    icon:"icon-trash",
                    inputWidth:55,
                    inputHeight:35,
                  ///  height:35,
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
                    inputHeight:35,
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
                            $$("customBtn"+i).disable();
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
                    on: {
                        onAfterRender: function () {
                            this.getInputNode().setAttribute("title",dataInputsArray[el].comment);

                            const parent = this.getParentView()
                            const childs = parent.getChildViews()

                            childs.forEach(function(el,i){
                                if (el.config.id.includes("customBtn")){
                                    el.disable();
                                }
                            });
                        },
                        onBeforeFileAdd:function(){
                            const loadEl = $$("templateLoad");
                            if (loadEl){
                                loadEl.getParentView().removeView(loadEl);
                            }
                        },
                        onAfterFileAdd:function(file){
                            const parent = this.getParentView()
                            const childs = parent.getChildViews()

                            childs.forEach(function(el,i){
                                if (el.config.id.includes("customBtn")){
                                    el.enable();
                                }
                            });
                        }

                    }
                };
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
                            try{
                                let inputs = $$("customInputs").getChildViews();
                                inputs.forEach(function(el,i){
                                    if (el.config.view == "button" && !($$(el.config.id).isEnabled())){
                                        $$(el.config.id).enable();
                                    }
                                });
                            } catch (err){
                                setFunctionError(err,"content","generateCustomInputs => createDatepicker onChange");
                            } 
    
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
                            try{
                                let inputs = $$("customInputs").getChildViews();
                                inputs.forEach(function(el,i){
                                    if (el.config.view == "button" && !($$(el.config.id).isEnabled())){
                                        $$(el.config.id).enable();
                                    }
                                });
                            } catch (err){
                                setFunctionError(err,"content","generateCustomInputs => createCheckbox onChange");
                            } 
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
      
                let inpObj = {
                    id:"customInputs",
                    css:"webix_custom-inp", 
                    rows:[
                        {height:20},
                        {rows:customInputs}
                    ],
                    width:350,
                };

           
                function addInputs(){
                   
                    try{
                        $$("viewToolsContainer").addView( inpObj,0);
                  
                    } catch (err){
                        setFunctionError(err,"content","adaptiveCustomInputs => addInputs");
                    } 
                }
                addInputs();

            }

            function removeContextBtn(){
                try{
                    if ($$("contextActionsBtn")){
                        $$(filterBar.config.id).removeView($$("contextActionsBtn"));
                    }
                } catch (err){
                    setFunctionError(err,"content","adaptiveCustomInputs => removeContextBtn");
                } 
            }
            removeContextBtn();
           // const tools = $$("viewTools");
           const tools = $$("formsTools");
           
            function viewToolsBtnClick(){
                const btnClass          = document.querySelector(".webix_btn-filter");
                const primaryBtnClass   = "webix-transparent-btn--primary";
                const secondaryBtnClass = "webix-transparent-btn";
                const formResizer       = $$("formsTools-resizer");
                const formsTools        = $$("viewTools");
                function toolMinAdaptive(){
                    hideElem($$("formsContainer"));
                    hideElem($$("tree"));
                    showElem($$("table-backFormsBtnFilter"));
                    hideElem(formResizer);
                    tools.config.width = window.innerWidth-45;
                    tools.resize();
                }
            

                function toolMaxAdaptive(){
                  
                    if         (btnClass.classList.contains(primaryBtnClass)){

                        btnClass.classList.add(secondaryBtnClass);
                        btnClass.classList.remove(primaryBtnClass);
                        hideElem(tools);
                        hideElem(formResizer);
                        

                    } else if (btnClass.classList.contains(secondaryBtnClass)){

                        btnClass.classList.add(primaryBtnClass);
                        btnClass.classList.remove(secondaryBtnClass);
                        showElem(tools);
                        showElem(formResizer);
                        showElem(formsTools);
                    }
                }
      
                hideElem($$("propTableView"));
                const contaierWidth = $$("formsContainer").$width;
         
                toolMaxAdaptive();
                if(!(btnClass.classList.contains(secondaryBtnClass))){
                    if (contaierWidth < 850  ){
                        hideElem($$("tree"));
                        if (contaierWidth  < 850 ){
                            toolMinAdaptive();
                        }
                    } else {
                    hideElem($$("table-backFormsBtnFilter"));
                    tools.config.width = 350;
                    tools.resize();
                    }
                    showElem(formResizer);
                } else {
                    hideElem(tools);
                    hideElem(formResizer);
                    hideElem($$("table-backFormsBtnFilter"));
                    showElem($$("formsContainer"));
                }

            }

            
            if (data.inputs){  
                let customInputs;
           
                customInputs = generateCustomInputs ();
            
                const filterBar = $$("table-view-filterId").getParentView();
                const btnTools = 
                {   view:"button",
                    width: 50, 
                    type:"icon",
                    id:"viewToolsBtn",
                    icon:"icon-filter",
                    css:"webix_btn-filter webix-transparent-btn",
                    title:"текст",
                    height:42,
                    click:function(){
                        viewToolsBtnClick();
                    },
                    on: {
                        onAfterRender: function () {
                            this.getInputNode().setAttribute("title","Показать/скрыть доступные дейсвтия");
                        }
                    } 
                };
                
                if( !$$("viewToolsBtn") ){
                    filterBar.addView(btnTools,2);
                } else {
                    showElem(  $$("viewToolsBtn"));
                }
             

                maxInputsSize (customInputs);

            } else {
              
                hideElem(tools);
                hideElem($$("viewToolsBtn"));
              
            }
        }
        
        adaptiveCustomInputs ();

    }

   
   
    function createTableRows (){
        let dataContent = STORAGE.fields.content;
        let data = dataContent[idsParam];
        
        function getItemData (table){

            function setTableState(){
                try{
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
                } catch (err){
                    setFunctionError(err,"content","createTableRows => setTableState")
                }
            }

            function datePrefs (data){
                let dateFormat;

                const columns = $$(table).getColumns();
                let dateCols = [];

                function searchDateCols (){
                    try{
                        columns.forEach(function(col,i){

                            if (col.type == "datetime"){
                                dateCols.push(col.id);
                            }
                        });
                    } catch (err){
                        setFunctionError(err,"content","createTableRows => searchDateCols")
                    }
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

            function parseRowData (data){
               
                const idCurrView= $$(idCurrTable);
          
                function getUserPrefs(){
      
                    const idCurrView= $$(idCurrTable);
               
                    try{
                        const currFieldTable = idCurrView.config.idTable;
                        const storageData = webix.storage.local.get("visibleColsPrefs_"+currFieldTable);
                    
                        if(storageData){

                            storageData.forEach(function(el){
        
                                if(!el.value){
                                    const colIndex = idCurrView.getColumnIndex(el.id);
                                    if(idCurrView.isColumnVisible(el.id) && colIndex !== -1){
                                        idCurrView.hideColumn(el.id);
                                    }
                                 
                                } else {
                                    if( !( idCurrView.isColumnVisible(el.id) ) ){
                                        idCurrView.showColumn(el.id);
                                    }
                                }

                            });
         
                        }
            
                    } catch (err){
                        setFunctionError(err,"table","onAfterLoad => getUserPrefs");
                    }
                }

                function enableVisibleBtn(){
                    const viewBtn =  $$("table-view-visibleCols");
                    const btn     =  $$("table-visibleCols");
                    
              

                    
                    function disableBtn(el){
                        if (el){
                            el.enable();
                        }
                    }
            
                    if ( viewBtn.isVisible() ){
                        disableBtn(viewBtn);
                    } else if ( btn.isVisible() ){
                        disableBtn(btn);
                    }
                  
                }

                try{
                    if (data.length !== 0){
                        idCurrView.hideOverlay("Ничего не найдено");
                        idCurrView.parse(data);
                    } else {
                        idCurrView.showOverlay("Ничего не найдено");
                        idCurrView.clearAll();
                    }

                    
              
                    getUserPrefs();
                    setTimeout(() => {
                        enableVisibleBtn();
                    }, 1000);
               
                } catch (err){
                    setFunctionError(err,"content","createTableRows => parseRowData");
                }
            }


            function setCounterVal (){
                let prevCountRows ;
                try{
                    prevCountRows = $$(idCurrTable).count();
                    $$(idFindElem).setValues(prevCountRows.toString());
                    if(idCurrTable == "table"){
                        $$("table-findElements").setValues(prevCountRows.toString());
                    }
                } catch (err){
                    setFunctionError(err,"content","createTableRows => setCounterVal");
                }
            }

            function clearTable(){
                $$(table).clearAll();
            }

            $$(table).load({
                $proxy:true,
                load:function(view, params){
                    return webix.ajax().get("/init/default/api/"+itemTreeId,{
                        success:function(text, data, XmlHttpRequest){
                            data = data.json().content;
                            $$(table).config.idTable = itemTreeId;

                            try {
                                clearTable    ();
                                setTableState ();
                                datePrefs     (data);
                                parseRowData  (data);
                                setCounterVal ();
                            
                            } catch (err){
                                setFunctionError(err,"content","getItemData => table load");
                            } 
                    
                        },
                        error:function(text, data, XmlHttpRequest){    
                            function tableErrorState (){
                                let prevCountRows = "-";
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
                              
                                } catch (err){
                                    setFunctionError(err,"content","tableErrorState")

                                }
                            }

                            function notAuthPopup(){

                                const popupHeadline = {   
                                    template:"Вы не авторизованы", 
                                    width:250,
                                    css:"webix_template-not-found", 
                                    borderless:true, 
                                    height:20 
                                };
                                const btnClosePopup = {
                                    view:"button",
                                    id:"buttonClosePopup",
                                    css:"popup_close-btn",
                                    type:"icon",
                                    width:35,
                                   
                                    icon: 'wxi-close',
                                    click:function(){
                                        try{
                                            if ($$("popupNotAuth")){
                                                $$("popupNotAuth").destructor();
                                            }
                                        } catch (err){
                                            setFunctionError(err,"content","notAuthPopup btnClosePopup click");
                                        }
                                    
                                    }
                                };
                
                                const popupSubtitle = {   
                                    template:"Войдите в систему, чтобы продолжить.",
                                    css:"webix_template-not-found-descr", 
                                    borderless:true, 
                                    height:35 
                                };
                
                                const mainBtnPopup = {
                                    view:"button",
                                    css:"webix_btn-go-login",
                                    height:46,
                                    value:"Войти",
                                    click:function(){
                                        function destructPopup(){
                                            try{
                                                if ($$("popupNotAuth")){
                                                    $$("popupNotAuth").destructor();
                                                }
                                            } catch (err){
                                                setFunctionError(err,"content","notAuthPopup destructPopup");
                                            }
                                        }
                                        function navigate(){
                                            try{
                                                Backbone.history.navigate("/", { trigger:true});
                                                window.location.reload();
                                            } catch (err){
                                                setFunctionError(err,"content","notAuthPopup navigate");
                                            }
                                        }
                                        destructPopup();
                                        navigate();
                                     
                                   
                                    }
                                };
                
                                webix.ui({
                                    view:"popup",
                                    id:"popupNotAuth",
                                    css:"webix_popup-prev-href",
                                    width:340,
                                    height:125,
                                    modal:true,
                                    position:"center",
                                    body:{
                                        rows:[
                                        {rows: [ 
                                            { cols:[
                                                popupHeadline,
                                                {},
                                                btnClosePopup,
                                            ]},
                                            popupSubtitle,
                                            mainBtnPopup,
                                            {height:20}
                                        ]}]
                                        
                                    },
                
                                }).show();
                            }

                            tableErrorState ();
  
                            if (XmlHttpRequest.status == 401){
                        
                                if (!($$("popupNotAuth"))){
                                    notAuthPopup();
                                }
                          
                            }
                        }, 
            
                    });
                }
            })
            .finally(function(){
              
                function getUserPrefs(){
      
                    const idCurrView= $$(idCurrTable);
            
                    try{
                        const currFieldTable = idCurrView.config.idTable;
                        const storageData = webix.storage.local.get("visibleColsPrefs_"+currFieldTable);
                    
                        if(storageData){
                            storageData.forEach(function(el){
                                if(!el.value ){
                                    if(idCurrView.isColumnVisible(el.id)){
                                        idCurrView.hideColumn(el.id);
                                    }
                                 
                                } else {
                                    if( !( idCurrView.isColumnVisible(el.id) ) ){
                                        idCurrView.showColumn(el.id);
                                    }
                                }
                            });
                        }
            
                    } catch (err){
                        setFunctionError(err,"table","onAfterLoad => getUserPrefs");
                    }
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

    getValsTable ();
   
    if (titem == undefined) {
        setLogValue("error","Данные не найдены");
    } else {
        preparationTable ();
        generateTable ();
    } 

}



function getInfoDashboard (idsParam,single=false){
    let itemTreeId;

    if (idsParam){
        itemTreeId = idsParam;
    } else if ($$("tree").getSelectedItem()){
        itemTreeId = $$("tree").getSelectedItem().id;
    }

    function removeScroll(){
        try{
            let elem = $$("dashBodyScroll");
            let parent;
            if (elem){
                parent = elem.getParentView();
                if (elem){
                    parent.removeView(elem);
                }
            }
        } catch (err){  
            setFunctionError(err,"content","getInfoDashboard => removeScroll");
        }
    }
  
    function getAjax(url,inputsArray, action=false) {
        const getData =  webix.ajax().get(url);
        
        getData.then(function(data){

            let dashLayout=[{type:"wide",rows:[]}];
            let dataCharts = data.json().charts;
            let titleTemplate = {};

            function removeItems(){
                let element;
                let parent;

                function setVars(elem){
                    try{
                        if (elem){
                            element = elem;
                            parent = element.getParentView();
                            
                            try{
                                if (element){
                                    parent.removeView(element);
                                } 
                            } catch (err){
                                setFunctionError(err,"content","getAjax => setVars");
                            } 
                        }
                    } catch (err){  
                        setFunctionError(err,"content","getInfoDashboard => setVars");
                    }
                }

                setVars($$("dashboardInfoContainerInner"));
                setVars($$("dash-template"));
                setVars($$("dashboard-tool-main"));
                setVars($$("dashboard-tool-adaptive"));
             
            }


            removeScroll();
            
            if (!action){ //не с помощью кнопки фильтра
                removeItems ();
            }

            function addErrorView(){
                try{
                    $$("dashboardTool").addView({
                        view:"scrollview",
                        id:"dashboard-tool-main",
                        borderless:true,
                        css:{"margin":"20px!important","height":"50px!important"},
                        body: {
                            view:"flexlayout",
                            padding:20,
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
                    

                    const charts =  {
                        id:"dashboard-charts",
                        borderless:true,
                        body: {
                            view:"flexlayout",
                            rows:[]
                        }
                    };

                    $$("dashboardInfoContainer").addView(
                        {
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
                        }
                    );
                } catch (err){  
                    setFunctionError(err,"content","getInfoDashboard => addErrorView");
                }
                
            }

            function addSuccessView(){
                function createCharts(){
                    try{
                        dataCharts.forEach(function(el,i){
                            titleTemplate = el.title;
                            delete el.title;
                            el.borderless = true;
                            el.minWidth = 250;
                        
                            dashLayout[0].rows.push({
                                css:"webix_dash-chart-headline",
                                rows:[ 
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
                    } catch (err){  
                        setFunctionError(err,"content","getInfoDashboard => createCharts");
                    }
                }

                async function setTableName() {
                    try{
                        if (!STORAGE.tableNames){
                            await getData("fields"); 
                        }

                        if (STORAGE.tableNames){
                            STORAGE.tableNames.forEach(function(el,i){
                                if (el.id == itemTreeId){
                                    $$("dash-template").setValues(el.name.toString());
                                }
                            });
                        }
                    } catch (err){  
                        setFunctionError(err,"content","getInfoDashboard => setTableName");
                    }
                }

                function createSpace(){
                    function backBtnClick (){
                        const dashTool = $$("dashboard-tool-main");

                        hideElem(dashTool);
                        showElem($$("dashboardInfoContainer"));
                    }

                    function createMainView(){

                        const headline = {  
                            template:"Фильтр",height:30, 
                            css:"webix_dash-filter-headline",
                            borderless:true
                        };

                        
                        const filterBackBtn = { 
                            view:"button", 
                            id:"dash-backDashBtn",
                            type:"icon",
                            icon:"icon-arrow-right",
                            value:"Вернуться к дашбордам",
                            hidden:true,  
                            height:15,
                            hotkey: "esc",
                            minWidth:50,
                            width:55,
                            
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
                            id:"dashboard-tool-main",
                            padding:20,
                            hidden:true,
                            minWidth:250,
                            rows:[
                                {   id:"dashboardToolHeadContainer",
                                    cols:[
                                        headline,
                                        filterBackBtn,
                                    ]
                                },
                                
                                { rows:inputsArray}
                            ], 
                        };

                        try{
                            $$("dashboardTool").addView( mainView );
                        } catch (err){  
                            setFunctionError(err,"content","getInfoDashboard => createMainView");
                        }
                    }

                    createMainView();
          
                  
                    function createFilterBtn(){
                
                        function filterBtnClick (){
                            const dashTool = $$("dashboard-tool-main");

                            function filterMinAdaptive(){
                               /// hideElem($$("tableContainer"));
                                hideElem($$("tree"));
                                hideElem($$("dashboardInfoContainer"));

                                showElem(dashTool);
                                showElem($$("dash-backDashBtn"));
                            
                                dashTool.config.width = window.innerWidth-45;
                                dashTool.resize();
                            }

                            function filterMaxAdaptive(){
                                if (dashTool.isVisible()){
                                    hideElem(dashTool);
                                } else {
                                    showElem(dashTool);
                                }
                              
                              
                            }
                       
                            filterMaxAdaptive();
                            if ($$("dashboardContainer").$width < 850){
                           
                                hideElem($$("tree"));
                                if ($$("dashboardContainer").$width  < 850 ){
                                    filterMinAdaptive();
                                }
                            } else {
                                hideElem($$("dash-backDashBtn"));
                                if (dashTool.config.width !== 350){
                                    dashTool.config.width = 350;
                                    dashTool.resize();
                                }
                            }


                        }

                        const filterBtn = {
                            view:"button", 
                            id:"dashFilterBtn", 
                            css:"webix-transparent-btn",
                            type:"icon",
                            icon:"icon-filter",
                            width:50,
                            click:function(){
                                filterBtnClick();
                            },
                            on:{
                                onAfterRender: function () {
                                    this.getInputNode().setAttribute("title","Показать/скрыть фильтры");
                                },
                            }
                        
                            
                        };
                
                        const container     = $$("dash-template").getParentView();
                        const containerView = $$(container.config.id);
                         
                        if (!$$("dashFilterBtn")){
                            containerView.addView(
                                
                                {   id:"dashboard-tool-btn",
                                    cols:[
                                        filterBtn
                                    ]
                                }
                            ,2);
                        }
                      
                    }

                    function createDashInfo(){
                        const template = setHeadlineBlock("dash-template");
                 
                       
                        const dashCharts = {
                            id:"dashboard-charts",
                            view:"flexlayout",
                            css:"webix_dash-charts-flex",
                            rows:dashLayout,
                        };

                        const content = {
                            view:"scrollview", 
                            scroll:"y",
                            id:"dashBodyScroll",
                            borderless:true, 
                            body:{
                                id:"dashboardBody",
                                css:"dashboardBody",
                                cols:[
                                    dashCharts
                                ]
                            }
                        };

                        try{

                            $$("dashboardInfoContainer").addView(
                                {   id:"dashboardInfoContainerInner",
                                    rows:[
                                        template,
                                        content
                                    ]
                                }
                            );
                        } catch (err){  
                            setFunctionError(err,"content","getInfoDashboard => createDashInfo");
                        } 

                        setTableName();
                            
                    }
                    createDashInfo();

                    createFilterBtn()
                }

                function updateDash(){
                    const dashCharts =  {
                        id:"dashboard-charts",
                        view:"flexlayout",
                        css:"webix_dash-charts-flex",
                        rows:dashLayout,
                    };

                    try{
                        $$("dashboardInfoContainerInner").addView(
                            {
                                view:"scrollview", 
                                scroll:"y",
                                id:"dashBodyScroll",
                                borderless:true, 
                                body:{
                                    id:"dashboardBody",
                                    css:"dashboardBody",
                                    cols:[
                                        dashCharts
                                    ]
                                }
                            }
                
                        );
                    } catch (err){  
                        setFunctionError(err,"content","getInfoDashboard => updateDash");
                    }
                }
                
                createCharts();

                if (!action){
                    createSpace();
                } else {
                    updateDash();
                }
                
            }

           
            if (dataCharts == undefined){
                addErrorView();
                setLogValue("error","Ошибка при загрузке данных");
            } else {
                addSuccessView();
            }

            function setScrollHeight(){
                try{
                    if ($$("webix_log-btn").config.icon =="icon-eye"){
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
                } catch (err){  
                    setFunctionError(err,"content","getInfoDashboard => setScrollHeight");
                }
            }

            setScrollHeight();

            if (url.includes("?")||url.includes("sdt")&&url.includes("edt")){
                setLogValue("success", "Данные обновлены");
            } 
          
        });
       
        getData.fail(function(err){
            setAjaxError(err, "content","getInfoDashboard => getAjax");
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

                    function clickBtn(){
                        let dateArray = [];
                        let getUrl;
                        let compareDates=[];
                        let postFormatData = webix.Date.dateToStr("%d.%m.%y");
                        let postformatTime = webix.Date.dateToStr("%H:%i:%s");
                    
                        let sdtDate = "";
                        let edtDate = "";

                        let validateEmpty = true;

                        function getDataInputs(){
                            function enumerationElements(el){
                                try{
                                    $$(el.id).getChildViews().forEach(function(elem,i){

                                        function createTime(type){
                                            if ($$(elem.config.id).getValue()!==null){
                                                let value = $$(elem.config.id).getValue();
                                                if (type == "sdt"){
                                                    sdtDate=sdtDate.concat(" "+postformatTime(value));
                                                } else if (type == "edt"){
                                                    edtDate=edtDate.concat(" "+postformatTime(value));
                                                }
                                        
                                            } else {
                                                validateEmpty=false;
                                            }
                                        }

                                        function createDate(type){
                                            if ($$(elem.config.id).getValue()!==null){
                                                let value = $$(elem.config.id).getValue();

                                                if (type == "sdt"){
                                                    sdtDate = postFormatData(value); 
                                                } else if ( type ==  "edt"){
                                                    edtDate = postFormatData(value);
                                                }
                                            
                                            } else {
                                                validateEmpty=false;
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
                                } catch (err){  
                                    setFunctionError(err,"content","getInfoDashboard => enumerationElements");
                                }
                            }

                            function setInputs(){
                                try{
                                    inputsArray.forEach(function(el,i){
                                        if (el.id.includes("container")){
                                            enumerationElements(el);
                                        }
                                    });
                                } catch (err){  
                                    setFunctionError(err,"content","getInfoDashboard => setInputs");
                                }
                            }

                            function createQuery(){
                                dateArray.push("sdt"+"="+sdtDate);
                                dateArray.push("edt"+"="+edtDate);
                             
                                compareDates.push(sdtDate); 
                                compareDates.push(edtDate);
                            }

                            setInputs();
                            createQuery();
                        }

                        function sentQuery (){

                            function removeCharts(){
                                try{
                                    let charts = $$("dashboard-charts");
                                    if (charts){
                                        $$("dashboardBody").removeView(charts);
                                    }
                                } catch (err){  
                                    setFunctionError(err,"content","getInfoDashboard => removeCharts");
                                }
                            }

                            function setStateBtn(){
                                try{
                                    $$("dashBtn"+i).disable();
                                    setInterval(function () {
                                        $$("dashBtn"+i).enable();
                                    }, 1000);
                                } catch (err){  
                                    setFunctionError(err,"content","getInfoDashboard => setStateBtn");
                                }
                            }

                            if (validateEmpty){

                                let compareFormatData = webix.Date.dateToStr("%Y/%m/%d %H:%i:%s");
                                let dateStart = compareFormatData(compareDates[0]);
                                let dateEnd = compareFormatData(compareDates[1]);
                                
                                if (!(webix.filters.date.greater(dateStart,dateEnd)) ||
                                    compareDates[0]==compareDates[1]                 ){  
                                    getUrl = findAction.url+"?"+dateArray.join("&");
                                    removeCharts();
                                    getAjax(getUrl, inputsArray, true);
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
                                clickBtn();
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

                    return  btnFilter;
                }

                function createFilter (el){
             
                    Object.values(inputs).forEach(function(input,i){
                        function createInputs(){
                            try{
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
                            } catch (err){  
                                setFunctionError(err,"content","getInfoDashboard => createInputs");
                            }
                        }

                        if (input.type == "datetime"&& input.order == 3){ //------------------ order
                            let key = Object.keys(inputs)[i]; // заменены на sdt и edt
                            createInputs();
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
                    try{
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

                    } catch (err){  
                        setFunctionError(err,"content","getInfoDashboard => autorefresh");
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

    removeScroll();

    if(!($$("dashBodyScroll"))){
        getFieldsData ();
    }  
    
}


function getInfoEditTree() {
    const treeEdit = $$("treeEdit");
    
    treeEdit.clearAll();

    const url = "/init/default/api/"+"trees";
    
    const getData = webix.ajax().get(url);
    
    getData.then(function(data){

        data = data.json().content;
        data[0].pid = 0;
        

        let map = {}, 
            treeStruct = [],
            treeData = []
        ;

        function pushTreeData(){
            try{
                data.forEach(function(el,i){
                    if (el.pid == 0){
                        treeData.push({id:el.id, open:true, value:el.name, pid:el.pid, data:[]});
                    } else {
                        treeData.push({id:el.id, value:el.name, pid:el.pid, data:[]});
                    }
                });
            } catch (err) {
                setFunctionError(err,"content","pushTreeData")
            }
        }

        function createStruct(){
            try{
                treeData.forEach(function(el,i){

                    map[el.id] = i; 

                    if (el.pid !== 0 && el.pid !== el.id && el.pid!==null) {
                        treeData[map[el.pid]].data.push(el);
                    } else {
                        treeStruct.push(el);
                    }
                });
            } catch (err) {
                setFunctionError(err,"content","createStruct")
            }
        }

        pushTreeData();
        createStruct();

        treeEdit.parse(treeStruct);

    });

    getData.fail(function(err){
        setAjaxError(err, "content","getInfoEditTree");
    });

  
}


export {
    submitBtn,
    getComboOptions,
    getInfoTable,
    getInfoDashboard,
    getInfoEditTree,
};
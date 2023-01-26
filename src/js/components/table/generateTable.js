
///////////////////////////////
//
// Подготовка таблицы и загрузка                            (create table)
//
// Создание динамических колонок с действиями               (create detail action)
//
// Создание колонок                                         (create columns)
//
// Определение размера колонок                              (create column width)
//
// Динамические кнопки                                      (create dynamic buttons)
//
// Динамические инпуты                                      (create inputs)
//
// Область с динамическими элементами                       (create dynamic layout)
//
// Автообновление данных в таблице                          (create autorefresh)
//
// Загрузка таблицы                                         (create rows)
//
// Форматирование колонок с датой                           (create formatting date)
//
// Загрузка постов с сервера                                (create posts data)
//
// Дефолтные значения у пустых строк                        (create default values)
//
// Возвращение утерянного состояния сортировки              (create sort data)
//
// Возвр. утерянного состояния фильтров                     (create lost filter)
//
// Возвр. утерянного состояния редактора постов             (create lost data)
//
// Переход в таблицу после action дашборда с фильтром       (create dashboard context)
//
// Выделение поста в таблице по параметру в ссылке          (create context space)
//
// Copyright (c) 2022 CA Expert
//
///////////////////////////////

import { setLogValue }                      from '../logBlock.js';
import { LoadServerData, GetFields }        from "../../blocks/globalStorage.js";

import { setFunctionError, setAjaxError }   from "../../blocks/errors.js";

import { Action, isArray, 
        getTable, getComboOptions }         from '../../blocks/commonFunctions.js';

import { ServerData }                       from "../../blocks/getServerData.js"
import { Button }                           from '../../viewTemplates/buttons.js';

import { returnDefaultValue }               from './editForm.js';

import { Filter }                           from "./filter.js";
import { createWorkspace }                  from "./filter.js";
import { mediator }                         from "../../blocks/_mediator.js";
import { createChildFields }                from "./filter.js";


const logNameFile = "table/generateTable";

let table; 

//create table
let titem;
let idsParam;
let idCurrTable;

function setTableName(idCurrTable, idsParam) {
  
    try{
        const names = GetFields.names;

        if (isArray(names, logNameFile, "setTableName")){

            names.forEach(function(el){
                if (el.id == idsParam){  
                    const template  = $$(idCurrTable + "-templateHeadline");
                    const value     = el.name.toString();
                    template.setValues(value);
                }
            });
        }
 

        
    } catch (err){  
        setFunctionError(err, logNameFile, "setTableName");
    }
} 


function getValsTable (){
    titem     = $$("tree").getItem(idsParam);

    if (!titem){
        titem = idsParam;
    }
}


function preparationTable (){
    try{
        $$(idCurrTable).clearAll();

        if (idCurrTable == "table-view"){
            const popup       = $$("contextActionsPopup");
            
            if (popup){
                popup.destructor();
            }

            Action.removeItem($$("contextActionsBtnAdaptive"));
            Action.removeItem($$("customInputs"             ));
            Action.removeItem($$("customInputsMain"         ));

        
        }
    } catch (err){  
        setFunctionError(err, logNameFile, "preparationTable");
    }
}

async function loadFields(){
    await LoadServerData.content("fields");
    return GetFields.keys;
}

async function generateTable (showExists){ 
 
    let keys;
    
    if (!showExists){
        keys = await loadFields();
    } 
    
    if (!keys && showExists){ // if tab is clicked but dont have fields
        keys = await loadFields();
    }
 
    if (keys){
        const columnsData = createTableCols (idsParam, idCurrTable);
  
        createDetailAction  (columnsData, idsParam, idCurrTable);

        createDynamicElems  (idCurrTable, idsParam);

        createTableRows     (idCurrTable, idsParam);
  
        setTableName        (idCurrTable, idsParam);

    }
   
} 


function createTable (id, ids, showExists) {
 
    idCurrTable = id;
    idsParam    = ids;

    getValsTable ();
   
    if (titem == undefined) {
        setLogValue("error","Данные не найдены");
    } else {
        preparationTable ();
        generateTable (showExists);
    } 

 

}




//create detail action
function createDetailAction (columnsData, idsParam, idCurrTable){
    let idCol;
    let actionKey;
    let checkAction     = false;

    const data          = GetFields.item(idsParam);
    const table         = $$(idCurrTable);
    if (isArray(columnsData, "table/createSpace/cols/detailAction", "createDetailAction")){
        columnsData.forEach(function(field, i){
            if( field.type  == "action" && data.actions[field.id].rtype == "detail"){
                checkAction = true;
                idCol       = i;
                actionKey   = field.id;
            } 
        });
    }

    
    if (actionKey !== undefined){
        const urlFieldAction = data.actions[actionKey].url;
    
        if (checkAction){
            const columns = table.config.columns;
            columns.splice(0, 0, { 
                id      : "action-first" + idCol, 
                maxWidth: 130, 
                src     : urlFieldAction, 
                css     : "action-column",
                label   : "Подробнее",
                header  : "Подробнее", 
                template: "<span class='webix_icon wxi-angle-down'></span> "
            });

            table.refreshColumns();
        }
    }


}


//create columns


let field;

function refreshCols(columnsData){
 
    if(table){
        table.refreshColumns(columnsData);
    }
}


function createReferenceCol (){
    try{
        
        const findTableId= field.type.slice(10);
        field.editor     = "combo";
        field.sort       = "int";
        field.collection = getComboOptions (findTableId);
        field.template   = function(obj, common, val, config){
            const itemId = obj[config.id];
            const item   = config.collection.getItem(itemId);
            return item ? item.value : "";
        };
 
    }catch (err){
        setFunctionError(
            err, 
            logNameFile, 
            "createReferenceCol"
        );
    }
}

function createDatetimeCol  (){
    try{
        field.format = 
        webix.Date.dateToStr("%d.%m.%Y %H:%i:%s");
        field.editor = "date";
        field.sort   = "date";
        field.css    = {"text-align":"right"};
    }catch (err){
        setFunctionError(
            err, 
            logNameFile, 
            "createDatetimeCol"
        );
    }
}

function createTextCol      (){
    try{
        field.editor = "text";
        field.sort   = "string";
 
    }catch (err){
        setFunctionError(
            err,
            logNameFile,
            "createTextCol"
        );
    }
}

function createIntegerCol   (){
    
    try{
        field.editor         = "text";
        field.sort           = "int";
        field.numberFormat   = "1 111";
        field.css            = {"text-align":"right"};
        
    }catch (err){
        setFunctionError(
            err,
            logNameFile,
            "createIntegerCol"
        );
    }
}
function createBoolCol      (){
    try{
        field.editor     = "combo";
        field.sort       = "text";
        field.collection = [
            {id : 1, value : "Да" },
            {id : 2, value : "Нет"}
        ];
    }catch (err){
        setFunctionError(
            err,
            logNameFile,
            "createBoolCol"
        );
    }
}

function setIdCol       (data){
    field.id = data;
}

function setFillCol     (dataFields){
    const values      = Object.values(dataFields);
    const length      = values.length;
    const scrollWidth = 17;
    const containerWidth = $$("tableContainer").$width;
    const tableWidth  = containerWidth - scrollWidth;
    const colWidth    = tableWidth / length;

    field.width  = colWidth;
}


function setHeaderCol   (){

   // field.header = field["label"] + `<span class="webix_icon wxi-angle-right "> </span>` 
    field.header = field["label"];
}

function userPrefsId    (){
    const setting = 
    webix.storage.local.get("userprefsOtherForm");

    if( setting && setting.visibleIdOpt == "2" ){
        field.hidden = true;
    }
}  


function createField(type){

    if (type.includes("reference")){
        createReferenceCol();

    } else if ( type == "datetime"){
        createDatetimeCol ();

    } else if ( type == "boolean"){
        createBoolCol     ();

    } else if ( type == "integer" || 
                type == "id")
    {
        createIntegerCol  ();

    } else {
        createTextCol     ();
    }   
}


function createTableCols (idsParam, idCurrTable){
 
    const data          = GetFields.item(idsParam);
    const dataFields    = data.fields;
    const colsName      = Object.keys(data.fields);

  
    const columnsData   = [];
    
    table = $$(idCurrTable);

    if (colsName.length){
        colsName.forEach(function(data) {
            field = dataFields[data]; 
         
            createField(field.type);

            setIdCol    (data);
            setFillCol  (dataFields);
            setHeaderCol();
            
            if(field.id == "id"){
                userPrefsId();
            }
      
            if (field.label){
                columnsData.push(field);
            }

        });

        
        refreshCols(columnsData);
        setUserPrefs(table, idsParam); 
    } else {
        setFunctionError(
            "array length is null",
            logNameFile,
            "createTableCols"
        );
    }
          

    return columnsData;
}



// create column width


let storageData;


function setColsUserSize(){
    const sumWidth = [];
    if (isArray(storageData, logNameFile, "setColsUserSize")){
        storageData.values.forEach(function (el){
            sumWidth.push(el.width);
            table.setColumnWidth(el.column, el.width);
        }); 
    
    }
  
    return sumWidth;  
}

function returnSumWidth(){
    let sumWidth;

    if ( storageData && storageData.values.length ){
        sumWidth = setColsUserSize();  
    }

    return sumWidth;
}

function returnCountCols(){
    let countCols;

    if(storageData && storageData.values.length){
        countCols  =  storageData.values.length;
 
    } else {
        const cols = table.getColumns(true);
        countCols  = cols .length;
    }

    return countCols;
}

function returnContainerWidth(){
    let containerWidth;

    containerWidth = window.innerWidth - $$("tree").$width - 25;

    return containerWidth;
}

function setColsSize(col){
    const countCols      = returnCountCols();
    const containerWidth = returnContainerWidth();

    const tableWidth     = containerWidth - 17;  
    const colWidth       = tableWidth / countCols;


    table.setColumnWidth(col, colWidth);
}


function findUniqueCols(col){
    let result = false;
  
    if (isArray(storageData, logNameFile, "findUniqueCols")){
        storageData.values.forEach(function(el){

            if (el.column == col){
                result = true;
            }
    
        });
    }
  
    return result;
}


function getSumStorageColumns(){
    const sumWidth       = returnSumWidth();
    return sumWidth.reduce((a, b) => +a + +b, 0);
}

function getContainerWidth(){
    const tableWidth  = $$("tree").$width;
    const screenWidth = window.innerWidth;
    return screenWidth - tableWidth;
}

function getLastColumn(){
    const cols       = table.getColumns();
    const lastColId  = cols.length - 1;
    return cols[lastColId];
}


function setWidthLastCol(){
    const reduce         = getSumStorageColumns();
    const containerWidth = getContainerWidth();  

    if (reduce < containerWidth){
        const lastCol    = getLastColumn();
        const difference = containerWidth - reduce;
        const oldWidth   = lastCol.width;
        const newWidth   = oldWidth + difference;

        table.setColumnWidth(lastCol.id, newWidth);
        
    }

}



function setVisibleCols(allCols){

    if (isArray(allCols, logNameFile, "setVisibleCols")){
        allCols.forEach(function(el,i){

            if (findUniqueCols(el.id)){
                if( !( table.isColumnVisible(el.id) ) ){
                    table.showColumn(el.id);
                }
            } else {
                const colIndex = table.getColumnIndex(el.id);
                if(table.isColumnVisible(el.id) && colIndex !== -1){
                    table.hideColumn(el.id);
                }
            }
                
        });
    }
  
}


function setPositionCols(){
   
    if (isArray(storageData, logNameFile, "setPositionCols")){
        storageData.values.forEach(function(el){
       
            table.moveColumn(el.column,el.position);
                
        });
    }
   
} 

function setUserPrefs(idTable, ids){
    table       = idTable;

    const prefsName = `fields/${ids}`;

    storageData   = webix.storage.local.get(prefsName);
     
    if (storageData){
        storageData = storageData.columns;
    }
    
    const allCols = table.getColumns       (true);
 
 
    if( storageData && storageData.values.length ){
        setVisibleCols (allCols);
        setPositionCols();
        setWidthLastCol();

    } else {   
   
        if (isArray(allCols, logNameFile, "setUserPrefs")){
            allCols.forEach(function(el){
                setColsSize(el.id);  
            });
        }
      
       
    }

    
}



//create dynamic buttons

let idElements;
let url;
let verb;
let rtype;

const valuesArray = [];

function createQueryRefresh(){

    if (isArray(idElements, logNameFile, "createQueryRefresh")){
        idElements.forEach((el) => {
            const val = $$(el.id).getValue();
            
            if (el.id.includes("customCombo")){
                const textVal = $$(el.id).getText();

                valuesArray.push (el.name + "=" + textVal);

            } else if ( el.id.includes("customInputs")     || 
                        el.id.includes("customDatepicker") )
            {
                valuesArray.push ( el.name + "=" + val );

            }   
        });
    }
    
   
}

function setTableLoadState(tableView, data){
    const noneMsg = "Ничего не найдено";
    try{
        tableView.clearAll();
  
        if (data.length !== 0){
            tableView.hideOverlay(noneMsg);
            tableView.parse(data);
            setLogValue("success", "Данные обновлены");

        } else {
            tableView.showOverlay(noneMsg);

        }
    } catch (err){  
        setFunctionError(
            err,
            logNameFile,
            "setTableLoadState"
        );
    }
}

function setTableCounter(tableView){
    try{
        const count = {full : tableView.count()};
    
        const findElementView = $$("table-view-findElements");
        const prevCountRows   = JSON.stringify(count);

        findElementView.setValues(prevCountRows);
    } catch (err){  
        setFunctionError(
            err, 
            logNameFile, 
            "setTableCounter"
        );
    }
}

function refreshButton(){
    createQueryRefresh();
    
    new ServerData({
        
        id           : `${url}?${valuesArray.join("&")}`,
        isFullPath   : true,
    
    }).get().then(function(data){

        if (data){

            const content = data.content;

            if (content){

                const tableView = $$("table-view");
              
                setTableLoadState   (tableView, content);
                setTableCounter (tableView);
            }
        }
        
    });

}

function downloadButton(){

    webix.ajax().response("blob").get(url, function(text, blob, xhr) {
        try {
            webix.html.download(blob, "table.docx");
        } catch (err){
            setFunctionError(
                err, 
                logNameFile, 
                "downloadButton"
            );
        } 
    }).catch(err => {
        setAjaxError(
            err, 
            logNameFile, 
            "downloadButton"
        );
    });
}


async function uploadData(formData, link){
    fetch(link, {
        method  : "POST", 
        body    : formData
    })  

    .then(( response ) => response.json())
    .then(function( data ){
        const loadEl = $$("templateLoad");

        if ( data.err_type == "i" ){
            loadEl.setValues( "Файл загружен" );
            setLogValue(
                "success",
                "Файл успешно загружен"
            );

        } else {
            loadEl.setValues( "Ошибка" );
            setLogValue     ( "error", data.err );
        }
    })
    
    .catch(function(err){
        setFunctionError(
            err, 
            logNameFile, 
            "uploadData"
        );
    });

}

function addLoadEl(container){
    container.addView({
        id:"templateLoad",
        template: function(){
            const value      = $$("templateLoad").getValues();
            const valsLength = Object.keys( value ).length;

            if ( valsLength !==0 ){
                return value;
            } else {
                return "Загрузка ...";
            }
        },
        borderless:true,
    });
}

function postButton(){
    try{
   
        if (isArray(idElements, logNameFile, "postButton")){
            idElements.forEach((el,i) => {
                if (el.id.includes("customUploader")){
                    const tablePull = $$(el.id).files.data.pull;
                    const value     = Object.values(tablePull)[0];
                    const link      = $$(el.id).config.upload;
    
                    let formData = new FormData();  
                    let container = $$(el.id).getParentView();
                    addLoadEl(container);
    
                    formData.append("file", value.file);
    
                    uploadData(formData, link);
                   
                }
            });
        }
        
    } catch (err){  
        setFunctionError(err, logNameFile, "postButton");
    } 
}


function submitBtn (id, path, action, type){

    idElements = id;
    url        = path;
    verb       = action;
    rtype      = type;

    valuesArray.length = 0;

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




// create inputs 


let data; 
let idTableElem;
let inputField; 
let dataInputsArray;


function setAdaptiveWidth(elem){

    const child       = elem.getNode().firstElementChild;
    child.style.width = elem.$width + "px";

    const inp         = elem.getInputNode();
    inp.style.width   = elem.$width - 5 + "px";
}

function returnArrayError(func){
    setFunctionError(
        "array length is null",
        logNameFile,
        func
    );
}
function createTextInput    (i){
    return {   
        view            : "text",
        placeholder     : inputField.label, 
        id              : "customInputs" + i,
        height          : 48,
        labelPosition   : "top",
        on              : {
            onAfterRender: function () {
                this.getInputNode().setAttribute("title", inputField.comment);
                setAdaptiveWidth(this);
            },
            onChange:function(){
                const inputs = $$("customInputs").getChildViews();

                if (inputs.length){
                    inputs.forEach(function(el){
                        const view = el.config.view;
                        const btn  = $$(el.config.id);
    
                        if (view == "button"){
                            Action.enableItem(btn);
                        }
                    });
                } else {
                    returnArrayError("createTextInput");
                }
               

            }
        }
    };
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
    if (isArray(content, logNameFile, "createOptions")){
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

function getOptionData      (){

    return new webix.DataCollection({url:{
        $proxy:true,
        load: function(){
            return ( 
                
                new ServerData({
                    id : inputField.apiname,
                
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

function createSelectInput  (el, i){

    return   {   
        view          : "combo",
        height        : 48,
        id            : "customCombo" + i,
        placeholder   : inputField.label, 
        labelPosition : "top", 
        options       : {
            data : getOptionData ( dataInputsArray, el )
        },
        on: {
            onAfterRender: function () {
                this.getInputNode()
                .setAttribute( "title", inputField.comment );
                setAdaptiveWidth(this);
            },
        }               
    };
}

function createDeleteAction (i){
    const table     = $$(idTableElem);
    const countCols = table.getColumns().length;
    const columns   = table.config.columns;

    try{
        columns.splice (countCols, 0 ,{ 
            id      : "action"+i, 
            header  : "Действие",
            label   : "Действие",
            css     : "action-column",
            template: "{common.trashIcon()}"
        });

        table.refreshColumns();

    } catch (err){
        setFunctionError(
            err,
            logNameFile,
            "generateCustomInputs => createDeleteAction"
        );
    } 

}
 
function getInputsId        (element){

    const parent     = element.getParentView();
    const childs     = parent .getChildViews();
    const idElements = [];

    if (childs.length){
        childs.forEach((el,i) => {
            const view = el.config.view;
            const id   = el.config.id;
            if ( id !== undefined ){
                if ( view == "text" ){
                    idElements.push({
                        id  : id, 
                        name: "substr"
                    });

                } else if ( view == "combo"){
                    idElements.push({
                        id  : id, 
                        name: "valtype"
                    });
                } else if ( view == "uploader"    || 
                            view == "datepicker"  ){
                    idElements.push({ 
                        id : id 
                    });
                }
            }

        });
    } else {
        returnArrayError("getInputsId");
    }
       
    
    return idElements;
}

function createDeleteBtn    (findAction,i){

    const btn = new Button({

        config   : {
            id       : "customBtnDel" + i,
            hotkey   : "Shift+Q",
            icon     : "icon-trash", 
            value    : inputField.label,
            click    : function () {
                const idElements = getInputsId (this);
                submitBtn( idElements, findAction.url, "delete" );
            },
        },
        titleAttribute : inputField.comment
    
       
    }).minView("delete");

    return btn;
}


function submitClick(findAction, i, id, elem){

    const idElements = getInputsId (elem);
    const btn        =  $$("contextActionsPopup");

    if (findAction.verb== "GET"){
        if ( findAction.rtype == "refresh") {
            submitBtn( 
                idElements, 
                findAction.url, 
                "get", 
                "refresh" 
            );

        } else if (findAction.rtype == "download") {
            submitBtn( 
                idElements, 
                findAction.url, 
                "get", 
                "download"
            );

        }
        
    } else if ( findAction.verb == "POST" ){
        submitBtn( 
            idElements, 
            findAction.url, 
            "post" 
        );
        $$("customBtn" + i ).disable();
    } 
    else if (findAction.verb == "download"){
        submitBtn( 
            idElements, 
            findAction.url, 
            "get", 
            "download", 
            id 
        );

    }
    Action.hideItem(btn);    
}

function createCustomBtn    (findAction, i){

    const btn = new Button({
        
        config   : {
            id       : "customBtn" + i,
            value    : inputField.label,
            click    : function (id) {
                submitClick(findAction, i, id, this);
            },
        },
        titleAttribute : inputField.comment,
        onFunc         : {
            onViewResize:function(){
                setAdaptiveWidth(this);
            }
        }

    
    }).maxView("primary");

    return btn;
}

function createUpload       (i){
    return  {   
        view         : "uploader", 
        value        : "Upload file", 
        id           : "customUploader" + i,
        height       : 42,
        autosend     : false,
        upload       : data.actions.submit.url,
        label        : inputField.label, 
        labelPosition: "top",
        on: {
            onAfterRender: function () {
                this.getInputNode().setAttribute( "title", inputField.comment );
                setAdaptiveWidth(this);
                const parent = this  .getParentView();
                const childs = parent.getChildViews();

                if (childs.length){
                    childs.forEach(function(el,i){
                        if (el.config.id.includes("customBtn")){
                            el.disable();
                        }
                    });
                } else {
                    returnArrayError("createUpload");
                }
               
            },
            onBeforeFileAdd:function(){
                const loadEl = $$("templateLoad");
                if (loadEl){
                    loadEl.getParentView().removeView(loadEl);
                }
            },
            onAfterFileAdd:function(file){
                const parent = this  .getParentView();
                const childs = parent.getChildViews();

                if (childs.length){
                    childs.forEach(function(el){
                        if (el.config.id.includes("customBtn")){
                            el.enable();
                        }
                    });
                } else {
                    returnArrayError("createUpload");
                }
                
            }

        }
    };
}

function createDatepicker   (i){
    return {   
        view         : "datepicker",
        format       : "%d.%m.%Y %H:%i:%s",
        placeholder  : inputField.label,  
        id           :"customDatepicker"+i, 
        timepicker   : true,
        labelPosition:"top",
        height       :48,
        on           : {
            onAfterRender: function () {
                this.getInputNode().setAttribute( "title", inputField.comment );
                setAdaptiveWidth(this);
            },
            onChange:function(){
                try{
                    const inputs = $$("customInputs").getChildViews();

                    if (inputs.length){
                        inputs.forEach(function(el,i){
                            const btn  = $$(el.config.id);
                            const view = el.config.view;
                            if ( view == "button" && !(btn.isEnabled()) ){
                                btn.enable();
                            }
                        });
                    } else {
                        returnArrayError("createDatepicker");
                    }
                  
                } catch (err){
                    setFunctionError(
                        err,
                        logNameFile,
                        "generateCustomInputs => createDatepicker onChange"
                    );
                } 

            }
        }
    };
}

function createCheckbox     (i){
    return {   
        view       : "checkbox", 
        id         : "customСheckbox" + i, 
        css        : "webix_checkbox-style",
        labelRight : inputField.label, 
        on         : {
            onAfterRender: function () {
                this.getInputNode()
                .setAttribute("title", inputField.comment);
            },

            onChange:function(){
                try{
                    const inputs = $$("customInputs").getChildViews();
                    if (inputs.length){
                        inputs.forEach(function(el,i){
                            const view = el.config.view;
                            const btn  = $$(el.config.id);
                            if (view == "button" && !(btn.isEnabled())){
                                btn.enable();
                            }
                        });
                    } else {
                        returnArrayError("createCheckbox");
                    }
                
                } catch (err){
                    setFunctionError(
                        err,
                        logNameFile,
                        "generateCustomInputs => createCheckbox onChange"
                    );
                } 
            }
        }
    };
}

function generateCustomInputs (dataFields, id){  
    idTableElem = id;
    data        = dataFields;  

    dataInputsArray     = data.inputs;

    const customInputs  = [];
    const objInuts      = Object.keys(data.inputs);

    if (objInuts.length){
        objInuts.forEach((el,i) => {
            inputField = dataInputsArray[el];
            if ( inputField.type == "string" ){
                customInputs.push(
                    createTextInput(i)
                );
            } else if ( inputField.type == "apiselect" ) {
               
                customInputs.push(
                    createSelectInput(el, i, dataInputsArray)
                );
    
            } else if ( inputField.type == "submit" || 
                        inputField.type == "button" ){
    
                const actionType = inputField.action;
                const findAction = data.actions[actionType];
            
                if ( findAction.verb == "DELETE" && actionType !== "submit" ){
                    createDeleteAction (i);
                } else if ( findAction.verb == "DELETE" ) {
                    customInputs.push(
                        createDeleteBtn(findAction, i)
                    );
                } else {
                    customInputs.push(
                        createCustomBtn(findAction, i)
                            
                    );
                }
            } else if ( inputField.type == "upload" ){
                customInputs.push(
                    createUpload(i)
                );
            } else if ( inputField.type == "datetime" ){
                customInputs.push(
                    createDatepicker(i)
                );
            }else if ( inputField.type == "checkbox" ){
                customInputs.push(
                    createCheckbox(i)
                );
    
            } 
        });
    
    } else {
        returnArrayError("generateCustomInputs");
    }
   

    return customInputs;
}



// create dynamic layout


let dataFields; 
let idTable;
let ids;

let btnClass;
let formResizer;
let tools;

let secondaryBtnClass = "webix-transparent-btn";
let primaryBtnClass   = "webix-transparent-btn--primary";


function maxInputsSize (customInputs){
   
    Action.removeItem($$("customInputs"));
    const inpObj = {
        id      : "customInputs",
        css     : "webix_custom-inp", 
        rows    : [
            { height : 20 },
            { rows   : customInputs }
        ],
    };

       
    try{
        $$("viewToolsContainer").addView(inpObj, 0);
    
    } catch (err){
        setFunctionError(err, logNameFile, "maxInputsSize");
    } 
    

}

function toolMinAdaptive(){
    Action.hideItem($$("formsContainer"));
    Action.hideItem($$("tree"));
    Action.showItem($$("table-backFormsBtnFilter"));
    Action.hideItem(formResizer);

    const emptySpace = 45;
    
    tools.config.width = window.innerWidth - emptySpace;
    tools.resize();
}


function toolMaxAdaptive(){
    const formsTools = $$("viewTools");

    btnClass = document.querySelector(".webix_btn-filter");
    
    if (btnClass.classList.contains(primaryBtnClass)){

        btnClass.classList.add   (secondaryBtnClass);
        btnClass.classList.remove(primaryBtnClass);
        Action.hideItem(tools);
        Action.hideItem(formResizer);
        

    } else if (btnClass.classList.contains(secondaryBtnClass)){

        btnClass.classList.add   (primaryBtnClass);
        btnClass.classList.remove(secondaryBtnClass);
        Action.showItem(tools);
        Action.showItem(formResizer);
        Action.showItem(formsTools);
    }
}

function setStateTool(){

   
    formResizer         = $$("formsTools-resizer");
    const contaierWidth = $$("container").$width;

    if(!(btnClass.classList.contains(secondaryBtnClass))){
        const minWidth      = 850;
        const toolsMaxWidth = 350;
        
        if (contaierWidth < minWidth  ){
            Action.hideItem($$("tree"));
            if (contaierWidth  < minWidth ){
                toolMinAdaptive();
            }
        } else {
     
            Action.hideItem($$("table-backFormsBtnFilter"));
            tools.config.width = toolsMaxWidth;
            tools.resize();
        }
        Action.showItem(formResizer);

    } else {
        Action.hideItem(tools);
        Action.hideItem(formResizer);
        Action.hideItem($$("table-backFormsBtnFilter"));
        Action.showItem($$("formsContainer"));
    }
}

function viewToolsBtnClick(){

    Action.hideItem($$("propTableView"));

    toolMaxAdaptive();

    setStateTool   ();

}

function adaptiveCustomInputs (){
    
    Action.removeItem($$("contextActionsBtn"));

    const viewToolsBtn  = $$("viewToolsBtn");
    tools               = $$("formsTools");

    if (dataFields.inputs){  
   
        const customInputs  = generateCustomInputs (dataFields, idTable);
        const filterBar     = $$("table-view-filterId").getParentView();

        const btnTools = new Button({
            config   : {
                id       : "viewToolsBtn",
                hotkey   : "Ctrl+Shift+G",
                icon     : "icon-filter",
                click    : function(){
                    viewToolsBtnClick();
                },
            },
            css            :  "webix_btn-filter",
            titleAttribute : "Показать/скрыть фильтры доступные дейсвтия"
        
           
        }).transparentView();

        
        if( !viewToolsBtn ){
            filterBar.addView( btnTools, 2 );
        } else {
            Action.showItem  (viewToolsBtn);
        }

        maxInputsSize  ( customInputs );

    } else {
        Action.hideItem(tools);
        Action.hideItem(viewToolsBtn);
      
    }
}

function createDynamicElems (id, idsParameter){
    idTable     = id;
    ids         = idsParameter;
    dataFields  = GetFields.item(ids);  
 
    adaptiveCustomInputs ();

}

// create autorefresh

let interval;
const intervals = [];
 
function setIntervalConfig(type, counter){
    interval = setInterval(
        () => {
        
            const table         = getTable();
            const isAutoRefresh = table.config.autorefresh;
             
            if (isAutoRefresh){
                if( type == "dbtable" ){
                    getItemData ("table");
                } else if ( type == "tform" ){
                    getItemData ("table-view");
                }
            } else {
                clearInterval(interval);
            }
        },
        counter
    );


    intervals.push(interval);

}

function clearPastIntervals(){
    if (intervals.length){
        intervals.forEach(function(el, i){
            clearInterval(el);
            intervals.splice(i, 1);
        });
    }
}

function autorefresh (data){

    clearPastIntervals();

    const table = getTable();


    if (data.autorefresh){

        table.config.autorefresh = true;
        const name               = "userprefsOtherForm";
        const userprefsOther     = webix.storage.local.get(name);
        let counter;

        if (userprefsOther){
            counter = userprefsOther.autorefCounterOpt;
        }

        const minValue     = 15000;
        const defaultValue = 120000;
        
        if ( userprefsOther && counter !== undefined ){
            if ( counter >= minValue ){
                setIntervalConfig(data.type, counter);
                
            } else {
                setIntervalConfig(data.type, defaultValue);
            }
        }

       
    } else {
        table.config.autorefresh = false;
        
    }

 
}




//create rows

let currIdTable;
let offsetParam;
let itemTreeId;


function getItemData (table){

    const tableElem = $$(table);

    const reccount  = tableElem.config.reccount;

    if (reccount){
        const remainder = reccount - offsetParam;

        if (remainder > 0){
            loadTableData(table, currIdTable, itemTreeId, offsetParam  ); 
        }

    } else {
        loadTableData(table, currIdTable, itemTreeId, offsetParam ); 
    }

   
}

function setDataRows (type){
    if(type == "dbtable"){
        getItemData ("table");
    } else if (type == "tform"){
        getItemData ("table-view");
    }
}


function createTableRows (id, idsParam, offset = 0){

    const data  = GetFields.item(idsParam);

    currIdTable = id;
    offsetParam = offset;      
    itemTreeId  = idsParam;


    setDataRows         (data.type);
    autorefresh         (data);
          
}


//create formatting date

let idCurrView;

// date

function findDateCols (columns){
    const dateCols = [];
    if (isArray(columns, logNameFile, "findDateCols")){
        columns.forEach(function(col,i){
            if ( col.type == "datetime" ){
                dateCols.push( col.id );
            }
        });
    }
       
   

    return dateCols;
}

function changeDateFormat (data, elType){
    if (isArray(data, logNameFile, "changeDateFormat")){
        data.forEach(function(el){
            if ( el[elType] ){
                const dateFormat = new Date( el[elType] );
                el[elType]       = dateFormat;
                
            }
        });
    }
  
}

function formattingDateVals (table, data){

    const columns  = $$(table).getColumns();
    const dateCols = findDateCols (columns);

    function setDateFormatting (){
        if (isArray(dateCols, logNameFile, "formattingDateVals")){
            dateCols.forEach(function(el,i){
                changeDateFormat (data, el);
            });
        }
       
    }

    setDateFormatting ();
     
   
}



// boolean

function findBoolColumns(cols){
    const boolsArr = [];

    if (isArray(cols, logNameFile, "findBoolColumns")){
        cols.forEach(function(el,i){
            if (el.type == "boolean"){
                boolsArr.push(el.id);
            }
        });
    }
   

    return boolsArr;
}

 

function isBoolField(cols, key){
    const boolsArr = findBoolColumns(cols);
    let check      = false;
    if (isArray(boolsArr, logNameFile, "isBoolField")){
        boolsArr.forEach(function(el,i){
            if (el == key){
                check = true;
            } 
        });
    }
 

    return check;
}


function getBoolFieldNames(){
    const boolKeys = [];
    const cols     = idCurrView.getColumns(true);

    if (isArray(cols, logNameFile, "getBoolFieldNames")){
        cols.forEach(function(key){
    
            if( isBoolField(cols, key.id)){
                boolKeys.push(key.id);
        
            }
        });
    }
  

    return boolKeys;
}

function setBoolValues(element){
    const boolFields = getBoolFieldNames();

    if (isArray(boolFields, logNameFile, "setBoolValues")){
        boolFields.forEach(function(el){
 
            if (element[el] !== undefined){
                if ( element[el] == false ){
                    element[el] = 2;
                } else {
                    element[el] = 1;
                }
            }
          
        });
    }
   

}

function formattingBoolVals(id, data){
    idCurrView = id;

    if (isArray(data, logNameFile, "formattingBoolVals")){
        data.forEach(function(el,i){
            setBoolValues(el);
        });
    }
 

}


//create posts data

let idTableElement;
let offset;
let itemTree;

let idFindElem;

//let firstError = false;
function setTableState(table){
     
    if (table == "table"){
        Action.enableItem($$("table-newAddBtnId"));
        Action.enableItem($$("table-filterId"));
        Action.enableItem($$("table-exportBtn"));
    }

}

function enableVisibleBtn(){
    const viewBtn =  $$("table-view-visibleCols");
    const btn     =  $$("table-visibleCols");
  
    if ( viewBtn.isVisible() ){
        Action.enableItem(viewBtn);

    } else if ( btn.isVisible() ){
        Action.enableItem(btn);

    }
  
}

 
let currId;


function checkNotUnique(idAddRow){    
    const tablePool = currId.data.pull;
    const values    = Object.values(tablePool);
    
    if (isArray(values, logNameFile, "checkNotUnique")){
        values.forEach(function(el){
            if ( el.id == idAddRow ){
                currId.remove(el.id);
            }
        });
    }
    
}


function changeFullTable(data){
    const overlay = "Ничего не найдено";
    if (data.length !== 0){
        currId.hideOverlay(overlay);
        currId.parse      (data);

    } else {
        currId.showOverlay(overlay);
        currId.clearAll   ();
    }

    setTimeout(() => {
        enableVisibleBtn();
    }, 1000);
}

function changePart(data){
    if (isArray(data, logNameFile, "changePart")){
        data.forEach(function(el){
            checkNotUnique(el.id);
            currId.add(el);
        });
    }
    }


function parseRowData (data){

    currId = $$(idTableElement);
   
    if (!offset){
        currId.clearAll();
    }

    formattingBoolVals (currId, data);
    formattingDateVals (currId, data);
    setDefaultValues   (data);
 
 
    if ( !offset ){
        changeFullTable(data);
    } else {
        changePart     (data);
    }
  
}


function setCounterVal (data, idTable){

    const table = $$(idTable)
    try{
        const prevCountRows = {full : data, visible : table.count()};
        $$(idFindElem).setValues(JSON.stringify(prevCountRows));
  
    } catch (err){
        setFunctionError(
            err, 
            logNameFile, 
            "setCounterVal"
        );
    }
}



async function returnFilter(tableElem){
 
    const filterString = tableElem.config.filter;
 
    const result = {
        prefs : true
    };


    if (!result.filter){
        result.prefs = false;
    
  
        if (filterString && filterString.table === itemTree){
            result.filter = filterString.query;
            const id = tableElem.config.id + "_applyNotify";
            Action.showItem($$(id));

        } else {
            result.filter = itemTree +'.id+%3E%3D+0';
          
        }
    }

  

    return result;
}


function returnSort(tableElem){
    let sort;

    const firstCol = tableElem.getColumns()[0].id;
    const sortCol  = tableElem.config.sort.idCol;
    const sortType = tableElem.config.sort.type;
   
    if (sortCol){
        if (sortType == "desc"){
            sort = "~" + itemTree + '.' + sortCol;
        } else {
            sort = itemTree + '.' + sortCol;
        }
        tableElem.markSorting(sortCol, sortType);
    } else {
        sort = itemTree + '.' + firstCol;
        tableElem.markSorting(firstCol, "asc");
    }


    return sort;
}


function returnPath(tableElem, query){
    const tableType = tableElem.config.id;
    let path;
     
    if (tableType == "table"){
        //path = "/init/default/api/smarts?"+ query.join("&");
        path = `smarts?${query.join("&")}`;
    } else {
        //path = "/init/default/api/" + itemTree;
        path = itemTree;
    }

    return path;
}

function setConfigTable(tableElem, data, limitLoad){

    const tableType = tableElem.config.id;

    if ( !offset && tableType == "table" ){
        tableElem.config.reccount  = data.reccount;
        tableElem.config.idTable   = itemTree;
        tableElem.config.limitLoad = limitLoad;
    }

    if( tableType == "table-view" ){
        tableElem.config.idTable   = itemTree;
        tableElem.config.reccount  = data.content ? data.content.length : null;
    }
}


function tableErrorState (){
  
    const prevCountRows = {full : "-"};
    const value         = prevCountRows.toString();
    try {
        $$(idTableElement).showOverlay("Ничего не найдено");
        $$(idFindElem) .setValues  (JSON.stringify(value));
        
        Action.disableItem($$("table-newAddBtnId"));
        Action.disableItem($$("table-filterId"));
        Action.disableItem($$("table-exportBtn"));

    } catch (err){
        setFunctionError(
            err, 
            logNameFile, 
            "tableErrorState"
        );

    }
}


async function loadTableData(table, id, idsParam, offsetParameter){
   
    const tableElem = $$(table);
    const limitLoad = 80;

    idTableElement  = id;
    offset          = offsetParameter;      
    itemTree        = idsParam;

    idFindElem      = idTableElement + "-findElements";

    const resultFilter = await returnFilter(tableElem);
    const isPrefs      = resultFilter.prefs;
    const filter       = resultFilter.filter;

    if (!offset){
        returnSortData ();
    }


    const sort      = returnSort  (tableElem);

    const query = [ "query=" + filter, 
                    "sorts=" + sort, 
                    "limit=" + limitLoad, 
                    "offset="+ offset
    ];


    tableElem.load({
        $proxy : true,
        load   : function(){
            const path = returnPath (tableElem, query);

            new ServerData({
                id           : path,
                isFullPath   : false,
                errorActions : tableErrorState
            
            }).get().then(function(data){
            
                if (data){

                    const reccount = data.reccount ? data.reccount : data.content.length;
                    const content  = data.content;

                    setConfigTable(tableElem, data, limitLoad);

                    if (content){
                        //console.log(data)
                        // data = [
                        //     {id: 4, name: "Критический", cdt: "2023-01-17 14:23:28", ndt:"2022-12-14"},
                        //     {id: 5, name: "Критиче112ский", cdt: "2024-02-22 23:13:24", ndt:"2021-10-14"}
                        // ]
                        
                        setTableState(table);
                        parseRowData (content); ///content!!!!
             
                        if (!offset){
                        
                            selectContextId      ();  
                     
                            returnLostData   ();
                            returnLostFilter (itemTree);

                            if (isPrefs){
                                returnDashboardFilter(filter);
                            }
                        }

                        setCounterVal (reccount, tableElem);
            
                    }
                }
                
            });
          

        }
    });

}


//create default values

function isExists(value){
    if (value){
        return value.toString().length;
    }

}


function returnValue(fieldValue){
    const table = getTable();
    const cols  = table.getColumns(true);
    
    if (isArray(cols, logNameFile, "returnValue")){
        cols.forEach(function(el){
            const defValue =  returnDefaultValue(el);
        
            const value = fieldValue[el.id];

            if (isExists(defValue) && !value){
                fieldValue[el.id] = returnDefaultValue(el);
            }

        });
    }
  
}

function setDefaultValues (data){

    if (isArray(data, logNameFile, "setDefaultValues")){
        data.forEach(function(el){
            returnValue(el);
        });
    }
   

}


//create sort data

function returnSortData(){
    const values = webix.storage.local.get("tableSortData");

    if (values){
        const table = getTable();
        table.config.sort = {
            idCol : values.idCol,
            type  : values.type
        };

    }
}



// create lost filter
function isDataExists(data){
    
    if (data && data.values.values.length){
        return true;
    }
}


function hideHtmlContainers(){
    const container = $$("inputsFilter").getChildViews();

    if (container && container.length){
        container.forEach(function(el){

            const node = el.getNode();
    
            const isShowContainer = node.classList.contains("webix_show-content");
            if (!isShowContainer){
                Filter.addClass(node, "webix_hide-content");
            }
           
        });
    } else {
        setFunctionError(
            `array length is null`, 
            "table/createSpace/returnLostFilter", 
            "hideHtmlContainers"
        ); 
    }
 

}

function returnLostFilter(id){
    const url       = window.location.search;
    const params    = new URLSearchParams(url);
    const viewParam = params.get("view"); 

    if (viewParam == "filter"){
      
        const data = webix.storage.local.get("currFilterState");

        Action.hideItem($$("table-editForm"));

        $$("table-filterId").callEvent("clickEvent", [ "" ]);
   
        if (data){
      
            const activeTemplate = data.activeTemplate;
            Filter.setActiveTemplate(activeTemplate); // option in popup library
        
           
            if (isDataExists(data) && id == data.id){
 
                createWorkspace(data.values.values);
         
                hideHtmlContainers();

                Filter.enableSubmitButton();
        
            }
       
            if (activeTemplate){
                Action.hideItem($$("templateInfo"));
            }

            Filter.setStateToStorage();
 
        }
    }



}



//create lost data

let prop;
let form;

function getLinkParams(param){
    const href   = window.location.search;
    const params = new URLSearchParams (href);
    return params.get(param);
}

function isThisIdSelected(id){
    const selectedId = getLinkParams("id");
    if (id == selectedId){
        return true;
    }
    return false;
}

function setVals(values){
    prop.setValues(values);
    form.setDirty(true);

}

function isFilterParamExists(){
    const param = getLinkParams("view");
    if (param == "filter"){
        return true;
    }
}

function isEditParamExists(){
    const param = getLinkParams("view");
    if (param == "edit"){
        return true;
    }
}

function setDataToTab(currState){
   const data = mediator.tabs.getInfo();

    if (data){
        if(!data.temp){
            data.temp = {};
        }
        if(!data.temp.edit){
            data.temp.edit = {};
        }
       
        data.temp.edit.values = currState;

        if (currState.status == "put"){
         
           data.temp.edit.selected = currState.values.id;
        }

        mediator.tabs.setInfo(data);
    }
}


function returnLostData(){
  
    if (isEditParamExists()){
        $$("table-editTableBtnId").callEvent("clickEvent", [ "" ]);
    }

    if (!isFilterParamExists()){

        const data = webix.storage.local.get("editFormTempData");
     
        if (data){
            prop          = $$("editTableFormProperty");
            form          = $$("table-editForm");
            const table   = $$("table");
            const tableId = table.config.idTable;
     
            const values  = data.values;
            const field   = data.table;
            const status  = data.status;
         
            if (tableId == field ){
                Action.hideItem($$("filterTableForm"));

                setDataToTab(data);
        
                if (status === "put"){
                    const id = values.id;
              
                    if (table.exists(id)     &&
                        isThisIdSelected(id) )
                    {
                  
                        table.select(id);
                        setVals(values);
                            
                    }
             
                } else if (status === "post"){
                    Action.showItem(form);
                    mediator.tables.editForm.postState();
                    setVals(values);
                }


               
            }
        }
    }



    mediator.tabs.setDirtyParam();

    const tabInfo = mediator.tabs.getInfo();

  
    if (tabInfo.isClose){ // tab в процессе удаления
        mediator.getGlobalModalBox().then(function(result){

            if (result){
                const tabbar = $$("globalTabbar");
                const id     = tabbar.getValue();
                tabbar.removeOption(id);
            }

        });
    }

     
}


//create dashboard context

let conditions;

function returnInputId(id){
    const index = id.lastIndexOf(".");
    return id.slice(index + 1);
}

function setOperation(id, value){
    if (value){
        const operationBtn = $$(id + "-btnFilterOperations");
        operationBtn.setValue(value);  
    }
   
}

function setSegmentBtn(id, value){
    if (value && value == "or"){
        const segmentBtn = $$(id + "_segmentBtn");
        const orId       = 2;
        segmentBtn.setValue(orId);  
    }
}

function setInputValue(id, value){
    if (value){
        const trueValue = value.replace(/['"]+/g, '');
        $$(id).setValue(trueValue);
    }
  
}

function setBtnsValue(id, array){
    setOperation (id, array[2]); // array[2] - operation
    setInputValue(id, array[3]); // array[2] - value
    setSegmentBtn(id, array[4]); // array[4] - and/or
}


function checkCondition(array){
    const id = returnInputId(array[1]); //[1] - id

    let inputId       = id + "_filter"; 
    const parentInput = $$(inputId);


    if (!parentInput.isVisible()){
        Filter.setFieldState(1, id);

    } else {
        const table = getTable();
        const col   = table.getColumnConfig(id);
        inputId     = createChildFields(col);

    }

    setBtnsValue(inputId, array);

}
   
// array[1] - id
// array[2] - operation   -- setValue
// array[3] - value  
// array[4] - and/or
function returInputsId(ids){
    const result = [];
    if (isArray(ids, logNameFile, "returInputsId")){
        ids.forEach(function(el, i){
            const index = el.lastIndexOf(".") + 1;
            result.push(el.slice(index));
        });
    }
  
    
    
    return result;
}


function iterateConditions(){
    const ids = [];
    if (isArray(conditions, logNameFile, "iterateConditions")){
        conditions.forEach(function(el){
            const arr = el.split(' ');
            checkCondition(arr);
            ids.push(arr[1]);
         
        });
        
        const inputsId = returInputsId(ids);
        Filter.hideInputsContainers(inputsId);
    }

}


function returnConditions(filter){
    const array = filter.split(' ');

    const conditions = [];
    let r            = "";
    let counter      = 0;

    if (isArray(array, logNameFile, "returnConditions")){
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
    }
  
   

    return conditions;
}

function inputIsVisible(inputs, el){
    return inputs.find(
        element => element == el
    );
} 

function lastItem(result){
    return Math.max.apply(Math, result);
}

function returnCurrIndexes(indexes){
    const result = [];
    if (isArray(indexes, logNameFile, "returnCurrIndexes")){
        const inputs  = Filter.getItems();

        const keys = Object.keys(indexes);
        if (keys.length){
            keys.forEach(function(el){
    
                if (inputIsVisible(inputs, el)){
                    result.push(indexes[el]);
                }
              
            });
        } else {
            setFunctionError(
                `array length is null`, 
                logNameFile, 
                "returnCurrIndexes"
            ); 
        }
       
    
    }
 
    return result;

}


function findLastCollection(indexes, item){
    let lastItemId;

    Object.values(indexes).find(function(el, i){

        if(el == item) {

            lastItemId = Object.keys(indexes)[i]
        }
    });

    return lastItemId;
}

function findLastId(lastItemId){
    const collection = Filter.getItem (lastItemId);

    const index  = collection.length - 1;
    return collection[index];
}

function hideLastSegmentBtn(){
    const indexes     = Filter.getIndexFilters();

    const currIndexes = returnCurrIndexes (indexes);

    const item        = lastItem          (currIndexes);
    const lastItemId  = findLastCollection(indexes, item);
    const lastId      = findLastId        (lastItemId);

    Action.hideItem($$(lastId + "_segmentBtn"));

}

function returnDashboardFilter(filter){
    Filter.clearFilter();
    Filter.clearAll();

    conditions = returnConditions(filter);
    iterateConditions();
    hideLastSegmentBtn();

    Action.enableItem($$("btnFilterSubmit"));

    Filter.setStateToStorage();
}



//create context space


function selectContextId(){
    const idParam = getLinkParams("id");
    const table   = getTable();
    
    if (table && table.exists(idParam)){
        table.select(idParam);
    } else {
        mediator.linkParam(false, "id");
    }
 
}
export{
    createTable,
    createTableRows,
    getItemData,
    formattingBoolVals,
    formattingDateVals,
    loadTableData
};
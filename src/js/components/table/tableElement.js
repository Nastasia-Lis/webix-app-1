 
///////////////////////////////
//
// Медиатор                                                     (create mediator)
//
// Дефолт. состояние компонента с динамич. полями в формах      (create default tools state)
//
// Компонент с контекстом в формах                              (create form context property)
//
// Layout компонента с динамич. полями в формах                 (create form tools layout)
//
// Кнопка, открывающая попап с редактором колонок               (create open edit cols btn)
//
// Кнопка, открывающая фильтры                                  (create open filter btn)
//
// Кнопка, экспортирующая таблицу                               (create export btn)
//
// Кнопка, открывающая редактор записей                         (create open edit table btn)
//
// Счётчик записей                                              (create table counter)
//
// Маркер на таблице о применённых фильтрах                     (create apply notify)
//
// Layout тулбара                                               (create toolbar layout)
//
// Динамические кнопки в таблице                                (create dynamic btns)
//
// Функции таблицы                                              (create table functions)
//
// layout таблицы                                               (create table layout)
//
// Copyright (c) 2022 CA Expert
//
///////////////////////////////

import { modalBox, popupExec }          from "../../blocks/notifications.js";
import { setFunctionError }             from "../../blocks/errors.js";
import { getTable, Action, getItemId }  from "../../blocks/commonFunctions.js";

import { EditForm, 
        defaultStateForm, createProperty,
        editTableBar }                  from "./editForm.js";

import { mediator }                     from "../../blocks/_mediator.js";
import { createTableRows, createTable } from './generateTable.js';
import { setLogValue }                  from '../logBlock.js';
import { ServerData }                   from "../../blocks/getServerData.js";
import { Button }                       from "../../viewTemplates/buttons.js";
import { createHeadline }               from '../viewHeadline.js.js';

import { filterFormDefState, Filter, 
        filterBtnClick, filterForm}     from "./filter.js";

import { setColsWidthStorage, 
        dropColsSettings, columnResize,
        createPopup }                   from "./columnsSettings.js";

const logNameFile = "table/tableElement";

const limitLoad   = 80; 

//create mediator
class Tables {
    constructor (){
        this.name = "tables";

        this.components = {
            editForm : new EditForm()
        };
    }

    create(){
        try{
            if (!$$(this.name)){

                $$("container").addView(
                    returnLayoutTables(this.name),
                5);
 
                $$("filterEmptyTempalte").attachEvent("onViewShow",function(){
                    Action.hideItem($$("templateInfo"));
                });

                const tableElem = $$("table");
                sortTable          (tableElem);
                onResizeTable      (tableElem);
                scrollTableLoad    (tableElem);
                setColsWidthStorage(tableElem);
                columnResize       (tableElem);
                dropColsSettings   (tableElem);

           
            }
        } catch (err){
            setFunctionError(
                err, 
                logNameFile, 
                "createTables"
            );
        }
    }

    showView(){
        Action.showItem($$(this.name));   
    }

    showExists(id){
        const table = getTable().config.id;
        createTable(table, id, true);
    }

    load(id){

       // const table = getTable().config.id;
        createTable("table", id);
    }

    get editForm (){
        return EditForm;
    }

    get filter (){
        return Filter;
    }
  
    defaultState(type, clearDirty=true){
        if (type == "edit"){
            EditForm.defaultState(clearDirty);
        } else if (type == "filter"){
            filterFormDefState();
        } else {
            EditForm.defaultState();
            filterFormDefState   ();
        }
  
       
    }

    setSize(full){
        const containerWidth = $$("flexlayoutTable").$width;
        const table          = $$("table");
        const emptySpace     = 30;
    
        if (full){
            const width        = containerWidth - emptySpace;
            table.config.width = width;

            table.resize();
            console.log(table.$width,width)
        } else {

            const formWidth  = $$("table-editForm").$width;
            const tableWidth = table.$width;
       
            const difference = containerWidth - formWidth - emptySpace;
            
            if (tableWidth > difference){
                table.config.width = difference;
                table.resize();
    
            }
            
        }
      
    }


  

}


class Forms {
    constructor (){
        this.name = "forms";
    }

    create(){
        try{
            if (!$$(this.name)){
                $$("container").addView(
                    returnLayoutForms(this.name),
                6);

                const tableElem = $$("table-view");

                onResizeTable      (tableElem);
                setColsWidthStorage(tableElem);
                columnResize       (tableElem);
                dropColsSettings   (tableElem);
            }
        } catch (err){
            setFunctionError(
                err,
                logNameFile,
                "createForms"
            );
        }
    }

    showView(){
        Action.showItem($$(this.name));   
    }

    load(id){
        createTable("table-view", id);
    }

    defaultState(){
        toolsDefState ();
        Button.transparentDefaultState();
    }


}




//create default tools state
function toolsDefState(){
    const property = $$("propTableView");
    
    if (property && property.isVisible()){
        property.clear();
        Action.hideItem(property);
    }
   
    Action.hideItem($$("formsTools"    ));
    Action.showItem($$("formsContainer"));

}


//create form context property
function propertyTemplate (idProp){
    return {
        view      : "property",  
        id        : idProp, 
        tooltip   : 
        "Имя: #label#<br> Значение: #value#",
        width     : 348,
        nameWidth : 150,
        editable  : true,
        scroll    : true,
        hidden    : true,
    };
}


//create form tools layout

function setBtnFilterState(){
    const btnClass          = document.querySelector(".webix_btn-filter");
    const primaryBtnClass   = "webix-transparent-btn--primary";
    const secondaryBtnClass = "webix-transparent-btn";

    if (btnClass.classList.contains(primaryBtnClass  )){
        btnClass.classList.add   (secondaryBtnClass);
        btnClass.classList.remove(primaryBtnClass  );
    }
}

function defaultState(){
    const tools       = $$("formsTools");    
    const сontainer   = $$("formsContainer");
    const formResizer = $$("formsTools-resizer");
    
    if ( tools && tools.isVisible() ){
        tools.hide();
        formResizer.hide();
    }

    if ( сontainer && !(сontainer.isVisible()) ){
        сontainer.show();
    }
}

function backFilterBtnClick (){
    defaultState();
    setBtnFilterState();
}

const filterBackTableBtn = { 
    view    : "button", 
    id      : "table-backFormsBtnFilter",
    type    : "icon",
    icon    : "icon-arrow-right",
    value   : "Вернуться к таблице",
    height  : 28,
    minWidth: 50,
    width   : 55,
   
    click   : function(){
        backFilterBtnClick();
    },

    on: {
        onAfterRender: function () {
            this.getInputNode()
            .setAttribute("title", "Вернуться к таблице");
        }
    } 
};

const viewTools = {
    id       : "viewTools",
    padding  : 10,
    rows     : [
       {cols : [

            {  
                template   : "Действия",
                height     : 30, 
                css        : "popup_headline",
                borderless : true,
            },
            {},
            filterBackTableBtn
        ]},
   
        {
            id   : "viewToolsContainer", 
            rows : [
                {}
            ]
        }
    ]
};




//create open edit cols btn

function createSpace(){
    const table    = getTable();
    const list     = $$("visibleList");
    const listPull = Object.values(list.data.pull);
    const cols     = table.getColumns(); 
    
    function findRemoveEl(elem){
        let check = false;

        if (cols.length){
            cols.forEach(function(item,i){
            
                if (elem == item.id){
                    check = true;
                }
    
            });
        }
      

 
        return check;
    }

    
    function removeListItem(){

       
        if (listPull && listPull.length){
            listPull.forEach(function(el){
                if (findRemoveEl(el.column)){
                    list.remove(el.id);
                }

            });
        }
           
       
    }

    function addListSelectedItem(){
        const viewList = $$("visibleListSelected");
        const emptyEl  = $$("visibleColsEmptyTempalteSelected");
        
        if (cols.length){
            Action.hideItem(emptyEl);
        }
        if (cols && cols.length){
            cols.forEach(function(col){
                viewList.add({
                    column  :col.id,
                    label   :col.label,
                });
            });
     
        }
          
    }
 
    if (listPull.length){
        removeListItem();
        addListSelectedItem();
    }


}


function createListItems(idTable){

    const currTable  = $$(idTable);
    let columns      = currTable.getColumns(true);

    try{
        columns        = currTable.getColumns(true);
        const sortCols = _.sortBy(columns, "label");

        if (sortCols.length){
            sortCols.forEach(function(col){
            
                if(col.css !== "action-column" && !col.hiddenCustomAttr ){
          
                    $$("visibleList").add({
                        column  :col.id,
                        label   :col.label,
                    });
                    
                }
                
            });
        }
    

    } catch (err){
        setFunctionError(
            err,
            logNameFile,
            "getCheckboxArray"
        );
    }
    
}

function  visibleColsButtonClick(idTable){
    createPopup    ();
    createListItems(idTable);

    Action.hideItem($$("visibleColsEmptyTempalte"));
    Action.showItem($$("popupVisibleCols"));

    createSpace    ();
}

function toolbarVisibleColsBtn(idTable){
    const idVisibleCols = idTable + "-visibleCols";

    const visibleCols = new Button({
    
        config   : {
            id       : idVisibleCols,
            hotkey   : "Ctrl+Shift+A",
            disabled : true,
            icon     : "icon-columns",
            click    : function(){
                visibleColsButtonClick(idTable);
            },
        },
        titleAttribute : "Показать/скрыть колонки"
    
       
    }).transparentView();

    return visibleCols;
}




//create open filter btn

function toolbarFilterBtn(idTable, visible){
    let idBtnEdit = idTable + "-editTableBtnId",
        idFilter  = idTable + "-filterId"
    ;

    const btn = new Button({
        config   : {
            id       : idFilter,
            hotkey   : "Ctrl+Shift+F",
            disabled : true,
            hidden   : visible,
            icon     : "icon-filter",
            click    : function(){
                this.callEvent("clickEvent", [ "" ]);
            },
            on:{
                clickEvent:function(){
                    filterBtnClick(idTable, idBtnEdit);
                }
            }
        },
        css            : "webix_btn-filter",
        titleAttribute : "Показать/скрыть фильтры",
    
       
    }).transparentView();

    return btn;
}



//create export btn

function exportToExcel(idTable){
    try{
        webix.toExcel(idTable, {
            filename    : "Table",
            filterHTML  : true,
            styles      : true
        });
        setLogValue("success", "Таблица сохранена");

    } catch (err) {   
        setFunctionError(err, "toolbarTable", "exportToExcel");
    }
}

function toolbarDownloadButton(idTable, visible){
    const idExport = idTable + "-exportBtn";

    const exportBtn = new Button({
    
        config   : {
            id       : idExport,
            hotkey   : "Ctrl+Shift+Y",
            hidden   : visible, 
            icon     : "icon-arrow-circle-down",
            click    : function(){
                exportToExcel(idTable);
            },
        },
        titleAttribute : "Экспорт таблицы"
    
       
    }).transparentView();
    
    return exportBtn;
}



//create open edit table btn

function setSecondaryState(){
    const btnClass       = document.querySelector(".webix_btn-filter");
    const primaryClass   = "webix-transparent-btn--primary";
    const secondaryClass = "webix-transparent-btn";

    try{
        btnClass.classList.add   (secondaryClass);
        btnClass.classList.remove(primaryClass  );
    } catch (err) {   
        setFunctionError(err, logNameFile, "setSecondaryState");
    }
}

function isIdParamExists(){
    const urlParams = new URLSearchParams(window.location.search);
    const idParam = urlParams.get('id');
    if (idParam){
        return true;
    }
}

function editBtnClick() {

    const editForm  = $$("table-editForm");
    const backBtn   = $$("table-backTableBtn");
    const tree      = $$("tree");
    const table     = $$("table");
    const container = $$("container");

    function maxView () {
        const editContainer   = $$("editTableBarContainer");
        const filterContainer = $$("filterTableBarContainer");
        const filterForm      = $$("filterTableForm");
       
        const isVisible       = editForm.isVisible();
    
        Action.hideItem   (filterContainer);
        Action.hideItem   (filterForm);
      
        setSecondaryState ();

        if (editForm && isVisible){
            mediator.tables.editForm.defaultState();

            Action.hideItem   (editForm);
            Action.hideItem   (editContainer);

            mediator.linkParam(false, "view");
            mediator.linkParam(false, "id"  );
            mediator.tabs.clearTemp("editFormTempData", "edit");

            table.unselectAll ();
        } else if (editForm && !isVisible) {
            Action.showItem (editForm);
            Action.showItem (editContainer);

            Action.hideItem ($$("tablePropBtnsSpace"));

            if(!isIdParamExists()){
                mediator.linkParam(true, {"view" : "edit"});
            }

            mediator.tabs.clearTemp("currFilterState", "filter");
        
        }

    }

    function minView () {
        const tableContainer = $$("tableContainer");
        Action.hideItem (tableContainer);
        Action.hideItem (tree);
        Action.showItem (backBtn);
        
        const padding = 45;
        editForm.config.width = window.innerWidth - padding;
        editForm.resize();

    }
    
    maxView ();

    const minWidth = 850;
    if (container.$width < minWidth ){
        Action.hideItem(tree);
 

        if (container.$width < minWidth ){
            minView ();
        }
      
    } else {
        Action.hideItem(backBtn);
    }
}



function toolbarEditButton (idTable, visible){
    const idBtnEdit = idTable + "-editTableBtnId";

    function returnValue( empty = true ){
        const icon = "<span class='webix_icon icon-pencil btn-edit-icon-toolbar'></span>";
        const text = "<span style='padding-left: 5px; font-size:13px!important; margin-right: 11px;' >Редактор записи</span>";

        if (empty){
            return icon;
        } else {
            return icon + text;
        }
    }   

    const btn = new Button({
        config   : {
            id       : idBtnEdit,
            hotkey   : "Ctrl+Shift+X",
            value    : returnValue( false ),
            hidden   : visible,
            minWidth : 40,
            maxWidth : 200, 
            onlyIcon : false,
            click    : function(){
                this.callEvent("clickEvent", [ "" ]);
            },
            on:{
                clickEvent:function(){
                    editBtnClick(idBtnEdit);
                }
               
            }
        },
        css            : "edit-btn-icon",
        titleAttribute : "Показать/скрыть фильтры",
        adaptValue     : returnValue( ),
    
       
    }).maxView();

    return btn;

}



//create table counter

function createTemplateCounter(idEl, text){
    const view = {   
        view    : "template",
        id      : idEl,
        css     : "webix_style-template-count",
        height  : 30,
        template: function () {

            const values = $$(idEl).getValues();
            const keys   = Object.keys(values);


            if (keys.length){
                const table = getTable();
              
                const obj = JSON.parse(values);

          
                const full    = obj.full    ? obj.full    : table.config.reccount;
                const visible = obj.visible ? obj.visible : table.count();
       
                const counter = visible +  " / " + full;

                return "<div style='color:#999898;'>" + 
                        text + ": " + counter + 
                        " </div>"
                ;
                
            } else {
                return "";
            }
        }
    };

    return view;
}



//create apply notify
function applyNotify(id){
  
    return   {
        cols:[
            {
                template   : "Фильтры применены",
                id         : id + "_applyNotify",
                hidden     : true,
                css        : "applyNotify",
                inputHeigth: 20,
                width      : 160,
                borderless : true,    
            },
             {}
        ]
    };
}

//create toolbar layout
function tableToolbar (idTable, visible = false) {

    const idFindElements   = idTable + "-findElements",
          idHeadline       = idTable + "-templateHeadline"
    ;

    return { 
        
        rows:[
            createHeadline(idHeadline),
            {
                css     : "webix_filterBar",
                id      : idTable + "_toolbarBtns",
                padding : {
                    bottom : 4,
                }, 
                height  : 40,
                cols    : [
                    toolbarFilterBtn      (idTable, visible),
                    toolbarEditButton     (idTable, visible),
                    applyNotify           (idTable),
                    {},
                    toolbarVisibleColsBtn (idTable),
                    toolbarDownloadButton (idTable, visible),
                ],
            },

            { cols : [
                createTemplateCounter (
                    idFindElements  , 
                    "Количество записей"  
                ),

            ]},
        ]
    };
}


// create dynamic btns

function trashBtn(config, idTable){
    function delElem(){
 
        const table      = $$(idTable);
        const formValues = table.getItem(config.row);
        const itemTreeId = getItemId ();


        new ServerData({
    
            id : `${itemTreeId}/${formValues.name}`
           
        }).del(formValues).then(function(data){
        
            if (data){
                const selectEl = table.getSelectedId();
                table.remove(selectEl);
                setLogValue("success", "Данные успешно удалены");
            }
             
        });

    }

  
    popupExec("Запись будет удалена").then(function(res){

        if (res){
            delElem();
        }
  
    });
}



function hideViewTools(){
    const btnClass          = document.querySelector(".webix_btn-filter");
    const primaryBtnClass   = "webix-transparent-btn--primary";
    const secondaryBtnClass = "webix-transparent-btn";

    Action.hideItem($$("formsTools"));

    if (btnClass.classList.contains(primaryBtnClass)){
        btnClass.classList.add   (secondaryBtnClass);
        btnClass.classList.remove(primaryBtnClass);
    }
}

function createUrl(cell){
    let url;
    try{
        const id      = cell.row;
        const columns = $$("table-view").getColumns();

        if (columns && columns.length){
            columns.forEach(function(el,i){
            if (el.id == cell.column){
                url           = el.src;
                let urlArgEnd = url.search("{");
                url           = url.slice(0,urlArgEnd) + id + ".json"; 
            }
        }); 
        }
        
    } catch (err){
        setFunctionError(err, logNameFile, "createUrl");
    }
    return url;
}


function setProps(propertyElem, data){
    const arrayProperty = [];

 
    if (data && data.length){
        data.forEach(function(el, i){
            arrayProperty.push({
                type    : "text", 
                id      : i+1,
                label   : el.name, 
                value   : el.value
            });
        });

        propertyElem.define("elements", arrayProperty);
    }
 
}


function initSpace(propertyElem){
    hideViewTools();
    Action.showItem(propertyElem);
}


function resizeProp(propertyElem){
    const minPropWidth = 200;
    try{
        if (propertyElem.config.width < minPropWidth){
            propertyElem.config.width = minPropWidth;
            propertyElem.resize();
        }
    } catch (err){
        setFunctionError(
            err,
            logNameFile,
            "resizeProp"
        );
    }
}


function getProp(propertyElem, cell){
  
    const path = createUrl(cell);
    new ServerData({
        id         : path,
        isFullPath : true,
    
    }).get().then(function(data){
    
        if (data){
            const content = data.content;
            if (content && content.length){
                setProps    (propertyElem, content);
                initSpace   (propertyElem);
                resizeProp  (propertyElem);
            }
        
        }
         
    });

}


function showPropBtn (cell){
    const propertyElem = $$("propTableView");
    const isVisible    = propertyElem.isVisible();

    if (!isVisible){
        getProp        (propertyElem, cell);
    } else {
        Action.hideItem(propertyElem);
    }
}


//create table functions

function refreshTable(table){
    const tableId           = table.config.idTable;
    const oldOffset         = table.config.offsetAttr;

    const newOffset         = oldOffset + limitLoad;

    table.config.offsetAttr = newOffset;
    table.refresh();

    createTableRows ("table", tableId, oldOffset);
}


function sortTable(table){
    table.attachEvent("onAfterSort", function(id, sortType){
        
        const sortInfo = {
            idCol : id,
            type  : sortType
        };

        table.config.sort       = sortInfo;
        table.config.offsetAttr = 0;


        webix.storage.local.put(
            "tableSortData", 
            sortInfo
        );

        table.clearAll();
        refreshTable(table);
        
    });
}


function scrollTableLoad(table){
    table.attachEvent("onScrollY", function(){
        const table        = this;
        const scrollState  = table.getScrollState();
        const maxHeight    = table._dtable_height;
        const offsetHeight = table._dtable_offset_height;
 
        if (maxHeight - scrollState.y == offsetHeight){ 
            refreshTable(table);
        }
      

    });
}



function onResizeTable(table){
    table.attachEvent("onResize", function(width){
        const cols = table.getColumns();
        const scrollWidth = 17;
        width -= scrollWidth;
        let sum = 0;

        if (cols && cols.length){
            cols.forEach(function(col){
                sum += col.width;
            });

            
            if (sum < width){
                const different = width - sum;
    
                const lastCol = cols.length - 1;
                cols.forEach(function(col,i){
                    if (i == lastCol){
                        const newWidth = col.width + different;
                        table.setColumnWidth(col.id, newWidth);
                    }
            
                });

            } 
        }
        


    });
}


function toEditForm (nextItem) {
    const valuesTable = $$("table").getItem(nextItem); 

    function setViewDate(){
        const parseDate = webix.Date.dateToStr("%d.%m.%y %H:%i:%s");
 
        if (valuesTable){
            const values    = Object.values(valuesTable);
    
            if (values.length){
                try{
                    values.forEach(function(el, i){
                        if(el instanceof Date){
                   
                            const key        = Object.keys(valuesTable)[i];
                            const value      = parseDate(el);
                            valuesTable[key] = value;
                        }
                    
                    });
                } catch (err){ 
                    setFunctionError(err, logNameFile, "setViewDate");
                }
            }
           
        }
        
    }

    
    EditForm.putState();
    setViewDate();
    const prop = $$("editTableFormProperty");
    prop.setValues(valuesTable);
 

}


const onFuncTable = {

    onBeforeLoad:function(){
        this.showOverlay("Загрузка...");
    },

    onBeforeEditStop:function(state, editor){
        const table      = $$("table");
        try {
            if(state.value != state.old){

                const idRow = editor.row;
                const col   = editor.column;
                const value   = state.value;

                const item     = this.getItem(editor.row);

                const oldValue = item[editor.column];

                item[editor.column] = value;

                const property  = $$("editTableFormProperty");
                property.setValues(item);

                table.updateItem (idRow, {[col] : oldValue});
  
                mediator.tables.editForm.put(false);

            }
        } catch (err){
            setFunctionError(
                err, 
                logNameFile, 
                "onBeforeEditStop"
            );
        }

    },

    onBeforeSelect:function(selection){
     
        const table     = $$("table");
        const nextItem   = selection.id;

        function successAction(){
            $$("table-editForm").setDirty(false);
            table.select(selection.id);
        }

        function modalBoxTable (){
  
            try{ 
                modalBox().then(function(result){
                    const saveBtn  = $$("table-saveBtn");
                    const form     = mediator.tables.editForm;
      
                    if (result == 1){
                        mediator.tables.editForm.defaultState();
                        table.select(selection.id);
                    } 

                    else if (result == 2){
                    
                        if (saveBtn.isVisible()){
                            form.put(false)
                            .then(function (result){
                     
                                if (result){
                                    successAction();
                                }

                            });
                        } else {
                            form.post(false)
                            .then(function (result){

                                if (result){
                                    successAction();
                                }

                            });
                        }
                    }

                });

                return false;
          
            } catch (err){ 
                setFunctionError(
                    err,
                    logNameFile,
                    "onBeforeSelect => modalBoxTable"
                );
            }
        }
        const name = "table-editForm";
        const isDirtyForm = $$(name).isDirty();
    
        if (isDirtyForm){
            modalBoxTable ();
            return false;
        } else {
            createProperty(name);
            toEditForm(nextItem);
        }
    },
    onAfterSelect:function(row){
       
       // mediator.tables.setSize();
        mediator.linkParam(true, {id: row.id});
    },

    onAfterUnSelect:function(){
        mediator.linkParam(false, "id");
    },

    onAfterLoad:function(){
    
        try {
            this.hideOverlay();
            defaultStateForm ();
        } catch (err){
            setFunctionError(
                err,
                logNameFile,
                "onAfterLoad"
            );
        }
    },  

    onAfterDelete: function() {
        
        function setOverlayState(){
            const id    = getTable().config.id;
            const table = $$(id);


            if ( !table.count() ){
                table.showOverlay("Ничего не найдено");
            } else {
                table.hideOverlay();
            }
        }

        setOverlayState();
      
    },

    onAfterAdd: function() {
        this.hideOverlay();
    },

    onHeaderClick:function(config){
        const cols          = this.getColumns();
        const colId         = config.column;
        const currColConfig = this.getColumnConfig(colId);
        const self          = this;

        function resizeColumn(newWidth){
            self.setColumnWidth(colId, newWidth);
        }
        
        if (cols && cols.length){
            const lastIndex = cols.length - 1;
            let currColIndex;

            cols.forEach(function(col, i){
                if (col.id == colId){
                    currColIndex = i;
                }
            });

            if (lastIndex == currColIndex){
                 

                if (!$$("resizeLastCol")){
                    const width = currColConfig.width ? currColConfig.width : 0
                    webix.prompt({
                        title       : "Размер последней колонки",
                        ok          : "Применить",
                        cancel      : "Отменить",
                        css         : "webix_prompt-filter-lib",
                        input       : {
                            required    : true,
                            placeholder : "Введите число...",
                            value       : Math.round(width),
                        },
                        width       : 350,
                    }).then(function(result){
                      
                        if(result){

                            if (isNaN(+result)){
                                const text = "Нельзя изменить размер колонки." +
                                " «"+result + "» – не является числом";

                                setFunctionError(
                                    text,
                                    logNameFile, 
                                    "last column resize"
                                );
                            } else{
                                resizeColumn(result);
                            }
                           
                        }
                       
            
                    });
             
                }
            
                
      
           
               
            }
        }
        
    }




};

//create table layout

function table (idTable, onFunc, editableParam = false) {
    return {
        view        : "datatable",
        id          : idTable,
        css         : "webix_table-style webix_header_border webix_data_border ",
        autoConfig  : true,
        editable    : editableParam,
        editaction  :"dblclick",
        minHeight   : 350,
        dragColumn  : true,
    //   height:200,
        footer      : true,
        select      : true,
        resizeColumn: true,
        sort        : [],
        offsetAttr  : limitLoad,
        on          : onFunc,
        onClick     :{
            "wxi-trash"     :function (event, config, html){
                trashBtn(config, idTable);
            },

            "wxi-angle-down":function (event, cell, target){
                showPropBtn (cell);
            },
            
        },
        ready:function(){ 
            const firstCol = this.getColumns()[0];
        },
    };
}

const tableContainer = {   
    id  : "tableContainer",
    rows: [
        tableToolbar ("table"),
        {   view  : "resizer",
            class : "webix_resizers"
        },
        table ("table", onFuncTable, true)
    ]
};

function returnLayoutTables(id){

    const layout = {   
        id      : id, 
        hidden  : true, 
        view    : "scrollview", 
        body    : { 
          //  view  : "flexlayout",
            id    : "flexlayoutTable", 
            cols  : [


                {cols : [
                    tableContainer,

                    {   view  : "resizer",
                        class : "webix_resizers", 
                        id    : "tableBarResizer" 
                    },
              
                    editTableBar(),
                    filterForm(),
                ]}
                                        
         
                
            ]
        }
    
    };
    return layout;
}



const tableLayout =  {   
    view:"scrollview", 
    body: {
        view:"flexlayout",
        cols:[
            table ("table-view"),
    
        ]
    }
};

const hiddenResizer = {   
    view   : "resizer",
    id     : "formsTools-resizer",
    hidden : true,
    class  : "webix_resizers",
};

const formsContainer = {   
    id:"formsContainer",
    rows:[
        tableToolbar("table-view", true ),
        {   view : "resizer", 
            class: "webix_resizers"
        },
        tableLayout, 
    ]
};

const tools = {   
    id       : "formsTools",
    hidden   : true,  
    minWidth : 190, 
    rows     : [
        viewTools,
    ]
};

function returnLayoutForms(id){  
   
    const layout =  {   
        view   : "layout",
        id     : id, 
        css    : "webix_tableView",
        hidden : true,                       
        rows   : [
            {cols : [
                formsContainer, 
                hiddenResizer,
                propertyTemplate("propTableView"),
                tools,
            ]},

        
        ],


    };

    return layout;
}


export {
    returnLayoutForms,
    returnLayoutTables,
    onResizeTable,
    sortTable,
    scrollTableLoad,
    Tables,
    Forms
};
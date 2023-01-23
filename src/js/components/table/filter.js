 
///////////////////////////////
// Медиатор                                                 (create mediator)
//
// Очищение пространства фильтра                            (create clear space)
//
// Описание текущего фильтра для пересоздания               (create filter info)
//
// Сброс фильтра с таблицы                                  (create reset table)
//
// Сохранения состояния фильтра в local storage             (create local storage data)
//
// Показ и сокрытие полей фильтра                           (create visible fields)
//
// Кнопка применить фильтры                                 (create submit btn)
//
// Кнопка сброса фильтров                                   (create reset btn)
//
// Кнопка сохранить в библиотеку шаблон                     (create lib btn)
//
// Кнопка вернуться к таблице                               (create back btn)
//
// Медиатор для кнопок                                      (create btns mediator)
//
// Кнопка, открывающая попап с редактором фильтров          (create open btn)
//
// Создание чекбоксов в редакторе                           (create checkboxes)
//
// Создание таба с библиотекой шаблонов                     (create lib)
//
// Медиатор                                                 (create mediator)
//
// Очищение пространства фильтра                            (create clear space)
//
// Описание текущего фильтра для пересоздания               (create filter info)
//
// Сброс фильтра с таблицы                                  (create reset table)
//
// Сохранения состояния фильтра в local storage             (create local storage data)
//
// Показ и сокрытие полей фильтра                           (create visible fields)
//
// Кнопка с выбором операции элемента фильтра               (create operation field btn)
//
// Создание кнопок полей фильтра                            (create layout field btns)
//
// Кнопка с добавлением и удалением элемента фильтра        (create field context btn)
//
// Создание дочернего элемента                              (create child field)
//
// Типы полей элемента                                      (create field types)
//
// Создание родительского элемента фильтра                  (create parent field)
//
// Кнопка с выбором операции и/или                          (create operation field btn)
//
// Layout фильтра                                           (create filter form layout)
//
// Уведомление о новых несохранённых изменениях в шаблоне   (create notify new add)
//
// Дефолтное состояние фильтра                              (create default filter state)
//
// Кнопка в тулбаре таблицы, открывающая фильтр             (create open filter btn)
//
// Загрузка данных о шаблонах                               (create load templates data)
//
// Кнопка применения изменений фильтра                      (create submit popup btn)
//
// Кнопка удаления шаблона                                   (create template del btn)
//
// Layout таббара с табами                                   (create layout tabbar)
//
// Layout попапа с таббаром                                  (create layout edit popup)
//
// Copyright (c) 2022 CA Expert
//
///////////////////////////////

import { Button }               from "../../viewTemplates/buttons.js";
import { Action, getItemId, 
        returnOwner, isArray,
        getTable, 
        getComboOptions }       from "../../blocks/commonFunctions.js";
import { setFunctionError }     from "../../blocks/errors.js";
import { ServerData }           from "../../blocks/getServerData.js";
import { setLogValue }          from '../logBlock.js';
import { modalBox }             from "../../blocks/notifications.js";
import { mediator }             from "../../blocks/_mediator.js";
import { createEmptyTemplate }  from "../../viewTemplates/emptyTemplate.js";
import { popupExec }            from "../../blocks/notifications.js";
import { Popup }                from "../../viewTemplates/popup.js";

const logNameFile = "table/filter";



//create mediator
const visibleInputs = {};
class FilterPull {
    static pushInPull (key, el){
        visibleInputs[key].push(el);
      
    }

    static getIndex(){

    }

    static clearItem (key){
        visibleInputs[key] = [];
    }


    static getItem (key){
        return visibleInputs[key];
    }

    static getAllChilds (isConcat){
        const values =  Object.values(visibleInputs);
        
        function concat(arr) {
            return [].concat(...arr);
        }

        if (isConcat){
            return concat(values);
        } else{
            return values;
        }
   
    }

   

    static getIndexFilters(){
        const container = $$("inputsFilter");
        const result    = [];
        if(container){
            const childs = container.getChildViews();
            if (childs.length){
                childs.forEach(function(el, i){
                    result[el.config.idCol] = i;
                  
                });
            }
           
        }

        return result;
    }


    static getAll (){
        return visibleInputs;
    }

    static getItems (){
        return Object.keys(visibleInputs);
    }


    static lengthItem(key){
        return visibleInputs[key].length;
    }

    static lengthPull (){
        const length = this.getItems().length;
        return length;
    }

    
    static clearAll(){
        const keys = this.getItems();
        if (keys.length){
            keys.forEach(function(key){
                delete visibleInputs[key];
            });
        }  
    }

    static removeItemChild(key, child){
        const item = this.getItem(key);

        if (item.length){
            item.forEach(function(id, i){
                if (id == child){
                    item.splice(i, 1);
                }
            });
        } 
       
    }
   
    static spliceChild (key, pos, child){
        visibleInputs[key].splice(pos, 0, child);
    }

}

class Filter extends FilterPull {

    static addClass(elem, className){
        if (!(elem.classList.contains(className))){
            elem.classList.add(className);
        }
    }
    
    static removeClass(elem, className){
        if (elem.classList.contains(className)){
       
            elem.classList.remove(className);
           
        }
    }

    static setFieldState(visible, cssClass){
        visibleField (visible, cssClass);
    }

    static clearFilter(){
        clearSpace();
    }

    static getFilter(){
        return getFilterState();
    }

    static setStateToStorage(){
        setState();
    }

    static setActiveTemplate(val){
        $$("filterTableForm").config.activeTemplate = val;
    }
    
    static getActiveTemplate(){
        return $$("filterTableForm").config.activeTemplate;
    }

    static showApplyNotify(show = true){
        const table   = getTable();

        if (table){
            const tableId = table.config.id;
            const item    = $$(tableId + "_applyNotify");
     
            if (show){
                Action.showItem(item); 
            } else {
                Action.hideItem(item); 
            }
        }
      
    
    }

    static async resetTable(){
        return await resetTable();
    }

    static hideInputsContainers(visibleInputs){
        const table = getTable();
        const cols  = table.getColumns();
        if (cols && cols.length){
            cols.forEach(function(col){
                const found = visibleInputs.find(element => element == col.id);
        
                if (!found){
                    const htmlElement = document.querySelector("." + col.id ); 
                    Filter.addClass   (htmlElement, "webix_hide-content");
                    Filter.removeClass(htmlElement, "webix_show-content");
                }
            });
        } 
        
    }

    static enableSubmitButton(){
        const btn = $$("btnFilterSubmit");
   
        const inputs   = this.getAllChilds (true);
        let fullValues = true;
    
        if (inputs.length){
            inputs.forEach(function(input){
                const isValue = $$(input).getValue();
                if (!isValue && fullValues){
                    fullValues = false;
                }
            });
    
            if (fullValues){
                Action.enableItem (btn);
            } else {
                Action.disableItem(btn);
            }
        } 
    }
    
    
}


//create clear space

function hideElements(arr){
    if (arr && arr.length){
        arr.forEach(function(el){
            if ( !el.includes("_filter-child-") ){
    
                const colId      = $$(el).config.columnName;
                const segmentBtn = $$(el + "_segmentBtn");
    
                Filter.setFieldState(0, colId, el);
                segmentBtn.setValue (1);
                Action.hideItem     (segmentBtn);
            }   
        });
    } 

}


function clearSpace(){

    const values = Filter.getAllChilds ();
 
    if (values && values.length){
        values.forEach(function(el){
    
            if (el.length){
                hideElements(el);
            }
        });
    
        Action.disableItem($$("btnFilterSubmit"));
    }

}


//create filter info

let template;

function isParent(el){
    const config = el.config;
    const name   = config.columnName;
    const parent = name + "_filter";
    const id     = config.id;

    let check    = null;

    if (parent !== id){
        check = name;
    }
    return check;
}

function pushValues(id, logic, index){

    const btn = $$(id + "-btnFilterOperations");

    if (btn){
        const operation = btn.getValue();
        const value     = $$(id).getValue();
        const parent    = isParent($$(id));

        template.values.push({
            id          : id, 
            value       : value,
            operation   : operation,
            logic       : logic,
            parent      : parent,
            index       : index
        });
    }
}

function setOperation(arr){

    if (arr && arr.length){
        arr.forEach(function(el, i){

            const segmentBtn = $$( el + "_segmentBtn" );
    
            if(segmentBtn){
                try{
                let logic = null;
    
                if (segmentBtn.isVisible()){
                    logic = segmentBtn.getValue();
                }
    
                pushValues(el, logic,  i);
    
                } catch(err){
                    setFunctionError(
                        err,
                        logNameFile,
                        "setOperation"
                    );
                }
                
            }  
            
        });
    }

  

}


function getFilterState(){
    const keys       = Filter.getItems  ();
    const keysLength = Filter.lengthPull();

    
    template           = {
        values : []
    };

   
    for (let i = 0; i < keysLength; i++) {   
        const key = keys[i];
        setOperation(Filter.getItem(key));
    }


    return template;
}


//create reset table


function setDataTable(data, table){
    const overlay = "Ничего не найдено";
    try{
        if (data.length !== 0){
            table.hideOverlay(overlay);
            table.clearAll   ();
            table.parse      (data);

        } else {
            table.clearAll   ();
            table.showOverlay(overlay);
        }
    } catch (err){
        setFunctionError(
            err,
            logNameFile,
            "setDataTable"
        );
    }
}

function setFilterCounterVal(table){
    try{
        const counter         = $$("table-findElements");
        const filterCountRows = table.count();
        const values          = {visible:filterCountRows}
        counter.setValues(JSON.stringify(values));

    } catch (err){

        setFunctionError(
            err,
            logNameFile,
            "setFilterCounterVal"
        );
    }
}

async function resetTable(){
    const itemTreeId = getItemId ();
    const table      = getTable  ();

 
    const query      = [
        `query=${itemTreeId}.id+%3E%3D+0&sorts=${itemTreeId}.id&limit=80&offset=0`
    ];
   
    return await new ServerData({
        id : `smarts?${query}`
       
    }).get().then(function(data){
    
        if (data){
    
            const content = data.content;
    
            if (content){
                table.config.filter = null;

                setDataTable        (content, table);
                setFilterCounterVal (table);
                setLogValue         ("success", "Фильтры очищены");

                return true;

            }
        }
         
    });

}



//create local storage data


function setTabInfo(id, sentVals){
    const tabData =  mediator.tabs.getInfo();
 
    if (tabData){
        if (!tabData.temp){
            tabData.temp = {};
        }
        tabData.temp.filter = sentVals;
    }
}

function setState () {
    const result   = Filter.getFilter();
    const template = Filter.getActiveTemplate();
    const id       = getItemId();
 
    const sentObj  = {
        id             : id,
        activeTemplate : template,
        values         : result
    };

    setTabInfo(id, sentObj);

    webix.storage.local.put(
        "currFilterState", 
        sentObj
    );
    
}



//create visible fields

const showClass   = "webix_show-content";
const hideClass   = "webix_hide-content";

let segmentBtnElem;
let elementClass;
let condition;
let currElement;

function checkChild(elementClass){
    let unique = true;
    
    if (Filter.lengthItem(elementClass)){
        unique = false;
    }

    return unique;
 
}


function editStorage(){
    if (condition){
       
        const item = Filter.getItem(elementClass);

        if (!item){
            Filter.clearItem (elementClass); // =>  key = []
        }


        const unique = checkChild(elementClass, currElement);

        if (unique){
            Filter.pushInPull(elementClass, currElement);
            Action.showItem  (segmentBtnElem);
        }
     

    } else {
        Filter.clearItem(elementClass);
    }

}


function showInputContainers(){
    Action.showItem($$(currElement));
    Action.showItem($$(currElement + "_container-btns"));
}

function setValueHiddenBtn(btn, value){
    if( btn ){
        btn.setValue(value);
    }
}
function setDefStateBtns(){
    const operBtn    = $$(currElement + "-btnFilterOperations");
    const btns       = $$(currElement + "_container-btns"     );

    
    setValueHiddenBtn(operBtn   , "=");
    setValueHiddenBtn(segmentBtnElem,  1);
    Action.hideItem  (segmentBtnElem    );
    Action.hideItem  (btns          );
}

function setDefStateInputs (){
    $$(currElement).setValue("");
    $$(currElement).hide();
}


function setHtmlState(add, remove){
  
    const css = ".webix_filter-inputs";
    const htmlElement = document.querySelectorAll(css);
    
    if (htmlElement && htmlElement.length){
        htmlElement.forEach(function (elem){
            const isClassExists = elem.classList.contains(elementClass);
    
            if (isClassExists){
                Filter.addClass   (elem, add   );
                Filter.removeClass(elem, remove);
            } 

        });
    }

}

function removeChilds(){
    const container  = $$(currElement + "_rows");

    if (container){
        const containerChilds = container.getChildViews();

        if (containerChilds && containerChilds.length){
            const values = Object.values(containerChilds);
            const childs = [];
        
          
            if (values && values.length){
                values.forEach(function(elem){
                    const id = elem.config.id;
        
                    if (id.includes("child")){
                        childs.push($$(id));
                    }
        
                });
            } 
        
            if (childs && childs.length){
                
                childs.forEach(function(el){
                    Action.removeItem(el);
                });
            }
        }
    }

  
}

function isChildExists(){
    let checkChilds = false;


    const container = $$(currElement + "_rows");

    const childs    = container.getChildViews();

    if (childs.length > 1){
        checkChilds = true;
    }
    
    

    return checkChilds;
}

function showInput(){

    setHtmlState(showClass, hideClass);
    showInputContainers ();
    Action.enableItem   ($$("resetFilterBtn"        ));
    Action.enableItem   ($$("filterLibrarySaveBtn"  ));
    Action.hideItem     ($$("filterEmptyTempalte"   ));  
}

function hideInput(){

    setHtmlState(hideClass, showClass);


    if($$(currElement + "_rows")){
        removeChilds();
    }

    setDefStateInputs();
    setDefStateBtns  ();
    
}


function visibleField (visible, cssClass){

 
    if (cssClass !== "selectAll" && cssClass){

        condition    = visible;
        elementClass = cssClass;
        currElement  = cssClass + "_filter";

        segmentBtnElem   = $$( currElement + "_segmentBtn");
        
        editStorage();
    
        if (!isChildExists()){
            if (condition){
                showInput();
            } else {
                hideInput();
            }
        } else if (!condition){
            hideInput(); 
        }
    }

}


//create submit btn

function setLogicValue(value){
    let logic = null; 
    
    if (value == "1"){
        logic = "+and+";

    } else if (value == "2"){
        logic = "+or+";
    }

    return logic;
}


function setOperationValue(value){
    let operation;

    if (!value){
        operation =  "=";
    } else if (value === "⊆"){
        operation = "contains";
    } else if (value === "="){
        operation = "%3D";
    } else 
    {
        operation = value;
    }

    return "+" + operation + "+";
}

function setName(value){
    const itemTreeId = getItemId ();

    return itemTreeId + "." + value;
}

function isBool(name){
    const table = getTable();
    const col   = table.getColumnConfig(name);
    const type  = col.type;

    let check   = false;
  
    if (type && type === "boolean"){
        check = true;
    }

    return check;
}

function returnBoolValue(value){
    if (value == 1){
        return true;
    } else if (value == 2){
        return false;
    }
}

function isDate(value){
    if (webix.isDate(value)){
        return true;
    }
}

function setValue(name, value){

    let sentValue = "'" + value + "'";


    if (isBool(name)){
        sentValue = returnBoolValue(value);
    }

    if (isDate(value)){
    
        const format = webix.Date.dateToStr("%d.%m.%Y+%H:%i:%s");
        sentValue = format(value);
    }
 
    return sentValue;
}

function createQuery (input){
    const name      = setName           (input.name);
    const value     = setValue          (input.name, input.value);
    const logic     = setLogicValue     (input.logic);
    const operation = setOperationValue (input.operation);

    let query = name + operation + value;

    if (logic){
        query = query + logic;
    }

    return query;
}

function segmentBtnValue(input) {
 
    const segmentBtn = $$(input + "_segmentBtn");
    const isVisible  = segmentBtn.isVisible();

    let value = null;

    if (isVisible){
        value = segmentBtn.getValue();
    }

    return value;
}

 

function createValuesArray(){
    const valuesArr  = [];
    const inputs     = Filter.getAllChilds(true);

    if (inputs && inputs.length){
        inputs.forEach(function(input){
        
            const name       = $$(input).config.columnName;
            const value      = $$(input)                         .getValue();
            const operation  = $$(input + "-btnFilterOperations").getValue();
    
            const logic      = segmentBtnValue(input); 
    
            valuesArr.push ( { 
                id        : input,
                name      : name, 
                value     : value,
                operation : operation,
                logic     : logic  
            });
        });
    } 




    return valuesArr;
}


function createGetData(){
       
    const format         = "%d.%m.%Y %H:%i:%s";
    const postFormatData = webix.Date.dateToStr(format);
    const valuesArr      = createValuesArray();
    const query          = [];

    if (valuesArr && valuesArr.length){
        valuesArr.forEach(function(el){
  
            const filterEl = $$(el.id);
    
            let value      = el.value;
       
            function formattingDateValue(){
                const view = filterEl.config.view; 
                if ( view == "datepicker" ){
                    value = postFormatData(value);
                }
            }
    
            function formattingSelectValue(){
                const text = filterEl.config.text;
                if ( text && text == "Нет" ){
                    value = 0;
                }
            }
    
            if (filterEl){
                formattingDateValue ();
                formattingSelectValue();
                query.push(createQuery(el));
               
            }
    
        });
    
    } 
 
    return query;
}

function createSentQuery(){
    const query = createGetData();
    return query.join("");
}

function setConfigToTab(query){
    const data = mediator.tabs.getInfo();
    if (!data.temp){
        data.temp = {};
    }

    data.temp.queryFilter = query;

    mediator.tabs.setInfo(data);

}

function setTableConfig(table, query){
     
    table.config.filter = {
        table:  table.config.idTable,
        query:  query
    };

 

    setConfigToTab(query);

}

function setData(currTableView, data){
    const overlay = "Ничего не найдено";
    try{
        currTableView.clearAll();
        if (data.length){
            currTableView.hideOverlay(overlay);
            currTableView.parse(data);
        } else {
            currTableView.showOverlay(overlay);
        }
    } catch (err){
        setFunctionError(
            err, 
            logNameFile, 
            "setData"
        );
    }
}

function setCounterValue (reccount){
    try{
        const table   = getTable();
        const id      = table.config.id;
        const counter = $$(id+"-findElements");

       // counter.setValues(reccount.toString());
       const res = {visible:reccount}
       counter.setValues(JSON.stringify(res));
    } catch (err){
        setFunctionError(
            err, 
            logNameFile, 
            "setCounterVal"
        );
    }
}

function errorActions(){
    Filter.showApplyNotify(false);
}

function filterSubmitBtn (){
                           
 
    const isValid = $$("filterTableForm").validate();

    if (isValid){

        const currTableView = getTable();
        const query         = createSentQuery();

        setTableConfig(currTableView, query);

        new ServerData({
    
            id           : `smarts?query=${query}`,
            isFullPath   : false,
            errorActions : errorActions
           
        }).get().then(function(data){
          
            if (data){
                const reccount = data.reccount;
                const content  = data.content;

                Filter.showApplyNotify();
                setData         (currTableView, content);
                setCounterValue (reccount);
                Action.hideItem ($$("tableFilterPopup"));
        
                setLogValue(
                    "success",
                    "Фильтры успшено применены"
                );
            }
             
        });


    } else {
        setLogValue(
            "error", 
            "Не все поля формы заполнены"
        );
    }
  

}


const submitBtn = new Button({

    config   : {
        id       : "btnFilterSubmit",
        hotkey   : "Ctrl+Shift+Space",
        disabled : true,
        value    : "Применить фильтры", 
        click    : filterSubmitBtn,
    },
    titleAttribute : "Применить фильтры"


}).maxView("primary");



//create reset btn

function removeValues(collection){

    if (collection && collection.length){

        collection.forEach(function(el){
            const idChild = el.includes("_filter-child-");

            if (idChild){
                Action.removeItem($$(el + "-container"));
            }
     
        });
    } 
    
}

function removeChildsField(){
   const keys = Filter.getItems();

    if (keys && keys.length){
        keys.forEach(function(key){ 
            const item = Filter.getItem(key);
            removeValues(item);
        });
    } 

}



function clearFilterValues(){
    const form = $$("filterTableForm");
    if(form){
        form.clear(); 
    }
}

function hideInputsContainer(){
    const css       = ".webix_filter-inputs";
    const inputs    = document.querySelectorAll(css);
    const hideClass = "webix_hide-content";


    if (inputs && inputs.length){
        inputs.forEach(function(elem){
            Filter.addClass(elem, hideClass);
        });
    } 
      
  
}




function clearInputSpace(){

    removeChildsField   ();
  
    clearFilterValues   ();
    hideInputsContainer ();
 
    Filter.clearFilter  ();

    Action.hideItem   ($$("tableFilterPopup"    ));

    Action.disableItem($$("filterLibrarySaveBtn"));
    Action.disableItem($$("resetFilterBtn"      ));

    Action.showItem   ($$("filterEmptyTempalte" ));

    Filter.setActiveTemplate(null);

  
    Filter.clearAll(); // clear inputs storage
 
    Filter.setStateToStorage();

}

function setToTabStorage(){
    const data = mediator.tabs.getInfo();

    if (data.temp && data.temp.queryFilter){
        data.temp.queryFilter = null;
    }
}

function resetFilterBtnClick (){
    const table = getTable();
    try {

        modalBox("Все фильтры будут удалены", 
                 "Вы уверены?", 
                ["Отмена", "Удалить"]
        )
        .then(function (result){
            if (result == 1){
                Filter.resetTable().then(function(result){
                    if (result){
                        clearInputSpace();
                        Filter.showApplyNotify(false);
                    }
                    table.config.filter = null;
                    setToTabStorage()
                    Action.hideItem($$("templateInfo"));
                });
              
               
            }

        });
        

    } catch(err) {
        setFunctionError(
            err,
            "Ошибка при очищении фильтров; " +
            "filterForm => buttons",
            "resetFilterBtnClick"
        );
    }
}



const resetBtn = new Button({
    
    config   : {
        id       : "resetFilterBtn",
        hotkey   : "Shift+Esc",
        disabled : true,
        icon     : "icon-trash", 
        click    : function(){
            resetFilterBtnClick();
        }
    },
    titleAttribute : "Сбросить фильтры",
    onFunc: {
        resetFilter: function(){
  
            const table         = getTable();
            table.config.filter = null;

            Filter.resetTable().then(function(result){
                if (result){
                   
                    clearInputSpace();
                   
                    Filter.showApplyNotify(false);
           
                }

        
            });
        }
    }

   
}).minView("delete");




//create lib btn

let nameTemplate;
 
let sentObj;
let currName;


async function isTemplateExists(owner){
    let exists = {
        check : false
    };

    await new ServerData({
        id : `smarts?query=userprefs.name+=+%27${currName}%27+and+userprefs.owner+=+${owner}`
       
    }).get().then(function(data){
    
        if (data){
    
            const content = data.content;
    
            if (isArray(content, logNameFile, "isTemplateExists")){
    
                content.forEach(function(el){
   
                    if (el.name == currName){
                      
                        exists = {
                            check : true,
                            id    : el.id
                        };
                    } 
                });
            }
        }
         
    });


    return exists;
}


function putUserprefsTemplate(id){

    
    new ServerData({
        id : `userprefs/${id}`
    
    }).put(sentObj).then(function(data){

        if (data){

            setLogValue(
                "success",
                "Шаблон" +
                " «" +
                nameTemplate +
                "» " +
                " обновлён"
            );
        }
        
    });

}

async function saveExistsTemplate(id){
    modalBox(   "Шаблон с таким именем существует", 
                "После сохранения предыдущие данные будут стёрты", 
                ["Отмена", "Сохранить изменения"]
                )
    .then(function(result){

        if (result == 1){
            putUserprefsTemplate(id);
        }
    });
 
}

 

function saveNewTemplate(){

     
    new ServerData({
        id : "userprefs"
    
    }).post(sentObj).then(function(data){

        if (data){

            setLogValue(
                "success",
                "Шаблон" +
                " «" +
                nameTemplate +
                "» " +
                " сохранён в библиотеку"
            );
        }
        
    });


}


async function saveTemplate (result){ 

    const user = await returnOwner();

   
    const currId = getItemId();
    const values = Filter.getFilter().values;


    nameTemplate = result;
    currName     = currId + "_filter-template_" + nameTemplate;

    
    const template = {
        name   : nameTemplate,
        table  : currId,
        values : values
    };

    sentObj = {
        name    : currName,
        prefs   : template,
        owner   : user.id
    };
  

    const existsInfo = await isTemplateExists(user.id);
    const isExists   = existsInfo.check;


    if (isExists){
        const id = existsInfo.id;
        saveExistsTemplate(id);  
    } else {
        saveNewTemplate();
    }

}


function libraryBtnClick () {
    try {
        webix.prompt({
            title       : "Название шаблона",
            ok          : "Сохранить",
            cancel      : "Отменить",
            css         : "webix_prompt-filter-lib",
            input       : {
                required    : true,
                placeholder : "Введите название шаблона...",
            },
            width       : 350,
        }).then(function(result){
            saveTemplate (result);

        });
    
    } catch(err) {
        setFunctionError(
            err,
            logNameFile,
            "filterSubmitBtn"
        );
    }
}

const librarySaveBtn = new Button({
    
    config   : {
        id       : "filterLibrarySaveBtn",
        hotkey   : "Shift+Esc",
        icon     : "icon-file",
        disabled : true, 
        click    : libraryBtnClick
    },
    titleAttribute : 
    "Сохранить шаблон с полями в библиотеку"

   
}).minView();



//create back btn

function setBtnFilterState(){
    const btnClass          = document.querySelector(".webix_btn-filter");
    const primaryBtnClass   = "webix-transparent-btn--primary";
    const secondaryBtnClass = "webix-transparent-btn";

    Filter.addClass   (btnClass, secondaryBtnClass);
    Filter.removeClass(btnClass, primaryBtnClass  );

}


function defaultFormState(){
    const filterForm     = $$("filterTableBarContainer");
    const tableContainer = $$("tableContainer");

    Action.hideItem(filterForm);
    Action.showItem(tableContainer);
}


function clearTableSelection(){
    const table = $$("table");
    if (table){
        table.clearSelection();
    } 
}



function backTableBtnClick() {
    defaultFormState    ();
    clearTableSelection ();
    setBtnFilterState   ();
  
}



const backBtn = new Button({
    
    config   : {
        id       : "table-backTableBtnFilter",
        hotkey   : "Shift+Q",
        hidden   : true,  
        icon     : "icon-arrow-left", 
        click   : function(){
            backTableBtnClick();
        },
    },
    titleAttribute : "Вернуться к таблице"

   
}).minView();

//create btns mediator
function buttonsFormFilter (name) {
    if ( name == "formResetBtn" ) {
        return resetBtn;
    } else if ( name == "formBtnSubmit" ){
        return submitBtn;
    } else if ( name == "formEditBtn" ){
        return editBtn;
    } else if ( name == "filterBackTableBtn" ){
        return backBtn;
    } else if ( name == "formLibrarySaveBtn" ){
        return librarySaveBtn;
    }
}


//create lib

let user;
let prefsData;
let libData;

 

function clearOptionsPull() {
    
    const oldOptions = [];

    const options     = libData.config.options;
    const isLibExists = options.length;

    if (libData && isLibExists && options && oldOptions){

        options.forEach(function(el){
            oldOptions.push(el.id);
        });

        oldOptions.forEach(function(el){
            libData.removeOption(el);
        });

    }
}


function createOption(i, data){
    const prefs   = JSON.parse(data.prefs);
    const idPrefs = prefs.table;
    const currId  = getItemId ();

    if (idPrefs == currId){
        libData.addOption( {
            id    : i + 1, 
            value : prefs.name,
            prefs : data
        });

    }
}

function isThisOption(data){
    const dataOwner = data.owner;
    const currOwner = user.id;

    const name           = "filter-template_";
    const isNameTemplate = data.name.includes(name);

    if (isNameTemplate && dataOwner == currOwner){
        return true;
    }

}
function setTemplates(){
   
    clearOptionsPull();

    if (prefsData && prefsData.length){
        prefsData.forEach(function(data, i){
            if(isThisOption(data)){
                createOption(i, data);
            }
        
        });
    } else {
        setFunctionError(
            "array is null",
            "table/filterForm/buttons/editBtn/createLibTab",
            "setTemplates"
        );
    }


}

function setEmptyOption(){
    $$("filterEditLib").addOption(
        {   id      : "radioNoneContent",
            disabled: true, 
            value   : "Сохранённых шаблонов нет"
        }
    );
}

async function createLibTab(){ 
    libData  = $$("filterEditLib");
    user = await returnOwner();

    new ServerData({
        id : "userprefs"
       
    }).get().then(function(data){
    
        if (data){
    
            const content = data.content;
    
            if (content){

                prefsData = content;

                if(user){
                    setTemplates();
        
                    const lib = $$("filterEditLib");
                    
                    if (lib && lib.data.options.length == 0 ){
                        setEmptyOption();
                    }
                
                }
            }
        }
         
    });

   
}



//create checkboxes

function popupSizeAdaptive(){
    const k     = 0.89;
    const size  = window.innerWidth * k;
    const popup = $$("popupFilterEdit");
    try{
        popup.config.width = size;
        popup.resize();
    } catch (err){
        setFunctionError(
            err,
            logNameFile,
            "popupSizeAdaptive"
        );
    }
}

function setValueCheckbox(){
    const content     = $$("editFormPopupScrollContent");

    if (content){
        const checkboxes  = content.getChildViews();
        const isSelectAll = $$("selectAll").getValue();
    
        if(checkboxes && checkboxes.length){
            checkboxes.forEach(function(el){
                const isCheckbox = el.config.id.includes("checkbox");
    
                if (isCheckbox){
                    if(isSelectAll){
                        el.setValue(1);
                    } else {
                        el.setValue(0);
                    }
                }
    
            });
        } 
    }
      
  
}

function returnSelectAllCheckbox(){
    const checkbox =  {
        view        : "checkbox", 
        id          : "selectAll", 
        labelRight  : 
        "<div style='font-weight:600'>Выбрать всё</div>", 
        labelWidth  : 0,
        name        : "selectAll",
        on          : {
            onChange:function(){
                Action.enableItem($$("popupFilterSubmitBtn"));
                setValueCheckbox (); 
            },
    
        } 
    };

    return checkbox;
}

function createCheckboxData(config){
    return { 
        id    : config.id, 
        label : config.label 
    };
}

function getAllCheckboxes(){
    const checkboxes           = [];
    const form = $$("filterTableForm");
    if (form){
        const filterTableElements  = form.elements;

        if (filterTableElements){
            const values = Object.values(filterTableElements);
    
            if (values && values.length){
                values.forEach(function(el){
                    checkboxes.push(
                        createCheckboxData(el.config)
                    );
                });
            } 
        }
     
    }
  

    return checkboxes;
}


function getStatusCheckboxes(array){
    let counter = 0;

    
    if (array && array.length){
        array.forEach(function(el){
            const isCheckbox = el.config.id.includes("checkbox");
            
            if (isCheckbox){
                const value = el.config.value;

                if ( !(value) || value == "" ){
                    counter ++;
                }
            }
            
        });
    } 
    
   

    return counter;
}

 

function setValueSelectAll(selectAll, val){
    try {
        selectAll.config.value = val;
        selectAll.refresh();
    } catch (err) {
        setFunctionError(
            err,
            logNameFile,
            "setSelectAllState"
        );
    }
}

function setSelectAllState(el) {
    const parent  = $$(el.id + "_checkbox").getParentView();
    const childs  = parent.getChildViews();
    const counter = getStatusCheckboxes(childs);

    const selectAll     = $$("selectAll");
    const isTrueValue = selectAll.config.value;

    if (!counter){
        setValueSelectAll(selectAll, 1);

    } else if (isTrueValue){
        setValueSelectAll(selectAll, 0);
        
    }
 
}

function checkboxOnChange (el){
    const parent  = $$(el.id + "_checkbox").getParentView();
    const childs  = parent.getChildViews();
    getStatusCheckboxes(childs);

    setSelectAllState  (el);
    
    Action.enableItem  ($$("popupFilterSubmitBtn"));

}



function returnCheckboxesContainer(layout){
    const nameList = [
        {cols:[
            {   id  : "editFormPopupScrollContent",
                css : "webix_edit-form-popup-scroll-content",
                rows: layout
            }
        ]}
    ];

    return nameList;
}

function returnTemplate(el){
    const template = {
        view        : "checkbox", 
        id          : el.id + "_checkbox", 
        labelRight  : el.label, 
        labelWidth  : 0,
        name        : el.id,
        on          : {
            onChange:function(){
                checkboxOnChange (el);
            }
        } 
    };

    return template;
}


function createCheckbox(el){

    const template = returnTemplate(el);

    const field     = $$(el.id);
    const container = $$(el.id + "_rows");
    const childs    = container.getChildViews();


    if (field && field.isVisible() || childs.length > 1 ){
        template.value = 1;
    }

    return template;
    
}


function addCheckboxesToLayout(checkboxesLayout){
    const scroll = $$("editFormPopupScroll");
    const layout = returnCheckboxesContainer(checkboxesLayout);
    try{
        if (scroll){
            scroll.addView( {rows : layout}, 1 );
        }
    } catch (err){
        setFunctionError(
            err, 
            logNameFile, 
            "addCheckboxesToLayout"
        );
    }
}

function createCheckboxes(){

    const checkboxesLayout = [
        returnSelectAllCheckbox()
    ];


    const formData = getAllCheckboxes();

    if (formData && formData.length){
        formData.forEach(function (el){
            const isChild  = el.id.includes("child");

            if(!isChild){
                checkboxesLayout.push(
                    createCheckbox(el)
                );
            }
        });

        addCheckboxesToLayout(checkboxesLayout);
    } 
  
 
}


function stateSelectAll(){
    const selectAll  = $$("selectAll");
    
    const container  = $$("editFormPopupScrollContent");
    const checkboxes = container.getChildViews();
    const counter    = getStatusCheckboxes(checkboxes);
 
    if (!counter){
        setValueSelectAll(selectAll, 1);
    } 
    
}


function createFieldsTab (){
    const minWidth = 1200;
    if (window.innerWidth < minWidth ){
        popupSizeAdaptive();
    }
 
    createCheckboxes();
 
    stateSelectAll();
}

//create open btn
function editFiltersBtn (){

    createFilterPopup();

    createLibTab ();

    createFieldsTab();
 
}

const editBtn = new Button({
    
    config   : {
        hotkey   : "Alt+A",
        value    : "Открыть редактор", 
        click    : editFiltersBtn
    },
    titleAttribute : "Добавить/удалить фильтры"

   
}).maxView();





//create operation field btn


function filterOperationsBtnLogic (idBtn, id){
  
    const btnFilterOperations = $$(idBtn);
    let operation;

    id === "notEqual" ? operation = "!="
    : id === "less"     ? operation = "<"
    : id === "more"     ? operation = ">"
    : id === "mrEqual"  ? operation = ">="
    : id === "lsEqual"  ? operation = "<="
    : id === "contains" ? operation = "⊆"
    : operation = "=";

    try {
        btnFilterOperations.setValue(operation);

    } catch (err){
        setFunctionError(
            err,
            logNameFile,
            "filterOperationsBtnLogic"
        );
    }



}
function addOperation (self, value, id){
    self.add( { 
        value: value,       
        id   : id      
    });
}

function addDefaultOperations(self){
    addOperation (self, '='       , "eql"     );
    addOperation (self, '!='      , "notEqual");
    
}

function addMoreLessOperations(self){
    addOperation (self, '< ' , "less"    );
    addOperation (self, '> ' , "more"    );
    addOperation (self, '>=' , "mrEqual" );
    addOperation (self, '<=' , "lsEqual" );  
}

function filterOperationsBtnData (typeField){

    return webix.once(function(){

        if (typeField == "combo" || typeField == "boolean" ){
            addDefaultOperations(this);

        } else if (typeField  == "text" ){
            addDefaultOperations(this);
            addOperation (this, "содержит", "contains");

        } else if (typeField  == "date"){
            addDefaultOperations  (this);
            addMoreLessOperations (this);

        } else if (typeField  == "integer"   ){
            addDefaultOperations  (this);
            addMoreLessOperations (this);
            addOperation (this, "содержит", "contains");

        }   
    });
}


function createOperationBtn(typeField, elemId){
    const popup = {
        view  : 'contextmenu',
        width : 100,
        data  : [],
        on    : {
            onMenuItemClick(id) {
                filterOperationsBtnLogic (idBtnOperation, id);
            },
            onAfterLoad: filterOperationsBtnData(typeField)
           
        }
    };
    
    const idBtnOperation = elemId + "-btnFilterOperations";

    const btn = new Button({
    
        config   : {
            id       : idBtnOperation,
            value    : "=", 
            width    : 40,
            popup    : popup,
            inputHeight:38,
            on:{
                onChange:function(value){
                    
                    if (value == "contains"){
                        this.setValue("⊆");
                    }
                  
                    if (Filter.getActiveTemplate()){
                        Action.showItem($$("templateInfo"));
                    }
                    
                    Filter.setStateToStorage();
                }
            }
        },
        titleAttribute : "Выбрать условие поиска по полю",
        css            : "webix_filterBtns",
    
       
    }).maxView();
    
    return btn;
}



//create field context btn

function getVisibleInfo(lastIndex = false){
 
    const values = Filter.getAllChilds();

    const fillElements = [];
    
    let counter = 0;

    if (values && values.length){
        values.forEach(function(value, i){
            if (value.length){
                counter ++;
                fillElements.push(i);
            }
        });
    }
 

    if (lastIndex){
        return fillElements.pop();
    } else {
        return counter;
    }

 
}

function showTemplateInfo(){
    if (Filter.getActiveTemplate()){
        Action.showItem($$("templateInfo"));
    }
}


function isLastInput(lastInput, thisInput){

    let check = false;

    if ( lastInput === thisInput){
        check = true;
    }

    return check;
}



function prevArray(keys, currKey){

    let value;

    function loop(key){
        const indexCurrKey = keys.indexOf(key);
        let indexPrevKey   = indexCurrKey - 1;
        
        if (indexPrevKey >= 0){

            const key    = keys[indexPrevKey];
            const length = Filter.lengthItem (key);

            if (length){
                value = Filter.getItem(key);
            } else {
                loop(key);
            }
           
        } 
    }
    
    loop(currKey);

    return value;
}

function showEmptyTemplate(){
 
    if (!getVisibleInfo()){
        Action.showItem($$("filterEmptyTempalte"));
    }

}


function returnLastItem(array){
    const indexes       = Filter.getIndexFilters();
    const selectIndexes = [];

    if (array && array.length){

        array.forEach(function(el){
            selectIndexes.push(indexes[el]);
        });

 
        let lastIndex = 0;

        for (let i = 0; i < selectIndexes.length; i++){

            if (selectIndexes[i] > lastIndex) {
                lastIndex = selectIndexes[i];
            }
        }

        const keys = Object.keys(indexes);

        const lastInput = 
        keys.find(key => indexes[key] === lastIndex);

  
        return lastInput;
    }

}

function isLastKey(inputsKey, keys) {
    const currInputs = [];

    if (keys && keys.length){
        keys.forEach(function(key){
            const item = Filter.getItem(key);
            if (item.length){
                currInputs.push(key)
            }    
        });
    
    }
 

    const lastKey = returnLastItem(currInputs);
  
    if (inputsKey == lastKey){
        return true;
    }
 
   
}


function findInputs(id, keys){

    const result    = {};

    let isLastCollection = false;

    let inputs       = Filter.getItem(id);

    result.prevIndex = inputs.length - 2;
    result.lastIndex = inputs.length - 1;
    result.lastInput = inputs[result.lastIndex]; 

 
    if (result.prevIndex < 0){ // удален последний элемент из коллекции
        inputs = prevArray(keys, id); // найти не пустую коллекцию
     
        
        if (!inputs){
            isLastCollection = true;  // то была последняя коллекция в пулле
        } else {
            result.prevIndex = inputs.length - 1;
        }
    }
   

    if (!isLastCollection){
        result.prevInput = inputs[result.prevIndex];

    } else {
 
        if (Filter.getActiveTemplate()){
            Filter.setActiveTemplate(null);
        }
        Action.hideItem($$("templateInfo"));
        showEmptyTemplate();
    }

    return result;
}

function hideBtn(input){
    const btn = $$(input + "_segmentBtn");
    Action.hideItem(btn);

}

function hideSegmentBtn (action, inputsKey, thisInput){
 
    const keys      = Filter.getItems();
   
    const checkKey  = isLastKey(inputsKey, keys);
 
    // при удалении приходит удаляющийся

    if (action === "add" && checkKey){

        const inputs     = findInputs (inputsKey, keys);
        const checkInput = isLastInput(inputs.lastInput, thisInput);
    
        if (checkInput){
            
            hideBtn( inputs.lastInput );
        }
        

    } else if (action === "remove" && checkKey){
 
        const inputs     = findInputs (inputsKey, keys);
        const checkInput = isLastInput(inputs.lastInput, thisInput);

        if (checkInput){
            hideBtn( inputs.prevInput );
        }
   
    }
}

function hideHtmlEl(id){
    const idContainer = $$(id + "_filter_rows");
    const showClass   = "webix_show-content";
    const hideClass   = "webix_hide-content";

    const childs = idContainer.getChildViews();

    if (childs.length == 1){
        const div = idContainer.getNode();
       
        Filter.removeClass (div, showClass);
        Filter.addClass    (div, hideClass);

    }

}

function hideMainInput(thisInput, mainInput){
    const btnOperations = $$(thisInput + "-btnFilterOperations");


    if (mainInput && mainInput.length){
        mainInput.forEach(function(el){
            Action.hideItem(el);
        });

        if (btnOperations){
            btnOperations.setValue(" = ");
        } else {
            setFunctionError(
                `button is not defined`, 
                logNameFile, 
                "hideMainInput"
            ); 
        }
      
    }
    

     
}




function clickContextBtnParent (id, el){

    const thisInput  = el.id + "_filter";
    const segmentBtn = $$(thisInput + "_segmentBtn");       
    
    function removeInput (){

        const container  = $$(thisInput).getParentView();
        const mainInput  = container.getChildViews();
     
        hideMainInput       (thisInput, mainInput);

        hideHtmlEl          (el.id);

  
        hideSegmentBtn      ("remove", el.id, thisInput);

        Filter.removeItemChild(el.id, thisInput);

        showEmptyTemplate        ();
        Filter.setStateToStorage ();
        setLogValue         ("success", "Поле удалено"); 

    }

    function addInput (){
    
        const idChild = createChildFields (el);
 
        hideSegmentBtn ("add", el.id, idChild);
        Action.showItem(segmentBtn);
        Filter.setStateToStorage();
    }


    if ( id === "add" ){
        addInput();
        Filter.enableSubmitButton();
        showTemplateInfo();
        
    } else if (id === "remove"){

        popupExec("Поле фильтра будет удалено").then(
            function(){
                removeInput ();
                Filter.enableSubmitButton();
                Action.hideItem(segmentBtn);
                showTemplateInfo();
                
            }
        );
    }
}


function returnThisInput(thisElem){
    const master    = thisElem.config.master;
    const index     = master.indexOf("_contextMenuFilter");
    const thisInput = master.slice(0, index);

    return thisInput;
}



function returnInputPosition(id, thisContainer){
    
    const parentInput  = $$(id + "_filter");
    const isVisibleParent = parentInput.isVisible();

    const item = Filter.getItem(id);

    let childPosition = 0;

    if (item && item.length){
        item.forEach(function(input, i){
            const inputContainer = input + "-container";
    
            if (inputContainer === thisContainer){
                childPosition = i + 1;
            }
        });
    
        if (!isVisibleParent){
            childPosition++;
        }
    
    }

    return childPosition;
}



let thisInput;
let thisContainer;
let element;
 
function addChild(){
    const segmentBtn = $$(thisInput  + "_segmentBtn");

    const childPosition = returnInputPosition(
        element.id, 
        thisContainer
    );

    const idChild = createChildFields (element, childPosition);
    hideSegmentBtn  ("add", element.id, idChild);
    Action.showItem (segmentBtn);
    Filter.setStateToStorage();
}


function removeInput(){
    hideSegmentBtn           ("remove", element.id    ,thisInput);
    Filter.removeItemChild   (element.id, thisInput);
    Action.removeItem        ( $$(thisContainer));
    showEmptyTemplate        ();
    Filter.setStateToStorage ();
    setLogValue              ("success", "Поле удалено"); 
}


function clickContextBtnChild(id, el, thisElem){

    element       = el;
    thisInput     = returnThisInput(thisElem);
    thisContainer = thisInput + "-container";


    if ( id == "add" ){

        addChild();
        Filter.enableSubmitButton();
        showTemplateInfo();
     
    } else if (id === "remove"){
     
        popupExec("Поле фильтра будет удалено").then(
            function(res){
  
                if(res){
                    removeInput();
                    Filter.enableSubmitButton();
                    showTemplateInfo();
                }

            }
        );
    }
}



function returnActions(){
    const actions = [
        {   id      : "add",   
            value   : "Добавить поле", 
            icon    : "icon-plus",
        },
        {   id      : "remove", 
            value   : "Удалить поле", 
            icon    : "icon-trash"
        }
    ];


    return actions;
}

function createContextBtn (el, id, isChild){
  
    const popup = {
        view: 'contextmenu',
        css :"webix_contextmenu",
        data: returnActions(),
        on  :{
            onMenuItemClick:function(idClick){
                if (isChild){
                    clickContextBtnChild (idClick, el, this);
                } else {
                    clickContextBtnParent(idClick, el); 
                }
                
               
            },
         
        }
    };

    const contextBtn = new Button({
    
        config   : {
            id       :  id + "_contextMenuFilter",
            icon     : 'wxi-dots',
            width    : 40,
            inputHeight:38,
            popup       : popup,
        },
        titleAttribute : "Добавить/удалить поле",
        css            : "webix_filterBtns",
    
       
    }).minView();


    return contextBtn;       
}




//create layout field btns
function createBtns(element, typeField, isChild, uniqueId = null){

    let id;
    let hideAttribute = false;

    if (isChild){
        id =  element.id + "_filter-child-" + uniqueId;
    } else {
        id =  element.id + "_filter";
        hideAttribute = true;
    }

    return {
        id      : id + "_container-btns",
        hidden  : hideAttribute,
        css     : {"margin-top" : "22px!important"},
        cols    : [
            createOperationBtn (typeField, id, isChild),
            createContextBtn   (element,   id, isChild) 
        ]
    };
}



//create child field

let fieldElement;
let elemId;
let uniqueId;
let position;
let typeField;

function returnArrPosition(){
    let arrPosition = position;
    const isInputVisible = $$(elemId + "_filter").isVisible();

    if (!isInputVisible){
        arrPosition = position - 1;
    } 

    return arrPosition;
}


function addInputToStorage(id){
    const arrPosition = returnArrPosition();
    Filter.spliceChild (elemId, arrPosition, id);
}

function setClearStorage(){
    const item = Filter.getItem (elemId);

    if ( !item ){
        Filter.clearItem (elemId);
    }

}

function returnLayoutBtns(input){
    const btns = [
       
        {   id      : webix.uid(),
            height  : 105,
            rows    : [
              
                {cols : [
                   input,              
                    createBtns(
                        fieldElement, 
                        typeField, 
                        true, 
                        uniqueId
                    ) 
                ]},

                segmentBtn(
                    fieldElement, 
                    true, 
                    uniqueId
                ),  
            ]
        }
    ];

    return btns;

}

function addInputToContainer(btns){
    const containerRows = $$(elemId + "_filter_rows");
    const idContainer   = 
    elemId + "_filter-child-" + uniqueId + "-container";

 
    containerRows.addView(
        {   id          : idContainer,
            padding     : 5,
            positionElem: position,
            rows        : btns
        }, position
    ); 
}

function addInput(){
   
    setClearStorage();

    const input = field (
        uniqueId, 
        typeField, 
        fieldElement
    );

    addInputToStorage      (input.id);

    const btns = returnLayoutBtns(input);

    addInputToContainer    (btns);
}


function getTypeField(el){
    if (el.type !== "boolean"){
        typeField = el.editor;
    } else {
        typeField = "boolean";
    }
}


function getPosition(customPosition){
    if (customPosition == undefined){
        position = 1;
    } else {
        position = customPosition;
    }
}


function getIdCreatedField(){
    const  idCreateField = elemId + "_filter-child-" + uniqueId;
    return idCreateField;
}

function createChildFields (el, customPosition) {
  
    fieldElement    = el;
    elemId          = el.id;
    uniqueId        = webix.uid();

 
   
    getPosition (customPosition);
    getTypeField(el);

    addInput    ();

    return getIdCreatedField();
}




//create field types
    
let el ;
let typeFieldElem;
let uniqueIdElem;
let partId;

function enableSubmitBtn(){
    Action.enableItem($$("btnFilterSubmit"));
}

function createFieldTemplate(){

    const elemId  = el.id;
    const fieldId = elemId + partId;

    const fieldTemplate = {
        id        : fieldId, 
        name      : fieldId,
        label     : el.label,
        columnName: elemId,
        labelPosition:"top",
    };

    if (!uniqueIdElem) fieldTemplate.hidden = true;

    return fieldTemplate;
}

function activeState(){
    enableSubmitBtn();
    Filter.setStateToStorage();
    $$("filterTableForm").clearValidation();
}

function createText(type){
    const element = createFieldTemplate();
    element.view  = "text";
 
    element.on    = {
        onTimedKeypress:function(){
            activeState();
        }
    };

    if(type == "text"){
        element.placeholder = "Введите текст";
    } else if (type == "int"){
        element.placeholder    = "Введите число";
        element.invalidMessage = 
        "Поле поддерживает только числовой формат";
        element.validate       = function(val){
            return !isNaN(val*1);
        };
    }


    

    return element;
}

function findComboTable(){
    if (el.editor && el.editor == "combo"){
        
        return el.type.slice(10);
    } 
}

function createCombo(type){

    const element       = createFieldTemplate();
    const findTableId   = findComboTable();

    element.view        = "combo";
    element.placeholder = "Выберите вариант";

    element.on    = {
        onChange:function(){
            activeState();
        }
    };

    if (type == "default"){
        element.options     = {
            data:getComboOptions(findTableId)
        };

    } else if (type == "bool"){
        element.options = [
            {id:1, value: "Да"},
            {id:2, value: "Нет"}
        ];
    }

    return element;
}

function createDatepicker() {
    const element       = createFieldTemplate();
    element.view        = "datepicker";
    element.placeholder = "дд.мм.гг";
    element.editable    = true,
    element.format      = "%d.%m.%Y %H:%i:%s";
    element.timepicker  = true;
    element.on    = {
        onChange:function(){
            activeState();
        }
    };

    return element;
}

function createField(){
 
    if (typeFieldElem=="text"){
        return createText("text");

    } else if (typeFieldElem=="combo"){
        return createCombo("default");

    } else if (typeFieldElem=="boolean"){
        return createCombo("bool");

    } else if (typeFieldElem=="date"){
        return createDatepicker();

    } else if (typeFieldElem=="integer"){
        return createText("int");

    }

}


function field (id, type, element){
    uniqueIdElem = id;
    if (!uniqueIdElem){ // parent input
        partId = "_filter";
    } else {
        partId = "_filter-child-" + uniqueIdElem;
    }


    el              = element;
    typeFieldElem   = type;

    return createField();
}






//create parent field

let parentElement;
let viewPosition;

let inputTemplate;


function returnFilter(el){
 
    if (el.type == "datetime"){
        return [
            field(false, "date", el),
            createBtns(el, "date"),  
        ];

    } 
    else if (el.type.includes("reference")) {
        return [
            field(false, "combo", el),
            createBtns(el, "combo"), 
        ];
 
    } 
    else if (el.type.includes("boolean")) {
        return [
            field(false, "boolean", el),
            createBtns(el, "combo")
        ];
    
    } 
    else if (el.type.includes("integer")) {
        return [
            field(false, "integer", el),
            createBtns(el, "integer"), 
        ];
    }
    else{

        return [ 
            field(false, "text", el),
            createBtns(el, "text"), 
        ];
    }
}


function generateElements(){
    const inputsArray = [];
    const columnsData = $$("table").getColumns(true);
    
    if (columnsData.length){
        columnsData.forEach((el) => {
            const id = el.id;

            const idFullContainer  = id + "_filter_rows";
            const idInnerContainer = id + "_filter-container";
            const cssContainer     = id + " webix_filter-inputs";
            
            const filter  =  {   
                id  : idFullContainer,
                idCol:id,
                css : cssContainer,
                rows: [
                    {   id      : idInnerContainer,
                        padding : 5,
                        rows    : [
                            
                            { cols: 
                                returnFilter(el),
                            },
                            segmentBtn(el, false),
                            
                        ]
                    }
                ]
            };

            inputsArray.push (filter);

        });

    }
    
    return inputsArray;
    

}

function createFilter(arr){

    const inputs = {
        margin  : 8,
        id      : "inputsFilter",
        css     : "webix_inputs-table-filter", 
        rows    : arr
    };

    return inputs;
}


function addInputs(inputs){

    const elem = $$(parentElement);
    
    try{
        if(elem){ 
            elem.addView(
                createFilter(inputs), 
                viewPosition
            );
        }
    } catch (err){ 
        setFunctionError(
            err,
            logNameFile,
            "addInputs"
        );
    }
}

function clearFormValidation(){
    const elem = $$(parentElement);

    try{
        if(elem){
            elem.clear();
            elem.clearValidation();
        }
    } catch (err){ 
        setFunctionError(
            err,
            logNameFile,
            "clearFormValidation"
        );
    }
}

function createParentFilter (parentElem, positon = 1) {
    parentElement      = parentElem;
    viewPosition       = positon;

    const childs       = $$(parentElement).elements;
    const childsLength = Object.keys(childs).length;


    if(childsLength == 0 ){
        Action.removeItem($$("inputsFilter"));
        const inputs = generateElements();
        addInputs       (inputs);

    } else {
        clearFormValidation();
        Action.showItem($$("inputsFilter"));
    }


}




//create operation field btn

function segmentBtn(element, isChild, uniqueId){
    let id;
    let hideAttribute = false;

    const idEl = element.id + "_filter";

    if (isChild){
        id = idEl + "-child-" + uniqueId;
    } else {
        id            = idEl;
        hideAttribute = true;
    }

    return {
        view    : "segmented", 
        id      : id + "_segmentBtn",
        hidden  : hideAttribute,
        value   : 1, 
        options : [
            { "id" : "1", "value" : "и" }, 
            { "id" : "2", "value" : "или" }, 
        ],
        on:{
            onChange:function(v){
                Filter.setStateToStorage();
                if (Filter.getActiveTemplate()){
                    Action.showItem($$("templateInfo"));
                }
            }
        }
    };
}




//create filter form layout

function returnBtns(){
    const btns = [
        {   rows   : [
            {   
                margin      : 2, 
                cols        : [
                    buttonsFormFilter("filterBackTableBtn"),
                    buttonsFormFilter("formEditBtn"),
                    buttonsFormFilter("formResetBtn"),
                ],
            },
            ]
        },

        {   id   : "btns-adaptive",
            rows : [
                {  
                    margin      : 2, 
                    cols        : [
                        buttonsFormFilter("formBtnSubmit"),
                        buttonsFormFilter("formLibrarySaveBtn"),
                    ]
                },
                
            ]
        }
    ];

    return btns;
}


const filterTableForm = {
    view        : "form", 
    hidden      : true,
    id          : "filterTableForm",
    minHeight   : 350,
    scroll      : true,
    elements    : [
        {   
            css       : "webix_form-adaptive",
            rows      :  returnBtns()
        },
        {   id        : "filterEmptyTempalte",
            rows      : [
                createEmptyTemplate(
                    "Добавьте фильтры из редактора"
                )
            ],
        },
        saveTemplateNotify()

        
    ],

    rules:{
        $all:webix.rules.isNotEmpty
    },


    ready:function(){
        this.validate();
    },

};

function filterForm (){
    const form = {   
        id       : "filterTableBarContainer", 
        minWidth : 250,
        width    : 350, 
        hidden   : true, 
        rows     : [
            {   id   : "editFilterBarAdaptive", 
                rows : [
                    filterTableForm
                ]
            }
        ]
    };
    
    return form;
}





//create notify new add
function putTemplate(id, sentObj, nameTemplate){

    new ServerData({
    
        id : `userprefs/${id}`
       
    }).put(sentObj).then(function(data){
    
        if (data){
    
            setLogValue(
                "success",
                "Шаблон" +
                " «" +
                nameTemplate +
                "» " +
                " обновлён"
            );

            Action.hideItem($$("templateInfo"));
        }
         
    });
}


function saveClick(){

    const selectTemplate = Filter.getActiveTemplate();
    const newValues = Filter.getFilter().values;

    const prefs  = JSON.parse(selectTemplate.prefs.prefs);
    prefs.values = newValues;

    const sentObj = {
        prefs : prefs
    };

    const id           = selectTemplate.prefs.id;
    const nameTemplate = prefs.name;

    putTemplate(id, sentObj, nameTemplate);
    
    
}


function saveTemplateNotify(){
    const template = {
        template   : "Есть несохранённые изменения в шаблоне", 
        height     : 65, 
        borderless : true
    };

    const btn = new Button({
    
        config   : {
            id       : "putTemplateBtn",
            inputHeight:40,
            icon     : "icon-pencil",
            click    : function(){
                saveClick();
            },
        },
        titleAttribute : "Сохранить изменения"
    
       
    }).transparentView();

    const layout = {  
        id        : "templateInfo",
        hidden    : true,
        css       : "filter-template-info",
        cols      : [
            template,
            {rows : [
                {},
                btn,
                {}
            ]},
            {width : 5}
            
        ],
    };

    return layout;
}




//create default filter state

function setToolbarBtnState(){
    const node = $$("table-filterId").getNode();

    Filter.addClass   (node, "webix-transparent-btn");
    Filter.removeClass(node, "webix-transparent-btn--primary");
}

function resetTableFilter(){
    const table = getTable();

    if (table){
        table.config.filter = null;
    }

}


function filterFormDefState(){
    const filterContainer = $$("filterTableBarContainer");
    const inputs          = $$("inputsFilter");

    resetTableFilter();

    Filter.clearAll();
    Filter.showApplyNotify(false);

    if (filterContainer && filterContainer.isVisible()){
        Action.hideItem  (filterContainer);
    }

    Action.disableItem($$("btnFilterSubmit"));
    Action.disableItem($$("filterLibrarySaveBtn"));
    Action.disableItem($$("resetFilterBtn"));

    Action.removeItem(inputs);

    Action.showItem($$("filterEmptyTempalte"));
    
    setToolbarBtnState();
}




//create open filter btn

const primaryBtnClass   = "webix-transparent-btn--primary";
const secondaryBtnClass = "webix-transparent-btn";

function resizeContainer(width){
    const filterContainer = $$("filterTableBarContainer");

    filterContainer.config.width = width;
    filterContainer.resize();
}

function filterMinAdaptive(){
    Action.hideItem($$("tableContainer"));
    Action.hideItem($$("tree"));

    Action.showItem($$("table-backTableBtnFilter"));

    const emptySpace = 45;
    resizeContainer(window.innerWidth - emptySpace);

}

function setBtnCssState(btnClass, add, remove){
    Filter.addClass    (btnClass, add);
    Filter.removeClass (btnClass, remove);
}


let btnClass;

function setPrimaryState(filter){
    Action.hideItem ($$("table-editForm"));
    Action.showItem (filter);

    const isChildExists = filter.getChildViews();

    if(isChildExists){
        createParentFilter("filterTableForm", 3);
    }

    setBtnCssState(
        btnClass, 
        primaryBtnClass, 
        secondaryBtnClass
    );

    Action.showItem($$("filterTableBarContainer"));
}


function setSecondaryState(){
    setBtnCssState(
        btnClass, 
        secondaryBtnClass, 
        primaryBtnClass
    );
    Action.hideItem($$("filterTableForm"));
    Action.hideItem($$("filterTableBarContainer"));
 
    mediator.tabs.clearTemp("currFilterState", "filter");

}

function toolbarBtnLogic(filter){
    btnClass = document.querySelector(".webix_btn-filter");
    const isPrimaryClass = btnClass.classList.contains(primaryBtnClass);
   
    if(!isPrimaryClass){
        setPrimaryState(filter);
        mediator.linkParam(true, {"view": "filter"});
    } else {
        setSecondaryState();
        mediator.linkParam(false, "view");
    }
}     

function filterMaxAdaptive(filter, idTable){

    $$(idTable).clearSelection();

    toolbarBtnLogic(filter);
    //resizeContainer(350);
}


function filterBtnClick (idTable){
   
   // Filter.clearAll(); // clear inputs storage
  
    const filter    = $$("filterTableForm");
    const container = $$("container");

    filterMaxAdaptive(filter, idTable);

    const width    = container.$width;
    const minWidth = 850;
    const filterMaxWidth = 350;

    if (width < minWidth){
        Action.hideItem($$("tree"));
  
        if (width < minWidth ){
            filterMinAdaptive();
        }

    } else {
        Action.hideItem($$("table-backTableBtnFilter"));
        filter.config.width = filterMaxWidth;
        filter.resize();
    }

 
   
}


// create load templates data

function setValueElem(el, value){
    if (value){
        el.setValue(value);
    }
}

function setBtnsValue(el){
        
    const id = el.id;
    const segmentBtn    = $$(id + "_segmentBtn");
    const operationsBtn = $$(id + "-btnFilterOperations");
 
    setValueElem(segmentBtn   , el.logic    );
    setValueElem(operationsBtn, el.operation);
    
}

function showParentField (el){
  
    const idEl      = el.id;
    const element   = $$(idEl);
    if (element){
        const htmlClass = element.config.columnName;
        Filter.setFieldState(1, htmlClass, idEl);
    
        setBtnsValue(el);
        setValueElem    (element, el.value);
    } else {
        setFunctionError(
            "element is " + element, 
            logNameFile, 
            "showParentField"
        ); 
    }
    
}

function createChildField(el){
    const table = getTable();
    const col   = table.getColumnConfig(el.parent);
 
    const idField = createChildFields  (col, el.index);

    const values  = el;
    values.id     = idField;
  
    setBtnsValue(values);

    setValueElem    ($$(idField), el.value);


}


function returnLastItemFilter(array){
    const indexes       = Filter.getIndexFilters();
    const selectIndexes = [];

    if (array && array.length){

        array.forEach(function(el){
            selectIndexes.push(indexes[el]);
        });

 
        let lastIndex = 0;

        for (let i = 0; i < selectIndexes.length; i++){

            if (selectIndexes[i] > lastIndex) {
                lastIndex = selectIndexes[i];
            }
        }

        const keys = Object.keys(indexes);

        const lastInput = 
        keys.find(key => indexes[key] === lastIndex);

  
        return lastInput;
    }

}

function returnLastChild(item){
    return item[item.length - 1];
}

function hideSegmentButton(){
    const lastCollection = returnLastItemFilter  (Filter.getItems());
    const lastInput      = returnLastChild (Filter.getItem(lastCollection));
    const segmentBtn     = $$(lastInput + "_segmentBtn");

    Action.hideItem(segmentBtn);
}


function createWorkspace(prefs){

    Filter.clearFilter();
 
    if (prefs && prefs.length){
        prefs.forEach(function(el){
            if (!el.parent){
                showParentField  (el);
            } else {
                createChildField(el);
            }
       
        });
    
        hideSegmentButton();
     
    }
 
}

function getOption(){
    const lib        = $$("filterEditLib");
    const libValue   = lib.getValue ();
    return lib.getOption(libValue);
}

function createFiltersByTemplate(item) {
    const radioValue = getOption();
    const prefs      = JSON.parse(item.prefs);
    createWorkspace(prefs.values);

    Action.destructItem($$("popupFilterEdit"));
    Filter.setActiveTemplate(radioValue);
}


function showHtmlContainers(){
    const keys = Filter.getItems();

    if (keys && keys.length){
        keys.forEach(function(el){
            const htmlElement = document.querySelector("." + el ); 
            Filter.addClass   (htmlElement, "webix_show-content");
            Filter.removeClass(htmlElement, "webix_hide-content");
        });
    
        Filter.hideInputsContainers(keys); // hidden inputs
    }

}



async function getLibraryData(){
    const currId     = getItemId ();
    const radioValue = getOption();
    const value = radioValue.value;
    const name = 
    currId + "_filter-template_" + value;

    const owner = await returnOwner();

    new ServerData({
        id : `smarts?query=userprefs.name=${name}+and+userprefs.owner=${owner.id}`
    }).get().then(function(data){
    
        if (data){
    
            const content = data.content;
    
            if (content && content.length){
                const item = content[0];
                createFiltersByTemplate  (item);

                showHtmlContainers       ();
                Filter.setStateToStorage ();
                Filter.enableSubmitButton();
                Action.hideItem($$("templateInfo"));
                setLogValue(
                    "success", 
                    "Рабочая область фильтра обновлена"
                );
                
            }
        }
         
    });


}

//create submit popup btn

function returnCollection(value){
    const colId = $$(value).config.columnName;
    return Filter.getItem(colId);
}

function visibleSegmentBtn(selectAll, selectValues){
 
    const selectLength = selectValues.length;

    if (selectValues && selectLength){
        selectValues.forEach(function(value, i){
            const collection = returnCollection(value);
        
            const length     = collection.length;
            const lastIndex  = length - 1;
            const lastId     = collection[lastIndex];
    
            const segmentBtn = $$(lastId + "_segmentBtn");
    
            const lastElem   = selectLength - 1;
            const prevElem   = selectLength - 1;
    
            if ( i === lastElem){
              //  скрыть последний элемент
                Action.hideItem(segmentBtn);
    
            } else if ( i === prevElem || selectAll){
                Action.showItem(segmentBtn);
            }
       
        });
    }
   
}


function createWorkspaceCheckbox (){
    const popup        = $$("editFormPopup");

    if (popup){
        const values       = popup.getValues();
        const selectValues = [];
    
        try{
            const keys    = Object.keys(values); 

            if (keys && keys.length){

                let selectAll = false;
         
                keys.forEach(function(el){
                    const isChecked = values[el];
        
                    if (isChecked && el !== "selectAll"){
                        selectValues.push(el);
                    } else if (el == "selectAll"){
                        selectAll = true;
                    }
              
                    const columnName = $$(el).config.columnName;
        
               
                    Filter.setFieldState(values[el], columnName);
          
                });
        
                visibleSegmentBtn(selectAll, selectValues);

  
            }
         
    
        } catch(err){
            setFunctionError(
                err,
                logNameFile,
                "createWorkspaceCheckbox"
            );
        }
    }

}

function visibleCounter(){
    const form = $$("filterTableForm");
    let visibleElements = 0;
    if (form){
        const elements      = $$("filterTableForm").elements;
 
        if (elements){
            const values        = Object.values(elements);
      
            if (values && values.length){
                values.forEach(function(el){
                    const isVisibleElem = el.config.hidden;
                    if ( !isVisibleElem ){
                        visibleElements++;
                    }
                    
                });
            }
          
        }
      
    }
   

    return visibleElements;
}


// function resetLibSelectOption(){
//     Filter.setActiveTemplate(null);
// }

function setDisableTabState(){
    const visibleElements = visibleCounter();
 
    if (!(visibleElements)){
        Action.showItem     ($$("filterEmptyTempalte" ));

        Action.disableItem  ($$("btnFilterSubmit"     ));
        Action.disableItem  ($$("filterLibrarySaveBtn"));
    } 
}


function createFilterSpace(){
    Action.enableItem($$("filterLibrarySaveBtn"));
    createWorkspaceCheckbox ();

    setDisableTabState();

    Action.destructItem($$("popupFilterEdit"));

    //resetLibSelectOption();
  
    setLogValue(
        "success",
        "Рабочая область фильтра обновлена"
    );
}
 

async function createModalBox(table){
    return modalBox("С таблицы будет сброшен текущий фильтр", 
        "Вы уверены?", 
    ["Отмена", "Продолжить"]
    )
    .then(function (result){
        if (result == 1){

            return Filter.resetTable().then(function(result){
                if (result){
                    Filter.showApplyNotify(false);
                    table.config.filter = null;
                    setToTabStorage();
                    
                } 

                return result;
            });
       
        }

    });
}

function showActiveTemplate(){
    if (Filter.getActiveTemplate()){
        Action.showItem($$("templateInfo"));
    } 
}

function resultActions(){
    createFilterSpace();
    Filter.setStateToStorage ();
    Filter.enableSubmitButton();
    showActiveTemplate();
}

function isUnselectAll(){
    const checkboxContainer = $$("editFormPopupScrollContent");
    let isUnchecked = true;
    if (checkboxContainer){
        const checkboxes = checkboxContainer.getChildViews();

        if (checkboxes && checkboxes.length){
            checkboxes.forEach(function(el){
                const id       = el.config.id;
                const checkbox = $$(id);
        
                if (checkbox){
        
                    const value = checkbox.getValue();
        
                    if (value && isUnchecked && id !== "selectAll"){
                        isUnchecked = false;
                    }
                }
        
            });
        }
 
    
    }
 
    return isUnchecked;

}

function getCheckboxData(){
    const table          = getTable();
    const isFilterExists = table.config.filter;
 
    if (isUnselectAll() && isFilterExists){
        createModalBox(table).then(function(result){
            if (result){
                resultActions();
            }
        });
    } else {
        resultActions();
    }

     
 
}

function showEmptyTemplateElem(){
    const keys = Filter.lengthPull();
    if ( !keys ){
        Action.showItem($$("filterEmptyTempalte"));
    }
}

function createLibraryInputs(){
    Filter.clearFilter  ();
    Filter.clearAll     ();
    getLibraryData      ();
}

function popupSubmitBtn (){
    try {                                             
        const tabbarValue = $$("filterPopupTabbar").getValue();

        if (tabbarValue == "editFormPopupLib"){

            const table          = getTable();
            const isFilterExists = table.config.filter;
         
            if (isFilterExists){
                createModalBox(table).then(function(result){
                    if (result){

                        Filter.resetTable().then(function(result){
                            if (result){
                                createLibraryInputs();
                              
                            } 
                        });
                    }
                });
            } else {
                createLibraryInputs();
          
            }

        } else if (tabbarValue == "editFormScroll" ){
            getCheckboxData();
            Filter.setStateToStorage();
        }

  

    } catch (err) {
        setFunctionError( 
            err ,
            logNameFile, 
            "popupSubmitBtn"
        );

        Action.destructItem($$("popupFilterEdit"));
    }

    showEmptyTemplateElem();

}




const submitPopupBtn = new Button({
    
    config   : {
        id       : "popupFilterSubmitBtn",
        hotkey   : "Shift+Space",
        disabled : true, 
        value    : "Применить", 
        click    : popupSubmitBtn
    },
    titleAttribute : "Выбранные фильтры будут" +
    "добавлены в рабочее поле, остальные скрыты"

}).maxView("primary");


//create template del btn
let lib;
let radioValue;

function removeOptionState (){

    if (lib){
        const id      = radioValue.id;
        const options = lib.config.options;
        if (options){
            options.forEach(function(el){
                if (el.id == id){
                    el.value = el.value + " (шаблон удалён)";
                    lib.refresh();
                    lib.disableOption(lib.getValue());
                    lib.setValue("");
                }
            });
        }
    }

}

function deleteElement(){
    const prefs   = radioValue.prefs;
    const idPrefs = prefs.id;

        
    new ServerData({
        id : `userprefs/${idPrefs}`
    
    }).del(prefs).then(function(data){

        if (data){

            const value = radioValue.value;

            setLogValue(
                "success",
                "Шаблон « " + value + " » удален"
            );
            removeOptionState ();
            Filter.clearFilter();
            Filter.setStateToStorage();
            Action.showItem($$("filterEmptyTempalte"));
        }
        
    });

}


function resetLibSelectOption(){
    Filter.setActiveTemplate(null);
}


async function userprefsData (){ 

    lib = $$("filterEditLib");
    const libValue = lib.getValue();
    radioValue = lib.getOption(libValue);

    const idPrefs = radioValue.prefs.id;

    if (idPrefs){
        deleteElement       (radioValue, lib);
        resetLibSelectOption();
        Action.disableItem  ($$("editFormPopupLibRemoveBtn"));
    }

    

}

function removeBtnClick (){

    modalBox(   "Шаблон будет удалён", 
                "Вы уверены, что хотите продолжить?", 
                ["Отмена", "Удалить"]
    ).then(function(result){

        if (result == 1){
            userprefsData ();
            
        }
    });
}


const removeBtn = new Button({
    
    config   : {
        id       : "editFormPopupLibRemoveBtn",
        hotkey   : "Shift+Q",
        hidden   : true,  
        disabled : true,
        icon     : "icon-trash", 
        click   : function(){
            removeBtnClick ();
        },
    },
    titleAttribute : "Выбранный шаблон будет удален"

   
}).minView("delete");



//create layout tabbar

const btnLayout = {
    cols   : [
        submitPopupBtn,
        {width : 5},
        removeBtn,
    ]
};

function onChangeLibBtn (){
    const submitBtn = $$("popupFilterSubmitBtn");

    const template      = Filter.getActiveTemplate();
    const selectedValue = template ? template : null;

    const lib        = $$("filterEditLib");
    const libValue   = lib.getValue ();
    const radioValue = lib.getOption(libValue);

    if (radioValue && radioValue.id !== selectedValue){
        Action.enableItem ($$("editFormPopupLibRemoveBtn"));
        Action.enableItem (submitBtn);
    } else {
        Action.disableItem(submitBtn);
    }


}

const radioLibBtn =  {   
    view    : "radio", 
    id      : "filterEditLib",
    vertical: true,
    options : [],
    on      : {
        onChange: function(){
            onChangeLibBtn ();
        }
    }
};

const tabLibrary = {  
    view        : "form", 
    scroll      : true ,
    id          : "editFormPopupLib",
    css         : "webix_multivew-cell",
    borderless  : true,
    elements    : [
        radioLibBtn
    ],

};

const tabForm = {   
    view        :"scrollview",
    id          : "editFormScroll", 
    borderless  : true, 
    css         : "webix_multivew-cell",
    scroll      : "y", 
    body        : { 
        id  : "editFormPopupScroll",
        rows: [ ]
    }

};

function btnSubmitState (state){

    const btn = $$("popupFilterSubmitBtn");

    if (state=="enable"){
        Action.enableItem(btn);

    } else if (state=="disable"){
        Action.disableItem(btn);
        
    }
    
}

function visibleRemoveBtn (param){
    const btn = $$("editFormPopupLibRemoveBtn");
   
    if (param){
        Action.showItem(btn);
    } else {
        Action.hideItem(btn);
    }
    
}

function setSelectedOption(){
    const radio = $$("filterEditLib");

    const currTemplate = Filter.getActiveTemplate();

    if (currTemplate && currTemplate.id){
        radio.setValue   (currTemplate.id);
        Action.enableItem($$("editFormPopupLibRemoveBtn"));
        btnSubmitState   ("disable");
    }
}

function filterLibrary(){

    function setStateSubmitBtn (){
        
        if ($$("filterEditLib").getValue() !== "" ){
            btnSubmitState ("enable");
        } else {
            btnSubmitState ("disable");
        }
    }

    try{
 
        setStateSubmitBtn ();
        visibleRemoveBtn  (true);
        setSelectedOption ();
    }catch(err){
        setFunctionError(
            err, 
            logNameFile, 
            "filterLibrary"
        );
    }  

}



function editFilter (){
    
    const checkboxes = $$("editFormPopup").getValues();

    let counter = 0;
        

    function countChecked(){
        const values = Object.values(checkboxes);
        if (values && values.length){
            values.forEach(function(el){
                if (el){
                    counter++;
                }
            });
        }
           
        
    }
    
    function setStateSubmitBtn(){
        if (counter > 0){
            btnSubmitState ("enable");
        } else {
            btnSubmitState ("disable");
        }
    }

    if (checkboxes){

        countChecked     ();
        visibleRemoveBtn (false);
        setStateSubmitBtn();
    }
   
   
}


function tabbarClick (id){

    if (id =="editFormPopupLib"){
        filterLibrary();  
    }

    if (id =="editFormScroll"){
        editFilter ();
    } 

}


function returnDivHeadline(title){
    return  "<span" + 
            "class='webix_tabbar-filter-headline'>" +
            title +
            "</span>";
}



const tabbar =  {
    view        : "tabbar",  
    type        : "top", 
    id          : "filterPopupTabbar",
    css         : "webix_filter-popup-tabbar",
    multiview   : true, 
    height      : 50,

    options     : [
        {   value: returnDivHeadline("Поля"), 
            id: 'editFormScroll' 
        },
        {   value: returnDivHeadline("Библиотека"), 
            id: 'editFormPopupLib' 
        },
    ],

    on:{
        onAfterTabClick: function(id){
            tabbarClick(id);
        }
    }
};

const layoutTab = {
    rows:[
        tabbar,
                
        {   height : 200,
            cells  : [
                tabForm,
                tabLibrary,
            ]   
        },
    ]
};


//create layout edit popup

const editFormPopup = {
    view        : "form", 
    id          : "editFormPopup",
    css         : "webix_edit-form-popup",
    borderless  : true,
    elements    : [

        { rows : [ 
            layoutTab,
    
            {height : 20},
            btnLayout
        ]},
        {}

    ],
};



function createFilterPopup() {

    const popup = new Popup({
        headline : "Редактор фильтров",
        config   : {
            id    : "popupFilterEdit",
            height  : 400,
            width   : 400,
    
        },
    
        elements : {
            rows : [
                createEmptyTemplate(
                    "Выберите нужные поля или шаблон из библиотеки"
                ),
                editFormPopup
            ]
          
        }
    });
    
    popup.createView ();
    popup.showPopup  ();

}


export {
    editBtn,
    buttonsFormFilter,
    Filter,
    filterForm,
    createBtns,
    createChildFields,
    field,
    createParentFilter,
    filterFormDefState,
    filterBtnClick,
    getLibraryData,
    createWorkspace 
};
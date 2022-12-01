import { Action }                                       from "../../../blocks/commonFunctions.js";
import { setFunctionError }                             from "../../../blocks/errors.js";
import { setLogValue }                                  from "../../logBlock.js";
import { modalBox }                                     from "../../../blocks/notifications.js";
import { postPrefsValues, getTable, destructPopup }     from "./common.js";

import { Popup }                                        from "../../../viewTemplates/popup.js";
import { Button }                                       from "../../../viewTemplates/buttons.js";
import { createEmptyTemplate }                          from "../../../viewTemplates/emptyTemplate.js";



function searchColsListPress (){
    const list      = $$("visibleList");
    const search    = $$("searchColsList");
    const value     = search.getValue().toLowerCase();
    let counter     = 0;
    try{
    
        list.filter(function(obj){
            const condition = obj.label.toLowerCase().indexOf(value) !== -1;

            if (condition){
                counter ++;
            }
    
            return condition;
        });

        if (counter == 0){
            Action.showItem($$("visibleColsEmptyTempalte"));
        } else {
            Action.hideItem($$("visibleColsEmptyTempalte"));
        }
      
    } catch(err){
        setFunctionError(err,"visibleColumns","searchColsListPress");
    }

}


function setBtnSubmitState(state){
    const btnSubmit  = $$("visibleColsSubmit");
    const check      = btnSubmit.isEnabled();

    if (state == "enable" && !(check) ){
        btnSubmit.enable();
    } else if ( state == "disable" && check ){
        btnSubmit.disable();
    }
}

function setColsSize(col,listItems){
    const table      = getTable();
    const countCols  = listItems.length;
    const tableWidth = $$("tableContainer").$width-17;
    const colWidth   = tableWidth / countCols;

    table.setColumnWidth(col, colWidth);
}

function clearBtnColsClick (){
    const table  = getTable();
    const cols   = table.getColumns(true);
    const values = [];
  
    function returnWidthCol(){
        const containerWidth = window.innerWidth - $$("tree").$width - 77; 
        const cols           = table.getColumns(true).length;
        const colWidth   = containerWidth / cols;
        return colWidth.toFixed(2);
    }



    function returnPosition(column){
        let position;
        const pull = table.data.pull[1];
       
        if (pull){
            const defaultColsPosition = Object.keys(pull);
            
            defaultColsPosition.forEach(function(el,i){
                if (el == column){
                    position = i;
                }
            });
    
        }
   
        return position;
    }

    function showCols(){
        try{
            cols.forEach(function(el,i){
                const colWidth    = returnWidthCol();
                const positionCol = returnPosition(el.id);

                setColsSize(el.id,cols);
                
                if( !( table.isColumnVisible(el.id) ) ){
                    table.showColumn(el.id);
                }
           
                table.setColumnWidth(el.id, colWidth);

                values.push({
                    column   : el.id,
                    position : positionCol,
                    width    : colWidth 
                });
            });
        } catch(err){
            setFunctionError(err,"visibleColumns","clearBtnColsClick => showCols");
        }
    }
    modalBox(   "Будут установлены стандартные настройки", 
            "Вы уверены?", 
            ["Отмена", "Сохранить изменения"]
    )
    .then(function(result){

        if (result == 1){
            showCols();
            postPrefsValues(values);
            destructPopup();
            setLogValue   ("success","Рабочая область таблицы обновлена");
        }
    });
}


function visibleColsSubmitClick (){

    const list      = $$("visibleListSelected");
    const listPull  = list.data.pull;
    const listItems = Object.values(listPull);
    const values    = [];
    const table     = getTable();

    const containerWidth = window.innerWidth - $$("tree").$width - 77; 

    function returnMinSize(){
        const allCols = table.getColumns(true).length;
        const width  = containerWidth / allCols;

        return width.toFixed(2);
    }

    function setLastColWidth(lastColumn,widthCols){
        const sumWidth       = widthCols.reduce((a, b) => a + b, 0);


        let widthLastCol   =  containerWidth - sumWidth;

        if (widthLastCol < 50){
            widthLastCol = returnMinSize();
        }

        lastColumn.width = Number(widthLastCol);

        values.push(lastColumn); 
    }


    try{
        const widthCols = [];
        const lastColumn = {};
 
        
        listItems.forEach(function(el,i){
            const positionElem = list.getIndexById(el.id);
            const lastCol      = list.getLastId();
         
            let colWidth;

            if ( el.id !== lastCol){
                colWidth = table.getColumnConfig(el.column).width;
              
                if ( colWidth >= containerWidth ){
                    colWidth = returnMinSize();
                }
            
                widthCols.push(colWidth);
           
                values.push({
                    column   : el.column, 
                    position : positionElem,
                    width    : Number(colWidth)
                });
            } else {
                lastColumn.column   = el.column;
                lastColumn.position = positionElem;
            } 
 
      

        });
        setLastColWidth(lastColumn,widthCols);

    } catch (err){
        setFunctionError(err,"visibleColumns","visibleColsSubmitClick");
    }

    postPrefsValues(values,true);

}

function createMsg(){
    if(!($$("visibleColsMsg")) ){
        webix.message({
            id:"visibleColsMsg",
            type:"debug", 
            text:"Элемент не выбран",
        });
    }
}

function colsMove(action){
    const list        = $$("visibleListSelected");
    const listElement = list.getSelectedId();

    if( listElement ){
        if (action == "up"){
            list.moveUp(listElement,1);
            setBtnSubmitState("enable");
        } else if (action == "down"){
            list.moveDown(listElement,1);
            setBtnSubmitState("enable");
        }   
    } else {
        createMsg();
    }
}

function colsPopupSelect(action){

    const list                  = $$("visibleList");
    const listSelect            = $$("visibleListSelected");
    const emptyTemplateSelected = $$("visibleColsEmptyTempalteSelected");
    const emptyTemplate         = $$("visibleColsEmptyTempalte");

    function showEmptyElem(list,emptyEl,btn){
        const listPull      = Object.values(list.data.pull);
        if ( !(listPull.length) ){
            Action.showItem(emptyEl);
            
            if( btn && btn.isEnabled() ){
                btn.disable();
            } 

            setBtnSubmitState("disable");

        }
    }

    function hideEmptyElem(type){

        if ( type == "available" ){
            const pull = Object.values(list.data.pull);
            if ( pull.length ){
                Action.hideItem(emptyTemplateSelected);
                setBtnSubmitState("enable");
            } 
             
        } else if ( type == "selected"  ){
            const pull = Object.values(listSelect.data.pull);
        
            if ( pull.length ){
                Action.hideItem(emptyTemplate);
                setBtnSubmitState("enable");
                
            } 
        }  
    }


    if ( action == "add"){
        const selectedItem  = list.getSelectedItem();
        const selectedId    = list.getSelectedId  ();
        if (selectedItem){
            hideEmptyElem("available");
            listSelect.add(selectedItem);
            list.remove(selectedId);
            showEmptyElem(list,emptyTemplate, $$("addColsBtn"));
        
            setBtnSubmitState("enable");
        } else {
            createMsg();
        }

      

    } else if ( action == "remove" ){
        const selectedItem  = listSelect.getSelectedItem();
        const selectedId    = listSelect.getSelectedId();
    
        if (selectedItem){
            hideEmptyElem("selected");
            list.add(selectedItem);
            listSelect.remove(selectedId);

            showEmptyElem(listSelect,emptyTemplateSelected, $$("removeColsBtn"));
         
        } else {
            createMsg();
        }
    }


}


function createSpace(){
    const table    = getTable();
    const list     = $$("visibleList");
    const listPull = Object.values(list.data.pull);
    const cols     = table.getColumns(); 
    
    function findRemoveEl(elem){
        let check = false;

        cols.forEach(function(item,i){
            
            if (elem == item.id){
                check = true;
            }

        });
        return check;
    }

    
    function removeListItem(){

        try{
            listPull.forEach(function(el,i){
            
                if (findRemoveEl(el.column)){
                list.remove(el.id);
                }

            });
        } catch (err){
            setFunctionError(err,"visibleColumns","createSpace => removeListItem");
        }  
    }

    function addListSelectedItem(){
        const viewList = $$("visibleListSelected");
        const emptyEl  = $$("visibleColsEmptyTempalteSelected");
        
        if (cols.length){
            Action.hideItem(emptyEl);
        }
        try{
            cols.forEach(function(col,i){
                viewList.add({
                    column  :col.id,
                    label   :col.label,
                });
            });
        } catch (err){
            setFunctionError(err,"visibleColumns","createSpace => addListSelectedItem");
        } 
    }

    if (listPull.length !== cols.length){
        removeListItem();
        addListSelectedItem();
    }


}

function  visibleColsButtonClick(idTable){
    const currTable  = $$(idTable);
    let columns      = $$(idTable).getColumns(true);

    

    function createCheckboxes(){

        function createListItems(){

            try{

                columns = currTable.getColumns(true);
                const sortCols = _.sortBy(columns,"label");

                sortCols.forEach(function(col){

                    if(col.css !== "action-column" && !col.hiddenCustomAttr ){
                      
                        $$("visibleList").add({
                            column  :col.id,
                            label   :col.label,
                        });
                     
                    }
                   
                });

            } catch (err){
                setFunctionError(err,"visibleColumns","getCheckboxArray");
            }
        }

        createListItems();
        Action.hideItem($$("visibleColsEmptyTempalte"));
        Action.showItem($$("popupVisibleCols"));

    }

    function createPopup(){
       
        function generateEmptyTemplate(id,text){

            const layout = {
                css:"list-filter-empty",
                rows:[
                    createEmptyTemplate(text, id)
                ]
            };

            return  layout;
        }

        function genetateScrollView(idCheckboxes,inner){
            return {
                view        : "scrollview",
                css         : "webix_multivew-cell",
                borderless  : true,
                scroll      : false,
                body        : { 
                    id  : idCheckboxes,
                    rows: inner
                }
            };
        }

        const btnSaveState = new Button({
    
            config   : {
                id       : "visibleColsSubmit",
                hotkey   : "Shift+S",
                disabled : true,
                value    : "Сохранить состояние", 
                click    : function(){
                    visibleColsSubmitClick();
                },
            },
            titleAttribute : "Изменить отображение колонок в таблице"
        
           
        }).maxView("primary");

        const scrollView = [
            {   template    : "Доступные колонки", 
                css         : "list-filter-headline",
                height      : 25, 
                borderless  : true
            },
            generateEmptyTemplate(
                "visibleColsEmptyTempalte",
                "Нет доступных колонок"
            ),

            {
                view      : "list", 
                id        : "visibleList",
                template  : "#label#",
                select    : true,
                css       : "list-filter-borders",
                borderless: true,
                data      : [],
                on        : {
                    onAfterAdd:function(){
                        const btnAdd    = $$("addColsBtn");

                        function enableBtn(){
                            if ( btnAdd && !(btnAdd.isEnabled()) ){
                                btnAdd.enable();
                            }
                        }

                        enableBtn();
  
                    },
                    onAfterDelete:function(id){
                        const prevItem =  this.getNextId(id);
                        if(prevItem){
                            this.select(prevItem);
                        }
                    },
                }
            }
            
        ];
   
        const scrollViewSelected = [
            {   template    : "Выбранные колонки",
                css         : "list-filter-headline",
                height      : 25, 
                borderless  : true,
             
            },
            generateEmptyTemplate(
                "visibleColsEmptyTempalteSelected",
                "Выберите колонки из доступных"
            ),

            {
                view      : "list", 
                id        : "visibleListSelected",
                template  : "#label#",
                css       : "list-filter-borders",
                select    : true,
                borderless: true,
                data      : [],
                on        : {
                    onAfterAdd : function(){
                        const btnRemove    = $$("removeColsBtn");

                        function enableBtn(){
                            if ( btnRemove && !(btnRemove.isEnabled()) ){
                                btnRemove.enable();
                            }
                        }

                        enableBtn();
                    },
                    onAfterDelete : function(id){
                        const prevItem = this.getNextId(id);
                        if(prevItem){
                            this.select(prevItem);
                        }
                    },
                
                }
            }

        ];
  

        const moveBtns = {
            rows:[

                {   
                    view    : "button",
                    width   : 50, 
                    type    : "icon",
                    id      : "addColsBtn",
                    css     : "list-filter-move-btns",
                    disabled: true,
                    icon    : "icon-arrow-right",
                    hotkey  : "shift+a", 
                    height  : 30,
                    click   : function(){
                       colsPopupSelect("add");
                    },
                    on: {
                        onAfterRender : function () {
                            this.getInputNode().setAttribute("title","Добавить выбранные колонки (Shift+A)");
                        }
                    } 
                },
                {   
                    view    : "button",
                    width   : 50, 
                    type    : "icon",
                    id      : "removeColsBtn",
                    css     : "list-filter-move-btns",
                    disabled: true,
                    icon    : "icon-arrow-left",
                    hotkey  : "shift+d",
                    height  : 30,
                    click   : function(){
                        colsPopupSelect("remove");
                    },
                    on: {
                        onAfterRender : function () {
                            this.getInputNode().setAttribute("title","Убрать выбранные колонки (Shift+D)");
                        }
                    } 
                },
              
            ]
        };

        const moveUpBtn = new Button({
    
            config   : {
                id       : "moveSelctedUp",
                hotkey   : "Shift+U",
                icon     : "icon-arrow-up",
                click   : function(){
                    colsMove("up");
                },
            },

            titleAttribute : "Поднять выбраную колонку вверх"
           
        }).transparentView(); 

        const moveDownBtn = new Button({
    
            config   : {
                id       : "moveSelctedDown",
                hotkey   : "Shift+W",
                icon     : "icon-arrow-down",
                click   : function(){
                    colsMove("down");
                },
            },

            titleAttribute : "Опустить выбраную колонку вниз"
           
        }).transparentView(); 

        const moveSelcted =  {
            cols : [
                moveUpBtn,
                moveDownBtn,
                {},
            ]
        };

        const clearBtn = new Button({
    
            config   : {
                id       : "clearBtnCols",
                hotkey   : "Shift+R",
                icon     : "icon-trash",
         
                click    : function(){
                    clearBtnColsClick();
                },
            },
            css            : "webix-trash-btn-color",
            titleAttribute : "Установить стандартные настройки"
           
        }).transparentView();


        const search = {   
            view        : "search", 
            id          : "searchColsList",
            placeholder : "Поиск (Shift+F)", 
            css         : "searchTable",
            height      : 42, 
            hotkey      : "shift+f", 
            on          : {
                onTimedKeyPress : function(){
                    searchColsListPress();
                }
            }
        };

        const popup = new Popup({
            headline : "Видимость колонок",
            config   : {
                id    : "popupVisibleCols",
                width       : 600,
                maxHeight   : 400,
            },
    
            elements : {
                rows:[
                    { cols:[
                        {   
                            rows:[
                                search,

                                genetateScrollView(
                                    
                                    "listContent",
                                    scrollView
                                ),
                            ]
                        },
                        {width:10},
                        { rows:[
                            {height:45},
                            {},
                            moveBtns,
                            {}
                        ]},
                        {width:10},
                        { rows:[
                        
                            {cols:[
                                moveSelcted,
                                clearBtn,
                            ]},
                            genetateScrollView(
                                "listSelectedContent",
                                scrollViewSelected
                            ),
                        ]},
                    ]},

                    {height:20},

                    btnSaveState,
                ]
              
            }
        });
    
        popup.createView ();
    
        createCheckboxes();
        createSpace();
    }

    createPopup();

}


export {
    visibleColsButtonClick 
};

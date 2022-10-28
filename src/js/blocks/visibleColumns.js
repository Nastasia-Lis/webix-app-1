import { hideElem, showElem,getItemId }     from "./commonFunctions.js";
import { setFunctionError, setAjaxError }   from "./errors.js";
import { setLogValue }                      from "./logBlock.js";
import { setStorageData }                   from "./storageSetting.js";
import { modalBox }                         from "./notifications.js";

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
           showElem($$("visibleColsEmptyTempalte"));
        } else {
            hideElem($$("visibleColsEmptyTempalte"));
        }

    
     
       //visibleColsEmptyTempalteSelected
      
    } catch(err){
        setFunctionError(err,"visibleColumns","searchColsListPress");
    }

}

function destructPopup(){
    try{
        const popup = $$("popupVisibleCols");
        if (popup){
            popup.destructor();
        }
    } catch (err){
        setFunctionError(err,"visibleColumns","destructPopup");
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


function getTable(){
    const tableTempl     = $$("table");
    const tableTemplView = $$("table-view");
    let table;

    if ( tableTempl.isVisible() ){
        table = tableTempl;
    } else if ( tableTemplView.isVisible() ){
        table = tableTemplView;
    }

    return table;
}


function clearBtnColsClick (){
    const table = getTable();
    const cols  = table.getColumns(true);

    function showCols(){
        try{
            cols.forEach(function(el,i){
                
                if( !( table.isColumnVisible(el.id) ) ){
                    table.showColumn(el.id);
                }
                
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
            destructPopup();
            setLogValue   ("success","Рабочая область таблицы обновлена");
        }
    });
}

function setUpdateCols(sentVals){
    const table   = getTable();
    const columns = table.getColumns(true);
    
    function findUniqueCols(col){
        let result = false;

        sentVals.values.forEach(function(el){
            if (el.column == col){
                result = true;
            }

        });
        
        return result;
    }

    function setVisibleState(){
        try{
            columns.forEach(function(el,i){
                
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
        } catch(err){
            setFunctionError(err,"visibleColumns","setUpdateCols => setVisibleState");
        }
    }

    function moveListItem(){
        sentVals.values.forEach(function(el){
            table.moveColumn(el.column, el.position);
                
        });  
    }


    setVisibleState ();
    moveListItem    ();

}

function postPrefsValues(values){
    const id            = getItemId();
    const sentVals      = {
        values       : values, 
        tableIdPrefs : id
    };

    const sentObj = {
        name:"visibleColsPrefs_"+id,
        prefs:sentVals,
    };

    function saveExistsTemplate(sentObj,idPutData){
        const url     = "/init/default/api/userprefs/"+idPutData;
        const putData = webix.ajax().put(url, sentObj);

        putData.then(function(data){
            data = data.json();
             
            if (data.err_type !== "i"){
                setLogValue("error","toolbarTable function saveExistsTemplate putData: "+ data.err);
            } else {
                setLogValue   ("success","Рабочая область таблицы обновлена");
                setStorageData("visibleColsPrefs_"+id, JSON.stringify(sentObj.prefs));
                setUpdateCols (sentVals);
            }

           
        });

        putData.fail(function(err){
            setAjaxError(err, "visibleColumns","saveExistsTemplate => putUserprefsData");
        });

        destructPopup();
    } 

    function saveNewTemplate(){
        const ownerId = webix.storage.local.get("user").id;
        const url     = "/init/default/api/userprefs/";
        
        if (ownerId){
            sentObj.owner = ownerId;
        }

        const userprefsPost = webix.ajax().post(url,sentObj);
        
        userprefsPost.then(function(data){
            data = data.json();
 
            if (data.err_type !== "i"){
                setFunctionError(data.err,"filterTableForm","tabbarClick")
            } else {
                setLogValue   ("success","Рабочая область таблицы обновлена");
                setStorageData("visibleColsPrefs_"+id, JSON.stringify(sentObj.prefs));
                setUpdateCols (sentVals);
            }
        });

        userprefsPost.fail(function(err){
            setAjaxError(err, "visibleColumns","saveTemplate");
        });

        destructPopup();
    }

    function getUserprefsData(){
     
        const getData = webix.ajax().get("/init/default/api/userprefs");
        let settingExists = false;
        let idPutData;
    
        getData.then(function(data){
            data = data.json().content;
            try{
                data.forEach(function(el){
                    
                    if (el.name == "visibleColsPrefs_"+id && !settingExists){
                        idPutData = el.id
                        settingExists = true;
                
                    }
                });
            } catch (err){
                setFunctionError(err,"visibleColumns","getUserprefsData getData");
            }
        });

        getData.then(function(){
     
            if (!settingExists){
                saveNewTemplate();
            } else {
                saveExistsTemplate(sentObj,idPutData);
            }
        });


        getData.fail(function(err){
            setAjaxError(err, "toolbarTable","getUserprefsData");
        });

        return settingExists;

    }
    getUserprefsData();

}


function visibleColsSubmitClick (){

    const list      = $$("visibleListSelected");
    const listPull  = list.data.pull;
    const listItems = Object.values(listPull);
    const values    = [];

    try{
        listItems.forEach(function(el,i){
            const positionElem = list.getIndexById(el.id);
            values.push({column:el.column, position:positionElem});

        });
    } catch (err){
        setFunctionError(err,"visibleColumns","visibleColsSubmitClick");
    }

    postPrefsValues(values);
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
            showElem(emptyEl);

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
                hideElem(emptyTemplateSelected);
                setBtnSubmitState("enable");
            } 
             
        } else if ( type == "selected"  ){
            const pull = Object.values(listSelect.data.pull);
        
            if ( pull.length ){
                hideElem(emptyTemplate);
                setBtnSubmitState("enable");
                
            } 
        }  
    }


    if ( action == "add"){
        const selectedItem  = list.getSelectedItem();
        const selectedId    = list.getSelectedId  ();
        if (selectedItem){
            listSelect.add(selectedItem);
            list.remove(selectedId);
            showEmptyElem(list,emptyTemplate, $$("addColsBtn"));
            hideEmptyElem("available");
            setBtnSubmitState("enable");
        } else {
            createMsg();
        }

      

    } else if ( action == "remove" ){
        const selectedItem  = listSelect.getSelectedItem();
        const selectedId    = listSelect.getSelectedId();
    
        if (selectedItem){
            list.add(selectedItem);
            listSelect.remove(selectedId);

            showEmptyElem(listSelect,emptyTemplateSelected, $$("removeColsBtn"));
            hideEmptyElem("selected");
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
            hideElem(emptyEl);
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
        hideElem($$("visibleColsEmptyTempalte"));
        showElem($$("popupVisibleCols"));

    }

    function createPopup(){

        const popupHeadline = {   
            template    : "Видимость колонок", 
            width       : 250,
            css         : "popup_headline list-filter-head", 
            borderless  : true, 
            height      : 20 
        };

        const btnClosePopup = {
            view        : "button",
            id          : "buttonClosePopup",
            css         : "popup_close-btn",
            type        : "icon",
            hotkey      : "esc", 
            width       : 35,
            icon        : 'wxi-close',
            click       : function(){
                destructPopup();
            },
            on          : {
                onAfterRender: function () {
                    this.getInputNode().setAttribute("title","Закрыть окно (Esc)");
                }
            } 
        };

        function generateEmptyTemplate(id,text){
            return {   
                id        : id,
                css       : "webix_empty-template list-filter-empty",
                template  : text, 
                borderless: true
            };
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


        const btnSaveState = {
            view    : "button",
            id      : "visibleColsSubmit", 
            value   : "Сохранить состояние", 
            css     : "webix_primary",
            hotkey  : "shift+s", 
            disabled: true,
            click   : function(){
                visibleColsSubmitClick();
            },
            on      : {
                onAfterRender: function () {
                    this.getInputNode().setAttribute("title","Изменить отображение колонок в таблице (Shift+S)");
                }
            } 
    
        };



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

        const moveSelcted =  {
            cols:[
                {   
                    view    : "button",
                    width   : 50, 
                    type    : "icon",
                    id      : "moveSelctedUp",
                    icon    : "icon-arrow-up",
                    hotkey  : "shift+u",
                    css     : "webix-transparent-btn",
                    height  : 42,
                    click   : function(){
                        colsMove("up");
                    },
                    on      : {
                        onAfterRender: function () {
                            this.getInputNode().setAttribute("title","Поднять выбраную колонку вверх (Shift+U)");
                        }
                    } 
                },
                {   
                    view    : "button",
                    width   : 50, 
                    type    : "icon",
                    id      : "moveSelctedDown",
                    icon    : "icon-arrow-down",
                    css     : "webix-transparent-btn",
                    hotkey  : "shift+w",
                    height  : 42,
                    click   : function(){
                        colsMove("down");
                    },
                    on      : {
                        onAfterRender: function () {
                            this.getInputNode().setAttribute("title","Опустить выбраную колонку вниз (Shift+W)");
                        }
                    } 
                },
                {},
            ]
        };

        const clearBtn = {   
            view    : "button",
            width   : 50, 
            type    : "icon",
            id      : "clearBtnCols",
            icon    : "icon-trash",
            hotkey  : "shift+r",
            css     : "webix-transparent-btn webix-trash-btn-color",
            height  : 42,
            click   : function(){
                clearBtnColsClick();
            },
            on: {
                onAfterRender : function () {
                    this.getInputNode().setAttribute("title","Установить стандартные настройки (Shift+R)");
                }
            } 
        };

        const search = {   
            view        : "search", 
            id          : "searchColsList",
            placeholder : "Поиск (Shift+F)", 
            css         : "searchTable",
            height      : 42, 
            //width       : 276,
            hotkey      : "shift+f", 
            on          : {
                onTimedKeyPress : function(){
                    searchColsListPress();
                }
            }
        };
    
        webix.ui({
            view        : "popup",
            id          : "popupVisibleCols",
            css         : "webix_popup-prev-href",
            width       : 600,
            maxHeight   : 400,
            modal       : true,
            escHide     : true,
            position    : "center",
            body        : {

                rows:[ 
                    { cols:[

                        popupHeadline,
                        {},
                        btnClosePopup,
              
                    ]},

                    {height:5},

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
            },
            

        });
        createCheckboxes();
        createSpace();
    }

    createPopup();

}

function toolbarVisibleColsBtn(idTable){
    const idVisibleCols = idTable+"-visibleCols";
    return {   
        view    : "button",
        width   : 50, 
        type    : "icon",
        id      : idVisibleCols,
        disabled: true,
        icon    : "icon-columns",
        css     : "webix_btn-download webix-transparent-btn",
        title   : "текст",
        height  : 42,
        hotkey  :"ctrl+shift+c",
        click   : function(){
            visibleColsButtonClick(idTable);
        },
        on: {
            onAfterRender : function () {
                this.getInputNode().setAttribute("title","Показать/скрыть колонки (Ctrl+Shift+C)");
            }
        } 
    };
}

export {
    toolbarVisibleColsBtn 
};



import {setHeadlineBlock} from './blockHeadline.js';
import {toolbarFilterBtn} from "./filterTableForm.js";
import {setLogValue} from "./logBlock.js";
import {setFunctionError,setAjaxError} from "./errors.js";
import {setStorageData} from "./storageSetting.js";
import {modalBox,popupExec} from "./notifications.js";
function hideElem(elem){
    try{
        if (elem && elem.isVisible()){
            elem.hide();
        }
    } catch (err){
        setFunctionError(err,"toolbarTable","hideElem");
    }
}

function showElem (elem){
    try{
        if (elem && !(elem.isVisible())){
            elem.show();
        }
    } catch (err){
        setFunctionError(err,"toolbarTable","showElem");
    }
}

function editBtnClick() {
    function maxView () {
        const btnClass = document.querySelector(".webix_btn-filter");
        const editForm = $$("table-editForm");
        function setSecondaryState(){
            try{
                btnClass.classList.add("webix-transparent-btn");
                btnClass.classList.remove("webix-transparent-btn--primary");
            } catch (err) {   
                setFunctionError(err,"toolbarTable","setSecondaryState");
            }
        }

        hideElem($$("filterTableBarContainer"));
        hideElem($$("filterTableForm"));
        setSecondaryState();

     //   hideElem($$(idBtnEdit));

        if (editForm && editForm.isVisible()){
         
           
            hideElem(editForm);
            hideElem($$("editTableBarContainer"));

        }else if (editForm && !(editForm.isVisible())) {
            showElem(editForm);
            showElem($$("editTableBarContainer"));
            hideElem($$("tablePropBtnsSpace"));
        }

    }
  

    function minView () {
        hideElem($$("tableContainer"));
        hideElem($$("tree"));
        showElem($$("table-backTableBtn"));
        
        $$("table-editForm").config.width = window.innerWidth;
        $$("table-editForm").resize();
    }

    maxView ();
    if ($$("container").$width < 850 ){
        hideElem($$("tree"));

        if ($$("container").$width  < 850 ){
            minView ();
        }
      
    } else {
        hideElem($$("table-backTableBtn"));
        $$("table-editForm").config.width = 350;
        $$("table-editForm").resize();
    }
}

function  visibleColsButtonClick(idTable){
    const currTable  = $$(idTable);
    const columns    = $$(idTable).getColumns(true);
    console.log(  $$(idTable).getColumns( ),"columns")
    console.log(   $$(idTable).serialize(true),"serialize")
    function createCheckboxes(){
        const checkboxes = [];
        const btnSubmit  = $$("visibleColsSubmit");
        function disableBtn(){
          
            try{
                if (btnSubmit && btnSubmit.isEnabled()){
                    btnSubmit.disable();
                }
            } catch (err){
                setFunctionError(err,"toolbarTable","createCheckboxes => disableBtn");
            }
        
        }

        
        function enableBtn(){
            const btnSubmit  = $$("visibleColsSubmit");
            try{
                if (btnSubmit && !(btnSubmit.isEnabled())){
                    btnSubmit.enable();
                }
            } catch (err){
                setFunctionError(err,"toolbarTable","createCheckboxes => enableBtn");
            }
        }

        function checkboxOnChange(newValue,oldValue,col){
            const id          = col.id+"_checkbox-visible";
            const parent      = $$(id).getParentView();
            const parentView  = $$(parent.config.id);
            const checkboxes  = parentView.getChildViews();
            const valuesArray = [];
          
            function findCheckedElem(){
                let nullCounter  = false;
                try{
             
                    checkboxes.forEach(function(el){
                        const value = $$(el.config.id).getValue();
                        valuesArray.push(value);
                        if (value === 1 && !nullCounter){
                            nullCounter = true;
                        }
                    });  
                } catch (err){
                    setFunctionError(err,"toolbarTable","createCheckboxes => findCheckedElem");
                }
                return nullCounter;
            }
     

            function setSelectAllState (){
                try{
                    const selectAll   = $$("selectAll");
                    const selecAllVal = selectAll.getValue();
                    let   found;
      
                    checkboxes.forEach(function(el){
                        const value = $$(el.config.id).getValue();
                        if(el.config.id !== "selectAll"){
                            valuesArray.push(value);
                        }
                    
                    });
            
                    found = valuesArray.find(element => element === 0);
                    if (found === undefined){
                        selectAll.setValue(1);
                    }

                    if (newValue == 0 && selecAllVal){
                        selectAll.setValue(0);
                    }

                } catch (err){
                    setFunctionError(err,"toolbarTable","checkboxOnChange => setSelectAllState");
                }
            }
            
    
            if (newValue !== oldValue){
                enableBtn();
                const nullCounter = findCheckedElem();
   
            
                if (!nullCounter){
                    disableBtn();
                }
           }
            // else {
            //     const nullCounter = findCheckedElem();
   
            
            //     if (!nullCounter){
            //         disableBtn();
            //     }
            // }

            setSelectAllState ();
        }


        function checkboxSelectAllLogic (newValue){
            try{

                const checkbox   = $$("selectAll");
                const parent     = checkbox.getParentView();
                const parentView = $$(parent.config.id).getChildViews();

                parentView.forEach(function(el){
                    if (el.config.id !== "selectAll"){
                        $$(el.config.id).setValue(newValue);
                    }
                });
   
            } catch (err){
                setFunctionError(err,"toolbarTable","createCheckboxes => checkboxSelectAllLogic");
            }
        }
    
        function getCheckboxArray(){

            try{
                checkboxes.push({
                    view:"checkbox", 
                    id:"selectAll",
                    name:"selectAll",
                    labelRight:"Выбрать всё",
                    labelWidth:0,
                    on:{
                        onChange:function(newValue, oldValue, config){
                         
                            if(config){
                                checkboxSelectAllLogic (newValue);
                            } 
                            // else {
                            //     if (!newValue){
                         
                            //         disableBtn();
                            //     } else {
                            //         enableBtn();
                            //     }
                            // }
                       

                        }
                    } 
                });

             
                columns.forEach(function(col){
                   
                    if(col.id !== "css_class"){
                        checkboxes.push({
                            view:"checkbox", 
                            id:col.id+"_checkbox-visible", 
                            labelRight:col.label, 
                            labelWidth:0,
                            name:col.id,
                            on:{
                                onChange:function(newValue,oldValue){
                                    checkboxOnChange(newValue,oldValue,col);
                                }
                            } 
                        });
                    }
                   
                });

                 
        
              
            } catch (err){
                setFunctionError(err,"toolbarTable","getCheckboxArray");
            }
        }

        function disableSubmitBtn(){
            const btnSubmit = $$("visibleColsSubmit");
            if (btnSubmit){
                btnSubmit.disable();
            }
        }
        function getUserprefsValues(){
            const id          = currTable.config.idTable;
            const selectAll   = $$("selectAll");
            const storageData = webix.storage.local.get("visibleColsPrefs_"+id);
            const values      = [];


            if (storageData){
                storageData.forEach(function(el){
                    console.log(el)
                    $$(el.id+"_checkbox-visible").setValue(el.value);
                    values.push(el.value);
                    disableSubmitBtn();
                });

                const found = values.find(element => element === 0);

                if (found === undefined){
                    selectAll.setValue(1);
                }
            } else {
                const parent = selectAll.getParentView();
                const childs = parent.getChildViews();

                childs.forEach(function(el){
                    $$(el.config.id).setValue(1);
                });
            }

        }

        function addCheckboxes(){
            try{
                $$("checkboxContent").addView({
                    id:"checkboxContainer",
                    rows:checkboxes,
                });
                getUserprefsValues();
            } catch (err){
                setFunctionError(err,"toolbarTable","createCheckboxes => addCheckboxes");
            }
        }

        function hideEmptyTemplate(){
            try{
                if ($$("visibleColsEmptyTempalte")){
                    $$("visibleColsEmptyTempalte").hide();
                }
            } catch (err){
                setFunctionError(err,"toolbarTable","createCheckboxes => hideEmptyTemplate");
            }
        }

        function showPopup(){
            try{
                if ($$("popupVisibleCols")){
                    $$("popupVisibleCols").show();
                }
            } catch (err){
                setFunctionError(err,"toolbarTable","createCheckboxes => showPopup");
            }
        }

        getCheckboxArray();


        if (checkboxes){
            addCheckboxes();
            hideEmptyTemplate();
        
        } 
        showPopup();

    }

    function postPrefsValues(values){
   
        const id            =   currTable.config.idTable;
        values.tableIdPrefs = id;
        let sentObj = {
            name:"visibleColsPrefs_"+id,
            prefs:values,
        };

        function saveExistsTemplate(sentObj,idPutData){
            console.log(sentObj,idPutData)
            const putData = webix.ajax().put("/init/default/api/userprefs/"+idPutData, sentObj);
    
            putData.then(function(data){
                data = data.json();
                 
                if (data.err_type !== "i"){
                    setLogValue("error","toolbarTable function saveExistsTemplate putData: "+ data.err);
                } else {
                    setStorageData("visibleColsPrefs_"+id, JSON.stringify(sentObj.prefs));
                }
            });

            putData.fail(function(err){
                setAjaxError(err, "toolbarTable","saveExistsTemplate => putUserprefsData");
            });
        } 

        function setDataStorage(){
            const whoamiData = webix.ajax("/init/default/api/whoami");
            whoamiData.then(function(data){
                sentObj.owner = data.json().content.id;

                let userData = {};
                userData.id = data.json().content.id;
                userData.name = data.json().content.first_name;
                userData.username = data.json().content.username;
                
                setStorageData("user", JSON.stringify(userData));
            });

            whoamiData.fail(function(err){
                setAjaxError(err, "filterTableForm","saveTemplate => setDataStorage");
            });

        }

        function saveNewTemplate(){
            let ownerId = webix.storage.local.get("user").id;
            if (ownerId){
                sentObj.owner = ownerId;
            } else {
                setDataStorage();
                
            }

            const userprefsPost = webix.ajax().post("/init/default/api/userprefs/",sentObj);
            
            userprefsPost.then(function(data){
                data = data.json();
     
                if (data.err_type !== "i"){
                    setFunctionError(data.err,"filterTableForm","tabbarClick")
                } else {
                    setStorageData("visibleColsPrefs_"+id, JSON.stringify(sentObj.prefs));
                }
            });

            userprefsPost.fail(function(err){
                setAjaxError(err, "toolbarTable","saveTemplate");
            });

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
                    setFunctionError(err,"toolbarTable","getUserprefsData getData");
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
        const checkboxContainer = $$("checkboxContainer");
        const checkboxes        = checkboxContainer.getChildViews();
        const checkboxesId      = [];
        const colsId            = [];
        
        function pushChecksId (){
            try{
                checkboxes.forEach(function(el){
                    if (el.config.id !== "selectAll"){
                        checkboxesId.push(el.config.id);
                    }
            
                });
            } catch (err){
                setFunctionError(err,"toolbarTable","visibleColsSubmitClick => pushChecksId");
            }
        }

        function pushValuesChecks(){
            try{
                checkboxesId.forEach(function(el){
                    const value = $$(el).getValue();
                    const index = el.indexOf("_checkbox-visible");
                    const idCol = el.slice(0,index);
                    colsId.push({id:idCol, value:value});
                });
            } catch (err){
                setFunctionError(err,"toolbarTable","visibleColsSubmitClick => pushValuesChecks");
            }
        }

        function setStateCols(el){
            try{
                if (el.value){
                    if ( !( currTable.isColumnVisible(el.id) ) ){
                        currTable.showColumn(el.id);
                    }

                } else {
                    if ( currTable.isColumnVisible(el.id) ){
                        currTable.hideColumn(el.id);
                    }
                }
            } catch (err){
                setFunctionError(err,"toolbarTable","visibleColsSubmitClick => pushValuesChecks element: "+el);
            }
        }

        function destructPopup(){
            try{
                if ($$("popupVisibleCols")){
                    $$("popupVisibleCols").destructor();
                }
            } catch (err){
                setFunctionError(err,"toolbarTable","visibleColsSubmitClick => destructPopup");
            }
        }

        pushChecksId ();

        if (checkboxesId){
           pushValuesChecks();
           postPrefsValues(colsId);
        }

      

        colsId.forEach(function(el){
            setStateCols(el);
        });


        destructPopup();
        
        setLogValue("success", "Таблица обновлена");
    }


    function createPopup(){

        const popupHeadline = {   
            template:"Видимость колонок", 
            width:250,
            css:"popup_headline", 
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
                    if ($$("popupVisibleCols")){
                        $$("popupVisibleCols").destructor();
                    }
                } catch (err){
                    setFunctionError(err,"toolbarTable","popupVisibleCols click");
                }
            
            }
        };


        const emptyTmplate = {   
            id:"visibleColsEmptyTempalte",
            css:"webix_empty-template",
            template:"В данной таблице колонки отсутствуют", 
            borderless:true
        };


        const btnSaveState = {
            view:"button",
            id:"visibleColsSubmit", 
            value:"Сохранить состояние", 
            css:"webix_primary", 
            disabled:true,
            click:function(){
                visibleColsSubmitClick();
            }
    
        };

        const scrollView = {
            view:"scrollview",
            borderless:true, 
            css:"webix_multivew-cell",
            scroll:"y", 
            body:{ 
                id:"checkboxContent",
                rows:[ emptyTmplate]
            }
        };
    
        webix.ui({
            view:"popup",
            id:"popupVisibleCols",
            css:"webix_popup-prev-href",
            width:400,
          //  minHeight:300,
            maxHeight:400,
            modal:true,
          
            escHide:true,
            position:"center",
            body:{
                rows:[
                {rows: [ 
                    { cols:[
                        popupHeadline,
                        {},
                        btnClosePopup,
                    ]},
                    scrollView,
                    //{id:"checkboxContent", scroll:true,rows:[emptyTmplate]},
                    {height:15},
                    btnSaveState,
                ]}]
                
            },

        });
        createCheckboxes();
    }

    createPopup();

}

function exportToExcel(idTable){
    try{
        webix.toExcel(idTable, {
        filename:"Table",
        filterHTML:true,
        styles:true
        });
        setLogValue("success","Таблица сохранена");
    } catch (err) {   
        setFunctionError(err,"toolbarTable","exportToExcel");
    }
}

function createTemplateCounter(idEl,text){
    const view = {   
        view:"template",
        id:idEl,
        css:"webix_style-template-count",
        height:30,
        template:function () {
            if (Object.keys($$(idEl).getValues()).length !==0){
                
                return "<div style='color:#999898;'>"+text+":"+
                        " "+$$(idEl).getValues()+
                        " </div>";
            } else {
                return "";
            }
        }
    };

    return view;
}


function tableToolbar (idTable,visible=false) {

    let idExport         = idTable+"-exportBtn",
        idBtnEdit        = idTable+"-editTableBtnId",
        idFindElements   = idTable+"-findElements",
        idFilterElements = idTable+"-idFilterElements",
        idFilter         = idTable+"-filterId",
        idHeadline       = idTable+"-templateHeadline",
        idVisibleCols     = idTable+"-visibleCols"
    ;

    const editButton = {   
        view:"button",
        maxWidth:200, 
        value:"<span class='webix_icon fas fa-pen'></span><span style='padding-left: 5px'>"+
              "Редактор таблицы</span>",
        id:idBtnEdit,
        css:"webix_btn-edit",
        title:"текст",
        height:42,
        click:function(){
            editBtnClick(idBtnEdit);
        },
        on: {
            onAfterRender: function () {
                try{
                    if(idTable !== "table" && this.isVisible()){
                        this.hide();
                    }
                } catch (err) {   
                    setFunctionError(err,"toolbarTable","btn edit onAfterRender");
                }
                this.getInputNode().setAttribute("title","Редактировать таблицу");
            }
        } 
    };

    const visibleColsButton = {   
        view:"button",
        width: 50, 
        type:"icon",
        id:idVisibleCols,
        //hidden:visible,
        icon:"fas fa-table-columns",
        css:"webix_btn-download webix-transparent-btn",
        title:"текст",
        height:42,
        click:function(){
            visibleColsButtonClick(idTable);
        },
        on: {
            onAfterRender: function () {
                this.getInputNode().setAttribute("title","Показать/скрыть колонки");
            }
        } 
    };

    const downloadButton = {   
        view:"button",
        width: 50, 
        type:"icon",
        id:idExport,
        hidden:visible,
        icon:"fas fa-circle-down",
        css:"webix_btn-download webix-transparent-btn",
        title:"текст",
        height:42,
        click:function(){
            exportToExcel(idTable);
        },
        on: {
            onAfterRender: function () {
                this.getInputNode().setAttribute("title","Экспорт таблицы");
            }
        } 
    };


    return { 
        
        rows:[
            setHeadlineBlock(idHeadline),

            {
                css:"webix_filterBar",
                padding:{
                    bottom:4,
                }, 
                height: 40,
                cols: [
                    toolbarFilterBtn(idTable,idBtnEdit,idFilter,visible),
                    editButton,
                    {},
                    // visibleColsButton,
                    downloadButton,
                ],
            },

            {cols:[
                createTemplateCounter(idFindElements,  "Общее количество записей"),
                createTemplateCounter(idFilterElements,"Видимое количество записей"),
            ]},
        ]
    };
}


export{
    tableToolbar
};
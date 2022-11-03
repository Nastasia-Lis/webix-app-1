import { setLogValue }                      from '../logBlock.js';
import { STORAGE,getData }                  from "../globalStorage.js";

import { setAjaxError,setFunctionError }    from "../errors.js";

import { getComboOptions, removeElem }                  from '../commonFunctions.js';
import { showElem,hideElem }                from '../commonFunctions.js';

import { setUserPrefs }                     from '../storageSetting.js';

const logNameFile = "getContent => getInfoTable";

function submitBtn (idElements, url, verb, rtype){

    const valuesArray = [];

    function refreshButton(){

        function createQuery(){
            try{
                idElements.forEach((el,i) => {
                    const val = $$(el.id).getValue();

                    if (el.id.includes("customCombo")){
                        const textVal = $$(el.id).getText();
                        valuesArray.push (el.name + "=" + textVal);

                    } else if ( el.id.includes("customInputs")     || 
                                el.id.includes("customDatepicker") ){
                        valuesArray.push ( el.name + "=" + val );

                    }   
                });
            } catch (err){  
                setFunctionError(err,logNameFile,"refreshButton => createQuery");
            }
        }
  
        createQuery();

        const getData = webix.ajax( url + "?" + valuesArray.join("&") );
        
        getData.then(function(data){
            const tableView = $$("table-view");
            
            function setTableState(){
                data = data.json().content;
                try{
                    tableView.clearAll();

                    
                    if (data.length !== 0){
                        tableView.hideOverlay("Ничего не найдено");
                        tableView.parse(data);
                        setLogValue("success","Данные обновлены");

                    } else {
                        tableView.showOverlay("Ничего не найдено");

                    }
                } catch (err){  
                    setFunctionError(err,logNameFile,"refreshButton => setTableState");
                }
            }

            function setTableCounter(){
                try{
                    const findElementView = $$("table-view-findElements");
                    const prevCountRows   = tableView.count().toString();

                    findElementView.setValues(prevCountRows);
                } catch (err){  
                    setFunctionError(err,logNameFile,"refreshButton => setTableCounter");
                }
            }
            if (data.json().err_type == "i"){
                setTableState();
                setTableCounter();

            } else {
                setFunctionError(data.err,logNameFile,"refreshButton");
            }
        });
        getData.fail(function(err){
            setAjaxError(err, logNameFile,"refreshButton");
        });
    }

    function downloadButton(){

        webix.ajax().response("blob").get(url, function(text, blob, xhr) {
            try {
                webix.html.download(blob, "table.docx");
            } catch (err){
                setFunctionError(err,logNameFile,"downloadButton");
            } 
        }).catch(err => {
            setAjaxError(err, logNameFile,"downloadButton");
        });
    }

    function postButton(){

        async function uploadData(formData,link){
            fetch(link, {
                method  : "POST", 
                body    : formData
            })  
   
            .then(( response ) => response.json())
            .then(function( data ){
                const loadEl = $$("templateLoad");
       
                if ( data.err_type == "i" ){
                    loadEl.setValues( "Файл загружен" );
                    setLogValue( "success","Файл успешно загружен" );

                } else {
                    loadEl.setValues( "Ошибка" );
                    setLogValue( "error", data.err );
                }
            })
            
            .catch(function(err){
                setFunctionError(err,logNameFile,"uploadData");
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
            setFunctionError(err,logNameFile,"postButton");
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

function createTableRows (idCurrTable,idsParam, offset=0){
    const dataContent  = STORAGE.fields.content;
    const data         = dataContent[idsParam];

    const itemTreeId   = idsParam;

    let idFindElem;

    if (idCurrTable.includes("view")){
        idFindElem  = "table-view-findElements";
    } else {
        idFindElem  = "table-findElements";
    }


    function getItemData (table){

        function setTableState(){
            function enableBtn(btn){
                try{
                    if(!(btn.isEnabled())){
                        btn.enable();
                    }
                } catch (err){
                    setFunctionError(err,logNameFile,"createTableRows => setTableState")
                }
            }
         
            if (table == "table"){
                enableBtn ($$("table-newAddBtnId"));
                enableBtn ($$("table-filterId"   ));
                enableBtn ($$("table-exportBtn"  ));

            }
      
        }

        function datePrefs (data){
 
            let dateFormat;

            const columns  = $$(table).getColumns();
            const dateCols = [];

            function searchDateCols (){
                try{
                    columns.forEach(function(col,i){
                        if ( col.type == "datetime" ){
                            dateCols.push( col.id );
                        }
                    });
                } catch (err){
                    setFunctionError(err,logNameFile,"createTableRows => searchDateCols")
                }
            }
            searchDateCols ();
        
            data.forEach(function(el,i){

                function dateFormatting ( elType ){
                
                    if ( el[elType] ){
                        dateFormat = new Date( el[elType] );
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
           
            if (!offset){
                idCurrView.clearAll();
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
                    disableBtn (viewBtn);
                } else if ( btn.isVisible() ){
                    disableBtn (btn);
                }
              
            }

            function formattingBoolVals(){
                const cols     = idCurrView.getColumns();
                const boolsArr = [];

                const boolKeys = [];

                cols.forEach(function(el,i){
                    if (el.type == "boolean"){
                        boolsArr.push(el.id);
                    }
                });

                function findBool(key){
                    let check = false;
                    boolsArr.forEach(function(el,i){
                        if (el == key){
                            check = true;
                        } 
                    });
               
                    return check;
                }

           
                function findKey(){
                    const cols = idCurrView.getColumns();
                    cols.forEach(function(key,i){
                    
                        if(findBool(key.id)){
                            boolKeys.push(key.id);
                        }
                    });
            
                }
                findKey  ();


                function returnVal(element){
                    boolKeys.forEach(function(el,i){
                        if ( element[el] == false ){
                            element[el] = 2;
                        } else {
                            element[el] = 1;
                        }
                    });
   
                }

                data.forEach(function(el,i){
                    returnVal(el);
                });

            }
            formattingBoolVals();


            function checkNotUnique(idAddRow){

                Object.values(idCurrView.data.pull).forEach(function(el,i){
            
                    if ( el.id == idAddRow ){
                        idCurrView.remove(el.id);
                    }
                });
            }


            try{
                if ( !offset ){
                    if (data.length !== 0){
                        idCurrView.hideOverlay("Ничего не найдено");
                        idCurrView.parse(data);
               
                    } else {
                        idCurrView.showOverlay("Ничего не найдено");
                        idCurrView.clearAll();
                    }
                
                    setTimeout(() => {
                        enableVisibleBtn();
       
                    }, 1000);
                } else {
           
                
                    data.forEach(function(el,i){
                        checkNotUnique(el.id);
                        idCurrView.add(el);
                    });
                }
           
            } catch (err){
                setFunctionError(err,logNameFile,"createTableRows => parseRowData");
            }
        }


        function setCounterVal (data){
            try{
                const prevCountRows = data;
                $$(idFindElem).setValues(prevCountRows);
                
                if(idCurrTable == "table"){
                    $$("table-findElements").setValues(prevCountRows);
                }
            } catch (err){
                setFunctionError(err,logNameFile,"createTableRows => setCounterVal");
            }
        }



        const tableElem = $$(table);
        const limitLoad = 80;
        const firstCol = tableElem.getColumns()[0].id;

        function returnFilter(){
            const filterString = tableElem.config.filter;

            let filter;
            if (filterString){
                filter = filterString;
            } else {
                filter = itemTreeId +'.id+%3E%3D+0';
        
            }
            return filter;
        }

        function returnSort(){
            let sort;

            const sortCol  = tableElem.config.sort.idCol;
            const sortType = tableElem.config.sort.type;
        
            if (sortCol){
                if (sortType == "desc"){
                    sort = "~" + itemTreeId + '.' + sortCol;
                } else {
                    sort =       itemTreeId + '.' + sortCol;
                }
            } else {
                    sort =       itemTreeId + '.' + firstCol;
            }

            return sort;
        }
      
        function loadTableData(){
            tableElem.load({
                $proxy : true,
                load   : function(view, params){
                    const filter = returnFilter();
                    const sort   = returnSort  ();

                    const query = [ "query=" + filter, 
                                    "sorts=" + sort, 
                                    "limit=" + limitLoad, 
                                    "offset="+ offset
                    ];

              
                    let url;
                    const tableType = tableElem.config.id;
                    if (tableType == "table"){
                        url = "/init/default/api/smarts?"+ query.join("&");
                    } else {
                        url = "/init/default/api/" + itemTreeId;
                    }

                    const getData = webix.ajax().get( url );

                    getData.then(function(data){
                        data = data.json();

                        
                        if ( !offset && tableType == "table" ){
                            tableElem.config.reccount  = data.reccount;
                            tableElem.config.idTable   = itemTreeId;
                            tableElem.config.limitLoad = limitLoad;
                            setCounterVal (data.reccount.toString());
                        }

                        if( tableType == "table-view" ){
                            tableElem.config.idTable   = itemTreeId;
                            setCounterVal (data.content.length.toString());
                        }

                        data  = data.content;

                        try {
                            setTableState ();
                            datePrefs     (data);
                            parseRowData  (data);
                        
                        
                        } catch (err){
                   
                            setFunctionError(err,logNameFile,"getItemData => table load");
                        } 
                    
                    });
                    
                    getData.fail(function(err){

                        function tableErrorState (){
                            const prevCountRows = "-";
                            function disableBtn(btn){
                                if(btn){
                                    btn.disable();
                                }
                            }
                            try {
                                $$(idFindElem)          .setValues(prevCountRows.toString());
                                $$("table-findElements").setValues(prevCountRows.toString());
        
                                disableBtn ($$("table-newAddBtnId"));
                                disableBtn ($$("table-filterId"   ));
                                disableBtn ($$("table-exportBtn"  ));
                         
  
                          
                            } catch (err){
                                setFunctionError(err,logNameFile,"tableErrorState");

                            }
                        }

                        function notAuthPopup(){
                
                            function destructPopup(){
                                try{
                                    const popup = $$("popupNotAuth");
                                    if (popup){
                                        popup.destructor();
                                    }
                                } catch (err){
                                    setFunctionError(err,logNameFile,"notAuthPopup btnClosePopup click");
                                }
                            }
                            const popupHeadline = {   
                                template    : "Вы не авторизованы", 
                                width       : 250,
                                css         : "webix_template-not-found", 
                                borderless  : true, 
                                height      : 20 
                            };
                            const btnClosePopup = {
                                view  : "button",
                                id    : "buttonClosePopup",
                                css   : "popup_close-btn",
                                type  : "icon",
                                width : 35,
                                icon: 'wxi-close',
                                click:function(){
                                    destructPopup();
                                }
                            };
            
                            const popupSubtitle = {   
                                template    : "Войдите в систему, чтобы продолжить.",
                                css         : "webix_template-not-found-descr", 
                                borderless  : true, 
                                height      : 35 
                            };
            
                            const mainBtnPopup = {
                                view    : "button",
                                css     : "webix_btn-go-login",
                                height  : 46,
                                value   : "Войти",
                                click   : function(){
                                    function navigate(){
                                        try{
                                            Backbone.history.navigate("/", { trigger:true});
                                            window.location.reload();
                                        } catch (err){
                                            setFunctionError(err,logNameFile,"notAuthPopup navigate");
                                        }
                                    }
                                    destructPopup();
                                    navigate();
                                 
                               
                                }
                            };
            
                            webix.ui({
                                view    : "popup",
                                id      : "popupNotAuth",
                                css     : "webix_popup-prev-href",
                                width   : 340,
                                height  : 125,
                                modal   : true,
                                position: "center",
                                body    : {
                                    rows: [
                                    {rows: [ 
                                        { cols: [
                                            popupHeadline,
                                            {},
                                            btnClosePopup,
                                        ]},
                                        popupSubtitle,
                                        mainBtnPopup,
                                        { height : 20 }
                                    ]}]
                                    
                                },
            
                            }).show();
                        }

                        tableErrorState ();

                        if (err.status == 401){
                    
                            if (!($$("popupNotAuth"))){
                                notAuthPopup();
                            }
                      
                        } 

                        setAjaxError(err, "getInpoTable","getData");
                    });

                }
            });
        }

        const reccount = tableElem.config.reccount;

        if (reccount){
            const remainder = reccount - offset;

            if (remainder > 0){
                loadTableData(); 
            }

        } else {
            loadTableData(); 
        }

       
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

            const userprefsOther = webix.storage.local.get("userprefsOtherForm");
            let counter;

            if (userprefsOther){
                counter = userprefsOther.autorefCounterOpt;
            }

            if ( userprefsOther && counter !== undefined ){
                if ( counter >= 15000 ){

                    setInterval(function(){
                        if( data.type == "dbtable" ){
                            getItemData ("table");
                        } else if ( data.type == "tform" ){
                            getItemData ("table-view");
                        }
                    }, counter );
                } else {
                    setInterval(function(){
                        if( data.type == "dbtable" ){
                            getItemData ("table");
                        } else if ( data.type == "tform" ){
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

function getInfoTable (idCurrTable,idsParam) {
 
    let filterBar,
        titem
    ;

    function getValsTable (){
        titem = $$("tree").getItem(idsParam);

        if (!titem){
            titem = idsParam;
        }

        try{ 
            if (idCurrTable.includes("view")){
            
                filterBar = $$("table-view-filterId").getParentView();
            
            } else {
                filterBar = $$("table-filterId").getParentView();
              
            }
        } catch (err){  
            setFunctionError(err,logNameFile,"getValsTable");
        }
    }

    function preparationTable (){
        try{
            $$(idCurrTable).clearAll();

            if (idCurrTable == "table-view"){
                const popup       = $$("contextActionsPopup");
                const btnAdaptive = $$("contextActionsBtnAdaptive");
                const inputs      = $$( "customInputs" );
                const inputsMain  = $$("customInputsMain");
                
                
                if (popup){
                    popup.destructor();
                }
      
                
                if (btnAdaptive){
                    filterBar.removeView(btnAdaptive);
                }

                if (inputs){
                    const parent = inputs.getParentView();
                    parent.removeView(inputs);
                }

                if (inputsMain){
                    const parent = inputsMain.getParentView();
                    parent.removeView(inputsMain);
                }
            
            }
        } catch (err){  
            setFunctionError(err,logNameFile,"preparationTable");
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
        const table         = $$(idCurrTable);
 
        let fieldType;
     
        function refreshCols(columnsData){
            if(table){
                table.refreshColumns(columnsData);
            }
        }


        function setColsUserSize(storageData){
           
            storageData.values.forEach(function (el,i){
                table.setColumnWidth(el.column, el.width);
            });        
        }

        function getUserPrefs(){
   
            const storageData = webix.storage.local.get("visibleColsPrefs_"+idsParam);

            if ( storageData && storageData.values.length ){
                setColsUserSize(storageData);  
            }

            function setColsSize(col){
                let countCols;
                let containerWidth;
          
                if(storageData && storageData.values.length){
                    countCols  = storageData.values.length;
                } else {
                    const cols = table.getColumns(true);
                    countCols  = cols .length;
                }

                containerWidth = window.innerWidth - $$("tree").$width - 25;

                const tableWidth = containerWidth-17;
                const colWidth   = tableWidth / countCols;

                table.setColumnWidth(col, colWidth);
            }
            
            function findUniqueCols(col){
                let result = false;
    
                storageData.values.forEach(function(el){
            
                    if (el.column == col){
                        result = true;
                    }

                });
                return result;
            }

            const allCols = table.getColumns(true);
            if( storageData && storageData.values.length ){

   
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

                storageData.values.forEach(function(el){
                    table.moveColumn(el.column,el.position);
                        
                });

            } else {   
             
                allCols.forEach(function(el,i){
                    setColsSize(el.id);  
                });
               
            }
    
            
        }

        try{
            colsName.forEach(function(data) {
                fieldType = dataFields[data].type;

                function createReferenceCol (){
                    try{
                        const findTableId           = fieldType.slice(10);
                        dataFields[data].editor     = "combo";
                        dataFields[data].collection = getComboOptions (findTableId);
                        dataFields[data].template   = function(obj, common, val, config){
                            const item = config.collection.getItem(obj[config.id]);
                            return item ? item.value : "";
                        };
                    }catch (err){
                        setFunctionError(err, logNameFile, "createTableCols => createReferenceCol")
                    }
                }

                function createDatetimeCol  (){
                    try{
                        dataFields[data].format = webix.Date.dateToStr("%d.%m.%Y %H:%i:%s");
                        dataFields[data].editor = "date";
                    }catch (err){
                        setFunctionError(err, logNameFile, "createTableCols => createDatetimeCol")
                    }
                }
                
                function createTextCol      (){
                    try{
           
                        dataFields[data].editor = "text";
                        dataFields[data].sort   = "string";
                    }catch (err){
                        setFunctionError(err,logNameFile,"createTableCols => createTextCol")
                    }
                }
                function createIntegerCol   (){
                    try{
            
                        dataFields[data].editor         = "text";
                        dataFields[data].sort           = "int";
                        dataFields[data].numberFormat   = "1 111";
                    }catch (err){
                        setFunctionError(err,logNameFile,"createTableCols => createIntegerCol");
                    }
                }
                function createBoolCol      (){
                    try{
                        dataFields[data].editor     = "combo";
                        dataFields[data].sort       = "text";
                        dataFields[data].collection = [
                            {id : 1, value : "Да" },
                            {id : 2, value : "Нет"}
                        ];
                    }catch (err){
                        setFunctionError(err,logNameFile,"createTableCols => createBoolCol");
                    }
                }
                
                if (fieldType.includes("reference")){
                    createReferenceCol();
                } else if ( fieldType == "datetime"){
                    createDatetimeCol ();
                } else if ( fieldType == "boolean"){
                    createBoolCol     ();
                } else if ( fieldType == "integer" || fieldType == "id"){
                    createIntegerCol  ();
                } else {
                    createTextCol     ();
                }


                function setIdCol       (){
                    dataFields[data].id         = data;
                }

                function setFillCOl     (){
             
                    const length     = Object.values(dataFields).length;
                    const tableWidth = $$("tableContainer").$width-17;
                    const colWidth   = tableWidth/length;
               
                    dataFields[data].width  = colWidth;
                }

                function setHeaderCol   (){
                    dataFields[data].header     = dataFields[data]["label"];
              
                }

                function userPrefsId    (){
                    const setting = webix.storage.local.get("userprefsOtherForm");

                    if( setting && setting.visibleIdOpt == "2" ){
                        dataFields[data].hidden = true;
                    }
                }  

           


                function pushColsData(){ 
               
                    try{        
                        if (dataFields[data].label){
                            columnsData.push(dataFields[data]);
                        }
        
                    } catch (err){
                        setFunctionError(err,logNameFile,"createTableCols => pushColsData");
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

            getUserPrefs();

 
        } catch (err){
            setFunctionError(err,logNameFile,"createTableCols");
        }


        return columnsData;
    }

    function createDetailAction (columnsData){
        let idCol;
        let actionKey;
        let checkAction     = false;

        const dataContent   = STORAGE.fields.content;
        const data          = dataContent[idsParam];
        const table         = $$(idCurrTable);

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
                const columns = table.config.columns;
                columns.splice(0,0,{ 
                    id      :"action-first"+idCol, 
                    maxWidth:130, 
                    src     :urlFieldAction, 
                    css     :"action-column",
                    label   :"Подробнее",
                    header  :"Подробнее", 
                    template:"<span class='webix_icon wxi-angle-down'></span> "
                });

                table.refreshColumns();
            }
        }
    

    }

    function createDynamicElems (){
        const dataContent       = STORAGE.fields.content;
        const data              = dataContent[idsParam];  
        const dataInputsArray   = data.inputs;
      
        function generateCustomInputs (){  
            const customInputs  = [];
            const objInuts      = Object.keys(data.inputs);

            function createTextInput    (el,i){
                return {   
                    view            : "text",
                    placeholder     : dataInputsArray[el].label, 
                    id              : "customInputs"+i,
                    height          : 48,
                    labelPosition   : "top",
                    on              : {
                        onAfterRender: function () {
                            this.getInputNode().setAttribute("title",dataInputsArray[el].comment);
                        },
                        onChange:function(){
                            const inputs = $$("customInputs").getChildViews();

                            inputs.forEach(function(el,i){
                                const view = el.config.view;
                                const btn  = $$(el.config.id);

                                if (view == "button" && !( btn.isEnabled() )){
                                    btn.enable();
                                }
                            });
    
                        }
                    }
                }
            }
    
            function getOptionData      (dataInputsArray,el){
                const url = "/init/default/api/" + dataInputsArray[el].apiname;

                return new webix.DataCollection({url:{
                    $proxy:true,
                    load: function(){
                        return ( webix.ajax().get(url).then(function (data) {   
                                
                            const dataSrc     = data.json().content;
                            const dataOptions = [];
                            let optionElement;

                            function dataTemplate(i,valueElem){
                            const template = { 
                                    id    : i + 1, 
                                    value : valueElem
                                };
                            return template;
                            }
            
                            function createOptions(){
                                try{
                                    if ( dataSrc[0].name !== undefined ){
                                        
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
                                    setFunctionError(err,logNameFile,"generateCustomInputs => getOptionData")
                                } 
                            }

                            createOptions();

                            return dataOptions;

                        }).catch(err => {
                            console.log(err);
                            setAjaxError(err,logNameFile,"generateCustomInputs => getOptionData");
                            
                        }));
                        
                    
                        
                    }
                }});
            }
    
            function createSelectInput  (el,i){
            
                return   {   
                    view          : "combo",
                    height        : 48,
                    id            : "customCombo"+i,
                    placeholder   : dataInputsArray[el].label, 
                    labelPosition : "top", 
                    options       : {
                        data : getOptionData ( dataInputsArray, el )
                    },
                    on: {
                        onAfterRender: function () {
                            this.getInputNode().setAttribute( "title", dataInputsArray[el].comment );
                        },
                    }               
                };
            }
    
            function createDeleteAction (i){
                const table     = $$(idCurrTable);
                const countCols = table.getColumns().length;
                const columns   = table.config.columns;
   
                try{
                    columns.splice (countCols, 0 ,{ 
                        id      : "action"+i, 
                        header  : "Действие",
                        label   : "Действие",
                        css     : "action-column",
                        maxWidth: 100, 
                        template: "{common.trashIcon()}"
                    });
        
                    table.refreshColumns();

                } catch (err){
                    setFunctionError(err,logNameFile,"generateCustomInputs => createDeleteAction")
                } 

            }

            function getInputsId        (element){
                const parent     = element.getParentView();
                const childs     = parent .getChildViews();
                const idElements = [];

                try{
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
                } catch (err){
                    setFunctionError(err,logNameFile,"generateCustomInputs => getInputsId");
                } 
                return idElements;
            }
    
            function createDeleteBtn    (el,findAction,i){
                return {   
                    view        : "button", 
                    id          : "customBtnDel"+i,
                    css         : "webix_danger", 
                    type        : "icon", 
                    disabled    : true,
                    icon        : "icon-trash",
                    inputWidth  : 55,
                    inputHeight : 35,
                    value       : dataInputsArray[el].label,
                    click       : function (id) {
                        const idElements = getInputsId (this);
                        submitBtn( idElements, findAction.url, "delete" );
                    },
                    on          : {
                        onAfterRender: function () {
                            this.getInputNode().setAttribute( "title", dataInputsArray[el].comment );
                        },
                    },
                };
            }
    
            function createCustomBtn    (el,findAction,i){
                return {   
                    view        : "button", 
                    css         : "webix_primary", 
                    id          : "customBtn"+i,
                    inputHeight : 35,
                    value       : dataInputsArray[el].label,
                    click       : function (id) {
                        const idElements = getInputsId (this);
                        const btn        =  $$("contextActionsPopup");

                        if (findAction.verb== "GET"){
                            if ( findAction.rtype == "refresh") {
                                submitBtn( idElements, findAction.url, "get", "refresh" );
                            } else if (findAction.rtype == "download") {
                                submitBtn( idElements, findAction.url, "get", "download");
                            }
                            
                        } else if ( findAction.verb == "POST" ){
                            submitBtn( idElements, findAction.url, "post" );
                            $$("customBtn" + i ).disable();
                        } 
                        else if (findAction.verb == "download"){
                            submitBtn( idElements, findAction.url, "get", "download", id );
                        }
                            
                        if (btn){
                            btn.hide();
                        }
                    
                    },
                    on: {
                        onAfterRender: function () {
                            this.getInputNode().setAttribute( "title", dataInputsArray[el].comment );
                        },
                    },
                };
            }
    
            function createUpload       (el,i){
                return  {   
                    view         : "uploader", 
                    value        : "Upload file", 
                    id           : "customUploader"+i,
                    height       : 48,
                    autosend     : false,
                    upload       : data.actions.submit.url,
                    label        : dataInputsArray[el].label, 
                    labelPosition: "top",
                    on: {
                        onAfterRender: function () {
                            this.getInputNode().setAttribute( "title", dataInputsArray[el].comment );

                            const parent = this  .getParentView();
                            const childs = parent.getChildViews();

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
                            const parent = this  .getParentView();
                            const childs = parent.getChildViews();

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
                    view         : "datepicker",
                    format       : "%d.%m.%Y %H:%i:%s",
                    placeholder  :dataInputsArray[el].label,  
                    id           :"customDatepicker"+i, 
                    timepicker   : true,
                    labelPosition:"top",
                    height       :48,
                    on           : {
                        onAfterRender: function () {
                            this.getInputNode().setAttribute( "title", dataInputsArray[el].comment );
                        },
                        onChange:function(){
                            try{
                                const inputs = $$("customInputs").getChildViews();
                                inputs.forEach(function(el,i){
                                    const btn  = $$(el.config.id);
                                    const view = el.config.view;
                                    if ( view == "button" && !(btn.isEnabled()) ){
                                        btn.enable();
                                    }
                                });
                            } catch (err){
                                setFunctionError(err,logNameFile,"generateCustomInputs => createDatepicker onChange");
                            } 
    
                        }
                    }
                };
            }
            
            function createCheckbox     (el,i){
                return {   
                    view       : "checkbox", 
                    id         : "customСheckbox"+i, 
                    css        : "webix_checkbox-style",
                    labelRight : dataInputsArray[el].label, 
                    on         : {
                        onAfterRender: function () {
                            this.getInputNode().setAttribute("title",dataInputsArray[el].comment);
                        },
    
                        onChange:function(){
                            try{
                                const inputs = $$("customInputs").getChildViews();
                                inputs.forEach(function(el,i){
                                    const view = el.config.view;
                                    const btn  = $$(el.config.id);
                                    if (view == "button" && !(btn.isEnabled())){
                                        btn.enable();
                                    }
                                });
                            } catch (err){
                                setFunctionError(err,logNameFile,"generateCustomInputs => createCheckbox onChange");
                            } 
                        }
                    }
                };
            }


            objInuts.forEach((el,i) => {

                if ( dataInputsArray[el].type == "string" ){
                    customInputs.push(
                        createTextInput(el,i)
                    );
                } else if ( dataInputsArray[el].type == "apiselect" ) {
                   
                    customInputs.push(
                        createSelectInput(el,i)
                    );

                } else if ( dataInputsArray[el].type == "submit" || 
                            dataInputsArray[el].type == "button" ){

                    const actionType = dataInputsArray[el].action;
                    const findAction = data.actions[actionType];
                
                    if ( findAction.verb == "DELETE" && actionType !== "submit" ){
                        createDeleteAction (i);
                    } else if ( findAction.verb == "DELETE" ) {
                        customInputs.push(
                            createDeleteBtn(el, findAction,i)
                        );
                    } else {
                        customInputs.push(
                            createCustomBtn(el, findAction,i)
                                
                        );
                    }
                } else if ( dataInputsArray[el].type == "upload" ){
                    customInputs.push(
                        createUpload(el,i)
                    );
                } else if ( dataInputsArray[el].type == "datetime" ){
                    customInputs.push(
                        createDatepicker(el,i)
                    );
                }else if ( dataInputsArray[el].type == "checkbox" ){
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
                    id  : "customInputs",
                    css : "webix_custom-inp", 
                    rows: [
                        { height : 20 },
                        { rows : customInputs }
                    ],
                    width:350,
                };

           
                function addInputs(){
                   
                    try{
                        $$("viewToolsContainer").addView( inpObj,0 );
                  
                    } catch (err){
                        setFunctionError(err,logNameFile,"adaptiveCustomInputs => addInputs");
                    } 
                }
                addInputs();

            }

            function removeContextBtn(){
                try{
                    const btn = $$("contextActionsBtn");
                    if (btn){
                        $$(filterBar.config.id).removeView(btn);
                    }
                } catch (err){
                    setFunctionError(err,logNameFile,"adaptiveCustomInputs => removeContextBtn");
                } 
            }
            removeContextBtn();

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

            const viewToolsBtn  = $$("viewToolsBtn");
            if (data.inputs){  
                let customInputs;
           
                customInputs        = generateCustomInputs ();
                const filterBar     = $$("table-view-filterId").getParentView();

                const btnTools = {   
                    view    : "button",
                    width   : 50, 
                    type    : "icon",
                    id      : "viewToolsBtn",
                    icon    : "icon-filter",
                    css     : "webix_btn-filter webix-transparent-btn",
                    title   : "текст",
                    height  : 42,
                    click   : function(){
                        viewToolsBtnClick();
                    },
                    on: {
                        onAfterRender: function () {
                            this.getInputNode().setAttribute("title","Показать/скрыть доступные дейсвтия");
                        }
                    } 
                };
                
                if( !viewToolsBtn ){
                    filterBar.addView( btnTools, 2 );
                } else {
                    showElem( viewToolsBtn );
                }

                maxInputsSize ( customInputs );

            } else {
              
                hideElem( tools );
                hideElem( viewToolsBtn );
              
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
            const columnsData = createTableCols ();

            createDetailAction (columnsData);
            createDynamicElems ();
          
            createTableRows (idCurrTable,idsParam);
           
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

export{
    getInfoTable,
    createTableRows
};
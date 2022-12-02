import { setLogValue }                      from '../../../../logBlock.js';
import { setAjaxError, setFunctionError }   from "../../../../../blocks/errors.js";

const logNameFile = 
"table => createSpace => dynamicElements => buttonLogic";

let idElements;
let url;
let verb;
let rtype;

const valuesArray = [];

function createQueryRefresh(){
    try{
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
    } catch (err){  
        setFunctionError(
            err, 
            logNameFile, 
            "createQueryRefresh"
        );
    }
}

function setTableState(tableView, data){
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
            "setTableState"
        );
    }
}

function setTableCounter(tableView){
    try{
        const findElementView = $$("table-view-findElements");
        const prevCountRows   = tableView.count().toString();

        findElementView.setValues(prevCountRows);
    } catch (err){  
        setFunctionError(err, logNameFile, "setTableCounter");
    }
}

function refreshButton(){
    createQueryRefresh();
    const path    = url + "?" + valuesArray.join("&");
    const getData = webix.ajax(path);
    
    getData.then(function(data){
        const tableView = $$("table-view");
        data            = data.json().content;
  
        if (data.json().err_type == "i"){
            setTableState   (tableView, data);
            setTableCounter (tableView);

        } else {
            setFunctionError(
                data.err, 
                logNameFile, 
                "refreshButton"
            );
        }
    });

    getData.fail(function(err){
        setAjaxError(
            err, 
            logNameFile,
            "refreshButton"
        );
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

export {
    submitBtn
};
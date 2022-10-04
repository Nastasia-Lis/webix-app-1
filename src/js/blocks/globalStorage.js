import {setLogValue} from "./logBlock.js";

const STORAGE = {};

function getTableNames (content){
    let tableNames = [];
    Object.values(content).forEach(function(el,i){
        tableNames.push({id:Object.keys(content)[i], name:(el.plural) ? el.plural : el.singular})
    });
    return tableNames;
}


function checkNotAuth (err){
    console.log('kkk')
    if (err.status === 401 && window.location.pathname !== "/index.html"  && window.location.pathname !== "/init/default/spaw/"){
        Backbone.history.navigate("/", { trigger:true});
    }
}

function getData (fileName){
    if (    window.location.pathname !== "/index.html"          &&  
            window.location.pathname !== '/init/default/spaw'
        ){
        return webix.ajax().get(`/init/default/api/${fileName}.json`)
            .then(function (data) {
                STORAGE[fileName] = data.json();
                if (fileName == "fields" && STORAGE[fileName]){
                    STORAGE.tableNames = getTableNames (STORAGE[fileName].content);
                }
                return STORAGE[fileName];
            }).catch(err => {
                console.log(err);
                setLogValue("error", 
                    "Загрузка данных: " + 
                    err.statusText + " " + 
                    err.status + " " + 
                    err.responseURL + 
                    " ( Подробности: " + err.responseText+ ") "
                );
              
                checkNotAuth (err);
            }
        );
    }
    
}

export{
    getData,
    STORAGE,
};
import { setAjaxError, 
         setFunctionError }     from "../../../../blocks/errors.js";
         
import { setLogValue }          from "../../../logBlock.js";
import { mediator }             from "../../../../blocks/_mediator.js";

const logNameFile = "table => createSpace => click => navigate";

function createSentObj(prefs){
    const sentObj = {
        name    : "dashboards_context-prefs",
        prefs   : prefs,
    };

    const ownerId = webix.storage.local.get("user").id;

    if (ownerId){
        sentObj.owner = ownerId;
    }

    return sentObj;
}


function returnConditions(filter){
    const array = filter.split(' ');

    const conditions = [];
    let r            = "";
    let counter      = 0;

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
   

    return conditions;
}



const filterArr = [];
const ids       = [];


function setInputValue(value){
    let trueValue;
    if (value){
        trueValue = value.replace(/['"]+/g, '');
    }

    return trueValue;
  
}

function checkCondition(arr, index){
    let parent  = null;
   
    let id      = arr[1];
    const i     = id.lastIndexOf(".") + 1;
    id          = id.slice(i);

    let logic   = arr[4];
    const value = setInputValue(arr[3]);

    ids.push(id);
  
    const isUnique = ids.filter(elem => elem == id);

    if (isUnique.length > 1){ // isnt unique

        parent  = id; 
        id      = id + "_filter-child-"+ webix.uid();

    } else {
        id = id + "_filter";
    }


    if (logic == "and"){
        logic = "1";
    } else {
        logic = "2";
    }
    
 
    
    filterArr.push({
        id        : id,
        value     : value,
        operation : arr[2],
        logic     : logic,
        parent    : parent,
        index     : index
    });
}


function iterateConditions(conditions){

    conditions.forEach(function(el, i){
        const arr = el.split(' ');
        checkCondition(arr, i);
     
    });

    return filterArr;

}



function returnFilter(query){

    const conditions = returnConditions(query);
 
    iterateConditions(conditions);
}

function navigate(field, id, filter){
 

    filterArr.length = 0;
    ids.length       = 0;

    if (id){

        returnFilter(filter);
    
        const infoData = {
            tree:{
                field : field,
                type  : "dbtable" // ??
            },
            temp:{
                filter     : {
                    id     : field, 
                    values : {values : filterArr}
                },
                queryFilter :  filter
            }
        };

        mediator.tabs.openInNewTab(infoData);

    } 
}

function postPrefs(chartAction){
    const sentObj       = createSentObj(chartAction);
    const path          = "/init/default/api/userprefs/";
    const userprefsPost = webix.ajax().post(path, sentObj);
      
    userprefsPost.then(function(data){
        data = data.json();
   
        if (data.err_type == "i"){
            const id = data.content.id;
            if (id){
                navigate(chartAction.field, id, chartAction.params.filter);
            } else {
                const errs   = data.content.errors;
                const values = Object.values(errs);
                const keys   = Object.keys  (errs);

                values.forEach(function(err, i){
                    setFunctionError(
                        err + " - " + keys[i] , 
                        logNameFile, 
                        "postPrefs"
                    );
                });
               
            }
          

        } else {
            setLogValue("error", data.error);
        }
    });

    userprefsPost.fail(function(err){
        setAjaxError(
            err, 
            logNameFile,
            "postPrefs"
        );
    });
}

export {
    postPrefs
};
import { mediator }             from "../../../../blocks/_mediator.js";


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

function navigate(field, filter){
 

    filterArr.length = 0;
    ids.length       = 0;

    if (field){

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



export {
    navigate
};
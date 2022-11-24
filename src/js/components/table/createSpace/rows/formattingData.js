import { setFunctionError }   from "../../../../blocks/errors.js";
const logNameFile = "table => createSpace => formattingData";

let idCurrView;

// date

function findDateCols (columns){
    const dateCols = [];
    try{
        columns.forEach(function(col,i){
            if ( col.type == "datetime" ){
                dateCols.push( col.id );
            }
        });
    } catch (err){
        setFunctionError(err, logNameFile, "findDateCols");
    }

    return dateCols;
}

function changeDateFormat (data, elType){
    data.forEach(function(el){
        if ( el[elType] ){
            const dateFormat = new Date( el[elType] );
            el[elType]       = dateFormat;
            
        }
    });
}

function formattingDateVals (table, data){

    const columns  = $$(table).getColumns();
    const dateCols = findDateCols (columns);

    function setDateFormatting (){
        dateCols.forEach(function(el,i){
            changeDateFormat (data, el);
        });
    }

    setDateFormatting ();
     
   
}



// boolean

function findBoolColumns(cols){
    const boolsArr = [];

    cols.forEach(function(el,i){
        if (el.type == "boolean"){
            boolsArr.push(el.id);
        }
    });

    return boolsArr;
}

 

function isBoolField(cols, key){
    const boolsArr = findBoolColumns(cols);
    let check      = false;
    boolsArr.forEach(function(el,i){
        if (el == key){
            check = true;
        } 
    });

    return check;
}


function getBoolFieldNames(){
    const boolKeys = [];
    const cols     = idCurrView.getColumns(true);

    cols.forEach(function(key){
    
        if( isBoolField(cols, key.id)){
            boolKeys.push(key.id);
    
        }
    });

    return boolKeys;
}

function setBoolValues(element){
    const boolFields = getBoolFieldNames();

    boolFields.forEach(function(el){
 
        if (element[el] !== undefined){
            if ( element[el] == false ){
                element[el] = 2;
            } else {
                element[el] = 1;
            }
        }
      
    });

}

function formattingBoolVals(id, data){
    idCurrView = id;

    data.forEach(function(el,i){
        setBoolValues(el);
    });

}

export {
    formattingBoolVals,
    formattingDateVals,
};
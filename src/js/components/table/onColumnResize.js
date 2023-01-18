
let cols;
let lengthCols;

function returnCol(index){
    const currIndex = lengthCols - index;
    return cols[currIndex];
}

function returnSumWidthCols(){
    let sum = 0;
    
    if (cols && cols.length){
        cols.forEach(function(col){
            sum += col.width;
        });
    }
 
    return sum;
}

function setNewWidth(table){
    const lastCol      = returnCol(1);
    const scrollWidth  = 17;
    const widthTable   = table.$width - scrollWidth;
    const sumWidthCols = returnSumWidthCols();
    
    if (sumWidthCols < widthTable && lastCol){
        const different = widthTable - sumWidthCols;
        const newWidth  = lastCol.width + different;
        
        table.setColumnWidth(lastCol.id, newWidth);

    }
}


function columnResize(table){

    table.attachEvent("onColumnResize", function(id, newWidth, oldWidth, userAction){
  
        cols       = table.getColumns();
        lengthCols = cols.length;
  
        if (userAction){
            const lastResizer = 2;
            const isExists    = lengthCols - lastResizer;
            const prevCol     = returnCol(lastResizer);
         
        //    if ( isExists > -1 && prevCol.id == id){ // это последняя колонка
                setNewWidth(table);
               
           // }
        }

    });
}

export {
    columnResize
};
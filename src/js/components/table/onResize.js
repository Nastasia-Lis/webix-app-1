  
///////////////////////////////

// Ресайз колонок

// Copyright (c) 2022 CA Expert

///////////////////////////////


function onResizeTable(table){
    table.attachEvent("onResize", function(width){
        const cols = table.getColumns();
        const scrollWidth = 17;
        width -= scrollWidth;
        let sum = 0;

        if (cols && cols.length){
            cols.forEach(function(col){
                sum += col.width;
            });

            
            if (sum < width){
                const different = width - sum;
    
                const lastCol = cols.length - 1;
                cols.forEach(function(col,i){
                    if (i == lastCol){
                        const newWidth = col.width + different;
                        table.setColumnWidth(col.id, newWidth);
                    }
            
                });

            } 
        }
        


    });
}

export{
    onResizeTable
};
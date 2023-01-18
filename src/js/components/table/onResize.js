function onResizeTable(table){
    table.attachEvent("onResize", function(width){
        const cols = table.getColumns();
        width -= 17;
        let sum = 0;

        if (cols && cols.length){
            cols.forEach(function(col,i){
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
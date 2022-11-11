function columnResize(table){
 

    table.attachEvent("onColumnResize", function(id, newWidth, oldWidth, userAction){
        const cols   = table.getColumns();
        const length = cols.length;
        function returnCol(index){
          
            const currIndex = length - index;
            return cols[currIndex];
        }
    
        if (userAction){

            const prevIndex = length - 2;

            const prevCol   = returnCol(2);
            const lastCol   = returnCol(1);


            if ( prevIndex > -1 ){
           
            
                if (prevCol.id == id){

                    const width = table.$width - 17;
                    let sum = 0;

                    cols.forEach(function(col,i){
                        sum += col.width;
                    });

                    if (sum < width){
                        const different = width - sum;
                        const newWidth = lastCol.width + different;
                  
                        table.setColumnWidth(lastCol.id, newWidth);
              
                    }
                }
               
            }
        }

    });
}

export {
    columnResize
};
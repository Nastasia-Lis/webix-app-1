import * as paginationTable from "./paginationTable.js";

export function toolbarTable () {
    function exportToExcel(){
        webix.toExcel(idTable, {
          filename:"ProductTable",
          filterHTML:true,
          styles:true
        });
    }

    return { 
        cols: [
            {   view:"search", 
                placeholder:"Поиск", 
                id:"search", 
                width:150, 
                on: {
                    onTimedKeyPress() {
                        var value = this.getValue().toLowerCase(); 
                        $$("tableInfo").filter(function(obj){
                        return obj.title.toLowerCase().indexOf(value)!=-1;
                    });
                    }}
            },
            {},
            paginationTable.paginationTable(),

            {   view:"button",
                width: 250, 
                type:"icon",
                icon:"wxi-download",
                label:"Экспортировать как Excel", 
                click:exportToExcel 
            },
        ]
    };



}
            // view:"toolbar", 
            // cols:[
            //   { view:"search", placeholder:"Поиск", id:"search", width:50},
            // ]
        
        // {
        //     width: 350,
        //     view:"text",
        //     id:"textField",
        //     placeholder:"Text",
        //     on: {
        //       onTimedKeyPress: function() {
        //         $$("tableInfo").filterByAll();
        //       }
        //     }
        // }
       
export function tableToolbar(idTable) {
    function resetFilters(){
        const table = $$(idTable);
        table.filter(); 
        table.showItem(table.getFirstId()); 
        table.setState({filter:{}}); 
      }
  
    function exportToExcel(){
      webix.toExcel(idTable, {
        filename:"ProductTable",
        filterHTML:true,
        styles:true
      });
    }
    
    return {
        view:"toolbar",
        css:"webix_dark",
        height:50,
        cols:[	
          { view:"button", label:"Сбросить фильтры", click:resetFilters },
          { view:"button", label:"Экспортировать как Excel", click:exportToExcel }
        ]
    };
  }
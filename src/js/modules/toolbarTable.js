

export function toolbarTable () {
    function exportToExcel(){
        webix.toExcel("tableInfo", {
          filename:"Table",
          filterHTML:true,
          styles:true
        });
    }

    return { 
        cols: [
            {   view:"search", 
                placeholder:"Поиск", 
                id:"searchTable",
                css:"searchTable", 
                width:150, 
                on: {
                    onTimedKeyPress() {
                        var value = this.getValue().toLowerCase();
                        $$("tableInfo").filter(function(obj){
                        return obj.title.toLowerCase().indexOf(value)!=-1;
                    });
                    }}
            },
            
            {
                view:"pager",
                id:"pagerTable",
                size:20,
                group:5,
                template:`{common.prev()} 
              {common.pages()} {common.next()}`
            },

            {   view:"button",
                width: 50, 
                type:"icon",
                icon:"wxi-download",
                //label:"Экспортировать как Excel", 
                click:exportToExcel 
            },
        ]
    };
}

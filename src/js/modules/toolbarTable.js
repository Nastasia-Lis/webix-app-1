import {notify} from './editTable.js';

export function toolbarTable () {
    function exportToExcel(){
        webix.toExcel("tableInfo", {
          filename:"Table",
          filterHTML:true,
          styles:true
        });
        notify ("success","Таблица сохранена");
    }
    return { 
        padding:17, margin:5, cols: [
            {   view:"search", 
                placeholder:"Поиск", 
                id:"searchTable",
                css:"searchTable", 
                width:150, 
                on: {
                    onTimedKeyPress() {
                        let value = this.getValue().toLowerCase();
                        let countRows = $$("tableInfo").getVisibleCount();
                        let i = 0;
                        // while (i < countRows) { 
                        //     i++;
                        // }console.log(i);
                        
                        // if (i==0){
                        //     console.log("ноль");
                        // }

                        $$("tableInfo").filter(function(obj){
                            //console.log(obj)
                            let findElements = 0;
                            
                            while (findElements<6){
                                if (obj.title.toLowerCase().indexOf(value)!=-1) {
                                findElements++; 
                                }
                            }
                                
                            console.log(findElements);

                            
                            return obj.title.toLowerCase().indexOf(value)!=-1;
                        });
                    }
                }
            },
            
            {
                view:"pager",
                id:"pagerTable",
                size:10,
                group:3,
                template:`{common.prev()} 
              {common.pages()} {common.next()}`
            },

            {   view:"button",
                width: 50, 
                type:"icon",
                icon:"wxi-download",
                height:45,
                width:50,
                click:exportToExcel 
            },
        ]
    };
}

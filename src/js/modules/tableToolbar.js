import {notify} from './editTable.js';

import {tableId, pagerId,searchId, findElemetsId, exportBtn} from './setId.js';

export function tableToolbar () {
    function exportToExcel(){
        webix.toExcel(tableId, {
          filename:"Table",
          filterHTML:true,
          styles:true
        });
        notify ("success","Таблица сохранена");
    }
    return { 
        rows:[
            {padding:17, margin:5, 
                cols: [
                {   view:"search", 
                    placeholder:"Поиск", 
                    id:searchId,
                    css:"searchTable", 
                    maxWidth:250, 
                    minWidth:40, 
                    disabled:true,
                    on: {
                        onTimedKeyPress() {
                            let text = this.getValue().toLowerCase();
                            let table = $$(tableId);
                            let columns = table.config.columns;
                            let findElements = 0;
                            table.filter(function(obj){
                                for (let i=0; i<columns.length; i++)
                                    if (obj[columns[i].id].toString().toLowerCase().indexOf(text) !== -1){
                                        findElements++; 
                                        return true;
                                    }
                                return false;
                            });
                            if (!findElements){
                                $$(tableId).showOverlay("Ничего не найдено");
                            } else if(findElements){
                                $$(tableId).hideOverlay("Ничего не найдено");
                            }
                            $$(findElemetsId).setValues(findElements.toString());
                            
                        },
                        onAfterRender: function () {
                           this.getInputNode().setAttribute("title","Поиск по таблице");
                        },
                        
                    }
                },
 
                {
                    view:"pager",
                    id:pagerId,
                    size:10,
                    group:3,
                    template:`{common.prev()} 
                {common.pages()} {common.next()}`
                },

                {   view:"button",
                    width: 50, 
                    type:"icon",
                    id:exportBtn,
                    icon:"wxi-download",
                    css:"webix_btn-download",
                    title:"текст",
                    height:50,
                    width:60,
                    disabled:true,
                    click:exportToExcel,
                    on: {
                        onAfterRender: function () {
                            this.getInputNode().setAttribute("title","Экспорт таблицы");
                        }
                    } 
                },
                ],
            },
            {   view:"template",
                id:findElemetsId,
                height:30,
                template:function () {
                    if (Object.keys($$(findElemetsId).getValues()).length !==0){
                        return "<div style='color:#999898'> Количество записей:"+" "+$$(findElemetsId).getValues()+" </div>";
                    } else {
                        return "";
                    }
                },
            }
        ]

        
    };
}

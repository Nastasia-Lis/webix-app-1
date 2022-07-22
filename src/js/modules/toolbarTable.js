import {notify} from './editTable.js';

import {tableId, pagerId,searchId, findElemetsId} from './setId.js';

export function toolbarTable () {
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
                    on: {
                        onTimedKeyPress() {
                            let value = this.getValue().toLowerCase();
                            let findElements = 0;
                           let obj = $$(tableId).getItem(1);
                            $$(tableId).filter(function(obj){
                                if (obj.title.toLowerCase().indexOf(value)!=-1) {
                                    findElements++; 
                                }
                                return obj.title.toLowerCase().indexOf(value)!=-1;
                            });
                            if (!findElements){
                                $$(tableId).showOverlay("Ничего не найдено");
                            
                            } else if(findElements){
                                $$(tableId).hideOverlay("Ничего не найдено");
                            }
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
                    icon:"wxi-download",
                    css:"webix_btn-download",
                    height:50,
                    width:60,
                    click:exportToExcel,
                    on: {
                        onAfterRender: function () {
                            //document.getElementById('webix_btn-download1').setAttribute('data-tooltip', 'aaa');
        
                        }
                    } 
                },
                ],
            },
            {   id:findElemetsId,
                height:30,
                template: "#count#",
                on: {
                    onAfterRender() {
                        let count = ($$(tableId).getLastId());
                        return count;
                    }
                }
            }
        ]

        
    };
}

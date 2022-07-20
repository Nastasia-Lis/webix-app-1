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

    // function countFindElemets() {
    //     let count = ($$("tableInfo").getLastId());
    //     return (count);
    // }

    return { 
        rows:[
            {padding:17, margin:5, 
                cols: [
                {   view:"search", 
                    placeholder:"Поиск", 
                    id:"searchTable",
                    css:"searchTable", 
                    maxWidth:250, 
                    minWidth:40, 
                    on: {
                        onTimedKeyPress() {
                            let value = this.getValue().toLowerCase();
                            //let allElements = ($$("tableInfo").getLastId());
                            let findElements = 0;

                            $$("tableInfo").filter(function(obj){
                                if (obj.title.toLowerCase().indexOf(value)!=-1) {
                                    findElements++; 
                                }
                                return obj.title.toLowerCase().indexOf(value)!=-1;
                            });
                            if (!findElements){
                                console.log("нет");
                                $$("tableInfo").showOverlay("Ничего не найдено");
                            
                            } else if(findElements){
                                $$("tableInfo").hideOverlay("Ничего не найдено");
                              
                            }
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
                    css:"webix_btn-download",
                    height:50,
                    width:60,
                    click:exportToExcel 
                },
                ],
            },
            {   id:"countFindElemets",
                height:30,
                //borderless:true,
                template: "#count#",
                on: {
                    onAfterRender() {
                        let count = ($$("tableInfo").getLastId());
                        //$$("countFindElemets").config.template="<div>ueue</div>";
                        //$$("countFindElemets").refresh();
                        return count;
                    }
                }
            }
        ]

        
    };
}

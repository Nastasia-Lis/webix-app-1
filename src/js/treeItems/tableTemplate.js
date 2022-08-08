import {tableId,editFormId, saveBtnId,saveNewBtnId, addBtnId, delBtnId, findElementsId} from '../modules/setId.js';
import {defaultStateForm,createEditFields,popupExec,notify} from "../modules/editTableForm.js";


// function accordionFilter () {
//     const accordion = {
//         css:"webix_accordion-container",
//         view:"accordion",
//         id:"accordionFilterTable",
//         minHeight:100,
//         type:"line",
//         collapsed:true,
//         rows:[ 
//         ]
//     };
//     return accordion;
// }

function tableToolbar (idPager, idSearch, idExport, idFindElements, idTable,searchVisible=false) {
    function exportToExcel(){
        webix.toExcel(idTable, {
          filename:"Table",
          filterHTML:true,
          styles:true
        });
        notify ("success","Таблица сохранена");
    }
    return { 
       id:"filterBar", rows:[
            {padding:17, margin:5, 
                cols: [
                {   view:"search", 
                    placeholder:"Поиск", 
                    id:idSearch,
                    hidden:searchVisible,
                    css:"searchTable", 
                    maxWidth:250, 
                    minWidth:40, 
                    //disabled:true,
                    on: {
                        onTimedKeyPress() {
                            let text = this.getValue().toLowerCase();
                            let table = $$(idTable);
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
                                $$(idTable).showOverlay("Ничего не найдено");
                            } else if(findElements){
                                $$(idTable).hideOverlay("Ничего не найдено");
                            }
                            $$(idFindElements).setValues(findElements.toString());
                            
                        },
                        onAfterRender: function () {
                           this.getInputNode().setAttribute("title","Поиск по таблице");
                        },
                        
                    }
                },
 
                {
                    view:"pager",
                    id:idPager,
                    size:10,
                    group:3,
                    template:`{common.prev()} 
                {common.pages()} {common.next()}`
                },

                {   view:"button",
                    width: 50, 
                    type:"icon",
                    id:idExport,
                    icon:"wxi-download",
                    css:"webix_btn-download",
                    title:"текст",
                    height:50,
                    width:60,
                    //disabled:true,
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
                id:idFindElements,
                css:"webix_style-template-count",
                height:30,
                template:function () {
                    if (Object.keys($$(idFindElements).getValues()).length !==0){
                        return "<div style='color:#999898;'> Количество записей:"+" "+$$(idFindElements).getValues()+" </div>";
                    } else {
                        return "";
                    }
                },
            },
            //accordionFilter()
        ]

        
    };
}




function table (idTable, idPager, onFunc, srcData) {
    return {
        view:"treetable",
        id: idTable,
        css:"webix_table-style webix_header_border webix_data_border",
        resizeColumn: true,
        autoConfig: true,
        pager:idPager,
        minHeight:300,
        footer: true,
        minWidth:500, 
        select:true,
        minColumnWidth:200,
        on:onFunc,
    };
}





//----- table edit parameters
let onFuncTable = {
    onAfterSelect(id){
        let values = $$(tableId).getItem(id); 
        function toEditForm () {
            $$(editFormId).setValues(values);
            $$(saveNewBtnId).hide();
            $$(saveBtnId).show();
            $$(addBtnId).hide(); 
            $$(editFormId).clearValidation();
        }
        if($$(editFormId).isDirty()){
            popupExec("Данные не сохранены").then(
                function(){
                    $$(editFormId).clear();
                    $$(delBtnId).enable();
                    toEditForm();
            }); 
        } else {
            createEditFields();
            toEditForm();
        }   
    },
    onAfterLoad:function(){
        $$(editFormId).removeView("inputsTable");
        defaultStateForm ();
    },  
    onAfterDelete: function() {
        $$(findElementsId).setValues($$(tableId).count().toString());
        if (!this.count())
            this.showOverlay("Ничего не найдено");
        if (this.count())
            this.hideOverlay();
    },
    onAfterAdd: function() {
        $$(findElementsId).setValues($$(tableId).count().toString());
        this.hideOverlay();
    },
};
//----- table edit parameters





//----- table view parameters
let jsonTableView = {
    treeHeadlines :[
        {"id": 'tableOne', "value": "Таблица 101"}
    ],
};

let onFuncTableView = {
    onAfterDelete: function() {
        $$(findElementsId).setValues($$(tableId).count().toString());
        if (!this.count())
            this.showOverlay("Ничего не найдено");
        if (this.count())
            this.hideOverlay();
    },
    onAfterAdd: function() {
        $$(findElementsId).setValues($$(tableId).count().toString());
        this.hideOverlay();
    },
}

//----- table view parameters


export {
    tableToolbar,
    table,
    onFuncTable,
    jsonTableView,
    onFuncTableView
};
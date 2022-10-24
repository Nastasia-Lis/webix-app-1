import {setLogValue} from "./logBlock.js";
import {setFunctionError} from "./errors.js";

import {setHeadlineBlock} from './blockHeadline.js';

import {toolbarFilterBtn} from "./tableFilter/toolbarBtn.js";
import {toolbarEditButton} from "./tableEditForm/toolbarBtn.js";
import {toolbarVisibleColsBtn} from "./visibleColumns.js";

function exportToExcel(idTable){
    try{
        webix.toExcel(idTable, {
        filename:"Table",
        filterHTML:true,
        styles:true
        });
        setLogValue("success","Таблица сохранена");
    } catch (err) {   
        setFunctionError(err,"toolbarTable","exportToExcel");
    }
}

function toolbarDownloadButton(idTable,visible){
    const idExport = idTable+"-exportBtn";
    return {   
        view:"button",
        width: 50, 
        type:"icon",
        id:idExport,
        hidden:visible,
        icon:"icon-arrow-circle-down",
        css:"webix_btn-download webix-transparent-btn",
        title:"текст",
        height:42,
        click:function(){
            exportToExcel(idTable);
        },
        on: {
            onAfterRender: function () {
                this.getInputNode().setAttribute("title","Экспорт таблицы");
            }
        } 
    };
}

function createTemplateCounter(idEl,text){
    const view = {   
        view:"template",
        id:idEl,
        css:"webix_style-template-count",
        height:30,
        template:function () {
            if (Object.keys($$(idEl).getValues()).length !==0){
                
                return "<div style='color:#999898;'>"+text+":"+
                        " "+$$(idEl).getValues()+
                        " </div>";
            } else {
                return "";
            }
        }
    };

    return view;
}

function tableToolbar (idTable,visible=false) {

    const idFindElements   = idTable+"-findElements",
          idFilterElements = idTable+"-idFilterElements",
          idHeadline       = idTable+"-templateHeadline"
    ;

    return { 
        
        rows:[
            setHeadlineBlock(idHeadline),

            {
                css:"webix_filterBar",
                padding:{
                    bottom:4,
                }, 
                height: 40,
                cols: [
                    toolbarFilterBtn(idTable,visible),
                    toolbarEditButton(idTable),
                    {},
                    // toolbarVisibleColsBtn(idTable),
                    toolbarDownloadButton(idTable,visible)
                ],
            },

            {cols:[
                createTemplateCounter (idFindElements,  "Общее количество записей"  ),
                createTemplateCounter (idFilterElements,"Видимое количество записей"),
            ]},
        ]
    };
}


export{
    tableToolbar
};
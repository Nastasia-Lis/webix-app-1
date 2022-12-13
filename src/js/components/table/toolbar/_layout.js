
import { createHeadline }           from '../../viewHeadline/_layout.js';
import { toolbarVisibleColsBtn }    from "./visibleColsBtn.js";
import { toolbarFilterBtn }         from "./filterBtn.js";
import { toolbarEditButton }        from "./editFormBtn.js";
import { toolbarDownloadButton }    from "./exportBtn.js";
import { createTemplateCounter }    from "./counter.js";
import { applyNotify }              from "./applyFilterNotify.js";

function tableToolbar (idTable, visible = false) {

    const idFindElements   = idTable + "-findElements",
          idFilterElements = idTable + "-idFilterElements",
          idHeadline       = idTable + "-templateHeadline"
    ;

    return { 
        
        rows:[
            createHeadline(idHeadline),
            {
                css     : "webix_filterBar",
                id      : idTable + "_toolbarBtns",
                padding : {
                    bottom : 4,
                }, 
                height  : 40,
                cols    : [
                    toolbarFilterBtn      (idTable, visible),
                    toolbarEditButton     (idTable, visible),
                    applyNotify           (idTable),
                    {},
                    toolbarVisibleColsBtn (idTable),
                    toolbarDownloadButton (idTable, visible),
                ],
            },

            { cols : [
                createTemplateCounter (
                    idFindElements  , 
                    "Общее количество записей"  
                ),

                createTemplateCounter (
                    idFilterElements, 
                    "Видимое количество записей"
                ),
            ]},
        ]
    };
}

export{
    tableToolbar
};
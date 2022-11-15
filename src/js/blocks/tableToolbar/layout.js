
import { createHeadline }           from '../viewHeadline/layout.js';

import { toolbarVisibleColsBtn }    from "./visibleColsBtn.js";
import { toolbarFilterBtn }         from "./filterBtn.js";
import { toolbarEditButton }        from "./editFormBtn.js";
import { toolbarDownloadButton }    from "./exportBtn.js";
import { createTemplateCounter }    from "./counter.js";


function tableToolbar (idTable, visible=false) {

    const idFindElements   = idTable+"-findElements",
          idFilterElements = idTable+"-idFilterElements",
          idHeadline       = idTable+"-templateHeadline"
    ;

    return { 
        
        rows:[
            createHeadline(idHeadline),
            {
                css:"webix_filterBar",
                padding:{
                    bottom:4,
                }, 
                height: 40,
                cols: [
                    toolbarFilterBtn        (idTable, visible),
                    toolbarEditButton       (idTable, visible),
                    {},
                    toolbarVisibleColsBtn   (idTable),
                    toolbarDownloadButton   (idTable, visible)
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
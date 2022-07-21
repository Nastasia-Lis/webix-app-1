import * as table from "./table.js";
import * as toolbarTable from "./toolbarTable.js";
import {} from './data/data.js';

export function multiviewSidebar () {
    return{
        view: "multiview",
        id:"multiviewSidebar",
        animate: false,
        cells:[
            {   id: "tableDataOne", 
                rows:[
                    toolbarTable.toolbarTable(),
                    table.table(),
                ]
            },

            {   id: "tableDataFour", 
                rows:[
                    toolbarTable.toolbarTable(),
                    table.table(),
                ]
            },
        ] 
    };
}
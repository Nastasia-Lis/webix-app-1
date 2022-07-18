//import {gridColumns,tableDataOne} from './data/data.js';

export function table (idTable, srcTable, gridTable) {
    return {
        view:"datatable",
        id:idTable, 
        data:srcTable,
        columns: gridTable
    };
}
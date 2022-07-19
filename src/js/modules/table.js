import {gridColumns,tableDataOne} from './data/data.js';

export function table (idTable, srcTable, gridTable) {
    return {
        view:"datatable",
        id:"tableOne", 
        data:tableDataOne,
        columns: gridColumns
    };
}
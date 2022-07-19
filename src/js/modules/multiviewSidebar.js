// import * as table from "./table.js";
// import * as toolbarTable from "./toolbarTable.js";
// import {gridColumns,tableDataOne, tableDataFour} from './data/data.js';

// export function multiviewSidebar () {
//     return{
//         view: "multiview",
//         id:"multiviewSidebar",
//         animate: false,
//         cells:[
//             {   id: "tableDataOne", 
//                 rows:[
//                     toolbarTable.toolbarTable("searchTabOne", "paginationTabOne","tableOne"),
//                     table.table("tableOne", tableDataOne,"paginationTabOne"),
//                 ]
//             },

//             {   id: "tableDataFour", 
//                 rows:[
//                     toolbarTable.toolbarTable("searchTabFour", "paginationTabFour"),
//                     table.table("tableFour", tableDataFour,"paginationTabFour","tableFour"),
//                 ]
//             },
//         ] 
//     };
// }
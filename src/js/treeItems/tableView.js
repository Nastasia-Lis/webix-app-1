import {tableId} from '../modules/setId.js';

let jsonTableView = {
    treeHeadlines :[
        {"id": 'tableOne', "value": "Таблица 101"}
    ],
};


const tableView = {
    view:"datatable", 
    select:true,

    scrollX: false,
    columns:[
        { id:"rank", fillspace:true,    header:"",              width:50},
        { id:"title", fillspace:true,   header:"Film title",    width:200},
        { id:"year",  fillspace:true,   header:"Released",      width:80},
        { id:"votes", fillspace:true,   header:"Votes",         width:100}
    ],
    data: [
        { id:1, title:"The Shawshank Redemption", year:1994, votes:678790, rank:1},
        { id:2, title:"The Godfather", year:1972, votes:511495, rank:2}
    ]
}; 

export {
    tableView,
    jsonTableView
};
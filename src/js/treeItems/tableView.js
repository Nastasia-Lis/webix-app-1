import {tableId, pagerId, findElemetsId} from '../modules/setId.js';

let jsonTableView = {
    treeHeadlines :[
        {"id": 'tableOne', "value": "Таблица 101"}
    ],
};

let countRows;
const tableView = {
    view:"datatable", 
    select:true,
    id: "table-view",
    scrollX: false,
    columns:[
        { id:"rank", fillspace:true,    header:"",              width:50},
        { id:"title", fillspace:true,   header:"Film title",    width:200},
        { id:"year",  fillspace:true,   header:"Released",      width:80},
        { id:"votes", fillspace:true,   header:"Votes",         width:100}
    ],
    data: [
        { id:1, title:"The Shawshank Redemption", year:1994, votes:678790, rank:1},
        { id:2, title:"The Godfather", year:1972, votes:511495, rank:2},
        { id:3, title:"The Shawshank Redemption", year:1994, votes:678790, rank:1},
        { id:4, title:"The Godfather", year:1972, votes:511495, rank:2},
        { id:5, title:"The Shawshank Redemption", year:1994, votes:678790, rank:1},
        { id:6, title:"The Godfather", year:1972, votes:511495, rank:2},
        { id:7, title:"The Shawshank Redemption", year:1994, votes:678790, rank:1},
        { id:8, title:"The Godfather", year:1972, votes:511495, rank:2},
        { id:9, title:"The Shawshank Redemption", year:1994, votes:678790, rank:1},
        { id:10, title:"The Godfather", year:1972, votes:511495, rank:2},
        { id:11, title:"The Shawshank Redemption", year:1994, votes:678790, rank:1},
        { id:12, title:"The Godfather", year:1972, votes:511495, rank:2}
    ],
    on:{
        onAfterAdd: function(id, index) {
            
            // countRows+=1;
            // $$(findElemetsId).setValues(countRows.toString());
            this.hideOverlay();

        },
    }
}; 

export {
    tableView,
    jsonTableView
};
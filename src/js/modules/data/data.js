let sidebarData = [  
    {id:"Category 1", value:"Category 1", data: [
        { id: "tableDataOne", value: "Таблица №1"},
        //{ id: "table2", value: "Таблица №2"},
        //{ id: "table3", value: "Таблица №3"}
        ]},
    {id:"Category 2", value:"Category 2", data: [
        { id: "tableDataFour", value: "Таблица №4"}
    ]},
];


let gridColumns = [
    { id:"title",    header:"Titile"},
    { id:"duration",   header:"Duration"}
];

let tableDataOne = [

    { id:1, title:"The Shawshank Redemption", year:1994, votes:678790, rating:9.2, rank:1, category:"Thriller"},
    { id:2, title:"The Godfather", year:1972, votes:511495, rating:9.2, rank:2, category:"Crime"},
    { id:3, title:"The Godfather: Part II", year:1974, votes:319352, rating:9.0, rank:3, category:"Crime"},
    { id:4, title:"The Good, the Bad and the Ugly", year:1966, votes:213030, rating:8.9, rank:4, category:"Western"},
    { id:5, title:"Pulp fiction", year:1994, votes:533848, rating:8.9, rank:5, category:"Crime"},
    { id:6, title:"12 Angry Men", year:1957, votes:164558, rating:8.9, rank:6, category:"Western"}

];


let tableDataFour = [
    {id: "1", title: "01. Basique", duration: "3:38"},
    {id: "2", title: "02. Moon", duration: "3:47"}
];


export {
    sidebarData,
    gridColumns,
    tableDataOne,
    tableDataFour,
};
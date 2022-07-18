let sidebarData = [  
    {id:"Category 1", value:"Category 1", data: [
        { id: "table1", value: "Таблица №1"},
        //{ id: "table2", value: "Таблица №2"},
        //{ id: "table3", value: "Таблица №3"}
        ]},
    {id:"Category 2", value:"Category 2", data: [
        { id: "table4", value: "Таблица №4"}
    ]},
];


let gridColumns = [
    { id:"title",    header:"Titile"},
    { id:"duration",   header:"Duration"}
];

let tableDataOne = [
    {id: "1", title: "01. The Charm Offensive", duration:"7:19"},
    {id: "2", title: "02. Heaven Alive", duration:"6:20"},
    {id: "3", title: "03. A Homage to Shame", duration:"5:52"},
    {id: "4", title: "04. Meredith", duration:"5:26"},
    {id: "5", title: "05. Music for a Nurse", duration:"8:16"},
    {id: "6", title: "06. New Pin", duration:"5:11"},
    {id: "7", title: "07. No Tomorrow", duration:"7:10"},
    {id: "8", title: "08. Mine Host", duration:"4:10"},
    {id: "9", title: "09. You Cant Keep a Bad Man Down", duration:"7:36"},
    {id: "10", title: "10. Ornament. The Last Wrongs", duration:"9:21"}
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
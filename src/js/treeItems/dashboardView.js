let jsonDashboard = {
    treeHeadlines :[
    {"id": 'peopleOne',  "value": 'Иванов Иван Иванович'}
    ],

    peopleOne :{ 
        "dataview": {
            "data": [{ "id":1,"title":"Иванов Иван Иванович", "info1":1994, "info2":9.2}],
        },
        "property": {
            "data": [
                { "label":"Информация", "type":"label" },
                { "label":"Инф 1", "type":"text", "id":"width", "value": 250},
                { "label":"Инф 2", "type":"text", "id":"height", "value": 11},
                { "label":"Инф 3", "type":"password", "id":"pass", "value": 64636}
            ],
        },
        "timeline":{
            "data":[
                { id:1, value:"Available", date:"2017-08-01"},
                { id:2, value:"Taken", details:"by Malcolm Merlyn", date:"2017-09-10" },
                { id:3, value:"Broken", date:"2017-12-11" },
                { id:5, value:"Fixed", date:"2018-02-10" },
                { id:6, value:"Available", date:"2018-03-15" },
                { id:7, value:"Taken", details:"by Rosa White", date:"2018-03-21"},
                { id:8, value:"Broken", date:"2019-05-16" },
                { id:9, value:"Fixed", date:"2019-06-02" },
                { id:10, value:"Available", date:"2019-09-10"},
                { id:11, value:"Deprecated", date:"2019-09-23" }
              ]
        },
        "diagramBar": {
            "data": [
                { id:1, sales:20, year:"02"},
                { id:2, sales:55, year:"03"},
                { id:3, sales:40, year:"04"},
                { id:4, sales:78, year:"05"},
                { id:5, sales:61, year:"06"},
                { id:6, sales:35, year:"07"},
                { id:7, sales:80, year:"08"},
                { id:8, sales:50, year:"09"},
                { id:9, sales:65, year:"10"},
                { id:10, sales:59, year:"11"}
            ],
        },
        "diagramArea": {
            "data": [
                { "sales":"20", "sales2":"35", "sales3":"55", "year":"02" },
                { "sales":"40", "sales2":"24", "sales3":"40", "year":"03" },
                { "sales":"44", "sales2":"20", "sales3":"27", "year":"04" },
                { "sales":"23", "sales2":"50", "sales3":"43", "year":"05" },
                { "sales":"21", "sales2":"36", "sales3":"31", "year":"06" },
                { "sales":"50", "sales2":"40", "sales3":"56", "year":"07" },
                { "sales":"30", "sales2":"65", "sales3":"75", "year":"08" },
                { "sales":"90", "sales2":"62", "sales3":"55", "year":"09" },
                { "sales":"55", "sales2":"40", "sales3":"60", "year":"10" },
                { "sales":"72", "sales2":"45", "sales3":"54", "year":"11" }
            ],
        },
    }
};

function dashboardLayout () {
    
    webix.i18n.setLocale("ru-RU");   
    const form = {
        view:"form", 
        container:"webix__form-container", 
        minHeight:350,
        width:400,
        margin:15,
        scroll:false,
        elements:[
           {},
            {template:"<div style='color:#313131; font-weight:500;font-size:20px'>Личные данные</div>", css:"webix_dashboard-h2",borderless:true},
            {   view:"text",
                placeholder:"Введите фамилию",  
                label:"Фамилия",
                text:"Иванов",
                width: 300,
                height:70,
                labelPosition:"top"    
            },
            {   view:"text",
                placeholder:"Введите имя",  
                label:"Имя",
                text:"Иван",
                width: 300,
                height:70,
                labelPosition:"top"    
            },
            // {   view:"text",
            //     placeholder:"Введите отчество",  
            //     label:"Отчество",
            //     text:"Иванович",
            //     width: 300,
            //     height:70,
            //     labelPosition:"top"    
            // },
            {   view: "datepicker",
                label: "Выберите дату",
                value:"23.03.2021",
                placeholder:"дд.мм.гг", 
                width: 300,
                height:70,
                labelWidth: 90,
                timepicker: true,
                format: "%d.%m.%Y",
        
                labelPosition:"top"
            },
            {
                view:"radio", 
                label:"Свойство",
                labelPosition:"top" ,
                value:2, options:[
                    {"id":1, "value":"Параметр 1"},
                    {"id":2, "value":"Параметр 2"}
                ]
            },
            {
                view:"button", 
                id:"my_button", 
                value:"Сохранить изменения", 
                css:"webix_primary", 
                disabled:true,
                height:48,
                width:300,
            },
            {}

        ],
    };

    const diagramBar = {

        view:"chart",
        type:"bar",
        value:"#sales#",
        barWidth:30,
        radius:0,
        height:250,
        tooltip:{
            template:"#sales#"
        },
        xAxis:{
            template:"'#year#",
            title:"Year"
        },
        yAxis:{
            title:"Profit"
        },
        data: jsonDashboard.peopleOne.diagramBar.data

    };
    
    const diagramArea = {
        view:"chart",
 
        minHeight:250,
        type:"area",
        xAxis:{
            template:"'#year#"
        },
        yAxis:{
            start:0,
            step:10,
            end:100
        },
        legend:{
            values:[{text:"Type A",color:"#58dccd"},{text:"Type B",color:"#914ad8"},{text:"Type C",color:"#36abee"}],
            valign:"middle",
            align:"right",
            width:90,
            layout:"y"
        },
        eventRadius: 5,
        series:[
            {
            alpha:0.7,
            value:"#sales#",
            color: "#58dccd",
            tooltip:{
                template:"type: A<br/>value: #sales#"
            }
            },
            {
            alpha:0.5,
            value:"#sales2#",
            color:"#914ad8",
            tooltip:{
                template:"type: B<br/>value: #sales2#"
            }
            },
            {
            alpha:0.5,
            value:"#sales3#",
            color:"#36abee",
            tooltip:{
                template:"type: C<br/>value: #sales3#"
            }
            }
        ],
        data:jsonDashboard.peopleOne.diagramArea.data,
        
    };

    return [
        { type:"clean",rows:[
            { type:"clean",cols:[{width:30},form, ]},
          
            //form ,
     
            // { view:"resizer", class:"webix_resizers",},
            // property
        ]},
          
        { view:"resizer", class:"webix_resizers",},
        
        {rows:[
            diagramBar,
            { view:"resizer", class:"webix_resizers",},
            diagramArea
        ]},
    ];
}
    
export {
    dashboardLayout,
    jsonDashboard,
};
///////////////////////////////

// Создание контекстного окна по клику на action

// Copyright (c) 2022 CA Expert

/////////////////////////////// 

import { Action }           from '../../../blocks/commonFunctions.js';
import { Button }           from '../../../viewTemplates/buttons.js';
import { LoadServerData, 
         GetFields }        from "../../../blocks/globalStorage.js";

import { mediator }         from "../../../blocks/_mediator.js";

let container;
let item;
let field;

const headline  = {
    template    : "<div class='no-wrap-headline'>Подробности</div>", 
    css         : "webix_popup-headline", 
    borderless  : true, 
    height      : 40 
};

function closeBtnClick(){
    Action.removeItem($$("dashContextLayout"));
    Action.hideItem  (container);
    Action.showItem  ($$("dashboardInfoContainer"));

    mediator.linkParam(false, "id");
    mediator.linkParam(false, "src");
}

const closeBtn  = new Button({
    config   : {
        id     : "dashContexCloseBtn",
        hotkey : "Esc",
        icon   : "icon-arrow-right", 
        click  : function (){
            closeBtnClick();
        }
    },
    css            : "webix-transparent-btn",
    titleAttribute : "Скрыть конекстное окно"

   
}).minView();

async function findLabels(){
    await LoadServerData.content("fields");

    const tableData = GetFields.item(field);
    const fields    = Object.values (tableData.fields);
    const labels    = [];
    fields.forEach(function(el){
        labels.push(el.label);
    });

    return labels;
}

async function createPropElements(){

    const data = [];
        if (item){
        const values = Object.values(item);
        const keys   = Object.keys(item);
        const labels = await findLabels();

        values.forEach(function(val, i){

            data.push({
                id    : keys[i],
                label : labels[i], 
                value :  val
            });
        });
    }


    return data;
}

async function returnProperty(){
    const property  = {
        view    : "property",  
        id      : "dashContextProperty", 
        minHeight:100,
        elements: await createPropElements(),
    };

    const propertyLayout = {   
        scroll     : "y", 
        rows       : [
            property,
            {height : 20}
        ]
    };

    return propertyLayout;
}


function goToTableBtnClick(){
    const id = item.id;

    if (item && item.id){

        const propValues = $$("dashContextProperty").getValues();
 
        const infoData = {

            tree : {
                field : field,
                type  : "dbtable" 
            },
            temp : {
                edit  : {
                    selected : id, 
                    values   : {
                        status : "put",
                        table  : field,
                        values : propValues
                    }
                },
              
            }
        };

        mediator.tabs.openInNewTab(infoData);

    }
 
}

const goToTableBtn = new Button({
    
    config   : {
        id       : "goToTableBtn",
        hotkey   : "Ctrl+Shift+Space",
        value    : "Редактировать", 
        click    : function (){
            goToTableBtnClick();
        }
    },
    titleAttribute : "Перейти в таблицу для редактирования записи"

   
}).maxView("primary");



async function createLayout(){
 
    const layout = {
        id      : "dashContextLayout",
        padding : 15,
        rows    : [
            {cols: [
                headline,
                {},
                closeBtn 
            ]},
            await returnProperty(),
           // {height : 20},
            goToTableBtn,
            {}
        ]
      
    };

    return layout;
}

async function createSpace(){
    const content = $$("dashContextLayout");
    if (content){
        Action.removeItem(content);
    }

    if (container){
        container.addView(await createLayout(), 0);
    }
   
}


function setLinkParams(){
    const params = {
        src : field, 
        id  : item.id
    };
    
    mediator.linkParam(true, params);
}

function setToTabStorage(){
    const data = mediator.tabs.getInfo();
  
    if (data){
        if(!data.temp){
            data.temp = {};
        }
        if(data.temp.filter){
            delete data.temp.filter;
        }

        data.temp.context = {};

        data.temp.context.open  = true; // open context window
        data.temp.context.field = field;
        data.temp.context.id    = item.id;
  
        mediator.tabs.setInfo(data);
    } 

    
}

function createContextProperty(data, idTable){
    item  = data;
    field = idTable;

    const filters = $$("dashboardTool");
    Action.hideItem(filters);
    
    container = $$("dashboardContext");
    Action.showItem(container);
    if (window.innerWidth < 850){

        container.config.width = window.innerWidth - 45;
 
        container.resize();
        Action.hideItem($$("dashboardInfoContainer"));
    }

    setLinkParams   ();
    createSpace     ();
    setToTabStorage ();
    
}

export {
    createContextProperty
};
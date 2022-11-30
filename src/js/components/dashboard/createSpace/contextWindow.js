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
        const labels = await findLabels();

        values.forEach(function(val, i){
            data.push({
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
        elements: await createPropElements()
    };

    const propertyLayout = {   
        scroll     : "y", 
        rows       : [
            property
        ]
    };

    return propertyLayout;
}


function goToTableBtnClick(){
    const id = item.id;

    if (item && item.id){
        const path   = "tree/" + field;
        const params = "?id=" + id;
        Backbone.history.navigate(path + params, { trigger:true });
        window.location.reload();
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
            {height : 20},
            goToTableBtn
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
        container.addView(await createLayout());
    }
   
}


function setLinkParams(){
    const params = {
        src : field, 
        id  : item.id
    };
    
    mediator.linkParam(true, params);
}

function createContextProperty(data, idTable){
    item  = data;
    field = idTable;

    container     = $$("dashboardContext");
    const filters = $$("dashboardTool");

    Action.hideItem(filters);
    Action.showItem(container);
    
    setLinkParams();
    createSpace();
}

export {
    createContextProperty
};
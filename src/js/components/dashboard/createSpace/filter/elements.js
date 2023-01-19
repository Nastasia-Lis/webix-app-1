///////////////////////////////

// Динамические элементы фильтра

// Copyright (c) 2022 CA Expert

/////////////////////////////// 

import { setFunctionError }     from "../../../../blocks/errors.js";
import { mediator }             from "../../../../blocks/_mediator.js";
import { ServerData }           from "../../../../blocks/getServerData.js";

import { Button }               from '../../../../viewTemplates/buttons.js';

import { clickBtn }             from './submitBtnClick.js';

const logNameFile = "dashboard => createSpace => filter";
 


function setTabInfo(sentVals){
    
    const tabData =  mediator.tabs.getInfo();

    if (tabData){
        if (!tabData.temp){
            tabData.temp = {};
        }
        tabData.temp.filter = {
            dashboards: true,
            values    : sentVals,
        };
    }
}

function setToStorage(input){

    const container = input.getParentView();
    const childs    = container.getChildViews();
    const newValues = [];

    childs.forEach(function(el){

        if (el.config.view == "datepicker"){
            newValues.push({
                id    : el.config.id,
                value : el.config.value
            });
        }
    });
  
    if (newValues.length){
        const content = {
            content : newValues
        };
        webix.storage.local.put("dashFilterState", content);

        setTabInfo(newValues);
    }

   
}

const inputsArray = [];
let   findAction;
let   idsParam;

function setAdaptiveWidth(elem){
    const child       = elem.getNode().firstElementChild;
    child.style.width = elem.$width + "px";

    const inp         = elem.getInputNode();
    inp.style.width   = elem.$width - 5 + "px";
}

function resetInvalidView(self){
    const node   = self.getNode();
    const input  = node.getElementsByTagName("input")[0];
    const css    = "dash-filter-invalid";
    if (input){
        const isInvalid = input.classList.contains(css);
        if (isInvalid){
            webix.html.removeCss(input, css);
        }   
    } 
}

function setNullTimeValue(self){
    const value = self.getText();
    if (!value){
        this.setValue("00:00:00");
    }
}

function createDate(input, id){

    const dateTemplate = {
        view        : "datepicker",
        id          : `dashDatepicker_${id}`,
        format      : "%d.%m.%y",
        sentAttr    : id,
        editable    : true,
        value       : new Date(),
        placeholder : input.label,
        keyPressTimeout:900,
        height      : 42,
        on          : {
            onItemClick:function(){
                resetInvalidView(this);
            },
            onAfterRender : function () {
                this.getInputNode().setAttribute(
                    "title",
                    input.comment
                );

               setAdaptiveWidth(this);
            },

            onChange:function(newV, oldV, config){
                if(config){
                    setToStorage(this);
                }
               
            },

            onTimedKeyPress:function(){
                setToStorage(this);
            },
        }
    };


    return dateTemplate;

}



function createTime (id){
    const timeTemplate =  {   
        view        : "datepicker",
        id          :`dashDatepicker_${id}-time`,
        sentAttr    : id,
        format      : "%H:%i:%s",
        placeholder : "Время",
        height      : 42,
        editable    : true,
        keyPressTimeout:900,
        value       : "00:00:00",
        type        : "time",
        seconds     : true,
        suggest     : {

            type    : "timeboard",
            css     : "dash-timeboard",
            hotkey  : "enter",
            body    : {
                button  : true,
                seconds : true,
                value   : "00:00:00",
                twelve  : false,
                height  : 110, 
            },
        },
        on: {
            onItemClick:function(){
                resetInvalidView(this);
            },

            onTimedKeyPress:function(){
                setNullTimeValue(this);
                setToStorage(this);
            },
            onAfterRender: function () {
                this.getInputNode()
                .setAttribute(
                    "title",
                    "Часы, минуты, секунды"
                );
                setAdaptiveWidth(this);
            },

        }
    };

    return timeTemplate;
}


function createBtn (input, i){

    const btnFilter = new Button({
        
        config   : {
            id       : "dashBtn" + i,
            hotkey   : "Ctrl+Shift+Space",
            value    : input.label,
            click    : function(){
                clickBtn(
                    i, 
                    inputsArray, 
                    idsParam, 
                    findAction
                );
            },
        },
        titleAttribute : input.comment,
        onFunc :{
            onViewResize:function(){
              setAdaptiveWidth(this);
            }
        }

    
    }).maxView("primary");

    return  btnFilter;
}


function createHead(text){
    return {   
        template   : text,
        height     : 30, 
        borderless : true,
        css        : "webix_template-datepicker"
    };
}


function createDatepicker(input, id){

    const inputs = {   
        width   : 200,
        rows    : [ 
            createHead (input.label),
            createDate (input, id),
            createTime (id),
            { height:20 },
        ]
    };
    if (inputsArray){
        inputsArray.push( inputs );
    }
       
}

function createText(input, id){
    
    const value = input.value ? input.value : "";
    const inputs = {   
        width   : 200,
        rows    : [ 

            createHead (input.label),
            { 
                view        : "text", 
                value       : value, 
                sentAttr    : id,
                placeholder : input.label,
            },
            { height:20 },
        ]
    };
   

    if (inputsArray){
        inputsArray.push( inputs );
    }
}



function dataTemplate(i, valueElem){
    const template = { 
            id    : i + 1, 
            value : valueElem
        };
    return template;
}


function createOptions(content){
    const dataOptions = [];
    if (content && content.length){
        content.forEach(function(name, i) {
     
            let title = name;
            if ( typeof name == "object"){
                title = name.name;
            }

            const optionElement = dataTemplate(i, title);
            dataOptions.push(optionElement); 
        });
    }

    return dataOptions;
}

function getOptionData (field){

    return new webix.DataCollection({url:{
        $proxy:true,
        load: function(){
            return ( 
                
                new ServerData({
                    id : field.apiname,
                
                }).get().then(function(data){
                
                    if (data){
                
                        const content = data.content;
                   
                        if (content && content.length){
                            return createOptions(content);
                        } else {
                            return [
                                { 
                                    id    : 1, 
                                    value : ""
                                }
                            ];
                        }
                    }
                    
                })

            );
            
        
            
        }
    }});
}


function createCombo(input, id){
 
    const inputs = {   
        width   : 200,
        rows    : [ 

            createHead (input.label),
            {
                view          : "combo", 
                placeholder   : input.label,
                sentAttr      : id,
                options       : getOptionData (input)
            },
            { height:20 },
        ]
    };

    if (inputsArray){
        inputsArray.push( inputs );
    }
}

function createFilter (inputs, el, ids){

    idsParam           = ids;
    inputsArray.length = 0;

    const keys   = Object.keys(inputs);
    const values = Object.values(inputs);

    values.forEach(function(input, i){
 
        if (input.type == "datetime"){ 
            createDatepicker(input, keys[i]);

        } else if (input.type == "string"){
            createText(input, keys[i]);
        } else if (input.type == "apiselect"){
            createCombo(input, keys[i])

        } else if (input.type == "submit"){

            const actionType    = input.action;
            findAction          = el.actions[actionType];
            
            inputsArray.push(
                {height : 15}
            );
            inputsArray.push(
                createBtn (input, i)
            );

        }


    });

    return inputsArray;
  
}

export {
    createFilter,
    setAdaptiveWidth
};
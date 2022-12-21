import { setFunctionError }     from "../../../../blocks/errors.js";
import { mediator }             from "../../../../blocks/_mediator.js";

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


function createDate(type, input){
    const dateTemplate = {
        view        : "datepicker",
        format      : "%d.%m.%y",
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

    function setId(id){
        const dateFirst = dateTemplate;
        dateFirst.id    = "dashDatepicker_" + id;
        return dateFirst;
    }

    if (type == "first"){
        return setId("sdt");
    } else if (type == "last"){
        return setId("edt");
    }

}

let isClicked = false;

function createTime (type){
    const timeTemplate =  {   
        view        : "datepicker",
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
            // onChange:function(newValue, oldValue, config){
            //     console.log(newValue, oldValue, config)
            //     setToStorage(this);
            // },
       
           
        }
    };


    if (type == "first"){
        const timeFirst = timeTemplate;
        timeFirst.id    = "dashDatepicker_" + "sdt" + "-time";
        return timeFirst;
    } else if (type == "last"){
        const timeLast  = timeTemplate;
        timeLast.id     =  "dashDatepicker_" + "edt" + "-time"; 
        return timeLast;
    }
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


function createInputs( input ){

    const inputs = {   
        width   : 200,
        id      : "datepicker-container"+"sdt",
        rows    : [ 

            createHead ( "Начиная с:"  ),
            createDate ( "first", input ),

            { height:10 },

            createTime ("first"),


            { height:20 },


            createHead ( "Заканчивая:" ),
            createDate ( "last", input ),

            { height:10 },

            createTime ("last"),

        ]
    };

    try{
        inputsArray.push( inputs );
    } catch (err){  
        setFunctionError(err, logNameFile, "createInputs");
    }
}

function createFilter (inputs, el, ids){
    idsParam           = ids;
    inputsArray.length = 0;

    const values       = Object.values(inputs);

    values.forEach(function(input, i){

        if (input.type == "datetime"&& input.order == 3){ 
            createInputs(input);

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
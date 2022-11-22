import { setLogValue }          from '../../../logBlock.js';
import { setFunctionError }     from "../../../../blocks/errors.js";
import { Button }               from '../../../../viewTemplates/buttons.js';

import { createDynamicElems }   from '../dynamicElements/_layout.js';

const logNameFile = "dashboard => createSpace => filter";
 

const inputsArray = [];
let   findAction;
let   idsParam;

function setAdaptiveWidth(elem){
    const child       = elem.getNode().firstElementChild;
    child.style.width = elem.$width + "px";

    const inp         = elem.getInputNode();
    inp.style.width   = elem.$width - 5 + "px";
}

function createDate(type, input){
    const dateTemplate = {
        view        : "datepicker",
        format      : "%d.%m.%y",
        editable    : true,
        value       : new Date(),
        placeholder : input.label,
        height      : 42,
        on          : {
            onAfterRender : function () {
                this.getInputNode().setAttribute("title",input.comment);

               setAdaptiveWidth(this);
            },
        }
    };

    if (type == "first"){
        const dateFirst = dateTemplate;
        dateFirst.id    = "dashDatepicker_"+"sdt";
        return dateFirst;
    } else if (type == "last"){
        const dateLast  = dateTemplate;
        dateLast.id     = "dashDatepicker_"+"edt";
        return dateLast;
    }

}

function createTime (type){
    const timeTemplate =  {   
        view        : "datepicker",
        format      : "%H:%i:%s",
        placeholder : "Время",
        height      : 42,
        editable    : true,
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
            }
        },
        on: {
            onAfterRender: function () {
                this.getInputNode().setAttribute("title","Часы, минуты, секунды");
                setAdaptiveWidth(this);
            }
           
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

function clickBtn(i){
    const dateArray     = [];
    const compareDates  = [];

    let sdtDate         = "";
    let edtDate         = "";
    let validateEmpty   = true;

    function enumerationElements(el){
   
        const childs         = $$(el.id).getChildViews();
        const postformatTime = webix.Date.dateToStr("%H:%i:%s");

        childs.forEach(function(elem,i){

            function createTime(type){
                const value = $$(elem.config.id).getValue();
          
                try{
                    if (value !== null ){

                        if (type == "sdt"){
                            sdtDate = sdtDate.concat( " " + postformatTime(value) );
                        } else if (type == "edt"){
                            edtDate = edtDate.concat( " " + postformatTime(value) );
                        }
                
                    } else {
                        validateEmpty = false;
                    }
                } catch (err){  
                    setFunctionError(err,logNameFile,"createTime");
                }
            }

            function createDate(type){
                try{
                    if ( $$(elem.config.id).getValue() !== null ){

                        const value          = $$(elem.config.id).getValue();
                        const postFormatData = webix.Date.dateToStr("%d.%m.%y");

                        if (type == "sdt"){
                            sdtDate = postFormatData(value); 
                        } else if ( type ==  "edt"){
                            edtDate = postFormatData(value);
                        }
                    
                    } else {
                        validateEmpty=false;
                    }
                } catch (err){  
                    setFunctionError(err,logNameFile,"createDate");
                }
            }
            
            if (elem.config.id.includes("sdt")){

                if (elem.config.id.includes("time")){
                    createTime("sdt");
                } else {
                    createDate("sdt");
                }
            } else if (elem.config.id.includes("edt")){
            
                if (elem.config.id.includes("time")){
                    createTime("edt");
                } else {
                    createDate("edt");
                }
            
                
            }
        });
   
    }

    function setInputs(){
        try{
            inputsArray.forEach(function(el,i){
                if ( el.id.includes("container") ){
                    enumerationElements(el);
                }
            });
        } catch (err){  
            setFunctionError(err,logNameFile,"setInputs");
        }
    }

    function createQuery(){
        dateArray.push( "sdt" + "=" + sdtDate );
        dateArray.push( "edt" + "=" + edtDate );
     
        compareDates.push( sdtDate ); 
        compareDates.push( edtDate );
    }

    function getDataInputs(){
        setInputs   ();
        createQuery ();
    }

    function sentQuery (){

        function removeCharts(){
            try{
                const charts = $$("dashboard-charts");
                const body   = $$("dashboardBody");
      
                if (charts){
                    body.removeView(charts);
                }
            } catch (err){  
                setFunctionError(err,logNameFile,"removeCharts");
            }
        }

        function setStateBtn(){
            try{
                const btn = $$("dashBtn" + i);
                btn.disable();
         
                setTimeout (function () {
                    const node = btn.getNode();
                    if (node){
                        btn.enable();
                    }
                  
                }, 1000);
            } catch (err){  
                setFunctionError(err, logNameFile, "setStateBtn");
            }
        }

        if (validateEmpty){

            const compareFormatData = webix.Date.dateToStr ("%Y/%m/%d %H:%i:%s");
            const start             = compareFormatData    (compareDates[0]);
            const end               = compareFormatData    (compareDates[1]);

            const compareValue      = webix.filters.date.greater(start,end);
            
            if ( !(compareValue) || compareDates[0] == compareDates[1] ){

                const getUrl = findAction.url + "?" + dateArray.join("&");
                removeCharts();
                createDynamicElems(
                    getUrl, 
                    inputsArray,
                    idsParam, 
                    true)
                    ;
                setStateBtn(i);

            } else {
                setLogValue("error", "Начало периода больше, чем конец");
            }
        } else {
            setLogValue("error", "Не все поля заполнены");
        }
    }

    getDataInputs();
    sentQuery ();
}

function createBtn (input, i){

    const btnFilter = new Button({
        
        config   : {
            id       : "dashBtn" + i,
            hotkey   : "Ctrl+Shift+Space",
            value    : input.label,
            click    : function(){
                clickBtn(i);
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
    idsParam = ids;
    inputsArray.length = 0;
    const values = Object.values(inputs);

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
    createFilter
};
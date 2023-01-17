import { setFunctionError }   from "../../../../../blocks/errors.js";
import { ServerData }         from "../../../../../blocks/getServerData.js";
import { Action }             from "../../../../../blocks/commonFunctions.js";
import { Button }             from '../../../../../viewTemplates/buttons.js';
import { submitBtn }          from './buttonLogic.js';

const logNameFile = "table => createSpace => dynamicElements => createInputs";

let data; 
let idCurrTable;
let field; 
let dataInputsArray;


function setAdaptiveWidth(elem){

    const child       = elem.getNode().firstElementChild;
    child.style.width = elem.$width + "px";

    const inp         = elem.getInputNode();
    inp.style.width   = elem.$width - 5 + "px";
}

function createTextInput    (i){
    return {   
        view            : "text",
        placeholder     : field.label, 
        id              : "customInputs" + i,
        height          : 48,
        labelPosition   : "top",
        on              : {
            onAfterRender: function () {
                this.getInputNode().setAttribute("title", field.comment);
                setAdaptiveWidth(this);
            },
            onChange:function(){
                const inputs = $$("customInputs").getChildViews();

                inputs.forEach(function(el){
                    const view = el.config.view;
                    const btn  = $$(el.config.id);

                    if (view == "button"){
                        Action.enableItem(btn);
                    }
                });

            }
        }
    };
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
    if (typeof content == "object"){
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

function getOptionData      (){

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

function createSelectInput  (el, i){

    return   {   
        view          : "combo",
        height        : 48,
        id            : "customCombo" + i,
        placeholder   : field.label, 
        labelPosition : "top", 
        options       : {
            data : getOptionData ( dataInputsArray, el )
        },
        on: {
            onAfterRender: function () {
                this.getInputNode()
                .setAttribute( "title", field.comment );
                setAdaptiveWidth(this);
            },
        }               
    };
}

function createDeleteAction (i){
    const table     = $$(idCurrTable);
    const countCols = table.getColumns().length;
    const columns   = table.config.columns;

    try{
        columns.splice (countCols, 0 ,{ 
            id      : "action"+i, 
            header  : "Действие",
            label   : "Действие",
            css     : "action-column",
            template: "{common.trashIcon()}"
        });

        table.refreshColumns();

    } catch (err){
        setFunctionError(
            err,
            logNameFile,
            "generateCustomInputs => createDeleteAction"
        );
    } 

}

function getInputsId        (element){

    const parent     = element.getParentView();
    const childs     = parent .getChildViews();
    const idElements = [];

    try{
        childs.forEach((el,i) => {
            const view = el.config.view;
            const id   = el.config.id;
            if ( id !== undefined ){
                if ( view == "text" ){
                    idElements.push({
                        id  : id, 
                        name: "substr"
                    });

                } else if ( view == "combo"){
                    idElements.push({
                        id  : id, 
                        name: "valtype"
                    });
                } else if ( view == "uploader"    || 
                            view == "datepicker"  ){
                    idElements.push({ 
                        id : id 
                    });
                }
            }

        });
    } catch (err){
        setFunctionError(
            err,
            logNameFile,
            "generateCustomInputs => getInputsId"
        );
    } 
    return idElements;
}

function createDeleteBtn    (findAction,i){

    const btn = new Button({

        config   : {
            id       : "customBtnDel" + i,
            hotkey   : "Shift+Q",
            icon     : "icon-trash", 
            value    : field.label,
            click    : function () {
                const idElements = getInputsId (this);
                submitBtn( idElements, findAction.url, "delete" );
            },
        },
        titleAttribute : field.comment
    
       
    }).minView("delete");

    return btn;
}


function submitClick(findAction, i, id, elem){

    const idElements = getInputsId (elem);
    const btn        =  $$("contextActionsPopup");

    if (findAction.verb== "GET"){
        if ( findAction.rtype == "refresh") {
            submitBtn( 
                idElements, 
                findAction.url, 
                "get", 
                "refresh" 
            );

        } else if (findAction.rtype == "download") {
            submitBtn( 
                idElements, 
                findAction.url, 
                "get", 
                "download"
            );

        }
        
    } else if ( findAction.verb == "POST" ){
        submitBtn( 
            idElements, 
            findAction.url, 
            "post" 
        );
        $$("customBtn" + i ).disable();
    } 
    else if (findAction.verb == "download"){
        submitBtn( 
            idElements, 
            findAction.url, 
            "get", 
            "download", 
            id 
        );

    }
    Action.hideItem(btn);    
}

function createCustomBtn    (findAction, i){

    const btn = new Button({
        
        config   : {
            id       : "customBtn" + i,
            value    : field.label,
            click    : function (id) {
                submitClick(findAction, i, id, this);
            },
        },
        titleAttribute : field.comment,
        onFunc         : {
            onViewResize:function(){
                setAdaptiveWidth(this);
            }
        }

    
    }).maxView("primary");

    return btn;
}

function createUpload       (i){
    return  {   
        view         : "uploader", 
        value        : "Upload file", 
        id           : "customUploader" + i,
        height       : 42,
        autosend     : false,
        upload       : data.actions.submit.url,
        label        : field.label, 
        labelPosition: "top",
        on: {
            onAfterRender: function () {
                this.getInputNode().setAttribute( "title", field.comment );
                setAdaptiveWidth(this);
                const parent = this  .getParentView();
                const childs = parent.getChildViews();

                childs.forEach(function(el,i){
                    if (el.config.id.includes("customBtn")){
                        el.disable();
                    }
                });
            },
            onBeforeFileAdd:function(){
                const loadEl = $$("templateLoad");
                if (loadEl){
                    loadEl.getParentView().removeView(loadEl);
                }
            },
            onAfterFileAdd:function(file){
                const parent = this  .getParentView();
                const childs = parent.getChildViews();

                childs.forEach(function(el){
                    if (el.config.id.includes("customBtn")){
                        el.enable();
                    }
                });
            }

        }
    };
}

function createDatepicker   (i){
    return {   
        view         : "datepicker",
        format       : "%d.%m.%Y %H:%i:%s",
        placeholder  : field.label,  
        id           :"customDatepicker"+i, 
        timepicker   : true,
        labelPosition:"top",
        height       :48,
        on           : {
            onAfterRender: function () {
                this.getInputNode().setAttribute( "title", field.comment );
                setAdaptiveWidth(this);
            },
            onChange:function(){
                try{
                    const inputs = $$("customInputs").getChildViews();
                    inputs.forEach(function(el,i){
                        const btn  = $$(el.config.id);
                        const view = el.config.view;
                        if ( view == "button" && !(btn.isEnabled()) ){
                            btn.enable();
                        }
                    });
                } catch (err){
                    setFunctionError(
                        err,
                        logNameFile,
                        "generateCustomInputs => createDatepicker onChange"
                    );
                } 

            }
        }
    };
}

function createCheckbox     (i){
    return {   
        view       : "checkbox", 
        id         : "customСheckbox" + i, 
        css        : "webix_checkbox-style",
        labelRight : field.label, 
        on         : {
            onAfterRender: function () {
                this.getInputNode()
                .setAttribute("title", field.comment);
            },

            onChange:function(){
                try{
                    const inputs = $$("customInputs").getChildViews();
                    inputs.forEach(function(el,i){
                        const view = el.config.view;
                        const btn  = $$(el.config.id);
                        if (view == "button" && !(btn.isEnabled())){
                            btn.enable();
                        }
                    });
                } catch (err){
                    setFunctionError(
                        err,
                        logNameFile,
                        "generateCustomInputs => createCheckbox onChange"
                    );
                } 
            }
        }
    };
}

function generateCustomInputs (dataFields, id){  
    idCurrTable = id;
    data        = dataFields;  

    dataInputsArray     = data.inputs;

    const customInputs  = [];
    const objInuts      = Object.keys(data.inputs);

    objInuts.forEach((el,i) => {
        field = dataInputsArray[el];
        if ( field.type == "string" ){
            customInputs.push(
                createTextInput(i)
            );
        } else if ( field.type == "apiselect" ) {
           
            customInputs.push(
                createSelectInput(el, i, dataInputsArray)
            );

        } else if ( field.type == "submit" || 
                    field.type == "button" ){

            const actionType = field.action;
            const findAction = data.actions[actionType];
        
            if ( findAction.verb == "DELETE" && actionType !== "submit" ){
                createDeleteAction (i);
            } else if ( findAction.verb == "DELETE" ) {
                customInputs.push(
                    createDeleteBtn(findAction, i)
                );
            } else {
                customInputs.push(
                    createCustomBtn(findAction, i)
                        
                );
            }
        } else if ( field.type == "upload" ){
            customInputs.push(
                createUpload(i)
            );
        } else if ( field.type == "datetime" ){
            customInputs.push(
                createDatepicker(i)
            );
        }else if ( field.type == "checkbox" ){
            customInputs.push(
                createCheckbox(i)
            );

        } 
    });


    return customInputs;
}

export {
    generateCustomInputs
};
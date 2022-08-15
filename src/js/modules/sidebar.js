import {tableId,editFormId,addBtnId,findElementsId, searchId,
        tableIdView,findElementsIdView,searchIdView
} from './setId.js';

import {notify, checkFormSaved,clearItem,popupExec, defaultStateForm} from "./editTableForm.js";

import {logBlock} from "./logBlock.js";

let itemTreeId = "";
let prevCountRows ;
let inpObj={};
let customInputs = [];
let urlFieldAction ;
let checkAction = false;


function submitBtn (idElements, url, verb, rtype){
    
    let valuesArray = [];

    if (verb=="get"){ 

        if(rtype=="refresh"){
            idElements.forEach((el,i) => {
                if (el.id.includes("customCombo")){
                    console.log(el);
                    valuesArray.push(el.name+"="+$$(el.id).getText());
                } else if (el.id.includes("customInputs")) {
                    console.log(el)
                    valuesArray.push(el.name+"="+$$(el.id).getValue());
                } else if (el.id.includes("customDatepicker")) {
                    console.log(el);
                    valuesArray.push(el.name+"="+$$(el.id).getValue());
                }    
            });

            webix.ajax(url+"?"+valuesArray.join("&"),{
                success:function(text, data, XmlHttpRequest){
                    console.log("yeee");
                    $$(tableIdView).clearAll();
    
                    data = data.json().content;
                    if (data.length !== 0){
                        $$(tableIdView).hideOverlay("Ничего не найдено");
                        $$(tableIdView).parse(data);
                    } else {
                        $$(tableIdView).showOverlay("Ничего не найдено");
                    }
                    prevCountRows = $$(tableIdView).count();
                    $$(findElementsIdView).setValues(prevCountRows.toString());
                },
                error:function(text, data, XmlHttpRequest){
                    notify ("error","Ошибка при загрузке данных",true);
                }
            });


        } else if (rtype=="download"){
            webix.ajax().response("blob").get(url, function(text, blob, xhr) {
                webix.html.download(blob, "table.docx");
            });
        } 
    } 
    
}



function getInfoTable (idCurrTable, idSearch, idsParam, idFindElem) {
    
    itemTreeId = idsParam;
    let titem = $$("tree").getItem(idsParam);
   
    $$(idCurrTable).clearAll();
    $$(idSearch).setValue("");


    if (titem == undefined) {
        // webix.ajax().get("/init/default/api/fields.json").then(function (data) {
        //     notify ("error","Данные не найдены");
        // });
        notify ("error","Данные не найдены");
    } else {
        let inpObj;
        if (idCurrTable == tableIdView){
            ($$("filterBar").removeView( "customInputs" ));
        }

        webix.ajax().get("/init/default/api/fields.json").then(function (data) {
      
// ---- Таблица - данные cols      

            data = data.json().content[idsParam];
            
            let dataFields = data.fields;
            let obj = Object.keys(data.fields);
            let columnsData = [];
           
            obj.forEach(function(data) {
                if (dataFields[data].type == "datetime"){
                    dataFields[data].format = webix.i18n.fullDateFormatStr;
                }
                dataFields[data].id = data;
                dataFields[data].fillspace = true;
                dataFields[data].header= dataFields[data]["label"];
                if(dataFields[data].id == "id"){
                    dataFields[data].hidden = true;
                }
                columnsData.push(dataFields[data]);
            });

            $$(idCurrTable).refreshColumns(columnsData);



// ---- Таблица - action detail у fields            

            let idCol;
            let actionKey;
            checkAction = false;

            console.log( data)

            columnsData.forEach(function(field,i){
                if( field.type == "action" && data.actions[field.id].rtype == "detail"){
                    checkAction = true;
                    idCol = i;
                    actionKey = field.id;
                } 
            });
            
            if (actionKey !== undefined){
                urlFieldAction = data.actions[actionKey].url;
            
                if (checkAction){
                    let columns = $$(idCurrTable).config.columns;
                    columns.splice(0,0,{ id:"action-first"+idCol, maxWidth:130, header:"Подробнее", template:"<span class='webix_icon wxi-angle-down'></span> "});
                    $$(idCurrTable).refreshColumns();
                }
            }

          

 // -----  Array с кастомными полями

            let objInuts = Object.keys(data.inputs);
            
            let customInputs = [];
            let idElements = [];

            let dataInputsArray = data.inputs;

            objInuts.forEach((el,i) => {
                if (dataInputsArray[el].type == "string"){
                    customInputs.push(
                    {   view:"text",
                        placeholder:dataInputsArray[el].label, 
                        id: "customInputs"+i,
                        maxWidth:300,
                        minWidth:150,
                        height:48,
                        //label:dataInputsArray[el].label, 
                        labelPosition:"top",
                        on: {
                            onAfterRender: function () {
                                this.getInputNode().setAttribute("title",dataInputsArray[el].comment);
                             },
                        }
                    });
                } else if (dataInputsArray[el].type == "apiselect") {

                    let optionData = new webix.DataCollection({url:{
                        $proxy:true,
                        load: function(){
                            return ( webix.ajax().get("/init/default/api/"+dataInputsArray[el].apiname).then(function (data) {
                                console.log(data.json())        
                                let dataSrc = data.json().content;
                                        
                                        let dataOptions=[];
                                        if (dataSrc[0].name !== undefined){
                                            
                                            dataSrc.forEach(function(data, i) {
                                                console.log(data);
                                                dataOptions.push( 
                                                    {id:i+1, value:data.name},
                                                );
                                            });
                                           
                                        } else {
                                            dataSrc.forEach(function (data, i) {
                                                dataOptions.push(
                                                    { id: i + 1, value: data },
                                                );
                                            });

                                        }
                                       
                                        return dataOptions;
                                    })
                                );
                            
                           
                            
                        }
                    }});


                    customInputs.push(
                        { view:"combo",
                        width:250,
                        height:48,
                        id: "customCombo"+i,
                        //placeholder:"Введите текст",  
                        //label:dataInputsArray[el].label,
                        placeholder:dataInputsArray[el].label, 
                        labelPosition:"top", 
                        options:{
                            data:optionData
                        },
                        on: {
                            onAfterRender: function () {
                                this.getInputNode().setAttribute("title",dataInputsArray[el].comment);
                            },
                        }               
                    });

                } else if (dataInputsArray[el].type == "submit" || dataInputsArray[el].type == "button") {
                    let actionType = dataInputsArray[el].action;
                    let findAction = data.actions[actionType];

                    if (findAction.verb == "DELETE" && actionType !== "submit"){
                        let countCols = $$(idCurrTable).getColumns().length;
                        let columns = $$(idCurrTable).config.columns;
                        columns.splice(countCols,0,{ id:"action"+i, header:"Действие",maxWidth:100, template:"{common.trashIcon()}"});

                        $$(idCurrTable).refreshColumns();
                    } else if (findAction.verb == "DELETE") {
                        customInputs.push(

                                {   view:"button", 
                                    id:"customBtnDel"+i,
                                    css:"webix_danger", 
                                    type:"icon", 
                                    icon:"wxi-trash", 
                                    inputHeight:48,
                                    height:48,
                                    width:100,
                                    value:dataInputsArray[el].label,
                                    click:function (id) {
                                        submitBtn(idElements,findAction.url,"delete");
                                    },
                                    on: {
                                        onAfterRender: function () {
                                            this.getInputNode().setAttribute("title",dataInputsArray[el].comment);
                                        },
                                    },
                                    
                                    
                                }, 

                        );
                    } else {
                        customInputs.push(

                                {   view:"button", 
                                    css:"webix_primary", 
                                    id:"customBtn"+i,
                                    inputHeight:48,
                                    height:48, 
                                    minWidth:100,
                                    maxWidth:550,
                                    value:dataInputsArray[el].label,
                                    click:function (id) {

                                        if (findAction.verb== "GET"){
                                            if ( findAction.rtype== "refresh") {
                                                submitBtn(idElements,findAction.url, "get", "refresh");
                                                console.log("get");
                                            } else if (findAction.rtype== "download") {
                                                submitBtn(idElements,findAction.url, "get", "download");
                                                console.log("get");
                                            }
                                            

                                        } else if (findAction.verb == "POST"){
                                            submitBtn(idElements,findAction.url,"post");
                                            console.log("post");

                                        } 
                                        else if (findAction.verb == "download"){
                                            submitBtn(idElements,findAction.url, "get", "download",id);
                                            console.log("download");
                                        }
                                    
                                        
                                    },
                                    on: {
                                        onAfterRender: function () {
                                            this.getInputNode().setAttribute("title",dataInputsArray[el].comment);
                                        },
                                    },
                                }, 
                        );
                    }
                } else if (dataInputsArray[el].type == "upload"){
                    customInputs.push(
                        {rows:[
                            {},
                            {   view: "uploader", 
                                value: "Upload file", 
                                id:"customUploader"+i, 
                                height:48,
                                link:tableIdView,  
                                upload: data.actions.submit.url,
                                label:dataInputsArray[el].label, 
                                labelPosition:"top",
                                on: {
                                    onAfterRender: function () {
                                        this.getInputNode().setAttribute("title",dataInputsArray[el].comment);
                                    },
                                    onFileUpload: function () {
                                        notify ("success","Файл успешно загружен",true);
                                    },
                                    onFileUploadError: function () {
                                        notify ("error","Ошибка при загрузке файла",true);
                                    }
                                }
                            }
                        ]}
                    );
                } else if (dataInputsArray[el].type == "datetime"){
                    customInputs.push(
                            {   view: "datepicker",
                                format: webix.Date.strToDate("%d.%m.%Y"),
                                //placeholder:"дд.мм.гг",
                                placeholder:dataInputsArray[el].label,  
                                id:"customDatepicker"+i, 
                                timepicker: true,
                                labelPosition:"top",
                                width:300,
                                minWidth:100,
                                height:48,
                                //label:dataInputsArray[el].label, 
                                on: {
                                    onAfterRender: function () {
                                        this.getInputNode().setAttribute("title",dataInputsArray[el].comment);
                                    },
                                }
                            }
                    );
                }else if (dataInputsArray[el].type == "checkbox"){
                   
                    customInputs.push(
                            {   view:"checkbox", 
                                id:"customСheckbox"+i, 
                                css:"webix_checkbox-style",
                                //labelPosition:"top",
                                //labelWidth: "auto",
                                labelRight:dataInputsArray[el].label, 
                                //label:dataInputsArray[el].label, 
                                on: {
                                    onAfterRender: function () {
                                        this.getInputNode().setAttribute("title",dataInputsArray[el].comment);
                                    },
                                }
                            }
                    );

                } 
            
                if (dataInputsArray[el].type == "checkbox"){
                   
                }
                customInputs.push({width:20});
            });
            
          

            customInputs.forEach((el,i) => {
                
                if (el.id !== undefined){
                    if (el.view=="text"){
                        idElements.push({id:el.id, name:"substr"});
                    } 
                    else if (el.view=="combo") {
                        idElements.push({id:el.id, name:"valtype"});
                    } else if (el.view=="uploader"){
                        idElements.push({id:el.id});
                    } else if (el.view=="datepicker"){
                        idElements.push({id:el.id});
                    }
                }

            });
           
           
            inpObj = {id:"customInputs",css:"webix_custom-inp", cols:customInputs};
            
            ($$("filterBar").addView( inpObj,2));
        });


// ----- Таблица - получение данных rows

        webix.ajax().get("/init/default/api/"+itemTreeId,{
            success:function(text, data, XmlHttpRequest){
                $$(idCurrTable).showProgress({
                    type:"bottom",
                    hide:true
                });

                data = data.json().content;

                if (data.length !== 0){
                    $$(idCurrTable).hideOverlay("Ничего не найдено");
                    $$(idCurrTable).parse(data);
                } else {
                    $$(idCurrTable).showOverlay("Ничего не найдено");
                }
            
                prevCountRows = $$(idCurrTable).count();
                //$$(idCurrTable).hideProgress({hide:true});
                $$(idFindElem).setValues(prevCountRows.toString());
              
            },
            error:function(text, data, XmlHttpRequest){
                notify ("error","Ошибка при загрузке данных",true);
            }, 
        });
    } 
}



function getInfoDashboard (){

    function getAjax(url,inputsArray, action=false) {
        webix.ajax().get(url, {
            success:function(text, data, XmlHttpRequest){
                let dashLayout=[];
                let dataCharts = data.json().charts;
                let titleTemplate = {};
    
                dataCharts.forEach(function(el,i){
                    titleTemplate = el.title;
                    delete el.title;
                    el.borderless = true;
                    el.minWidth = 300;
                    dashLayout.push({rows:[ {template:titleTemplate,borderless:true,css:{"margin-top":"20px!important", "font-weight":"600!important", "font-size":"18px!important"}, height:30},el]});
                });
    
    
                if (!(action)){
                    $$("dashboardTool").addView({
                        view:"scrollview",
                        id:"dashboard-tool",
                        borderless:true,
                        css:{"margin":"20px!important","height":"50px!important"},
                        body: {
                            view:"flexlayout",
                            rows:inputsArray
                        }
                    },0);
    
                    $$("dashboardTool").addView({
                        rows:[{
                            template:"",
                            css:"webix_style-template-count",
                            borderless:false,
                            height:30,
                        }]
                    },1);
    
                    $$("dashboardBody").addView({
                        view:"scrollview", 
                        height:300,  
                        id:"dashboard-charts",
                        borderless:true,
                        body: {
                            view:"flexlayout",
                            cols:dashLayout
                        }
                    },2);
                    
                    $$("dashboardBody").removeView($$("dashEmpty"));
                
                } else {
    
        
                    $$("dashboardBody").removeView( $$("dashboard-charts"));
                    
                    $$("dashboardBody").addView({
                        view:"scrollview", 
                        id:"dashboard-charts", 
                        height:300, 
                        borderless:true,
                        css:{"margin":"10px!important"},
                        body: {
                            view:"flexlayout",
                            cols:dashLayout
                        }
                    },2);
    
    
                    if ($$("dashboard-charts")){
                        notify ("success","Данные обновлены",true);
                    } else {
                        notify ("error","Ошибка при загрузке данных",true);
                    }
                }
            },
            error:function(text, data, XmlHttpRequest){
                notify ("error","Ошибка при сохранении данных",true);
            }
        });
        
    }



    if(!($$("dashboard-charts"))){


        webix.ajax().get("/init/default/api/fields").then(function (data){
            let fields = data.json().content;
            let inputsArray=[];
            let actionType ;
            let findAction;

            Object.values(fields) .forEach(function(el,i){
                //console.log(el.type)
                if (el.type == "dashboard"){
                    //console.log(el.inputs)
                    let inputs = el.inputs;
                    
                    inputsArray.push({width:20});
                    Object.values(inputs).forEach(function(input,i){
                        
                        
                        if (input.type == "datetime"){
                            inputsArray.push(
                                    {   view: "datepicker",
                                        format: webix.Date.strToDate("%d.%m.%Y"),
                                        //placeholder:"дд.мм.гг",
                                        //placeholder:dataInputsArray[el].label,  
                                        id:"dashDatepicker"+i, 
                                        timepicker: true,
                                        //labelPosition:"top",
                                        placeholder:input.label,
                                        width:300,
                                        minWidth:100,
                                        height:48,
                                        //label:input.label, 
                                        on: {
                                            onAfterRender: function () {
                                                this.getInputNode().setAttribute("title",input.comment);
                                            },
                                        }
                                    }
                            );
                           
                        } else if (input.type == "submit"){
                            actionType = input.action;
                            findAction = el.actions[actionType];
                            console.log(findAction);
                            inputsArray.push(

                                    {   view:"button", 
                                        css:"webix_primary", 
                                        id:"dashBtn"+i,
                                        inputHeight:48,
                                        height:48, 
                                        minWidth:100,
                                        maxWidth:200,
                                        value:input.label,
                                        click:function () {
                                            getAjax(findAction.url, inputsArray,true);
                                            
                                        },
                                        on: {
                                            onAfterRender: function () {
                                                this.getInputNode().setAttribute("title",input.comment);
                                            },
                                        },

                                    }, 
                            );
                        }
                        inputsArray.push({width:20});
                    });
                    
                }
            });

            getAjax(findAction.url, inputsArray);
            
        });

    }


    
}


function headerSidebar () {
    const headerLogo = {
         view:"label",
         label:"<img src='/init/static/images/expalogo.png' style='height:30px; margin: 10px;'>", 
         height:30
    };
    const collapseBtn = {   
        view:"button",
        type:"icon",
        id:"collapseBtn",
        icon:"wxi-angle-double-left",
        css:"webix_collapse",
        title:"текст",
        height:45,
        width:40,
        click:function() {
            
            if ($$("tree").isVisible()){
                $$("collapseBtn").config.icon ="wxi-angle-double-right";
                $$("collapseBtn").refresh();
                $$("tree").hide();
                //$$("logBlock").hide();
                if($$("sideMenuResizer")){
                    console.log("есть")
                    $$("sideMenuResizer").hide();
                }  else{
                    console.log("ytn")
                }
                
            } else {
                $$("tree").show();
                //$$("logBlock").show();
                $$("collapseBtn").config.icon ="wxi-angle-double-left";
                $$("collapseBtn").refresh();
                if(window.innerWidth >= 800){
                    if($$("sideMenuResizer")){
                        $$("sideMenuResizer").show();
                    }
                } 
              
                
            }
            
        },
        on: {
            onAfterRender: function () {
                this.getInputNode().setAttribute("title","Видимость бокового меню");
            }
    } 
    };

    return {cols:[collapseBtn,headerLogo]}
}


let tableNames = [];

function treeSidebar () {
    let tree = {
        view:"edittree",
        id:"tree",
        minWidth:100,
        width: 250,
        //minHeight:150,
        editable:false,
        select:true,
        editor:"text",
        editValue:"value",
        activeTitle:true,
        clipboard: true,
        data: webix.ajax().get("/init/default/api/fields.json").then(function (data) {
         

            let srcTree = data.json().content;
            //console.log(data.json())
            let obj = Object.keys(srcTree);
            let actionsCheck;
            //let dataTree = [];
            let dataChilds = {tables:[], forms:[], dashboards:[]};
      
    
            obj.forEach(function(data) {
                if (srcTree[data].actions){
                    actionsCheck = Object.keys(srcTree[data].actions)[0]; 
                } 
                
                if (srcTree[data].type == "dbtable"){

                    if(srcTree[data].plural){
                        dataChilds.tables.push({"id":data, "value":srcTree[data].plural, "type":srcTree[data].type});
                        tableNames.push({name:srcTree[data].plural , id:data});
                    } else if (srcTree[data].singular) {
                        dataChilds.tables.push({"id":data, "value":srcTree[data].singular, "type":srcTree[data].type});
                        tableNames.push({name:srcTree[data].singular , id:data});
                    }

                } else if (srcTree[data].type == "tform"){
                    if(srcTree[data].plural){
                        dataChilds.forms.push({"id":data, "value":srcTree[data].plural, "type":srcTree[data].type});
                        tableNames.push({name:srcTree[data].plural , id:data}); 
                    }else if (srcTree[data].singular) {
                        dataChilds.forms.push({"id":data, "value":srcTree[data].singular, "type":srcTree[data].type});
                        tableNames.push({name:srcTree[data].singular , id:data}); 

                    }
                }  else if (srcTree[data].type == "dashboard" ){
           
                    if(srcTree[data].plural){
                        dataChilds.dashboards.push({"id":data, "value":srcTree[data].plural, "type":srcTree[data].type});
                        tableNames.push({name:srcTree[data].plural , id:data}); 
                    }else if (srcTree[data].singular) {
                        dataChilds.dashboards.push({"id":data, "value":srcTree[data].singular, "type":srcTree[data].type});
                        tableNames.push({name:srcTree[data].singular , id:data}); 

                    }
                }   
            });


            return webix.ajax().get("/init/default/api/mmenu.json").then(function (data) {
                console.log(data.json().mmenu)
                let menu = data.json().mmenu;
                let menuTree = [];


                menu.forEach(function(el,i){
                       
                    if (el.childs.length > 0){
                        dataChilds[el.name]=[];
                        el.childs.forEach(function(child,i){
                            dataChilds[el.name].push({id:child.name, value:child.title });
                        });
                    }

                    if (el.name.includes("delim")){
                    } else {
                
                        if (el.title){
                            menuTree.push({id:el.name, value:el.title, data:dataChilds[el.name]});
                        } else {
                            menuTree.push({id:el.name, value:"Без названия", data:dataChilds[el.name]});
                        }
                    }
                        
                });
             
                return menuTree;
            });
                
           
        }), 
         
        
        on:{
            onSelectChange:function (ids) {
               
                if($$("inputsTable")){
                    $$(editFormId).removeView($$("inputsTable"));
                }
                
                itemTreeId = ids[0];
                let treeItemId = $$("tree").getSelectedItem().id;
                let getItemParent = $$("tree").getParentId(treeItemId);

                if (ids[0]&&getItemParent!==0){
                    $$("webix__none-content").hide();
                }

                if(getItemParent=="tables" ){
                    $$("dashboards").hide();
                    $$("forms").hide();
                    $$("tables").show();
                }

                if(getItemParent=="dashboards"){
                   
                    $$("tables").hide();
                    $$("forms").hide();
                    $$("dashboards").show();
                }

                if(getItemParent=="forms"){
                    if ($$("propTableView") && $$("propTableView").isVisible()){
                        $$("propTableView").hide();
                    }
                    $$("tables").hide();
                    $$("dashboards").hide();
                    $$("forms").show();
                }


                if(getItemParent=="tables"){
                   
                    //$$(addBtnId).enable();
                    defaultStateForm();
                    
                    if(Object.keys($$(editFormId).elements).length!==0){
                        $$("inputsTable").hide();
                    }

                    getInfoTable (tableId, searchId, ids[0], findElementsId);

                } else if(getItemParent=="dashboards") {
                   getInfoDashboard ();

                } else if(getItemParent=="forms") {
                    getInfoTable (tableIdView, searchIdView, ids[0], findElementsIdView);
                }

            },
  

            onBeforeSelect: function(data) {
                
                let getItemParent = $$("tree").getParentId(data);
                if(getItemParent=="tables"){
                    if($$(editFormId).isDirty()){
                        checkFormSaved().then(function(result){
                            if(result) {
                                clearItem();
                                $$("tree").select(data);
                            } 
                        });
                        return false;
                    }
                }
            },

            onBeforeRender:function() {
                if(window.innerWidth <= 550){
                    $$("sideMenuResizer").hide();
                } else {
                    $$("sideMenuResizer").show();
                }
               
            }

        },
        

    };

    const treeLayout = {
        rows:[tree,
            {view:"resizer"},
            logBlock
        ]
    };
    return tree;
}



export{
    headerSidebar,
    treeSidebar,
    itemTreeId,
    inpObj,
    customInputs,
    urlFieldAction,
    tableNames
};
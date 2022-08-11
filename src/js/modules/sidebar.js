import {tableId,editFormId,addBtnId,findElementsId, searchId,
        tableIdView,findElementsIdView,searchIdView, saveNewBtnId
} from './setId.js';

import {notify, checkFormSaved,clearItem,popupExec, defaultStateForm} from "./editTableForm.js";
import  {jsonDashboard } from "../treeItems/dashboardView.js";



let itemTreeId = "";
let prevCountRows ;
let inpObj={};
let customInputs = [];
let urlFieldAction ;
let checkAction = false;


function submitBtn (idElements, url, verb, rtype, idBtn=""){
    
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
            webix.ajax(url+"?"+valuesArray.join("&")).then(function(data) {
                console.log(data.json());
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
            });

        } else if (rtype=="download"){
            webix.ajax().response("blob").get(url, function(text, blob, xhr) {
                webix.html.download(blob, "table.docx");
            });
        } else if (rtype=="delete") {

        }

    } 
    // else if (verb=="post") {
    //     let uploadFile;
    //     idElements.forEach((el,i) => {
    //         if (el.id.includes("customUploader")){
    //             console.log(el);
    //             uploadFile = $$(el.id).getValue();
    //         } 
    //     });
    //     webix.ajax().post(url,{uploadFile});
    // }
    
}



function getInfoTable (idCurrTable, idSearch, idsParam, idFindElem) {
   
    
    itemTreeId = idsParam;
    let titem = $$("tree").getItem(idsParam); //id,value tree item
   
    $$(idCurrTable).clearAll();
    $$(idSearch).setValue("");


    if (titem == undefined) {
        webix.ajax().get("/init/default/api/fields.json").then(function (data) {
            notify ("error","Данные не найдены");
        });
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

            obj.forEach(function(data,i) {
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


// ---- Таблица - проверить наличие actions у fields            

            let idCol;
            
            columnsData.forEach(function(field,i){
                if(field.type !== undefined && field.type == "action"){
                    checkAction = true;
                    idCol = i;
                    urlFieldAction = data.actions[field.id].url;
                    //console.log(data.actions[field.id].url)
                    
                }
            });
           
             
            // if (checkAction){
            //     let columns = $$(idCurrTable).config.columns;
            //     columns.splice(0,0,{ id:"action-first"+idCol, maxWidth:130, header:"Подробнее", template:"<span class='webix_icon wxi-angle-down'></span> "});
            //     $$(idCurrTable).refreshColumns();
            // }
       


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
                      } ,
                      on: {
                        onAfterRender: function () {
                            this.getInputNode().setAttribute("title",dataInputsArray[el].comment);
                         },
                    }               
                    });

                } else if (dataInputsArray[el].type == "submit" || dataInputsArray[el].type == "button") {
                    let actionType = dataInputsArray[el].action;
                    let findAction = data.actions[actionType]; // сопоставить действие кнопки и ключ в actions

                    if (findAction.verb == "DELETE" && actionType !== "submit"){
                        let countCols = $$(idCurrTable).getColumns().length;
                        let columns = $$(idCurrTable).config.columns;
                        columns.splice(countCols,0,{ id:"action"+i, header:"Действие",maxWidth:100, template:"{common.trashIcon()}"});

                        $$(idCurrTable).refreshColumns();
                    } else if (findAction.verb == "DELETE") {
                        customInputs.push(
                            //{rows:[
                                //{},
                                {   view:"button", 
                                    id:"customBtnDel"+i,
                                    css:"webix_danger", 
                                    type:"icon", 
                                    icon:"wxi-trash", 
                                    inputHeight:48,
                                    height:48,
                                    //height:48,
                                    width:100,
                                    value:dataInputsArray[el].label,
                                    click:function (id) {
                                        submitBtn(idElements,findAction.url,"delete");
                                        console.log("delete");  
                                    },
                                    on: {
                                        onAfterRender: function () {
                                            this.getInputNode().setAttribute("title",dataInputsArray[el].comment);
                                        },
                                    },
                                    
                                    
                                }, 
                                //{},
                            //]}
                        );
                    } else {
                        customInputs.push(
                            //{rows:[
                                //{},
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
                                        // else if (findAction.verb == "DELETE"){
                                        //     submitBtn(idElements,findAction.url,"delete");
                                        //     console.log("delete");

                                        // } 
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
                                //{},
                            //]}
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
                                        notify ("success","Файл успешно загружен");
                                    },
                                    onFileUploadError: function () {
                                        notify ("error","Ошибка при загрузке файла");
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

        webix.ajax().get("/init/default/api/"+itemTreeId).then(function (data){
            data = data.json().content;

            if (data.length !== 0){
                $$(idCurrTable).hideOverlay("Ничего не найдено");
                $$(idCurrTable).parse(data);
            } else {
                $$(idCurrTable).showOverlay("Ничего не найдено");
            }

            prevCountRows = $$(idCurrTable).count();
            $$(idFindElem).setValues(prevCountRows.toString());
        });
    }
    
}


function getInfoDashboard (){

    if(!($$("dashboard-charts"))){
       
        
        
        webix.ajax().get("/init/default/api/fields").then(function (data){
            let fields = data.json().content;
            let inputsArray=[];
            Object.values(fields) .forEach(function(el,i){
                //console.log(el.type)
                if (el.type == "dashboard"){
                    //console.log(el.inputs)
                    let inputs = el.inputs;
                    Object.values(inputs).forEach(function(input,i){
                        //console.log(input.type)
                        if (input.type == "datetime"){
                            inputsArray.push(
                                    {   view: "datepicker",
                                        format: webix.Date.strToDate("%d.%m.%Y"),
                                        placeholder:"дд.мм.гг",
                                        //placeholder:dataInputsArray[el].label,  
                                        id:"dashDatepicker"+i, 
                                        timepicker: true,
                                        labelPosition:"top",
                                        width:300,
                                        minWidth:100,
                                        height:48,
                                        label:input.label, 
                                        on: {
                                            onAfterRender: function () {
                                                this.getInputNode().setAttribute("title",input.comment);
                                            },
                                        }
                                    }
                            );
                        } 
                        
        
                    });
                }
            });
     
            //console.log( inputsArray)



            webix.ajax().get("/init/default/api/dash_sales").then(function (data){

                let dashLayout=[];
                 
               
                dashLayout.push({rows:[{rows:inputsArray}]});
                console.log(dashLayout[0].rows, "das")
                let dataCharts = data.json().charts;
                console.log(data.json())
                let titleTemplate = {};
                dataCharts.forEach(function(el,i){
                    titleTemplate = el.title;
                    delete el.title;
                    el.borderless = true;
                    el.minWidth = 300;
                    dashLayout[0].rows.push({rows:[ {template:titleTemplate,borderless:true,css:{"margin-top":"20px!important", "font-weight":"500!important", "font-size":"17px!important"}, height:30},el]});
    
                });
                $$("dashboardBody").addView({view:"scrollview",id:"dashboard-charts",borderless:true,css:{"margin":"20px!important"},body: {view:"flexlayout",cols:dashLayout}},0);
                $$("dashboardBody").removeView($$("dashEmpty"));
             
            });
         
        });


       

    }


    
}


function headerSidebar () {
    const headerLogo = {
         view:"label",
         label:"<img src='/init/static/images/expalogo.png' style='height:30px; margin: 20px;'>", 
         height:65
    };
    const collapseBtn = {   
        view:"button",
        type:"icon",
        id:"collapseBtn",
        icon:"wxi-angle-double-left",
        css:"webix_collapse",
        title:"текст",
        height:30,
        width:40,
        click:function() {
            
            if ($$("tree").isVisible()){
                $$("collapseBtn").config.icon ="wxi-angle-double-right";
                $$("collapseBtn").refresh();
                $$("tree").hide();
                $$("sideMenu").config.width = 55;

                //$$("sideMenuHidden").show();
                if(window.innerWidth >= 800){
                    $$("sideMenu").addView({id:"sideMenuHidden"}, 3);
                } 
                

                if($$("sideMenuResizer")){
                    console.log("есть")
                    $$("sideMenuResizer").hide();
                }  else{
                    console.log("ytn")
                }
                
            } else {
                $$("tree").show();
                $$("collapseBtn").config.icon ="wxi-angle-double-left";
                $$("collapseBtn").refresh();
                $$("sideMenu").config.width = 250;
                //$$("sideMenuHidden").hide();
                if(window.innerWidth >= 800){
                    $$("sideMenu").removeView($$("sideMenuHidden"));
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

function treeSidebar () {
    let tree = {
        view:"edittree",
        id:"tree",
        minWidth:100,
        width: 300,
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
            //let dataForms = {forms:[]};
            
            obj.forEach(function(data) {
                if (srcTree[data].actions){
                    actionsCheck = Object.keys(srcTree[data].actions)[0]; 
                } 
                if (srcTree[data].type == "dbtable"){
                    if(srcTree[data].plural){
                        dataChilds.tables.push({"id":data, "value":srcTree[data].plural, "type":srcTree[data].type}); 
                    } else if (srcTree[data].singular) {
                        dataChilds.tables.push({"id":data, "value":srcTree[data].singular, "type":srcTree[data].type}); 
                    }
                } else if (srcTree[data].type == "tform"){
                    if(srcTree[data].plural){
                        dataChilds.forms.push({"id":data, "value":srcTree[data].plural, "type":srcTree[data].type}); 
                    }else if (srcTree[data].singular) {
                        dataChilds.forms.push({"id":data, "value":srcTree[data].singular, "type":srcTree[data].type}); 

                    }
                }  else if (srcTree[data].type == "dashboard"){
                    if(srcTree[data].plural){
                        dataChilds.dashboards.push({"id":data, "value":srcTree[data].plural, "type":srcTree[data].type}); 
                    }else if (srcTree[data].singular) {
                        dataChilds.dashboards.push({"id":data, "value":srcTree[data].singular, "type":srcTree[data].type}); 

                    }
                }   
            });


            // dataTree.push( 
            //     {id:"dashboardViewFolder",  value:"Партнёры", data:jsonDashboard.treeHeadlines},
            //     {id:"tableEditFolder", value:"Таблицы", data:dataChilds.tables},
            //     {id:"tableViewFolder", value:"Информация", data:dataChilds.forms},
            //     );
            //return dataTree;
            return webix.ajax().get("/init/default/api/mmenu.json").then(function (data) {

                let menu = data.json().mmenu;
                let menuTree = [];
                menu.forEach(function(el,i){
                    if (el.title){
                        menuTree.push({id:el.name, value:el.title, data:dataChilds[el.name]});
                    } else {
                        menuTree.push({id:el.name, value:"Без названия", data:dataChilds[el.name]});
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
                   
                    $$(addBtnId).enable();
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

    return tree;
}


export{
    headerSidebar,
    treeSidebar,
    itemTreeId,
    inpObj,
    customInputs,
    urlFieldAction
};
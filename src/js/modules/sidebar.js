import {tableId,editFormId,addBtnId,findElementsId, searchId,
        tableIdView,findElementsIdView,searchIdView
} from './setId.js';
import {notify, checkFormSaved,clearItem} from "./editTableForm.js";

import  {jsonDashboard } from "../treeItems/dashboardView.js";
// import  {jsonFormView, jsonFormEdit } from "../treeItems/formTemplate.js";
// import  {jsonTableView} from "../treeItems/tableTemplate.js";


let itemTreeId = "";
let prevCountRows ;
let inpObj={};
let customInputs = [];

let idElements = [];
function submitBtn (url, verb){
    let valuesArray = [];

    if (verb=="get"){ 
        idElements.forEach((el,i) => {
            if (el.id.includes("customCombo")){
                console.log(el);
                valuesArray.push(el.name+"="+$$(el.id).getText());
            } else if (el.id.includes("customInputs")) {
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
    } else if (verb=="post") {
        let uploadFile;
        console.log(idElements)
        console.log("post");
        
        idElements.forEach((el,i) => {
            if (el.id.includes("customUploader")){
                console.log(el);
                uploadFile = $$(el.id).getValue();
            } 
            
        });

        webix.ajax().post(url,{uploadFile});
    }
    
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
            //($$("tableToolbarItem").removeView( inpObj, 1));

            let objInuts = Object.keys(data.inputs)
            
            let customInputs = [];

            let dataInputsArray = data.inputs; //дата с сервера, объекты с инпутами
            //console.log(data.actions.submit)
            customInputs.push({width:20});
            objInuts.forEach((el,i) => {
                //console.log(data.actions.submit.verb)
                if (dataInputsArray[el].type == "string"){
                    customInputs.push(
                    {   view:"text",
                        id: "customInputs"+i,
                        width:300,
                        height:60,
                        label:dataInputsArray[el].label, 
                        labelPosition:"top",
                        on: {
                            onAfterRender: function () {
                                this.getInputNode().setAttribute("title",dataInputsArray[el].comment);
                             },
                        }
                    });
                } else if (dataInputsArray[el].type == "apiselect") {
                    customInputs.push(
                    { view:"combo",
                    id: "customCombo"+i,
                    placeholder:"Введите текст",  
                    label:dataInputsArray[el].label,
                    labelPosition:"top", 
                    options:{
                        body:{
                          template: "#value#",
                          dataFeed:{
                            $proxy: true, 
                            load: function(view, params){
                              return ( webix.ajax().get("/init/default/api/"+dataInputsArray[el].apiname).then(function (data) {
                                        let dataSrc = data.json().content;
                                        let dataOptions=[];
                                        dataSrc.forEach(function(data, i) {
                                            dataOptions.push( 
                                                {id:i+1, value:data},
                                            );
                                        });
                                        
                                        return dataOptions;
                                    })
                                );
                            }
                          }	
                        }
                      } ,
                      on: {
                        onAfterRender: function () {
                            this.getInputNode().setAttribute("title",dataInputsArray[el].comment);
                         },
                    }               
                    });

                } else if (dataInputsArray[el].type == "submit") {
                    console.log(data )
                    customInputs.push(
                        {rows:[
                            {},
                            {   view:"button", 
                                css:"webix_primary", 
                                //id:cleanBtnId,
                                height:48, 
                                value:dataInputsArray[el].label,
                                click:function () {
                                    if (data.actions.submit.verb == "GET"){
                                        submitBtn(data.actions.submit.url, "get");
                                    } else if (data.actions.submit.verb == "POST"){
                                        submitBtn(data.actions.submit.url,"post");
                                    }
                                    
                                },
                                on: {
                                    onAfterRender: function () {
                                        this.getInputNode().setAttribute("title",dataInputsArray[el].comment);
                                     },
                                }
                                
                            }, 
                        ]}
                    );
                } else if (dataInputsArray[el].type == "upload"){
                    customInputs.push(
                        {rows:[
                            {},
                            {   view: "uploader", 
                                value: "Upload file", 
                                id:"customUploader"+i, 
                                height:48, 
                                link:tableIdView,  
                                //upload:"//docs.webix.com/samples/server/upload",
                                label:dataInputsArray[el].label, 
                                labelPosition:"top",
                                on: {
                                    onAfterRender: function () {
                                        this.getInputNode().setAttribute("title",dataInputsArray[el].comment);
                                    },
                                }
                            }
                        ]}
                    );
                }
                customInputs.push({width:20});
            });
            
       
            customInputs.forEach((el,i) => {
                
                if (el.id !== undefined){
                    console.log(el);
                    if (el.view=="text"){
                        idElements.push({id:el.id, name:"substr"});
                    } 
                    else if (el.view=="combo") {
                        idElements.push({id:el.id, name:"valtype"});
                    } else if (el.view=="uploader"){
                        idElements.push({id:el.id});
                    }
                }
            });
           

            inpObj = {id:"customInputs", cols:customInputs};
            ($$("filterBar").addView( inpObj,1));
        });

        webix.ajax().get("/init/default/api/"+itemTreeId).then(function (data){
            data = data.json().content;

            // el.append({data:[]});
            // console.log(el)
            // data.forEach((el,i) => {
            //     if (el.srv){
            //         console.log(el);
                    
            //         console.log(el);
            //          webix.ajax().get("/init/default/api/"+itemTreeId+"/"+el.id+".json").then(function (data){
            //             data = data.json().content
            //             //el.append("data":[{ "value":"Part 1"]);
            //             el.data = [ {id:"1.1",value:"Part 1"}];
            //             el.append(data);
            //             });
            //         el.id //ссылка на доп инфу
            //         //el.append("data":[{ "value":"Part 1"]);
            //     }
            // });
        
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
                $$("sideMenuHidden").show();
                $$("sideMenuResizer").hide();
            } else {
                $$("tree").show();
                $$("collapseBtn").config.icon ="wxi-angle-double-left";
                $$("collapseBtn").refresh();
                $$("sideMenu").config.width = 250;
                $$("sideMenuHidden").hide();
                $$("sideMenuResizer").show();
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
        minHeight:150,
        editable:false,
        select:true,
        editor:"text",
        editValue:"value",
        activeTitle:true,
        clipboard: true,
        data: webix.ajax().get("/init/default/api/fields.json").then(function (data) {
            let srcTree = data.json().content;
            let obj = Object.keys(srcTree);
            let actionsCheck;
            let dataTree = [];
            let dataTable = [];
            let dataForm = [];
            
            //console.log(srcTree["monitor"], "123");
            //console.log(srcTree, "123");
        
            obj.forEach(function(data) {
                if (srcTree[data].actions){
                    actionsCheck = Object.keys(srcTree[data].actions)[0]; 
                } 
                if (srcTree[data].type == "dbtable"){
                    dataTable.push({"id":data, "value":srcTree[data].plural, "type":srcTree[data].type}); 
                } else if (srcTree[data].type == "tform"){
                    dataForm.push({"id":data, "value":srcTree[data].plural, "type":srcTree[data].type}); 
                }      
            });
           

            dataTree.push( 
                            {id:"dashboardViewFolder",  value:"Партнёры", data:jsonDashboard.treeHeadlines},
                            {id:"tableEditFolder", value:"Таблицы", data:dataTable},
                            {id:"tableViewFolder", value:"Информация", data:dataForm},
                            );
            return dataTree;
        }), 
         
        
        on:{
            onSelectChange:function (ids) {
                if (ids[0]){
                    $$("webix__none-content").hide();
                }
                itemTreeId = ids[0];
                let treeItemId = $$("tree").getSelectedItem().id;
                let getItemParent = $$("tree").getParentId(treeItemId);
                
                
                if(ids[0]=="tableEditFolder" || getItemParent=="tableEditFolder" ){
                    $$("dashboardView").hide();
                    $$("tableView").hide();
                    $$("tableEdit").show();
                }
                if(ids[0]=="dashboardViewFolder" || getItemParent=="dashboardViewFolder"){
                   
                    $$("tableEdit").hide();
                    $$("tableView").hide();
                    $$("dashboardView").show();
                }

                if(ids[0]=="tableViewFolder" || getItemParent=="tableViewFolder"){
                    $$("tableEdit").hide();
                    $$("dashboardView").hide();
                    $$("tableView").show();
                }


                if(getItemParent=="tableEditFolder"){
                   
                    $$(addBtnId).enable();
                
                    if(Object.keys($$(editFormId).elements).length!==0){
                        $$("inputsTable").hide();
                    }

                    getInfoTable (tableId, searchId, ids[0], findElementsId);

                } else if(getItemParent=="dashboardViewFolder") {
                   


                } else if(getItemParent=="tableViewFolder") {
                    
                    getInfoTable (tableIdView, searchIdView, ids[0], findElementsIdView);

                    // let countRows = $$(tableIdView).count();
                    // $$(findElementsIdView).setValues(countRows.toString());

                }else if(getItemParent=="formEditFolder") {
                   
 
                }else if(getItemParent=="formViewFolder") {
                   
 
                }

            },
  

            onBeforeSelect: function(data) {
                let getItemParent = $$("tree").getParentId(data);
                if(getItemParent=="tableEditFolder"){
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
        },
        

    };

    return tree;
}


export{
    headerSidebar,
    treeSidebar,
    itemTreeId,
    inpObj,
    customInputs
};
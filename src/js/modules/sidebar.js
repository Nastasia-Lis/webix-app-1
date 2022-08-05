import {tableId,editFormId,addBtnId,findElementsId, searchId,
        tableIdView,findElementsIdView,searchIdView

} from './setId.js';
import {notify, checkFormSaved,clearItem} from "./editTableForm.js";

import  {jsonDashboard } from "../treeItems/dashboardView.js";
// import  {jsonFormView, jsonFormEdit } from "../treeItems/formTemplate.js";
// import  {jsonTableView} from "../treeItems/tableTemplate.js";


let itemTreeId = "";
let prevCountRows ;

function getInfoTable (idCurrTable, idSearch, idsParam) {
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
            ($$("tableToolbarItem").removeView( "customInputs" ));
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
            

            objInuts.forEach((el,i) => {
                customInputs.push({width:20});
                if (dataInputsArray[el].type == "string"){
                    customInputs.push(
                    {   view:"text", 
                        width:300,
                        height:60,
                        label:dataInputsArray[el].label, 
                        labelPosition:"top",
                    }
                    );
                } else if (dataInputsArray[el].type == "apiselect") {
                    customInputs.push(
                    { view:"combo",placeholder:"Введите текст",  label:dataInputsArray[el].label,labelPosition:"top", options:{
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
                      }}
                    );
                } else if (dataInputsArray[el].type == "submit") {
                    customInputs.push(
                        {rows:[
                            {},
                            {   view:"button", 
                                css:"webix_primary", 
                                //id:cleanBtnId,
                                height:48, 
                                value:dataInputsArray[el].label,
                                //click:clearForm
                            }, 
                        ]}
                        
                    );
                   
                }
                customInputs.push({width:20});

            });

            inpObj = { id:"customInputs", rows:[{height:15},
                    {   view:"form", 
                        id:"tableToolbarForm",
                        //elements:[{cols:customInputs}]
                        elements: [{cols:customInputs}]
                    },
                    {height:15}]
            };
            ($$("tableToolbarItem").addView( inpObj));
        });

        webix.ajax().get("/init/default/api/"+itemTreeId).then(function (data){
            data = data.json().content;
            if (data.length !== 0){
                $$(idCurrTable).hideOverlay("Ничего не найдено");
                $$(idCurrTable).parse(data);
            } else {
                $$(idCurrTable).showOverlay("Ничего не найдено");
            }

            prevCountRows = $$(idCurrTable).count();
            $$(findElementsId).setValues(prevCountRows.toString());
        });
    }
    
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
            console.log(srcTree, "fields")
            let dataTable = [];
            let dataForm = [];
            
            console.log(srcTree["monitor"], "123");
        
            obj.forEach(function(data) {
                //console.log(Object.values(srcTree[data].actions), "1111")
                if (srcTree[data].actions){
                    actionsCheck = Object.keys(srcTree[data].actions)[0]; 
                } 
                if (srcTree[data].type == "dbtable"){
                    dataTable.push({"id":data, "value":srcTree[data].plural, "type":srcTree[data].type}); 
                } else if (srcTree[data].type == "tform"){
                    dataForm.push({"id":data, "value":srcTree[data].plural, "type":srcTree[data].type}); 

                    //console.log(srcTree[data], "u");
                }      
            });
           

            dataTree.push( 
                            {id:"dashboardViewFolder",  value:"Партнёры", data:jsonDashboard.treeHeadlines},
                            {id:"tableEditFolder", value:"Таблицы", data:dataTable},
                            {id:"tableViewFolder", value:"Информация", data:dataForm},
                            //{id:"formEditFolder", value:"Формы", data:jsonFormEdit.treeHeadlines},
                            //{id:"formViewFolder", value:"Формы (просмотр)", data:jsonFormView.treeHeadlines}
                            );
            return dataTree;
        }), 
         
        
        on:{
            onSelectChange:function (ids) {
                if (ids[0]){
                    $$("webix__none-content").hide();
                }
            
                //console.log($$("tree").getSelectedItem());

                itemTreeId = ids[0];
                let treeItemId = $$("tree").getSelectedItem().id;
                let getItemParent = $$("tree").getParentId(treeItemId);
                //var tree = $$("tree");
                //var titem = tree.getItem(ids[0]); //id,value tree item
               
                
                
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

                    getInfoTable (tableId, searchId, ids[0]);

                } else if(getItemParent=="dashboardViewFolder") {
                   


                } else if(ids[0]=="tableViewFolder" || getItemParent=="tableViewFolder") {
                    getInfoTable (tableIdView, searchIdView, ids[0]);

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
    treeSidebar,
    itemTreeId
};
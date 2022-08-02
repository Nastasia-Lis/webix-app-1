import {tableId,editFormId,addBtnId,findElemetsId, searchId,pagerId,  exportBtn} from './setId.js';
import {notify, checkFormSaved,clearItem} from "./editTableForm.js";

import  {jsonDashboard } from "../treeItems/dashboardView.js";
import  {jsonFormView } from "../treeItems/formView.js";
import  {jsonFormEdit } from "../treeItems/formEdit.js";
import  {jsonTableView } from "../treeItems/tableView.js";

let itemTreeId = "";

function treeSidebar () {
    let tree = {
        view:"edittree",
        id:"tree",
        minWidth:200,
        width: 300,
        minHeight:150,
        editable:false,
        editor:"text",
        editValue:"value",
        activeTitle:true,
        select: true,
        clipboard: true,
        data: webix.ajax().get("/init/default/api/fields.json").then(function (data) {
            let srcTree = data.json().content;
            let obj = Object.keys(srcTree);
            let dataTree = [];
            let dataTreeTable = [];
            obj.forEach(function(data) {
                dataTreeTable.push({"id":data, "value":srcTree[data].plural}); 
            });
            dataTree.push(  {id:"dashboardViewFolder", value:"Партнёры", data:jsonDashboard.treeHeadlines},
                            {id:"tableEditFolder", value:"Таблицы", data:dataTreeTable},
                            {id:"tableViewFolder", value:"Таблицы (просмотр)", data:jsonTableView.treeHeadlines},
                            {id:"formEditFolder", value:"Формы", data:jsonFormEdit.treeHeadlines},
                            {id:"formViewFolder", value:"Формы (просмотр)", data:jsonFormView.treeHeadlines});
            return dataTree;
        }), 
         
        
        on:{
            onSelectChange:function (ids) {
                
                itemTreeId = ids[0];

                console.log($$("tree").getSelectedItem())
                let treeItemId = $$("tree").getSelectedItem().id;
                let getItemParent = $$("tree").getParentId(treeItemId);


                var tree = $$("tree");
                var titem = tree.getItem(ids[0]); //id,value tree item
                $$(tableId).clearAll();
                $$(searchId).setValue("");

                if (getItemParent=="tableEditFolder"){
                    $$(addBtnId).enable();
                    $$(searchId).enable();
                    $$(exportBtn).enable();
 
                }
                
                
                if(ids[0]=="tableEditFolder" || getItemParent=="tableEditFolder" ){
                    $$("dashboardView").hide();
                    $$("tableView").hide();
                    $$("formEdit").hide();
                    $$("formView").hide();
                    $$("tableEdit").show();
                }
                if(ids[0]=="dashboardViewFolder" || getItemParent=="dashboardViewFolder"){
                   
                    $$("tableEdit").hide();
                    $$("formEdit").hide();
                    $$("tableView").hide();
                    $$("formView").hide();
   
                    $$("dashboardView").show();
                }

                if(ids[0]=="tableViewFolder" || getItemParent=="tableViewFolder"){
                    $$("tableEdit").hide();
                    $$("formEdit").hide();
                    $$("formView").hide();
                    $$("dashboardView").hide();

                    $$("tableView").show();
                }

                if(ids[0]=="formEditFolder" || getItemParent=="formEditFolder"){
                    $$("tableEdit").hide();
                    $$("tableView").hide();
                    $$("formView").hide();
                    $$("dashboardView").hide();

                    $$("formEdit").show();
                }

                if(ids[0]=="formViewFolder" || getItemParent=="formViewFolder"){
                    $$("tableEdit").hide();
                    $$("formEdit").hide();
                    $$("tableView").hide();
                    $$("dashboardView").hide();

                    $$("formView").show();
                }


                if(Object.keys($$(editFormId).elements).length!==0  ){
                    $$("inputsTable").hide();
                }

                if(getItemParent=="tableEditFolder"){
                    if (titem == undefined) {
                        webix.ajax().get("/init/default/api/fields.json").then(function (data) {
                            notify ("error","Данные не найдены");
                        });
                    } else {
                        webix.ajax().get("/init/default/api/fields.json").then(function (data) {
                            data = data.json().content[ids[0]]; //полный item
                            let dataFields = data.fields; //[id:{info},..]
                            let obj = Object.keys(data.fields) //[id,id,..]
                            let columnsData = []; // [{cols data}]
                            obj.forEach(function(data,i) {
                                dataFields[data].id = data;
                                dataFields[data].fillspace = true;
                                dataFields[data].header= dataFields[data]["label"];
                                if(dataFields[data].id == "id"){
                                    dataFields[data].hidden = true;
                                }
                                columnsData.push(dataFields[data]);
                                // if (columnsData[i].id == "cdt"){
                                //     console.log(dataFields[data]);
                                // }
                            });
                            $$(tableId).refreshColumns(columnsData);
                        });

                        webix.ajax().get("/init/default/api/"+itemTreeId).then(function (data){
                            data = data.json().content;
                            if (data.length !== 0){
                                $$(tableId).parse(data);
                            } else {
                                $$(tableId).showOverlay("Ничего не найдено");
                            }
                            countRows = $$(tableId).count();
                            $$(findElemetsId).setValues(countRows.toString());
                        });
                    } 
                } else if(getItemParent=="dashboardViewFolder") {
                   
 
                } else if(getItemParent=="tableViewFolder") {
                    

                }else if(getItemParent=="formEditFolder") {
                   
 
                }else if(getItemParent=="formViewFolder") {
                   
 
                }

            },
  

            onBeforeSelect: function(data) {
                
                if($$(editFormId).isDirty()){
                    checkFormSaved().then(function(result){
                        if(result) {
                            clearItem();
                            $$("tree").select(data);
                        } 
                    });
                    return false;
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
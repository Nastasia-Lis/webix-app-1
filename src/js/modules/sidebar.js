import {tableId,editFormId,addBtnId,findElementsId, searchId,
        tableIdView,findElementsIdView,searchIdView

} from './setId.js';
import {notify, checkFormSaved,clearItem} from "./editTableForm.js";

import  {jsonDashboard } from "../treeItems/dashboardView.js";
import  {jsonFormView, jsonFormEdit } from "../treeItems/formTemplate.js";
import  {jsonTableView} from "../treeItems/tableTemplate.js";


let itemTreeId = "";
let prevCountRows ;
function treeSidebar () {
    let tree = {
        view:"edittree",
        id:"tree",
        minWidth:100,
        width: 300,
        minHeight:150,
        editable:false,
        select:"true",
        editor:"text",
        editValue:"value",
       
        activeTitle:true,
        //select: true,
        clipboard: true,
        data: webix.ajax().get("/init/default/api/fields.json").then(function (data) {
            let srcTree = data.json().content;
            let obj = Object.keys(srcTree);
            let dataTree = [];
            let dataTreeTable = [];
            obj.forEach(function(data) {
                dataTreeTable.push({"id":data, "value":srcTree[data].plural}); 
            });
            dataTree.push( 
                            {id:"dashboardViewFolder",  value:"Партнёры", data:jsonDashboard.treeHeadlines},
                            {id:"tableEditFolder", value:"Таблицы", data:dataTreeTable},
                            {id:"tableViewFolder", value:"Таблицы (просмотр)", data:jsonTableView.treeHeadlines},
                            {id:"formEditFolder", value:"Формы", data:jsonFormEdit.treeHeadlines},
                            {id:"formViewFolder", value:"Формы (просмотр)", data:jsonFormView.treeHeadlines});
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
                var tree = $$("tree");
                var titem = tree.getItem(ids[0]); //id,value tree item
               
                
                
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


              

                if(getItemParent=="tableEditFolder"){
                    $$(tableId).clearAll();
                    $$(searchId).setValue("");
                    $$(addBtnId).enable();

                    if(Object.keys($$(editFormId).elements).length!==0){
                        $$("inputsTable").hide();
                    }

                    if (titem == undefined) {
                        webix.ajax().get("/init/default/api/fields.json").then(function (data) {
                            notify ("error","Данные не найдены");
                        });
                    } else {
                        webix.ajax().get("/init/default/api/fields.json").then(function (data) {
                            let fullFields = data.json().content;
                            data = data.json().content[ids[0]]; //полный item
                            let dataFields = data.fields; //[id:{info},..]
                            let obj = Object.keys(data.fields) //[id,id,..]
                            let columnsData = []; // [{cols data}]
                            //console.log(fullFields, "wet4")
                            let searchCol;

                            obj.forEach(function(data,i) {
                                // searchCol =dataFields[data].type;

                                // if (searchCol.includes("reference") ){
                                //     searchCol.slice(10);
                                //     console.log(searchCol.slice(10))
                                //     console.log(fullFields["hosts"]); // получили колонки референса
                                //     //console.log(dataFields[data])

                                //     console.log(dataFields[data], "eeee")
                                // }
                                

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
                                if (columnsData[i].id == "cdt"){
                                    
                                   // columnsData[i].format=webix.i18n.dateFormatStr;
                                    //console.log(columnsData[i]);
                                }
                            });
                            console.log(columnsData)
                            $$(tableId).refreshColumns(columnsData);
                            //console.log(columnsData)
                        });

                        webix.ajax().get("/init/default/api/"+itemTreeId).then(function (data){
                            data = data.json().content;
                            console.log(data)
                            if (data.length !== 0){
                                $$(tableId).hideOverlay("Ничего не найдено");
                                $$(tableId).parse(data);
                            } else {
                                $$(tableId).showOverlay("Ничего не найдено");
                            }
                            prevCountRows = $$(tableId).count();
                            $$(findElementsId).setValues(prevCountRows.toString());
                        });
                    }
                    
                    

                } else if(getItemParent=="dashboardViewFolder") {
                   
 



                } else if(ids[0]=="tableViewFolder" || getItemParent=="tableViewFolder") {
                    $$(tableIdView).clearAll();
                    $$(searchIdView).setValue("");

                    
                    $$(tableIdView).refreshColumns([
                        { id:"rank", fillspace:true,    header:"",              width:50},
                        { id:"title", fillspace:true,   header:"Film title",    width:200},
                        { id:"year",  fillspace:true,   header:"Released",      width:80},
                        { id:"votes", fillspace:true,   header:"Votes",         width:100}
                    ]);
                    $$(tableIdView).parse([
                        { id:1, title:"The Shawshank Redemption", year:1994, votes:678790, rank:1},
                        { id:2, title:"The Godfather", year:1972, votes:511495, rank:2},
                        { id:3, title:"The Shawshank Redemption", year:1994, votes:678790, rank:1},
                        { id:4, title:"The Godfather", year:1972, votes:511495, rank:2},
                        { id:5, title:"The Shawshank Redemption", year:1994, votes:678790, rank:1},
                        { id:6, title:"The Godfather", year:1972, votes:511495, rank:2},
                        { id:7, title:"The Shawshank Redemption", year:1994, votes:678790, rank:1},
                        { id:8, title:"The Godfather", year:1972, votes:511495, rank:2},
                        { id:9, title:"The Shawshank Redemption", year:1994, votes:678790, rank:1},
                        { id:10, title:"The Godfather", year:1972, votes:511495, rank:2},
                        { id:11, title:"The Shawshank Redemption", year:1994, votes:678790, rank:1},
                        { id:12, title:"The Godfather", year:1972, votes:511495, rank:2}
                    ]);

                    let countRows = $$(tableIdView).count();
                    $$(findElementsIdView).setValues(countRows.toString());

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
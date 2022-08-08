import {itemTreeId,} from "./sidebar.js";
import {
    tableId, pagerId, searchId, exportBtn, findElementsId, formId,editFormId,
    
    tableIdView, pagerIdView, searchIdView, exportBtnView, 
    findElementsIdView, formIdView
} from './setId.js';

const filterForm =  {   
    view:"form", 
    id:"filterTableForm",
    elements:{
        dataFeed: {
            $proxy: true, 
            load: function(){
                return webix.ajax("/init/default/api/fields.json").then(data => {
                
                    let objInuts = Object.keys(data.inputs)
                    
                    let customInputs = [];
        
                    let dataInputsArray = data.inputs; //дата с сервера, объекты с инпутами
        
                    objInuts.forEach((el,i) => {
                        //customInputs.push({width:20});
                        if (dataInputsArray[el].type == "string"){
                            customInputs.push(
                            {   view:"text", 
                                //id:"input"+i,
                                width:300,
                                height:60,
                                label:dataInputsArray[el].label, 
                                labelPosition:"top",
                                // on: {
                                //     onAfterRender: function () {
                                //         this.getInputNode().setAttribute("title",dataInputsArray[el].comment);
                                //     }
                                // } 
                            }
                            );
                        } 
                        else if (dataInputsArray[el].type == "apiselect") {
                            customInputs.push({ 
                                view:"combo",
                                //id:"input"+i,
                                placeholder:"Введите текст",  
                                label:dataInputsArray[el].label,
                                labelPosition:"top", 
                                options:{
                                    body:{
                                    template: "#value#",
                                    dataFeed:{
                                        $proxy: true, 
                                        load: function(){
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
                                },
                                // on: {
                                //     onAfterRender: function () {
                                //         this.getInputNode().setAttribute("title",dataInputsArray[el].comment);
                                //     }
                                // } 
                            });
                        } 
                        else if (dataInputsArray[el].type == "submit") {
                            customInputs.push(
                                //{rows:[
                                    //{},
                                    {   view:"button", 
                                        css:"webix_primary", 
                                        //id:cleanBtnId,
                                        height:48, 
                                        value:dataInputsArray[el].label,
                                        //click:function() {
                                            //console.log($$("tableToolbarForm"));
                                            //console.log($$("tableToolbarForm").getValues());
                                            
                                            //console.log($$("filterTableForm").getValues(), "val");
                                            //webix.ajax(data.actions.submit.url);
                                            //webix.ajax().get(data.actions.submit.url, "action=info&id=123");
                                        //},
                                        // on: {
                                        //     onAfterRender: function () {
                                        //         this.getInputNode().setAttribute("title",dataInputsArray[el].comment);
                                        //     }
                                        // } 
                                    }
                                //]}
                                
                            );
                        
                        }
                        //customInputs.push({width:20});
        
                    });
                    //console.log(customInputs)
                    // inpObj = { id:"customInputs", rows:[{height:15},
                    //         {   view:"form", 
                    //             id:"tableToolbarForm",
                    //             //elements:[{cols:customInputs}]
                    //             elements: [{cols:customInputs}]
                    //         },
                    //         {height:15}]
                    // };
                    let inpObj = [{id:"customInputs", rows:customInputs}];
                    console.log(inpObj)
                    //this.addView( inpObj, 1);
                    return inpObj;
                    
                //this.setValues(data);
                });
            }
        }
    },
    width:200,
   

};

export{
    filterForm
};
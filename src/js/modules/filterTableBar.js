// import {notify} from "./editTableForm.js";

// const filterForm =  {   
//     view:"form", 
//     id:"filterTableForm",
//     elements:{
//         dataFeed: {
//             $proxy: true, 
//             load: function(){
//                 return webix.ajax("/init/default/api/fields.json").then(data => {
                
//                     let objInuts = Object.keys(data.inputs)
                    
//                     let customInputs = [];
        
//                     let dataInputsArray = data.inputs;
        
//                     objInuts.forEach((el,i) => {
//                         if (dataInputsArray[el].type == "string"){
//                             customInputs.push(
//                             {   view:"text", 
//                                 width:300,
//                                 height:60,
//                                 label:dataInputsArray[el].label, 
//                                 labelPosition:"top",

//                             }
//                             );
//                         } 
//                         else if (dataInputsArray[el].type == "apiselect") {
//                             customInputs.push({ 
//                                 view:"combo",
//                                 placeholder:"Введите текст",  
//                                 label:dataInputsArray[el].label,
//                                 labelPosition:"top", 
//                                 options:{
//                                     body:{
//                                     template: "#value#",
//                                     dataFeed:{
//                                         $proxy: true, 
//                                         load: function(){
//                                         return ( webix.ajax().get("/init/default/api/"+dataInputsArray[el].apiname).then(function (data) {
//                                                     let dataSrc = data.json().content;
//                                                     let dataOptions=[];
//                                                     dataSrc.forEach(function(data, i) {
//                                                         dataOptions.push( 
//                                                             {id:i+1, value:data},
//                                                         );
//                                                     });
//                                                     return dataOptions;
//                                                 })
//                                             );
//                                         }
//                                     }	
//                                     }
//                                 },
//                                 // on: {
//                                 //     onAfterRender: function () {
//                                 //         this.getInputNode().setAttribute("title",dataInputsArray[el].comment);
//                                 //     }
//                                 // } 
//                             });
//                         } 
//                         else if (dataInputsArray[el].type == "submit") {
//                             customInputs.push(
//                                     {   view:"button", 
//                                         css:"webix_primary", 
//                                         height:48, 
//                                         value:dataInputsArray[el].label,
//                                     }
//                             );
                        
//                         }

//                     });

//                     let inpObj = [{id:"customInputs", rows:customInputs}];
//                     console.log(inpObj)

//                     return inpObj;

//                 }).catch(err => {
//                     console.log(err);
//                     notify ("error","Не удалось загрузить данные панели инструментов",true);
//                  });
//             }
//         }
//     },
//     width:200,
   

// };

// export{
//     filterForm
// };
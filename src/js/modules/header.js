import { tableId,tableIdView,newAddBtnId, editFormId,findElementsId} from "./setId.js";
import {notify} from "./editTableForm.js";
import {headerSidebar} from "./sidebar.js";
import {tableNames} from "./login.js";
import {setStorageData} from "./userSettings.js";

import {editTableBar, clearItem,checkFormSaved} from "./editTableForm.js";

let userLocation;

function typeTable (type,columnsData, id){
    $$(type).refreshColumns(columnsData);
    webix.ajax().get("/init/default/api/"+id,{
        success:function(text, data, XmlHttpRequest){
            
            if(!($$(newAddBtnId).isEnabled())){
                $$(newAddBtnId).enable();
            }

            // $$(type).showProgress({
            //     type:"bottom",
            //     hide:true
            // });

            data = data.json().content;
            
            if (data.length !== 0){
                
                $$(type).hideOverlay("Ничего не найдено");
                $$(type).parse(data);
        
            
            } else {
                $$(type).showOverlay("Ничего не найдено");
            }
        
            let countRows = $$(type).count();
            $$(findElementsId).setValues(countRows.toString());
        
        },
        error:function(text, data, XmlHttpRequest){
            notify ("error","Ошибка при загрузке данных",true);
        }, 
    });
}


let headerContextId ;
function header() {
    const header = {
        view: "toolbar", 
        id: "header",
        padding:10,
        css:"webix_header-style",
        elements: [
            headerSidebar(),
            {},
            {view:"search", 
                placeholder:"Поиск", 
                css:"searchTable", 
                maxWidth:250, 
                minWidth:40, 
            },
            {   view:"button",  
                id:"webix_log-btn",
                type:"icon", 
                icon:"wxi-eye-slash",
                height:48,
                width: 60,
                css:"webix_log-btn",
                on: {
                    onAfterRender: function () {
                        this.getInputNode().setAttribute("title","Показать/скрыть системные сообщения");
                    }
                },
                click: function() {
                    if ( this.config.icon =="wxi-eye-slash"){
                        $$("logLayout").config.height = 5;
                        $$("logLayout").resize();
                        this.config.icon ="wxi-eye";
                        this.refresh();
                        setStorageData("LogVisible", JSON.stringify("hide"));
                    } else if (this.config.icon =="wxi-eye"){
                        $$("logLayout").config.height = 90;
                        $$("logLayout").resize();
                        this.config.icon ="wxi-eye-slash";
                        this.refresh();
                        setStorageData("LogVisible", JSON.stringify("show"));
                    }
                }
            },

            {   view:"button",
                id:"button-context-menu",
                type:"icon",
                disabled:true,
                icon: 'wxi-user',
                height:48,
                width: 60,
                popup: {
                    view: 'contextmenu',
                    id:"contextmenu",
                    css:"webix_contextmenu",
                    data: [],
                    on:{
                        onItemClick:function(id, e, node){

                            if (id=="logout"){
                                if($$(editFormId) && $$(editFormId).isDirty() ||$$("cp-form") && $$("cp-form").isDirty()){
                                    checkFormSaved().then(function(result){
                                        if(result){
                                            window.location.replace("#logout");
                                        }
                                    });
                                    return false;
                                } else {
                                    window.location.replace("#logout");
                                }
                            }
 
                        }
                    }
                },
                on:{
                    onItemClick:function(){
                        userLocation = window.location.href;
                        let url = userLocation.search("#");
                        userLocation = userLocation.slice(url);
                        if (userLocation !== "#content" || userLocation !== "#"){
                            let tableIdHref = userLocation.slice(userLocation.lastIndexOf('/')+1); 
                            let nameRecoverEl;
                            let storageData;
                            tableNames.forEach(function(el,i){
                                if (el.id == tableIdHref){
                                    nameRecoverEl= el.name;
                                }
                            });
                            if (nameRecoverEl !== undefined){
                                storageData= {tableName:nameRecoverEl,tableId:tableIdHref,href:userLocation};
                                setStorageData ("userLocation", JSON.stringify(storageData));
                            }
                            
                        }
                        
                    }
                }
            },

        ]
    };

    return header;

}

export {
    header,
    typeTable,
    headerContextId,
    userLocation
};
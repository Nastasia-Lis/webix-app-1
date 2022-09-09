import { tableId,tableIdView,newAddBtnId, editFormId,findElementsId} from "./setId.js";
import {notify} from "./editTableForm.js";
import {tableNames} from "./login.js";
import {setStorageData,setUserLocation} from "./userSettings.js";
import { catchErrorTemplate,ajaxErrorTemplate} from "./logBlock.js";
import {modalBox, saveItem, saveNewItem} from "./editTableForm.js";

let userLocation;

function typeTable (type,columnsData, id){
    try{
        $$(type).refreshColumns(columnsData);
        webix.ajax().get("/init/default/api/"+id,{
            success:function(text, data, XmlHttpRequest){
                
                if(!($$(newAddBtnId).isEnabled())){
                    $$(newAddBtnId).enable();
                }

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
                //notify ("error","Ошибка при загрузке данных",true);
                ajaxErrorTemplate("005-000",XmlHttpRequest.status,XmlHttpRequest.statusText,XmlHttpRequest.responseURL);

            }, 
        }).catch(error => {
            console.log(error);
            ajaxErrorTemplate("005-000",error.status,error.statusText,error.responseURL);
        });
    } catch (error){
        console.log(error);
        catchErrorTemplate("005-000", error);
    }
}


let headerContextId ;
function header() {
    const header = {
        view: "toolbar", 
        id: "header",
        padding:10,
        css:"webix_header-style",
        elements: [
            {cols:[
                {   
                    view:"button",
                    type:"icon",
                    id:"collapseBtn",
                    icon:"wxi-angle-double-left",
                    css:"webix_collapse",
                    title:"текст",
                    height:45,
                    width:40,
                    click:function() {
                        try {
                            if ($$("tree").isVisible()){
                                this.config.icon ="wxi-angle-double-right";
                                this.refresh();
                                $$("tree").hide();
                                if($$("sideMenuResizer")){
                                    $$("sideMenuResizer").hide();
                                } 
            
                            } else {
                                $$("tree").show();
                                this.config.icon ="wxi-angle-double-left";
                                this.refresh();
                                if(window.innerWidth >= 800){
                                    if($$("sideMenuResizer")){
                                        $$("sideMenuResizer").show();
                                    }
                                } 
                            
                                
                            }
                        } catch (error){
                            console.log(error);
                            catchErrorTemplate("009-000", error);
                    
                        }
                        
                    },
                    on: {
                        onAfterRender: function () {
                            this.getInputNode().setAttribute("title","Видимость бокового меню");
                        }
                    }    
                },
                {
                    view:"label",
                    label:"<img src='/init/static/images/expalogo.png' style='height:30px; margin: 10px;'>", 
                    height:30
               }
            ]},
            
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
                badge:0,
                width: 60,
                css:"webix_log-btn",
                on: {
                    onAfterRender: function () {
                        this.getInputNode().setAttribute("title","Показать/скрыть системные сообщения");
                    },
                    onChange:function(){
                        if (this.getValue() == 2){
                            this.config.badge = "";
                        }
                    }
                },
                click: function() {
                    try {
                        if ( this.config.icon =="wxi-eye-slash"){
                            $$("logLayout").config.height = 5;
                            $$("webix_log-btn").setValue(1);
                            $$("logLayout").resize();
                            this.config.icon ="wxi-eye";
                            this.refresh();
                            setStorageData("LogVisible", JSON.stringify("hide"));

                            $$("webix_log-btn").config.badge = "";
                            $$("webix_log-btn").refresh();

                        } else if (this.config.icon =="wxi-eye"){
                            $$("logLayout").config.height = 90;
                            $$("webix_log-btn").setValue(2);
                            $$("logLayout").resize();
                            this.config.icon ="wxi-eye-slash";
                            this.refresh();
                            setStorageData("LogVisible", JSON.stringify("show"));
                        }
                    } catch (error){
                        console.log(error);
                        catchErrorTemplate("005-000", error);
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
                            try {
                                if (id=="logout"){
                                    if($$(editFormId) && $$(editFormId).isDirty() ||$$("cp-form") && $$("cp-form").isDirty()){

                                        modalBox().then(function(result){
                                            if (result == 1){
                                                window.location.replace("#logout");
                                            } else if (result == 2){
                                                if ($$(editFormId).validate()){
                                                    if ($$(editFormId).getValues().id){
                                                        saveItem();
                                                    } else {
                                                        saveNewItem(); 
                                                    }
                                                    window.location.replace("#logout");
                                                
                                                } else {
                                                    notify ("error","Заполните пустые поля",true);
                                                    return false;
                                                }
                                                
                                            }
                                        });
                                        return false;
                                    } else {
                                        window.location.replace("#logout");
                                    }
                                }
                            } catch (error){
                                console.log(error);
                                catchErrorTemplate("005-000", error);
                            }
 
                        }
                    }
                },
                on:{
                    onItemClick:function(){
                        try {
                        setUserLocation (tableNames,userLocation);
                        } catch (error){
                            console.log(error);
                            catchErrorTemplate("005-000", error);
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
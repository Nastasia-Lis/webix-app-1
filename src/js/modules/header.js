import {headerSidebar} from "./sidebar.js";
import {setStorageData} from "./userSettings.js";

export function header() {
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
                label:"Выйти",
                height:48, 
                width: 120,
                on: {
                    onAfterRender: function () {
                        this.getInputNode().setAttribute("title","Выйти из аккаунта");
                    }
                } ,
                click: function() {
                    webix.ajax().post("/init/default/logout/",{
                        success:function(text, data, XmlHttpRequest){
                            history.back();

                            let treeArray = $$("tree").data.order;
                            let parentsArray = [];
                            treeArray.forEach(function(el,i){
                                if ($$("tree").getParentId(el) == 0){
                                    parentsArray.push(el);
                                }
                            });
                            parentsArray.forEach(function(el,i){
                                if (!(el.includes("single"))){
                                    $$(el).hide();
                                } 
                            });  
                            $$("webix__none-content").show();

                            $$("tree").clearAll();

                        },

                    });
                    
                }
            },
            
        ]
    };

    return header;
}
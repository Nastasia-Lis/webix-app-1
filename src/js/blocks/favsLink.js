import  {STORAGE,getData} from "./globalStorage.js";
import {setAjaxError,setFunctionError} from "./errors.js";

function favsPopup(){

    const popupHeadline = {   
        template:"Избранное", 
        width:250,
        css:"popup_headline", 
        borderless:true, 
        height:20 
    };

    const btnClosePopup = {
        view:"button",
        id:"buttonClosePopup",
        css:"popup_close-btn",
        type:"icon",
        width:35,
       
        icon: 'wxi-close',
        click:function(){
            try{
                if ($$("popupFavsLink")){
                    $$("popupFavsLink").destructor();
                }
            } catch (err){
                setFunctionError(err,"header","favsPopup click");
            }
        
        }
    };

    const popupEmptyTemplate = {   
        id:"favsEmptyTempalte",
        css:"webix_empty-template",
        template:"Здесь будут сохранены Ваши ссылки", 
        borderless:true
    };

    webix.ui({
        view:"popup",
        id:"popupFavsLink",
        css:"webix_popup-prev-href",
        width:400,
        height:300,
        modal:true,
        position:"center",
        body:{
            rows:[
            {rows: [ 
                { cols:[
                    popupHeadline,
                    {},
                    btnClosePopup,
                ]},
                popupEmptyTemplate,
                {height:20}
            ]}]
            
        },

    }).show();
}



function saveFavsClick(){

    async function getLinkName(){
        
        if (!STORAGE.fields){
            await getData("fields"); 
        }

        function getCurrId(){
            let id;
            try{
                const tree = $$("tree");
                
                if (tree && tree.getSelectedId()){
                    id = tree.getSelectedId();
                } else {
                    const url = window.location.pathname;
                    const index =  window.location.pathname.lastIndexOf("/")+1;
                    id = url.slice(index);
                
                }
            } catch (err){
                setFunctionError(err,"favsLink","getCurrId");
            }
            return id;
        }
        function findName (id){
            try{
                const nameTemplate = $$("favNameLink");
                STORAGE.tableNames.forEach(function(el,i){
                    if (el.id == id){
                        if(nameTemplate){
                            nameTemplate.setValues(el.name);
                        }
                    }
                    
                });
            } catch (err){
                setFunctionError(err,"favsLink","findName");
            }
        }
        if (STORAGE.tableNames){
            const id = getCurrId();
            findName (id);
        }
      
    }

    function getLink(){
        try{
            const link = window.location.href;
            const favTemplate = $$("favLink");
            if (favTemplate){
                favTemplate.setValues(link);
            }
        } catch (err){
            setFunctionError(err,"favsLink","getLink");
        }
    }

    
    function createTemplate(id, name,nonName){
        return {   
            width:250,
            id:id,
            css:"popup_subtitle", 
            borderless:true, 
            height:20 ,
            template: function(){
                if (Object.keys($$(id).getValues()).length !==0){
                    return name+": "+$$(id).getValues();
                } else {
                    return name+": "+name+" "+nonName;
                }
          
            }
        }
    }

    function btnSaveLinkClick(){
        webix.message({type:"debug", text:"Блок находится в разработке"});
    }
   
    const popupHeadline = {   
        template:"Сохранить ссылку", 
        width:250,
        css:"popup_headline", 
        borderless:true, 
        height:20 
    };

    const btnClosePopup = {
        view:"button",
        id:"buttonClosePopup",
        css:"popup_close-btn",
        type:"icon",
        width:35,
       
        icon: 'wxi-close',
        click:function(){
            try{
                if ($$("popupFavsLinkSave")){
                    $$("popupFavsLinkSave").destructor();
                }
            } catch (err){
                setFunctionError(err,"header","favsPopup click");
            }
        
        }
    };

    
    const btnSaveLink = {
        view:"button", 
       // id:"", 
        value:"Сохранить ссылку", 
        css:"webix_primary", 
        click:function(){
            btnSaveLinkClick()
        }
 
    };



    webix.ui({
        view:"popup",
        id:"popupFavsLinkSave",
        css:"popup_padding-container",
        escHide:true,
        width:700,
        //height:300,
        modal:true,
        position:"center",
        body:{
            rows:[
            {rows: [ 
                { cols:[
                    popupHeadline,
                    {},
                    btnClosePopup,
                   
                ]},
                createTemplate("favNameLink","Имя","не указано"),
                {height:5},
                createTemplate("favLink","Ссылка","не указана"),
                {},
                {},
                btnSaveLink,
                {height:50}
            ]}]
            
        },

    }).show();

    getLinkName();
    getLink();
}



export{
    favsPopup,
    saveFavsClick
};
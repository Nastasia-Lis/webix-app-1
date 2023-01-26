///////////////////////////////

// Начальные настройки роутера                      (create router settings)
//
// Навигация по сайдбару                            (create tree navigate)
//
// Пользовательские настройки                       (create settings)
//
// Выход из системы                                 (create logout)
//
// Проверка авторизации и перенаправление           (create index)
//
// Редактор дерева                                  (create edit tree)
//
// Смена пароля                                     (create cp)
//
// Роуты                                            (create routes)
//
// Сокрытие всех элементов                          (create visible state)
//
// Создание компонентов                             (create components)
//
// Отрисовка главного layout и сокрытие авторизации (create content)
//
// Медиатор                                         (create mediator)
//
// Copyright (c) 2022 CA Expert
//
///////////////////////////////
import { lib }                from "../expalib.js";

lib ();

import { Action }                   from "../blocks/commonFunctions.js";
import { mediator }                 from "../blocks/_mediator.js";
import { setStorageData }           from "../blocks/storageSetting.js";
import { STORAGE, getData,GetFields, 
         LoadServerData, GetMenu }  from "../blocks/globalStorage.js";
import { setFunctionError }         from "../blocks/errors.js";
import { ServerData }               from "../blocks/getServerData.js";
import { returnOwner, isArray }     from "../blocks/commonFunctions.js";


const logNameFile = "router";




async function getOwner(){
    const owner = await returnOwner();

    return owner;
}



//create router settings
function navigate(path){
    Backbone.history.start({pushState: true, root: path});
}

function setRouterStart(){
    if (window.location.host.includes("localhost:3000")){
        navigate('/index.html/');
    } else {
        navigate('/init/default/spaw/');
    }
}




//create tree navigate

let id;
let emptyTab = false;



async function getTableData (){

    await LoadServerData.content("fields");
    const keys = GetFields.keys;
 
    if (keys){
        mediator.sidebar.selectItem(id);
    }
}


async function createTableSpace (){
    RouterActions.createContentSpace();
   
    const isFieldsExists = GetFields.keys;
    try{   
        const tree = $$("tree");
        tree.attachEvent("onAfterLoad", 
        webix.once(function (){
            if (!isFieldsExists && !emptyTab) {
                getTableData ();
            } 
        }));         
       
    } catch (err){
        setFunctionError(
            err, 
            logNameFile, 
            "createTableSpace"
        );
    }

}



async function checkTable(){

    try {
        const isSidebarData = mediator.sidebar.dataLength();
        
        if (!isSidebarData){
            createTableSpace ();
            
        }
    } catch (err){
        setFunctionError(
            err, 
            logNameFile, 
            "checkTable"
        );

    }    
  
}

async function treeRouter(selectId){

    const search = window.location.search;
    const params    = new URLSearchParams(search);
    const param = params.get("new"); 

    if (param){
        emptyTab = true;
    }

    id = selectId;
    checkTable();
  
}



//create settings

function setUserprefsNameValue (){
  
    const user = webix.storage.local.get("user");
    try{
        if (user){
            const name = user.name.toString();
            $$("settingsName").setValues(name);
        }
    } catch (err){
      
        setFunctionError(
            err, 
            logNameFile,
            "setUserprefsNameValue"
        );
    }

}



function setTemplateValue(data){
 
    if (isArray(data, logNameFile, "setTemplateValue")){
 
        const prefs = JSON.parse(data.prefs);

        if (prefs){
  
            const names  = Object.keys(prefs);
            const values = Object.values(prefs);
            
            if (names.length){
                names.forEach(function(name, i){
                    const form = $$(name);
                    if (form){
                        form.setValues(values[i]);
                        form.config.storagePrefs = values[i];
                    }
                   
                });
            }
        }
    } 

}

async function getDataUserprefs(){
    const owner   = await getOwner();
    const name    = `userprefs.name='/settings'`;
    const ownerId = `userprefs.owner=${owner.id}`;

    new ServerData({  
        id : `smarts?query=${name}+and+${ownerId}&limit=80&offset=0`
    }).get().then(function(data){
        if (data){
          
            if (data.content.length){
                setTemplateValue(data.content[0]);
            }
      
        } else {
            setFunctionError(
                `data is ${data}` , 
                logNameFile, 
                "getDataUserprefs"
            ); 
        }
    });

}

function setTabData(id){
    $$("globalTabbar").addOption({
        id    : id, 
        value : "Настройки", 
        isOtherView : true,
        info  : {
            tree:{
                view : "settings"
            }
        },
        close : true, 
    }, true);
}

function settingsRouter(){

    const id   = "settings";
    const elem = $$(id);
    
    RouterActions.hideContent();

    if (mediator.sidebar.dataLength() == 0){
        RouterActions.createContentSpace();
    }

    setTabData(id);


    if (elem){
        Action.showItem(elem);
    } else {
        RouterActions.createContentElements (id);
        getDataUserprefs();
        Action.showItem($$(id));
    }

    setUserprefsNameValue   ();

    mediator.sidebar.close  ();
    RouterActions.hideEmptyTemplates();
    
  
}



//create logout

function clearStorage(){
    try{
    
        webix.storage.local.clear();
    } catch (err){
        setFunctionError(
            err, 
            logNameFile, 
            "clearStorage"
        );
    }
}

function putPrefs(id, sentObj){

    new ServerData({  
        id : `userprefs/${id}`
    }).put(sentObj);
  
}

function isPrefExists(data, name){
    const result = {
        exists : false
    };
 
    if (isArray(data, logNameFile, "isPrefExists")){
        data.forEach(function(el){
            if (el.name == name){
                result.exists = true;
                result.id     = el.id;
            } 
        }); 
    }
        
  
    
    return result;
}

function postUserPrefs(sentObj){

    new ServerData({  
        id : "userprefs"
    }).post(sentObj);

}


function returnSentTemplate(name, data){
    return {
        name  : name,
        prefs : data
    };
}



async function saveCurrData(servData, name, prefs, owner){

    const pref = returnSentTemplate(name, prefs);

    const result   = isPrefExists(servData, name);
    const isExists = result.exists;
    
    if (isExists){
        const id = result.id;
        putPrefs(id, pref);
    } else {
        pref.owner = owner.id;
        postUserPrefs(pref);
    }

 

}


function saveHistoryTrue(){
    const tabbarData  = webix.storage.local.get("userprefsOtherForm");

    if (tabbarData && tabbarData.saveHistoryOpt == "1"){
        return true;
    }
}

function getLocalData(name){
    return webix.storage.local.get(name);
}

function createRestoreData(){
    const restore = {
        editProp :  getLocalData("editFormTempData"),
        filter   :  getLocalData("currFilterState")
    };

    return restore;
}

async function saveLocalStorage() {

    const owner  = await getOwner();
    
    new ServerData({  
        id           : "userprefs"
    }).get().then(function(data){

        if (data && data.content){

        const content = data.content;

        const tabbarData  = getLocalData("tabbar");
        saveCurrData(content, "tabbar" , tabbarData , owner);

 
        if (saveHistoryTrue()){
            const tabsHistory = getLocalData("tabsHistory");
            saveCurrData(content, "tabsHistory", tabsHistory, owner);
        }
        
  
        if (window.location.pathname !== "/index.html/content"){

            const restore = createRestoreData();

            saveCurrData(content, "userRestoreData" , restore , owner);
        }
        }
         
    });

  
}




function backPage(){
    try{
        const search = window.location.search;
        Backbone.history.navigate("/content" + search, { trigger:true});
        window.location.reload();
    } catch (err){
        setFunctionError(
            err, 
            logNameFile, 
            "backPage"
        );
    }
}



async function logoutRouter(){

    await saveLocalStorage();

    new ServerData({  
        id           : "/init/default/logout/",
        isFullPath   : true
    }).post().then(function(data){

        if (data){
            backPage        ();
            mediator.sidebar.clear();
            clearStorage    ();
        } else {
            setFunctionError(
                "data is " + data, 
                logNameFile, 
                "logoutRouter"
            );  
        }
         
    }); 
}



//create index

function goToContentPage(){
    
    try {
        Backbone.history.navigate(
            "content", 
            {trigger : true}
        );
    } catch (err){
        console.log(
            err + 
            " " + 
            logNameFile + 
            " goToContentPage"
        );
    }
}


function showLogin(){
    Action.hideItem($$("mainLayout"));
    Action.showItem($$("userAuth"  ));

}

async function indexRouter(){

    if (!STORAGE.whoami ){
        await getData("whoami"); 
    }


    if (STORAGE.whoami){
        goToContentPage();

    } else {
        showLogin();
    }
}




//create edit tree

function loadTreeSpace(){
    const isTreeData = mediator.sidebar.dataLength();
    if (!isTreeData){
        RouterActions.createContentSpace();
    }
}

function createTreeTemplate(){
    const id = "treeTempl";
    if (!$$(id)){
        RouterActions.createContentElements(id);
    }

    mediator.treeEdit.showView();
    mediator.treeEdit.load();
}


function experimentalRouter(){
    RouterActions.hideEmptyTemplates();
   
    RouterActions.hideContent();

    loadTreeSpace ();
    
    createTreeTemplate ();
    
    mediator.sidebar.close();
}


//create cp
function setUserValues(){
    const user     = webix.storage.local.get("user");
    const authName =  $$("authName");
    try{
        if (user){
            const values = user.name.toString();
            authName.setValues(values);
        }
    } catch (err){
        setFunctionError(
            err,
            logNameFile,
            "setUserValues"
        );
    }
}

 
function setTab(id){
    $$("globalTabbar").addOption({
        id    : id, 
        value : "Смена пароля", 
        isOtherView : true,
        info  : {
            tree:{
                view : "cp"
            }
        },
        close : true, 
    }, true);
}

function createCpComponent(){
    const auth = $$("user_auth");
    
    setTab("cp");

    if(auth){
        Action.showItem(auth);
    } else {
        RouterActions.createContentElements("cp");
        Action.showItem($$("user_auth"));
   
    }
}


function loadSpace(){
    const isSidebarData = mediator.sidebar.dataLength();

    if (!isSidebarData){
        RouterActions.createContentSpace(); //async ?
    }
}

function cpRouter(){
    
    loadSpace();

    RouterActions.hideContent();
    createCpComponent        ();
 
    mediator.sidebar.close();

    setUserValues     ();
    RouterActions.hideEmptyTemplates();
}




//create routes
function router (){
    let routes = new (Backbone.Router.extend({
    
        routes:{
            ""                : "index" ,
            "content"         : "content", 
            "settings"        : "settings",
            "cp"              : "cp",
            "logout"          : "logout",
            "tree/:id"        : "tree",
            "experimental/:id":"experimental"
        },
        
        content:function(){
            RouterActions.createContentSpace();
        },
    
        index:function(){
            indexRouter();

        }, 

        tree: function(id){
            treeRouter(id);
        },
        
        cp: function(){
            cpRouter();
    
      
        },
    
        settings: function(){
            settingsRouter();
            

        },

        experimental: function (){
            experimentalRouter();
        },
    
        logout: function (){
            logoutRouter();
        }
    
    }));

    return routes;
}

//create visible state

function hideAllElements (){

  
    const container = $$("container");
    const childs    = container.getChildViews();
    
    if (childs.length){
        childs.forEach(function(el){
            const view = el.config.view;
            if(view == "scrollview" || view == "layout"){
                Action.hideItem($$(el.config.id));
            }
        });
    } else {
        setFunctionError(
            "array length is null",
            "routerConfig/hideAllElements",
            "hideAllElements"
        ); 
    }

  
     
}



//create components

let specificElement;

function createDefaultWorkspace(){
    if(!specificElement){
        mediator.dashboards.create();
        mediator.tables    .create();
        mediator.forms     .create();
    }
}

function createTreeTempl(){
    if (specificElement == "treeTempl"){
        mediator.treeEdit.create();
    }
 
}

function createCp(){
    if (specificElement == "cp"){
        mediator.user_auth.create();
    }

}

function createUserprefs(){
    if (specificElement == "settings"){
        mediator.settings.create();
    }

}

function createSpecificWorkspace (){
    createTreeTempl();
    createCp();
    createUserprefs();
}


function createElements(specElem){
    specificElement = specElem;
    createDefaultWorkspace();
    createSpecificWorkspace ();
  
}


//create content

function getMenuTree() {

    LoadServerData.content("mmenu")
    
    .then(function (result){
        if (result){
            const menu = GetMenu.content;
            mediator.sidebar.load(menu);
            mediator.header .load(menu);
        }

    });

}

function setUserData(){
  
    const data = STORAGE.whoami.content;

    const userStorageData = {
        id       : data.id,
        name     : data.first_name,
        username : data.username
    };

    setStorageData(
        "user", 
        JSON.stringify(userStorageData)
    );
}





async function createContent (){

    if (!STORAGE.whoami){
        await getData("whoami"); 
    }

    
    if (STORAGE.whoami){
        Action.hideItem($$("userAuth"  ));
        Action.showItem($$("mainLayout"));
    
        setUserData();

        createElements();
    
        getMenuTree();
 
         
    } else {
        Backbone.history.navigate("/", { trigger:true});
        window.location.reload();
    }

  


}

//create mediator
class RouterActions {
    static hideEmptyTemplates(){
        Action.removeItem($$("webix__null-content"));
        Action.hideItem  ($$("webix__none-content"));     
    }

    static hideContent   (){
        hideAllElements();
    }

    static async createContentSpace (){
        await createContent  ();
    }

    static async loadSpace(){
        const isSidebarData = mediator.sidebar.dataLength();

        if (!isSidebarData){
            await createContent();
        }
    }

    static createContentElements(id){
        createElements (id);
    }

}

export {
    router,
    setRouterStart
};
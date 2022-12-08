import { Action }               from "../../blocks/commonFunctions.js";
import { STORAGE, getData }     from "../../blocks/globalStorage.js";

const logNameFile = "router => index";

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



function showWorkspace(){
    Action.hideItem($$("mainLayout"));
    Action.showItem($$("userAuth")  );

}

async function indexRouter(){

    if (!STORAGE.whoami ){
        await getData("whoami"); 
    }


    if (STORAGE.whoami){
        goToContentPage();

    } else {
        showWorkspace();
    }
}



export {
    indexRouter
};
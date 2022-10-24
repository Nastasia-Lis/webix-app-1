import {STORAGE,getData} from "../globalStorage.js";
import {setFunctionError} from "../errors.js";

function indexRouter(){
    function goToContentPage(){
    
        try {
            Backbone.history.navigate("content", { trigger:true});
        } catch (err){
            setFunctionError(err,"router","router:index function goToContentPage");
        }
    }

    function showWorkspace(){
        try{
            if($$("mainLayout")){
                $$("mainLayout").hide();
            }

            if(  $$("userAuth")){
                $$("userAuth").show();
            }
            
        } catch (err){
            window.alert("getAuth: "+err+ " (Подробности: ошибка в отрисовке контента, router:index function showWorkspace)");
            setFunctionError(err,"router","router:index function showWorkspace");
        }
    }

    async function getAuth () {

        if (!STORAGE.whoami ){
            await getData("whoami"); 
        }

        if (STORAGE.whoami){
            goToContentPage();

        } else {
            showWorkspace();
        }
    }
    getAuth ();
    
}
export {
    indexRouter
};
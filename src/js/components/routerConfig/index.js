import { STORAGE, getData}  from "../../blocks/globalStorage.js";

const logNameFile = "router => index";

function indexRouter(){

    function goToContentPage(){
    
        try {
            Backbone.history.navigate("content", { trigger:true});
        } catch (err){
            console.log(err + " " + logNameFile + " goToContentPage");
        }
    }

    function showWorkspace(){
        try{
            const main  = $$("mainLayout");
            const login = $$("userAuth");
            
            if(main){
                (main).hide();
            }
          
            if(login){
                login.show();
            }
            
        } catch (err){
            window.alert("getAuth: " + err + 
            " (Подробности: ошибка в отрисовке контента, router:index function showWorkspace)");
            console.log(err + " " + logNameFile + " function showWorkspace");
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
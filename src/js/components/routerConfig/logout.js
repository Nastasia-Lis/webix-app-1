import { setFunctionError, setAjaxError }   from "../../blocks/errors.js";

const logNameFile = "router => logout";

function logoutRouter(){
    const logoutData = webix.ajax().post("/init/default/logout/");

    logoutData.then(function(){

        function clearTree (){
            try{
                const tree = $$("tree");

                if( tree){
                    tree.clearAll();
                }
            } catch (err){
                setFunctionError(err, logNameFile, "clearTree");
            }
        }

        function clearStorage(){
            try{
                webix.storage.local.clear();
            } catch (err){
                setFunctionError(err, logNameFile, "clearStorage");
            }
        }

        function backPage(){
            try{
                history.back();
            } catch (err){
                setFunctionError(err, logNameFile, "backPage");
            }
        }

        backPage        ();
        clearTree       ();
        clearStorage    ();
    });

    logoutData.fail(function(err){
        setAjaxError(err, logNameFile, "logoutData");
    });  
}

export{
    logoutRouter
};
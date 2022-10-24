import {setFunctionError,setAjaxError}   from "../errors.js";

function logoutRouter(){
    const logoutData = webix.ajax().post("/init/default/logout/");

    logoutData.then(function(data){
        function showNoneContent(){
            try{
                if($$("webix__none-content")){
                    $$("webix__none-content").show();
                }
            } catch (err){
                setFunctionError(err,"router","router:logout function showNoneContent");
            }
        }
        function clearTree (){
            try{
                if( $$("tree")){
                    $$("tree").clearAll();
                }
            } catch (err){
                setFunctionError(err,"router","router:logout function clearTree");
            }
        }

        function clearStorage(){
            try{
                webix.storage.local.clear();
            } catch (err){
                setFunctionError(err,"router","router:logout function clearStorage");
            }
        }

        function backPage(){
            try{
                history.back();
            } catch (err){
                setFunctionError(err,"router","router:logout function backPage");
            }
        }

        backPage();
        showNoneContent();
        clearTree ();
        clearStorage();
    
    });

    logoutData.fail(function(err){
        setAjaxError(err, "router","router:logout logoutData");
    });  
}

export{
    logoutRouter
};
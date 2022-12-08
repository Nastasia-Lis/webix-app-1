import { setAjaxError, 
         setFunctionError }     from "../../../../blocks/errors.js";
import { setLogValue }          from "../../../logBlock.js";


const logNameFile = "table => createSpace => click => navigate";

function createSentObj(prefs){
    const sentObj = {
        name    : "dashboards_context-prefs",
        prefs   : prefs,
    };

    const ownerId = webix.storage.local.get("user").id;

    if (ownerId){
        sentObj.owner = ownerId;
    }

    return sentObj;
}

function navigate(field, id){
    if (id){
        const path = "tree/" + field + "?" + "prefs=" + id;
        Backbone.history.navigate(path, { trigger : true });
        window.location.reload();   
    } 
}

function postPrefs(chartAction){
    const sentObj       = createSentObj(chartAction);
    const path          = "/init/default/api/userprefs/";
    const userprefsPost = webix.ajax().post(path, sentObj);
                    
    userprefsPost.then(function(data){
        data = data.json();
   
        if (data.err_type == "i"){
            const id = data.content.id;
            if (id){
                navigate(chartAction.field, id);
            } else {
                const errs   = data.content.errors;
                const values = Object.values(errs);
                const keys   = Object.keys  (errs);

                values.forEach(function(err, i){
                    setFunctionError(
                        err + " - " + keys[i] , 
                        logNameFile, 
                        "postPrefs"
                    );
                });
               
            }
          

        } else {
            setLogValue("error", data.error);
        }
    });

    userprefsPost.fail(function(err){
        setAjaxError(
            err, 
            logNameFile,
            "postPrefs"
        );
    });
}

export {
    postPrefs
};
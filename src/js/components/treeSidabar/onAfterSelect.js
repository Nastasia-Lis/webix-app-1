
import {STORAGE,getData}    from "../../blocks/globalStorage.js";
import {setFunctionError}   from "../../blocks/errors.js";

function onAfterSelectFunc(id){
    
    async function getFields (){
        if (!STORAGE.mmenu){
            await getData("fields"); 
        }

        if (STORAGE.fields){
            try{
                Backbone.history.navigate("tree/"+id, { trigger:true });
            } catch (err){
                setFunctionError(err,"treeSidebar => onAfterSelect","getFields");
            }
        }
    }
    function setAdaptiveState(){
        try{
            if (window.innerWidth < 850 ){
                $$("tree").hide();
            }
        } catch (err){
            setFunctionError(err,"treeSidebar => onAfterSelect","setAdaptiveState");
        }
    }

    getFields ();
    setAdaptiveState();

}

export{
    onAfterSelectFunc
};
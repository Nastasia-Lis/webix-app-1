
import { modalBox }  from "./notifications.js";
import { mediator }  from "./_mediator.js";

function getSettingsFormValues(id){
    const storageData = webix.storage.local.get(id);
    return storageData;

}

function settingsForm(form){
    const id = form.config.id;
    if (id == "userprefsWorkspaceForm" || 
        id == "userprefsOtherForm")
    {
        getSettingsFormValues(form);
    }
    const storageData = getSettingsFormValues(id);
    form.setValues(storageData);
}

function unsetDirty(){
    const forms = mediator.getForms();
    let check = {
        dirty:false
    };

    if (forms){
        forms.forEach(function(form){

            if (form && form.isDirty()){

                form.clear();

                settingsForm (form);

                form.setDirty(false);
            }
        });
    }

    return check;
}



function successActions(){
    unsetDirty();
}
 

async function globalModalBox (idForm){
    return modalBox().then(function(result){
    
        if (result == 1){
            successActions();
            return true;

        } else if (result == 2){
     
            if (idForm == "table-editForm"){
                const saveBtn = $$("table-saveBtn");
                if (saveBtn.isVisible()){
                    return mediator.tables.editForm.put(false, false)
                    .then(function(result){

                        if (result){
                            successActions(); 
                            return result;
                        }

                     
                    });
                } else {
                    return mediator.tables.editForm.post(false, false)
                    .then(function(result){

                        if (result){
                            successActions();
                            return result;
                        }
                    }); 
                }
            
            } else if (idForm == "cp-form"){
      
                return mediator.user_auth.put()
                .then(function (result){
           
                    if (result){
                        successActions();
                        return result;
                    }
                });
            } else if (idForm == "userprefsOtherForm" ||
                       idForm == "userprefsWorkspaceForm"){
                    
                    return mediator.settings.put()   
                    .then(function (result){
                        if (result){
                            successActions();
                            return result;
                        }
                    }); 
            } 
            
        }
       
    });

}


function hasDirtyForms(){
    const forms = mediator.getForms();
    let check = {
        dirty:false
    };

    if (forms){
        forms.forEach(function(form){

            if (form && form.isDirty() && !check.dirty){
                check = {
                    dirty : true,
                    id    : form.config.id
                };
            }
        });
    }

    return check;
}

async function clickModalBox(id){
    const dirtyInfo = hasDirtyForms();
    const isDirty   = dirtyInfo.dirty;
 
    if (isDirty){
        const idForm = dirtyInfo.id;
        return globalModalBox (idForm);
    } else {
        return true;
    }
  
}

export {
    clickModalBox,
    globalModalBox
};
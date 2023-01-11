

import { setStorageData }           from "../../../blocks/storageSetting.js";
import { STORAGE, getData, 
         LoadServerData, GetMenu }  from "../../../blocks/globalStorage.js";
import { mediator }                 from "../../../blocks/_mediator.js";
import { createElements }           from "./createElements.js";
import { Action }                   from "../../../blocks/commonFunctions.js";


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


export {
    createContent,
};
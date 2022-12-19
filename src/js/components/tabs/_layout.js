import { createAddBtn }  from "./logic.js";

import { createTabView }  from "./tab.js";

function createTabs(){
    // const layout = {
    //     id     : "tabsContainer",
    //     height : 40,
    //     cols   : [

    //         createTabView("Имя вкладки"),
  
    //         createAddBtn(),
    //         {}
          
    //     ]
    // };

    const layout = {
        view:"tabview",
        cells:[     
          {
            header:"Form",
            body:{
                template:"Form Content"     
            }      
          },
        ]
    }

    return layout;
}


export {
  createTabs
};

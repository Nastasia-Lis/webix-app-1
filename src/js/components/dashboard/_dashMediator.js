import { Action }          from "../../blocks/commonFunctions.js";
import { dashboardLayout } from "./_layout.js";
import { createDashboard } from "./createDashboard.js";


class Dashboards {
    constructor (){
        this.name = "dashboards";
    }

    create(){
        if (!$$(this.name)){
            $$("container").addView(
                {   view    : "layout",
                    id      : this.name, 
                    hidden  : true, 
                    scroll  : "auto",
                    rows    : dashboardLayout()
                },
            3);
        }
    }

    showView(){
        Action.showItem($$(this.name));   
    }
    showExists(id){
        createDashboard(id, true);
    }

    load(id){
        createDashboard(id);
    }

    defaultState(){
        Action.hideItem($$("dashboardTool"));
        Action.showItem($$("dashboardInfoContainer"));
    }

}

export {
    Dashboards
};
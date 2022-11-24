import { Dashboards }    from "../components/dashboard/_dashMediator.js";
import { Tables, Forms } from "../components/table/_tableMediator.js";
import { TreeEdit }      from "../components/treeEdit/_treeEditMediator.js";
import { UserAuth }      from "../components/user_auth/_userAuthMediator.js";
import { Settings }      from "../components/settings/_settingsMediator.js";


const viewElements = [
    "tables",
    "forms",
    "dashboards",
    "settings",
    "cp"
];


const mediator = {
    dashboards  : new Dashboards(),
    tables      : new Tables    (),
    forms       : new Forms     (),
    settings    : new Settings  (),
    user_auth   : new UserAuth  (),
    treeEdit    : new TreeEdit  (),

    getViews(){
        const elems = Object.keys(this);

        let arr     = [];
        arr         = Object.assign(arr, elems);
        arr.pop();
        return arr;
    }
};

export {
    mediator
};

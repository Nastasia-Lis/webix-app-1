import { Dashboards }    from "../components/dashboard/_dashMediator.js";
import { Tables, Forms } from "../components/table/_tableMediator.js";
import { TreeEdit }      from "../components/treeEdit/_treeEditMediator.js";
import { UserAuth }      from "../components/user_auth/_userAuthMediator.js";
import { Settings }      from "../components/settings/_settingsMediator.js";

import { Tree }                from "../components/treeSidabar/_treeMediator.js";
import { Header }              from "../components/header/_headerMediator.js";

import { Tabs }                from "../components/tabs/_tabMediator.js";

import { clickModalBox }       from "./globalModalBox.js";
import { setParamToLink,
         removeParamFromLink } from "./setParamToLink.js";
import { encodeQueryData }     from "./queryToString.js";

import { Action }              from "./commonFunctions.js";
        
const elems = [
    "dashboards",
    "tables",
    "forms",
    "settings",
    "user_auth",
];

const boxes = [     // id компонентов с модальными окнами
    "tree", //
    "header",
    "editForm",     //при добавлении новой записи
    "refernce btn", // кнопки у combo в edit form   //
    "table",
]; 


// editForm, cp, up

const forms = []; // формы


const mediator = {
    dashboards  : new Dashboards(),
    tables      : new Tables    (),
    forms       : new Forms     (),
    settings    : new Settings  (),
    user_auth   : new UserAuth  (),
    treeEdit    : new TreeEdit  (),
    sidebar     : new Tree      (),
    header      : new Header    (),
    tabs        : new Tabs      (),

    getViews(){
        return elems;
    },

    setForm(elem){
        forms.push(elem);
    },

    getForms(){
        return forms;
    },

    getGlobalModalBox(id){
        return clickModalBox(id);
    },

    linkParam(set, param){
        if (set){
            setParamToLink(param);
        } else {
            removeParamFromLink(param);
        }
    },

    createQuery(params){
        return encodeQueryData(params);
    },

    hideAllContent (){
        const visiualElements = this.getViews();
    
        if (visiualElements){
            visiualElements.forEach(function(elem){
                Action.hideItem($$(elem));
            });
        }
    
        Action.hideItem ($$("webix__null-content"));
        Action.showItem ($$("webix__none-content"));
    }
    



};

export {
    mediator
};

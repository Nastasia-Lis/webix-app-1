///////////////////////////////
//
// Медиатор
//
// Copyright (c) 2022 CA Expert
//
///////////////////////////////


import { Dashboards }    from "../components/dashboard/_dashMediator.js";
import { Tables, Forms } from "../components/table/tableElement.js";
import { TreeEdit }      from "../components/treeEdit.js";
import { UserAuth }      from "../components/userAuth.js";
import { Settings }      from "../components/settings.js";

import { Tree }                from "../components/treeSidebar.js";
import { Header }              from "../components/header.js";

import { Tabs }                from "../components/tabs.js";

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

const forms    = []; // формы


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

    hideAllContent (show = true){
        const visiualElements = this.getViews();
    
        if (visiualElements){
            visiualElements.forEach(function(elem){
                Action.hideItem($$(elem));
            });
        }
    
        if (show){
            Action.hideItem ($$("webix__null-content"));
            Action.showItem ($$("webix__none-content"));
        }
       
    }
    



};

export {
    mediator
};

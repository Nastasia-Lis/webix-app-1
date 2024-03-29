///////////////////////////////
//
// Хранилище для fields 
//
// Copyright (c) 2022 CA Expert
//
///////////////////////////////

import { setFunctionError } from "./errors.js";
import { checkNotAuth }     from "../components/logout.js";

const STORAGE = {};


function getTableNames (content){
    let tableNames = [];

    if (content && content.length){
        const values = Object.values(content);
    
        values.forEach(function(el,i){
            tableNames.push({
                id:Object.keys(content)[i], 
                name:(el.plural) ? el.plural : el.singular
            });
        });
    }
    

    return tableNames;
}

function getData (fileName){
 
 
    if (    window.location.pathname !== "/index.html"          &&  
            window.location.pathname !== '/init/default/spaw'   ||
            fileName == "whoami"
        ){
        return webix.ajax().get(`/init/default/api/${fileName}.json`)
            .then(function (data) {
                STORAGE[fileName] = data.json();
                try{
                    if (fileName == "fields" && STORAGE[fileName]){
                        STORAGE.tableNames = getTableNames (STORAGE[fileName].content);
                    }
                } catch (err){   
                    setFunctionError(err, "globalStorage", "getData");
                }
                return STORAGE[fileName];
            }).catch(err => {
                console.log(err);
                console.log("globalStorage function getData"); 
 
                checkNotAuth (err);
            }
        );
    }
    
}

class LoadServerData {
    static async content(nameFile){
        const self = this;

        if (!self[nameFile]){
            const path = `/init/default/api/${nameFile}.json`;
            
            return webix.ajax().get(path)
            .then(function (data){
                self[nameFile] = data.json();
                return true;
            })
            .fail(function (err){
                if (checkNotAuth (err)){
                   // Backbone.history.navigate("/", { trigger:true});
                } else {
                    $$("tree").callEvent("onLoadError", [err]);
                    return false;
                }
            });

        }
 
    }
}

class GetMenu   extends LoadServerData   {

    constructor(){
        super();
    }


    static get content (){
        if (this.mmenu){
            return this.mmenu.mmenu;
        }
    }


}

class GetFields extends LoadServerData {

    constructor(){
        super();
       // this.content = this.fields.content;
    }

    static attribute (key, attr){
        if (this.fields && this.fields.content[key]){
            return this.fields.content[key][attr];
        } 
    }

    static item (key){    
        if (this.fields && this.fields.content){
            return this.fields.content[key];
        } 
    }

    static get keys (){
        if (this.fields && typeof this.fields == "object"){
            return Object.keys  (this.fields.content);
        }   
    }

    static get values (){
        if (this.fields && typeof this.fields == "object"){
            return Object.values(this.fields.content);
        } 
    }

    static get names (){
        const values = this.values;
        const keys   = this.keys;
        if (this.fields){
            const tableNames = [];

            if (values && values.length){
                values.forEach(function(el,i){
                    tableNames.push({
                        id  : keys[i], 
                        name: (el.plural) ? el.plural : el.singular
                    });
                });
            }


            return tableNames;
  
        } 
    }
   
}


export{
    getData,
    STORAGE,
    LoadServerData,
    GetMenu,
    GetFields
};
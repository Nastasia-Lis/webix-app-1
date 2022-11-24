import { setFunctionError }             from "../../../../blocks/errors.js";
import { Action }                       from "../../../../blocks/commonFunctions.js";
import { LoadServerData, GetFields }    from "../../../../blocks/globalStorage.js";

import { modalBox }                     from "../../../../blocks/notifications.js";


import { saveItem, saveNewItem }        from "../buttons.js";

import { setDirtyProperty }             from "../property.js";

import { Button }                       from "../../../../viewTemplates/buttons.js";

const logNameFile = "tableEditForm => propBtns => reference";


let property;
let selectBtn;

async function toRefTable (refTable){ 
    await LoadServerData.content("fields");
    const keys   = GetFields.keys;

    if (keys){
        if (refTable){
            Backbone.history.navigate("tree/" + refTable, { trigger : true});
            window.location.reload();
        }

    }
}


function setRefTable (srcTable){
    const table = $$("table");
    const cols  = table.getColumns();
    const tree  = $$("tree");

    
    try {
        cols.forEach(function(col){

            if ( col.id == srcTable ){
            
                const refTable =  col.type.slice(10);

                if ( tree.getItem(refTable) ){
                    tree.select(refTable);

                } else if (refTable) {
                    toRefTable (refTable);
                    
                }
            
            }

        });
    } catch (err){
        setFunctionError(err, logNameFile, "setRefTable");

        Action.hideItem($$("EditEmptyTempalte"));
    }
}


function createModalBox (srcTable){
   
    modalBox().then(function(result){

        if (result == 1 || result == 2){
            const idExists = property.getValues().id;
            if (result == 2){
                if (idExists){
                    saveItem(false,true);
                } else {
                    saveNewItem(); 
                }
                
            }

            setDirtyProperty ();
            setRefTable (srcTable);
        
        }
    });
        
    
}


function btnClick (idBtn){
    const srcTable = $$(idBtn).config.srcTable;

    if ( property.config.dirty){
        createModalBox ();
    } else {
        setRefTable (srcTable);
    }
}

function btnLayout(){

    const btn = new Button({

        config   : {
            width    : 30,
            height   : 29,
            icon     : "icon-share-square-o", 
            srcTable : selectBtn,
            click    : function(id){
                btnClick (id);
            },
        },
        titleAttribute : "Перейти в родительскую таблицу"
    
       
    }).minView();

    try{
        $$("propertyRefbtnsContainer").addView(btn);
    } catch (err){
        setFunctionError(err, logNameFile, "btnLayout");
    }
}

function createRefBtn(btn){
    property  = $$("editTableFormProperty");
    selectBtn = btn;
    btnLayout();
    Action.showItem($$("tablePropBtnsSpace"));
}


export {
    createRefBtn
};
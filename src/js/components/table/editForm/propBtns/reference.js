import { setFunctionError }             from "../../../../blocks/errors.js";
import { Action }                       from "../../../../blocks/commonFunctions.js";
import { LoadServerData, GetFields }    from "../../../../blocks/globalStorage.js";

import { modalBox }                     from "../../../../blocks/notifications.js";

import { mediator }                     from "../../../../blocks/_mediator.js";

import { Button }                       from "../../../../viewTemplates/buttons.js";

const logNameFile = "tableEditForm => propBtns => reference";


let selectBtn;
let idPost;

function toRefTable (refTable){ 
    let url = "tree/" + refTable;

    if (idPost){
        url = url + "?id=" + idPost;
    }

    if (refTable){
        Backbone.history.navigate(url, { trigger : true});
        window.location.reload();
    }

}


function setRefTable (srcTable){
    const table = $$("table");
    const cols  = table.getColumns();
    const tree  = $$("tree");

    try {
        cols.forEach(function(col){

            if ( col.id == srcTable ){
            
                const refTable = col.type.slice(10);

                toRefTable (refTable);
            
            }

        });
    } catch (err){
        setFunctionError(
            err, 
            logNameFile, 
            "setRefTable"
        );

        Action.hideItem($$("EditEmptyTempalte"));
    }
}


function createModalBox (srcTable){
   
    modalBox().then(function(result){
        const editForm =  $$("table-editForm");

        if (result == 1 || result == 2){
            const idExists = $$("table-saveBtn").isVisible();

            const form = mediator.tables.editForm;
            
            if (result == 2){
                if (idExists){
                    form.put(false, true)
                    .then(function (result){
                        if (result){
                            editForm.setDirty(false);
                            setRefTable (srcTable);
                        }
                    });
                } else {
                    form.post(false, true)
                    .then(function (result){
                        if (result){
                            editForm.setDirty(false);
                            setRefTable (srcTable); 
                        }
                    });
                }
            } else {
                editForm.setDirty(false);
                setRefTable      (srcTable); 
            }
        }
    });
        
    
}

function findIdPost(editor){
    const prop = $$("editTableFormProperty");
    const item = prop.getItem(editor);
    return item.value;
}

function btnClick (idBtn){
    const config      = $$(idBtn).config;
    const srcTable    = config.srcTable;
    const isDirtyForm = $$("table-editForm").isDirty();
    idPost            = findIdPost(config.idEditor);
    
    if (isDirtyForm){
        createModalBox (srcTable);
    } else {
        setRefTable    (srcTable);
    }
}

function btnLayout(idEditor){

    const btn = new Button({

        config   : {
            width    : 30,
            height   : 29,
            idEditor : idEditor,
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
    selectBtn = btn;
    btnLayout(btn);
    Action.showItem($$("tablePropBtnsSpace"));
}


export {
    createRefBtn
};
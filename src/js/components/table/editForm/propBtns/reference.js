import { setFunctionError }             from "../../../../blocks/errors.js";
import { Action }                       from "../../../../blocks/commonFunctions.js";
import { mediator }                     from "../../../../blocks/_mediator.js";
import { Button }                       from "../../../../viewTemplates/buttons.js";

const logNameFile = "tableEditForm => propBtns => reference";


let selectBtn;
let idPost;

function createTabConfig(refTable){
    const infoData = {

        tree : {
            field : refTable,
            type  : "dbtable" 
        },
        temp : {
            edit  : {
                selected : idPost, 
                values   : {
                    status : "put",
                    table  : refTable,
                    values : {}
                }
            },
          
        }
    };  
    
    return infoData;
}

function setRefTable (srcTable){
    if (srcTable){
        const table = $$("table");
        const cols  = table.getColumns();
 

    
        if (cols && cols.length){
            cols.forEach(function(col){

                if ( col.id == srcTable ){
                
                    const refTable = col.type.slice(10);
                    
                    const infoData = createTabConfig(refTable);

                    mediator.tabs.openInNewTab(infoData);
                
                }

            });
        } else {
            setFunctionError(
                "array length is null", 
                logNameFile, 
                "setRefTable"
            );

            Action.hideItem($$("EditEmptyTempalte")); 
        }
           
      

    }

}


function findIdPost(editor){
    const prop = $$("editTableFormProperty");
    const item = prop.getItem(editor);
    return item.value;
}

function btnClick (idBtn){
    const config      = $$(idBtn).config;
    const srcTable    = config.srcTable;

    idPost            = findIdPost(config.idEditor);

    setRefTable    (srcTable);
  
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
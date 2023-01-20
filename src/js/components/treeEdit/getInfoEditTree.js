  
///////////////////////////////

// Создание дерева

// Copyright (c) 2022 CA Expert

///////////////////////////////

import { setFunctionError }               from "../../blocks/errors.js";
import { ServerData }                     from "../../blocks/getServerData.js";
import { GetFields, LoadServerData }      from "../../blocks/globalStorage.js";

const logNameFile = "getContent => getInfoEditTree";

let treeEdit;



function returnEmptyOption(){
    const options = [
        { 
            id    : 111, 
            value : "Не выбрано" 
        }
    ];

    return options;
}


//set combo parents
function isParent(el){
    let res          = false;
    const firstChild = treeEdit.getFirstChildId(el);

    if (firstChild){
        res = true;
    }

    return res;
}

function findParents(treeData){
    const parents = [];

    if (treeData && treeData.length){
        treeData.forEach(function(item,i){

            if (isParent(item.id)){
                parents.push(item);
            }
           
        });
    
    }

    return parents;
}


function setComboValues(treeData){
    const parents = findParents(treeData);
 

    if (parents && parents.length){

        const options = returnEmptyOption();
        const combo   = $$("editTreeCombo");

        parents.forEach(function(parent){
            options.push({
                id    : parent.id,
                value : parent.value
            });
        });
    
        combo.getPopup().getList().parse(options);
    
        const firstOption = options[0].id;
        combo.setValue(firstOption);
    }


}


//set combo owners
async function getRefField(){
    await LoadServerData.content("fields");
    const field = GetFields.item("trees");

    const ownerConfig = field.fields.owner;
    const refAttr     = ownerConfig.type;

    return refAttr.slice(10); //slice "reference" 
}

function getOptions(data){
    const options = returnEmptyOption();

    if (data && data.length){
        data.forEach(function(el){
            options.push({
                id    : el.id, 
                value : el.first_name
            });
        });
    }
 

    return options;
}

function setOptionsToCombo(options){
    const combo   = $$("editTreeComboOwner");
    combo.getPopup().getList().parse(options);
}

async function setOwnerComboValues(){

    const refField = await getRefField();

    new ServerData({
        id : refField 
       
    }).get().then(function(data){
    
        if (data){
    
            const content = data.content;
            if (content){
                const options = getOptions(content);
                setOptionsToCombo(options);
            }
        }
         
    });


}



// create tree struct
function createTreeItem(el){
    return {
        id    : el.id, 
        value : el.name, 
        owner : el.owner,
        pid   : el.pid, 
        data  : []
    };
}


function pushTreeData(data){
    const treeData = [];       
 

    if (data && data.length){
        data.forEach(function(el){
            if (el.pid == 0){
                const rootElement = createTreeItem(el);

                rootElement.open  = true;
                treeData.push ( rootElement );

            } else {
                const element = createTreeItem(el);

                treeData.push (element );
            }
        });
    }


    return treeData;
}

function createStruct(treeData){
    const treeStruct = [];
    const map        = {};
    try{

        if (treeData && treeData.length){
            treeData.forEach(function(el, i){

                map[el.id] = i; 
    
                if ( el.pid !== 0 && el.pid !== el.id && el.pid !== null ) {
                    treeData[map[el.pid]].data.push(el);
                } else {
                    treeStruct.push(el);
                }
            });
        }
    
    } catch (err) {
        setFunctionError(err, logNameFile, "createStruct");
    }
    return treeStruct;
}

function getTrees(){

    new ServerData({
    
        id : "trees"
       
    }).get().then(function(data){
    
        if (data){
    
            const content = data.content;
    
            if (content){
                
                content[0].pid = 0;
        
                const treeData   = pushTreeData(content);
                const treeStruct = createStruct(treeData);
        
                treeEdit.parse      (treeStruct);
        
                setComboValues      (treeData);
                setOwnerComboValues ();
    
            }
        }
         
    });

}

function getInfoEditTree() {
    treeEdit  = $$("treeEdit");

    getTrees();

    if (treeEdit){
        treeEdit.clearAll();
    }   
 
}

export{
    getInfoEditTree
};
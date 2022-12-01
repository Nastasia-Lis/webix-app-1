import { setAjaxError, setFunctionError } from "../../blocks/errors.js";
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

    treeData.forEach(function(item,i){

        if (isParent(item.id)){
            parents.push(item);
        }
       
    });

    return parents;
}


function setComboValues(treeData){
    const parents = findParents(treeData);
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

    data.forEach(function(el){
        options.push({
            id    : el.id, 
            value : el.first_name
        });
    });

    return options;
}

function setOptionsToCombo(options){
    const combo   = $$("editTreeComboOwner");
    combo.getPopup().getList().parse(options);
}

async function setOwnerComboValues(){

    const refField    = await getRefField();

    const url       = "/init/default/api/" + refField;
    const getDataRef   = webix.ajax().get(url);

    getDataRef.then(function(data){
        data = data.json().content;
      
        const options = getOptions(data);
        setOptionsToCombo(options);

    });
    getDataRef.fail(function(err){
        setAjaxError(
            err, 
            "getInfoTree", 
            "setOwnerComboValues"
        );
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
    try{
        data.forEach(function(el,i){
            if (el.pid == 0){
                const rootElement = createTreeItem(el);

                rootElement.open  = true;
                treeData.push ( rootElement );

            } else {
                const element = createTreeItem(el);

                treeData.push (element );
            }
        });
    } catch (err) {
        setFunctionError(err,logNameFile,"pushTreeData");
    }

    return treeData;
}

function createStruct(treeData){
    const treeStruct = [];
    const map        = {};
    try{
        treeData.forEach(function(el, i){

            map[el.id] = i; 

            if ( el.pid !== 0 && el.pid !== el.id && el.pid !== null ) {
                treeData[map[el.pid]].data.push(el);
            } else {
                treeStruct.push(el);
            }
        });
    } catch (err) {
        setFunctionError(err, logNameFile, "createStruct");
    }
    return treeStruct;
}

function getTrees(){
    const url       = "/init/default/api/" + "trees";
    const getData   = webix.ajax().get(url);

    getData.then(function(data){

        data = data.json().content;
        data[0].pid = 0;

        const treeData   = pushTreeData(data);
        const treeStruct = createStruct(treeData);

        treeEdit.parse      (treeStruct);

        setComboValues      (treeData);
        setOwnerComboValues ();

    });

    getData.fail(function(err){
        setAjaxError(
            err, 
            "getInfoTree", 
            "getInfoEditTree"
        );
    });

}

function getInfoEditTree() {
    treeEdit  = $$("treeEdit");

    getTrees();

    treeEdit.clearAll();
 
}

export{
    getInfoEditTree
};
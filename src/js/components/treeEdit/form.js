let tree;

const cssDisable = "tree_disabled-item";

function cssItems(action, selectItems){

    if (tree){
        const pull = tree.data.pull;

        if (pull){
            const values = Object.values(pull);

            if (values && values.length){
                values.forEach(function(item){
        
                    if (action == "remove"){
                        tree.removeCss(item.id, cssDisable);
            
                    } else if (action == "add" && selectItems) {
                        const result = 
                        selectItems.find((id) => id == item.id);
            
                        if (!result){
                            tree.addCss   (item.id, cssDisable);
                        }
                    }
                
                });
            }
          
        }
    }
   
   
}


function openFullBranch(value){
    const parent = tree.getParentId(value);
    if (parent && tree.getParentId(parent)){
        tree.open     (parent);
        openFullBranch(parent);
    } else {
        tree.open(value);
        tree.open(parent);
    }  



    return value;
}

function returnSelectItems(value){
    const res = [value];
    tree.data.eachSubItem(value, function(obj){ 
        res.push(obj.id);
    });   

    return res;
}

function parentsLogic(value){
    let topParent;

    if (tree.exists(value)){
     
        topParent = openFullBranch(value);

        tree.showItem   (value);
        tree.open       (value);

        const selectItems = returnSelectItems(value);

        cssItems("add", selectItems);
    }

    return topParent;
}


function getAvailableItems(topParent){
    const res = [topParent];
    tree.data.eachSubItem(topParent, function(obj){ 
        res.push(obj.id);
    });   

    return res;
}

function showLastItem(resultItems){
    const index = resultItems.length - 1;
    const item  = resultItems[index];
    tree.showItem (item);
}
 

function ownersLogic(value, topParent){
    const pull   = tree.data.pull;
    const values = Object.values(pull);

    const resultItems = [];

   
    if (topParent){ // если уже выбран элемент для редактирования
        const items = getAvailableItems(topParent);

        if (items && items.length){
            items.forEach(function(id, i){
                const item  = tree.getItem(id);
                const owner = item.owner;
        
                if (owner == value){
                    resultItems.push(id);
                  
                }
    
            });
    
            cssItems("add", resultItems);
        }
        
    } else {

        if (values && values.length){
            values.forEach(function(el){
                const owner = el.owner; 
                if (owner && owner == value){
                    resultItems.push(el.id);
                
                }
            });
        }
   

    }

    cssItems("add", resultItems);

    showLastItem(resultItems);

    if (resultItems && resultItems.length){
        resultItems.forEach(function(id){
            openFullBranch(id);
        });
    }
   
 
}   


function editTreeClick (){
    tree  = $$("treeEdit");

    cssItems("remove");

    const formVals = $$("editTreeForm").getValues();

    const parents = formVals.parents;
    const owners  = formVals.owners;

    let topParent;

    if (parents && parents !== "111"){
        topParent = parentsLogic(parents);
    }

    if (owners && owners !== "111"){
        ownersLogic(owners, topParent);
    }


}



function returnParentCombo(){
    const combo = {
        view          : "combo", 
        id            : "editTreeCombo",
        name          : "parents",
        value         : 111,
        labelPosition : "top",
        label         : "Выберите элемент для редактирования", 
        options       : []
    };

    return combo;
}

function returnOwnerCombo(){
    const combo = {
        view          : "combo", 
        id            : "editTreeComboOwner",
        name          : "owners",
        labelPosition : "top",
        value         : 111,
        label         : "Выберите владельца", 
        options       : []
 
    };

    return combo;
}


function returnBtn(){
    const btn = {   
        view  : "button", 
        value : "Применить" ,
        css   : "webix_primary",
        click : editTreeClick
    };

    return btn;
}


function returnForm(){
    const form = {
        view    : "form", 
        id      : "editTreeForm",
        width   : 300,
        elements: [
            returnParentCombo(),
            returnOwnerCombo (),
            returnBtn(),
            {}, 
        ]
    };

    return form;
}


export {
    returnForm
};
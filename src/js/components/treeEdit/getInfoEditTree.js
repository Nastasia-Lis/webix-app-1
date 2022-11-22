import { setAjaxError,setFunctionError } from "../../blocks/errors.js";

const logNameFile = "getContent => getInfoEditTree";


function getInfoEditTree() {
    const treeEdit  = $$("treeEdit");
    const url       = "/init/default/api/" + "trees";
    const getData   = webix.ajax().get(url);

    treeEdit.clearAll();

    getData.then(function(data){

        data = data.json().content;
        data[0].pid = 0;

        const map = {}, 
            treeStruct = [],
            treeData   = []
        ;
        
        function createTreeItem(el){
            return {
                id    :el.id, 
                value :el.name, 
                pid   :el.pid, 
                data  :[]
            };
        }

        function pushTreeData(){
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
        }

 
        function createStruct(){
            try{
                treeData.forEach(function(el,i){

                    map[el.id] = i; 

                    if ( el.pid !== 0 && el.pid !== el.id && el.pid !== null ) {
                        treeData[map[el.pid]].data.push(el);
                    } else {
                        treeStruct.push(el);
                    }
                });
            } catch (err) {
                setFunctionError(err, logNameFile, "createStruct")
            }
        }

        function isParent(el){
            let res          = false;
            const firstChild = treeEdit.getFirstChildId(el);

            if (firstChild){
                res = true;
            }

            return res;
        }

        function findParents(){
            const parents = [];
     
            treeData.forEach(function(item,i){

                if (isParent(item.id)){
                    parents.push(item);
                }
               
            });

            return parents;
        }

        function setComboValues(){
            const parents = findParents();
            const options = [];
            const combo   = $$("editTreeCombo");

            parents.forEach(function(parent,i){
                options.push({
                    id    : parent.id,
                    value : parent.value
                });
            });

 
       

            combo.getPopup().getList().parse(options);

            const firstOption = options[0].id;
            combo.setValue(firstOption);

        }

        pushTreeData();
        createStruct();

        treeEdit.parse(treeStruct);

        setComboValues();



    });

    getData.fail(function(err){
        setAjaxError(err, "content", "getInfoEditTree");
    });

  
}

export{
    getInfoEditTree
};
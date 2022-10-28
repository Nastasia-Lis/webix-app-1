import {setAjaxError,setFunctionError} from "../errors.js";

const logNameFile = "getContent => getInfoEditTree";


function getInfoEditTree() {
    const treeEdit  = $$("treeEdit");
    const url       = "/init/default/api/"+"trees";
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
                setFunctionError(err,logNameFile,"createStruct")
            }
        }

        pushTreeData();
        createStruct();

        treeEdit.parse(treeStruct);

    });

    getData.fail(function(err){
        setAjaxError(err, "content","getInfoEditTree");
    });

  
}

export{
    getInfoEditTree
};
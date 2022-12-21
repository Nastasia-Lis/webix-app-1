
import { returnLostFilter } from "./returnLostFilter.js";
import { returnLostData }   from "./returnLostData.js";

class TableSpace {
    static restoreFilter(id){
        returnLostFilter(id);
    }

    static restoreEditForm(){
        returnLostData();
    }
}

export {
    TableSpace
};
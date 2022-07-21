import {tablesArray} from './data/data.js';


    let tableId = tablesArray[1].id;
    
    //tooldarTable elements
    let pagerId = tableId+"-pager";
    let searchId = tableId+"-search";
    let findElemetsId = tableId+"-findElemets";

    //editTable elements
    let editFormId = tableId+"-editForm";
    let saveBtnId = tableId+"-saveBtn";
    let addBtnId = tableId+"-addBtn";
    let delBtnId = tableId+"-delBtnId";
    let cleanBtnId = tableId+"-cleanBtn";
    let saveNewBtnId = tableId+"-saveNewBtn";
    


export{
    tableId,
    pagerId,
    searchId,
    findElemetsId,

    editFormId,
    saveBtnId,
    addBtnId,
    delBtnId,
    cleanBtnId,
    saveNewBtnId
};

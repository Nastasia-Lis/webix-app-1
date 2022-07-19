import {sidebarData,tableDataOne,tableDataFour} from './data/data.js';


//export function sidebar () {



    let selected = tableDataOne;
    let sidebarMenu = {
        view:"tree", 
        id: "sidebarMenu",
        data:sidebarData, 
        select: selected,
        width: 200,
        // on:{
        //     onAfterSelect: function(id){
        //         console.log(id);
        //         selected = id;
        //         console.log(typeof selected);
        //         $$("tableInfo").clearAll();
        //         $$("tableInfo").define("data", selected);
        //         $$("tableInfo").refresh();
        //     }
        // },

        // on:{
        //     onAfterSelect: function(id){
        //       $$("multiview").setValue(id);
        //     }
        // },
        //   ready:function () {
        //     let firstItem = this.getFirstId();
        //     this.select(firstItem);
        // }

        // on: {
        //     onSelectChange: function(){
        //         selected = $$("sidebarMenu").getSelectedId();
        //         if (isNaN(selected)) {
        //             $$("tableInfo").clearAll();
        //             $$("tableInfo").define("data", selected);
        //             $$("tableInfo").refresh();
        //         }
        //     }
        // }   
    };

export {
    sidebarMenu,
    selected
};
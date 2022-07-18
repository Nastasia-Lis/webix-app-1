import {sidebarData,tableDataOne,tableDataFour} from './data/data.js';

export function sidebar () {
    let selected = tableDataOne;
    return {
        view:"tree", 
        id: "sidebarMenu",
        data:sidebarData, 
        select: true,
        // on:{
        //     onAfterSelect: function(id){
        //       $$("multiview").setValue(id);
        //     }
        // },
        //   ready:function () {
        //     let firstItem = this.getFirstId();
        //     this.select(firstItem);
        // }

        on: {
            onSelectChange: function(){
                selected = $$("sidebarMenu").getSelectedId();
                if (isNaN(selected)) {
                    $$("myList").clearAll();
                    $$("myList").define("data", selected);
                    $$("myList").refresh();
                }
            }
        }   
    };
}
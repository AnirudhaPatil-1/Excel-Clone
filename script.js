const ps = new PerfectScrollbar("#cells",{
    wheelSpeed: 15,
    wheelPropagation: true,
});


for(let i = 1; i <= 100; i++){
    let str = "";
    let n = i;
    while(n > 0){
        let rem = n % 26;
        if(rem == 0){
            str = "Z" + str;
            n = Math.floor(n/26) - 1;
        }else{
            str = String.fromCharCode((rem -1 ) + 65) + str;
            n = Math.floor(n/26);
        }
    }
    $("#columns").append(`<div class="column-name">${str}</div>`)
    // console.log(str);
    $("#rows").append(`<div class="row-name">${i}</div>`);
}


for(let i = 1; i <= 100; i++){
    let row = $(`<div class="cell-row"></div>`);
    for(let j = 1; j <= 100; j++){
        row.append(`<div id="row-${i}-col-${j}" class="input-cell" contenteditable="false"></div>`);
    }
    $("#cells").append(row);
}

// $("#cells").scroll((e) => {
//     $("#columns").scrollLeft(this.scrollLeft);
//     $("#rows").scrollTop(this.scrollTop);
// })

$("#cells").scroll(function(e){
    $("#columns").scrollLeft(this.scrollLeft);
    $("#rows").scrollTop(this.scrollTop);
})

$(".input-cell").dblclick(function(e){
    $(".input-cell.selected").removeClass("selected top-selected bottom-selected left-selected right-selected");
    $(this).attr("contenteditable", "true");
    $(this).focus();
});

$(".input-cell").blur(function(e){
    $(this).attr("contenteditable","false");
});

function getRowCol(ele){
    let id = $(ele).attr("id");
    let idArray = id.split("-");
    let rowId = parseInt(idArray[1]);
    let colId = parseInt(idArray[3] );
    return [rowId, colId];
}

function getTopLeftBottomRightCell(rowId, colId){
    let topCell = $(`#row-${rowId - 1}-col-${colId}`);
    let bottomCell = $(`#row-${rowId + 1}-col-${colId}`);
    let leftCell = $(`#row-${rowId}-col-${colId - 1}`);
    let rightCell = $(`#row-${rowId}-col-${colId + 1}`);
    return [topCell, bottomCell, leftCell, rightCell];
}

$(".input-cell").click(function(e){
    let [rowId, colId] = getRowCol(this);
    let [topCell, bottomCell, leftCell, rightCell] = getTopLeftBottomRightCell(rowId, colId);
    if($(this).hasClass("selected") && e.ctrlKey){
        unselectCell(this, e, topCell, bottomCell, leftCell, rightCell);
    }else{
        selectCell(this, e, topCell, bottomCell, leftCell, rightCell);
    }
    // $(".input-cell.selected").removeClass("selected");
    // $(this).addClass("selected");

    
});

function unselectCell(ele, e, topCell, bottomCell, leftCell, rightCell){
    if($(ele).attr("contenteditable") == "false"){
        if($(ele).hasClass("top-selected")){
            topCell.removeClass("bottom-selected");
        }
    
        if($(ele).hasClass("bottom-selected")){
            bottomCell.removeClass("top-selected");
        }
    
        if($(ele).hasClass("left-selected")){
            leftCell.removeClass("right-selected");
        }
    
        if($(ele).hasClass("right-selected")){
            rightCell.removeClass("left-selected");
        }
    
        $(ele).removeClass("selected top-selected bottom-selected left-selected right-selected")
    }
    
}

function selectCell(ele, e, topCell, bottomCell, leftCell, rightCell){
    if(e.ctrlKey){
        //top selected or not
        let topSelected;
        if(topCell){
            topSelected = topCell.hasClass("selected");
        }

        //bottom selected or not
        let bottomSelected;
        if(bottomCell){
            bottomSelected = bottomCell.hasClass("selected");
        }

        //left selected or not
        let leftSelected;
        if(leftCell){
            leftSelected = leftCell.hasClass("selected");
        }

        //right selected or not
        let rightSelected;
        if(rightCell){
            rightSelected = rightCell.hasClass("selected");
        }

        if(topSelected){
            $(ele).addClass("top-selected");
            topCell.addClass("bottom-selected");
        }

        if(bottomSelected){
            $(ele).addClass("bottom-selected");
            bottomCell.addClass("top-selected")
        }

        if(rightSelected){
            $(ele).addClass("right-selected");
            rightCell.addClass("left-selected");
        }

        if(leftSelected){
            $(ele).addClass("left-selected");
            leftCell.addClass("right-selected");
        }
 
    }else{
        $(".input-cell.selected").removeClass("selected top-selected bottom-selected left-selected right-selected");
    }
    $(ele).addClass("selected");
}

//mouse move select multiple cells
let startcellSelected = false;
let startCell = {};
let endCell = {};
let mouseMoved = false;
$(".input-cell").mousemove(function(e){
    e.preventDefault();
    //e.button gives mouse click -> 0: no click, 1: left click, 2: right click
    if(e.button == 1){
        if(!startcellSelected){
            let [rowId, colId] = getRowCol(this);
            startCell = {"rowId": rowId, "colId": colId};
            startcellSelected = true;
            mouseMoved = true;
        }else{
            let [rowId, colId] = getRolCol(this);
            endCell = {"rowId": rowId, "colId": colId};
            selectAllBetweenCells(startCell, endCell);
        }
        // console.log(startCell, endCell);
    }else{
        startcellSelected = false;
        mouseMoved = false;
    }
})

function selectAllBetweenCells(start, end){
    for(let i = Math.min(start.rowId, end.rowId); i <= Math.max(start.rowId, end.rowId); i++){
        for(let j = Math.min(start.colId, end.colId); j <= Math.max(start.colId, end.colId); j++){
            let [topCell, bottomCell, leftCell, rightCell] = getTopLeftBottomRightCell(i, j);
            selectCell($(`#row-${i}-col-${j}`)[0], {"ctrlKey": true}, topCell, bottomCell, leftCell, rightCell);
        }
        
    }
}
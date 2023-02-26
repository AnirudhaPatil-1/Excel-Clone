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
    $(this).attr("contenteditable", "true");
    $(this).focus();
});

$(".input-cell").blur(function(e){
    $(this).attr("contenteditable","false");
});

$(".input-cell").click(function(e){
    // $(".input-cell.selected").removeClass("selected");
    // $(this).addClass("selected");
    selectedCell(this, e);
});

function selectedCell(ele, e, topCell, bottomCell, leftCell, rightCell){
    if(e.ctrlKey){
        let topSelected;
        if(topCell){
            topSelected = topCell.hasClass("selected");
        }

    }else{
        $(".input-cell.selected").removeClass("selected");
    }
    $(ele).addClass("selected");
}
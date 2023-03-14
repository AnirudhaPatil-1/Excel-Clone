const ps = new PerfectScrollbar("#cells", {
    wheelSpeed: 15,
});

for (let i = 1; i <= 100; i++) {
    let str = "";
    let n = i;

    while (n > 0) {
        let rem = n % 26;
        if (rem == 0) {
            str = "Z" + str;
            n = Math.floor(n / 26) - 1;
        } else {
            str = String.fromCharCode((rem - 1) + 65) + str;
            n = Math.floor(n / 26);
        }
    }
    $("#columns").append(`<div class="column-name">${str}</div>`)
    // console.log(str);
    $("#rows").append(`<div class="row-name">${i}</div>`);
}

let cellData = {
    "Sheet1": []
};

let selectedSheet = "Sheet1";
let totalSheets = 1;
let lastlyAddedSheet = 1;

let defaultProperties = {
    "font-family": "Noto Sans",
    "font-size": 14,
    "text": "",
    "bold": false,
    "italic": false,
    "underlined": false,
    "alignment": "left",
    "color": "#444",
    "bgcolor": "#fff"
};

for(let i = 1; i <= 100; i++){
    let row = $(`<div class="cell-row"></div>`);
    for(let j = 1; j <= 100; j++){
        row.append(`<div id="row-${i}-col-${j}" class"input-cell" contenteditable = "false"></div>`)
    }
    $("#cells").append(row);
}

$("#cells").scroll(function (e) {
    $("#columns").scrollLeft(this.scrollLeft);
    $("#rows").scrollTop(this.scrollTop);
});

$(".input-cell").dblclick(function(e){
    $("input-cell.selected").removeClass("selected top-selected bottom-selected left-selected right-selected");
    $(this).addClass("selected");
    $(this).attr("contenteditable", "true");
    $(this).focus();
});

$(".input-cell").blur(function (e) {
    $(this).attr("contenteditable", "false");
    updateCellData("text", $(this).text());
    
});

function getRowCol(ele) {
    let id = $(ele).attr("id");
    let idArray = id.split("-");
    let rowId = parseInt(idArray[1]);
    let colId = parseInt(idArray[3]);
    return [rowId, colId];
}

function getTopLeftBottomRightCell(rowId, colId) {
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
});

function unselectCell(ele, e, topCell, bottomCell, leftCell, rightCell) {
    if ($(ele).attr("contenteditable") == "false") {
        if ($(ele).hasClass("top-selected")) {
            topCell.removeClass("bottom-selected");
        }

        if ($(ele).hasClass("bottom-selected")) {
            bottomCell.removeClass("top-selected");
        }

        if ($(ele).hasClass("left-selected")) {
            leftCell.removeClass("right-selected");
        }

        if ($(ele).hasClass("right-selected")) {
            rightCell.removeClass("left-selected");
        }

        $(ele).removeClass("selected top-selected bottom-selected left-selected right-selected")
    }
};

function selectCell(ele, e, topCell, bottomCell, leftCell, rightCell) {
    if (e.ctrlKey) {
        //top selected or not
        let topSelected;
        if (topCell) {
            topSelected = topCell.hasClass("selected");
        }

        //bottom selected or not
        let bottomSelected;
        if (bottomCell) {
            bottomSelected = bottomCell.hasClass("selected");
        }

        //left selected or not
        let leftSelected;
        if (leftCell) {
            leftSelected = leftCell.hasClass("selected");
        }

        //right selected or not
        let rightSelected;
        if (rightCell) {
            rightSelected = rightCell.hasClass("selected");
        }

        if (topSelected) {
            $(ele).addClass("top-selected");
            topCell.addClass("bottom-selected");
        }

        if (bottomSelected) {
            $(ele).addClass("bottom-selected");
            bottomCell.addClass("top-selected")
        }

        if (rightSelected) {
            $(ele).addClass("right-selected");
            rightCell.addClass("left-selected");
        }

        if (leftSelected) {
            $(ele).addClass("left-selected");
            leftCell.addClass("right-selected");
        }

    } else {
        $(".input-cell.selected").removeClass("selected top-selected bottom-selected left-selected right-selected");
    }
    $(ele).addClass("selected");
    changeHeader(getRowCol(ele));
};

function changeHeader([rowId, colId]) {
    let data;
    if(cellData[selectedSheet][rowId - 1] && cellData[selectedSheet][rowId - 1][colId - 1]){
        data = cellData[selectedSheet][rowId - 1][colId - 1];
    }else{
        data = defaultProperties;
    }
    $(".alignment.selected").removeClass("selected");
    $(`.alignment[data-type=${data.alignment}]`).addClass("selected");
    addRemoveSelectFromFontStyle(data, "bold");
    addRemoveSelectFromFontStyle(data, "italic");
    addRemoveSelectFromFontStyle(data, "underlined");
    $("#fill-color").css("border-bottom", `4px solid ${data.bgcolor}`);
    $("#text-color").css("border-bottom",  `4px solid ${data.color}`);
    $("#font-family").val(data["font-family"]);
    $("#font-size").val(data["font-size"]);
    $("#font-family").css("font-family", data["font-family"]);
}

function addRemoveSelectFromFontStyle(data, property){
    if(data[property]){
        $(`#${property}`).addClass("selected");
    }else{
        $(`#${property}`).removeClass("selected");
    }
}

//mouse move select multiple cells
let count = 0;
let startcellSelected = false;
let startCell = {};
let endCell = {};
let mouseMoved = false;
let scrollXRStarted = false;
let scrollXLStarted = false; 



function loadNewSheet(){
    $("#cells").text("");
    for (let i = 1; i <= 100; i++) {
        let row = $(`<div class="cell-row"></div>`);
        let rowArray = [];
        for (let j = 1; j <= 100; j++) {
            row.append(`<div id="row-${i}-col-${j}" class="input-cell" contenteditable="false"></div>`);
            rowArray.push({
                "font-family": "Noto Sans",
                "font-size": 14,
                "text": "",
                "bold": false,
                "italic": false,
                "underlined": false,
                "alignment": "left",
                "color": "",
                "bgcolor": ""
            })
        }
        cellData[selectedSheet].push(rowArray);
        $("#cells").append(row);
    }
    addEventsToCells();
}

loadNewSheet();

function addEventsToCells(){

    $(".input-cell").click(function (e) {
        let [rowId, colId] = getRowCol(this);
        let [topCell, bottomCell, leftCell, rightCell] = getTopLeftBottomRightCell(rowId, colId);
        if ($(this).hasClass("selected") && e.ctrlKey) {
            unselectCell(this, e, topCell, bottomCell, leftCell, rightCell);
        } else {
            selectCell(this, e, topCell, bottomCell, leftCell, rightCell);
        } 
    });

    $(".input-cell").mousemove(function (e) {
        e.preventDefault();
        //e.button gives mouse click -> 0: no click, 1: left click, 2: right click
        if (e.buttons == 1) {
            if (e.pageX > ($(window).width() - 10) && !scrollXRStarted) {
                // $("#cells").scrollLeft($("#cells").scrollLeft() + 100);
                scrollXR();
            } else if (e.pageX < 10 && !scrollXLStarted) {
                scrollXL();
            }
            if (!startcellSelected) {
                let [rowId, colId] = getRowCol(this);
                startCell = { "rowId": rowId, "colId": colId };
                startcellSelected = true;
                mouseMoved = true;
            }
        } else {
            startcellSelected = false;
            mouseMoved = false;
        }
    });
}












//mouse move, mouse up, mouse down & mouseenter
$(".input-cell").mouseenter(function (e) {
    if (e.buttons == 1) {
        if (e.pageX < ($(windows).width() - 10) && scrollXRStarted) {
            clearInterval(scrollXRInterval);
            scrollXRStarted = false;
        }

        if (e.pageX > 10 && scrollXLstarted) {
            clearInterval(scrollXLInterval);
            scrollXLStarted = false;
        }
        let [rowId, colId] = getRowCol(this);
        endCell = { "rowId": rowId, "colId": colId };
        selectAllBetweenCells(startCell, endCell);
    }
})

function selectAllBetweenCells(start, end) {
    for (let i = Math.min(start.rowId, end.rowId); i <= Math.max(start.rowId, end.rowId); i++) {
        for (let j = Math.min(start.colId, end.colId); j <= Math.max(start.colId, end.colId); j++) {
            let [topCell, bottomCell, leftCell, rightCell] = getTopLeftBottomRightCell(i, j);
            selectCell($(`#row-${i}-col-${j}`)[0], { "ctrlKey": true }, topCell, bottomCell, leftCell, rightCell);
        }
    }
}

let scrollXRInterval;
let scrollXLInterval;
function scrollXR() {
    scrollXRStarted = true;
    let scrollXRInterval = setInterval(() => {
        $("#cells").scrollLeft($("#cells").scrollLeft() + 100);
    }, 100);
}

function scrollXL() {
    scrollXLStarted = true;
    let scrollXLInterval = setInterval(() => {
        $("#cells").scrollLeft($("#cells").scrollLeft() - 100);
    }, 100)
}

$(".data-container").mousemove(function (e) {
    e.preventDefault();
    if (e.buttons == 1) {
        if (e.pageX > ($(window).width() - 10) && !scrollXRStarted) {
            // $("#cells").scrollLeft($("#cells").scrollLeft() + 100);
            scrollXR();
        } else if (e.pageX < (10) && !scrollXLStarted) {
            scrollXL();
        }
    }
})

$(".data-container").mouseup(function (e) {
    clearInterval(scrollXRInterval);
    clearInterval(scrollXLInterval);
    scrollXRStarted = false;
    scrollXLStarted = false;
});

$(".alignment").click(function (e) {
    let alignment = $(this).attr("data-type");
    $(".alignment.selected").removeClass("selected");
    $(this).addClass("selected");
    $(".input-cell.selected").css("text-align", alignment);
    $(".input-cell.selected").each(function (index, data) {
        let [rowId, colId] = getRowCol(data);
        cellData[selectedSheet][rowId - 1][colId - 1].alignment = alignment;
    })
})


$("#bold").click(function(e){
    setStyle(this, "bold", "font-weight", "bold");
});

$("#italic").click(function(e){
    setStyle(this, "italic", "font-style", "italic");
});

$("#underlined").click(function(e){
    setStyle(this, "underlined", "text-decoration", "underline");
})

function setStyle(ele, property, key, value){
    if($(ele).hasClass("selected")){
        $(ele).removeClass("selected");
        $(".input-cell.selected").css(key, "");
        $("input-cell.selected").each(function(index, data){
            let [rowId, colId] = getRowCol(data);
            cellData[selectedSheet][rowId - 1][colId - 1][property] = false;
        })
    }else{
        $(ele).addClass("selected");
        $(".input-cell.selected").css(key, value);
        $(".input-cell.selected").each(function(index, data){
            let [rowId, colId] = getRowCol(data);
            cellData[selectedSheet][rowId - 1][colId - 1][property] = true;
        });
    }
}

$(".pick-color").colorPick();

$(".pick-color").colorPick({
    'initialColor': '#abcd',
    'allowRecent': true,
    'recentMax': 5,
    'allowCustomColor': false,
    'palette': ["#1abc9c", "#16a085", "#2ecc71", "#27ae60", "#3498db", "#2980b9", "#9b59b6", "#8e44ad", "#34495e", "#2c3e50", "#f1c40f", "#f39c12", "#e67e22", "#d35400", "#e74c3c", "#c0392b", "#ecf0f1", "#bdc3c7", "#95a5a6", "#7f8c8d"],
    'onColorSelected': function() {
        if(this.color !="#abcd"){
            if($(this.element.children()[1]).attr("id") == "fill-color"){
                $(".input-cell.selected").css("background-color", this.color);
                $("#fill-color").css("border-bottom",`4px solid ${this.color}`);
            }
            if($(this.element.children()[1]).attr("id") == "text-color"){
                $(".input-cell.selected").css("color",this.color);
                $("#text-color").css("border-bottom", `4px solid ${this.color}`);
            }
        }
    //   this.element.css({'backgroundColor': this.color, 'color': this.color});
    }
  });

$("#fill-color").click(function(e){
    setTimeout(()=>{
        $(this).parent().click();
    }, 10)
    
})

$("#text-color").click(function(e){
    setTimeout(() => {
        $(this).parent().click();
    }, 10)
})




$(".container").click(function(e){
    $(".sheet-options-modal").remove();
})

// $(".sheet-tab").blur(function(e){
//     $(".sheet-tab").attr("contenteditable", "false");
// })



function selectSheet(ele){
    $(".sheet-tab.selected").removeClass("selected");
    $(ele).addClass("selected");
    selectedSheet = $(ele).text();
    loadSheet();
};

function loadSheet(){
    $("#cells").text("");
    let data = cellData[selectedSheet];
    for(let i = 1; i <= data.length; i++){
        let row = $(`<div class="cell-row"></div>`);
        for(let j = 1; j <= data[i - 1].length; j++){
            let cell = $(`<div id="row-${i}-col-${j}" class="input-cell" contenteditable="false">${data[i - 1][j - 1].text}</div>`);
            cell.css({
                "font-family": data[i - 1][j - 1]["font-family"],
                "font-size": data[i - 1][j - 1]["font-size"] + "px",
                "background-color": data[i - 1][j - 1]["bgcolor"],
                "color": data[i - 1][j - 1].color,
                "font-weight": data[i - 1][j - 1].bold ? "bold": "",
                "font-style": data[i - 1][j - 1].italic? "italic": "",
                "text-decoration": data[i - 1][j - 1].underlined ? "underlined": "",
                "text-align": data[i - 1][j - 1].alignment
            })
            row.append(cell);
        }
        $("#cells").append(row);
    }
    addEventsToCells();
}

$(".add-sheet").click(function(e){
    totalSheets++;
    cellData[`Sheet${totalSheets}`] = [];
    selectedSheet = `Sheet${totalSheets}`;
    loadNewSheet();
    $(".sheet-tab.selected").removeClass("selected");
    $(".sheet-tab-container").append(
        `<div class="sheet-tab selected">Sheet${totalSheets}</div>`
    );

    $(".sheet-tab").off("bind", "click");

    $(".sheet-tab").bind("contextmenu", function(e){
        e.preventDefault();
        selectSheet(this);
        $(".sheet-options-modal").remove();
        let modal = (`<div class="sheet-options-modal">
                        <div class="option sheet-rename">Rename</div>
                        <div class="option sheet-delete">Delete</div>
                    </div>`);
        $(".container").append(modal);
        $(".sheet-options-modal").css({"bottom": 0.04 * $(window).height(), "left": e.pageX});  
        $(".sheet-rename").click(function(e){
            $(".sheet-tab.selected").attr("contenteditable", "true");
            $(".sheet-tab.selected").focus();
        })
    });

    $(".sheet-tab").click(function(e){
        if(!$(this).hasClass("selected")){
            selectSheet(this);
        }
    });
})

$(".menu-selector").change(function(e) {
    let value = $(this).val();
    let key = $(this).attr("id");
    if(key == "font-family") {
        $("#font-family").css(key,value);
    }
    if(!isNaN(value)) {
        value = parseInt(value);
    }

    $(".input-cell.selected").css(key,value);
    $(".input-cell.selected").each((index,data) => {
        let [rowId,colId] = getRowCol(data);
        cellData[rowId-1][colId -1][key] = value;
    })
})
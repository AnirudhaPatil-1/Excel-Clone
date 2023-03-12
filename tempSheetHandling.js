let activeSheetColor = "#ced6e0";
let sheetFolderCont = document.querySelector(".sheet-folder-cont");
let addSheetBtn = document.querySelector(".sheet-add-icon");
addSheetBtn.addEventListener("click", (e) => {
    let sheet = document.createElement("div");
    sheet.setAttribute("class", "sheet-folder");

    let allSheetFolders = document.querySelectorAll(".sheet-folder");
    sheet.setAttribute("id", allSheetFolders.length );

    sheet.innerHTML = `
        <div class="sheet-content">Sheet ${allSheetFolders.length + 1}</div>
    `;

    sheetsFolderCont.appendChild(sheet);
    createSheetDB();
    createGraphComponentMatrix();
    handleSheetActiveness(sheet);
    handleSheetRemoval(sheet);
    sheet.click();
});

function handleSheetRemoval(sheet){
    sheet.addEventListener("mousedown", (e){
        if(e.button !== 2) return;

        let allSheetFolders = document.querySelectorAll(".sheet-folder");
        if(allSheetFolders ===  1) {
            alert("You need to hav atleast one sheet!");
            return;
        }
        let response = confirm("Your sheet will be removed permanently, Are you sure?");
        if(response == false) return;
        let sheetIdx = Number(sheet.getAttribute("id"));

        //DB
        collectedSheetDB.splice(sheetIdx, 1);
        collectedGraphComponent.splice(sheetIdx, 1);
        //UI
        handleSheetRemoval(sheet);

        //by default DB to sheet 1 (active)
        sheetDB = collectedSheetDB[0];
        graphComponentMatrix = collectedGraphComponent[0];
        handleSheetProperties();
    })
} 

function handleSheetRemoval(sheet){
    //UI
    sheet.remove();
    let allSheetFolders = document.querySelectorAll(".sheet-folder");
    for(let i = 0; i < allSheetFolders.length; i++){
        allSheetFolders[i].setAttribute("idx", i);
        let sheetContent = allSheetFolders[i].querySelector(".sheet-content");
        sheetContent.innerText = `Sheet ${i + 1}`;
        allSheetFolders[i].style.backgroundColor = "transparent";
    }
    allSheetFolders[0].style.backgroundColor = activeSheetColor;
}

function handleSheetDB(sheetIdx){
    sheetDB = collectedSheetDB[sheetIdx];
    graphComponentMatrix = collectedGraphComponent[sheetIdx];
}

function handleSheetProperties(){
        
}

function handleSheetActiveness(sheet){
    sheet.addEventListener("click", (e) => {
        let sheetIdx = Number(sheet.getAttribute("id"));
        handleSheetDB(sheetIdx);
        handleSheetProperties();
    })
}

function createSheetDB(){
    let sheetDB = [];
    for(let i = 0; i < rows; i++){
        let sheetRow = [];
        for(let j = 0; j < close; j++){
            let cellProp = {
                bold: false,
                italic: false,
                underline: false,
                alignment: "left",
                fontFamily: "monospace",
                fontSize: "14",
                fontColor: "#000000",
                BGcolor: "#000000", //just for indication
                value: "",
                formula: "",
                children: []
            }
            sheetRow.push(cellProp);
        }
        sheet.push(sheetRow);
    }
    collectedSheetDB.push(sheetDB);
}

function createGraphComponentMatrix(){
    let graphComponentMatrix = [];
    for(let i = 0; i < rows; i++){
        let row = [];
        for(let j = 0; j < cols; j++){
            //why array -> more than 1 child relation(dependent)
            row.push([]);
        }
        graphComponentMatrix.push(row);
    }
    collectedGraphComponent.push(graphComponentMatrix);
}
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




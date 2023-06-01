/* MAIN */

window.addEventListener("load", function(event) {
    flagSetup();
    imageSetup();
});

/* FLAGS */

// Flag variables
let flagName, flagSelected = [];

// Flag selection event
function flagSelect(event) {
    let flag = event.target;
    
    // Insert / remove flag
    let flagIndex = flagSelected.indexOf(flag);
    if (flagIndex > -1) { flagSelected.splice(flagIndex, 1); }
    else { flagSelected.push(flag); }

    // Toggle flag
    flag.classList.toggle("flag-selected");

    // Redraw image
    imageDraw();
}

// Flag hover event
function flagOver(event) {
    flagName.innerText = event.target.dataset.name;
}
// Flag setup: Add events to flags
function flagSetup() {
    console.log("[FLAGS] Setting up flags...");

    let flags = document.getElementsByClassName("flag");
    flagName = document.getElementById("flag-name");
    for (let flag of flags) {
        flag.addEventListener("click", flagSelect);
        flag.addEventListener("mouseover", flagOver);
    }
}

/* IMAGE */

// Canvas variables
let canvas, ctx;

// Avatar
let imgAvatar = new Image();
imgAvatar.crossOrigin = "anonymous";
imgAvatar.addEventListener("load", function(event) {
    // Redraw image
    imageDraw();
});

// Image Setup: Get canvas ready
function imageSetup() {
    console.log("[IMAGE] Getting image canvas...");

    canvas = document.getElementById("avatar");
    canvas.width = 1280;
    canvas.height = 1280;
    ctx = canvas.getContext("2d");
    imgAvatar.src = "./assets/images/avatar.png";
}

// Draw image
function imageDraw() {
    ctx.save(); 

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw flags
    ctx.imageSmoothingEnabled = false;
    let flagWidth = canvas.width / flagSelected.length;
    flagSelected.forEach(function(flag, i) { 
        ctx.drawImage(flag, flagWidth * i, 0, flagWidth, canvas.height);
    });

    // Mask out circle
    ctx.beginPath(); 
    ctx.arc(canvas.width * 0.5, canvas.height * 0.5, canvas.width * 0.45, 0, 2 * Math.PI); 
    ctx.clip();

    // Draw avatar
    ctx.imageSmoothingEnabled = true;
    var aviW, aviH, aviX, aviY;
	if (imgAvatar.height > imgAvatar.width) { 
        aviW = canvas.width;
        aviH = imgAvatar.height * (aviW / imgAvatar.width); 
        aviX = 0; 
        aviY = (canvas.height - aviH) * 0.5; 
    } else { 
        aviH = canvas.height;
        aviW = imgAvatar.width * (aviH/imgAvatar.height);
        aviY = 0;
        aviX = (canvas.width - aviW) * 0.5;
    }
	ctx.drawImage(imgAvatar, aviX, aviY, aviW, aviH);

    ctx.restore();
    console.log("[IMAGE] Image drawn.");
}

/* FILES */

// Upload file
function fileUpload(e) {
    let input = document.createElement("input");
    input.type = "file";
    input.onchange = function() {
        fileLoad(input.files[0]);
    };
    input.click();
    input.remove();
    console.log("[FILE] Uploading file...");
}

// Load file
function fileLoad(file) {
    console.log("[FILE] Loading file...");
    let reader = new FileReader();
    reader.addEventListener("load", function(event) {
        imgAvatar.src = event.target.result;
    });
    reader.readAsDataURL(file);
}

// Save file
function fileSave() {
    let a = document.createElement("a");
    a.download = "image.png";
    a.href = canvas.toDataURL("image/png");
    a.click();
    a.remove();
    console.log("[FILE] Saving file...");
}
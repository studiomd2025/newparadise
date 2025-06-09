document.addEventListener("DOMContentLoaded", function () { 
    const photoStrip = document.querySelector(".photo-strip");
    const blueFrameBtn = document.getElementById("blueFrame");
    const creamFrameBtn = document.getElementById("creamFrame");
    const pinkFrameBtn = document.getElementById("pinkFrame");
    const noFilterBtn = document.getElementById("noFilter");
    const bwFilterBtn = document.getElementById("bwFilter");
    const vintageFilterBtn = document.getElementById("vintageFilter");
    const vividFilterBtn = document.getElementById("vividFilter");
    const warmFilterBtn = document.getElementById("warmFilter");
    const coolFilterBtn = document.getElementById("coolFilter");
    const downloadBtn = document.getElementById("downloadBtn");
    const retakeBtn = document.getElementById("retakeBtn");
    const canvas = document.getElementById("photoCanvas");
    const ctx = canvas.getContext("2d");

    if (!photoStrip) {
        console.error("Photo strip element not found!");
        return;
    }

    // Retrieve photos from sessionStorage
    const storedPhotos = JSON.parse(sessionStorage.getItem("photos")) || [];
    if (storedPhotos.length === 0) {
        console.error("No photos found in sessionStorage!");
        return;
    }

    // Set up canvas dimensions to match frame size
	const canvasWidth = 500;
	const canvasHeight = 1500;
	canvas.width = canvasWidth;
	canvas.height = canvasHeight;

    const photoWidth = 450;
    const photoHeight = 320;
    const photoSpacing = 20;

    const totalPhotoHeight = storedPhotos.length * (photoHeight + photoSpacing);
    const topMargin = (canvasHeight - totalPhotoHeight) / 2.5;

    let currentFrame = "blue.png"; 
    let selectedFilter = "none";

    function applyFilter(filter) {
        if (filter === "bw") return "grayscale(100%) contrast(1) brightness(1.1)";
        if (filter === "vintage") return "sepia(50%) saturate(1) contrast(1) brightness(1)";
        if (filter === "vivid") return "saturate(1) contrast(1.3) brightness(1)";
        if (filter === "warm") return "sepia(30%) brightness(1.1) contrast(1.1)";
        if (filter === "cool") return "sepia(10%) saturate(1) brightness(1.1) contrast(1.1)";
        return "none";
    }

    function drawPhotoStrip() {
        const frameImg = new Image();
        frameImg.src = currentFrame;

        frameImg.onload = function () {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // ✅ Draw the frame FIRST
            ctx.drawImage(frameImg, 0, 0, canvas.width, canvas.height);

            let imagesLoaded = 0;

            storedPhotos.forEach((photoSrc, index) => {
                const img = new Image();
                img.src = photoSrc;

                img.onload = () => {
                    ctx.filter = applyFilter(selectedFilter);
                    ctx.drawImage(
                        img,
                        (canvas.width - photoWidth) / 2, 
                        topMargin + index * (photoHeight + photoSpacing), 
                        photoWidth, 
                        photoHeight
                    );

                    imagesLoaded++;

                    if (imagesLoaded === storedPhotos.length) {
                        ctx.filter = "none";

                        // ✅ Draw date text AFTER everything is drawn
                        const now = new Date();
                        const formattedDate = `${now.getFullYear()}.${now.getMonth() + 1}.${now.getDate()}`;
                        ctx.font = "15px Arial";
                        ctx.fillStyle = "#d7c3c4";
                        ctx.textAlign = "center";
                        ctx.fillText(formattedDate, canvas.width / 2, canvas.height - 15);
                    }
                };
            });
        };
    }

    drawPhotoStrip(); // ✅ Call on page load

    // Frame selection
    blueFrameBtn.addEventListener("click", function () {
        currentFrame = "blue.png";
        drawPhotoStrip();
    });

    creamFrameBtn.addEventListener("click", function () {
        currentFrame = "cream.png";
        drawPhotoStrip();
    });

    pinkFrameBtn.addEventListener("click", function () {
        currentFrame = "pink.png";
        drawPhotoStrip();
    });

    // Filter selection
    noFilterBtn.addEventListener("click", function () {
        selectedFilter = "none";
        drawPhotoStrip();
    });

    bwFilterBtn.addEventListener("click", function () {
        selectedFilter = "bw";
        drawPhotoStrip();
    });

    vintageFilterBtn.addEventListener("click", function () {
        selectedFilter = "vintage";
        drawPhotoStrip();
    });

    vividFilterBtn.addEventListener("click", function () {
        selectedFilter = "vivid";
        drawPhotoStrip();
    });

    warmFilterBtn.addEventListener("click", function () {
        selectedFilter = "warm";
        drawPhotoStrip();
    });

    coolFilterBtn.addEventListener("click", function () {
        selectedFilter = "cool";
        drawPhotoStrip();
    });

    // Download function
    downloadBtn.addEventListener("click", function () {
        const link = document.createElement("a");
        link.href = canvas.toDataURL("image/png");
        link.download = "allindan_with_lia.png";
        link.click();
    });

    // Retake function
    retakeBtn.addEventListener("click", function () {
        sessionStorage.removeItem("photos"); 
        window.location.href = "index.html";
    });

});
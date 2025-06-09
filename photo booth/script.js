const video = document.getElementById("video");
const captureBtn = document.getElementById("captureBtn");
const countdown = document.getElementById("countdown");
const photoPreviews = document.getElementById("photoPreviews");

let capturedPhotos = [];

// Start the webcam
navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
  video.srcObject = stream;
  video.style.transform = "scaleX(-1)";
}).catch(error => {
  console.error("Webcam error:", error);
});

// Handle capture button click
captureBtn.addEventListener("click", async () => {
  capturedPhotos = [];

  for (let i = 0; i < 4; i++) {
    await showCountdown(3);
    capturePhoto();
  }

  setTimeout(() => redirectToResultPage(), 1000);
});

// Countdown animation
async function showCountdown(seconds) {
  for (let i = seconds; i > 0; i--) {
    countdown.textContent = i;
    countdown.style.display = "block";
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  countdown.style.display = "none";
}

// Capture snapshot
function capturePhoto() {
  const canvas = document.createElement("canvas");
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  const ctx = canvas.getContext("2d");

  // Flip the image
  ctx.translate(canvas.width, 0);
  ctx.scale(-1, 1);
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

  const img = new Image();
  img.src = canvas.toDataURL("image/png");
  img.classList.add("photo-preview");

  // Display
  if (window.innerWidth <= 768) {
    photoPreviews.style.flexDirection = "row";
    img.style.width = "100px";
  }

  photoPreviews.appendChild(img);
  capturedPhotos.push(img.src);
}

// Redirect
function redirectToResultPage() {
  if (capturedPhotos.length === 4) {
    sessionStorage.setItem("photos", JSON.stringify(capturedPhotos));
    window.location.href = "result.html";
  } else {
    console.error("Not enough photos!");
  }
}
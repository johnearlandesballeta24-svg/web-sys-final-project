let codeReader = null;

// convert 24hr to 12hr
function formatTime(timeStr) {
  const [hours, minutes, seconds] = timeStr.split(":");
  const h = parseInt(hours);
  const ampm = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 || 12;
  return h12 + ":" + minutes + " " + ampm;
}

// Clock
function updateClock() {
  const now = new Date();
  document.getElementById("currentTime").textContent =
    now.toLocaleDateString() + " • " + now.toLocaleTimeString();
}
setInterval(updateClock, 1000);
updateClock();

// Start ZXing scanner
async function startScanner() {
  const hints = new Map();
  hints.set(ZXing.DecodeHintType.TRY_HARDER, true);

  codeReader = new ZXing.BrowserMultiFormatReader(hints);

  try {
    await codeReader.decodeFromConstraints(
      {
        video: {
          facingMode: "environment",
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
      },
      "reader",
      async (result, err) => {
        if (result) {
          console.log("SCANNED:", result.getText());
          await codeReader.reset();
          await onScanSuccess(result.getText());
        }
      },
    );
  } catch (err) {
    console.error("Camera error:", err);
  }
}

// Called when QR is read
async function onScanSuccess(qrText) {
  console.log("Scanned:", qrText);

  // Show scanning state first
  document.getElementById("scannerView").style.display = "none";
  document.getElementById("resultView").style.display = "flex";
  document.getElementById("resultIcon").innerHTML =
    '<div class="scanning-spinner"></div>';
  document.getElementById("resultName").textContent = "Scanning...";
  document.getElementById("resultAction").textContent = "Please wait";
  document.getElementById("resultTime").textContent = "";

  // Wait 1.5 seconds then hit the server
  await new Promise((resolve) => setTimeout(resolve, 1500));

  try {
    const res = await fetch("api/scan_attendance.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ scanned_id: qrText }),
    });
    const data = await res.json();

    if (data.success) {
      document.getElementById("resultIcon").innerHTML =
        '<i class="bi bi-check-circle-fill result-success"></i>';
      document.getElementById("resultName").textContent = data.name;
      document.getElementById("resultAction").textContent = data.action;
      document.getElementById("resultTime").textContent =
        "Time: " + formatTime(data.time);
    } else {
      document.getElementById("resultIcon").innerHTML =
        '<i class="bi bi-x-circle-fill result-error"></i>';
      document.getElementById("resultName").textContent = "Error";
      document.getElementById("resultAction").textContent = data.message;
      document.getElementById("resultTime").textContent = "";
    }

    setTimeout(resetScanner, 4000);
  } catch (err) {
    console.error("Server error:", err);
  }
}

// Manual input
async function manualScan() {
  const id = document.getElementById("manualId").value.trim();
  if (!id) return;
  if (codeReader) await codeReader.reset();
  await onScanSuccess(id);
}

document.getElementById("manualId").addEventListener("keydown", function (e) {
  if (e.key === "Enter") manualScan();
});

// Reset
async function resetScanner() {
  document.getElementById("resultView").style.display = "none";
  document.getElementById("scannerView").style.display = "flex";
  document.getElementById("manualId").value = "";
  await startScanner();
}

// // also make sure reader is a video element for ZXing
// document.getElementById("reader").innerHTML =
//   '<video id="readerVideo" style="width:100%; border-radius:12px;"></video>';

startScanner();

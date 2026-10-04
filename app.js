document.addEventListener("DOMContentLoaded", () => {
    const tiktokUrlInput = document.getElementById("tiktokUrl");
    const pasteBtn = document.getElementById("pasteBtn");
    const downloadBtn = document.getElementById("downloadBtn");
    const loadingDiv = document.getElementById("loading");
    const resultContainer = document.getElementById("resultContainer");
    
    const videoThumbnail = document.getElementById("videoThumbnail");
    const videoTitle = document.getElementById("videoTitle");
    const statViews = document.getElementById("statViews");
    const statLikes = document.getElementById("statLikes");
    const downloadNoWatermark = document.getElementById("downloadNoWatermark");
    const downloadAudio = document.getElementById("downloadAudio");
    
    const captionText = document.getElementById("captionText");
    const subtitleText = document.getElementById("subtitleText");
    const copyCaptionBtn = document.getElementById("copyCaptionBtn");
    const copySubtitleBtn = document.getElementById("copySubtitleBtn");

    // Tombol Paste otomatis
    pasteBtn.addEventListener("click", async () => {
        try {
            const text = await navigator.clipboard.readText();
            tiktokUrlInput.value = text;
        } catch (err) {
            alert("Gagal membaca clipboard. Silakan tempel secara manual.");
        }
    });

    // Validasi URL TikTok
    function isValidTikTokUrl(url) {
        const tiktokRegex = /(https?:\/\/)?(www\.)?(tiktok\.com|m\.tiktok\.com|vt\.tiktok\.com)\/.+/;
        return tiktokRegex.test(url);
    }

    // Tombol Proses
    downloadBtn.addEventListener("click", async () => {
        const url = tiktokUrlInput.value.trim();

        if (!url) {
            alert("Mohon masukkan tautan video TikTok terlebih dahulu!");
            return;
        }

        if (!isValidTikTokUrl(url)) {
            alert("Tautan yang Anda masukkan tidak valid!");
            return;
        }

        loadingDiv.classList.remove("hidden");
        resultContainer.classList.add("hidden");

        try {
            // Menggunakan jalur API fromscratch seperti pada referensi yang Anda inginkan
            const targetApi = `https://api.fromscratch.web.id/v1/api/down/tiktok?url=${encodeURIComponent(url)}`;
            const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(targetApi)}`;
            
            const response = await fetch(proxyUrl);
            const resJson = await response.json();

            if (resJson.status === 200 && resJson.data) {
                const data = resJson.data;

                // Memasukkan hasil data sesuai struktur JSON dari API tersebut
                videoThumbnail.src = data.cover || data.origin_cover || "";
                videoTitle.textContent = data.title || "Video TikTok Tanpa Watermark";
                statViews.textContent = "129"; 
                statLikes.textContent = "4";   

                // Link Download Video Tanpa Watermark & Audio
                downloadNoWatermark.href = data.no_watermark || data.watermark || "#"; 
                downloadAudio.href = data.music || "#";       

                // Caption & Hashtag
                captionText.value = data.title || "Tidak ada caption.";
                subtitleText.value = "Subtitle otomatis tidak tersedia dari endpoint ini.";

                loadingDiv.classList.add("hidden");
                resultContainer.classList.remove("hidden");
            } else {
                throw new Error("Gagal mengambil data dari server API.");
            }

        } catch (error) {
            console.error(error);
            loadingDiv.classList.add("hidden");
            alert("Gagal memproses video. Pastikan link aktif dan publik.");
        }
    });

    // Fitur Salin Teks
    copyCaptionBtn.addEventListener("click", () => {
        if (!captionText.value) return;
        navigator.clipboard.writeText(captionText.value);
        copyCaptionBtn.innerHTML = '<i class="fa-solid fa-check"></i> Tersalin!';
        setTimeout(() => {
            copyCaptionBtn.innerHTML = '<i class="fa-solid fa-copy"></i> Salin Teks';
        }, 2000);
    });

    copySubtitleBtn.addEventListener("click", () => {
        if (!subtitleText.value) return;
        navigator.clipboard.writeText(subtitleText.value);
        copySubtitleBtn.innerHTML = '<i class="fa-solid fa-check"></i> Tersalin!';
        setTimeout(() => {
            copySubtitleBtn.innerHTML = '<i class="fa-solid fa-copy"></i> Salin Subtitle';
        }, 2000);
    });
});

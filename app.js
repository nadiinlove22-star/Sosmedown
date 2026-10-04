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

    // Tombol Paste otomatis dari clipboard
    pasteBtn.addEventListener("click", async () => {
        try {
            const text = await navigator.clipboard.readText();
            tiktokUrlInput.value = text;
        } catch (err) {
            alert("Gagal membaca clipboard. Silakan tempel secara manual.");
        }
    });

    // Validasi format link TikTok
    function isValidTikTokUrl(url) {
        const tiktokRegex = /(https?:\/\/)?(www\.)?(tiktok\.com|m\.tiktok\.com|vt\.tiktok\.com)\/.+/;
        return tiktokRegex.test(url);
    }

    // Eksekusi Tombol Proses
    downloadBtn.addEventListener("click", async () => {
        const url = tiktokUrlInput.value.trim();

        if (!url) {
            alert("Mohon masukkan tautan video TikTok terlebih dahulu!");
            return;
        }

        if (!isValidTikTokUrl(url)) {
            alert("Tautan yang Anda masukkan tidak valid! Pastikan itu adalah tautan resmi dari TikTok.");
            return;
        }

        loadingDiv.classList.remove("hidden");
        resultContainer.classList.add("hidden");

        try {
            // Menggunakan endpoint API publik alternatif yang mendukung CORS langsung
            const apiEndpoint = `https://tdownv4.sl-bjs.workers.dev/?down=${encodeURIComponent(url)}`;
            
            const response = await fetch(apiEndpoint);
            const resJson = await response.json();

            // Memastikan data berhasil ditarik dari API
            if (resJson && (resJson.data || resJson.video || resJson.nowm)) {
                // Menyesuaikan struktur data dari worker publik
                const data = resJson.data || resJson;

                videoThumbnail.src = data.cover || data.thumbnail || data.origin_cover || "";
                videoTitle.textContent = data.title || data.desc || "Video TikTok Tanpa Watermark";
                statViews.textContent = data.play_count || data.views || 0;
                statLikes.textContent = data.digg_count || data.likes || 0;

                // Set link download video & audio
                downloadNoWatermark.href = data.nowm || data.hdplay || data.play || "#"; 
                downloadAudio.href = data.music || data.audio || "#";       

                // Set caption dan hashtag
                captionText.value = data.title || data.desc || "Tidak ada caption.";

                // Set subtitle jika tersedia
                if (data.subtitle) {
                    subtitleText.value = data.subtitle;
                } else {
                    subtitleText.value = "Subtitle/transkrip otomatis tidak tersedia untuk video ini.";
                }

                loadingDiv.classList.add("hidden");
                resultContainer.classList.remove("hidden");
            } else {
                throw new Error("Format data API tidak valid.");
            }

        } catch (error) {
            console.error(error);
            loadingDiv.classList.add("hidden");
            alert("Gagal memproses video. Pastikan link TikTok bersifat publik dan aktif.");
        }
    });

    // Fungsi Salin Caption
    copyCaptionBtn.addEventListener("click", () => {
        if (!captionText.value) return;
        navigator.clipboard.writeText(captionText.value);
        copyCaptionBtn.innerHTML = '<i class="fa-solid fa-check"></i> Tersalin!';
        setTimeout(() => {
            copyCaptionBtn.innerHTML = '<i class="fa-solid fa-copy"></i> Salin Teks';
        }, 2000);
    });

    // Fungsi Salin Subtitle
    copySubtitleBtn.addEventListener("click", () => {
        if (!subtitleText.value) return;
        navigator.clipboard.writeText(subtitleText.value);
        copySubtitleBtn.innerHTML = '<i class="fa-solid fa-check"></i> Tersalin!';
        setTimeout(() => {
            copySubtitleBtn.innerHTML = '<i class="fa-solid fa-copy"></i> Salin Subtitle';
        }, 2000);
    });
});

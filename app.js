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
            // Menggunakan CORS proxy publik agar bisa diakses dari GitHub Pages tanpa terblokir
            const targetUrl = `https://tikwm.com/api/?url=${encodeURIComponent(url)}&hd=1`;
            const proxyEndpoint = `https://api.allorigins.win/get?url=${encodeURIComponent(targetUrl)}`;
            
            const response = await fetch(proxyEndpoint);
            const proxyJson = await response.json();
            
            if (!proxyJson.contents) {
                throw new Error("Gagal terhubung ke server data.");
            }

            const resJson = JSON.parse(proxyJson.contents);

            if (resJson.code === 0 && resJson.data) {
                const data = resJson.data;

                // Masukkan data ke elemen UI
                videoThumbnail.src = data.cover || data.origin_cover;
                videoTitle.textContent = data.title || "Video TikTok Tanpa Watermark";
                statViews.textContent = data.play_count || 0;
                statLikes.textContent = data.digg_count || 0;

                // Set link download langsung
                downloadNoWatermark.href = data.hdplay || data.play; 
                downloadAudio.href = data.music;       

                // Set caption dan hashtag
                captionText.value = data.title || "Tidak ada caption.";

                // Set subtitle jika tersedia
                if (data.subtitle) {
                    subtitleText.value = data.subtitle;
                } else {
                    subtitleText.value = "Subtitle/transkrip otomatis tidak tersedia untuk video ini.";
                }

                loadingDiv.classList.add("hidden");
                resultContainer.classList.remove("hidden");
            } else {
                throw new Error("Gagal mengambil data video. Pastikan video bersifat publik dan link benar.");
            }

        } catch (error) {
            console.error(error);
            loadingDiv.classList.add("hidden");
            alert("Terjadi kesalahan koneksi atau server API sedang sibuk. Coba beberapa saat lagi.");
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

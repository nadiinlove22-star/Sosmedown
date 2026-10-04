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

    // Tombol Proses Unduh
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
            // Menggunakan URL Edge Function Supabase Anda
            const supabaseFunctionUrl = "https://ggbkoldfxlgubcnpqwzm.supabase.co/functions/v1/swift-handler";
            
            const response = await fetch(supabaseFunctionUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ url: url })
            });

            const resJson = await response.json();

            if (resJson.code === 0 && resJson.data) {
                const data = resJson.data;

                // Memasukkan data ke elemen UI website
                videoThumbnail.src = data.cover || data.origin_cover || "";
                videoTitle.textContent = data.title || "Video TikTok Tanpa Watermark";
                statViews.textContent = data.play_count || 0;
                statLikes.textContent = data.digg_count || 0;

                // Link Download Video Tanpa Watermark & Audio
                downloadNoWatermark.href = data.hdplay || data.play || "#"; 
                downloadAudio.href = data.music || "#";       

                // Caption & Hashtag
                captionText.value = data.title || "Tidak ada caption.";

                // Subtitle / Transkrip jika tersedia
                if (data.subtitle) {
                    subtitleText.value = data.subtitle;
                } else {
                    subtitleText.value = "Subtitle otomatis tidak tersedia untuk video ini.";
                }

                loadingDiv.classList.add("hidden");
                resultContainer.classList.remove("hidden");
            } else {
                throw new Error("Gagal mengambil data dari server.");
            }

        } catch (error) {
            console.error(error);
            loadingDiv.classList.add("hidden");
            alert("Terjadi kesalahan saat memproses video. Pastikan link aktif dan publik.");
        }
    });

    // Fitur Salin Caption
    copyCaptionBtn.addEventListener("click", () => {
        if (!captionText.value) return;
        navigator.clipboard.writeText(captionText.value);
        copyCaptionBtn.innerHTML = '<i class="fa-solid fa-check"></i> Tersalin!';
        setTimeout(() => {
            copyCaptionBtn.innerHTML = '<i class="fa-solid fa-copy"></i> Salin Teks';
        }, 2000);
    });

    // Fitur Salin Subtitle
    copySubtitleBtn.addEventListener("click", () => {
        if (!subtitleText.value) return;
        navigator.clipboard.writeText(subtitleText.value);
        copySubtitleBtn.innerHTML = '<i class="fa-solid fa-check"></i> Tersalin!';
        setTimeout(() => {
            copySubtitleBtn.innerHTML = '<i class="fa-solid fa-copy"></i> Salin Subtitle';
        }, 2000);
    });
});

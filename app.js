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

    pasteBtn.addEventListener("click", async () => {
        try {
            const text = await navigator.clipboard.readText();
            tiktokUrlInput.value = text;
        } catch (err) {
            alert("Gagal membaca clipboard.");
        }
    });

    downloadBtn.addEventListener("click", async () => {
        const url = tiktokUrlInput.value.trim();
        if (!url) {
            alert("Masukkan tautan TikTok terlebih dahulu!");
            return;
        }

        loadingDiv.classList.remove("hidden");
        resultContainer.classList.add("hidden");

        try {
            const supabaseFunctionUrl = "https://ggbkoldfxlgubcnpqwzm.supabase.co/functions/v1/swift-handler";
            
            const response = await fetch(supabaseFunctionUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ url: url })
            });

            const textResponse = await response.text();
            
            // Tampilkan isi mentah dari server untuk mengecek error-nya
            let resJson;
            try {
                resJson = JSON.parse(textResponse);
            } catch (e) {
                throw new Error("Respon bukan JSON: " + textResponse);
            }

            if (resJson.code === 0 && resJson.data) {
                const data = resJson.data;

                videoThumbnail.src = data.cover || data.origin_cover || "";
                videoTitle.textContent = data.title || "Video TikTok Tanpa Watermark";
                statViews.textContent = data.play_count || 0;
                statLikes.textContent = data.digg_count || 0;

                downloadNoWatermark.href = data.hdplay || data.play || "#"; 
                downloadAudio.href = data.music || "#";       

                captionText.value = data.title || "Tidak ada caption.";
                subtitleText.value = data.subtitle || "Subtitle otomatis tidak tersedia.";

                loadingDiv.classList.add("hidden");
                resultContainer.classList.add("hidden"); // Diperbaiki agar tampil
                resultContainer.classList.remove("hidden");
            } else {
                // Tampilkan pesan error spesifik dari server
                throw new Error(resJson.msg || resJson.error || "Gagal mengambil data dari API.");
            }
        } catch (error) {
            console.error(error);
            loadingDiv.classList.add("hidden");
            alert("DETAIL ERROR: " + error.message);
        }
    });

    copyCaptionBtn.addEventListener("click", () => {
        if (!captionText.value) return;
        navigator.clipboard.writeText(captionText.value);
        copyCaptionBtn.innerHTML = '<i class="fa-solid fa-check"></i> Tersalin!';
        setTimeout(() => copyCaptionBtn.innerHTML = '<i class="fa-solid fa-copy"></i> Salin Teks', 2000);
    });

    copySubtitleBtn.addEventListener("click", () => {
        if (!subtitleText.value) return;
        navigator.clipboard.writeText(subtitleText.value);
        copySubtitleBtn.innerHTML = '<i class="fa-solid fa-check"></i> Tersalin!';
        setTimeout(() => copySubtitleBtn.innerHTML = '<i class="fa-solid fa-copy"></i> Salin Subtitle', 2000);
    });
});

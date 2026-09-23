async function handleGenerate() {
    const urlInput = document.getElementById('url-input').value.trim();
    const resultContainer = document.getElementById('result-container');
    const generateBtn = document.getElementById('generate-btn');

    if (!urlInput) {
        alert("Silakan masukkan tautan (URL) media sosial terlebih dahulu!");
        return;
    }

    generateBtn.disabled = true;
    generateBtn.innerText = "Menghubungkan ke Server...";

    try {
        // Menggunakan layanan API publik alternatif yang stabil untuk frontend web
        const apiURL = `https://apis.davidcyriltech.my.id/download?url=${encodeURIComponent(urlInput)}`;
        
        const response = await fetch(apiURL);
        const json = await response.json();

        if (!json || (!json.download_url && !json.url && !json.video)) {
            throw new Error("Gagal mengambil data. Pastikan link yang dimasukkan benar dan publik.");
        }

        // Ambil link hasil dari respons API
        const mediaLink = json.download_url || json.url || json.video;

        // Tampilkan hasil unduhan ke antarmuka
        resultContainer.classList.remove('hidden');

        document.getElementById('download-video-btn').href = mediaLink;
        document.getElementById('download-audio-btn').href = json.audio || mediaLink;
        document.getElementById('download-sub-btn').href = mediaLink;
        
        // Tampilkan caption jika ada dari API
        document.getElementById('caption-box').value = json.caption || json.title || "Berhasil memproses media melalui Sosmedown!";

        resultContainer.scrollIntoView({ behavior: 'smooth' });

    } catch (err) {
        alert("Gagal memproses tautan: " + err.message + "\n\nTips: Coba gunakan tautan lain atau pastikan postingan tidak diprivate.");
    } finally {
        generateBtn.disabled = false;
        generateBtn.innerText = "Generate Media";
    }
}

function copyCaption() {
    const captionBox = document.getElementById('caption-box');
    captionBox.select();
    captionBox.setSelectionRange(0, 99999);

    navigator.clipboard.writeText(captionBox.value).then(() => {
        alert("Caption berhasil disalin ke clipboard!");
    }).catch(() => {
        alert("Gagal menyalin caption.");
    });
}

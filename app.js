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
        // Contoh menggunakan endpoint publik/open-source (seperti Cobalt API)
        const response = await fetch('https://api.cobalt.tools/api/json', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                url: urlInput,
                vQuality: 'max' // Meminta kualitas tertinggi
            })
        });

        const data = await response.json();

        if (data.status === 'error' || !data.url) {
            throw new Error(data.text || "Gagal memproses tautan. Pastikan URL valid.");
        }

        // Tampilkan hasil unduhan dari respons API
        resultContainer.classList.remove('hidden');

        // Link Download Video Utama
        document.getElementById('download-video-btn').href = data.url;
        
        // Jika API menyediakan audio terpisah atau fitur lain
        document.getElementById('download-audio-btn').href = data.audio || data.url;
        
        // Sembunyikan atau sesuaikan tombol subtitle jika tidak tersedia dari API
        document.getElementById('download-sub-btn').href = data.picker ? data.picker[0].url : data.url;

        // Tampilkan caption jika tersedia, atau info default
        document.getElementById('caption-box').value = data.filename || "Berhasil mengambil media dari Sosmedown!";

        resultContainer.scrollIntoView({ behavior: 'smooth' });

    } catch (err) {
        alert("Terjadi kesalahan: " + err.message);
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

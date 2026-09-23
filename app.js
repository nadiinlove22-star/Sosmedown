function handleGenerate() {
    const urlInput = document.getElementById('url-input').value.trim();
    const platform = document.getElementById('platform-select').value;
    const resultContainer = document.getElementById('result-container');
    const generateBtn = document.getElementById('generate-btn');

    if (!urlInput) {
        alert("Silakan masukkan tautan (URL) media sosial terlebih dahulu!");
        return;
    }

    // Ubah status tombol jadi memproses
    generateBtn.disabled = true;
    generateBtn.innerText = "Memproses Media...";

    // Simulasi proses mengambil data (nantinya bisa dihubungkan ke API Downloader)
    setTimeout(() => {
        // Tampilkan kotak hasil
        resultContainer.classList.remove('hidden');

        // Contoh data tiruan (mock data) yang nantinya diganti dengan hasil respons API asli
        document.getElementById('download-video-btn').href = "#";
        document.getElementById('download-audio-btn').href = "#";
        document.getElementById('download-sub-btn').href = "#";
        document.getElementById('caption-box').value = "Ini adalah contoh teks caption otomatis dari postingan yang kamu masukkan! #Sosmedown #Downloader";

        // Kembalikan tombol ke semula
        generateBtn.disabled = false;
        generateBtn.innerText = "Generate Media";

        // Gulir layar otomatis ke bagian hasil
        resultContainer.scrollIntoView({ behavior: 'smooth' });
    }, 1500);
}

function copyCaption() {
    const captionBox = document.getElementById('caption-box');
    captionBox.select();
    captionBox.setSelectionRange(0, 99999); // Untuk perangkat mobile

    navigator.clipboard.writeText(captionBox.value).then(() => {
        alert("Caption berhasil disalin ke clipboard!");
    }).catch(err => {
        alert("Gagal menyalin caption.");
    });
}

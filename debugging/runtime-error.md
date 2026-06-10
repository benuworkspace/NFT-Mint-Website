## Debug: Wallet modal/runtime error pada localhost saat testing ConnectButton

### Isi issue / note
Masalah
Saat testing koneksi wallet di localhost, modal ConnectButton/RainbowKit mengalami error runtime. Hal ini muncul saat halaman yang memakai wallet provider di page.tsx dan Web3Provider.tsx dibuka di browser.

### Gejala
- Modal wallet tidak stabil saat dibuka
- Error runtime muncul di browser console
- Error terkait WalletConnect/RainbowKit modal dan QR generation path

### Root cause
Masalah ini berasal dari ketidakcocokan versi dependency wallet stack, khususnya antara:

- @rainbow-me/rainbowkit
- wagmi
- @walletconnect/ethereum-provider

RainbowKit versi yang digunakan mengharapkan versi Wagmi yang kompatibel. Saat versi dependency tidak sinkron, runtime modal wallet gagal memuat komponen internal WalletConnect.

### Langkah debug
1. Menguji halaman lokal di browser
2. Melihat error runtime dari modal wallet
3. Mengecek dependency yang dipasang:
   - @rainbow-me/rainbowkit
   - wagmi
   - @walletconnect/ethereum-provider
4. Menyesuaikan versi Wagmi agar sesuai dengan RainbowKit
5. Menginstal ulang dependency dan menjalankan ulang dev server

### Hasil
Setelah dependency disinkronkan, error runtime pada modal wallet berhasil diperbaiki dan testing di localhost berjalan normal.

### Kesimpulan
Masalah ini bukan masalah hydration atau layout, melainkan dependency mismatch pada wallet integration stack. Setelah versi dependency diselaraskan, wallet modal dapat berjalan dengan baik di local environment.
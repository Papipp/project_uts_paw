// Seluruh kode dibungkus IIFE (Immediately Invoked Function Expression)
(function () {
  "use strict";

  // ---------- Variabel global  ----------
  window.tokoGlobalPapip = "Matcha Teduh";

  // ---------- Data: array berisi objek ----------
  // Harga = 5000 + 1000 x digit ke-1..ke-4 dari belakang NIM 242104014
  // Digit dari belakang: 4, 1, 0, 4  ->  9000, 6000, 5000, 9000
  var daftarMenuPapip = [
    { id: 1, judul: "Matcha Latte",     harga: 5000 + 1000 * 4, ket: "Matcha pekat, susu segar, manis seperlunya." },
    { id: 2, judul: "Matcha Panas",     harga: 5000 + 1000 * 1, ket: "Dikocok tradisional, hangat dan bersahaja." },
    { id: 3, judul: "Matcha Soda",      harga: 5000 + 1000 * 0, ket: "Matcha dingin, soda, sejumput jeruk nipis." },
    { id: 4, judul: "Roti Bakar Matcha",  harga: 5000 + 1000 * 4, ket: "Roti tebal, selai matcha, taburan almond." }
  ];

  // ---------- Fungsi tiga bentuk ----------

  // 1) Function declaration: parameter + return
  function hitungSubtotalPapip(harga, jumlah) {
    return harga * jumlah;
  }

  // 2) Function expression: percabangan diskon
  var hitungDiskonPapip = function (subtotal) {
    var persen; // variabel lokal
    if (subtotal >= 50000) {
      persen = 10;
    } else if (subtotal >= 25000) {
      persen = 5;
    } else {
      persen = 0;
    }
    return persen;
  };

  // 3) Arrow function
  var formatRupiahPapip = (angka) => "Rp " + angka.toLocaleString("id-ID");

  // Fungsi gabungan: memakai ketiga fungsi di atas, mengembalikan objek hasil
  function hitungTotalPapip(harga, jumlah) {
    var subtotal = hitungSubtotalPapip(harga, jumlah);
    var persen = hitungDiskonPapip(subtotal);
    var potongan = subtotal * persen / 100;
    return { subtotal: subtotal, persen: persen, potongan: potongan, total: subtotal - potongan };
  }

  // ---------- Tampilan menu perulangan ----------
  function tampilkanMenuPapip() {
    var wadahKartu = document.getElementById("kartu-wadah-papip");
    var daftar = document.getElementById("daftar-list-papip");
    var isiTabel = document.getElementById("tabel-isi-papip");
    var pilihan = document.getElementById("pilihan-papip");
    var jumlahSemua = 0;

    // for biasa: kartu menu
    for (var i = 0; i < daftarMenuPapip.length; i++) {
      var m = daftarMenuPapip[i];
      var kartu = document.createElement("article");
      kartu.className = "kartu-papip";
      kartu.innerHTML =
        "<div><h3>" + m.judul + "</h3><p>" + m.ket + "</p></div>" +
        "<p class=\"harga-papip\">" + formatRupiahPapip(m.harga) + "</p>";
      wadahKartu.appendChild(kartu);
    }

    // for...of: list, tabel, dan pilihan formulir
    for (var item of daftarMenuPapip) {
      var li = document.createElement("li");
      li.innerHTML = "<span>" + item.judul + "</span><span>" + formatRupiahPapip(item.harga) + "</span>";
      daftar.appendChild(li);

      var baris = document.createElement("tr");
      baris.innerHTML =
        "<td>" + item.id + "</td><td>" + item.judul + "</td>" +
        "<td class=\"kanan-papip\">" + formatRupiahPapip(item.harga) + "</td>";
      isiTabel.appendChild(baris);

      var opsi = document.createElement("option");
      opsi.value = item.id;
      opsi.textContent = item.judul + " (" + formatRupiahPapip(item.harga) + ")";
      pilihan.appendChild(opsi);

      jumlahSemua += item.harga;
    }

    // total di baris akhir tabel
    document.getElementById("tabel-total-papip").textContent = formatRupiahPapip(jumlahSemua);
  }

  // ---------- Event klik + validasi + callback setTimeout ----------
  function pasangEventPapip() {
    var form = document.getElementById("formulir-papip");
    var tombol = document.getElementById("tombol-papip");
    var galat = document.getElementById("galat-papip");
    var hasil = document.getElementById("hasil-papip");
    var status = document.getElementById("status-papip");

    form.addEventListener("submit", function (e) { e.preventDefault(); });

    tombol.addEventListener("click", function () {
      galat.textContent = "";
      hasil.textContent = "";
      status.textContent = "";

      // validasi bawaan HTML5 + tandai kolom yang salah
      var kolom = form.querySelectorAll("input, select");
      var pertamaSalah = null;
      for (var k of kolom) {
        if (k.checkValidity()) {
          k.classList.remove("tidak-valid-papip");
        } else {
          k.classList.add("tidak-valid-papip");
          if (!pertamaSalah) { pertamaSalah = k; }
        }
      }
      if (pertamaSalah) {
        galat.textContent = "Periksa kolom \"" + form.querySelector("label[for=" + pertamaSalah.id + "]").textContent +
          "\": " + pertamaSalah.validationMessage;
        pertamaSalah.focus();
        return;
      }

      // ambil data, hitung total
      var idDipilih = Number(document.getElementById("pilihan-papip").value);
      var jumlah = Number(document.getElementById("jumlah-papip").value);
      var menuDipilih = daftarMenuPapip.find((x) => x.id === idDipilih);
      var r = hitungTotalPapip(menuDipilih.harga, jumlah);

      hasil.textContent =
        menuDipilih.judul + " x " + jumlah + "\n" +
        "Subtotal: " + formatRupiahPapip(r.subtotal) + "\n" +
        "Diskon " + r.persen + "%: -" + formatRupiahPapip(r.potongan) + "\n" +
        "Total bayar: " + formatRupiahPapip(r.total);

      status.textContent = "Memproses pesanan...";

      // callback setTimeout
      var tampilkanDiterimaPapip = function () {
        status.textContent = "Pesanan diterima";
        console.log("Pesanan diterima:", menuDipilih.judul, "x", jumlah, "| total", r.total, "| toko:", window.tokoGlobalPapip);
      };
      setTimeout(tampilkanDiterimaPapip, 1200);
    });
  }

  // ---------- Mulai ----------
  tampilkanMenuPapip();
  pasangEventPapip();
  console.log("Menu dimuat:", daftarMenuPapip);
})();
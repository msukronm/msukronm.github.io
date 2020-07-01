document.addEventListener("DOMContentLoaded", function() {
  let yearSeason = '2019';

    // Activate sidebar nav
    let elems = document.querySelectorAll("#nav-mobile");
    M.Sidenav.init(elems);
    loadNav();
   
    function loadNav() {
        let xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
          if (this.readyState == 4) {
            if (this.status != 200) return;
       
            // Muat daftar tautan menu
            document.querySelectorAll("#topnav, #nav-mobile").forEach(function(elm) {
              elm.innerHTML = xhttp.responseText;
            });
       
            // Daftarkan event listener untuk setiap tautan menu
            document.querySelectorAll("#nav-mobile a, #topnav a").forEach(function(elm) {
              elm.addEventListener("click", function(event) {
                // Tutup sidenav
                var sidenav = document.querySelector("#nav-mobile");
                M.Sidenav.getInstance(sidenav).close();
       
                // Muat konten halaman yang dipanggil
                page = event.target.getAttribute("href").substr(1);
                loadPage(page);
              });
            });
          }
        };
        xhttp.open("GET", "nav.html", true);
        xhttp.send();
    }

    // Load page content
    let page = window.location.hash.substr(1);
    if (page == "") page = "beranda";
    loadPage(page);

    function loadPage(page) {
        let xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
          if (this.readyState == 4) {
            var content = document.querySelector("#row-content");
            if (this.status == 200) {
                content.innerHTML = xhttp.responseText;
                switch (page) {
                  case "beranda":
                    teams(yearSeason);
                    break;
                
                  case "klub":
                    teams(yearSeason);
                    break;
                
                  case "klasemen":
                    tableStandings(yearSeason);
                    break;
                
                  default:
                    teams(yearSeason);
                    break;
                }
            } else if (this.status == 404) {
                content.innerHTML = "<div class='container'><div class='section'><p>Halaman tidak ditemukan.</p></div></div>";
            } else {
                content.innerHTML = "<div class='container'><div class='section'><p>Ups.. halaman tidak dapat diakses.</p></div></div>";
            }
          }
        };
        xhttp.open("GET", "pages/" + page + ".html", true);
        xhttp.send();

    }

});
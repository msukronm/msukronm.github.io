import ApiFootballData from './api-football-data.js';

function initComponent() {

    const apiFootball = new ApiFootballData();
   
    const loadNav = () => {
        let xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = (elm) => {
          let this_ = elm.currentTarget;
          if (this_.readyState == 4) {
            if (this_.status != 200) return;
       
            // Muat daftar tautan menu
            document.querySelectorAll("#topnav, #nav-mobile").forEach( (elm) => {
              elm.innerHTML = xhttp.responseText;
            });
       
            // Daftarkan event listener untuk setiap tautan menu
            document.querySelectorAll("#nav-mobile a, #topnav a, .card-action a").forEach( (elm) => {
              elm.addEventListener("click", (event) => {
                // Tutup sidenav
                var sidenav = document.querySelector("#nav-mobile");
                M.Sidenav.getInstance(sidenav).close();
       
                // Muat konten halaman yang dipanggil
                // page = event.target.getAttribute("href").substr(1);
                // loadPage(page);
              });
            });
          }
        };
        xhttp.open("GET", "nav.html", true);
        xhttp.send();
    }

    const loadPage = (page) => {
        let xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = (elm) => {
          let this_ = elm.currentTarget;
          if (this_.readyState == 4) {
            var content = document.querySelector("#row-content");
            if (this_.status == 200) {
                content.innerHTML = xhttp.responseText;
                switch (page) {
                  case "beranda":
                    apiFootball.teams();
                    apiFootball.data_competition();
                    break;
                
                  case "klub":
                    apiFootball.teams();
                    break;
                
                  case "klasemen":
                    apiFootball.tableStandings();
                    break;
                
                  case "lihat_tim":
                    apiFootball.getTeamsData(id_team);
                    break;
                
                  case "pemain_favorit":
                    apiFootball.favoritePlayer();
                    break;
                
                  default:
                    apiFootball.teams();
                    apiFootball.data_competition();
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

    // Activate sidebar nav
    let elems = document.querySelectorAll("#nav-mobile");
    M.Sidenav.init(elems);
    loadNav();

    // Load page content
    // let page = window.location.hash.substr(1);
    const urlSearch = new URLSearchParams(window.location.search);
    let page = urlSearch.get("page");
    let id_team = urlSearch.get("id");
    if (page == "" || page == undefined) page = "beranda";
    if (id_team == "" || id_team == undefined) id_team = "0";
    loadPage(page);

}

export default initComponent;
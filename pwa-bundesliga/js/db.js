const dbPromised = idb.open("pwa-bundesliga", 1, function(upgradeDb) {
    let articlesObjectStore = upgradeDb.createObjectStore("favorite_players", {keyPath:'id'});
    articlesObjectStore.createIndex("id", "id");
});

function getFavoritePlayer() {
  return new Promise((resolve, reject) => {
      dbPromised
        .then(db => {
          let tx = db.transaction("favorite_players", "readonly");
          let store = tx.objectStore("favorite_players");
          return store.getAll();
        })
        .then(player => {
          resolve(player);
        });
    });
}

function getPlayerById(id){
  return new Promise( (resolve, reject) => {
      dbPromised
        .then( db => {
          let tx = db.transaction("favorite_players", "readonly");
          let store = tx.objectStore("favorite_players");
          return store.get(id);
        })
        .then( result => {
          if(result !== undefined){
            resolve(result.player);
          }
        });
    });
}

function saveFavoritePlayer(player){
  dbPromised
    .then(db => {
        let tx = db.transaction("favorite_players", "readwrite");
        let store = tx.objectStore("favorite_players");
        store.add(player);
        return tx.complete;
    })
    .then(() => {
        alert("Berhasil! Anda menambahkan pemain favorit.");
    })
}

function deleteFavoritePlayer(id){
  return new Promise( (resolve, reject) => {
      dbPromised
        .then( db => {
          var tx = db.transaction("favorite_players", "readwrite");
          var store = tx.objectStore("favorite_players");
          store.delete(parseInt(id));
          return tx.complete;
        })
        .then( player => {
          alert("Berhasil! Anda membatalkan pemain favorit.");
          resolve(player);
        })
    });
}
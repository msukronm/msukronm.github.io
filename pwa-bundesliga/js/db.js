const objectStoreName = "favorite_teams";
const dbPromised = idb.open("db-pwa-bundesliga", 1, function(upgradeDb) {
    let articlesObjectStore = upgradeDb.createObjectStore(objectStoreName, {keyPath:'id'});
});

const getFavorite = () => {
  return new Promise((resolve, reject) => {
      dbPromised
        .then(db => {
          let tx = db.transaction(objectStoreName, "readonly");
          let store = tx.objectStore(objectStoreName);
          return store.getAll();
        })
        .then(result => {
          resolve(result);
        });
    });
}

const getDataById = (id) => {
  return new Promise( (resolve, reject) => {
      dbPromised
        .then( db => {
          let tx = db.transaction(objectStoreName, "readonly");
          let store = tx.objectStore(objectStoreName);
          return store.get(id);
        })
        .then( result => {
          if(result !== undefined){
            resolve(result);
          }
        });
    });
}

const saveFavorite = (data) => {
  dbPromised
    .then(db => {
        let tx = db.transaction(objectStoreName, "readwrite");
        let store = tx.objectStore(objectStoreName);
        store.add(data);
        return tx.complete;
    })
    .then(() => {
        alert("Berhasil! Anda menambahkan data favorit.");
    })
}

const deleteFavorite = (id) => {
  return new Promise( (resolve, reject) => {
      dbPromised
        .then( db => {
          var tx = db.transaction(objectStoreName, "readwrite");
          var store = tx.objectStore(objectStoreName);
          store.delete(parseInt(id));
          return tx.complete;
        })
        .then( player => {
          alert("Anda membatalkan data favorit.");
          resolve(player);
        })
    });
}

export {getFavorite, getDataById, saveFavorite, deleteFavorite};
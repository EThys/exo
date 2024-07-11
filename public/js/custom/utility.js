
var dbPromise = idb.open('personal-store', 1, function (db){
    if (!db.objectStoreNames.contains('absences')) {
        // db.createObjectStore('absences', {keyPath: 'AbsenceEmployeID'});
        db.createObjectStore('sms', {keyPath: 'id', autoIncrement: true});
    }
})

function writeData(st, data) {
    return dbPromise
        .then(function (db) {
            let tx = db.transaction(st, 'readwrite')
            let store = tx.objectStore(st)
            store.put(data)
            return tx.complete
        })
}

function readAllData(st) {
    return dbPromise
        .then(function (db) {
            let tx = db.transaction(st, 'readonly')
            let store = tx.objectStore(st)
            return store.getAll()
        })
}

function clearAllData(st) {
    return dbPromise
        .then(function(db) {
            var tx = db.transaction(st, 'readwrite')
            let store = tx.objectStore(st)
            store.clear()
            return tx.complete
        })
}

function deleteItemFromData(st, id) {
    return dbPromise
        .then(function(db) {
            var tx = db.transaction(st, 'readwrite')
            let store = tx.objectStore(st)
            store.delete(id)
            // store.get(id)
            return tx.complete
        })
}
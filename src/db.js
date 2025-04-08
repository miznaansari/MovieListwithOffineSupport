// db.js
import Dexie from "dexie";

const db = new Dexie("MovieDatabase");

db.version(1).stores({
  movies: "++id,page", // movies with page info
});

export default db;

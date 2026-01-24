import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getDatabase, ref, push, set, onValue, remove, get, child, update } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-database.js";
// NOVAS IMPORTAÇÕES DO STORAGE (sRef usado para não confundir com o ref do banco)
import { getStorage, ref as sRef, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyDUtlcK_C22o0iNhHOt0JfdVF445Nbevy8",
  authDomain: "catalago1-8ddfe.firebaseapp.com",
  databaseURL: "https://catalago1-8ddfe-default-rtdb.firebaseio.com",
  projectId: "catalago1-8ddfe",
  // ADICIONADO O BUCKET DO STORAGE:
  storageBucket: "catalago1-8ddfe.firebasestorage.app",
  messagingSenderId: "1019943701927",
  appId: "1:1019943701927:web:e8d854c0c700b77d1ffa82"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const storage = getStorage(app); // Inicializa o Storage

// Exporta tudo: o antigo (db, ref...) e o novo (storage, sRef...)
export { db, ref, push, set, onValue, remove, get, update, child, storage, sRef, uploadBytes, getDownloadURL };

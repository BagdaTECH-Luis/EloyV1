import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

/**
 * CONFIGURAÇÃO FIREBASE
 * 
 * IMPORTANTE: A API Key abaixo é PÚBLICA e deve ser incluída no código do cliente.
 * Não é uma credencial secreta. A segurança do Firebase é controlada por:
 * 
 * 1. Firestore Security Rules (no Firebase Console)
 * 2. Firebase Authentication (autenticação de usuários)
 * 3. (RECOMENDADO) Firebase App Check - previne acesso não autorizado
 * 
 * TODO: Implementar Firebase App Check para proteção adicional contra:
 *       - Abuso de API
 *       - Scraping
 *       - Uso não autorizado fora deste domínio
 * 
 * Documentação: https://firebase.google.com/docs/app-check
 */
const firebaseConfig = {
  apiKey: "AIzaSyCXB6jkpiGfUOaB92sO4V9DEP3Sgn0zDJw",
  authDomain: "eloy-ai.firebaseapp.com",
  projectId: "eloy-ai",
  storageBucket: "eloy-ai.firebasestorage.app",
  messagingSenderId: "173187782625",
  appId: "1:173187782625:web:327f2e19e79b913252e4a0"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);

// Inicializa e exporta Auth e Firestore
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };

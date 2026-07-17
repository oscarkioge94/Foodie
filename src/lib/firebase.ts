import { initializeApp } from "firebase/app";
import { 
  getFirestore, 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  setDoc,
  getDoc,
  writeBatch
} from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDD69LaW-UqPTP-pzAVgDytOlBaVMY9NK8",
  authDomain: "gen-lang-client-0368874236.firebaseapp.com",
  projectId: "gen-lang-client-0368874236",
  storageBucket: "gen-lang-client-0368874236.firebasestorage.app",
  messagingSenderId: "537294470162",
  appId: "1:537294470162:web:9f0143e6d14d13a32faccb"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore with the custom databaseId from config
export const db = getFirestore(app, "ai-studio-beccafoodies-a1b79dcf-c016-4073-8938-0c07022275dc");

export const auth = getAuth(app);

// Data structure collections
export const COLLECTIONS = {
  RECIPES: "recipes",
  ARTICLES: "articles",
  ADMIN: "admin_config"
};

/**
 * Seeds Firestore with initial data if collections are empty.
 */
export async function seedInitialDataIfEmpty(initialRecipes: any[], initialArticles: any[]) {
  try {
    // 1. Check recipes
    const recipesRef = collection(db, COLLECTIONS.RECIPES);
    const recipesSnap = await getDocs(recipesRef);
    
    if (recipesSnap.empty && initialRecipes.length > 0) {
      console.log("Seeding recipes to Firestore...");
      for (const recipe of initialRecipes) {
        // Remove undefined fields to prevent Firestore crashes
        const cleanRecipe = JSON.parse(JSON.stringify(recipe));
        // Use recipe.id as doc ID to keep references intact
        await setDoc(doc(db, COLLECTIONS.RECIPES, recipe.id), cleanRecipe);
      }
    }

    // 2. Check articles
    const articlesRef = collection(db, COLLECTIONS.ARTICLES);
    const articlesSnap = await getDocs(articlesRef);

    if (articlesSnap.empty && initialArticles.length > 0) {
      console.log("Seeding articles to Firestore...");
      for (const article of initialArticles) {
        const cleanArticle = JSON.parse(JSON.stringify(article));
        await setDoc(doc(db, COLLECTIONS.ARTICLES, article.id), cleanArticle);
      }
    }

    // 3. Setup default admin config if not existing or still has the old default passphrase
    const adminConfigRef = doc(db, COLLECTIONS.ADMIN, "auth");
    const adminSnap = await getDoc(adminConfigRef);
    if (!adminSnap.exists() || adminSnap.data()?.passphrase === "becca-paradise") {
      await setDoc(adminConfigRef, {
        username: "admin",
        passphrase: "Admin123!@#"
      });
    }

  } catch (error) {
    console.error("Error seeding initial data:", error);
  }
}

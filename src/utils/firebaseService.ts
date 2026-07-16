import { 
  collection, 
  getDocs, 
  doc, 
  setDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDoc,
  onSnapshot,
  query,
  orderBy
} from "firebase/firestore";
import { db, COLLECTIONS, seedInitialDataIfEmpty } from "../lib/firebase";
import { MenuItem, Article } from "../types";
import { MENU_ITEMS, ARTICLES } from "../data/foodData";

/**
 * Ensures initial data is seeded and returns unsubscribe for realtime updates
 */
export function subscribeToRecipes(callback: (recipes: MenuItem[]) => void) {
  const q = collection(db, COLLECTIONS.RECIPES);
  
  // Seed first if empty
  getDocs(q).then(snap => {
    if (snap.empty) {
      // Extract only migrated recipes
      const migrated = MENU_ITEMS.filter(item => item.id.startsWith("migrated-recipe-"));
      seedInitialDataIfEmpty(migrated, ARTICLES);
    }
  });

  return onSnapshot(q, (snapshot) => {
    const recipes: MenuItem[] = [];
    snapshot.forEach((doc) => {
      recipes.push({ id: doc.id, ...doc.data() } as MenuItem);
    });
    callback(recipes);
  });
}

/**
 * Subscribes to realtime articles/blogs
 */
export function subscribeToArticles(callback: (articles: Article[]) => void) {
  const q = collection(db, COLLECTIONS.ARTICLES);
  
  return onSnapshot(q, (snapshot) => {
    const articles: Article[] = [];
    snapshot.forEach((doc) => {
      articles.push({ id: doc.id, ...doc.data() } as Article);
    });
    callback(articles);
  });
}

/**
 * Verify administrator passphrase
 */
export async function verifyPassphrase(passphrase: string): Promise<boolean> {
  try {
    const adminRef = doc(db, COLLECTIONS.ADMIN, "auth");
    const snap = await getDoc(adminRef);
    if (snap.exists()) {
      return snap.data().passphrase === passphrase;
    }
    // Fallback if document not found
    return passphrase === "becca-paradise";
  } catch (error) {
    console.error("Error verifying passphrase:", error);
    return false;
  }
}

/**
 * Update administrator passphrase
 */
export async function updatePassphrase(newPassphrase: string): Promise<boolean> {
  try {
    const adminRef = doc(db, COLLECTIONS.ADMIN, "auth");
    await setDoc(adminRef, { passphrase: newPassphrase }, { merge: true });
    return true;
  } catch (error) {
    console.error("Error updating passphrase:", error);
    return false;
  }
}

/**
 * Add a new recipe
 */
export async function saveRecipe(recipe: Omit<MenuItem, "id"> & { id?: string }) {
  const cleanRecipe = JSON.parse(JSON.stringify(recipe));
  if (recipe.id) {
    const docRef = doc(db, COLLECTIONS.RECIPES, recipe.id);
    await setDoc(docRef, cleanRecipe, { merge: true });
    return recipe.id;
  } else {
    // Create random human readable ID prefix
    const customId = "migrated-recipe-" + Date.now();
    const docRef = doc(db, COLLECTIONS.RECIPES, customId);
    await setDoc(docRef, { ...cleanRecipe, id: customId });
    return customId;
  }
}

/**
 * Delete a recipe
 */
export async function removeRecipe(id: string) {
  const docRef = doc(db, COLLECTIONS.RECIPES, id);
  await deleteDoc(docRef);
}

/**
 * Add or update an article
 */
export async function saveArticle(article: Omit<Article, "id"> & { id?: string }) {
  const cleanArticle = JSON.parse(JSON.stringify(article));
  if (article.id) {
    const docRef = doc(db, COLLECTIONS.ARTICLES, article.id);
    await setDoc(docRef, cleanArticle, { merge: true });
    return article.id;
  } else {
    const customId = "migrated-blog-" + Date.now();
    const docRef = doc(db, COLLECTIONS.ARTICLES, customId);
    await setDoc(docRef, { ...cleanArticle, id: customId });
    return customId;
  }
}

/**
 * Delete an article
 */
export async function removeArticle(id: string) {
  const docRef = doc(db, COLLECTIONS.ARTICLES, id);
  await deleteDoc(docRef);
}

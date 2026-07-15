import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, doc, setDoc, deleteDoc } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

let app;
let db: any = null;

try {
  if (firebaseConfig && firebaseConfig.apiKey) {
    if (getApps().length === 0) {
      app = initializeApp(firebaseConfig);
    } else {
      app = getApp();
    }
    db = getFirestore(app);
    console.log('Firebase initialized successfully in Shandong Azum System.');
  }
} catch (error) {
  console.warn('Firebase / Firestore connection not initialized. Operating in local-fallback mode.', error);
}

export { db };

// Helper to save todo to firestore if online, otherwise safe fallback
export async function saveTodoToFirestore(todoItem: any) {
  if (!db) {
    console.log('Firestore not connected. Stored locally: ', todoItem.id);
    return;
  }
  try {
    // Save to 'tasks' collection with custom ID
    await setDoc(doc(db, 'tasks', todoItem.id), {
      id: todoItem.id,
      text: todoItem.text,
      date: todoItem.date, // Valid ISO-8601 string
      completed: todoItem.completed,
      priority: todoItem.priority,
      category: todoItem.category,
      machineryId: todoItem.machineryId || null,
      createdAt: new Date().toISOString()
    });
    console.log('Successfully saved task to Firestore:', todoItem.id);
  } catch (err) {
    console.error('Failed to write task to Firestore:', err);
  }
}

export async function deleteTodoFromFirestore(todoId: string) {
  if (!db) return;
  try {
    await deleteDoc(doc(db, 'tasks', todoId));
    console.log('Successfully deleted task from Firestore:', todoId);
  } catch (err) {
    console.error('Failed to delete task from Firestore:', err);
  }
}

export async function updateTodoInFirestore(todoItem: any) {
  if (!db) return;
  try {
    await setDoc(doc(db, 'tasks', todoItem.id), {
      id: todoItem.id,
      text: todoItem.text,
      date: todoItem.date,
      completed: todoItem.completed,
      priority: todoItem.priority,
      category: todoItem.category,
      machineryId: todoItem.machineryId || null,
      updatedAt: new Date().toISOString()
    }, { merge: true });
    console.log('Successfully updated task in Firestore:', todoItem.id);
  } catch (err) {
    console.error('Failed to update task in Firestore:', err);
  }
}

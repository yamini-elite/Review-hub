import { db } from "./firebase";
import {
    collection,
    addDoc,
    getDocs,
    deleteDoc,
    doc,
    serverTimestamp,
} from "firebase/firestore";

const reviewsRef = collection(db, "reviews");

// CREATE
export const addReview = async (
    userId: string,
    productName: string,
    rating: number,
    reviewText: string
) => {
    await addDoc(reviewsRef, {
        userId,
        productName,
        rating,
        reviewText,
        createdAt: serverTimestamp(),
    });
};

// READ
export const getReviews = async () => {
    const snapshot = await getDocs(reviewsRef);
    return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    }));
};

// DELETE
export const deleteReview = async (id: string) => {
    await deleteDoc(doc(db, "reviews", id));
};

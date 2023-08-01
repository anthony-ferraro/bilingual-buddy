import { initializeApp } from "firebase/app";
import {
    getFirestore,
    collection,
    document,
    query,
    where,
    addDoc,
    setDoc,
    Timestamp,
    getDocs,
    orderBy,
    limit
} from "firebase/firestore";

const firebaseConfig = JSON.parse(
    Buffer.from(process.env.FIREBASE_CONFIG, "base64").toString()
);
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export const login = async (phone) => {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("phone", "==", phone));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
        //phone number doesnt yet exist
        const newUser = {
            phone: phone,
            type: "restricted",
            created: new Timestamp(Math.floor(new Date() / 1000)),
            payplan: "none"
        };
        const docRef = await addNewUserToDB(newUser)
        return { ...newUser, id: docRef.id }
    } else {
        //phone number does exist
        const docData = querySnapshot.docs[0].data()
        return { ...docData, id: querySnapshot.docs[0].id };
    }
}

const addNewUserToDB = async (newUser) => {
    const usersRef = collection(db, "users");
    const docRef = await addDoc(usersRef, newUser);
    return docRef
}

export const logMessage = (uid, message, customTimestamp = null) => {

    const messagesRef = collection(db, "users", uid, "messages")
    addDoc(messagesRef, { ...message, created: new Timestamp(customTimestamp !== null ? customTimestamp : Math.floor(new Date() / 1000)) })
}

export const retrieveRecentMessages = async (uid) => {
    const messagesRef = collection(db, "users", uid, "messages")
    const q = query(messagesRef, where("body", "!=", false), orderBy("body", "desc"), orderBy("created", "desc"), limit(10));
    const querySnapshot = await getDocs(q);
    const messages = []
    querySnapshot.forEach((doc) => {
        messages.push(doc.data())
    });
    return messages.sort((a, b) => a.created - b.created)
}

export const logError = (ex, user) => {
    const uid = user?.id
    const name = ex.name
    const message = ex.message
    const stack = ex.stack
    const errorsRef = collection(db, "errors")
    addDoc(errorsRef, {uid: uid, name: name, message: message, stack: stack})
}
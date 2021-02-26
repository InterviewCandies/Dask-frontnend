import firebase from "firebase";
import { Message } from "../../types";

export const uploadImage = async (file: File): Promise<Message> => {
  const ref = firebase.storage().ref();

  const metadata = {
    contentType: file.type,
  };
  try {
    const snapshot = await ref.child(file.name).put(file, metadata);
    const url = await snapshot.ref.getDownloadURL();
    return { data: url };
  } catch (error) {
    return {
      status: error.code,
      message: error.message,
    };
  }
};

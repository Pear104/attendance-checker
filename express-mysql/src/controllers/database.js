const {
  collection,
  getDocs,
  query,
  doc,
  updateDoc,
  addDoc,
} = require("firebase/firestore");
const { db } = require("../firebase");

const getDBState = async (req, res) => {
  try {
    let databaseState = (
      await getDocs(query(collection(db, "utils")))
    ).docs[0].data();
    console.log("A get db state request have just been sent from NodeMCU");
    return res.status(200).json({
      isGettingFingerprint: databaseState.isGettingFingerprint,
      deletingFingerprintId: databaseState.deletingFingerprintId,
      updatingFingerprintId: databaseState.updatingFingerprintId,
      isEmptying: databaseState.isEmptying,
    });
  } catch (error) {
    return res.status(200).json({
      message: "Get states failed",
    });
  }
};

const postGottenFingerprintId = async (req, res) => {
  try {
    const { fingerprintId } = req.body;
    const databaseState = (await getDocs(query(collection(db, "utils"))))
      .docs[0];
    await addDoc(collection(db, "employees"), {
      fingerprintId: parseInt(fingerprintId),
    });
    await updateDoc(doc(db, "utils", databaseState.id), {
      currentFingerprintId: parseInt(fingerprintId),
      isGettingFingerprint: false,
      isGotten: true,
    });
    console.log(
      `A new employee has just enroll our company with fingerprintId ${fingerprintId}, HURAY`
    );
    return res.status(200).json({ message: "Register successfully" });
  } catch (error) {
    return res.status(200).json({ message: "Register failed" });
  }
};

const postUpdateFingerprintGotten = async (req, res) => {
  try {
    const { fingerprintId } = req.body;
    const databaseState = (await getDocs(query(collection(db, "utils"))))
      .docs[0];
    await updateDoc(doc(db, "utils", databaseState.id), {
      isGettingFingerprint: false,
      isGotten: true,
      updatingFingerprintId: 0,
    });
    console.log(`System has just update new fingerprintId ${fingerprintId}`);
    return res.status(200).json({ message: "Update successfully" });
  } catch (error) {
    return res.status(200).json({ message: "Update failed" });
  }
};

const postDeletedSuccess = async (req, res) => {
  try {
    const { fingerprintId } = req.body;
    const databaseState = (await getDocs(query(collection(db, "utils"))))
      .docs[0];
    await updateDoc(doc(db, "utils", databaseState.id), {
      deletingFingerprintId: 0,
    });
    console.log(
      `System has just remove fingerprintId ${fingerprintId} from the company`
    );
    return res.status(200).json({ message: "Delete successfully" });
  } catch (error) {
    return res.status(200).json({ message: "Delete failed" });
  }
};

const postEmpty = async (req, res) => {
  try {
    const databaseState = (await getDocs(query(collection(db, "utils"))))
      .docs[0];
    await updateDoc(doc(db, "utils", databaseState.id), {
      ...databaseState.data(),
      isEmptying: false,
      deletingFingerprintId: 0,
      updatingFingerprintId: 0,
      isGettingFingerprint: false,
      isGotten: false,
    });
    console.log(
      "Your boss has send a delete database request, does your sếp phá sản rồi?"
    );
    return res.status(200).json({ message: "EmptyDB successfully" });
  } catch (error) {
    return res.status(200).json({ message: "EmptyDB failed" });
  }
};

module.exports = {
  getDBState,
  postGottenFingerprintId,
  postUpdateFingerprintGotten,
  postDeletedSuccess,
  postEmpty,
};

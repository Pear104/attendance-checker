import React from "react";
import {
  collection,
  getDocs,
  addDoc,
  query,
  where,
  updateDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import { useState } from "react";
import { data } from "../utils/data";

const EmptyDB = () => {
  const emptyDB = async () => {
    try {
      const snapshot = await getDocs(collection(db, "employees"));
      snapshot.docs.forEach(async (item) => {
        await deleteDoc(item.ref);
      });
    } catch (error) {
      console.error("Error emptying the database:", error);
    }
    let q = query(collection(db, "utils"), where("id", "==", 1));

    const querySnapshot = await getDocs(q);

    if (querySnapshot.size > 0) {
      const firstDoc = querySnapshot.docs[0];

      await updateDoc(doc(db, "utils", firstDoc.id), {
        ...firstDoc.data(),
        currentFingerprintId: 1,
        isEmptying: true,
        isGettingFingerprint: false,
        isGotten: false,
      });
    }
  };

  const addTestDB = async () => {
    data.forEach((emp) => {
      console.log(emp);
    });
    data.forEach(async (emp) => {
      await addDoc(collection(db, "employees"), {
        id: emp.id,
        name: emp.name,
        fingerprintId: emp.fingerprintId,
        attendance: emp.attendance || {},
        email: emp.email,
        phoneNumber: emp.phoneNumber,
        address: emp.address,
        image: emp.image,
      });
    });
  };

  return (
    <div className="pt-12 pl-12">
      <button
        className={"border border-black mt-2 px-1 ml-2 hover:bg-red-500 "}
        onClick={emptyDB}
      >
        Empty database
      </button>
      <button
        className={"border border-black mt-2 px-1 ml-2 hover:bg-red-500 "}
        onClick={addTestDB}
      >
        Add test database
      </button>
    </div>
  );
};

export default EmptyDB;

import React from "react";
import {
  collection,
  getDocs,
  deleteDoc,
  query,
  where,
  onSnapshot,
  doc,
  orderBy,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";

const Delete = () => {
  const [employees, setEmployees] = useState([]);
  const [selected, setSelected] = useState(false);
  const [deleteInfo, setDeleteInfo] = useState({});
  const [deleteId, setDeleteId] = useState("");

  const fetchData = async () => {
    const employeeData = (
      await getDocs(query(collection(db, "employees"), orderBy("id")))
    ).docs.map((doc) => doc.data());
    setEmployees(employeeData);
  };

  const deleteEmployee = async () => {
    await onSnapshot(
      query(collection(db, "employees"), where("id", "==", deleteId)),
      (snapshot) => {
        snapshot.docs.forEach((item) => {
          deleteDoc(doc(db, "employees", item.id));
        });
      }
    );

    const databaseState = (await getDocs(query(collection(db, "utils"))))
      .docs[0];
    await updateDoc(doc(db, "utils", databaseState.id), {
      deletingFingerprintId: deleteInfo.fingerprintId,
    });

    setDeleteInfo({});
    setDeleteId("");
    setSelected(false);
    fetchData();
  };

  useEffect(() => {
    fetchData();
  }, []);

  const optionHandleChange = async (id) => {
    if (!selected) {
      setSelected(true);
    }
    const sqlResult = (
      await getDocs(query(collection(db, "employees"), where("id", "==", id)))
    ).docs[0];
    setDeleteId(id);
    setDeleteInfo(sqlResult.data());
  };
  let keys = [];
  Object.keys(deleteInfo).forEach((key) => {
    if (key != "attendance" && key != "image" && key != "id" && key != "name") {
      keys.push(key);
    }
  });
  console.log(keys);

  return (
    <div className="pt-12 pl-12">
      <h1 className="text-3xl font-bold mb-3">Delete</h1>
      <label for="id" className="font-bold">
        Choose employee to delete:{" "}
      </label>

      <select
        id="id"
        onClick={(e) => {
          optionHandleChange(e.target.value);
        }}
      >
        {employees.map((emp) => {
          return <option value={emp.id}>{emp.id}</option>;
        })}
      </select>
      <br />
      {selected && (
        <>
          <h1 className="text-red-500 font-bold text-2xl">Employee Info</h1>
          <div
            style={{ backgroundImage: `url(${deleteInfo.image})` }}
            className="aspect-[16/20] w-36 bg-no-repeat bg-center bg-cover"
          >
            {deleteInfo.image ? "" : "No Image"}
          </div>
          <h1>
            <span className="font-bold">Id: </span>
            <h1 className="ml-1 inline-block">{deleteInfo.id}</h1>
          </h1>
          <h1>
            <span className="font-bold">Name: </span>
            <h1 className="ml-1 inline-block">{deleteInfo.name}</h1>
          </h1>
          {keys.map((key) => {
            return (
              <h1>
                <span className="font-bold">{key}:</span>
                <h1 className="ml-1 inline-block">{deleteInfo[key]}</h1>
              </h1>
            );
          })}
          <br />
          <button
            className="border border-black mt-2 px-1 hover:bg-red-500"
            onClick={() => {
              toast.promise(deleteEmployee, {
                loading: "Loading",
                success: "Delete success",
                error: "Error when fetching",
              });
            }}
          >
            Delete
          </button>
        </>
      )}

      <br />
      <ToastContainer
        position="bottom-left"
        autoClose={1500}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </div>
  );
};

export default Delete;

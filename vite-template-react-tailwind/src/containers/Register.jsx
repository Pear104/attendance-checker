import React from "react";
import {
  collection,
  getDocs,
  addDoc,
  query,
  where,
  updateDoc,
  doc,
  onSnapshot,
  orderBy,
} from "firebase/firestore";
import { db } from "../firebase";
import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Register = () => {
  const pattern = new RegExp(/^[SHDCQ][AES][0-9]{6}$/);
  const [employees, setEmployees] = useState([]);
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [getting, setGetting] = useState(false);
  const [gotten, setGotten] = useState(false);
  const [currentFingerprintId, setCurrentFingerprintId] = useState(1);
  const [validation, setValidation] = useState(true);
  const [errorType, setErrorType] = useState("SUCCESS");

  const fetchData = async () => {
    const employeeData = (
      await getDocs(query(collection(db, "employees"), orderBy("id")))
    ).docs.map((doc) => doc.data());
    setEmployees(employeeData);
  };

  useEffect(() => {
    fetchData();
  }, []);

  onSnapshot(collection(db, "utils"), (snapshot) => {
    setGetting(snapshot.docs[0].data().isGettingFingerprint);
    setGotten(snapshot.docs[0].data().isGotten);
    setCurrentFingerprintId(snapshot.docs[0].data().currentFingerprintId);
  });

  const addFingerprint = async () => {
    const databaseState = (await getDocs(query(collection(db, "utils"))))
      .docs[0];
    await updateDoc(doc(db, "utils", databaseState.id), {
      ...databaseState.data(),
      isGettingFingerprint: true,
      isGotten: false,
    });
  };

  const addEmployee = async () => {
    try {
      let fingerprintId;
      const databaseState = (await getDocs(query(collection(db, "utils"))))
        .docs[0];
      fingerprintId = databaseState.data().currentFingerprintId;
      await updateDoc(doc(db, "utils", databaseState.id), {
        isGettingFingerprint: false,
        isGotten: false,
        currentFingerprintId: 0,
      });
      const sqlResult = (
        await getDocs(
          query(
            collection(db, "employees"),
            where("fingerprintId", "==", fingerprintId)
          )
        )
      ).docs[0];
      await updateDoc(doc(db, "employees", sqlResult.id), {
        id: id,
        name: name,
      });
      setId("");
      setName("");
    } catch (error) {
      console.log(error);
    }
  };

  const checkValidation = () => {
    if (!pattern.test(id)) {
      setValidation(false);
      return "FORMAT_ERROR";
    }
    if (employees.some((emp) => emp.id == id)) {
      setValidation(false);
      return "ID_ALREADY_EXIST";
    }
    setValidation(true);
    return "SUCCESS";
  };

  const renderValidation = () => {
    switch (errorType) {
      case "FORMAT_ERROR":
        return (
          <h1>
            The ID must follow the format S/H/C/Q/D + E/S/A + xxxxxx Ex:
            SE123456 or HS435623
          </h1>
        );
      case "ID_ALREADY_EXIST":
        return <h1>This ID is already exist</h1>;
      case "SUCCESS":
        return "";
    }
  };

  useEffect(() => {
    if (gotten && !getting) {
      toast.success("Add new fingerprint success");
    }
  }, [gotten]);

  return (
    <div className="pt-12 pl-12">
      <h1 className="text-3xl font-bold mb-3">Register</h1>
      <label for="id" className="font-bold">
        Fill in the employee's infomation:{" "}
      </label>
      <h1 className="font-bold w-1/2">
        {getting ? "Getting fingerprintId" : ""}
        {gotten
          ? "A new fingerprintid " +
            currentFingerprintId +
            " has just enroll. Now enter employee's information"
          : ""}
      </h1>
      <h1 className="pt-1">
        <label htmlFor="">Id: </label>
        <input
          value={id}
          type="text"
          name=""
          id=""
          className={
            "border " +
            (validation ? " border-black" : " border-2 border-red-600")
          }
          onChange={(e) => {
            setId(e.target.value);
          }}
          onBlur={() => {
            fetchData();
            setErrorType(checkValidation());
          }}
          onFocus={() => {
            setErrorType("SUCCESS");
          }}
        />
        {validation ? (
          ""
        ) : (
          <>
            <br />
            <h1 className="font-bold text-red-500">{renderValidation()}</h1>
          </>
        )}
      </h1>
      <div className="pt-2">
        <label htmlFor="">Name: </label>
        <input
          value={name}
          type="text"
          name=""
          id=""
          className={
            "border-2 " + (name != "" ? "border-black" : "border-red-500")
          }
          onChange={(e) => {
            setName(e.target.value);
          }}
        />
        <h1 className="font-bold text-base text-red-500">
          {name != "" ? "" : "Please dont forget this field"}
        </h1>
      </div>
      <div>
        <button
          className={
            "border border-black mt-2 px-1 hover:bg-red-500 " +
            (gotten ? "cursor-not-allowed" : "")
          }
          onClick={() => {
            addFingerprint();
            toast.info(
              <h1 className="font-bold text-base">
                Getting fingerprint template
              </h1>
            );
          }}
          disabled={gotten}
        >
          Get fingerprint
        </button>
        <button
          className={
            "border border-black mt-2 px-1 ml-2 hover:bg-red-500 " +
            (gotten && errorType == "SUCCESS" && name != ""
              ? ""
              : "cursor-not-allowed")
          }
          onClick={() => {
            checkValidation();
            if (validation) {
              if (errorType == "SUCCESS") {
                toast.promise(addEmployee, {
                  loading: "Loading",
                  success: "Add employee success",
                  error: "Error",
                });
              }
            }
          }}
          disabled={!(gotten && errorType == "SUCCESS" && name != "")}
        >
          Add to database
        </button>
      </div>
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

export default Register;

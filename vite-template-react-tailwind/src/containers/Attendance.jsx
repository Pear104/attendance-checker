import React, { useEffect } from "react";
import {
  collection,
  getDocs,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "../firebase";
import { useState } from "react";

const Table = ({ month, year }) => {
  const [employees, setEmployees] = useState([]);

  const fetchData = async () => {
    const employeeData = (
      await getDocs(query(collection(db, "employees"), orderBy("id")))
    ).docs.map((doc) => {
      return doc.data();
    });
    setEmployees(employeeData);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const rows = [];
  const have30days = [4, 6, 9, 11];
  let days;
  if (month == 2) {
    days = 28;
  } else if (have30days.includes(parseInt(month))) {
    days = 30;
  } else {
    days = 31;
  }
  const monthStr = month < 10 ? "0" + month : month + "";
  for (let i = 1; i <= days; i++) {
    rows.push(<th className="border border-black px-2">{i}</th>);
  }

  const empRows = [];
  for (let i = 0; i < employees.length; i++) {
    let keys = Object.keys(employees[i].attendance || {});
    let daywork = [];
    for (let j = 1; j <= days; j++) {
      daywork.push(
        keys.includes(`${j < 10 ? "0" + j : j}/${monthStr}/${year}`) ? (
          <th className="border border-black">X</th>
        ) : (
          <th className="border border-black"></th>
        )
      );
    }
    empRows.push(daywork);
  }
  return (
    <div className="pt-4 pl-12 pb-8">
      <h1 className="font-bold text-xl mb-1 text-red-600">
        Tháng {month}, năm {year}
      </h1>
      <table>
        <thead>
          <tr>
            <th className="border border-black px-2">ID</th>
            <th className="border border-black px-2">Name</th>
            {rows}
          </tr>
        </thead>
        <tbody>
          {employees.map((employee, index) => {
            return (
              <tr
                key={employee.id}
                className={
                  (index % 2 ? "bg-slate-300" : "") +
                  " hover:bg-cyan-300 transition-all duration-300"
                }
              >
                <td className="border border-black px-2">{employee.id}</td>
                <td className="border border-black px-2">{employee.name}</td>
                {empRows[index]}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

const Attendance = () => {
  const date = new Date().toLocaleString("en-GB", {
    timeZone: "Asia/Ho_Chi_Minh",
  });
  let a = date.slice(3, 5);
  let b = date.slice(6, 10);
  let c, d, e, f;
  if (a == "1") {
    c = "12";
    e = "11";
    f = d = parseInt(b) - 1;
  } else if (a == "2") {
    c = "1";
    e = "12";
    d = b;
    f = parseInt(b) - 1;
  } else {
    c = parseInt(a) - 1;
    e = parseInt(a) - 2;
    d = f = b;
  }
  return (
    <div>
      <h1 className="text-3xl font-bold mt-14 mx-14">Attendance</h1>
      <Table month={a} year={b} />
      <Table month={c} year={d} />
      <Table month={e} year={f} />
      <div className="h-40"></div>
    </div>
  );
};

export default Attendance;

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

const InOutTable = ({ date, employees }) => {
  let rows = [];
  employees.forEach((emp, index) => {
    if (emp.attendance[date]) {
      let cols = [];
      cols.push(<th className="border border-black px-2">{index + 1}</th>);
      cols.push(<th className="border border-black px-2">{emp.id}</th>);
      cols.push(<th className="border border-black px-2">{emp.name}</th>);

      for (let i = 0; i < 16; i++) {
        cols.push(
          <td className="border border-black px-2">
            {emp.attendance[date][i] || ""}
          </td>
        );
      }
      rows.push(<tr>{cols}</tr>);
    }
  });
  return (
    <div>
      <table className="">
        <thead>
          <tr>
            <th className="border border-black px-2">STT</th>
            <th className="border border-black px-2">ID</th>
            <th className="border border-black px-2">Name</th>
            <th className="border border-black px-2">In 1</th>
            <th className="border border-black px-2">Out 1</th>
            <th className="border border-black px-2">In 2</th>
            <th className="border border-black px-2">Out 2</th>
            <th className="border border-black px-2">In 3</th>
            <th className="border border-black px-2">Out 3</th>
            <th className="border border-black px-2">In 4</th>
            <th className="border border-black px-2">Out 4</th>
            <th className="border border-black px-2">In 5</th>
            <th className="border border-black px-2">Out 5</th>
            <th className="border border-black px-2">In 6</th>
            <th className="border border-black px-2">Out 6</th>
            <th className="border border-black px-2">In 7</th>
            <th className="border border-black px-2">Out 7</th>
            <th className="border border-black px-2">In 8</th>
            <th className="border border-black px-2">Out 8</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
    </div>
  );
};

const Attendance = () => {
  const [employees, setEmployees] = useState([]);
  const [date, setDate] = useState("");

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

  const dateNow = new Date().toLocaleString("en-GB", {
    timeZone: "Asia/Ho_Chi_Minh",
  });
  let a = dateNow.slice(3, 5);
  let b = dateNow.slice(6, 10);
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
      <div className="mx-14">
        <h1 className="text-3xl font-bold mb-3">Tra cứu lịch sử ra vào</h1>
        <input
          className="mb-3"
          type="date"
          name=""
          id=""
          onChange={(e) => {
            setDate(
              `${e.target.value.slice(8, 10)}/${e.target.value.slice(
                5,
                7
              )}/${e.target.value.slice(0, 4)}`
            );
          }}
        />
        {date && <InOutTable date={date} employees={employees} />}
        <div className="h-40"></div>
      </div>
    </div>
  );
};

export default Attendance;

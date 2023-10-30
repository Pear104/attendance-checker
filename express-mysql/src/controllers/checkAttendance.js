const {
  collection,
  getDocs,
  query,
  where,
  doc,
  updateDoc,
} = require("firebase/firestore");
const { db } = require("../firebase");

const postAttendance = async (req, res) => {
  try {
    const { fingerprintId } = req.body;
    const d = new Date().toLocaleString("en-GB", {
      timeZone: "Asia/Ho_Chi_Minh",
    });
    let fullDateStr = `${d.slice(0, 2)}/${d.slice(3, 5)}/${d.slice(6, 10)}`;
    let fullHourStr = `${d.slice(12, 14)}:${d.slice(15, 17)}:${d.slice(
      18,
      20
    )}`;
    console.log(
      `Employee with fingerprintId ${fingerprintId} has just veriry at ${fullHourStr}, ${fullDateStr}`
    );
    const querySnapshot = await getDocs(
      query(
        collection(db, "employees"),
        where("fingerprintId", "==", parseInt(fingerprintId))
      )
    );
    querySnapshot.forEach(async (item) => {
      let array = [];
      if (Object.keys(item.data()).includes("attendance")) {
        if (Object.keys(item.data().attendance).includes(fullDateStr)) {
          array = [...item.data().attendance[fullDateStr], fullHourStr];
        } else {
          array = [fullHourStr];
        }
        await updateDoc(doc(db, "employees", item.id), {
          attendance: {
            ...item.data().attendance,
            [fullDateStr]: array,
          },
        });
      } else {
        await updateDoc(doc(db, "employees", item.id), {
          attendance: {
            [fullDateStr]: [fullHourStr],
          },
        });
      }
    });
    return res.status(200).json({ message: "Verify successfully" });
  } catch (error) {
    return res.status(200).json({ message: "Verify failed" });
  }
};

module.exports = {
  postAttendance,
};

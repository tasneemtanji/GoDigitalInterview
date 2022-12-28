let currentUID = null;

function getDataFromLocalStorage() {
  const rawData = localStorage.getItem("data");
  let data;
  if (rawData) {
    data = JSON.parse(rawData);
  } else {
    data = [];
  }
  return data;
}

function setDataInDataLocalStorage(data) {
  localStorage.setItem("data", JSON.stringify(data));
}

function addRowToTable({ uid, fname, lname, email, phone }) {
  let table = document.getElementById("dataDisplay");
  let row = table.insertRow(table.rows.length);

  let fnameCell = row.insertCell(0);
  fnameCell.innerHTML = fname;

  let lnameCell = row.insertCell(1);
  lnameCell.innerHTML = lname;

  let emailCell = row.insertCell(2);
  emailCell.innerHTML = email;

  let phoneCell = row.insertCell(3);
  phoneCell.innerHTML = phone;

  let editCell = row.insertCell(4);

  const editBtn = document.createElement("BUTTON");
  editBtn.innerHTML = "Edit";
  editBtn.className = "edit-btn";
  editBtn.addEventListener("click", () => {
    editRow(uid);
  });
  editCell.appendChild(editBtn);

  let deleteCell = row.insertCell(5);
  const deleteBtn = document.createElement("BUTTON");
  deleteBtn.innerHTML = "Delete";
  deleteBtn.className = "delete-btn";
  deleteBtn.addEventListener("click", () => {
    deleteRow(uid);
  });
  deleteCell.appendChild(deleteBtn);
}

function refreshRows() {
  const data = getDataFromLocalStorage();
  let table = document.getElementById("dataDisplay");
  for (let index = 1; table.rows.length > 1; index++) {
    table.deleteRow(1);
  }
  data.forEach(addRowToTable);
}

function getFormValue(field, validation = (value) => "") {
  const value = field.value;
  let errMessage = "";
  if (!field.checkValidity()) {
    errMessage = field.validationMessage;
  } else {
    console.log({ value });
    errMessage = validation(value);
  }
  setErrorMessage(field.name, errMessage);
  return [value, errMessage];
}

function setErrorMessage(fieldname, errMessage) {
  document.getElementById(fieldname + "ErrMsg").innerHTML = errMessage;
}

function deleteRow(uid) {
  let data = getDataFromLocalStorage();
  setDataInDataLocalStorage(data.filter((row) => row.uid !== uid));
  refreshRows();
}

function editRow(uid) {
  let data = getDataFromLocalStorage().find((row) => row.uid === uid);
  const { fname, lname, email, phone } = document.forms.mainForm;
  currentUID = data.uid;
  fname.value = data.fname;
  lname.value = data.lname;
  email.value = data.email;
  phone.value = data.phone;
}

function addRow(newRow) {
  let data = getDataFromLocalStorage();

  if (currentUID) {
    setDataInDataLocalStorage(
      data.map((row) =>
        row.uid === currentUID ? { ...newRow, uid: currentUID } : row
      )
    );
    currentUID = null;
  } else {
    setDataInDataLocalStorage([...data, newRow]);
  }
  refreshRows();
}

function submitForm() {
  const { fname, lname, email, phone } = document.forms.mainForm;

  const [fnameValue, fnameErrMessage] = getFormValue(fname);
  const [lnameValue, lnameErrMessage] = getFormValue(lname);
  const [emailValue, emailErrMessage] = getFormValue(email);
  const [phoneValue, phoneErrMessage] = getFormValue(phone, (value) => {
    if (!value.match(/^\d{10}$/)) {
      return "Enter a valid phone no";
    }
    return "";
  });
  if (
    !(fnameErrMessage || lnameErrMessage || emailErrMessage || phoneErrMessage)
  ) {
    addRow({
      uid: new Date().getTime(),
      fname: fnameValue,
      lname: lnameValue,
      email: emailValue,
      phone: phoneValue
    });

    fname.value = "";
    lname.value = "";
    email.value = "";
    phone.value = "";
  }
}

window.addEventListener("load", (event) => {
  refreshRows();
});

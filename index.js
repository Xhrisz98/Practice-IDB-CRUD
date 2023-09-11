const IDBRequest = indexedDB.open("DATA BASE", 1);

IDBRequest.addEventListener("upgradeneeded", () => {
  console.log("Base de datos creada correctamente");
  const dataBase = IDBRequest.result;
  dataBase.createObjectStore("nombres", {
    autoIncrement: true,
  });
});

IDBRequest.addEventListener("success", () => {
  console.log("Base de datos abierta correctamente");
  readObject();
});
IDBRequest.addEventListener("error", () => {
  console.log("Se ha producido un error al tratar de abrir la base de datos");
});
///Agrega los elementos despues de dar click
document.getElementById("add").addEventListener("click", () => {
  let nombre = document.getElementById("name").value;
  if (nombre.length > 0) {
    if (document.querySelector(".posible") !== undefined) {
      if (confirm("Hay elementos sin guardar: Quieres continuar?")) {
        addObject({ nombre });
        nombre.vale = "";
        readObject();
      } else {
        addObject({ nombre });
        readObject();
      }
    }
  }
});

const addObject = (object) => {
  const IDBData = getIDBData("readwrite", "Objeto agregado correctamente");
  IDBData.add(object);
};

const modifyObject = (key, object) => {
  const IDBData = getIDBData("readwrite", "Objeto modificado correctamente");
  IDBData.put(object, key);
};

const deleteObject = (key) => {
  const IDBData = getIDBData("readwrite", "Objeto elimidado correctamente");
  IDBData.delete(key);
};

const readObject = () => {
  const IDBData = getIDBData("readonly");
  const cursor = IDBData.openCursor();
  const fragment = document.createDocumentFragment(); ///Agregar los valores de NombreHTML
  document.querySelector(".nombres").innerHTML = "";
  cursor.addEventListener("success", () => {
    if (cursor.result) {
      let element = namesHTML(cursor.result.key, cursor.result.value);
      fragment.appendChild(element);
      cursor.result.continue();
    } else document.querySelector(".nombres").appendChild(fragment);
  });
};

const getIDBData = (mode, msg) => {
  const dataBase = IDBRequest.result;
  const IDBtransaction = dataBase.transaction("nombres", mode);
  const objectStore = IDBtransaction.objectStore("nombres");
  IDBtransaction.addEventListener("complete", () => {
    console.log(msg);
  });
  return objectStore;
};
/// Funcion para agregar elementos y dar funcion a los botones;
const namesHTML = (id, nombre) => {
  const DIV = document.createElement("DIV");
  const H2 = document.createElement("H2");
  const Options = document.createElement("DIV");
  const saveButton = document.createElement("BUTTON");
  const deleteButton = document.createElement("BUTTON");

  saveButton.textContent = "Save";
  deleteButton.textContent = "Delete";

  H2.textContent = nombre.nombre;
  H2.setAttribute("contenteditable", "true");
  H2.setAttribute("spellcheck", "false");

  DIV.classList.add("nombre");
  Options.classList.add("options");
  saveButton.classList.add("imposible");
  deleteButton.classList.add("delete");

  Options.appendChild(saveButton);
  Options.appendChild(deleteButton);
  DIV.appendChild(H2);
  DIV.appendChild(Options);

  H2.addEventListener("keyup", () => {
    saveButton.classList.replace("imposible", "posible");
  });
  saveButton.addEventListener("click", () => {
    if (saveButton.className == "posible") {
      modifyObject(id, { nombre: H2.textContent });
      saveButton.classList.replace("posible", "imposible");
    }
  });
  deleteButton.addEventListener("click", () => {
    deleteObject(id);
    document.querySelector(".nombres").removeChild(DIV);
  });

  return DIV;
};

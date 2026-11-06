const fragment = document.createDocumentFragment();
const form = document.querySelector("#inventory-form");
const errorLog = document.querySelector("#error-log");
const tableBody = document.querySelector("#inventory-table");

const INVENTORY_NAME = "inventory";

const isValidName = (name) => {
    const nameRegexp = /^[a-zA-Z0-9_-]+$/;
    return nameRegexp.test(name) && name != "";
};

const loadData = () => {
    return JSON.parse(localStorage.getItem(INVENTORY_NAME)) || [];
}

const saveData = (data) => {
    localStorage.setItem(INVENTORY_NAME, JSON.stringify(data));
}

const addItem = (itemName) => {
    const inventoryData = loadData();

    const item = inventoryData.find(({ name }) => {
        return name === itemName;
    });

    if (item) {
        item.count += 1;
    } else {
        inventoryData.push({ name: itemName, count: 1 });
    }

    saveData(inventoryData);
};

const removeItem = (itemName) => {
    const inventoryData = loadData();

    const item = inventoryData.find(({ name }) => {
        return name === itemName;
    });

    if (item) {
        item.count -= 1;

        if (item.count <= 0) {
            inventoryData.splice(inventoryData.indexOf(item), 1);
        }

        saveData(inventoryData);
    }
};

const display = () => {
    tableBody.innerHTML = "";

    const inventoryData = loadData();

    inventoryData.forEach(({ name, count }) => {
        const tableRow = document.createElement("tr");
        const tableDataName = document.createElement("td");
        tableDataName.innerText = name;
        const tableDataCount = document.createElement("td");
        tableDataCount.innerText = count;
        const tableDataAction = document.createElement("td");
        const buttonElement = document.createElement("button");
        buttonElement.innerText = "Eliminar"
        buttonElement.dataset.tag = name;

        tableDataAction.appendChild(buttonElement);
        tableRow.appendChild(tableDataName);
        tableRow.appendChild(tableDataCount);
        tableRow.appendChild(tableDataAction);

        fragment.appendChild(tableRow);
    });

    tableBody.appendChild(fragment);
};

form.addEventListener("submit", (event) => {
    event.preventDefault();

    const itemName = form.elements["item-name"].value;

    errorLog.innerText = "";
    if (!isValidName(itemName)) {
        errorLog.innerText = "ERROR: El nombre del producto no es valido.";
        return;
    }

    addItem(itemName);
    display();
});

document.addEventListener("click", (event) => {
    let tag = event.target.dataset.tag;
    if (tag) {
        removeItem(tag);
        display();
    }
});

display();
const itemForm = document.querySelector('#item-form');
const itemInput = document.querySelector('#item-input');
const itemList = document.querySelector('#item-list');
const clearBtn = document.querySelector('#clear');
const filter = document.querySelector('.filter');
const formBtn = itemForm.querySelector('button');
let EditMode = false;

// console.log(items);

function displayItems() {
  const itemsFromStorage = getItemsFromStorage();
  // console.log(itemsFromStorage);
  itemsFromStorage.forEach((item) => {
    AddItemsToDOM(item)
  });
  resetUI()
;}

// Adding items
function onSubmitAddItems(e) {
  const newItem = itemInput.value;
  itemInput.value = '';
  e.preventDefault();

  //Verifying if the input field has data or not
  if (newItem === '') {

    alert('Please add an item!');

  } else {

    // Verifying if the item to be added already exists or not.
    const ExistingListItems = document.querySelectorAll('#item-list li');

    for (let i = 0; i < ExistingListItems.length; i++) {
      // console.log(ExistingListItems[i].textContent);
      if (ExistingListItems[i].textContent === newItem) {
        itemInput.value = '';
        alert(`${newItem} already exists`);
        return;
      }
    }

    if (EditMode) {
      const itemToEdit = itemList.querySelector('.editmode');
      // console.log(itemToEdit.innerText);
      removeItemfromStorage(itemToEdit.innerText);
      itemToEdit.classList.remove('editmode');
      itemToEdit.remove();
      EditMode = false;
    }

    // creating and adding new element to the DOM.
    AddItemsToDOM(newItem);

    // creating and adding new item to the local storage.
    AddItemsToLocalStorage(newItem);

    resetUI();
  }
}

//Adding items to DOM
function AddItemsToDOM(item) {
  const li = document.createElement('li');
  li.innerText = item;

  const button = createButton('remove-item btn-link text-red');

  li.appendChild(button);

  itemList.appendChild(li);

  // console.log(li)
}


function createButton(classes) {
  const button = document.createElement('button');
  button.className = classes;

  const icon = createIcon('fa-solid fa-xmark');
  button.appendChild(icon);

  return button;
}

function createIcon(classes) {
  const i = document.createElement('i');
  i.className = classes;

  return i;
}

//Adding items to Local Storage
function AddItemsToLocalStorage(item) {
  let itemsFromStorage = getItemsFromStorage();

    // adding elements to array.
    itemsFromStorage.push(item);

    // console.log(JSON.parse(localStorage.getItem('items')));

    // Convert to JSON string and set to local storage
    localStorage.setItem('items', JSON.stringify(itemsFromStorage));
}

// Displaying items from local storage
getItemsFromStorage = () => {
  let itemsFromStorage;
  if (localStorage.getItem('items') === null) {
    itemsFromStorage = [];
  } else {
    itemsFromStorage = JSON.parse(localStorage.getItem('items'));
  }
  return itemsFromStorage
}


function onClickRemove(e) {
  if (e.target.parentElement.classList.contains('remove-item')) {
    RemoveItems(e.target.parentElement.parentElement);
  } else{
    // console.log(1);
    setItemToEdit(e.target);
  }
}

setItemToEdit = (item) => {
  EditMode = true;

  itemList.querySelectorAll('li').forEach(i => {
    i.classList.remove('editmode');
  });

  item.classList.add('editmode');
  formBtn.innerHTML = `<i class="fa-solid fa-pen"></i>
   Update Item`;
  formBtn.style.backgroundColor = "#228B22"
  itemInput.value = item.textContent;
}


function RemoveItems(item) {
  // Removing items individually from DOM
  if (confirm('Are you sure? ')) {
    item.remove();
  }

  // Removing items individually from storage
  removeItemfromStorage(item.textContent);

  resetUI();
}

function removeItemfromStorage(text) {
  let itemsFromStorage = getItemsFromStorage();

  // filter out the items
  itemsFromStorage = itemsFromStorage.filter((i) => i !== text);

  //console.log(itemsFromStorage);

  localStorage.setItem('items', JSON.stringify(itemsFromStorage));

}


// Removing all items
function clearAll(e) {
  if (confirm('Are you sure?')) {
    while (itemList.firstChild) {
      itemList.firstChild.remove();
      // itemList.removeChild(itemList.firstChild);
    }

    // clear from local storage
    localStorage.removeItem('items');
    
    resetUI();
  }
}

// Filtering Items
function filterItems(e) {
  let inputValue = e.target.value.toLowerCase();
  // console.log(inputValue);

  const ExistingListItems = document.querySelectorAll('#item-list li');

  ExistingListItems.forEach((item) => {
    const itemText = item.textContent.toLowerCase();

    // console.log(itemText);
    if (itemText.indexOf(inputValue) !== -1) {
      // Checks if the text in the list items contains the inputValue we are entering,
      //If it exists then indexOf value will return the position or else returns -1

      item.style.display = 'flex';
    } else {
      item.style.display = 'none';
    }
  });
}

resetUI = () => {
  itemInput.value = '';
  const items = itemList.querySelectorAll('li');
  // console.log(items)
  if (items.length === 0) {
    clearBtn.style.display = 'none';
    filter.style.display = 'none';
  } else {
    clearBtn.style.display = 'block';
    filter.style.display = 'block';
  }
  formBtn.innerHTML = ` <i class="fa-solid fa-plus"></i> Add Item`
  formBtn.style.backgroundColor = 'black'
  EditMode = false;
};

// Event Listeners
itemForm.addEventListener('submit', onSubmitAddItems);
itemList.addEventListener('click', onClickRemove);
clearBtn.addEventListener('click', clearAll);
filter.addEventListener('input', filterItems);
document.addEventListener('DOMContentLoaded', displayItems);

resetUI();

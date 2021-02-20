let bookArray = [];

//If there are books stored in local storage convert them back to book objects and store them in the array
if(localStorage.getItem('library')) {
    bookArray = JSON.parse(localStorage.getItem('library')).map(el => new Book(el.title, el.author, el.numOfPages, el.bookHasBeenRead));
};

const persistLibrary = () => {
    localStorage.setItem('library', JSON.stringify(bookArray));
};

const showPopUp = function() {
    const popUp = document.createElement('div');
    const popUpBox = document.createElement('div');
    const titleInput = document.createElement('input');
    const authorInput = document.createElement('input');
    const pagesInput = document.createElement('input');
    const cancelButton = document.createElement('button');
    const addButton = document.createElement('button');

    popUp.className = 'popup';
    popUpBox.className = 'popup__box';
    [titleInput, authorInput, pagesInput].forEach(el => el.className = 'popup__box-input');
    cancelButton.className = 'popup__box-button cancel';
    addButton.className = 'popup__box-button add';

    titleInput.placeholder = 'Title';
    authorInput.placeholder ='Author';
    pagesInput.placeholder = 'Number of Pages';
    cancelButton.textContent = 'Cancel';
    addButton.textContent = 'Add';


    [titleInput, authorInput, pagesInput, cancelButton, addButton].forEach(el => popUpBox.append(el));
    popUp.append(popUpBox);
    this.parentElement.append(popUp);
    this.parentElement.style.border = 'none';
    this.parentElement.children[0].style.display = 'none';

    cancelButton.addEventListener('click', ()=> {
        popUp.remove();
        this.parentElement.style.border = '1px solid black';
        this.parentElement.children[0].style.display = 'block';
    });

    addButton.addEventListener('click', ()=> {
        const readStatus = this.parentElement.className == 'library library__unread' ? false : true;
        new Book(titleInput.value, authorInput.value, pagesInput.value, readStatus).build();

        popUp.remove();
        this.parentElement.style.border = '1px solid black';
        this.parentElement.children[0].style.display = 'block';
    });
};


function Book(title, author, numOfPages, bookHasBeenRead) {
    this.title = title;
    this.author = author;
    this.numOfPages = numOfPages;
    this.bookHasBeenRead = bookHasBeenRead;
}

Book.prototype.build = function() {
    const book = document.createElement('div');
    book.className = 'book';

    //If the current instance calling .build() is not in the array add it and add its index to the DOM element
    const indexOfThis = bookArray.findIndex(el => el == this);

    if(indexOfThis < 0) {
        bookArray.push(this);
        book.dataset.index = bookArray.length - 1;
        persistLibrary();
    } else {
        book.dataset.index = indexOfThis;
    }

    //Build book element
    const title = document.createElement('h1');
    const author = document.createElement('h1');
    const pages = document.createElement('h1');
    const swapButton = document.createElement('h1');
    const deleteButton = document.createElement('h1');

    title.className = 'book__title';    
    author.className = 'book__author';
    pages.className = 'book__pages';
    swapButton.className = 'book__swap';
    deleteButton.className = 'book__delete';
    deleteButton.innerHTML = '<i class="fas fa-trash-alt"></i>';
    swapButton.innerHTML = '<i class="fas fa-sync"></i>'

    title.textContent = this.title;
    author.textContent = this.author;
    pages.textContent = this.numOfPages;

    [title, author, pages, swapButton, deleteButton].forEach(el => book.append(el));

    deleteButton.addEventListener('click', () => this.destroy());
    swapButton.addEventListener('click', ()=> this.swapReadStatus());
    
    //Insert the book element into the correct library
    this.bookHasBeenRead ? document.getElementById('addReadBook').insertAdjacentElement('beforebegin', book) : document.getElementById('addUnreadBook').insertAdjacentElement('beforebegin', book);

}

Book.prototype.destroy = function() {
    //Remove the current instance from the array and the DOM element with the matching index
    const index = bookArray.findIndex(el => el == this);
    bookArray.splice(index, 1);
    document.querySelector(`[data-index="${index}"]`).remove();

    
    //After deleting element from page shift all elements with a higher index than the one deleted down one so they match their new index position
    Array.from(document.querySelectorAll('.book')).forEach(el => {
        if(el.dataset.index > index) {
            el.dataset.index = el.dataset.index - 1;
        }
    });

    persistLibrary();
}

Book.prototype.swapReadStatus = function() {
    this.destroy();
    this.bookHasBeenRead ? this.bookHasBeenRead = false : this.bookHasBeenRead = true;
    this.build();
}

//Build the stored books
bookArray.forEach(el => el.build());

//Add event listeners for add book buttons
Array.from(document.querySelectorAll('.add-book')).forEach(el => {
    el.addEventListener('click', showPopUp);
})

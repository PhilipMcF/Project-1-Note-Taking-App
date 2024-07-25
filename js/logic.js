// queried HTML elements.
const modalForm = document.querySelector('#note-entry');
const noteSubject = document.querySelector('#subject');
const noteText = document.querySelector('#write_note');
const noteList = document.querySelector('.collection');
const noteContentDisplay = document.querySelector('.main-display');
const exitForm = document.querySelector('#exit-form');
const formValidation = document.querySelector('#validation-error');

// reads local storage; returns empty array if null.
function readLocalStorage() {
  const data = localStorage.getItem('notes');
  return data ? JSON.parse(data) : [];
}

// creates an object based on user entry
function createNoteEntry(subject, text) {
  let noteEntry = {
    subject: subject.value,
    note: text.value,
  };
  return noteEntry;
}

// adds object to local storage; if item exists, pushes object to array; else, creates an object in an array. 
function addLocalStorageNote(obj) {
  let notes = readLocalStorage();
  if (notes) {
    notes.push(obj);
    localStorage.setItem('notes', JSON.stringify(notes));
  } else {
    notes = [obj];
    localStorage.setItem('notes', JSON.stringify(notes));
  }
}

// builds parent div, note link and corresponding delete button.
function buildLink(linkName) {
  const linkContainer = document.createElement('div');
  const noteLink = document.createElement('a');
  const deleteNote = document.createElement('a');
  noteLink.setAttribute('class', 'collection-item');
  noteLink.setAttribute('href', '#!');
  noteLink.textContent = linkName;
  noteLink.style.cssText = 'width: 70%';
  deleteNote.classList.add('waves-effect', 'waves-light', 'btn-small', 'delete-link');
  deleteNote.textContent = 'Delete';
  deleteNote.style.cssText = 'width: 25%; height: 100%; margin-left: 10px;';
  linkContainer.style.cssText = 'display: flex; align-items: center;';
  linkContainer.appendChild(noteLink);
  linkContainer.appendChild(deleteNote);
  noteList.appendChild(linkContainer);
}

// searches local storage for 'searchValue' note to delete. functions is tied to the delete button.
function deleteLink(searchValue) {
  let notes = readLocalStorage();

  for (entry in notes) {
    if (searchValue === notes[entry]['subject']) {
      notes.splice(entry, 1);
    }
  }
  if (notes.length === 0) {
    localStorage.clear();
    window.location.reload();
    return;
  }
  localStorage.setItem('notes', JSON.stringify(notes));
  window.location.reload();
}

// displays all note links on window load.
function displayLinks() {
  const notes = readLocalStorage();
  for (entry of notes) {
    buildLink(entry['subject']);
  }
}

// iterates through local storage and builds display content for the main content area.
function displayNoteContent(searchNote) {
  const notes = readLocalStorage();
  for (entry of notes) {
    if (searchNote === entry['subject']) {
      buildContent(entry['note']);
    }
  }
}

// searches all links in the aside and removes the 'active' class from each element.
function removeActiveClass() {
  noteList.querySelectorAll('a').forEach(function (el) {
    el.classList.remove('active');
  });
}

// builds the HTML content 
function buildContent(noteContent) {
  const contentContainer = document.createElement('p');
  contentContainer.textContent = noteContent;
  noteContentDisplay.appendChild(contentContainer);
}

// checks if form input fields have content; returns user error if missing inner text.
function validateForm(subject, text) {
  if (subject.value.trim().length === 0 || text.value.trim().length === 0) {
    formValidation.textContent = 'Please fill our all the fields';
    return false;
  }
  return true;
}

// validates if the user entered subject is unique to local storage. if not unique, an error message is displayed, a unique subject must then be entered.
function searchNotes(subject) {
  const notes = readLocalStorage();
  let subjectText = subject.value;

  for (entry of notes) {
    if (entry['subject'] === subjectText) {
      formValidation.textContent = `Please enter a unique subject name. Refrain from using ${subjectText}`;
      return false;
    }
  }
  return true;
}

// clears all of the form's input fields (On exit & submit)
function clearForm() {
  modalForm.reset();
}

// form submission events:
/* 
1. Validate the subject input.
2. Require content in all input fields.
3. Return from form submission if either subject or form validation are false.
4. Clear any error message on the form.
5. Create note object based on use input (subject, content).
6. Add the object to local storage.
7. Capture the link name and build the content to display on the page.
8. Clear form input fields.
*/
function handleFormSubmit(event) {
  event.preventDefault();

  const subjectValidation = searchNotes(noteSubject);
  const validate = validateForm(noteSubject, noteText);

  if (!validate || !subjectValidation) {
    return;
  }

  formValidation.textContent = '';

  const entry = createNoteEntry(noteSubject, noteText);
  addLocalStorageNote(entry);

  linkName = noteSubject.value;
  buildLink(linkName);

  clearForm();
}

// initiates the form submission from the submit button.
modalForm.addEventListener('submit', handleFormSubmit);

// clears the form input fields and hides the modal window.
exitForm.addEventListener('click', clearForm);

// initiates the load function on page refresh/load.
window.addEventListener('load', displayLinks);

/* 
1. Deletes the link when the 'delete' button is clicked.
2. Makes the link active and only shows note content on the page from the corresponding note.
*/
noteList.addEventListener('click', function (e) {
  if (e.target.classList.contains('delete-link')) {
      const linkValue = e.target.parentElement.children[0].innerHTML;
      deleteLink(linkValue);
      return;
  } 
  if (e.target.classList.contains('collection-item')) {
    removeActiveClass();
    noteContentDisplay.innerHTML = '';
    displayNoteContent(e.target.innerHTML);
    e.target.classList.add('active');
  } 
});

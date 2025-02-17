// queried HTML elements
const modalForm = document.querySelector('#note-entry');
const noteSubject = document.querySelector('#subject');
const noteList = document.querySelector('.main-collection');
const noteContentDisplay = document.querySelector('.main-display');
const exitForm = document.querySelector('#exit-form');
const formValidation = document.querySelector('#validation-error');
const cardSubject = document.querySelector('#subject-title');

// queried HTML elements for edit form
const editForm = document.querySelector('#edit-entry');
const editSubject = document.querySelector('#editSubject');
const editValidation = document.querySelector('#edit-validation-error');
let oldSubject = '';

// sidenav HTML elements for generating 'notelist' 
const sidenavNoteContainer = document.querySelector('.sidenav-collection');
const sidenavContentDisplay = document.querySelector('#sidenav');


// reads local storage; returns empty array if null
function readLocalStorage() {
  const data = localStorage.getItem('notes');
  return data ? JSON.parse(data) : [];
}

// creates an object based on user entry
function createNoteEntry(subject, text) {
  let noteEntry = {
    subject: subject.value,
    note: text,
  };
  return noteEntry;
}

// adds object to local storage; if item exists, pushes object to array; else, creates an object in an array 
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

// builds parent div, note link and corresponding delete button
function buildLink(linkName) {
  const linkContainer = document.createElement('div');
  const noteLink = document.createElement('a');
  const deleteNote = document.createElement('a');
  const editNote = document.createElement('a'); // create edit button element
  noteLink.setAttribute('class', 'collection-item');
  noteLink.setAttribute('href', '#!');
  noteLink.textContent = linkName;
  noteLink.style.cssText = 'width: 70%; white-space: nowrap; overflow: hidden; text-overflow: ellipsis';
  deleteNote.classList.add('material-icons', 'waves-effect', 'waves-light', 'delete-link');
  deleteNote.textContent = 'delete';
  deleteNote.style.cssText = ' height: 100%; margin-left: 10px; color: orange;';
  linkContainer.style.cssText = 'display: flex; align-items: center; text-overflow: ellipsis';
  editNote.classList.add('material-icons', 'waves-effect', 'waves-light', 'teal-text', 'text-lighten-3', 'edit-link'); // add class to = edit button
  editNote.textContent = 'edit'; // set it as 'edit' to make it a edit button with Materialize
  editNote.style.cssText = 'margin-left: 0.5rem'; // style edit button
  linkContainer.appendChild(noteLink);
  linkContainer.appendChild(editNote); // append edit button to link container
  linkContainer.appendChild(deleteNote);
  noteList.appendChild(linkContainer);
  const sidenavLinkContainer = linkContainer.cloneNode(true);
  sidenavNoteContainer.appendChild(sidenavLinkContainer);
}

// searches local storage for 'searchValue' note to delete. functions is tied to the delete button
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

// displays all note links on window load
function displayLinks() {
  const notes = readLocalStorage();
  for (entry of notes) {
    buildLink(entry['subject']);
  }
}

// iterates through local storage and builds display content for the main content area
function displayNoteContent(searchNote) {
  const notes = readLocalStorage();
  for (entry of notes) {
    if (searchNote === entry['subject']) {
      buildContent(entry['subject'], entry['note']);
    }
  }
}

// searches all links in the aside and removes the 'active' class from each element
function removeActiveClass() {
  noteList.querySelectorAll('a').forEach(function (el) {
    el.classList.remove('active');
  });

  sidenavNoteContainer.querySelectorAll('a').forEach(function (el) {
    el.classList.remove('active');
  });
}

// builds the HTML content 
function buildContent(noteSubject, noteContent) {
  editNoteEditor.setContents(noteContent);
  noteContentDisplay.innerHTML = editNoteEditor.root.innerHTML;
  cardSubject.textContent = noteSubject;
  console.log(noteContent);
}

// checks if form input fields have content; returns user error if missing inner text
function validateForm(subject, text) {
  if (subject.value.trim().length === 0 || text.trim().length === 0) {
    formValidation.textContent = 'Please fill out all the fields';
    editValidation.textContent = 'Please fill out all the fields';
    return false;
  }
  return true;
}

// validates if the user entered subject is unique to local storage. if not unique, an error message is displayed, a unique subject must then be entered
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

// validates if edited subject is the same as old subject; check if the new subject is unique
function validateEditSubject(subject) {
  const notes = readLocalStorage();
  let subjectText = subject.value;

  for (entry of notes) {
    if (subjectText === oldSubject) {
      return true;
    }
    if (subjectText !== oldSubject && entry['subject'] === subjectText) {
      editValidation.textContent = `Please enter a unique subject name. Refrain from using ${subjectText}`;
      return false;
    }
  }
  return true;
}
// clears all of the form's input fields (On exit & submit)
function clearForm() {
  modalForm.reset();
  editForm.reset();
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
  let editNote = addNoteEditor.getContents();
  let editNoteText = addNoteEditor.getText();
  const subjectValidation = searchNotes(noteSubject);
  const validate = validateForm(noteSubject, editNoteText);

  if (!validate || !subjectValidation) {
    return;
  }

  formValidation.textContent = '';

  const entry = createNoteEntry(noteSubject, editNote);
  addLocalStorageNote(entry);

  linkName = noteSubject.value;
  buildLink(linkName);

  clearForm();
  addNoteEditor.setContents([{ insert: '\n' }]);
  window.location.reload();
}

// updates the note in local storage 
function handleEditSubmit(event) {
  event.preventDefault();

  let editNote = editNoteEditor.getContents();
  let editNoteText = editNoteEditor.getText();
  // validate before editing local storage 
  const subjectValidation = validateEditSubject(editSubject);
  const validate = validateForm(editSubject, editNoteText);

  if (!validate || !subjectValidation) {
    return;
  }

  editValidation.textContent = '';

  // update local storage with new note
  const notes = readLocalStorage();

  for (entry of notes) {
    if (entry['subject'] === oldSubject) {
      entry['subject'] = editSubject.value;
      entry['note'] = editNote;
      localStorage.setItem('notes', JSON.stringify(notes));
    }
  }

  noteList.innerHTML = '';
  displayLinks();
  noteContentDisplay.innerHTML = '';
  displayNoteContent(editSubject.value);

  // closes #edit-modal window
  $(document).ready(function () {
    $('#edit-modal').modal('close');
  });

  clearForm();
  window.location.reload();
}

// initiates the form submission from the submit button
modalForm.addEventListener('submit', handleFormSubmit);

// clears the form input fields and hides the modal window
exitForm.addEventListener('click', clearForm);

// initiates the load function on page refresh/load
window.addEventListener('load', displayLinks);

// submission for edit form
editForm.addEventListener('submit', handleEditSubmit);

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
  // edit button event listener
  if (e.target.classList.contains('edit-link')) {
    const notes = readLocalStorage();
    const subjectLabel = document.querySelector('label[for="editSubject"]');
    // const textareaLabel = document.querySelector('label[for="edit_note"]');
    subjectLabel.classList.add('active');
    // textareaLabel.classList.add('active');

    for (entry of notes) {
      if (e.target.parentElement.children[0].innerHTML === entry['subject']) {
        editSubject.value = entry['subject'];
        editNoteEditor.setContents(entry['note']);
        oldSubject = entry['subject'];
      }
    }
    editValidation.textContent = '';

    // opens #edit-modal window
    $(document).ready(function () {
      $('#edit-modal').modal('open');
    });
  }
});

sidenavContentDisplay.addEventListener('click', function (e) {
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
  // edit button event listener
  if (e.target.classList.contains('edit-link')) {
    const notes = readLocalStorage();
    // makes labels active to look cleaner; couldn't do it inline in HTML
    const subjectLabel = document.querySelector('label[for="editSubject"]');
    // const textareaLabel = document.querySelector('label[for="edit_note"]');
    subjectLabel.classList.add('active');
    // textareaLabel.classList.add('active');

    for (entry of notes) {
      if (e.target.parentElement.children[0].innerHTML === entry['subject']) {
        editSubject.value = entry['subject'];
        editNoteEditor.setContents(entry['note']);
        oldSubject = entry['subject'];
      }
    }

    editValidation.textContent = '';

    // opens #edit-modal window
    $(document).ready(function () {
      $('#edit-modal').modal('open');
    });
  }
});

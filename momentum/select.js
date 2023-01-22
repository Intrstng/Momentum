// Todo app

const createTodoNoteBtn = document.querySelector('.btn-todo');
const todoNotesConatiner = document.querySelector('.todo__field');
const todoNotesCreateItem = document.querySelector('.todo__note');
const todoTextArea = document.forms.todoform.todo
const approveCreateTodoNoteBtn = document.querySelector('.todo-btn-ok');
const cancelCreateTodoNoteBtn = document.querySelector('.todo-btn-close');
let todoOpened = false;
let todoNotes = [];

// Close Todo create item (textarea input) by Escape or click outside of Todo create item
const closeTodoItemByAction = () => {
  document.addEventListener('keyup', (event) => {
    // Close Todo create item (textarea input) by Escape
    if (event.code === 'Escape') {
      todoNotesCreateItem.classList.remove('todo__note_active');
      todoOpened = false;
      todoTextArea.value = '';
      // или можно // showTodoCreateItem();
    }
  }); 
    // Close Todo create item (textarea input)  by click outside of settings menu
  document.addEventListener('click', (event) => {
    if (todoOpened == true) {
       const withinTodoBoundaries = event.composedPath().includes(todoNotesCreateItem);
        if (!withinTodoBoundaries && !(event.target == createTodoNoteBtn)) {
          showTodoCreateItem();
        }
    }
  });
    // Close Todo item by click on X button
    cancelCreateTodoNoteBtn.addEventListener('click', showTodoCreateItem);
}

// Show / hide todo create item (textarea input)
const showTodoCreateItem = () => {
  if (!todoOpened) {
    todoNotesCreateItem.classList.add('todo__note_active');
    todoOpened = true;
    approveCreateTodoNoteBtn.addEventListener('click', createTodoNoteByClick);
    todoNotesCreateItem.addEventListener('keyup', createTodoNoteByEnter);
    closeTodoItemByAction();
  } else {
    todoNotesCreateItem.classList.remove('todo__note_active');
    todoTextArea.value = '';
    todoOpened = false;
    approveCreateTodoNoteBtn.removeEventListener('click', createTodoNoteByClick);
    todoNotesCreateItem.removeEventListener('keyup', createTodoNoteByEnter);
  } 
}
createTodoNoteBtn.addEventListener('click', showTodoCreateItem);

const marginTodoNote = () => {
  const marginValues = ['-5px', '1px', '5px', '10px', '15px', '20px'];
  const randomIndexArr = Math.floor(Math.random() * (marginValues.length)); // min + Math.random() * (max - min)
  return marginValues[randomIndexArr];
}
// Random styles for Todo Note
const rotateTodoNote = () => {
  const rotateValues = ['rotate(3deg)', 'rotate(1deg)', 'rotate(-1deg)', 'rotate(-3deg)', 'rotate(-5deg)', 'rotate(-10deg)'];
  const randomIndexArr = Math.floor(Math.random() * (rotateValues.length)); // min + Math.random() * (max - min)
  return rotateValues[randomIndexArr];
}

const colorTodoNote = () => {
  const colorValues = ['#c2ff3d', '#ff3de8', '#3dc2ff', '#04e022', '#bc83e6', '#ebb328'];
  const randomIndexArr = Math.floor(Math.random() * (colorValues.length)); // min + Math.random() * (max - min)
  return colorValues[randomIndexArr];
}

// Create Todo Note
const createTodoNote = () => {
  const newTodoNote = document.createElement('div');
  newTodoNote.classList.add('new-todo-note', 'new-todo-note_hover');
  const todoNoteText = document.createElement('p');
  const todoNoteItems = document.getElementsByClassName('new-todo-note');
  newTodoNote.append(todoNoteText);
  todoNoteText.innerHTML = todoTextArea.value;
  

  const arrayOfTodoNotes = Array.from(todoNoteItems)

  let indexOfEmptyNote = -1;
  for ( let i = 0; i < arrayOfTodoNotes.length; i++ ) {
    if ( arrayOfTodoNotes[i].classList.contains('new-todo-note_hidden') ) {
      indexOfEmptyNote = i;
      break;
    }
  }
  if (indexOfEmptyNote !== -1) { 
    todoNotes[indexOfEmptyNote] = todoTextArea.value.replace('\n', '').trim();
  } if (indexOfEmptyNote === -1)  {
    todoNotes.push(todoTextArea.value.replace('\n', '').trim());
  }


  // If Todo Note is completed and removed, place instead of it a new Todo note on this place
  const hiddenCompletedTodoNote = Array.from(todoNoteItems).find((element) => {
    return element.classList.contains('new-todo-note_hidden');
  });

  if (hiddenCompletedTodoNote) {
    document.querySelector('.new-todo-note_hidden').before(newTodoNote);
    hiddenCompletedTodoNote.remove();
  //  todoNotes[indexOfEmptyNote] = todoTextArea.value.replace('\n', '').trim();
  } else {
    todoNotesConatiner.append(newTodoNote);
  }

  newTodoNote.style.margin = `${marginTodoNote()}px`;
  newTodoNote.style.transform = rotateTodoNote();
  newTodoNote.style.backgroundColor = colorTodoNote();
  todoTextArea.value = '';

  // Todo hover
const hoverTodoNote = (event) => {
  if (event.type === 'mouseenter') newTodoNote.classList.add('new-todo-note_hover');
  if (event.type === 'mouseleave') newTodoNote.classList.remove('new-todo-note_hover');
}
  newTodoNote.addEventListener('mouseenter', hoverTodoNote);
  newTodoNote.addEventListener('mouseleave', hoverTodoNote);
  showTodoCreateItem();
}

const createTodoNoteByClick = () => {
  if (todoTextArea.value.length !== 0) {
  createTodoNote();
  } else {
    showTodoCreateItem();
    return;
  }
}

const createTodoNoteByEnter = (event) => {
  if (event.code !== 'Enter') return;
  if (todoTextArea.value.length === 1) {
    showTodoCreateItem();
    return;
  } else {
    createTodoNote();
    }
}

// Delete Todo note as completed

const deleteTodoNote = (event) => {
  if (!event.target.closest('.new-todo-note')) return;
  if (event.target.tagName === 'P') {
    event.target.style.textDecoration = 'line-through';
    // Modify todoNotes array (add '' instead element with 'line-through')
    Array.from(document.getElementsByClassName('new-todo-note')).forEach((element, index) => {
      if (element.firstElementChild.style.textDecoration === 'line-through' && todoNotes[index] === element.firstElementChild.textContent.trim()) todoNotes[index] = '';
    });
  }
  if (event.target.closest('.new-todo-note') && !event.target.closest('.new-todo-note p') && event.target.firstElementChild.style.textDecoration === 'line-through') {
    event.target.classList.add('new-todo-note_hidden');
  }
  console.log('del after', todoNotes)
}

const deleteTodoNoteByDblclick = (event) => {
  if (event.target.closest('.new-todo-note')) {
  event.target.classList.add('new-todo-note_hidden');
    // Modify todoNotes array (add '' instead hidden element)
    Array.from(document.getElementsByClassName('new-todo-note')).forEach((element, index) => {
      if (element.classList.contains('new-todo-note_hidden') && todoNotes[index] === element.firstElementChild.textContent.trim()) todoNotes[index] = '';
    });
  }
  return;
}
todoNotesConatiner.addEventListener('click', deleteTodoNote);
todoNotesConatiner.addEventListener('dblclick', deleteTodoNoteByDblclick);

// Set / get active Todo Notes to / from LocalStorage
const userName = document.querySelector('.name');

const setTodoToLocalStorage = () => {
  localStorage.setItem('todo', JSON.stringify(todoNotes));
}
window.addEventListener('beforeunload', setTodoToLocalStorage);

const getTodoToLocalStorage = () => {
  localStorage.getItem('todo') && (todoNotes = JSON.parse(localStorage.getItem('todo')));
}
window.onload = getTodoToLocalStorage();

// todoNotes = [] // <-- cancel data in LocalStorage (use during the developing)
// Show Todo Notes from LocalStorage
const createTodoNotesFromLocalStorage = () => {
  todoNotes.forEach((element, index) => {
    const newTodoNote = document.createElement('div');
    newTodoNote.classList.add('new-todo-note', 'new-todo-note_hover');
    const todoNoteText = document.createElement('p');
    const todoNoteItems = document.getElementsByClassName('new-todo-note');
    newTodoNote.append(todoNoteText);
    todoNoteText.innerHTML = element;

    // Delete empty elements in the end of todoNotes array
    todoNotes.join(' ').trim().split(' ');
    // Show Todo Note
    todoNotesConatiner.append(newTodoNote);
    if (element === '') {
      newTodoNote.classList.add('new-todo-note_hidden');
    }

    newTodoNote.style.margin = `${marginTodoNote()}px`;
    newTodoNote.style.transform = rotateTodoNote();
    newTodoNote.style.backgroundColor = colorTodoNote();
    todoTextArea.value = '';

 // Todo hover
const hoverTodoNote = (event) => {
 if (event.type === 'mouseenter') newTodoNote.classList.add('new-todo-note_hover');
 if (event.type === 'mouseleave') newTodoNote.classList.remove('new-todo-note_hover');
}
 newTodoNote.addEventListener('mouseenter', hoverTodoNote);
 newTodoNote.addEventListener('mouseleave', hoverTodoNote);
   })
}
window.onload = createTodoNotesFromLocalStorage();


// Close Todo Notes app

const closeTodoNotesApp = () => {
                                            // Close settings menu by Escape
                                            document.addEventListener('keyup', (event) => {
                                            if (event.code === 'Escape') {
                                              showTodoApp();
                                            }
                                          });
    // Close settings menu by click outside of settings menu
  document.addEventListener('click', (event) => {
    if (todoApp.style.opacity === '1') {
       const withinBoundaries = event.composedPath().includes(todoApp);
       if (!withinBoundaries && !(event.target === todoAppOpenBtn)) {
        showTodoApp();
        }
    }
  });
}
  document.querySelector('.todo-close-btn').addEventListener('click', function() {


    todoApp.style.opacity === '0';


  });
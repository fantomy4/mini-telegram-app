// start Sidebar
document.querySelector('.chat-sidebar-profile-toggle').addEventListener('click', function(e) {
    e.preventDefault()
    this.parentElement.classList.toggle('active')
})

document.addEventListener('click', function(e) {
    if(!e.target.matches('.chat-sidebar-profile, .chat-sidebar-profile *')) {
        document.querySelector('.chat-sidebar-profile').classList.remove('active')
    }
})
// end Sidebar



// start Coversation
document.querySelectorAll('.conversation-item-dropdown-toggle').forEach(function(item) {
    item.addEventListener('click', function(e) {
        e.preventDefault()
        if(this.parentElement.classList.contains('active')) {
            this.parentElement.classList.remove('active')
        } else {
            document.querySelectorAll('.conversation-item-dropdown').forEach(function(i) {
                i.classList.remove('active')
            })
            this.parentElement.classList.add('active')
        }
    })
})

document.addEventListener('click', function(e) {
    if(!e.target.matches('.conversation-item-dropdown, .conversation-item-dropdown *')) {
        document.querySelectorAll('.conversation-item-dropdown').forEach(function(i) {
            i.classList.remove('active')
        })
    }
})

document.querySelectorAll('.conversation-form-input').forEach(function(item) {
    item.addEventListener('input', function() {
        this.rows = this.value.split('\n').length
    })
})

document.querySelectorAll('[data-conversation]').forEach(function(item) {
    item.addEventListener('click', function(e) {
        e.preventDefault()
        document.querySelectorAll('.conversation').forEach(function(i) {
            i.classList.remove('active')
        })
        document.querySelector(this.dataset.conversation).classList.add('active')
    })
})

document.querySelectorAll('.conversation-back').forEach(function(item) {
    item.addEventListener('click', function(e) {
        e.preventDefault()
        this.closest('.conversation').classList.remove('active')
        document.querySelector('.conversation-default').classList.add('active')
    })
})
// end Coversation

// Folders start
const chatApp = document.querySelector('.chat-app');
const chatList = document.querySelector('.chat-list');
const folderList = document.querySelector('.chat-folder-list');
const newFolderButton = document.querySelector('.chat-folder-button');

// Folder data (replace with your data storage solution)
let folders = [
  { name: 'Унік', chats: [] },
  { name: 'Друзі', chats: [] },
];

// Update chat list based on current folder
function updateChatList() {
  const currentFolder = folderList.querySelector('.active');
  const folderIndex = folders.findIndex(folder => folder.name === currentFolder.textContent);
  chatList.innerHTML = '';
  folders[folderIndex].chats.forEach(chat => {
    const chatItem = document.createElement('div');
    chatItem.classList.add('chat-item');
    // Add chat content here (name, message, etc.)
    chatList.appendChild(chatItem);
  });
}

// Handle folder click
folderList.addEventListener('click', (e) => {
  if (e.target.tagName === 'A') {
    const clickedFolder = e.target.parentNode;
    folderList.querySelectorAll('.active').forEach(folder => folder.classList.remove('active'));
    clickedFolder.classList.add('active');
    updateChatList();
  }
});

// Handle creating a new folder
newFolderButton.addEventListener('click', () => {
  const folderName = prompt('Введіть назву папки');
  if (folderName) {
    folders.push({ name: folderName, chats: [] });
    const newFolder = document.createElement('li');
    newFolder.classList.add('chat-folder-item');
    const folderLink = document.createElement('a');
    folderLink.href = '#';
    folderLink.textContent = folderName;
    newFolder.appendChild(folderLink);
    folderList.appendChild(newFolder);
  }
});

// Enable drag & drop for folders (basic implementation)
let draggingFolder = null;

folderList.addEventListener('dragstart', (e) => {
  draggingFolder = e.target.parentNode;
  e.dataTransfer.setData('text/plain', draggingFolder.textContent);
});

folderList.addEventListener('dragover', (e) => {
  e.preventDefault();
  if (e.target !== draggingFolder) {
    e.target.parentNode.classList.add('drop-target');
  }
});

folderList.addEventListener('dragleave', (e) => {
  e.target.parentNode.classList.remove('drop-target');
});

folderList.addEventListener('drop', (e) => {
  e.preventDefault();
  const targetFolder = e.target.parentNode;
  if (targetFolder !== draggingFolder) {
    const draggingFolderIndex = folders.findIndex(folder => folder.name === draggingFolder.textContent);
    const targetFolderIndex = folders.findIndex(folder => folder.name === targetFolder.textContent);
    const tempFolder = folders[draggingFolderIndex];
    folders[draggingFolderIndex] = folders[targetFolderIndex];
    folders[targetFolderIndex] = tempFolder;
    folderList.innerHTML = '';
    folders.forEach(folder => {
      const folderItem = document.createElement('li');
      folderItem.classList.add('chat-folder-item');
      const folderLink = document.createElement('a');
      folderLink.href = '#';
      folderLink.textContent = folder.name;
      folderItem.appendChild(folderLink);
      folderList.appendChild(folderItem);
    });
    updateChatList();
  }
  folderList.querySelectorAll('.drop-target').forEach(folder => folder.classList.remove('drop-target'));
  draggingFolder = null;
});

// Update chat list on initial load
updateChatList();
// Folders end
document.addEventListener('DOMContentLoaded', function() {
  const chats = document.querySelectorAll('.content-messages-list li');
  const folders = document.querySelectorAll('.chat-folder-item');

  chats.forEach(chat => {
      chat.addEventListener('dragstart', dragStart);
  });

  folders.forEach(folder => {
      folder.addEventListener('dragover', dragOver);
      folder.addEventListener('dragenter', dragEnter);
      folder.addEventListener('dragleave', dragLeave);
      folder.addEventListener('drop', drop);
  });

  let draggedChat = null;

  function dragStart(event) {
      draggedChat = event.target;
  }

  function dragOver(event) {
      event.preventDefault();
  }

  function dragEnter(event) {
      event.preventDefault();
      this.classList.add('over');
  }

  function dragLeave() {
      this.classList.remove('over');
  }

  function drop(event) {
      event.preventDefault();
      this.classList.remove('over');
      if (draggedChat) {
          const chatToMove = draggedChat.closest('.content-messages-list li');
          this.querySelector('.content-messages-list').appendChild(chatToMove);
          draggedChat = null;
      }
  }
});

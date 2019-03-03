'use strict';

const chatStatus = document.querySelector('.chat-status'),
  messageButton = document.querySelector('.message-submit'),
  messageStatus = document.querySelector('.message-status'),
  messageContent = document.querySelector('.messages-content'),
  message = document.querySelectorAll('.message'),
  personalMessage = document.querySelector('.message-personal'),
  messageBox = document.querySelector('.message-box'),
  loading = document.querySelector('.loading')

const connection = new WebSocket('wss://neto-api.herokuapp.com/chat');

connection.addEventListener('open', function (event) {
  chatStatus.innerText = chatStatus.dataset.online;
  messageButton.disabled = false;
  const cloneMessageStatus = messageStatus.cloneNode(true);
  cloneMessageStatus.children[0].innerText = 'Пользователь появился в сети';
  messageContent.append(cloneMessageStatus);
})

connection.addEventListener('message', function (event) {
  console.log(event.data);

  if (event.data === '...') {
    const loadClone = loading.cloneNode(true);
    loadClone.children[1] = 'печатает';
    messageContent.append(loadClone);
  } else {
    Array.from(messageContent.children).forEach(element => {
      if (element.classList.contains('loading')) messageContent.removeChild(element);
    });
  }

  const messageClon = message[1].cloneNode(true);
  messageClon.children[1].innerText = event.data;
  messageClon.children[2].innerText = new Date().getHours() + ':' + new Date().getMinutes();
  messageContent.innerHTML += messageClon.outerHTML;
})

messageBox.addEventListener('submit', onSubmit)

function onSubmit(event) {
  event.preventDefault();
  const input = document.querySelector('.message-input');
  connection.send(input.value);
  const clone = personalMessage.cloneNode(true);
  clone.children[0].innerText = input.value;
  clone.children[1].innerText = new Date().getHours() + ':' + new Date().getMinutes();
  messageContent.append(clone);
  input.value = '';
}

connection.addEventListener('close', function (event) {
  chatStatus.innerText = chatStatus.dataset.offline;
  messageButton.disabled = true;
  const cloneMessageStatus = messageStatus.cloneNode(true);
  cloneMessageStatus.children[0].innerText = 'Пользователь не в сети';
  messageContent.append(cloneMessageStatus);
})

const socket = io();

const form = document.getElementById('productForm');
const deleteForm = document.getElementById('deleteForm');
const productList = document.getElementById('productList');

form.addEventListener('submit', e => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(form));
  socket.emit('newProduct', data);
  form.reset();
});

deleteForm.addEventListener('submit', e => {
  e.preventDefault();
  const id = deleteForm.id.value;
  socket.emit('deleteProduct', parseInt(id));
  deleteForm.reset();
});

socket.on('updateProducts', products => {
  productList.innerHTML = '';
  products.forEach(p => {
    const li = document.createElement('li');
    li.innerHTML = `<strong>${p.title}</strong>: ${p.description}`;
    productList.appendChild(li);
  });
});
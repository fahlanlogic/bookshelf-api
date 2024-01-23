const {
  addNoteHandler,
  getAllBooksHandler,
  getDetailBookHandler,
  updateBookHandler,
  deleteBookById,
} = require('./Handler');

const routes = [
  {
    method: 'POST',
    path: '/books',
    handler: addNoteHandler,
  },
  {
    method: 'GET',
    path: '/books',
    handler: getAllBooksHandler,
  },
  {
    method: 'GET',
    path: '/books/{id}',
    handler: getDetailBookHandler,
  },
  {
    method: 'PUT',
    path: '/books/{id}',
    handler: updateBookHandler,
  },
  {
    method: 'DELETE',
    path: '/books/{id}',
    handler: deleteBookById,
  },
];

module.exports = routes;

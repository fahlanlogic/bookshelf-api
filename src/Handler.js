/* eslint-disable no-unneeded-ternary */
const { nanoid } = require('nanoid');
const listBook = require('./book');

const addNoteHandler = (request, h) => {
  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = request.payload;
  const id = nanoid(16);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;
  const finished = pageCount === readPage ? true : false;
  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };

  // const isSuccess = books.filter((book) => book.id === id).length > 0;
  if (!name) {
    const response = h.response(
      {
        status: 'fail',
        message: 'Gagal menambahkan buku. Mohon isi nama buku',
      },
    );
    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h.response(
      {
        status: 'fail',
        message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
      },
    );
    response.code(400);
    return response;
  }

  const response = h.response(
    {
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    },
  );
  listBook.push(newBook);
  response.code(201);
  return response;
};

const getAllBooksHandler = (request, h) => {
  const { name, reading, finished } = request.query;
  let bookQuery = [];
  if (name !== undefined) {
    bookQuery = listBook.filter((book) => book.name.toLowerCase().includes(name.toLowerCase()));
  } else if (reading !== undefined) {
    bookQuery = listBook.filter((book) => book.reading === !!reading);
  } else if (finished !== undefined) {
    bookQuery = listBook.filter((book) => book.finished === (finished === '1'));
  }
  bookQuery = (bookQuery.length !== 0 && bookQuery !== undefined)
    ? bookQuery = bookQuery.map((book) => ({
      id: book.id,
      name: book.name,
      publisher: book.publisher,
    }))
    : bookQuery = listBook.map((book) => ({
      id: book.id,
      name: book.name,
      publisher: book.publisher,
    }));

  const response = h.response(
    {
      status: 'success',
      data: {
        books: bookQuery,
      },
    },
  );
  response.code(200);
  return response;
};

const getDetailBookHandler = (request, h) => {
  const { id } = request.params;
  const book = listBook.filter((n) => n.id === id)[0];

  if (book !== undefined) {
    return {
      status: 'success',
      data: {
        book,
      },
    };
  }

  const response = h.response(
    {
      status: 'fail',
      message: 'Buku tidak ditemukan',
    },
  );
  response.code(404);
  return response;
};

const updateBookHandler = (request, h) => {
  const { id } = request.params;
  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = request.payload;
  const updatedAt = new Date().toISOString();
  const index = listBook.findIndex((book) => book.id === id);

  if (name === undefined) {
    const response = h.response(
      {
        status: 'fail',
        message: 'Gagal memperbarui buku. Mohon isi nama buku',
      },
    );
    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h.response(
      {
        status: 'fail',
        message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
      },
    );
    response.code(400);
    return response;
  }

  if (index !== -1) {
    listBook[index] = {
      ...listBook[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      updatedAt,
    };
    const response = h.response(
      {
        status: 'success',
        message: 'Buku berhasil diperbarui',
      },
    );
    response.code(200);
    return response;
  }

  const response = h.response(
    {
      status: 'fail',
      message: 'Gagal memperbarui buku. Id tidak ditemukan',
    },
  );
  response.code(404);
  return response;
};

const deleteBookById = (request, h) => {
  const { id } = request.params;
  const index = listBook.findIndex((book) => book.id === id);

  if (index !== -1) {
    listBook.splice(index, 1);
    const response = h.response(
      {
        status: 'success',
        message: 'Buku berhasil dihapus',
      },
    );
    response.code(200);
    return response;
  }

  const response = h.response(
    {
      status: 'fail',
      message: 'Buku gagal dihapus. Id tidak ditemukan',
    },
  );
  response.code(404);
  return response;
};

module.exports = {
  addNoteHandler,
  getAllBooksHandler,
  getDetailBookHandler,
  updateBookHandler,
  deleteBookById,
};

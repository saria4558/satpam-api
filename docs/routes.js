const {
  addBukuHandler,
  getAllBukuHandler,
  getBukuByIdHandler,
  editBukuByIdHandler,
  hapusBukuByIdHandler
} = require('./handler');

const routes = [
  {
    method: 'POST',
    path: '/buku-paket',
    handler: addBukuHandler,
  },
  {
    method: 'GET',
    path: '/buku-paket',
    handler: getAllBukuHandler,
  },
  {
    method: 'GET',
    path: '/buku-paket/{bookId}',
    handler: getBukuByIdHandler,
  },
  {
    method: 'PUT',
    path: '/buku-paket/{bookId}',
    handler: editBukuByIdHandler,
  },
  {
    method: 'DELETE',
    path: '/buku-paket/{bookId}',
    handler: hapusBukuByIdHandler,
  },
];

module.exports = routes;

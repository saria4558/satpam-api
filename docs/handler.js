const pool = require('./db');
const { nanoid } = require('nanoid');

// Helper untuk membungkus data dengan nama tabel sebagai key
const formatResponseWithTable = (tableName, rows) => ({
  status: 'success',
  data: {
    [tableName]: rows,
  },
});


const addBukuHandler = async (request, h) => {
  const {
    penerima,
    pengirim,
    ekspedisi,
    telepon,
    status,
    dokumentasi,
  } = request.payload;

  // Validasi sederhana (bisa dikembangkan)
  if (!penerima || !pengirim || !ekspedisi || !telepon) {
    return h.response({
      status: 'fail',
      message: 'Gagal menambahkan data. Semua field wajib diisi',
    }).code(400);
  }

  const id = nanoid(16);
  const created_at = new Date();
  const updated_at = new Date();

  try {
    const [result] = await pool.execute(
      `INSERT INTO buku_paket 
        (id, penerima, pengirim, ekspedisi, telepon, status, dokumentasi, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        penerima,
        pengirim,
        ekspedisi,
        telepon,
        status ?? 'waiting',
        dokumentasi ?? null,
        created_at,
        updated_at,
      ]
    );

    return h.response({
      status: 'success',
      message: 'Buku paket berhasil ditambahkan',
      data: {
        id: id,
      },
    }).code(201);
  } catch (error) {
    console.error(error);
    return h.response({
      status: 'fail',
      message: error.message,
    }).code(500);
  }
};


const getAllBukuHandler = async () => {
  const tableName = 'buku_paket';
  try {
    const [rows] = await pool.execute(`SELECT * FROM ${tableName}`);
    return formatResponseWithTable(tableName, rows);
  } catch (error) {
    return { status: 'fail', message: error.message };
  }
};

const getBukuByIdHandler = async (request, h) => {
  const { bookId } = request.params;
  try {
    const [rows] = await pool.execute('SELECT * FROM buku_paket WHERE id = ?', [bookId]);
    if (rows.length === 0) {
      return h.response({ status: 'fail', message: 'Data tidak ditemukan' }).code(404);
    }

    return {
      status: 'success',
      data: rows[0],
    };
  } catch (error) {
    return h.response({ status: 'fail', message: error.message }).code(500);
  }
};

const editBukuByIdHandler = async (request, h) => {
  const { bookId } = request.params;
  const { penerima, pengirim, ekspedisi, telepon, status, dokumentasi } = request.payload;
  const updated_at = new Date();

  try {
    const [result] = await pool.execute(
      `UPDATE buku_paket SET penerima=?, pengirim=?, ekspedisi=?, telepon=?, updated_at=?, status=?, dokumentasi=? WHERE id=?`,
      [penerima, pengirim, ekspedisi, telepon, updated_at, status, dokumentasi, bookId]
    );

    if (result.affectedRows === 0) {
      return h.response({ status: 'fail', message: 'Data tidak ditemukan' }).code(404);
    }

    return { status: 'success', message: 'Data berhasil diperbarui' };
  } catch (error) {
    return h.response({ status: 'fail', message: error.message }).code(500);
  }
};

const hapusBukuByIdHandler = async (request, h) => {
  const { bookId } = request.params;

  try {
    const [result] = await pool.execute('DELETE FROM buku_paket WHERE id = ?', [bookId]);
    if (result.affectedRows === 0) {
      return h.response({ status: 'fail', message: 'Data tidak ditemukan' }).code(404);
    }

    return { status: 'success', message: 'Data berhasil dihapus' };
  } catch (error) {
    return h.response({ status: 'fail', message: error.message }).code(500);
  }
};

module.exports = {
  addBukuHandler,
  getAllBukuHandler,
  getBukuByIdHandler,
  editBukuByIdHandler,
  hapusBukuByIdHandler,
};

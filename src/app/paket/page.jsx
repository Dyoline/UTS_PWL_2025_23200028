'use client';
import styles from './PaketPage.module.css';
import { useEffect, useState } from 'react';

export default function PreorderPage() {
    const [formVisible, setFormVisible] = useState(false);
    const [pakets, setPakets] = useState([]);
    const [kode, setKode] = useState('');
    const [nama, setNama] = useState('');
    const [deskripsi, setDeskripsi] = useState('');
    const [msg, setMsg] = useState('');
    const [editId, setEditId] = useState(null);

    const fetchPakets = async () => {
        const res = await fetch('/api/paket');
        const data = await res.json();
        setPakets(data);
    };
    useEffect(() => {
        fetchPakets();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const method = editId ? 'PUT' : 'POST';
        const res = await fetch('/api/paket', {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id: editId,
                kode,
                nama,
                deskripsi
            }),
        });

        if (res.ok) {
            setMsg('Saved Successfully!');
            setKode('');
            setNama('');
            setDeskripsi('');
            setEditId(null);
            setFormVisible(false);
            fetchPakets();
        } else {
            setMsg('Failed to Save Data!');
        }
    };

    const handleEdit = (item) => {
        setKode(item.kode);
        setNama(item.nama);
        setDeskripsi(item.deskripsi);
        setEditId(item.id);
        setFormVisible(true);
    };

    const handleDelete = async (id) => {
        if (!confirm('Are You Sure?')) return;
        await fetch('/api/paket', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id }),
        });
        fetchPakets();
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Package</h1>
            <button
                className={styles.buttonToggle}
                onClick={() => setFormVisible(!formVisible)}
            >
                {formVisible ? 'Tutup Form' : 'Tambah Data'}
            </button>

            {formVisible && (
                <div className={styles.formWrapper}>
                    <h3>Input Paket Baru</h3>
                    <form onSubmit={handleSubmit}>
                        <div className={styles.formGroup}>
                            <span>Kode</span>
                            <input
                                type='number'
                                value={kode}
                                onChange={(e) => setKode(e.target.value)}
                                placeholder='Masukkan Kode Paket'
                                required
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <span>Nama</span>
                            <input
                                type='text'
                                value={nama}
                                onChange={(e) => setNama(e.target.value)}
                                placeholder='Masukkan Nama Paket'
                                required
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <span>Deskripsi</span>
                            <textarea
                                rows='4'
                                type='text'
                                value={deskripsi}
                                onChange={(e) => setDeskripsi(e.target.value)}
                                placeholder='Masukkan Deskripsi Paket'
                                required
                            >
                            </textarea>
                        </div>
                        <button type='submit'>Simpan</button>
                        <p>{msg}</p>
                    </form>
                </div>
            )}

            <div className={styles.tableWrapper}>
                <table>
                    <thead>
                        <tr>
                            <th>No</th>
                            <th>Kode</th>
                            <th>Nama Paket</th>
                            <th>Deskripsi</th>
                            <th>Aksi</th>
                        </tr>
                    </thead>
                    <tbody className={styles.tableBody}>
                        {pakets.map((item, index) => (
                            <tr key={item.id}>
                                <td>{index + 1}</td>
                                <td>{item.kode}</td>
                                <td>{item.nama}</td>
                                <td>{item.deskripsi}</td>
                                <td>
                                    <button onClick={() => handleEdit(item)}>Edit</button>
                                </td>
                                <td>
                                    <button onClick={() => handleDelete(item.id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                        {pakets.length === 0 && (
                            <tr>
                                <td colSpan='6'>No Data Available</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
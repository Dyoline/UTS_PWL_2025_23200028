'use client';
import styles from './CustomerPage.module.css';
import { useEffect, useState } from 'react';

export default function PreorderPage() {
    const [formVisible, setFormVisible] = useState(false);
    const [customers, setCustomers] = useState([]);
    const [nama, setNama] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [msg, setMsg] = useState('');
    const [editId, setEditId] = useState(null);

    const fetchCustomers = async () => {
        const res = await fetch('/api/customer');
        const data = await res.json();
        setCustomers(data);
    };
    useEffect(() => {
        fetchCustomers();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const method = editId ? 'PUT' : 'POST';
        const res = await fetch('/api/customer', {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id: editId,
                nama,
                phone,
                email,
            }),
        });

        if (res.ok) {
            setMsg('Saved Successfully!');
            setNama('');
            setPhone('');
            setEmail('');
            setEditId(null);
            setFormVisible(false);
            fetchCustomers();
        } else {
            setMsg('Failed to Save Data!');
        }
    };

    const handleEdit = (item) => {
        setNama(item.nama);
        setPhone(item.phone);
        setEmail(item.email);
        setEditId(item.id);
        setFormVisible(true);
    };

    const handleDelete = async (id) => {
        if (!confirm('Are You Sure?')) return;
        await fetch('/api/customer', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id }),
        });
        fetchCustomers();
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Customers</h1>
            <button
                className={styles.buttonToggle}
                onClick={() => setFormVisible(!formVisible)}
            >
                {formVisible ? 'Tutup Form' : 'Tambah Data'}
            </button>

            {formVisible && (
                <div className={styles.formWrapper}>
                    <h3>Input Customer Baru</h3>
                    <form onSubmit={handleSubmit}>
                        <div className={styles.formGroup}>
                            <span>Nama</span>
                            <input
                                type='text'
                                value={nama}
                                onChange={(e) => setNama(e.target.value)}
                                placeholder='Masukkan Nama Customer'
                                required
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <span>Phone</span>
                            <input
                                type='text'
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                placeholder='Masukkan Nomor Telepon'
                                required
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <span>Email</span>
                            <input
                                type='text'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder='Masukkan Email'
                                required
                            />
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
                            <th>Nama Customer</th>
                            <th>Nomor Telepon</th>
                            <th>Email</th>
                            <th>Tanggal Order</th>
                            <th>Aksi</th>
                        </tr>
                    </thead>
                    <tbody className={styles.tableBody}>
                        {customers.map((item, index) => (
                            <tr key={item.id}>
                                <td>{index + 1}</td>
                                <td>{item.nama}</td>
                                <td>{item.phone}</td>
                                <td>{item.email}</td>
                                <td>{item.createdat}</td>
                                <td>
                                    <button onClick={() => handleEdit(item)}>Edit</button>
                                </td>
                                <td>
                                    <button onClick={() => handleDelete(item.id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                        {customers.length === 0 && (
                            <tr>
                                <td colSpan='7'>No Data Available</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
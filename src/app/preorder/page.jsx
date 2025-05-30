'use client';
import styles from './PreorderPage.module.css';
import { useEffect, useState } from 'react';

export default function PreorderPage() {
    const [formVisible, setFormVisible] = useState(false);
    const [preorders, setPreorders] = useState([]);
    const [pakets, setPakets] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [order_date, setOrderDate] = useState('');
    const [order_by, setOrderBy] = useState('');
    const [selected_package, setSelectedPackage] = useState('');
    const [qty, setQty] = useState(0);
    const [status, setStatus] = useState(null);
    const [msg, setMsg] = useState('');
    const [editId, setEditId] = useState(null);

    const fetchPreorders = async () => {
        const res = await fetch('/api/preorder');
        const data = await res.json();
        setPreorders(data);
    };
    const fetchPakets = async () => {
        const res = await fetch('api/paket');
        const data = await res.json();
        setPakets(data);
    }
    const fetchCustomers = async () => {
        const res = await fetch('api/customer');
        const data = await res.json();
        setCustomers(data);
    }
    useEffect(() => {
        fetchPreorders();
        fetchPakets();
        fetchCustomers();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const method = editId ? 'PUT' : 'POST';
        const res = await fetch('/api/preorder', {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id: editId,
                order_date,
                order_by,
                selected_package,
                qty,
                status,
            }),
        });

        if (res.ok) {
            setMsg('Saved Successfully!');
            setOrderDate('');
            setOrderBy('');
            setSelectedPackage('');
            setQty('');
            setStatus('');
            setEditId(null);
            setFormVisible(false);
            fetchPreorders();
        } else {
            setMsg('Failed to Save Data!');
        }
    };

    const handleEdit = (item) => {
        setOrderDate(item.order_date);
        setOrderBy(item.order_by);
        setSelectedPackage(item.selected_package);
        setQty(item.qty);
        setStatus(item.status);
        setEditId(item.id);
        setFormVisible(true);
    };

    const handleDelete = async (id) => {
        if (!confirm('Are You Sure?')) return;
        await fetch('/api/preorder', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id }),
        });
        fetchPreorders();
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Ayam Penyet Koh Alex</h1>
            <button
                className={styles.buttonToggle}
                onClick={() => setFormVisible(!formVisible)}
            >
                {formVisible ? 'Tutup Form' : 'Tambah Data'}
            </button>

            {formVisible && (
                <div className={styles.formWrapper}>
                    <h3>Input Data Baru</h3>
                    <form onSubmit={handleSubmit}>
                        <div className={styles.formGroup}>
                            <span>Tanggal Pesanan</span>
                            <input
                                type='date'
                                value={order_date}
                                onChange={(e) => setOrderDate(e.target.value)}
                                required
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <span>Customer ID</span>
                            <select
                                value={order_by}
                                onChange={(e) => {
                                    const selectedId = e.target.value;
                                    setOrderBy(selectedId);

                                    const selectedCustomer = customers.find(c => c.id === selectedId);
                                    if (selectedCustomer && selectedCustomer.createdat) {
                                        const createdDate = new Date(selectedCustomer.createdat);
                                        setOrderDate(createdDate.toISOString().split('T')[0]);
                                    }
                                }}
                                required
                            >
                                <option value="">Pilih Customer ID</option>
                                {customers.map((item) => (
                                    <option key={item.id} value={item.id}>
                                        {item.id} - {item.nama}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className={styles.formGroup}>
                            <span>Paket</span>
                            <select
                                value={selected_package}
                                onChange={(e) => {
                                    const selectedId = e.target.value;
                                    setSelectedPackage(selectedId);

                                    const selectedPackage = pakets.find(c => c.id === selectedId);
                                }}
                                required
                            >
                                <option value="">Pilih Paket ID</option>
                                {pakets.map((item) => (
                                    <option key={item.id} value={item.id}>
                                        {item.id} - {item.nama}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className={styles.formGroup}>
                            <span>Jumlah</span>
                            <input
                                type='text'
                                value={qty}
                                onChange={(e) => setQty(Number(e.target.value))}
                                placeholder='Input Jumlah'
                                required
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <span>Status</span>
                            <label>
                                <input
                                    type='radio'
                                    value='Lunas'
                                    checked={status === 'Lunas'}
                                    onChange={(e) => setStatus(true)}
                                />
                                Lunas
                            </label>
                            <label>
                                <input
                                    type='radio'
                                    value='Belum Lunas'
                                    checked={status === 'Belum Lunas'}
                                    onChange={(e) => setStatus(false)}
                                />
                                Belum Lunas
                            </label>
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
                            <th>Tanggal Pesanan</th>
                            <th>Customer ID</th>
                            <th>Paket ID</th>
                            <th>Jumlah</th>
                            <th>Status</th>
                            <th>Aksi</th>
                        </tr>
                    </thead>
                    <tbody className={styles.tableBody}>
                        {preorders.map((item, index) => (
                            <tr key={item.id}>
                                <td>{index + 1}</td>
                                <td>{new Date(item.order_date).toISOString().split('T')[0]}</td>
                                <td>{item.order_by}</td>
                                <td>{item.selected_package}</td>
                                <td>{item.qty}</td>
                                <td>{item.status ? 'Lunas' : 'Belum'}</td>
                                <td>
                                    <button onClick={() => handleEdit(item)}>Edit</button>
                                </td>
                                <td>
                                    <button onClick={() => handleDelete(item.id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                        {preorders.length === 0 && (
                            <tr>
                                <td colSpan='8'>No Data Available</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
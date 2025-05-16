import prisma from '@/lib/prisma';
export async function GET() {
    const data = await prisma.paket.findMany({
        orderBy: { id: 'asc' },
    });
    return new Response(JSON.stringify(data), { status: 200 });
}

export async function POST(request) {
    const { kode, nama, deskripsi } =
        await request.json();
    if (!kode || !nama || !deskripsi === null) {
        return new Response(JSON.stringify({ error: 'Semua field wajib diisi' }), {
            status: 400,
        });
    }
    const paket = await prisma.paket.create({
        data: {
            kode,
            nama,
            deskripsi
        },
    });
    return new Response(JSON.stringify(paket), { status: 201 });
}

export async function PUT(request) {
    const { id, kode, nama, deskripsi } =
        await request.json();
    if (!id || !kode || !nama || !deskripsi === null)
        return Response.json(
            { error: 'Field kosong' },
            {
                status: 400,
            }
        );
    const paket = await prisma.paket.update({
        where: { id },
        data: { kode, nama, deskripsi },
    });
    return Response.json(paket);
}

export async function DELETE(request) {
    try {
        const { id } = await request.json();

        if (!id) {
            return new Response(JSON.stringify({ error: 'ID tidak ditemukan' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        await prisma.paket.delete({ where: { id } });

        return new Response(JSON.stringify({ message: 'Berhasil dihapus' }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });

    } catch (error) {
        console.error('DELETE Error:', error);
        return new Response(JSON.stringify({ error: 'Server error' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}

import prisma from '@/lib/prisma';
export async function GET() {
    const data = await prisma.customer.findMany({
        orderBy: { id: 'asc' },
    });
    return new Response(JSON.stringify(data), { status: 200 });
}

export async function POST(request) {
    const { nama, phone, email, createdat } =
        await request.json();
    if (!nama || !phone || !email || !createdat === null) {
        return new Response(JSON.stringify({ error: 'Semua field wajib diisi' }), {
            status: 400,
        });
    }
    const customer = await prisma.customer.create({
        data: {
            nama,
            phone,
            email,
            createdat
        },
    });
    return new Response(JSON.stringify(customer), { status: 201 });
}

export async function PUT(request) {
    const { id, nama, phone, email, createdat } =
        await request.json();
    if (!id || !nama || !phone || !email || !createdat === null)
        return Response.json(
            { error: 'Field kosong' },
            {
                status: 400,
            }
        );
    const customer = await prisma.customer.update({
        where: { id },
        data: { nama, phone, email, createdat },
    });
    return Response.json(customer);
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

        await prisma.customer.delete({ where: { id } });

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

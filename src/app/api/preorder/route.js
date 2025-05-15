import prisma from '@/lib/prisma';
export async function GET() {
    const data = await prisma.preorder.findMany({
        orderBy: { id: 'asc' },
    });
    return new Response(JSON.stringify(data), { status: 200 });
}

export async function POST(request) {
    const { order_date, order_by, selected_package, qty, status } =
        await request.json();
    if (!order_date || !order_by || !selected_package || !qty || status === null) {
        return new Response(JSON.stringify({ error: 'Semua field wajib diisi' }), {
            status: 400,
        });
    }
    const preorder = await prisma.preorder.create({
        data: {
            order_date: new Date(order_date),
            order_by,
            selected_package,
            qty,
            status
        },
    });
    return new Response(JSON.stringify(preorder), { status: 201 });
}

export async function PUT(request) {
    const { id, order_date, order_by, selected_package, qty, status } =
        await request.json();
    if (!id || !order_date || !order_by || !selected_package || !qty || status === null)
        return Response.json(
            { error: 'Field kosong' },
            {
                status: 400,
            }
        );
    const preorder = await prisma.preorder.update({
        where: { id },
        data: { order_date: new Date(order_date), order_by, selected_package, qty, status },
    });
    return Response.json(preorder);
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

        await prisma.preorder.delete({ where: { id } });

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

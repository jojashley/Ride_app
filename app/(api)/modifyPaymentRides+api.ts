import { neon } from "@neondatabase/serverless";

export async function POST(request: Request) {
    try {
        const sql = neon(`${process.env.DATABASE_URL}`);

        const { ride_id, new_payment_status } = await request.json();

        if (!ride_id || !new_payment_status) {
            console.log("faltaron datos en el ride");
            return new Response(
                JSON.stringify({ error: "Missing required fields" }),
                { status: 400 }
            );
        }
        const response = await sql`
            SELECT update_payment_status(${ride_id}, ${new_payment_status})
        `;

        return new Response(JSON.stringify({ data: response }), { status: 201 });
    } catch (error) {
        console.error("Error during payment status update:", error);
        return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
    }
}

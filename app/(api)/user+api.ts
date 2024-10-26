import { neon } from "@neondatabase/serverless";

export async function POST(request: Request) {
    try {
        const sql = neon(`${process.env.DATABASE_URL}`);
        const { name, email, clerkId, rol } = await request.json();
        if (!name || !email || !clerkId || !rol) {
            return Response.json(
                {
                    error: "Missing required fields",
                },
                { status: 400 },
            );
        }
        const response = await sql`
            INSERT INTO users (name, email, clerk_id, rol)
            VALUES (${name}, ${email}, ${clerkId}, ${rol})`
        return new Response(JSON.stringify({ data: response }), { status: 201 });
    } catch (error) {
        console.log(error);
        return Response.json({ error: error }, { status: 500 });
    }
}
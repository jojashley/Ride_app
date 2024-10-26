import { neon } from "@neondatabase/serverless";

export async function POST(request: Request) {
    try {
        const sql = neon(`${process.env.DATABASE_URL}`);
        const { email } = await request.json();

        // Verificar que se proporcione un email
        if (!email) {
            return new Response(
                JSON.stringify({
                    error: "Missing email field",
                }),
                { status: 400 },
            );
        }

        // Consulta para obtener el rol del usuario basado en su email
        const response = await sql`
      SELECT rol FROM users WHERE email = ${email};
    `;

        // Verificar si se encontró un usuario con ese email
        if (response.length === 0) {
            return new Response(
                JSON.stringify({
                    error: "User not found",
                }),
                { status: 404 },
            );
        }

        // Retornar el rol del usuario
        const { rol } = response[0];
        return new Response(JSON.stringify({ rol }), { status: 200 });
    } catch (error) {
        console.log(error);
        return Response.json({ error: error }, { status: 500 });
    }
}
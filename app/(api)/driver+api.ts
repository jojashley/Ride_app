import { neon } from "@neondatabase/serverless";

export async function POST(request: Request) {
    console.log("entar al servidor");
    console.log(request.body);
    try {
        const sql = neon(`${process.env.DATABASE_URL}`);
        const {
            name,
            email,
            clerkId,
            last_name,
            profile_image_url,
            car_image_url,
            car_seats,
            rol,
            rating,
        } = await request.json();
        console.log("se convirtio a sql");
        // Verificar que todos los campos requeridos estén presentes
        if (
            !name ||
            !email ||
            !clerkId ||
            !rol ||
            !last_name ||
            !profile_image_url ||
            !car_image_url ||
            !car_seats ||
            !rating
        ) {
            console.log("no encontro un dato");
            return new Response(
                JSON.stringify({
                    error: "Missing required fields",
                }),
                { status: 400 },
            );
        }

        // Ejecutar la función almacenada de forma segura usando bindings
        const response = await sql`
            SELECT insert_user_and_driver(
                           ${name},
                           ${email},
                           ${clerkId},
                           ${rol},
                           ${last_name},
                           ${profile_image_url},
                           ${car_image_url},
                           ${car_seats},
                           ${rating}
                   );`;
        console.log(response);

        // Retornar respuesta exitosa
        return new Response(JSON.stringify({ data: response }), { status: 201 });
    } catch (error) {
        console.log(error);
        return Response.json({ error: error }, { status: 500 });
    }
}
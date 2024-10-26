import { neon } from "@neondatabase/serverless";

export async function POST(request: Request) {
    try {
        const sql = neon(`${process.env.DATABASE_URL}`);
        const { email } = await request.json();

        // Verificar que se proporcione un email
        if (!email) {
            console.log("no llego el email");
            return new Response(
                JSON.stringify({
                    error: "Missing email field",
                }),
                { status: 400 },
            );
        }

        // Consulta para obtener el rol del usuario basado en su email
        const response = await sql`
      SELECT
          u.id,
          u.name AS user_name,
          u.email AS user_email,
          u.clerk_id AS user_clerk_id,
          u.rol AS user_role,
          d.last_name AS driver_last_name,
          d.profile_image_url AS driver_profile_image_url,
          d.car_image_url AS driver_car_image_url,
          d.car_seats AS driver_car_seats,
          d.rating AS driver_rating
        FROM
        users u
        INNER JOIN
        driver d
        ON
        u.id = d.id_driver
        WHERE
        u.email = ${email};
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

        return new Response(JSON.stringify({ data: response }), { status: 200 });
    } catch (error) {
        console.log(error);
        return Response.json({ error: error }, { status: 500 });
    }
}
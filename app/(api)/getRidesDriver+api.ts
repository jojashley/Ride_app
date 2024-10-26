import { neon } from "@neondatabase/serverless";

export async function POST(request: Request) {
    try {
        const sql = neon(`${process.env.DATABASE_URL}`);
        const {email} = await request.json();

        // Verificar que se proporcione un email
        if (!email) {
            console.log("no llego el email");
            return new Response(
                JSON.stringify({
                    error: "Missing email field",
                }),
                {status: 400},
            );
        }

        // Consulta para obtener el rol del usuario basado en su email
        const response = await sql`
            SELECT r.ride_id,
                   r.origin_address,
                   r.destination_address,
                   r.origin_latitude,
                   r.origin_longitude,
                   r.destination_latitude,
                   r.destination_longitude,
                   r.ride_time,
                   r.departure_time,
                   r.fare_price,
                   r.payment_status,
                   r.driver_id,
                   u.email     AS user_email,
                   r.created_at,
                   u.name      AS driver_name,
                   d.last_name AS driver_last_name,
                   d.car_seats
            FROM rides r
                     JOIN
                 driver d ON d.id_driver = r.driver_id
                     JOIN
                 users u ON u.id = d.id_driver
            WHERE u.email = ${email};
        `;

        // Verificar si se encontró un usuario con ese email
        if (response.length === 0) {
            return new Response(
                JSON.stringify({
                    error: "User not found",
                }),
                {status: 404},
            );
        }

        console.log(response);
        return new Response(JSON.stringify({data: response}), {status: 200});

    } catch (error) {
        console.log(error);
        return Response.json({error: error}, {status: 500});
    }
};
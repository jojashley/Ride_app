import { neon } from "@neondatabase/serverless";

export async function POST(request: Request) {
    try {
        const sql = neon(`${process.env.DATABASE_URL}`);
        const {
            origin_latitude,
            origin_longitude,
            destination_latitude,
            destination_longitude,
        } = await request.json();

        // Verificar que se proporcione un email
        if (
            !origin_latitude ||
            !origin_longitude ||
            !destination_latitude ||
            !destination_longitude
        ) {
            console.log("Faltan datos de coordenada");
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
        r.ride_id,
        u.email AS user_email,
        r.created_at,
        u.name AS driver_name,
        d.last_name AS driver_last_name,
        d.car_seats
    FROM
        rides r
    JOIN
        driver d ON d.id_driver = r.driver_id
    JOIN
        users u ON u.id = d.id_driver
    WHERE
        r.origin_latitude = ${origin_latitude}
        AND r.origin_longitude = ${origin_longitude}
        AND r.destination_latitude = ${destination_latitude}
        AND r.destination_longitude = ${destination_longitude}
        AND r.payment_status <> ${"paid"};
        `;

        return new Response(JSON.stringify({ data: response }), { status: 200 });
    } catch (error) {
        console.log(error);
        return Response.json({ error: error }, { status: 500 });
    }
}
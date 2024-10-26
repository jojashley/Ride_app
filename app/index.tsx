import { Redirect } from "expo-router";
import { useAuth, useUser } from '@clerk/clerk-expo';
import React, { useEffect, useState } from "react";
import "react-native-get-random-values";

const Home = () => {
    const { isSignedIn } = useAuth();
    const { user } = useUser();
    const [rolUser, setrolUser] = useState(null); // Inicializa como null
    const [loading, setLoading] = useState(true); // Estado de carga

    useEffect(() => {
        const fetchRole = async () => {
            if (isSignedIn && user) {
                try {
                    const response = await fetch("/(api)/rol", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ email: user.emailAddresses[0].emailAddress }),
                    });

                    if (!response.ok) {
                        throw new Error("Error al obtener el rol");
                    }

                    const data = await response.json();
                    setrolUser(data.rol);
                } catch (error) {
                    console.error("Error:", error);
                } finally {
                    setLoading(false); // Cambia a false al terminar la carga
                }
            } else {
                setLoading(false); // Cambia a false si no está autenticado
            }
        };

        fetchRole();
    }, [isSignedIn, user]);

    if (loading) {
        // Puedes mostrar un cargador o nada mientras se carga
        return null; // O un componente de carga
    }

    // Redirigir según el rol del usuario
    if (rolUser === "driver") {
        return <Redirect href={"/(root-driver)/(tabs)/home"} />;
    } else if (rolUser === "passenger") {
        return <Redirect href={"/(root)/(tabs)/home"} />;
    }

    return <Redirect href={"/(auth)/welcome"} />;
};

export default Home;

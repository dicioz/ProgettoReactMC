import React from "react";

const BASE_URL = 'https://develop.ewlab.di.unimi.it/mc/2425'

//chiama API generica con parametri
export default class CommunicationController {

    static async genericRequest(endpoint, verb, queryParams, bodyParams) {
        console.log("genericRequest called");
        //genera URL con parametri
        const queryParamsFormatted = new URLSearchParams(
            queryParams
        ).toString();

        const url = queryParamsFormatted
            ? `${BASE_URL}${endpoint}?${queryParamsFormatted}`
            : `${BASE_URL}${endpoint}`;

        console.log("sending " + verb + " request to: " + url);
        //configura la richiesta
        let fetchData = {
            method: verb,
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
        };
        if (verb !== "GET") {
            try {
                fetchData.body = JSON.stringify(bodyParams);
                console.log("bodyParams: ", bodyParams);
            } catch (error) {
                console.error("Error during JSON serialization: ", error);
                throw error;
            }
            //console.log("bodyParams: ", bodyParams);
        }

        try {
            //ottiene la risposta
            let httpResponse = await fetch(url, fetchData);
        
            //controlla lo stato della risposta
            const status = httpResponse.status;
            console.log("status: ", status);
            //se la risposta è positiva, deserializza l'oggetto
            if (status === 200) {
                let deserializedObject = await httpResponse.json();
                return deserializedObject;
            } else if (status === 204) {
                console.log("No content");
            } else {
                const message = await httpResponse.text();
                let error = new Error(
                    "Error message from the server. HTTP status: " +
                    status +
                    " " +
                    message,
                );
                throw error;
            }
        } catch (error) {
            if (error.message.includes("Network request failed")) {
                console.error("Problema di rete o server non raggiungibile.");
                // ...possibile logica di fallback...
            }
            console.error("Errore durante la richiesta fetch:", error);
            throw new Error("Errore durante la richiesta di rete: " + error.message);
        }
    }
}

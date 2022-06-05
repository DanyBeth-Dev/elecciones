const http = require("http");
const fs = require("fs");
const url = require("url");
const { guardarCandidato, getCandidatos, editCandidato, eliminarCandidato, registrarVotos, getHistorial } = require("./consultas");

http.createServer( async (req, res) => {
    if (req.url == "/" && req.method == "GET") {
        fs.readFile("index.html", (err, data) => {
            if (err) {
                res.statusCode = 500;
                res.end();
            } else {
                res.setHeader("Content-type", "text/html");
                res.end(data);
            }
        })
    }
    if (req.url == "/candidato" && req.method == "POST") {
        let body = "";
        req.on("data", (chunk) => {
            body = chunk.toString()
        });
        req.on("end", async () => {
            const candidato = JSON.parse(body);
            try {
                const result = await guardarCandidato(candidato);
                res.statusCode = 201;
                res.end(JSON.stringify(result));
            } catch (error) {
                res.statusCode = 500;
                res.end("Ocurió un problema en el servidor..." + error);
            }
        });
    }
    if (req.url == "/candidatos" && req.method == "GET") {
        try {
            const candidatos = await getCandidatos();
            res.end(JSON.stringify(candidatos))
        } catch (error) {
            res.statusCode = 500;
            res.end("Ocurió un problema en el servidor..." + error);
        }
    }
    if (req.url == "/candidato" && req.method == "PUT") {
        let body = "";
        req.on("data", (chunk) => {
            body = chunk.toString()
        });
        req.on("end", async () => {
            const candidato = JSON.parse(body);
            try {
                const result = await editCandidato(candidato);
                res.statusCode = 200;
                res.end(JSON.stringify(result));
            } catch (error) {
                res.statusCode = 500;
                res.end("Ocurió un problema en el servidor..." + error);
            }
        });
    }
    if (req.url.startsWith("/candidato?id") && req.method == "DELETE") {
        try {
            let {id} = url.parse(req.url, true).query;
            await eliminarCandidato(id);
            res.end("Candidato eliminado");
        } catch (error) {
            res.statusCode = 500;
            res.end("Ocurió un problema en el servidor..." + error);
        }
    }

    if (req.url == "/votos" && req.method == "POST") {
        let body = "";
        req.on("data", (chunk) => {
            body += chunk.toString();
        });
        req.on("end", async () => {
            try {
                const voto = JSON.parse(body);
                const result = await registrarVotos(voto);
                res.statusCode = 201;
                res.end(JSON.stringify(result));
            } catch (error) {
                res.statusCode = 500;
                res.end("Ocurrió un problema en el servidor..." + error);
            }
        })
    }

    if(req.url == "/historial" && req.method == "GET") {
        try {
            const historial = await getHistorial();
            res.end(JSON.stringify(historial));
        } catch (error) {
            res.statusCode = 500;
            res.end("Ocurrió un problema en el servidor..." + error);
        }
    }

}).listen(3000, console.log("SERVER ON"))
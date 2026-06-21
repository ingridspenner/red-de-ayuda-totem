const http = require("http");
const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const root = __dirname;
const port = Number(process.env.PORT || 4173);
const host = process.env.HOST || "0.0.0.0";
const pointsPath = path.join(root, "puntos.json");

const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".csv": "text/csv; charset=utf-8",
  ".svg": "image/svg+xml; charset=utf-8",
  ".xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp"
};

function sendJson(response, status, data) {
  response.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store"
  });
  response.end(JSON.stringify(data, null, 2));
}

function readBody(request) {
  return new Promise((resolve, reject) => {
    let body = "";
    request.on("data", (chunk) => {
      body += chunk;
      if (body.length > 1_000_000) {
        request.destroy();
        reject(new Error("Payload too large"));
      }
    });
    request.on("end", () => resolve(body));
    request.on("error", reject);
  });
}

function welcomeAudio() {
  const script = [
    "Add-Type -AssemblyName System.Speech",
    "$ms = New-Object System.IO.MemoryStream",
    "$s = New-Object System.Speech.Synthesis.SpeechSynthesizer",
    "$s.SelectVoiceByHints([System.Speech.Synthesis.VoiceGender]::Female)",
    "$s.Rate = -2",
    "$s.SetOutputToWaveStream($ms)",
    "$s.Speak('Toca la pantalla para comenzar.')",
    "$s.Dispose()",
    "[Convert]::ToBase64String($ms.ToArray())"
  ].join("; ");
  const base64 = execFileSync("powershell.exe", ["-NoProfile", "-Command", script], {
    encoding: "utf8",
    maxBuffer: 2_000_000
  }).trim();
  return Buffer.from(base64, "base64");
}

function cleanPoint(point) {
  return {
    id: String(point.id || "").trim(),
    tipo: String(point.tipo || "").trim(),
    nombre: String(point.nombre || "").trim(),
    lat: Number(point.lat),
    lng: Number(point.lng),
    direccion: String(point.direccion || "").trim(),
    horario: String(point.horario || "").trim(),
    servicios: Array.isArray(point.servicios)
      ? point.servicios.map((item) => String(item).trim()).filter(Boolean)
      : []
  };
}

function validatePoint(point) {
  return (
    point.id &&
    ["refugio", "comida"].includes(point.tipo) &&
    point.nombre &&
    Number.isFinite(point.lat) &&
    Number.isFinite(point.lng) &&
    point.direccion &&
    point.horario
  );
}

const server = http.createServer(async (request, response) => {
  const urlPath = decodeURIComponent(new URL(request.url, `http://${request.headers.host}`).pathname);

  if (urlPath === "/api/puntos" && request.method === "GET") {
    fs.readFile(pointsPath, "utf8", (error, data) => {
      if (error) return sendJson(response, 500, { error: "No se pudo leer puntos.json" });
      response.writeHead(200, {
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": "no-store"
      });
      response.end(data);
    });
    return;
  }

  if (urlPath === "/api/welcome-audio" && request.method === "GET") {
    try {
      response.writeHead(200, {
        "Content-Type": "audio/wav",
        "Cache-Control": "no-store"
      });
      response.end(welcomeAudio());
    } catch {
      response.writeHead(500);
      response.end("No se pudo generar el audio");
    }
    return;
  }

  if (urlPath === "/api/puntos" && request.method === "POST") {
    try {
      const point = cleanPoint(JSON.parse(await readBody(request)));
      if (!validatePoint(point)) return sendJson(response, 400, { error: "Datos incompletos" });

      const current = JSON.parse(fs.readFileSync(pointsPath, "utf8"));
      const next = current.filter((item) => item.id !== point.id).concat(point);
      fs.writeFileSync(pointsPath, `${JSON.stringify(next, null, 2)}\n`, "utf8");
      sendJson(response, 200, { ok: true, point });
    } catch {
      sendJson(response, 400, { error: "No se pudo guardar el punto" });
    }
    return;
  }

  const safePath = path.normalize(urlPath).replace(/^([/\\])+/, "").replace(/^(\.\.[/\\])+/, "");
  const filePath = path.join(root, safePath === "" || safePath === "." || safePath === "admin" ? "index.html" : safePath);

  if (!filePath.startsWith(root)) {
    response.writeHead(403);
    response.end("Forbidden");
    return;
  }

  fs.readFile(filePath, (error, data) => {
    if (error) {
      response.writeHead(404);
      response.end("Not found");
      return;
    }

    response.writeHead(200, {
      "Content-Type": types[path.extname(filePath)] || "application/octet-stream",
      "Cache-Control": "no-store"
    });
    response.end(data);
  });
});

server.listen(port, host, () => {
  console.log(`Totem app running at http://${host}:${port}`);
});

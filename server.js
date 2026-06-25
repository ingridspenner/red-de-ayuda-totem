const http = require("http");
const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const root = __dirname;
const port = Number(process.env.PORT || 4173);
const host = process.env.HOST || "0.0.0.0";
const csvPath = path.join(root, "puntos-actualizados.csv");

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
    "Cache-Control": "no-store",
    "Access-Control-Allow-Origin": "*"
  });
  response.end(JSON.stringify(data, null, 2));
}

function parseDelimitedText(text) {
  const delimiter = text.includes(";") ? ";" : ",";
  const rows = [];
  let row = [];
  let value = "";
  let quoted = false;

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    const next = text[index + 1];

    if (char === '"' && quoted && next === '"') {
      value += '"';
      index += 1;
    } else if (char === '"') {
      quoted = !quoted;
    } else if (char === delimiter && !quoted) {
      row.push(value);
      value = "";
    } else if ((char === "\n" || char === "\r") && !quoted) {
      if (char === "\r" && next === "\n") index += 1;
      row.push(value);
      if (row.some((cell) => cell.trim())) rows.push(row);
      row = [];
      value = "";
    } else {
      value += char;
    }
  }

  row.push(value);
  if (row.some((cell) => cell.trim())) rows.push(row);
  return rows;
}

function normalizeColumnName(value) {
  return String(value)
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "_");
}

function parseCoordinate(value, type) {
  const raw = String(value || "").trim();
  if (!raw) return NaN;

  const direct = Number(raw.replace(",", "."));
  const max = type === "lat" ? 90 : 180;
  if (Number.isFinite(direct) && Math.abs(direct) <= max) return direct;

  const sign = raw.includes("-") ? -1 : 1;
  const digits = raw.replace(/[^0-9]/g, "");
  if (!digits) return NaN;

  const fixed = Number(`${digits.slice(0, 2)}.${digits.slice(2)}`);
  return Number.isFinite(fixed) ? sign * fixed : NaN;
}

function csvRowToPoint(row) {
  const normalized = {};
  Object.entries(row).forEach(([key, value]) => {
    normalized[normalizeColumnName(key)] = value;
  });

  const point = cleanPoint({
    id: normalized.id,
    tipo: normalized.tipo,
    nombre: normalized.nombre,
    lat: parseCoordinate(normalized.lat || normalized.latitud, "lat"),
    lng: parseCoordinate(normalized.lng || normalized.longitud, "lng"),
    direccion: normalized.direccion,
    horario: normalized.horario,
    servicios: String(normalized.servicios || "")
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean),
    imagen: normalized.imagen,
    telefono: normalized.telefono,
    descripcion: normalized.descripcion
  });

  return validatePoint(point) ? point : null;
}

function readPoints() {
  const rows = parseDelimitedText(fs.readFileSync(csvPath, "utf8"));
  const headers = rows.shift()?.map(normalizeColumnName) || [];
  return rows
    .map((values) => {
      const row = {};
      headers.forEach((header, index) => {
        row[header] = values[index] || "";
      });
      return csvRowToPoint(row);
    })
    .filter(Boolean);
}

function filterPoints(points, tipo) {
  if (!tipo) return points;
  if (tipo === "comedores") return points.filter((point) => point.tipo === "comida");
  if (tipo === "refugios") return points.filter((point) => point.tipo === "refugio");
  return points.filter((point) => point.tipo === tipo);
}

function toGeoJson(points) {
  return {
    type: "FeatureCollection",
    features: points.map((point) => ({
      type: "Feature",
      id: point.id,
      geometry: {
        type: "Point",
        coordinates: [point.lng, point.lat]
      },
      properties: {
        id: point.id,
        tipo: point.tipo,
        nombre: point.nombre,
        direccion: point.direccion,
        horario: point.horario,
        servicios: point.servicios,
        imagen: point.imagen,
        telefono: point.telefono,
        descripcion: point.descripcion
      }
    }))
  };
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
      : [],
    imagen: String(point.imagen || "").trim(),
    telefono: String(point.telefono || "").trim(),
    descripcion: String(point.descripcion || "").trim()
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
  const url = new URL(request.url, `http://${request.headers.host}`);
  const urlPath = decodeURIComponent(url.pathname);

  if (urlPath === "/api/puntos" && request.method === "GET") {
    const points = filterPoints(readPoints(), url.searchParams.get("tipo"));
    sendJson(response, 200, points);
    return;
  }

  if (urlPath.startsWith("/api/puntos/") && request.method === "GET") {
    const id = urlPath.replace("/api/puntos/", "");
    const point = readPoints().find((item) => item.id === id);
    sendJson(response, point ? 200 : 404, point || { error: "Punto no encontrado" });
    return;
  }

  if ((urlPath === "/api/mapa" || urlPath === "/api/geojson") && request.method === "GET") {
    const points = filterPoints(readPoints(), url.searchParams.get("tipo"));
    sendJson(response, 200, toGeoJson(points));
    return;
  }

  if (urlPath === "/api/csv" && request.method === "GET") {
    response.writeHead(200, {
      "Content-Type": "text/csv; charset=utf-8",
      "Cache-Control": "no-store",
      "Access-Control-Allow-Origin": "*"
    });
    response.end(fs.readFileSync(csvPath, "utf8"));
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

      const current = readPoints();
      const next = current.filter((item) => item.id !== point.id).concat(point);
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

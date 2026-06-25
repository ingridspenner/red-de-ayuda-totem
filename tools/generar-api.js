const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const csvPath = path.join(root, "puntos-actualizados.csv");
const apiDir = path.join(root, "api");
const datosDir = path.join(root, "datos");

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
  if (!raw) return null;

  const direct = Number(raw.replace(",", "."));
  const max = type === "lat" ? 90 : 180;
  if (Number.isFinite(direct) && Math.abs(direct) <= max) return direct;

  const sign = raw.includes("-") ? -1 : 1;
  const digits = raw.replace(/[^0-9]/g, "");
  if (!digits) return null;

  const integerLength = 2;
  const fixed = Number(`${digits.slice(0, integerLength)}.${digits.slice(integerLength)}`);
  if (!Number.isFinite(fixed)) return null;

  return sign * fixed;
}

function toPoint(row) {
  const normalized = {};
  Object.entries(row).forEach(([key, value]) => {
    normalized[normalizeColumnName(key)] = value;
  });

  const tipo = String(normalized.tipo || "").trim().toLowerCase();
  const lat = parseCoordinate(normalized.lat || normalized.latitud || "", "lat");
  const lng = parseCoordinate(normalized.lng || normalized.longitud || "", "lng");
  const nombre = String(normalized.nombre || "").trim();

  if (!["refugio", "comida"].includes(tipo) || !nombre || lat === null || lng === null) {
    return null;
  }

  return {
    id: String(normalized.id || "").trim(),
    tipo,
    nombre,
    lat,
    lng,
    direccion: String(normalized.direccion || "").trim(),
    horario: String(normalized.horario || "").trim(),
    servicios: String(normalized.servicios || "")
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean),
    imagen: String(normalized.imagen || "").trim(),
    telefono: String(normalized.telefono || "").trim(),
    descripcion: String(normalized.descripcion || "").trim()
  };
}

function readPoints() {
  const rows = parseDelimitedText(fs.readFileSync(csvPath, "utf8"));
  const headers = rows.shift().map(normalizeColumnName);
  return rows
    .map((values) => {
      const row = {};
      headers.forEach((header, index) => {
        row[header] = values[index] || "";
      });
      return toPoint(row);
    })
    .filter(Boolean);
}

function geoJson(points) {
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

function writeJson(dir, fileName, data) {
  fs.writeFileSync(path.join(dir, fileName), `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

fs.mkdirSync(apiDir, { recursive: true });
fs.mkdirSync(datosDir, { recursive: true });

const puntos = readPoints();
const refugios = puntos.filter((point) => point.tipo === "refugio");
const comedores = puntos.filter((point) => point.tipo === "comida");

["api", "datos"].forEach((dirName) => {
  const dir = dirName === "api" ? apiDir : datosDir;
  writeJson(dir, "puntos.json", puntos);
  writeJson(dir, "refugios.json", refugios);
  writeJson(dir, "comedores.json", comedores);
  writeJson(dir, "mapa.geojson", geoJson(puntos));
  writeJson(dir, "refugios.geojson", geoJson(refugios));
  writeJson(dir, "comedores.geojson", geoJson(comedores));
});

console.log(`API generada: ${puntos.length} puntos`);

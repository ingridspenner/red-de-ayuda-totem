const app = document.querySelector("#app");

const state = {
  screen: window.location.pathname === "/admin" || window.location.hash === "#admin" ? "admin" : "welcome",
  points: [],
  selected: null,
  highlightTimers: [],
  userPosition: null,
  map: null,
  adminMessage: ""
};

const tapIconDataUrl = "data:image/png;base64,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";

const screens = {
  welcome: "Toca la pantalla para comenzar.",
  menu: "Elegí refugio, comida, o ayuda.",
  refugios: "Mostrando refugios cercanos a tu ubicación. Tocá un refugio para ver más información.",
  comida: "Mostrando lugares donde brindan comida cerca tuyo. Tocá un lugar para ver más información.",
  emergencia: "Ayuda y emergencia. Podés llamar a emergencias o pedir ayuda a una persona.",
  emergencyWaiting: "Espera aquí. Emergencias está en camino.",
  waiting: "Aguardá. La ayuda está en camino.",
  route: "Mostrando el recorrido desde el tótem hasta el lugar elegido.",
  admin: ""
};

const typeConfig = {
  refugio: {
    title: "REFUGIOS",
    subtitle: "Mapa de refugios más cercanos",
    detailSubtitle: "Información del refugio",
    color: "green",
    icon: "refuge",
    footer: "Mostrando refugios cercanos a tu ubicación",
    route: "CÓMO LLEGAR"
  },
  comida: {
    title: "COMIDA",
    subtitle: "Mapa de lugares donde brindan comida",
    detailSubtitle: "Información del lugar",
    color: "orange",
    icon: "food",
    footer: "Mostrando lugares donde brindan comida cerca tuyo",
    route: "CÓMO LLEGAR"
  }
};

const defaultPosition = {
  lat: -31.4167,
  lng: -64.1833
};

const iconPaths = {
  hand: `<path d="M10 11V6a2 2 0 1 1 4 0v9"/><path d="M14 9V5a2 2 0 1 1 4 0v10"/><path d="M18 10V7a2 2 0 1 1 4 0v10a9 9 0 0 1-18 0v-4a2 2 0 1 1 4 0v4"/><path d="M7 13V3a2 2 0 1 1 4 0v10"/>`,
  home: `<path d="m3 11 9-8 9 8"/><path d="M5 10v10h14V10"/><path d="M9 20v-6h6v6"/>`,
  food: `<path d="M7 2v8"/><path d="M11 2v8"/><path d="M7 6h4"/><path d="M9 10v12"/><path d="M17 2v20"/><path d="M17 2c3 2 4 8 0 10"/>`,
  phone: `<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.9a2 2 0 0 1-.4 2.1L8.1 10a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.9.6 2.9.7a2 2 0 0 1 1.6 1.9z"/>`,
  alert: `<path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/><path d="M12 9v4"/><path d="M12 17h.01"/>`,
  arrow: `<path d="m15 18-6-6 6-6"/>`,
  right: `<path d="m9 18 6-6-6-6"/>`,
  speaker: `<path d="M11 5 6 9H2v6h4l5 4V5z"/><path d="M15.5 8.5a5 5 0 0 1 0 7"/><path d="M18.5 5.5a9 9 0 0 1 0 13"/>`,
  people: `<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.9"/><path d="M16 3.1a4 4 0 0 1 0 7.8"/>`,
  pin: `<path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0z"/><circle cx="12" cy="10" r="3"/>`,
  clock: `<circle cx="12" cy="12" r="9"/><path d="M12 7v6l4 2"/>`,
  bed: `<path d="M3 7v13"/><path d="M21 12v8"/><path d="M3 12h18"/><path d="M7 12V8h6a4 4 0 0 1 4 4"/>`,
  send: `<path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/>`,
  user: `<path d="M20 21a8 8 0 0 0-16 0"/><circle cx="12" cy="7" r="4"/>`,
  ambulance: `<path d="M10 17h4"/><path d="M12 15v4"/><path d="M5 17H3V6h11v11"/><path d="M14 9h4l3 4v4h-2"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/>`
};

function icon(name, className = "icon") {
  return `<svg class="${className}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${iconPaths[name]}</svg>`;
}

function helpNetworkLogo(className = "icon big") {
  return `
    <svg class="${className}" viewBox="0 0 317.95 311.9" fill="none" aria-hidden="true">
      <path fill="currentColor" d="M262.07,168.12h0c-4.8,4.34-11.03,6.74-17.49,6.76l-114.22.25c-1.49-.85-6.35-4.9-6.37-6.45l-.17-15.39c-.37-33.15,20.74-59.92,52.52-68.53,32.41-8.78,66.94,8.85,80.71,40.67,2.07,4.79,3.89,12.99,4.09,18.21l.94,24.49Z"/>
      <path fill="currentColor" d="M108.58,172.4c.7-.02-6.03,2.48-7.67,2.49l-58.92.31c-2.72.01-8.36-1.59-9.72-3.22-1.69-2.04-2.36-6.71-2.66-10.76-1.9-26,6.95-49.54,27.72-64.99,22.34-16.62,52.29-18.62,75.74-1.96-11.51,11.03-22.11,25.15-22.84,41.45l-1.65,36.67Z"/>
      <circle fill="currentColor" cx="96.55" cy="35.01" r="34.96"/>
      <circle fill="currentColor" cx="192.94" cy="34.94" r="34.94"/>
      <path fill="currentColor" d="M.35,273.67L0,224.46c-.02-.46-.12-3.34,2.13-5.57,2.63-2.59,6.14-2.01,6.47-1.95l50.93.05,15.26-10.66c14.91-10.42,39.41-16.29,55.77-9.57l12.38,5.09,56.36,1.5c5.42.14,12.11,11.38,12.46,16.43.35,5.05-5.52,16.76-11.25,16.83l-61.02.72c-6.31.07-10.18,6.95-6.97,12.38h0c1.48,2.5,4.17,4.03,7.07,4.03l63.44-.05c2.81,0,11.71-3.21,13.98-5.11l51.54-43.17c6.8-5.69,16.66-10.8,24.51-12.96,12.2-3.37,25.67,7.44,24.83,19.05-2.94,5.05-13.05,11.85-17.34,16.16-34.99,35.11-64.85,73.33-114.67,81.17l-13.22,2.08-25.03.97c-9.89.38-25.39-2.59-34.43-6.62l-30.82-13.7-16.23-7.22c-1.33-.59-8.1-2.71-9.73-2.71l-49.61-.05c-.61.06-2.51.18-4.2-1.04-2-1.44-2.9-4.16-2.27-6.88Z"/>
    </svg>
  `;
}

function mainButtonIcon(name, className = "action-icon-frame") {
  const icons = {
    refuge: {
      viewBox: "0 0 113.83 108.29",
      paths: `<path fill="currentColor" d="M66.45,73l-19.1-.13c-1.29,0-3.92,2.33-3.93,3.66l-.11,27.79c0,1.36-2.14,3.38-3.14,3.89l-21.8.06c-3.54-.67-5.84-3.49-5.85-7.02l-.02-41.53h-7.51c-1.68,0-3.83-1.2-4.71-2.85-.65-1.22-.12-3.96,1.08-5.12l17.44-16.84L52.8,1.58c2.48-2.43,5.98-1.85,8.3.41l29,28.3,16.17,15.66,5.78,5.3c.9.82,1.87,3.27,1.78,4.45-.09,1.18-1.97,3.56-3.15,3.62l-9.64.48v40.69c0,3.29-1.85,7.62-5.92,7.64l-20.94.14c-1.36,0-3.91-2.49-3.91-4.02v-25.58c.01-1.87-1-5.67-3.8-5.69Z"/>`
    },
    food: {
      viewBox: "0 0 79.02 130.07",
      paths: `<path fill="currentColor" d="M40.8,2.68l.14,45.39c.02,5.83-3.68,11.9-8.49,14.88-2.32,1.44-4.24,3.47-4.25,6.18l-.11,54.67c0,3.85-5.37,6.42-8.05,6.27-3.31-.19-7.67-2.67-7.68-6.86l-.07-53.99c0-1.9-1.6-4.71-3.1-5.64C3.64,60.13.09,54.39.07,47.75L0,3.04C1.12,1.72,3.72-.09,5.02.12s3.28,1.92,4.28,3.2l-.1,35.06c1.02.87,2.91,1.98,3.95,1.99,1.26,0,2.83-2.63,2.83-4.12l-.02-32.56c0-1.61,2.83-3.45,4.16-3.67,1.51-.25,5.01,1.64,5.01,3.29v33.04c0,1.48,1.52,4.08,2.94,4.22,1.77.17,3.83-2.13,3.82-4.23l-.16-31.35c0-1.58,1.47-3.73,2.48-4.62,1.16-1.02,6.57.54,6.58,2.3Z"/><path fill="currentColor" d="M62.92,124.11l.04-55.03c0-4.81-8-4.09-9.95-12.59l-.02-51.02c.33-1.39,2.88-5.11,4.58-5.11l18.11.02c1.64,0,3.35,3.98,3.35,5.89l-.1,116.85c0,3.74-4.41,6.65-6.87,6.91-3.8.41-7.2-1.86-9.13-5.9Z"/>`
    },
    emergency: {
      viewBox: "0 0 86.01 82.83",
      paths: `<path fill="currentColor" d="M57.14,16.58l.96,1.81,3.09,5.98,1.06,2.06,1.37,2.68,1.06,1.1,1.06,2.68,19.54,36.48c1.3,3.14.84,7.2-1.21,9.78-1.88,2.37-5.11,3.68-8.6,3.68l-66.88-.11c-6.23-.01-9.91-7.3-8.15-12.4l1.13-3.28.47-.46L25.95,21.58l3.49-6.57,2.45-4.78,2.33-4.54C35.66,2.88,39.05.23,42.01.02c3.26-.24,7.08,1.87,8.66,4.75l6.48,11.81ZM43,53.36c1.18.2,4.09-2.12,4.1-3.21l.18-27.53c-.63-1.35-3.82-2.76-5.16-2.66-1.15.08-3.69,1.91-3.69,3.25l.04,24.82c0,2.6,1.67,4.85,4.53,5.33ZM48.7,65.59c0-3.18-2.58-5.76-5.76-5.76s-5.76,2.58-5.76,5.76,2.58,5.76,5.76,5.76,5.76-2.58,5.76-5.76Z"/>`
    }
  };
  const selectedIcon = icons[name];
  return `<span class="${className}"><svg class="action-svg" viewBox="${selectedIcon.viewBox}" aria-hidden="true">${selectedIcon.paths}</svg></span>`;
}

function emergencyActionIcon(name) {
  const icons = {
    people: {
      viewBox: "0 0 89.61 67.47",
      paths: `<path fill="currentColor" d="M89.61,64.74l-2.87,2.59-47.85.1c-.57-.33-2.44-1.89-2.45-2.48l-.07-5.93c-.14-12.76,7.98-23.07,20.22-26.39,12.41-3.36,25.64,3.34,31,15.47.56,1.27,1.55,4.41,1.6,5.79l.41,10.84Z"/><path fill="currentColor" d="M30.5,66.38c.27,0-2.32.96-2.95.96l-22.69.12c-1.05,0-3.22-.61-3.74-1.24-.65-.79-.91-2.58-1.02-4.14-.73-10.01,2.68-19.08,10.67-25.03,8.6-6.4,20.13-7.17,29.16-.75-4.43,4.25-8.51,9.69-8.8,15.96l-.64,14.12Z"/><circle fill="currentColor" cx="25.87" cy="13.48" r="13.46"/><circle fill="currentColor" cx="62.99" cy="13.45" r="13.45"/>`
    },
    cross: {
      viewBox: "0 0 92.27 93.36",
      paths: `<path fill="currentColor" d="M86.5,60.91l-24.13-.35-1.47,1.52v1.3s-.09,18.12-.09,18.12v2.91s-.18,4.56-.18,4.56c-.06,1.59-3.72,4.37-5.28,4.37l-18.19.03c-1.49,0-4.91-2.96-5.02-3.6-.22-.16-.76-2.42-.76-3.08l-.04-24.47c0-.47-.27-1.68-.72-1.68h-2.17s-24.25.28-24.25.28c-1.44-.29-4.06-3.64-4.08-5.46L0,37.63c-.01-1.98,2.56-5.23,4.23-5.52l21.11.1,5.95-1.35.08-25.2.42-1.38c0-.28,3.18-3.83,4.52-3.85l20.35-.41,4.14,4.22.08,27.6,26.57.02c1.67,0,4.83,3.35,4.82,5l-.02,18.24c0,3.25-3.17,6.15-5.75,5.83Z"/>`
    }
  };
  const selectedIcon = icons[name];
  return `<span class="help-icon"><svg viewBox="${selectedIcon.viewBox}" aria-hidden="true">${selectedIcon.paths}</svg></span>`;
}

function emergencySirenIcon() {
  return `
    <svg class="emergency-waiting-icon" viewBox="0 0 772 772" aria-hidden="true">
      <path fill="currentColor" d="M96 410c0-156.9 129.6-282 290-282s290 125.1 290 282v136c0 18.8-15.2 34-34 34H130c-18.8 0-34-15.2-34-34V410Z"/>
      <rect fill="currentColor" x="0" y="642" width="772" height="130" rx="65"/>
      <g fill="none" stroke="currentColor" stroke-width="48" stroke-linecap="round">
        <path d="M386 88V36"/>
        <path d="M214 156l-42-42"/>
        <path d="M558 156l42-42"/>
        <path d="M126 262l-52-52"/>
        <path d="M646 262l52-52"/>
      </g>
      <path fill="var(--red)" d="M289 449c-17 0-31-14-31-31 0-70 57-127 127-127 18 0 32 14 32 31s-14 31-32 31c-36 0-65 29-65 65 0 17-14 31-31 31Z"/>
    </svg>
  `;
}

function assistanceOnWayIcon() {
  return `
    <svg class="assistance-waiting-icon" viewBox="0 0 748 996" aria-hidden="true">
      <circle fill="currentColor" cx="374" cy="250" r="250"/>
      <path fill="currentColor" d="M0 954c0-205 167-372 374-372s374 167 374 372c0 23-19 42-42 42H42c-23 0-42-19-42-42Z"/>
      <path fill="var(--red)" d="M374 930c-33 0-136-99-182-173-38-61-24-128 31-147 54-19 117 18 144 92 2 6 12 6 14 0 27-74 90-111 144-92 55 19 69 86 31 147-46 74-149 173-182 173Z"/>
    </svg>
  `;
}

async function loadPoints() {
  try {
    state.points = await fetchPoints();
  } catch {
    state.points = [];
  }
}

async function fetchPoints() {
  const csvResponse = await fetch("puntos-actualizados.csv", { cache: "no-store" });
  if (csvResponse.ok) {
    return parsePointsCsv(await csvResponse.text());
  }

  if (window.XLSX) {
    const response = await fetch("puntos.xlsx", { cache: "no-store" });
    if (response.ok) {
      const workbook = window.XLSX.read(await response.arrayBuffer(), { type: "array" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = window.XLSX.utils.sheet_to_json(sheet, { defval: "" });
      return rows.map(excelRowToPoint).filter(Boolean);
    }
  }

  const response = await fetch("/api/puntos", { cache: "no-store" });
  if (!response.ok) throw new Error("No se pudo cargar puntos");
  return response.json();
}

function parsePointsCsv(text) {
  const rows = parseDelimitedText(text);
  const headers = rows.shift()?.map(normalizeColumnName) || [];
  return rows
    .map((values) => {
      const row = {};
      headers.forEach((header, index) => {
        row[header] = values[index] || "";
      });
      return excelRowToPoint(row);
    })
    .filter(Boolean);
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

function excelRowToPoint(row) {
  const normalized = {};
  Object.entries(row).forEach(([key, value]) => {
    normalized[normalizeColumnName(key)] = value;
  });

  const tipo = String(normalized.tipo || "").trim().toLowerCase();
  const lat = parseCoordinate(normalized.lat || normalized.latitud || "", "lat");
  const lng = parseCoordinate(normalized.lng || normalized.longitud || "", "lng");
  const nombre = String(normalized.nombre || "").trim();

  if (!["refugio", "comida"].includes(tipo) || !nombre || !Number.isFinite(lat) || !Number.isFinite(lng)) {
    return null;
  }

  return {
    id: String(normalized.id || `${tipo}-${slugify(nombre)}`).trim(),
    tipo,
    nombre,
    lat,
    lng,
    direccion: String(normalized.direccion || normalized.referencia || "").trim(),
    horario: String(normalized.horario || "").trim(),
    servicios: String(normalized.servicios || "")
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean),
    imagen: String(normalized.imagen || "").trim(),
    telefono: String(normalized.telefono || normalized.contacto || "").trim(),
    descripcion: String(normalized.descripcion || "").trim()
  };
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

  const integerLength = 2;
  const fixed = Number(`${digits.slice(0, integerLength)}.${digits.slice(integerLength)}`);
  if (!Number.isFinite(fixed)) return NaN;

  return sign * fixed;
}

function slugify(value) {
  return normalizeColumnName(value).replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

async function savePoint(point) {
  const response = await fetch("/api/puntos", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(point)
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(result.error || "No se pudo guardar el punto");
  return result.point;
}

function speak(text, highlights = []) {
  if (!("speechSynthesis" in window)) return;
  clearSpeechHighlights();
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  let boundaryMode = false;
  utterance.lang = "es-AR";
  utterance.rate = 0.88;
  utterance.onboundary = (event) => {
    if (event.name !== "word" || !highlights.length) return;
    if (!boundaryMode) {
      boundaryMode = true;
      state.highlightTimers.forEach((timer) => window.clearTimeout(timer));
      state.highlightTimers = [];
    }
    const active = highlights.find((item) => isWordAtIndex(text, item.word, event.charIndex));
    if (active) pulseButton(active.target);
  };
  utterance.onend = clearSpeechHighlights;
  window.speechSynthesis.speak(utterance);
  scheduleFallbackHighlights(text, highlights);
}

function speakWelcomeAutomatically() {
  if (state.screen !== "welcome") return;
  if (!("speechSynthesis" in window)) {
    playWelcomeAudioFallback();
    return;
  }
  const speakWelcome = () => speak(screens.welcome);
  window.setTimeout(speakWelcome, 450);
  window.speechSynthesis.onvoiceschanged = speakWelcome;
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden && state.screen === "welcome") speakWelcome();
  }, { once: true });
}

function playWelcomeAudioFallback() {
  const audio = app.querySelector("[data-welcome-audio]") || new Audio("/api/welcome-audio");
  audio.preload = "auto";
  window.setTimeout(() => {
    audio.muted = true;
    audio.play()
      .then(() => {
        window.setTimeout(() => {
          audio.muted = false;
        }, 80);
      })
      .catch(() => {
        audio.muted = false;
      });
  }, 450);
}

function go(screen, selected = null) {
  state.screen = screen;
  state.selected = selected;
  render();
  speakCue();
}

function getInstruction() {
  if (state.screen === "detail" && state.selected) {
    return getDetailInstruction(state.selected);
  }
  if (state.screen === "route" && state.selected) {
    return `Mostrando el recorrido desde el tótem hasta ${state.selected.nombre}.`;
  }
  return screens[state.screen] || "";
}

function getDetailInstruction(point) {
  const services = point.servicios.length ? `Servicios: ${point.servicios.join(", ")}. ` : "";
  const description = point.descripcion ? `${point.descripcion}. ` : "";
  return `${point.nombre}. ${description}${point.direccion}. ${point.horario}. ${services}Tocá cómo llegar para iniciar el recorrido.`;
}

function getSpeechCue() {
  if (state.screen === "menu") {
    return {
      text: screens.menu,
      highlights: [
        { word: "refugio", target: "refugios", delay: 650 },
        { word: "comida", target: "comida", delay: 1500 },
        { word: "ayuda", target: "emergencia", delay: 2300 }
      ]
    };
  }

  if (state.screen === "detail" && state.selected) {
    return {
      text: getDetailInstruction(state.selected),
      highlights: [{ word: "cómo llegar", target: "route", delay: 5200 }]
    };
  }

  if (state.screen === "emergencia") {
    return {
      text: screens.emergencia,
      highlights: [
        { word: "llamar a emergencias", target: "call-emergency", delay: 900 },
        { word: "pedir ayuda", target: "ask-help", delay: 2300 }
      ]
    };
  }

  return { text: getInstruction(), highlights: [] };
}

function speakCue() {
  const cue = getSpeechCue();
  speak(cue.text, cue.highlights);
}

function isWordAtIndex(text, word, charIndex) {
  const source = text.toLocaleLowerCase("es-AR");
  const target = word.toLocaleLowerCase("es-AR");
  const start = source.indexOf(target);
  return start >= 0 && charIndex >= start && charIndex <= start + target.length;
}

function pulseButton(target) {
  const button = app.querySelector(`[data-audio-target="${target}"], [data-route-target="${target}"], [data-help-target="${target}"]`);
  if (!button) return;
  button.classList.add("is-speaking");
  window.setTimeout(() => button.classList.remove("is-speaking"), 900);
}

function clearSpeechHighlights() {
  state.highlightTimers.forEach((timer) => window.clearTimeout(timer));
  state.highlightTimers = [];
  app.querySelectorAll(".is-speaking").forEach((button) => button.classList.remove("is-speaking"));
}

function scheduleFallbackHighlights(text, highlights) {
  if (!highlights.length) return;
  const words = text.split(/\s+/).length;
  const estimatedDuration = Math.max(2600, words * 420);

  highlights.forEach((item) => {
    const index = text.toLocaleLowerCase("es-AR").indexOf(item.word);
    if (index < 0) return;
    const timer = window.setTimeout(
      () => pulseButton(item.target),
      item.delay || Math.max(500, estimatedDuration * (index / text.length))
    );
    state.highlightTimers.push(timer);
  });
}

function topBar(config, showBack = true) {
  return `
    <header class="top ${config.color}">
      ${brandHeader()}
      ${showBack ? `<button class="back-mini" data-go="${config.back || "menu"}" aria-label="Volver">${icon("arrow")}</button>` : ""}
      ${config.customIcon ? mainButtonIcon(config.customIcon, "section-icon") : icon(config.icon, "icon")}
      <div class="top-copy">
        <h1 class="top-title">${config.title}</h1>
      </div>
    </header>
  `;
}

function footer(backTo, text = "") {
  return `
    <footer class="footer ${text ? "" : "single"}">
      ${text ? `<button class="voice-button" data-speak aria-label="Repetir instrucción">${icon("speaker")}</button><div class="footer-text">${text}</div>` : ""}
      <button class="back-button" data-go="${backTo}">
        ${icon("arrow")}
        VOLVER ATRÁS
      </button>
    </footer>
  `;
}

function brandFooter() {
  return `
    <div class="brand-footer" aria-label="Red de ayuda">
      ${helpNetworkLogo("brand-logo")}
      <strong>RED DE AYUDA</strong>
    </div>
  `;
}

function brandHeader() {
  return `
    <div class="brand-header" aria-label="Red de ayuda">
      ${helpNetworkLogo("brand-header-logo")}
      <strong>RED DE AYUDA</strong>
    </div>
  `;
}

function render() {
  destroyMap();
  const templates = {
    welcome: renderWelcome,
    menu: renderMenu,
    refugios: () => renderMap("refugio"),
    comida: () => renderMap("comida"),
    emergencia: renderEmergency,
    emergencyWaiting: renderEmergencyWaiting,
    detail: renderDetail,
    route: renderRouteMap,
    waiting: renderWaiting,
    admin: renderAdmin
  };
  app.innerHTML = templates[state.screen]();
  bindEvents();
  if (state.screen === "refugios") {
    initServiceMap("refugio");
    requestUserPosition("refugio");
  }
  if (state.screen === "comida") {
    initServiceMap("comida");
    requestUserPosition("comida");
  }
  if (state.screen === "route" && state.selected) {
    initRouteMap(state.selected);
    requestRoutePosition(state.selected);
  }
}

function renderWelcome() {
  return `
    <button class="screen welcome tap-target" data-go="menu" aria-label="Tocar para empezar">
      ${brandHeader()}
      ${tapIconMarkup()}
      <h1>TOCÁ LA PANTALLA PARA EMPEZAR</h1>
      <audio data-welcome-audio src="/api/welcome-audio" autoplay playsinline preload="auto"></audio>
    </button>
  `;
}

function tapIconMarkup() {
  return `
    <svg class="welcome-icon touch-icon" viewBox="0 0 360 470" fill="none" aria-hidden="true">
      <g class="touch-rings" stroke="currentColor" stroke-width="25" stroke-linecap="round" stroke-linejoin="round">
        <path d="M70 260A155 155 0 1 1 290 260" />
        <path d="M114 224A96 96 0 1 1 246 224" />
        <path d="M154 184A38 38 0 1 1 207 207" />
      </g>
      <g class="touch-hand">
        <path fill="currentColor" transform="translate(49 145)" d="M262.48,131.75l.18,77.59c.07,29.9-9.99,59.06-28.31,82.29-9.74,12.35-24,19.42-39.53,19.43l-63.09.03c-15.74,0-30.4-7.66-40.04-19.71l-27.16-33.93L4.59,179.64c-7.79-10.11-5.33-24.45,4.79-31.69,9.24-6.61,22.81-6.3,30.3,2.41l36.29,42.2.17-151.27c0-3.86-.08-7.71-.38-11.56-.38-4.77-.01-14.29,7.32-21.71,1.23-1.24,11.15-10.95,23.58-7.14,8.68,2.66,15.01,10.81,15.86,20.52l.79,74.94c4.9-11.23,12.75-19.14,24.45-18.83,15.84.42,24.67,14.08,23.38,30.22,7.16-12.1,18.26-18.85,30.69-14.28,11.9,4.37,17.17,16.12,15.88,29.76,6.12-6.35,10.75-12.33,19.7-13.31,12.05-1.33,25.03,8.23,25.06,21.85Z" />
      </g>
    </svg>
  `;
}

function renderMenu() {
  return `
    <section class="screen">
      <header class="top purple">
        ${helpNetworkLogo("menu-logo")}
        <h1 class="top-title">RED DE AYUDA</h1>
      </header>
      <div class="menu-body">
        ${mainAction("refugios", "green", "home", "REFUGIOS", "Mapa de refugios más cercanos")}
        ${mainAction("comida", "orange", "food", "COMIDA", "Mapa de lugares donde brindan comida")}
        ${mainAction("emergencia", "red", "alert", "AYUDA Y EMERGENCIA", "Podés llamar o pedir ayuda")}
      </div>
    </section>
  `;
}

function mainAction(goTo, color, iconName, title, text) {
  const customIcon = {
    home: "refuge",
    food: "food",
    alert: "emergency"
  }[iconName];

  return `
    <button class="main-action ${color}" data-go="${goTo}" data-audio-target="${goTo}">
      ${mainButtonIcon(customIcon)}
      <span class="action-copy"><strong>${title}</strong></span>
      ${icon("right")}
    </button>
  `;
}

function renderMap(type) {
  const config = typeConfig[type];
  return `
    <section class="screen map-screen ${config.color}-screen">
      ${topBar({ ...config, customIcon: config.icon })}
      <div class="content">
        <div class="real-map-area" aria-label="Mapa actualizado con puntos cercanos">
          <div id="service-map" class="real-map" role="img" aria-label="Mapa de ${config.title.toLowerCase()}"></div>
        </div>
      </div>
    </section>
  `;
}

function renderRouteMap(point = state.selected) {
  const config = typeConfig[point.tipo];
  return `
    <section class="screen map-screen ${config.color}-screen">
      ${topBar({
        title: "CÓMO LLEGAR",
        subtitle: point.nombre,
        color: config.color,
        customIcon: config.icon,
        back: "detail"
      })}
      <div class="content">
        <div class="real-map-area" aria-label="Mapa con recorrido hasta ${point.nombre}">
          <div id="service-map" class="real-map" role="img" aria-label="Recorrido hasta ${point.nombre}"></div>
          <div class="route-status" data-route-status>Calculando recorrido...</div>
        </div>
      </div>
    </section>
  `;
}

function getFilteredPoints(type) {
  const origin = state.userPosition || defaultPosition;
  return state.points
    .filter((point) => point.tipo === type)
    .map((point) => ({
      ...point,
      distancia: getDistanceMeters(origin.lat, origin.lng, point.lat, point.lng)
    }))
    .sort((a, b) => a.distancia - b.distancia);
}

function requestUserPosition(type) {
  if (!("geolocation" in navigator)) {
    initServiceMap(type);
    refreshCurrentList(type);
    return;
  }
  navigator.geolocation.getCurrentPosition(
    (position) => {
      state.userPosition = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      initServiceMap(type);
      refreshCurrentList(type);
    },
    () => {
      initServiceMap(type);
      refreshCurrentList(type);
    },
    { enableHighAccuracy: true, timeout: 7000, maximumAge: 60000 }
  );
}

function requestRoutePosition(point) {
  if (!("geolocation" in navigator)) {
    initRouteMap(point);
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      state.userPosition = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      initRouteMap(point);
    },
    () => {
      initRouteMap(point);
    },
    { enableHighAccuracy: true, timeout: 7000, maximumAge: 60000 }
  );
}

function destroyMap() {
  if (state.map) {
    state.map.remove();
    state.map = null;
  }
}

function refreshCurrentList(type) {
  const list = app.querySelector(".list");
  if (!list) return;
  list.innerHTML = getFilteredPoints(type).map((point) => placeCard(point)).join("");
  bindDetailEvents();
}

function initServiceMap(type) {
  const mapElement = app.querySelector("#service-map");
  if (!mapElement) return;

  if (!window.L) {
    mapElement.innerHTML = `<div class="map-fallback">Mapa no disponible</div>`;
    return;
  }

  destroyMap();

  const L = window.L;
  const config = typeConfig[type];
  const origin = state.userPosition || defaultPosition;
  const points = getFilteredPoints(type);

  state.map = L.map(mapElement, {
    zoomControl: false,
    attributionControl: true
  }).setView([origin.lat, origin.lng], 15);

  L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
    maxZoom: 19,
    attribution: "&copy; OpenStreetMap &copy; CARTO"
  }).addTo(state.map);

  const bounds = L.latLngBounds([[origin.lat, origin.lng]]);

  L.circleMarker([origin.lat, origin.lng], {
    radius: 13,
    color: "#ffffff",
    weight: 5,
    fillColor: "#0d8af0",
    fillOpacity: 1
  })
    .addTo(state.map)
    .bindTooltip("UbicaciÃ³n del tÃ³tem", { direction: "top" });

  points.forEach((point) => {
    const markerIcon = serviceMarkerIcon(config);
    L.marker([point.lat, point.lng], { icon: markerIcon, title: point.nombre })
      .addTo(state.map)
      .on("click", () => go("detail", point));
    bounds.extend([point.lat, point.lng]);
  });

  if (points.length) {
    state.map.fitBounds(bounds.pad(0.25), { animate: false, maxZoom: 16 });
  }

  setTimeout(() => {
    if (state.map) state.map.invalidateSize();
  }, 80);
}

function serviceMarkerIcon(config) {
  return window.L.divIcon({
    className: `service-map-marker ${config.color}`,
    html: `<span>${mainButtonIcon(config.icon, "map-marker-icon")}</span>`,
    iconSize: [58, 58],
    iconAnchor: [29, 52]
  });
}

async function initRouteMap(point) {
  const mapElement = app.querySelector("#service-map");
  if (!mapElement) return;

  if (!window.L) {
    mapElement.innerHTML = `<div class="map-fallback">Mapa no disponible</div>`;
    return;
  }

  destroyMap();

  const L = window.L;
  const config = typeConfig[point.tipo];
  const origin = state.userPosition || defaultPosition;
  const destination = { lat: point.lat, lng: point.lng };
  const status = app.querySelector("[data-route-status]");

  state.map = L.map(mapElement, {
    zoomControl: false,
    attributionControl: true
  }).setView([origin.lat, origin.lng], 15);

  L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
    maxZoom: 19,
    attribution: "&copy; OpenStreetMap &copy; CARTO"
  }).addTo(state.map);

  L.circleMarker([origin.lat, origin.lng], {
    radius: 13,
    color: "#ffffff",
    weight: 5,
    fillColor: "#0d8af0",
    fillOpacity: 1
  })
    .addTo(state.map)
    .bindTooltip("Tótem", { direction: "top" });

  L.marker([destination.lat, destination.lng], {
    icon: serviceMarkerIcon(config),
    title: point.nombre
  })
    .addTo(state.map)
    .bindTooltip(point.nombre, { direction: "top" });

  const route = await fetchRoute(origin, destination);
  const routePoints = route?.coordinates?.map(([lng, lat]) => [lat, lng]) || [
    [origin.lat, origin.lng],
    [destination.lat, destination.lng]
  ];

  L.polyline(routePoints, {
    color: config.color === "orange" ? "#f07f13" : "#3f9b3c",
    weight: 8,
    opacity: 0.92,
    lineCap: "round",
    lineJoin: "round"
  }).addTo(state.map);

  state.map.fitBounds(L.latLngBounds(routePoints).pad(0.2), { animate: false, maxZoom: 17 });

  if (status) {
    status.textContent = route?.distance
      ? `${formatDistance(route.distance)} hasta ${point.nombre}`
      : `Recorrido aproximado hasta ${point.nombre}`;
  }

  setTimeout(() => {
    if (state.map) state.map.invalidateSize();
  }, 80);
}

async function fetchRoute(origin, destination) {
  const profiles = ["foot", "driving"];

  for (const profile of profiles) {
    try {
      const url = `https://router.project-osrm.org/route/v1/${profile}/${origin.lng},${origin.lat};${destination.lng},${destination.lat}?overview=full&geometries=geojson`;
      const response = await fetch(url);
      if (!response.ok) continue;
      const data = await response.json();
      const route = data.routes?.[0];
      if (route?.geometry?.coordinates?.length) {
        return {
          coordinates: route.geometry.coordinates,
          distance: route.distance
        };
      }
    } catch {
      // Si el servicio externo no responde, se usa una línea aproximada.
    }
  }

  return null;
}

function getDistanceMeters(lat1, lng1, lat2, lng2) {
  const radius = 6371000;
  const toRad = (value) => (value * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
  return radius * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function marker(point, index, color) {
  const positions = [
    [25, 28],
    [72, 22],
    [18, 75],
    [82, 66],
    [50, 16],
    [38, 80]
  ];
  const [left, top] = positions[index % positions.length];
  return `<button class="marker ${color}" style="left:${left}%;top:${top}%" data-detail="${point.id}" aria-label="${point.nombre}">${icon(point.tipo === "refugio" ? "home" : "food")}</button>`;
}

function placeCard(point) {
  const distance = Number.isFinite(point.distancia) ? ` · ${formatDistance(point.distancia)}` : "";
  return `
    <button class="place-card" data-detail="${point.id}">
      <span>
        <strong>${point.nombre}</strong>
        <span>${point.direccion}${distance} · ${point.horario}</span>
      </span>
      ${icon("right")}
    </button>
  `;
}

function formatDistance(meters) {
  if (meters < 1000) return `${Math.round(meters)} m`;
  return `${(meters / 1000).toFixed(1).replace(".", ",")} km`;
}

function renderDetail() {
  const point = state.selected;
  const config = typeConfig[point.tipo];
  const serviceText = serviceLabel(point);
  return `
    <section class="screen">
      ${topBar({
        ...config,
        customIcon: config.icon,
        subtitle: config.detailSubtitle,
        back: point.tipo === "refugio" ? "refugios" : "comida"
      })}
      <div class="detail detail-photo-bg">
        <div class="detail-bg ${point.imagen ? "has-image" : "has-illustration"}">${placeImage(point)}</div>
        <div class="detail-info-panel ${config.color}">
          <h2>${point.nombre.toUpperCase()}</h2>
          ${point.descripcion ? `<p class="detail-description">${point.descripcion}</p>` : ""}
          <div class="facts ${config.color}">
            <div class="fact">${icon("pin")}<span>${point.direccion}</span></div>
            <div class="fact">${icon("clock")}<span>${point.horario}</span></div>
            <div class="fact">${icon(point.tipo === "refugio" ? "bed" : "food")}<span>${serviceText}</span></div>
          </div>
        </div>
        <button class="route-button ${config.color}" data-start-route="${point.id}" data-route-target="route">${icon("send")} ${config.route}</button>
      </div>
    </section>
  `;
}

function serviceLabel(point) {
  if (point.id === "refugio-1") {
    return "Alojamiento, cena, duchas y áreas comunes como comedor y baños";
  }

  return point.servicios.join(", ");
}

function renderEmergency() {
  return `
    <section class="screen">
      ${topBar({ title: "AYUDA Y EMERGENCIA", subtitle: "Elegí una opción", color: "red", icon: "alert" })}
      <div class="emergency-body">
        <button class="help-button" data-go="emergencyWaiting" data-help-target="call-emergency">
          ${emergencyActionIcon("cross")}
          <span>LLAMAR A EMERGENCIAS</span>
        <button class="help-button" data-go="waiting" data-help-target="ask-help">
          ${emergencyActionIcon("people")}
          <span>PEDIR AYUDA</span>
      </div>
    </section>
  `;
}

function renderEmergencyWaiting() {
  return `
    <section class="screen">
      ${topBar({ title: "AYUDA Y EMERGENCIA", subtitle: "Volver atras", color: "red", icon: "alert", back: "emergencia" })}
      <div class="emergency-waiting">
        ${emergencySirenIcon()}
        <h2>ESPERE AQUÍ<br>EMERGENCIAS ESTÁ<br>EN CAMINO</h2>
      </div>
    </section>
  `;
}

function placeImage(point) {
  if (point.imagen) {
    const fallback = point.tipo === "refugio" ? "assets/refugio-ejemplo.svg" : "assets/comedor-ejemplo.svg";
    const fitClass = imageFitClass(point);
    const image = `<img class="${fitClass}" src="${point.imagen}" alt="${point.nombre}" loading="lazy" onerror="this.onerror=null; this.closest('.place-photo, .detail-bg').classList.add('has-illustration'); this.src='${fallback}';" />`;

    if (fitClass === "image-thumbnail") {
      return `
        <img class="image-thumbnail-bg" src="${point.imagen}" alt="" aria-hidden="true" loading="lazy" />
        ${image}
      `;
    }

    return image;
  }

  return fallbackIllustration(point.tipo);
}

function imageFitClass(point) {
  if (point.imagen.includes("encrypted-tbn")) {
    return "image-thumbnail";
  }

  if (["refugio-1", "refugio-2", "refugio-6"].includes(point.id)) {
    return "image-wide";
  }

  if (["refugio-4", "refugio-5"].includes(point.id)) {
    return "image-portrait";
  }

  return "image-balanced";
}

function fallbackIllustration(type) {
  return type === "refugio" ? refugeIllustration() : foodIllustration();
}

function renderWaiting() {
  return `
    <section class="screen">
      ${topBar({ title: "AYUDA Y EMERGENCIA", subtitle: "Volver atras", color: "red", icon: "alert", back: "emergencia" })}
      <div class="waiting">
        ${assistanceOnWayIcon()}
        <h2>AGUARDÁ<br>LA AYUDA ESTÁ<br>EN CAMINO</h2>
        <div class="spinner" aria-hidden="true"></div>
      </div>
    </section>
  `;
}

function renderAdmin() {
  const countRefugios = state.points.filter((point) => point.tipo === "refugio").length;
  const countComida = state.points.filter((point) => point.tipo === "comida").length;
  return `
    <section class="screen admin-screen">
      <header class="admin-header">
        <div>
          <h1>Administrar puntos</h1>
          <p>Refugios: ${countRefugios} · Comedores: ${countComida}</p>
        </div>
        <button class="admin-secondary" data-go="welcome">Ver tótem</button>
      </header>
      <form class="admin-form" data-admin-form>
        <label>Tipo
          <select name="tipo" required>
            <option value="refugio">Refugio</option>
            <option value="comida">Comedor</option>
          </select>
        </label>
        <label>Nombre
          <input name="nombre" required placeholder="Refugio San Martín" />
        </label>
        <div class="admin-grid">
          <label>Latitud
            <input name="lat" required inputmode="decimal" placeholder="-31.4167" />
          </label>
          <label>Longitud
            <input name="lng" required inputmode="decimal" placeholder="-64.1833" />
          </label>
        </div>
        <label>Dirección o referencia
          <input name="direccion" required placeholder="A 350 metros del tótem" />
        </label>
        <label>Horario
          <input name="horario" required placeholder="Abierto 24 horas" />
        </label>
        <label>Servicios
          <input name="servicios" placeholder="Alojamiento, Cena, Ducha" />
        </label>
        <button class="admin-submit" type="submit">Guardar punto</button>
        ${state.adminMessage ? `<p class="admin-message">${state.adminMessage}</p>` : ""}
      </form>
      <div class="admin-list">
        ${state.points.map((point) => adminPoint(point)).join("")}
      </div>
    </section>
  `;
}

function adminPoint(point) {
  const config = typeConfig[point.tipo];
  return `
    <article class="admin-point ${config.color}">
      <strong>${point.nombre}</strong>
      <span>${config.title} · ${point.horario}</span>
      <small>${point.lat}, ${point.lng}</small>
    </article>
  `;
}

function refugeIllustration() {
  return `
    <svg viewBox="0 0 280 160" width="100%" height="100%" aria-hidden="true">
      <rect x="80" y="72" width="120" height="70" fill="#f7f0dc"/>
      <path d="M62 82 140 25l78 57H62z" fill="#008a44"/>
      <rect x="124" y="100" width="32" height="42" fill="#60442c"/>
      <rect x="92" y="98" width="24" height="24" fill="#d9efff"/>
      <rect x="164" y="98" width="24" height="24" fill="#d9efff"/>
      <circle cx="48" cy="108" r="26" fill="#74a82d"/>
      <rect x="44" y="108" width="8" height="38" fill="#5b6e26"/>
      <circle cx="232" cy="108" r="26" fill="#74a82d"/>
      <rect x="228" y="108" width="8" height="38" fill="#5b6e26"/>
      <ellipse cx="70" cy="42" rx="34" ry="12" fill="#fff"/>
      <ellipse cx="215" cy="45" rx="35" ry="12" fill="#fff"/>
    </svg>
  `;
}

function foodIllustration() {
  return `
    <svg viewBox="0 0 280 160" width="100%" height="100%" aria-hidden="true">
      <rect x="70" y="70" width="140" height="72" fill="#fff7df"/>
      <rect x="62" y="58" width="156" height="18" fill="#c66a00"/>
      <path d="M68 76h28c0 15-28 15-28 0Zm28 0h28c0 15-28 15-28 0Zm28 0h28c0 15-28 15-28 0Zm28 0h28c0 15-28 15-28 0Zm28 0h28c0 15-28 15-28 0Z" fill="#ff9b1a"/>
      <rect x="95" y="96" width="34" height="38" fill="#d9efff"/>
      <rect x="150" y="96" width="34" height="38" fill="#d9efff"/>
      <circle cx="45" cy="112" r="24" fill="#79aa35"/>
      <rect x="41" y="112" width="8" height="34" fill="#5b6e26"/>
      <circle cx="235" cy="112" r="24" fill="#79aa35"/>
      <rect x="231" y="112" width="8" height="34" fill="#5b6e26"/>
      <ellipse cx="70" cy="42" rx="34" ry="12" fill="#fff"/>
      <ellipse cx="215" cy="45" rx="35" ry="12" fill="#fff"/>
    </svg>
  `;
}

function bindEvents() {
  app.querySelectorAll("[data-go]").forEach((button) => {
    button.addEventListener("click", () => {
      if (button.dataset.go === "detail" && state.selected) {
        go("detail", state.selected);
        return;
      }
      go(button.dataset.go);
    });
  });

  bindDetailEvents();

  app.querySelectorAll("[data-speak]").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      speakCue();
    });
    button.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      event.stopPropagation();
      speakCue();
    });
  });

  app.querySelectorAll("[data-speak-text]").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      speak(button.dataset.speakText);
    });
  });

  app.querySelectorAll("[data-start-route]").forEach((button) => {
    button.addEventListener("click", () => {
      const point = state.points.find((item) => item.id === button.dataset.startRoute);
      if (point) go("route", point);
    });
  });

  bindAdminEvents();
}

function bindAdminEvents() {
  const form = app.querySelector("[data-admin-form]");
  if (!form) return;
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const tipo = String(formData.get("tipo"));
    const nombre = String(formData.get("nombre")).trim();
    const point = {
      id: `${tipo}-${Date.now()}`,
      tipo,
      nombre,
      lat: Number(String(formData.get("lat")).replace(",", ".")),
      lng: Number(String(formData.get("lng")).replace(",", ".")),
      direccion: String(formData.get("direccion")).trim(),
      horario: String(formData.get("horario")).trim(),
      servicios: String(formData.get("servicios"))
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean)
    };

    try {
      await savePoint(point);
      await loadPoints();
      state.adminMessage = `${nombre} guardado correctamente.`;
      render();
    } catch (error) {
      state.adminMessage = error.message;
      render();
    }
  });
}

function bindDetailEvents() {
  app.querySelectorAll("[data-detail]").forEach((button) => {
    button.addEventListener("click", () => {
      const point = state.points.find((item) => item.id === button.dataset.detail);
      if (point) go("detail", point);
    });
  });
}

loadPoints().then(() => {
  render();
  if (state.screen !== "admin") speakWelcomeAutomatically();
});

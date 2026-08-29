import fs from "node:fs";
import path from "node:path";

const [htmlPath, outputDirectory = "."] = process.argv.slice(2);

if (!htmlPath) {
  console.error("Usage: node scripts/extract_catalog.mjs <share.html> [output-directory]");
  process.exit(1);
}

const html = fs.readFileSync(htmlPath, "utf8");
const marker = "window.__reactRouterContext.streamController.enqueue(";
const markerIndex = html.indexOf(marker);

if (markerIndex < 0) {
  throw new Error("The shared conversation payload was not found.");
}

const payloadStart = markerIndex + marker.length;
const payloadEnd = html.indexOf(");</script>", payloadStart);

if (payloadEnd < 0) {
  throw new Error("The shared conversation payload is incomplete.");
}

const flattened = JSON.parse(JSON.parse(html.slice(payloadStart, payloadEnd)));
const memo = new Map();

function decode(index) {
  if (typeof index !== "number") return index;
  if (index < 0) return undefined;
  if (memo.has(index)) return memo.get(index);

  const value = flattened[index];

  if (Array.isArray(value)) {
    const result = [];
    memo.set(index, result);
    for (const entry of value) result.push(decode(entry));
    return result;
  }

  if (value && typeof value === "object") {
    const result = {};
    memo.set(index, result);
    for (const [encodedKey, encodedValue] of Object.entries(value)) {
      const keyIndex = encodedKey.startsWith("_")
        ? Number(encodedKey.slice(1))
        : Number.NaN;
      const key = Number.isFinite(keyIndex) ? decode(keyIndex) : encodedKey;
      result[key] = decode(encodedValue);
    }
    return result;
  }

  memo.set(index, value);
  return value;
}

const root = decode(0);
const route = root.loaderData?.["routes/share.$shareId.($action)"];
const conversation = route?.serverResponse?.data;

if (!conversation?.linear_conversation) {
  throw new Error("The conversation could not be decoded.");
}

const shareId = route.sharedConversationId;
const visibleMessages = conversation.linear_conversation
  .map((node) => node?.message)
  .filter(
    (message) =>
      message && !message.metadata?.is_visually_hidden_from_conversation,
  );

const works = [];
let currentWork = null;

function textParts(message) {
  return (message.content?.parts ?? [])
    .filter((part) => typeof part === "string")
    .join("\n")
    .trim();
}

function cleanLine(value) {
  return value
    .replace(/[\*_`#]/g, "")
    .replace(/^[-–—\s]+|[-–—\s]+$/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function findField(text, labels) {
  const escaped = labels.map((label) => label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  const expression = new RegExp(`^(?:${escaped.join("|")})\\s*:\\s*(.+)$`, "im");
  const match = text.match(expression);
  return match ? cleanLine(match[1]) : "";
}

function firstCatalogNumber(text) {
  const matches = [...text.matchAll(/\bG\s*[-–]\s*(\d{1,3})\b/gi)];
  if (!matches.length) return "";
  return `G-${matches[0][1].padStart(3, "0")}`;
}

function deriveTitle(text, catalogNumber, index) {
  const field = findField(text, [
    "Arbeitstitel",
    "Arbeitstitel / Motiv",
    "Titel",
    "Titel / Motiv",
    "Motiv",
  ]);
  if (field) return field.replace(/^[„“\"]|[„“\"]$/g, "");

  const heading = text
    .split("\n")
    .map(cleanLine)
    .find((line) => /\bG\s*[-–]\s*\d{1,3}\b/.test(line) && line.length > 8);

  if (heading) {
    const remainder = heading
      .replace(/^(?:Katalogeintrag\s*)?/i, "")
      .replace(/\bG\s*[-–]\s*\d{1,3}\b\s*[:–—-]?\s*/i, "")
      .trim();
    if (remainder) return remainder.replace(/^[„“\"]|[„“\"]$/g, "");
  }

  return catalogNumber || `Werk ${String(index + 1).padStart(3, "0")}`;
}

function choosePrimaryText(entries) {
  if (!entries.length) return "";
  return [...entries].sort((a, b) => b.length - a.length)[0];
}

for (const message of visibleMessages) {
  const role = message.author?.role;
  const note = textParts(message);
  const attachments = Array.isArray(message.metadata?.attachments)
    ? message.metadata.attachments
    : [];

  if (role === "user" && attachments.length) {
    const priorWorkMatch = note.match(/für\s+gemälde\s+(?:nummer\s*)?(\d+)/i);

    if (priorWorkMatch && works[Number(priorWorkMatch[1]) - 1]) {
      currentWork = works[Number(priorWorkMatch[1]) - 1];
    } else {
      currentWork = {
        sourceMessageIds: [],
        notes: [],
        catalogEntries: [],
        images: [],
      };
      works.push(currentWork);
    }

    currentWork.sourceMessageIds.push(message.id);
    if (note) currentWork.notes.push(note);

    for (const attachment of attachments) {
      const imageNumber = currentWork.images.length + 1;
      const extension = path.extname(attachment.name || "") || ".jpeg";
      const workNumber = works.indexOf(currentWork) + 1;
      currentWork.images.push({
        fileId: attachment.id,
        originalName: attachment.name || attachment.id,
        mimeType: attachment.mime_type || "image/jpeg",
        width: attachment.width || null,
        height: attachment.height || null,
        size: attachment.size || null,
        src: `assets/artworks/work-${String(workNumber).padStart(3, "0")}-${String(imageNumber).padStart(2, "0")}${extension.toLowerCase()}`,
      });
    }
    continue;
  }

  if (!currentWork) continue;

  if (role === "user") {
    if (note) currentWork.notes.push(note);
    continue;
  }

  if (
    role === "assistant" &&
    message.content?.content_type === "text" &&
    message.metadata?.is_complete &&
    note &&
    !/^The output of this plugin was redacted\.?$/i.test(note)
  ) {
    currentWork.catalogEntries.push(note);
  }
}

const publicWorks = works.map((work, index) => {
  const primaryText = choosePrimaryText(work.catalogEntries);
  const combinedText = work.catalogEntries.join("\n\n---\n\n");
  const catalogNumber = firstCatalogNumber(combinedText);
  const artist = findField(primaryText, ["Künstler", "Künstlerin"]) || "Nicht identifiziert";
  const technique = findField(primaryText, ["Technik", "Material / Technik", "Material und Technik"]);
  const dating = findField(primaryText, ["Datierung", "Entstehungszeit", "Zeitstellung"]);
  const dimensions = findField(primaryText, ["Maße", "Maße ohne Rahmen", "Bildmaß"]);
  const framedDimensions = findField(primaryText, ["Maße mit Rahmen", "Rahmenmaß"]);
  const value = findField(primaryText, [
    "Vorläufiger Marktwert",
    "Realistischer privater Verkaufswert",
    "Privater Verkaufswert",
    "Marktwert",
    "Wert",
  ]);

  return {
    id: catalogNumber || `W-${String(index + 1).padStart(3, "0")}`,
    sequence: index + 1,
    title: deriveTitle(primaryText, catalogNumber, index),
    artist,
    technique,
    dating,
    dimensions,
    framedDimensions,
    value,
    userNotes: work.notes,
    catalogText: combinedText,
    status: work.catalogEntries.length ? "katalogisiert" : "ausstehend",
    images: work.images,
    sourceMessageIds: work.sourceMessageIds,
  };
});

const output = {
  title: conversation.title || "Kunstsammlung",
  source: `https://chatgpt.com/share/${shareId}`,
  importedAt: new Date().toISOString(),
  stats: {
    works: publicWorks.length,
    photos: publicWorks.reduce((sum, work) => sum + work.images.length, 0),
    catalogued: publicWorks.filter((work) => work.status === "katalogisiert").length,
  },
  works: publicWorks,
};

const manifest = publicWorks.flatMap((work) =>
  work.images.map((image) => ({
    fileId: image.fileId,
    targetPath: image.src,
    originalName: image.originalName,
  })),
);

fs.mkdirSync(outputDirectory, { recursive: true });
fs.writeFileSync(
  path.join(outputDirectory, "catalog-source.json"),
  `${JSON.stringify(output, null, 2)}\n`,
);
fs.writeFileSync(
  path.join(outputDirectory, "catalog.js"),
  `window.CATALOG_DATA = ${JSON.stringify(output)};\n`,
);
fs.writeFileSync(
  path.join(outputDirectory, "download-manifest.json"),
  `${JSON.stringify({ shareId, files: manifest }, null, 2)}\n`,
);

console.log(JSON.stringify(output.stats));

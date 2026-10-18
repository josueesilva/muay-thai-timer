import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import PDFDocument from 'pdfkit';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const mdPath = path.join(root, 'PRIVACY_POLICY.md');
const pdfPath = path.join(root, 'PRIVACY_POLICY.pdf');

const PAGE = { left: 54, right: 54, top: 54, bottom: 54 };
const CONTENT_WIDTH = 612 - PAGE.left - PAGE.right;

function stripMarkdown(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
}

function ensureSpace(doc, height = 24) {
  if (doc.y + height > doc.page.height - PAGE.bottom) {
    doc.addPage();
  }
}

function writeHeading(doc, text, level) {
  ensureSpace(doc, level === 1 ? 40 : 28);
  const size = level === 1 ? 20 : 14;
  doc.moveDown(level === 1 ? 0.6 : 0.4);
  doc.font('Helvetica-Bold').fontSize(size).fillColor('#111111').text(stripMarkdown(text), {
    width: CONTENT_WIDTH,
    align: 'left',
  });
  doc.moveDown(0.3);
}

function writeParagraph(doc, text) {
  ensureSpace(doc, 20);
  doc.font('Helvetica').fontSize(11).fillColor('#222222').text(stripMarkdown(text), {
    width: CONTENT_WIDTH,
    align: 'justify',
    lineGap: 3,
  });
  doc.moveDown(0.35);
}

function writeBullet(doc, text) {
  ensureSpace(doc, 18);
  doc.font('Helvetica').fontSize(11).fillColor('#222222').text(`• ${stripMarkdown(text)}`, {
    width: CONTENT_WIDTH - 12,
    indent: 12,
    lineGap: 2,
  });
}

function writeTable(doc, rows) {
  const colWidths = [CONTENT_WIDTH * 0.28, CONTENT_WIDTH * 0.32, 0.14 * CONTENT_WIDTH, 0.18 * CONTENT_WIDTH];
  const startX = PAGE.left;
  let y = doc.y + 4;

  const drawRow = (cells, bold = false) => {
    const font = bold ? 'Helvetica-Bold' : 'Helvetica';
    doc.font(font).fontSize(9);
    const heights = cells.map((cell, i) =>
      doc.heightOfString(stripMarkdown(cell), { width: colWidths[i] - 8 })
    );
    const rowHeight = Math.max(...heights) + 10;

    if (y + rowHeight > doc.page.height - PAGE.bottom) {
      doc.addPage();
      y = PAGE.top;
    }

    let x = startX;
    cells.forEach((cell, i) => {
      doc.rect(x, y, colWidths[i], rowHeight).stroke('#cccccc');
      doc.text(stripMarkdown(cell), x + 4, y + 5, { width: colWidths[i] - 8 });
      x += colWidths[i];
    });

    y += rowHeight;
  };

  rows.forEach((row, index) => drawRow(row, index === 0));
  doc.y = y + 8;
}

function parseAndRender(doc, markdown) {
  const lines = markdown.split('\n');
  let i = 0;
  let paragraph = [];
  let tableRows = [];
  let inTable = false;

  const flushParagraph = () => {
    const text = paragraph.join(' ').trim();
    if (text) writeParagraph(doc, text);
    paragraph = [];
  };

  const flushTable = () => {
    if (tableRows.length) writeTable(doc, tableRows);
    tableRows = [];
    inTable = false;
  };

  while (i < lines.length) {
    const line = lines[i];

    if (line.startsWith('|')) {
      flushParagraph();
      inTable = true;
      const cells = line
        .split('|')
        .slice(1, -1)
        .map((c) => c.trim());
      if (!/^[-:\s|]+$/.test(line)) tableRows.push(cells);
      i += 1;
      continue;
    }

    if (inTable) flushTable();

    if (line.startsWith('# ')) {
      flushParagraph();
      writeHeading(doc, line.slice(2), 1);
    } else if (line.startsWith('## ')) {
      flushParagraph();
      writeHeading(doc, line.slice(3), 2);
    } else if (line.trim() === '---') {
      flushParagraph();
      ensureSpace(doc, 12);
      doc.moveDown(0.2);
    } else if (line.startsWith('- ')) {
      flushParagraph();
      writeBullet(doc, line.slice(2));
    } else if (line.trim() === '') {
      flushParagraph();
    } else {
      paragraph.push(line.trim());
    }

    i += 1;
  }

  flushParagraph();
  flushTable();
}

const markdown = fs.readFileSync(mdPath, 'utf8');
const doc = new PDFDocument({ size: 'LETTER', margin: PAGE.top, bufferPages: true });
const stream = fs.createWriteStream(pdfPath);
doc.pipe(stream);

doc.font('Helvetica-Bold').fontSize(24).fillColor('#111111').text('Privacy Policy', {
  width: CONTENT_WIDTH,
});
doc.moveDown(0.2);

parseAndRender(doc, markdown.replace(/^# Privacy Policy\s*/m, ''));

doc.end();

stream.on('finish', () => {
  console.log(`PDF created: ${pdfPath}`);
});

stream.on('error', (err) => {
  console.error(err);
  process.exit(1);
});

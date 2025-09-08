// src/routes/statsExport.js
const express = require("express");
const { PrismaClient } = require("@prisma/client");
const { Parser: Json2csvParser } = require("json2csv");
const PDFDocument = require("pdfkit");
const SVGtoPDF = require("svg-to-pdfkit"); // instalar con: npm install svg-to-pdfkit

const router = express.Router();
const prisma = new PrismaClient();

// GET /stats/export?format=csv|pdf
router.get("/", async (req, res) => {
  try {
    const userId = req.user.id; // usuario autenticado
    const format = req.query.format || "csv"; // default CSV

    // Obtenemos todas las tareas del usuario
    const tasks = await prisma.task.findMany({
      where: { userId },
      include: {
        user: {
          select: { name: true, email: true },
        },
      },
    });

    // Datos para el conteo (para el gráfico)
    const grouped = tasks.reduce((acc, t) => {
      acc[t.status] = (acc[t.status] || 0) + 1;
      return acc;
    }, {});

    const chartData = Object.entries(grouped).map(([status, count]) => ({
      status,
      count,
    }));

    if (format === "csv") {
      // --- Exportar a CSV con más columnas ---
      const fields = ["id", "title", "status", "priority", "user.name", "startDate", "dueDate"];
      const parser = new Json2csvParser({ fields });
      const csv = parser.parse(tasks);

      res.header("Content-Type", "text/csv");
      res.attachment("tasks.csv");
      return res.send(csv);
    } else if (format === "pdf") {
      // --- Exportar a PDF con gráfico ---
      const doc = new PDFDocument({ margin: 40 });
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", "attachment; filename=stats.pdf");
      doc.pipe(res);

      doc.fontSize(18).text("Reporte de Tareas", { align: "center" });
      doc.moveDown();

      // Listado de estadísticas
      chartData.forEach((s) => {
        doc.fontSize(14).text(`${s.status}: ${s.count} tareas`);
      });

      doc.moveDown();

      // Crear gráfico de barras en SVG
      const barWidth = 50;
      const barSpacing = 20;
      const maxHeight = 200;
      const maxCount = Math.max(...chartData.map((d) => d.count), 1);

      let svg = `<svg width="${chartData.length * (barWidth + barSpacing)}" height="${maxHeight + 40}" xmlns="http://www.w3.org/2000/svg">`;

      chartData.forEach((d, i) => {
        const height = (d.count / maxCount) * maxHeight;
        const x = i * (barWidth + barSpacing);
        const y = maxHeight - height;
        svg += `
          <rect x="${x}" y="${y}" width="${barWidth}" height="${height}" fill="steelblue"/>
          <text x="${x + barWidth / 2}" y="${maxHeight + 15}" text-anchor="middle" font-size="12">${d.status}</text>
          <text x="${x + barWidth / 2}" y="${y - 5}" text-anchor="middle" font-size="12">${d.count}</text>
        `;
      });

      svg += "</svg>";

      SVGtoPDF(doc, svg, 50, doc.y + 20, { assumePt: true });

      doc.end();
    } else {
      return res.status(400).json({ error: "Formato no soportado" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error generando exportación" });
  }
});

module.exports = router;
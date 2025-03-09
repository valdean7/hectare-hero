import jsPDF from 'jspdf';
import { HectarePricing } from '../types/hectare';

export const generatePricingPDF = (pricingList: HectarePricing[]): void => {
  if (pricingList.length === 0) return;

  const doc = new jsPDF();

  // Add title
  doc.setFontSize(22);
  doc.setTextColor(18, 25, 38);
  doc.text('Relatório de Precificação de Hectares', 20, 20);

  // Add subtitle and date
  doc.setFontSize(12);
  doc.setTextColor(100, 100, 100);
  const today = new Date().toLocaleDateString('pt-BR');
  doc.text(`Gerado em: ${today}`, 20, 30);

  // Add table header
  doc.setFontSize(12);
  doc.setTextColor(18, 25, 38);
  doc.setFont('helvetica', 'bold');
  doc.text('Nome', 20, 45);
  doc.text('Dimensões (m)', 80, 45);
  doc.text('Área (ha)', 130, 45);
  doc.text('Valor Total (R$)', 170, 45);

  // Add line
  doc.setDrawColor(230, 230, 230);
  doc.line(20, 48, 190, 48);

  // Add data
  doc.setFont('helvetica', 'normal');
  let y = 55;

  pricingList.forEach((item, index) => {
    // Check if we need a new page
    if (y > 270) {
      doc.addPage();
      y = 20;
    }

    doc.setTextColor(33, 33, 33);
    doc.text(item.name, 20, y);
    doc.text(`${item.width}m × ${item.length}m`, 80, y);
    doc.text(item.hectares.toFixed(4), 130, y);
    doc.text(`R$ ${item.totalPrice.toFixed(2)}`, 170, y);

    y += 10;

    // Add light divider except for the last item
    if (index < pricingList.length - 1) {
      doc.setDrawColor(240, 240, 240);
      doc.line(20, y - 5, 190, y - 5);
    }
  });

  // Add footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150);
    doc.text(`Página ${i} de ${pageCount}`, 20, 290);
    doc.text('Hectare Hero Pricer', 170, 290);
  }

  // Save the PDF
  doc.save('tabela-de-precos.pdf');
};

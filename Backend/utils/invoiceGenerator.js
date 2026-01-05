import PDFDocument from "pdfkit";

export const generateInvoicePDF = (order) => {
  const doc = new PDFDocument();
  doc.fontSize(20).text("Tekisky Mart Invoice", { align: "center" });
  doc.moveDown();

  doc.fontSize(12).text(`Order ID: ${order._id}`);
  doc.text(`Status: ${order.orderStatus}`);
  doc.moveDown();

  order.orderItems.forEach((i) => {
    doc.text(`${i.name} x ${i.quantity} = ₹${i.price * i.quantity}`);
  });

  doc.moveDown();
  doc.text(`Total: ₹${order.totalPrice}`, { bold: true });

  return doc;
};

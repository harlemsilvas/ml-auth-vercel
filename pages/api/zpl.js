// pages/api/zpl.js
import { downloadZPL } from "@/services/shipping";

export default async function handler(req, res) {
  const { shipment_id } = req.query;

  if (!shipment_id) {
    return res.status(400).json({ error: "Parâmetro shipment_id obrigatório" });
  }

  try {
    const zpl = await downloadZPL(shipment_id);
    res.status(200).json({ zpl, filename: `etiqueta_${shipment_id}.zpl` });
  } catch (error) {
    console.error("[Erro ao baixar ZPL]", error.message);
    res.status(500).json({ error: error.message });
  }
}

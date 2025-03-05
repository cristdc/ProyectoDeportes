import fs from "fs";
import xml2js from "xml2js";
import { analyzeGPXFile, validateGPXFile } from "../utils/gpxUtils.js";
/**
 * Calcula la distancia entre dos puntos usando la fórmula de Haversine
 * @param {number} lat1 - Latitud del punto 1 en grados
 * @param {number} lon1 - Longitud del punto 1 en grados
 * @param {number} lat2 - Latitud del punto 2 en grados
 * @param {number} lon2 - Longitud del punto 2 en grados
 * @returns {number} - Distancia en kilómetros
 */
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radio de la Tierra en kilómetros
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

/**
 * Analiza un archivo GPX y extrae información relevante
 * @param {string} filePath - Ruta al archivo GPX
 * @returns {Promise<Object>} - Información extraída del GPX
 */
export const analyzeGPXFile = async (filePath) => {
  try {
    // Verificar que el archivo existe
    if (!fs.existsSync(filePath)) {
      throw new Error("El archivo GPX no existe");
    }

    // Leer el contenido del archivo
    const fileContent = fs.readFileSync(filePath, "utf-8");

    // Parsear el XML
    const parser = new xml2js.Parser();
    const result = await parser.parseStringPromise(fileContent);

    // Verificar estructura válida de GPX
    if (!result.gpx || !result.gpx.trk || !result.gpx.trk.length) {
      throw new Error("Formato GPX inválido: no se encontró el elemento <trk>");
    }

    const track = result.gpx.trk[0];

    // Obtener nombre y descripción de la ruta
    const name = track.name ? track.name[0] : "Sin nombre";
    const description = track.desc ? track.desc[0] : "";

    // Verificar que hay segmentos
    if (
      !track.trkseg ||
      !track.trkseg.length ||
      !track.trkseg[0].trkpt ||
      !track.trkseg[0].trkpt.length
    ) {
      throw new Error(
        "Formato GPX inválido: no se encontraron puntos en la ruta"
      );
    }

    const points = track.trkseg[0].trkpt;

    // Extraer información
    let totalDistance = 0;
    let elevationGain = 0;
    let elevationLoss = 0;
    let maxElevation = -Infinity;
    let minElevation = Infinity;

    // Coordenadas del primer y último punto para determinar si es circular
    const firstPoint = points[0];
    const lastPoint = points[points.length - 1];

    // Calcular distancia total y desnivel
    for (let i = 1; i < points.length; i++) {
      const prevPoint = points[i - 1];
      const currentPoint = points[i];

      // Obtener coordenadas
      const lat1 = parseFloat(prevPoint.$.lat);
      const lon1 = parseFloat(prevPoint.$.lon);
      const lat2 = parseFloat(currentPoint.$.lat);
      const lon2 = parseFloat(currentPoint.$.lon);

      // Calcular distancia entre puntos
      const segmentDistance = calculateDistance(lat1, lon1, lat2, lon2);
      totalDistance += segmentDistance;

      // Calcular desnivel si hay información de elevación
      if (
        prevPoint.ele &&
        prevPoint.ele.length &&
        currentPoint.ele &&
        currentPoint.ele.length
      ) {
        const ele1 = parseFloat(prevPoint.ele[0]);
        const ele2 = parseFloat(currentPoint.ele[0]);

        // Actualizar elevación máxima y mínima
        maxElevation = Math.max(maxElevation, ele2);
        minElevation = Math.min(minElevation, ele2);

        // Calcular ganancia y pérdida de elevación
        const elevationDiff = ele2 - ele1;
        if (elevationDiff > 0) {
          elevationGain += elevationDiff;
        } else if (elevationDiff < 0) {
          elevationLoss += Math.abs(elevationDiff);
        }
      }
    }

    // Verificar si la ruta es circular (primer y último punto son cercanos)
    const firstLat = parseFloat(firstPoint.$.lat);
    const firstLon = parseFloat(firstPoint.$.lon);
    const lastLat = parseFloat(lastPoint.$.lat);
    const lastLon = parseFloat(lastPoint.$.lon);

    const distanceStartEnd = calculateDistance(
      firstLat,
      firstLon,
      lastLat,
      lastLon
    );
    const isCircular = distanceStartEnd < 0.1; // Si la distancia es menor a 100 metros

    // Calcular duración estimada (aproximada basada en distancia y desnivel)
    // Factores aproximados: 1 km plano = 10-12 min, cada 100m de desnivel positivo = 10 min adicionales
    const baseDuration = totalDistance * 12; // Minutos para terreno plano
    const ascentDuration = (elevationGain / 100) * 10; // Minutos adicionales por ascenso
    const estimatedDuration = baseDuration + ascentDuration;

    const hours = Math.floor(estimatedDuration / 60);
    const minutes = Math.round(estimatedDuration % 60);

    return {
      name,
      description,
      totalDistance: parseFloat(totalDistance.toFixed(2)), // En kilómetros
      elevationGain: Math.round(elevationGain), // En metros
      elevationLoss: Math.round(elevationLoss), // En metros
      maxElevation:
        maxElevation !== -Infinity ? Math.round(maxElevation) : null,
      minElevation: minElevation !== Infinity ? Math.round(minElevation) : null,
      totalElevation: Math.round(elevationGain + elevationLoss),
      isCircular,
      numPoints: points.length,
      estimatedDuration: `${hours}h ${minutes}m`, // Formato horas:minutos
      startLocation: {
        lat: parseFloat(firstPoint.$.lat),
        lon: parseFloat(firstPoint.$.lon),
      },
      endLocation: {
        lat: parseFloat(lastPoint.$.lat),
        lon: parseFloat(lastPoint.$.lon),
      },
    };
  } catch (error) {
    console.error("Error al analizar archivo GPX:", error);
    throw error;
  }
};

/**
 * Valida un archivo GPX para asegurarse de que cumple con la estructura esperada
 * @param {string} filePath - Ruta al archivo GPX
 * @returns {Promise<boolean>} - true si el archivo es válido
 */
export const validateGPXFile = async (filePath) => {
  try {
    await analyzeGPXFile(filePath);
    return true;
  } catch (error) {
    console.error("Error al validar archivo GPX:", error);
    return false;
  }
};

export default {
  analyzeGPXFile,
  validateGPXFile,
};

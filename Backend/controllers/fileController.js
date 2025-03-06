import fs from "fs";
import path from "path";

/**
 * Descarga un archivo de la carpeta de descargas
 * @param {Object} req - Objeto de solicitud
 * @param {Object} res - Objeto de respuesta
 */
export const downloadFile = async (req, res) => {
  try {
    const { type, filename } = req.params;

    // Validar tipo de archivo
    if (type !== "exe" && type !== "apk") {
      return res
        .status(400)
        .json({
          message: "Tipo de archivo no válido. Tipos permitidos: exe, apk",
        });
    }

    // Validar nombre de archivo
    if (!filename) {
      return res.status(400).json({ message: "Nombre de archivo requerido" });
    }

    // Prevenir path traversal
    if (
      filename.includes("..") ||
      filename.includes("/") ||
      filename.includes("\\")
    ) {
      return res.status(400).json({ message: "Nombre de archivo no válido" });
    }

    // Construir ruta al archivo
    const downloadsDir = path.join(process.cwd(), "uploads", "Downloads");
    const filePath = path.join(downloadsDir, `${filename}.${type}`);

    // Verificar que el directorio existe
    if (!fs.existsSync(downloadsDir)) {
      fs.mkdirSync(downloadsDir, { recursive: true });
    }

    // Verificar que el archivo existe
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "Archivo no encontrado" });
    }

    // Configurar encabezados MIME adecuados según el tipo
    let mimeType;
    if (type === "exe") {
      mimeType = "application/vnd.microsoft.portable-executable";
    } else if (type === "apk") {
      mimeType = "application/vnd.android.package-archive";
    }

    // Configurar encabezados para la descarga
    res.setHeader("Content-Type", mimeType);
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${filename}.${type}"`
    );

    // Enviar el archivo como flujo
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);

    // Manejar errores del flujo
    fileStream.on("error", (error) => {
      console.error(`Error al leer el archivo ${filePath}:`, error);
      if (!res.headersSent) {
        res
          .status(500)
          .json({ message: "Error al leer el archivo", error: error.message });
      }
    });
  } catch (error) {
    console.error("Error en downloadFile:", error);
    res
      .status(500)
      .json({ message: "Error al descargar el archivo", error: error.message });
  }
};

/**
 * Obtiene una lista de los archivos disponibles para descargar
 * @param {Object} req - Objeto de solicitud
 * @param {Object} res - Objeto de respuesta
 */
export const getAvailableFiles = async (req, res) => {
  try {
    const { type } = req.params;

    // Validar tipo de archivo
    if (type && type !== "exe" && type !== "apk") {
      return res
        .status(400)
        .json({
          message: "Tipo de archivo no válido. Tipos permitidos: exe, apk",
        });
    }

    // Construir ruta al directorio
    const downloadsDir = path.join(process.cwd(), "uploads", "Downloads");

    // Verificar que el directorio existe
    if (!fs.existsSync(downloadsDir)) {
      fs.mkdirSync(downloadsDir, { recursive: true });
      return res.status(200).json({ files: [] });
    }

    // Leer archivos en el directorio
    const allFiles = fs.readdirSync(downloadsDir);

    // Filtrar por tipo si se especifica
    let files;
    if (type) {
      const extension = `.${type}`;
      files = allFiles
        .filter((file) => file.endsWith(extension))
        .map((file) => ({
          filename: file.slice(0, -extension.length),
          type,
          fullname: file,
          size: fs.statSync(path.join(downloadsDir, file)).size,
        }));
    } else {
      // Devolver todos los archivos APK y EXE
      files = allFiles
        .filter((file) => file.endsWith(".exe") || file.endsWith(".apk"))
        .map((file) => {
          const extension = path.extname(file).slice(1);
          return {
            filename: file.slice(0, -(extension.length + 1)),
            type: extension,
            fullname: file,
            size: fs.statSync(path.join(downloadsDir, file)).size,
          };
        });
    }

    return res.status(200).json({ files });
  } catch (error) {
    console.error("Error en getAvailableFiles:", error);
    res
      .status(500)
      .json({
        message: "Error al obtener la lista de archivos",
        error: error.message,
      });
  }
};

/**
 * Sube un nuevo archivo al sistema (solo admin)
 * @param {Object} req - Objeto de solicitud con el archivo
 * @param {Object} res - Objeto de respuesta
 */
export const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ message: "No se ha subido ningún archivo" });
    }

    // La validación del tipo de archivo ya la hace multer
    const originalName = req.file.originalname;
    const destinationPath = req.file.path;

    return res.status(201).json({
      message: "Archivo subido correctamente",
      file: {
        originalName,
        path: destinationPath,
        size: req.file.size,
      },
    });
  } catch (error) {
    console.error("Error en uploadFile:", error);

    // Limpiar archivo si hay error
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res
      .status(500)
      .json({ message: "Error al subir el archivo", error: error.message });
  }
};

/**
 * Elimina un archivo (solo admin)
 * @param {Object} req - Objeto de solicitud
 * @param {Object} res - Objeto de respuesta
 */
export const deleteFile = async (req, res) => {
  try {
    const { type, filename } = req.params;

    // Validar tipo de archivo
    if (type !== "exe" && type !== "apk") {
      return res
        .status(400)
        .json({
          message: "Tipo de archivo no válido. Tipos permitidos: exe, apk",
        });
    }

    // Validar nombre de archivo
    if (!filename) {
      return res.status(400).json({ message: "Nombre de archivo requerido" });
    }

    // Prevenir path traversal
    if (
      filename.includes("..") ||
      filename.includes("/") ||
      filename.includes("\\")
    ) {
      return res.status(400).json({ message: "Nombre de archivo no válido" });
    }

    // Construir ruta al archivo
    const downloadsDir = path.join(process.cwd(), "uploads", "Downloads");
    const filePath = path.join(downloadsDir, `${filename}.${type}`);

    // Verificar que el archivo existe
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "Archivo no encontrado" });
    }

    // Eliminar el archivo
    fs.unlinkSync(filePath);

    return res.status(200).json({ message: "Archivo eliminado correctamente" });
  } catch (error) {
    console.error("Error en deleteFile:", error);
    res
      .status(500)
      .json({ message: "Error al eliminar el archivo", error: error.message });
  }
};

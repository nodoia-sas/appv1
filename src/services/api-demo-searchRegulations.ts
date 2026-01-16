/**
 * Demo: Cómo usar la función searchRegulations
 *
 * Este archivo muestra ejemplos de uso de la función searchRegulations
 */

import { searchRegulations } from "./api";

/**
 * Ejemplo 1: Búsqueda simple con página por defecto (0)
 */
async function ejemploBusquedaSimple() {
  try {
    const resultados = await searchRegulations("velocidad");

    console.log(`Total de resultados: ${resultados.totalElements}`);
    console.log(
      `Página actual: ${resultados.number + 1} de ${resultados.totalPages}`
    );
    console.log(`Regulaciones encontradas: ${resultados.content.length}`);

    resultados.content.forEach((regulacion) => {
      console.log(`- ${regulacion.articleNumber}: ${regulacion.title}`);
    });
  } catch (error) {
    console.error("Error en la búsqueda:", error);
  }
}

/**
 * Ejemplo 2: Búsqueda con paginación
 */
async function ejemploBusquedaConPaginacion() {
  try {
    const pagina = 2; // Tercera página (0-indexed)
    const resultados = await searchRegulations("multa", pagina);

    console.log(
      `Mostrando página ${resultados.number + 1} de ${resultados.totalPages}`
    );
    console.log(`Es la primera página: ${resultados.first}`);
    console.log(`Es la última página: ${resultados.last}`);

    return resultados;
  } catch (error) {
    console.error("Error en la búsqueda paginada:", error);
    throw error;
  }
}

/**
 * Ejemplo 3: Búsqueda con manejo de errores específicos
 */
async function ejemploManejoErrores() {
  try {
    const resultados = await searchRegulations("estacionamiento");
    return resultados;
  } catch (error: any) {
    if (error.statusCode === 404) {
      console.log("No se encontraron resultados");
    } else if (error.statusCode === 0) {
      console.log("Error de red - verifica tu conexión");
    } else if (error.statusCode >= 500) {
      console.log("Error del servidor - intenta más tarde");
    } else {
      console.log("Error desconocido:", error.message);
    }
  }
}

/**
 * Ejemplo 4: Búsqueda con caracteres especiales
 */
async function ejemploCaracteresEspeciales() {
  try {
    // Axios automáticamente codifica los parámetros de URL
    const resultados = await searchRegulations("señales & marcas viales");
    console.log(
      `Búsqueda con caracteres especiales: ${resultados.totalElements} resultados`
    );
    return resultados;
  } catch (error) {
    console.error("Error:", error);
  }
}

// Exportar ejemplos para uso en otros archivos
export {
  ejemploBusquedaSimple,
  ejemploBusquedaConPaginacion,
  ejemploManejoErrores,
  ejemploCaracteresEspeciales,
};

// Error con código HTTP: los services lo lanzan y los controllers lo traducen a la respuesta.
export class HttpError extends Error {
    constructor(status, message) {
        super(message)
        this.status = status
    }
}

export const noEncontrado = (recurso) => new HttpError(404, `${recurso} no encontrado`)

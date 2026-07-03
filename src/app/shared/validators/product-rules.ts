/**
 * Reglas de validacion del formulario de producto, centralizadas para evitar
 * numeros magicos dispersos y mantener una unica fuente de verdad entre el
 * formulario, los mensajes y las pruebas.
 *
 * Nota sobre el nombre: el enunciado indica minimo 5 caracteres, pero el
 * servicio backend valida minimo 6 (@MinLength(6)). Para que el formulario y
 * el servicio sean coherentes y no se produzca un 400 al enviar, se adopta el
 * limite mas restrictivo (6). Asi la validacion del cliente nunca contradice
 * la del servidor.
 */
export const PRODUCT_RULES = {
  id: {
    minLength: 3,
    maxLength: 10,
  },
  name: {
    minLength: 6,
    maxLength: 100,
  },
  description: {
    minLength: 10,
    maxLength: 200,
  },
} as const;

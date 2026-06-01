# Exercise 4: AI-Assisted Code Refactoring

## Código original

```javascript
function getUser(d){ return
fetch("https://jsonplaceholder.typicode.com/users/"+d).then(x=>x.json()).then(j=>console.log(j)) }
```

### Problemas detectados

- **Side effect interno**: hace `console.log` dentro de la función, por lo que el dato no se puede reutilizar.
- **Sin manejo de errores HTTP**: `fetch` no lanza error en respuestas 4xx/5xx, así que un 404 entra igual al parseo.
- **Sin tipado**: no hay garantías sobre la forma del dato ni sobre el tipo del parámetro.
- **Nombres sin significado**: `d`, `x`, `j` dificultan la lectura.
- **Concatenación de strings** en lugar de template literals.

---

## Narrativa de prompts (proceso de refinamiento)

El refactor no salió de un solo prompt. Cada iteración partió de revisar críticamente la salida de la IA y detectar qué faltaba para considerarlo *production-ready*.

### Prompt 1 — Refactor inicial

> *"Refactoriza esta función JavaScript a una versión moderna y legible. Usa async/await en lugar de cadenas de .then() y nombres de variables descriptivos."*

**Resultado:** convirtió la cadena de promesas a `async/await` y renombró `d`, `x`, `j`.
**Problema detectado:** mantuvo el `console.log` dentro de la función, lo que la hacía imposible de reutilizar.

### Prompt 2 — Separación de responsabilidades

> *"La función no debería imprimir nada. Quiero que retorne los datos para poder reutilizarla. Aplica separación de responsabilidades."*

**Resultado:** cambió el `console.log(j)` por un `return`. Ahora la función solo obtiene datos; quien la llama decide qué hacer con ellos.
**Problema detectado:** seguía sin manejar el caso de un error HTTP.

### Prompt 3 — Manejo de errores HTTP

> *"`fetch` no lanza error en respuestas 4xx/5xx. Agrega verificación de `response.ok` y lanza un error descriptivo que incluya el status code."*

**Resultado:** añadió el chequeo de `response.ok` y una clase `UserFetchError` con el `statusCode`.
**Problema detectado:** faltaba tipado y validación del input.

### Prompt 4 — Tipado y validación

> *"Migra todo a TypeScript. Define una interface `User`, tipa el retorno como `Promise<User>` y valida que el `userId` sea un entero positivo antes de hacer la petición."*

**Resultado:** versión final con `interface User`, tipos en firma y retorno, y validación de entrada.

### Prompt 5 — Ejemplo de consumo

> *"Muéstrame cómo consumir esta función con manejo de errores tipado usando `instanceof`."*

**Resultado:** el bloque `try/catch` que distingue `UserFetchError` de errores inesperados.

---

## Versión final del código

```typescript
interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string;
  website: string;
}

class UserFetchError extends Error {
  constructor(message: string, public readonly statusCode?: number) {
    super(message);
    this.name = "UserFetchError";
  }
}

const API_BASE_URL = "https://jsonplaceholder.typicode.com";

async function getUser(userId: number): Promise<User> {
  if (!Number.isInteger(userId) || userId <= 0) {
    throw new UserFetchError(`Invalid user ID: ${userId}`);
  }

  const response = await fetch(`${API_BASE_URL}/users/${userId}`);

  if (!response.ok) {
    throw new UserFetchError(
      `Failed to fetch user ${userId}`,
      response.status
    );
  }

  return response.json() as Promise<User>;
}
```

### Ejemplo de uso

```typescript
try {
  const user = await getUser(1);
  console.log(user);
} catch (error) {
  if (error instanceof UserFetchError) {
    console.error(`${error.message} (status: ${error.statusCode ?? "N/A"})`);
  } else {
    console.error("Unexpected error:", error);
  }
}
```

---

## Resumen de mejoras

| Aspecto | Antes | Después |
|---|---|---|
| Side effects | `console.log` interno | Retorna los datos |
| Errores HTTP | No se manejaban | Verifica `response.ok` |
| Tipado | Ninguno | `interface User`, `Promise<User>` |
| Validación de input | Ninguna | Entero positivo |
| Errores personalizados | No | Clase `UserFetchError` |
| Legibilidad | `d`, `x`, `j` | Nombres descriptivos + template literals |

## Reflexión

La IA aceleró cada paso del refactor, pero las decisiones de arquitectura —no imprimir dentro de la función, separar el error en su propia clase, validar la entrada— vinieron del criterio del desarrollador. El valor del flujo asistido por IA está en iterar rápido sobre las salidas y aplicar juicio técnico para llevarlas a calidad de producción.

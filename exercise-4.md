# Exercise 4: AI-Assisted Code Refactoring

## Original code

```javascript
function getUser(d){ return
fetch("https://jsonplaceholder.typicode.com/users/"+d).then(x=>x.json()).then(j=>console.log(j)) }
```

### Issues identified

- **Internal side effect**: it does a `console.log` inside the function, so the data can't be reused.
- **No HTTP error handling**: `fetch` does not throw on 4xx/5xx responses, so a 404 still flows into the parsing step.
- **No typing**: there are no guarantees about the shape of the data or the type of the parameter.
- **Meaningless names**: `d`, `x`, `j` hurt readability.
- **String concatenation** instead of template literals.

---

## Prompt narrative (refinement process)

The refactor didn't come out of a single prompt. Each iteration started by critically reviewing the AI's output and spotting what was still missing to consider it *production-ready*.

### Prompt 1 — Initial refactor

> *"Refactor this JavaScript function into a modern, readable version. Use async/await instead of .then() chains and descriptive variable names."*

**Result:** converted the promise chain to `async/await` and renamed `d`, `x`, `j`.
**Issue identified:** it kept the `console.log` inside the function, which made it impossible to reuse.

### Prompt 2 — Separation of concerns

> *"The function shouldn't print anything. I want it to return the data so I can reuse it. Apply separation of concerns."*

**Result:** replaced `console.log(j)` with a `return`. The function now only fetches data; the caller decides what to do with it.
**Issue identified:** it still didn't handle the HTTP error case.

### Prompt 3 — HTTP error handling

> *"`fetch` doesn't throw on 4xx/5xx responses. Add a `response.ok` check and throw a descriptive error that includes the status code."*

**Result:** added the `response.ok` check and a `UserFetchError` class carrying the `statusCode`.
**Issue identified:** typing and input validation were still missing.

### Prompt 4 — Typing and validation

> *"Migrate everything to TypeScript. Define a `User` interface, type the return as `Promise<User>`, and validate that `userId` is a positive integer before making the request."*

**Result:** the final version with `interface User`, types on the signature and return, and input validation.

### Prompt 5 — Usage example

> *"Show me how to consume this function with typed error handling using `instanceof`."*

**Result:** the `try/catch` block that distinguishes `UserFetchError` from unexpected errors.

---

## Final version of the code

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

### Usage example

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

## Summary of improvements

| Aspect | Before | After |
|---|---|---|
| Side effects | Internal `console.log` | Returns the data |
| HTTP errors | Not handled | Checks `response.ok` |
| Typing | None | `interface User`, `Promise<User>` |
| Input validation | None | Positive integer |
| Custom errors | No | `UserFetchError` class |
| Readability | `d`, `x`, `j` | Descriptive names + template literals |

## Reflection

AI sped up every step of the refactor, but the architectural decisions —not printing inside the function, splitting the error into its own class, validating the input— came from the developer's judgment. The value of the AI-assisted flow lies in iterating quickly over the outputs and applying technical judgment to bring them to production quality.

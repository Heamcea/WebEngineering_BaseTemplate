interface Problem {
  detail: string;
}

export async function getProblemDetail(response: Response): Promise<string> {
  try {
    const problem = (await response.json()) as Partial<Problem>;

    if (typeof problem.detail === 'string' && problem.detail !== '') {
      return problem.detail;
    }
  } catch {
    // Response war kein gültiges JSON
  }

  return `Request failed with status ${response.status}`;
}

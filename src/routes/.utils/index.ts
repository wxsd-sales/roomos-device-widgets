export const classTransformOptions = { excludeExtraneousValues: true };
export const classValidationOptions = { validationError: { target: false } };

export const onFailure = async (e: Response | Error) => {
  if (e instanceof Response) {
    return e.status === 401 ? { status: 401 } : { status: e.status, body: await e.json().catch(() => undefined) };
  } else {
    console.error(e);
    return { status: 500 };
  }
};

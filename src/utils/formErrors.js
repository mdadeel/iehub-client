/**
 * Turns an API error into a { field: message } map so forms can render the
 * problem under the input that caused it instead of only in a toast.
 *
 * Expects the backend envelope documented in BACKEND-TODO.md §3:
 *   { message, code, errors: { price: "Price must be above zero." } }
 */
export const extractFieldErrors = (error) => {
  const raw = error?.response?.data?.errors;
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return {};
  return Object.entries(raw).reduce((acc, [field, value]) => {
    acc[field] = Array.isArray(value) ? value[0] : String(value);
    return acc;
  }, {});
};

export const hasFieldErrors = (error) => Object.keys(extractFieldErrors(error)).length > 0;

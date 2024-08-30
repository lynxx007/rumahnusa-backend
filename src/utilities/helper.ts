export function isEmpty(data: any): boolean {
  if (data === null || data === undefined) {
    return true;
  }

  //check if the provided data is a string and an empty one
  if (typeof data === 'string' && data.trim() === '') {
    return true;
  }

  //check if the provided data is an array and an empty one
  if (Array.isArray(data) && data.length === 0) {
    return true;
  }

  //check if the provided data is an object and an empty one
  if (typeof data === 'object' && Object.keys(data).length === 0) {
    return true;
  }

  return false;
}
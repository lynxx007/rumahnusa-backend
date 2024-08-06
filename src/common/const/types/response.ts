class CustomResponse {

  status: string;
  message: string;
  data?: object;
  
  constructor(message: string, status: string = 'success', data: object = undefined) {
    this.message = message;
    this.status = status;
    this.data = data;
  } 
}

export { CustomResponse };
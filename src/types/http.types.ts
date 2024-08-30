export type SortOrder = 'ASC' | 'DESC'; 

export interface HttpModuleQueryOptions {
    search: string;
    createdAt: SortOrder; 
}

export class HttpCustomResponse {

  status: string;
  message: string;
  data?: object;
    
  constructor(message: string, status: string = 'success', data: object = undefined) {
    this.message = message;
    this.status = status;
    this.data = data;
  } 
}

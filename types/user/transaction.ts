export interface CreateTransaction {
    _id: string;
    userId: string;
    orderId: string;
    transactionCustomId: string;
    transactionType: string;
    amount: string;
    status: string;
    paymentMethod: string;
    paymentComment: string;
    createdAt: string;
    updatedAt: string;
    
  }
  
  export interface Data {
    data: CreateTransaction[];
  }
  
  export interface CustomerApiRes {
    status:string;
    data: Data;
    meta: [];
  }
  
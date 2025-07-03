export interface Meta {
  page: number;
  limit: number;
  startDate: string;
  endDate: string;
}

export interface TranData {
  totalTransactionsAmount: number;
  totalTransactions: number;
}

export interface ReportTranData {
  status: string;
  data: TranData;
  meta: Meta;
}

export interface OrderData {
  totalOrders: number;
}

export interface ReportOrderData {
  status: string;
  data: OrderData;
  meta: Meta;
}

export interface ReportBillboard {
  status: string;
  data: {
    totalBillboards: number;
  };
  meta: Meta;
}

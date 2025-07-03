export interface Invoice {
  _id?: string;
  invoiceCustomId?: string;
  customerName: string;
  customerMail: string;
  phoneNumber: string;
  mediaType: string;
  state: any;
  BRTtypes: string;
  period: string | number;
  quantity: string | number;
  unitPrice: string | number;
  total?: string | number;
  tax: string | number;
  dueDate: Date;
  createdAt?: Date;
  invoiceNote: string;
}

export interface Data {
  invoices: Invoice[];
  totalInvoices: number;
}

export interface Meta {
  page: number;
  limit: number;
  startDate: string;
  endDate: string;
}

export interface InvoiceApiRes {
  status: string;
  data: Data;
  meta: Meta;
}

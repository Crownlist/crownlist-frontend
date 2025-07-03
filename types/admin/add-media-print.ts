export type CreateMediaApp = {
  mediaType: "Static Billboard" | "Led Billboard" | "BRT Bus" | "Lampost" | any;
  vaad_id: string;
  status: "Available";
  listingTitle?: string;
  description: string;
  address?: string;
  state: any;
  cityLga: any;
  landmark?: any;
  price: number | null;
  googleStreetlink?: string;
  pictures: string[] | { id: string; url: string }[];
  dimension: string;
  nextAvailable: string;
  _id?: string;
  brtType?: string;
  route?: string;
  mediaCustomId?: string;
  amountAvailable?: string | number;
};

export type CreatePrintMedia = {
  prototypeName?: any;
  _id?: string;
  prototypeId: string | any;
  name: string;
  description: string;
  price: number | null;
  pictures: string[] | { id: string; url: string }[];
  height: string;
  width: string;
  finishingDetails: {
    eyelets: boolean;
    pocketTB: boolean;
    pocketLR: boolean;
    none: boolean;
  };
  mediaCustomId?: string;
};

export interface ImageInfo {
  url: string;
  id: string;
}

export interface UploadImgInfoRes {
  status: string;
  data: {
    message: string;
    imageUrls: ImageInfo[];
  };
}

///////\\\\\\\\

export interface GetMediaAppRes {
  status: string;
  data: MediaAppData;
  meta: MediaAppMeta;
}

export interface MediaAppData {
  products: MediaAppProduct[];
  totalPages: number;
  totalProducts: number;
}

export type MediaAppProduct = CreateMediaApp & {
  mediaCustomId: string;
  favoriteCount: number;
  deletedAt: null;
  pictures: MediaAppPic[];
  __v: number;
};

export interface MediaAppPic {
  url: string;
  id: string;
}

export interface MediaAppMeta {
  page: number;
  limit: number;
  startDate: Date;
  endDate: Date;
}

export interface DeleteImgDataType {
  productId: string;
  imageId: string;
}

export interface CreatePrintProps {
  name: string;
  description: string;
}

export interface PrintProType {
  _id: string;
  name: string;
  description: string;
  createdByAdmin: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface PrintProTypeRes {
  status: string;
  data: PrintProType[];
}

export interface PrintProTypeSingleRes {
  status: string;
  data: PrintProType;
}

//////
export interface GetPrintMediaRes {
  status: string;
  data: PrintMediaData;
  meta: MediaAppMeta;
}

export interface PrintMediaData {
  products: CreatePrintMedia[];
  totalPages: number;
  totalProducts: number;
}

export type ForceCast = { id: string; url: string }[];

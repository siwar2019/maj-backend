export interface IVariant {
    name: string;
    description: string;
    colorId:number,
    sizeId:number
  }
  export interface IvariantList { 
    id:number,
    name: string;
    description: string;
    image:string,
    subOptionId:number

  }
  export interface IVarianCreation { 
    id:number,
    quantity: string;
    image:string,
    colorId:number,
    sizeId:number,
    referenceVariant:string

  }


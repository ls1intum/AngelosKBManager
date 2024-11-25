import { BaseItem } from "./base-item.model";

export interface DocumentModel extends BaseItem  {
    title: string;
    uploaded: Date;
}
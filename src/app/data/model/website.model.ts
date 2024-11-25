import { BaseItem } from "./base-item.model";

export interface Website extends BaseItem {
    title: string;
    link: string;
    lastUpdated: Date;
}
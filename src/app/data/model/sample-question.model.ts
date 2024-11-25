import { BaseItem } from "./base-item.model";

export interface SampleQuestion extends BaseItem {
    topic: string;
    question: string;
    answer: string;
    created: Date;
}
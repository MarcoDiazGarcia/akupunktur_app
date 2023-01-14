export interface Point {
    id: string;
    point: string;
    effectiveness: number;
    amountUsed: number;
}

export interface Disease {
    id: string;
    disease: string;
    points: Point[];
}

export enum SortDiseaseByOptions {
    Point = "point",
    AmountUsed = "amountUsed",
    Effectiveness = "effectiveness"
}
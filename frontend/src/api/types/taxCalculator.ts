export type TaxCategory = {
    value: number;
    label: string;
};

export type TaxCalculationRequest = {
    baseValue: number;
    category: number;
};

export type TaxCalculationResult = {
    baseValue: number;
    vatRate: number;
    customsDutyRate: number;
    exciseRate: number;
    vat: number;
    customsDuty: number;
    excise: number;
    totalTaxes: number;
    totalAmount: number;
    categoryName: string;
};

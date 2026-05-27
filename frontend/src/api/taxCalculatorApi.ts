import { api } from "./axios";
import type { TaxCalculationRequest, TaxCalculationResult, TaxCategory } from "./types/taxCalculator";

export async function calculateTaxes(data: TaxCalculationRequest) {
    const response = await api.post<TaxCalculationResult>("/tax-calculator/calculate", data);
    return response.data;
}

export async function getTaxCategories() {
    const response = await api.get<TaxCategory[]>("/tax-calculator/categories");
    return response.data;
}

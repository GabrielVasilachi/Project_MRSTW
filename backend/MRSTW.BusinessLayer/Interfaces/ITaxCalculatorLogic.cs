using MRSTW.Domain.Models.Service;
using MRSTW.Domain.Models.TaxCalculator;

namespace MRSTW.BusinessLayer.Interfaces;

public interface ITaxCalculatorLogic
{
    ServiceResponse CalculateTaxes(TaxCalculationRequestDto request);
    ServiceResponse GetCategories();
}

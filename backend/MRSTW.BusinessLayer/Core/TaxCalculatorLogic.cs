using MRSTW.BusinessLayer.Interfaces;
using MRSTW.BusinessLayer.Structure;
using MRSTW.Domain.Models.Service;
using MRSTW.Domain.Models.TaxCalculator;

namespace MRSTW.BusinessLayer.Core;

public class TaxCalculatorLogic : TaxCalculatorActions, ITaxCalculatorLogic
{
    public ServiceResponse CalculateTaxes(TaxCalculationRequestDto request)
        => CalculateTaxesAction(request);
}

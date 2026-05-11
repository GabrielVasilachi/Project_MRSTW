using MRSTW.Domain.Enums;
using MRSTW.Domain.Models.Service;
using MRSTW.Domain.Models.TaxCalculator;

namespace MRSTW.BusinessLayer.Structure;

public class TaxCalculatorActions
{
    private static readonly Dictionary<ProductCategoryEnum, (decimal Vat, decimal Customs, decimal Excise)> Rates = new()
    {
        { ProductCategoryEnum.TelefonMobil,        (0.20m, 0.00m, 0m) },
        { ProductCategoryEnum.LaptopNotebook,      (0.20m, 0.00m, 0m) },
        { ProductCategoryEnum.Tableta,             (0.20m, 0.00m, 0m) },
        { ProductCategoryEnum.ElectrocasniceMici,  (0.20m, 0.07m, 0m) },
        { ProductCategoryEnum.ImbracaminteHaine,   (0.20m, 0.10m, 0m) },
        { ProductCategoryEnum.Incaltaminte,        (0.20m, 0.15m, 0m) },
        { ProductCategoryEnum.Mobila,              (0.20m, 0.12m, 0m) },
        { ProductCategoryEnum.PieseAuto,           (0.20m, 0.10m, 0m) },
        { ProductCategoryEnum.Jucarii,             (0.20m, 0.10m, 0m) },
        { ProductCategoryEnum.Cosmetice,           (0.20m, 0.06m, 0m) },
        { ProductCategoryEnum.ParfumuriApeToaleta, (0.20m, 0.06m, 0m) },
        { ProductCategoryEnum.Bijuterii,           (0.20m, 0.10m, 0m) },
        { ProductCategoryEnum.Altele,              (0.20m, 0.05m, 0m) },
    };

    private static readonly Dictionary<ProductCategoryEnum, string> CategoryNames = new()
    {
        { ProductCategoryEnum.TelefonMobil,        "Telefon mobil" },
        { ProductCategoryEnum.LaptopNotebook,      "Laptop / Notebook" },
        { ProductCategoryEnum.Tableta,             "Tabletă" },
        { ProductCategoryEnum.ElectrocasniceMici,  "Electrocasnice mici" },
        { ProductCategoryEnum.ImbracaminteHaine,   "Îmbrăcăminte / Haine" },
        { ProductCategoryEnum.Incaltaminte,        "Încălțăminte" },
        { ProductCategoryEnum.Mobila,              "Mobilă" },
        { ProductCategoryEnum.PieseAuto,           "Piese auto" },
        { ProductCategoryEnum.Jucarii,             "Jucării" },
        { ProductCategoryEnum.Cosmetice,           "Cosmetice" },
        { ProductCategoryEnum.ParfumuriApeToaleta, "Parfumuri / Ape de toaletă" },
        { ProductCategoryEnum.Bijuterii,           "Bijuterii" },
        { ProductCategoryEnum.Altele,              "Altele" },
    };

    public ServiceResponse CalculateTaxesAction(TaxCalculationRequestDto request)
    {
        if (request.BaseValue <= 0)
            return new ServiceResponse { IsSuccess = false, Message = "Valoarea de bază trebuie să fie pozitivă." };

        if (!Rates.TryGetValue(request.Category, out var rates))
            return new ServiceResponse { IsSuccess = false, Message = "Categorie necunoscută." };

        var vat         = Math.Round(request.BaseValue * rates.Vat, 2);
        var customsDuty = Math.Round(request.BaseValue * rates.Customs, 2);
        var excise      = Math.Round(request.BaseValue * rates.Excise, 2);
        var totalTaxes  = vat + customsDuty + excise;
        var totalAmount = request.BaseValue + totalTaxes;

        var result = new TaxCalculationResultDto
        {
            BaseValue        = request.BaseValue,
            VatRate          = rates.Vat,
            CustomsDutyRate  = rates.Customs,
            ExciseRate       = rates.Excise,
            Vat              = vat,
            CustomsDuty      = customsDuty,
            Excise           = excise,
            TotalTaxes       = totalTaxes,
            TotalAmount      = totalAmount,
            CategoryName     = CategoryNames[request.Category],
        };

        return new ServiceResponse { IsSuccess = true, Data = result };
    }
}

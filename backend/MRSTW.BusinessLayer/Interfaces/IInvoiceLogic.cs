using MRSTW.Domain.Models.Invoices;
using MRSTW.Domain.Models.Service;

namespace MRSTW.BusinessLayer.Interfaces;

public interface IInvoiceLogic
{
    ServiceResponse CreateInvoice(InvoiceCreateDto invoice);
    ServiceResponse GetInvoiceById(int id);
    ServiceResponse GetInvoiceList();
    ServiceResponse UpdateInvoice(int id, InvoiceUpdateDto invoice);
    ServiceResponse DeleteInvoice(int id);
}

using MRSTW.BusinessLayer.Interfaces;
using MRSTW.BusinessLayer.Structure;
using MRSTW.Domain.Models.Invoices;
using MRSTW.Domain.Models.Service;

namespace MRSTW.BusinessLayer.Core;

public class InvoiceLogic : InvoiceActions, IInvoiceLogic
{
    public ServiceResponse CreateInvoice(InvoiceCreateDto invoice)
    {
        return CreateInvoiceAction(invoice);
    }

    public ServiceResponse GetInvoiceById(int id)
    {
        return GetInvoiceByIdAction(id);
    }

    public ServiceResponse GetInvoiceList()
    {
        return GetInvoiceListAction();
    }

    public ServiceResponse UpdateInvoice(int id, InvoiceUpdateDto invoice)
    {
        return UpdateInvoiceAction(id, invoice);
    }

    public ServiceResponse DeleteInvoice(int id)
    {
        return DeleteInvoiceAction(id);
    }
}

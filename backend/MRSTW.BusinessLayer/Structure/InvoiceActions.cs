using System.Text.RegularExpressions;
using Microsoft.EntityFrameworkCore;
using MRSTW.DataAccessLayer.Context;
using MRSTW.Domain.Entities.Invoices;
using MRSTW.Domain.Models.Invoices;
using MRSTW.Domain.Models.Service;

namespace MRSTW.BusinessLayer.Structure;

public class InvoiceActions
{
    private static readonly Regex EmailRegex = new("^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$", RegexOptions.Compiled);
    private readonly UsersDbContext _db;

    public InvoiceActions()
    {
        _db = new UsersDbContext();
    }

    public ServiceResponse CreateInvoiceAction(InvoiceCreateDto invoice)
    {
        if (invoice == null)
        {
            return Fail("Date invalide pentru invoice.");
        }

        var email = (invoice.AccountEmail ?? string.Empty).Trim().ToLowerInvariant();
        var description = (invoice.Description ?? string.Empty).Trim();
        var currency = (invoice.Currency ?? "MDL").Trim().ToUpperInvariant();

        if (string.IsNullOrWhiteSpace(email) || string.IsNullOrWhiteSpace(description))
        {
            return Fail("Email si descrierea sunt obligatorii.");
        }

        if (!EmailRegex.IsMatch(email))
        {
            return Fail("Email invalid.");
        }

        if (invoice.Amount <= 0)
        {
            return Fail("Suma trebuie sa fie pozitiva.");
        }

        var entity = new InvoiceEntity
        {
            AccountEmail = email,
            Description = description,
            Amount = invoice.Amount,
            Currency = currency,
            Status = "pending"
        };

        _db.Invoices.Add(entity);

        try
        {
            _db.SaveChanges();
        }
        catch (DbUpdateException)
        {
            return Fail("Nu am putut salva invoice-ul.");
        }

        return new ServiceResponse
        {
            IsSuccess = true,
            Message = "Invoice creat cu succes.",
            Data = MapToInfo(entity)
        };
    }

    public ServiceResponse GetInvoiceByIdAction(int id)
    {
        var entity = _db.Invoices.AsNoTracking().FirstOrDefault(i => i.Id == id);
        if (entity == null)
        {
            return Fail("Invoice-ul nu a fost gasit.");
        }

        return new ServiceResponse
        {
            IsSuccess = true,
            Data = MapToInfo(entity)
        };
    }

    public ServiceResponse GetInvoiceListAction()
    {
        var invoices = _db.Invoices.AsNoTracking()
            .Select(i => new InvoiceInfoDto
            {
                Id = i.Id,
                AccountEmail = i.AccountEmail,
                Description = i.Description,
                Amount = i.Amount,
                Currency = i.Currency,
                Status = i.Status
            })
            .ToList();

        return new ServiceResponse
        {
            IsSuccess = true,
            Data = invoices
        };
    }

    public ServiceResponse UpdateInvoiceAction(int id, InvoiceUpdateDto invoice)
    {
        if (invoice == null)
        {
            return Fail("Date invalide pentru invoice.");
        }

        var description = (invoice.Description ?? string.Empty).Trim();
        var currency = (invoice.Currency ?? string.Empty).Trim().ToUpperInvariant();
        var status = (invoice.Status ?? string.Empty).Trim().ToLowerInvariant();

        if (string.IsNullOrWhiteSpace(description) || string.IsNullOrWhiteSpace(currency) || string.IsNullOrWhiteSpace(status))
        {
            return Fail("Descrierea, moneda si statusul sunt obligatorii.");
        }

        if (invoice.Amount <= 0)
        {
            return Fail("Suma trebuie sa fie pozitiva.");
        }

        var entity = _db.Invoices.FirstOrDefault(i => i.Id == id);
        if (entity == null)
        {
            return Fail("Invoice-ul nu a fost gasit.");
        }

        entity.Description = description;
        entity.Amount = invoice.Amount;
        entity.Currency = currency;
        entity.Status = status;

        try
        {
            _db.SaveChanges();
        }
        catch (DbUpdateException)
        {
            return Fail("Nu am putut actualiza invoice-ul.");
        }

        return new ServiceResponse
        {
            IsSuccess = true,
            Message = "Invoice actualizat cu succes.",
            Data = MapToInfo(entity)
        };
    }

    public ServiceResponse DeleteInvoiceAction(int id)
    {
        var entity = _db.Invoices.FirstOrDefault(i => i.Id == id);
        if (entity == null)
        {
            return Fail("Invoice-ul nu a fost gasit.");
        }

        _db.Invoices.Remove(entity);

        try
        {
            _db.SaveChanges();
        }
        catch (DbUpdateException)
        {
            return Fail("Nu am putut sterge invoice-ul.");
        }

        return new ServiceResponse
        {
            IsSuccess = true,
            Message = "Invoice sters cu succes."
        };
    }

    private static InvoiceInfoDto MapToInfo(InvoiceEntity entity)
    {
        return new InvoiceInfoDto
        {
            Id = entity.Id,
            AccountEmail = entity.AccountEmail,
            Description = entity.Description,
            Amount = entity.Amount,
            Currency = entity.Currency,
            Status = entity.Status
        };
    }

    private static ServiceResponse Fail(string message)
    {
        return new ServiceResponse
        {
            IsSuccess = false,
            Message = message
        };
    }
}

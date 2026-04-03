using MRSTW.Domain.Models.Accounts;
using MRSTW.Domain.Models.Service;

namespace MRSTW.BusinessLayer.Interfaces;

public interface IAdminAccountCreationLogic
{
    ServiceResponse CreateAccount(AccountCreateDto account);
    ServiceResponse GetAccountById(int id);
    ServiceResponse GetAccountList();
}

using MRSTW.BusinessLayer.Interfaces;
using MRSTW.BusinessLayer.Structure;
using MRSTW.Domain.Models.Accounts;
using MRSTW.Domain.Models.Service;

namespace MRSTW.BusinessLayer.Core;

public class AdminAccountCreationLogic : AdminAccountCreationActions, IAdminAccountCreationLogic
{
    public ServiceResponse CreateAccount(AccountCreateDto account)
    {
        return CreateAccountAction(account);
    }

    public ServiceResponse GetAccountById(int id)
    {
        return GetAccountByIdAction(id);
    }

    public ServiceResponse GetAccountList()
    {
        return GetAccountListAction();
    }

    public ServiceResponse UpdateAccount(int id, AccountUpdateDto account)
    {
        return UpdateAccountAction(id, account);
    }

    public ServiceResponse DeleteAccount(int id)
    {
        return DeleteAccountAction(id);
    }
}

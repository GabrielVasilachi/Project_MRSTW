using Microsoft.AspNetCore.Mvc;
using MRSTW.BusinessLayer;
using MRSTW.BusinessLayer.Interfaces;
using MRSTW.Domain.Models.Accounts;

namespace MRSTW.Api.Controllers;

[ApiController]
[Route("api/admin/accounts")]
public class AdminAccountsController : ControllerBase
{
    private readonly IAdminAccountCreationLogic _logic;

    public AdminAccountsController()
    {
        var bl = new BusinessLogic();
        _logic = bl.GetAdminAccountCreationLogic();
    }

    [HttpPost]
    public IActionResult Create([FromBody] AccountCreateDto account)
    {
        var response = _logic.CreateAccount(account);
        if (!response.IsSuccess)
        {
            return BadRequest(response.Message);
        }

        return Ok(response.Data);
    }

    [HttpGet("{id:int}")]
    public IActionResult GetById(int id)
    {
        var response = _logic.GetAccountById(id);
        if (!response.IsSuccess)
        {
            return NotFound(response.Message);
        }

        return Ok(response.Data);
    }

    [HttpGet]
    public IActionResult GetList()
    {
        var response = _logic.GetAccountList();
        if (!response.IsSuccess)
        {
            return BadRequest(response.Message);
        }

        return Ok(response.Data);
    }

    [HttpPut("{id:int}")]
    public IActionResult Update(int id, [FromBody] AccountUpdateDto account)
    {
        var response = _logic.UpdateAccount(id, account);
        if (!response.IsSuccess)
        {
            return BadRequest(response.Message);
        }

        return Ok(response.Data);
    }

    [HttpDelete("{id:int}")]
    public IActionResult Delete(int id)
    {
        var response = _logic.DeleteAccount(id);
        if (!response.IsSuccess)
        {
            return NotFound(response.Message);
        }

        return Ok(response.Message);
    }
}

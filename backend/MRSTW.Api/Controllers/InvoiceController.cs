using Microsoft.AspNetCore.Mvc;
using MRSTW.BusinessLayer;
using MRSTW.BusinessLayer.Interfaces;
using MRSTW.Domain.Models.Invoices;

namespace MRSTW.Api.Controllers;

[ApiController]
[Route("api/invoices")]
public class InvoiceController : ControllerBase
{
    private readonly IInvoiceLogic _logic;

    public InvoiceController()
    {
        var bl = new BusinessLogic();
        _logic = bl.GetInvoiceLogic();
    }

    // GET /api/invoices
    [HttpGet]
    public IActionResult GetList()
    {
        var response = _logic.GetInvoiceList();
        if (!response.IsSuccess)
        {
            return BadRequest(response.Message);
        }

        return Ok(response.Data);
    }

    // GET /api/invoices/{id}
    [HttpGet("{id:int}")]
    public IActionResult GetById(int id)
    {
        var response = _logic.GetInvoiceById(id);
        if (!response.IsSuccess)
        {
            return NotFound(response.Message);
        }

        return Ok(response.Data);
    }

    // POST /api/invoices
    [HttpPost]
    public IActionResult Create([FromBody] InvoiceCreateDto invoice)
    {
        var response = _logic.CreateInvoice(invoice);
        if (!response.IsSuccess)
        {
            return BadRequest(response.Message);
        }

        return Ok(response.Data);
    }

    // PUT /api/invoices/{id}
    [HttpPut("{id:int}")]
    public IActionResult Update(int id, [FromBody] InvoiceUpdateDto invoice)
    {
        var response = _logic.UpdateInvoice(id, invoice);
        if (!response.IsSuccess)
        {
            return BadRequest(response.Message);
        }

        return Ok(response.Data);
    }

    // DELETE /api/invoices/{id}
    [HttpDelete("{id:int}")]
    public IActionResult Delete(int id)
    {
        var response = _logic.DeleteInvoice(id);
        if (!response.IsSuccess)
        {
            return NotFound(response.Message);
        }

        return Ok(response.Message);
    }
}

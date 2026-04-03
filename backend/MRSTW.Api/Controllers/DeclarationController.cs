using Microsoft.AspNetCore.Mvc;
using MRSTW.BusinessLayer;
using MRSTW.BusinessLayer.Interfaces;
using MRSTW.Domain.Models.Declarations;

namespace MRSTW.Api.Controllers;

[ApiController]
[Route("api/declarations")]
public class DeclarationController: ControllerBase
{
    private readonly IDeclarationLogic _declarationLogic;

    public DeclarationController()
    {
        var bl = new BusinessLogic();
        _declarationLogic  = bl.GetDeclarationLogic();
    }

    // GET /api/declarations/list
    [HttpGet("list")]
    public IActionResult GetList()
    {
        var response = _declarationLogic.GetDeclarationList();
        if (!response.IsSuccess)
        {
            return BadRequest(response.Message);
        }

        return Ok(response.Data);
    }

    // GET /api/declarations/:id
    [HttpGet("{id}")]
    public IActionResult GetById([FromRoute] int id)
    {
        var response = _declarationLogic.GetDeclarationById(id);
        if (!response.IsSuccess)
        {
            return BadRequest(response.Message);
        }

        return Ok(response.Data);
    }

    // POST /api/declarations/create
    [HttpPost("create")]
    public IActionResult Create([FromBody] DeclarationCreateDto declaration)
    {
        var response = _declarationLogic.CreateDeclaration(declaration);
        if (!response.IsSuccess)
        {
            return BadRequest(response.Message);
        }

        return Ok(response.Message);
    }

    // PUT /api/declarations/:id
    [HttpPut("{id}")]
    public IActionResult Update([FromRoute] int id, [FromBody] DeclarationUpdateDto declaration)
    {
        var response = _declarationLogic.UpdateDeclaration(id, declaration);
        if (!response.IsSuccess)
        {
            return BadRequest(response.Message);
        }

        return Ok(response.Message);
    }

    // DELETE /api/declarations/:id
    [HttpDelete("{id}")]
    public IActionResult Delete([FromRoute] int id)
    {
        var response = _declarationLogic.DeleteDeclaration(id);
        if (!response.IsSuccess)
        {
            return BadRequest(response.Message);
        }

        return Ok(response.Message);
    }
}
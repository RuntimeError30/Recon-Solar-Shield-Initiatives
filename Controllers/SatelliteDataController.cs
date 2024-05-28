using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using RSSI_webAPI.Authorization;
using RSSI_webAPI.Models.DtoModels;
using RSSI_webAPI.Repositories.Contracts;

namespace RSSI_webAPI.Controllers;

[Route("api/[controller]")]
[ApiController]
[ServiceFilter(typeof(AuthFilter))]
public class SatelliteDataController : ControllerBase
{
    private readonly IMapper _automap;
    private readonly ISatelliteDataRepository _repository;
    public SatelliteDataController(ISatelliteDataRepository repository,IMapper mp)
    {
        _automap = mp;
        _repository = repository;
    }

    [HttpGet("dscovr")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult> GetDscovrData()
    {
        var data = await _repository.GetDscovrRealtimeData();
        if (data == null)
            return NoContent();
        if (data.Error != null)
            return StatusCode(500, new { message = "Internal Server Error", error = data.Error });
        return Ok(_automap.Map<SatelliteDataDtoModel>(data));
    }

    [HttpGet("ace")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult> GetAceData()
    {
        var data = await _repository.GetAceRealtimeData();
        if (data == null)
            return NoContent();
        if (data.Error != null)
            return StatusCode(500, new { message = "Internal Server Error", error = data.Error });
        return Ok(_automap.Map<SatelliteDataDtoModel>(data));
    }
}

using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using RSSI_webAPI.Authorization;
using RSSI_webAPI.Repositories.Contracts;

namespace RSSI_webAPI.Controllers;

[Route("api/[controller]")]
[ApiController]
[ServiceFilter(typeof(AuthFilter))]
public class EarthDataController : ControllerBase
{
    private readonly IMapper _automap;
    private readonly IEarthDataRepository _repository;

    public EarthDataController(IEarthDataRepository repository, IMapper mp)
    {
        _automap = mp;
        _repository = repository;
    }

    [HttpGet("ncei")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]

    public async Task<ActionResult> GetGeoMagneticDataNCEI()
    {
        var data = await _repository.GetGeoMagneticDataFromNCEI();
        if (data == null)
            return NoContent();
        return Ok(data);
    }

    [HttpGet("bgs")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]

    public async Task<ActionResult> GetGeoMagneticDataBGS()
    {
        var data = await _repository.GetGeoMagneticDataFromBGS();
        if (data == null)
            return NoContent();
        return Ok(data);
    }

}

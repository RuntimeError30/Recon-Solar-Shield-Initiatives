using Microsoft.AspNetCore.Mvc;
using RSSI_webAPI.Authorization;
using RSSI_webAPI.Data;
using RSSI_webAPI.Models;
using static RSSI_webAPI.RssiRegressionEngine;

namespace RSSI_webAPI.Controllers;

[Route("api/[controller]")]
[ApiController]
[ServiceFilter(typeof(AuthFilter))]

public class BtRegressionController : ControllerBase
{
    private readonly ApplicationDbContext _dbcontext;

    public BtRegressionController(ApplicationDbContext dbcontext)
    {
        _dbcontext = dbcontext;
    }

    [HttpPost]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<SupervisedDataModel>> Predict([FromBody] ModelInput input)
    {
        try
        {
            if (!ModelState.IsValid)
                return BadRequest("invalid model state!");
            // Call the Predict method to make predictions
            ModelOutput prediction = await Task.Run(
                () => RssiRegressionEngine.Predict(input)
            );

            SupervisedDataModel model = new()
            {
                Year = Convert.ToInt32(prediction.Year),
                Month = Convert.ToInt32(prediction.Month),
                BxGSM = prediction.Bx_gsm,
                ByGSM = prediction.By_gsm,
                BzGSM = prediction.Bz_gsm,
                Bt = prediction.Score,
                Intensity = prediction.Intensity,
                Declination = prediction.Declination,
                Inclination = prediction.Inclination,
                North = prediction.North,
                East = prediction.East,
                Vertical = prediction.Vertical,
                Horizontal = prediction.Horizontal
            };

            return Ok(model);
        }
        catch (Exception ex)
        {
            return StatusCode(500,ex.Message);
        }
    }


    [HttpPost("feedback")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult> Feedback(SupervisedDataModel feedback)
    {
        try
        {
            if (!ModelState.IsValid)
                return BadRequest("Invalid model state!");
            await _dbcontext.ReconnectionRecords.AddAsync(feedback);
            await _dbcontext.SaveChangesAsync();
            return Ok();
        }
        catch (Exception ex)
        {
            return StatusCode(500,ex.Message);
        }
    }

}
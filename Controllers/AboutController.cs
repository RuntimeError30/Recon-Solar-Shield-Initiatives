using Microsoft.AspNetCore.Mvc;

namespace RSSI_webAPI.Controllers;

[Route("")]
public class AboutController : Controller
{
    [HttpGet("home")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public ActionResult Index()
    {
        return View();
    }

    [HttpGet("apidef")]
    public ActionResult ApiDef()
    {
        var req = HttpContext.Request;
        var url = $"{req.Scheme}://{req.Host}{req.PathBase}";
        ViewBag.Baseurl = url;
        return View();
    }
}

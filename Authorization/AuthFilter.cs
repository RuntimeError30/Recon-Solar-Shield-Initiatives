using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace RSSI_webAPI.Authorization;

public class AuthFilter : IAuthorizationFilter
{
    private readonly IConfiguration _configuration;
    public AuthFilter(IConfiguration configuration)
    {
        _configuration = configuration;
    }
    public void OnAuthorization(AuthorizationFilterContext context)
    {
        if (!context.HttpContext.Request.Headers.TryGetValue(AuthConstants.ApiKeyHeaderName,out var extractedApiKey))
        {
            context.Result = new UnauthorizedObjectResult("Api key missing!");
            return;
        }

        var apiKey = _configuration.GetValue<string>(AuthConstants.ApiKeySectionName);

        if (!apiKey.Equals(extractedApiKey))
        {
            context.Result = new UnauthorizedObjectResult("Invalid api key!");
            return;
        }

    }
}

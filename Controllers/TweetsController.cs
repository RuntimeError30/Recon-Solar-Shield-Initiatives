using Microsoft.AspNetCore.Mvc;
using RSSI_webAPI.Authorization;
using RSSI_webAPI.Models.DtoModels;
using System.Text;
using Tweetinvi;
using Tweetinvi.Models;

namespace RSSI_webAPI.Controllers;

[Route("api/[controller]")]
[ApiController]
[ServiceFilter(typeof(AuthFilter))]
public class TweetsController : ControllerBase
{
    private readonly IConfiguration _conf;
    private readonly string _apiKey;
    private readonly string _apiKeySecret;
    private readonly string _accessToken;
    private readonly string _accessTokenSecret;

    public TweetsController(IConfiguration configuration)
    {
        _conf = configuration;
        _apiKey = _conf["Xbot:ApiKey"];
        _apiKeySecret = _conf["Xbot:ApiKeySecret"];
        _accessToken = _conf["Xbot:AccessToken"];
        _accessTokenSecret = _conf["Xbot:AccessTokenSecret"];
    }


    [HttpPost]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult> PostTweet(TweetReqDtoModel newTweet)
    {
        var client = new TwitterClient(_apiKey, _apiKeySecret, _accessToken, _accessTokenSecret);
        var result = await client.Execute.AdvanceRequestAsync(
            BuildTwitterRequest(newTweet, client)
        );
        return Ok(result.Content);
        
    }

    private static Action<ITwitterRequest> BuildTwitterRequest(
        TweetReqDtoModel tweet, TwitterClient client)
    {
        return (ITwitterRequest request) => 
        {
            var json = client.Json.Serialize(tweet);
            var content = new StringContent(json,Encoding.UTF8,"application/json");
            request.Query.Url = "https://api.twitter.com/2/tweets";
            request.Query.HttpMethod = Tweetinvi.Models.HttpMethod.POST;
            request.Query.HttpContent = content;
        };
    }

}

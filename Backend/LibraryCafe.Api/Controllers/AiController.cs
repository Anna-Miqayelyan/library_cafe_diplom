using Microsoft.AspNetCore.Mvc;
using System.Text;
using System.Text.Json;

namespace LibraryCafe.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AiController : ControllerBase
{
    private readonly IConfiguration _config;
    private readonly HttpClient _http;

    public AiController(IConfiguration config, IHttpClientFactory httpClientFactory)
    {
        _config = config;
        _http = httpClientFactory.CreateClient();
    }

    [HttpPost("chat")]
    public async Task<IActionResult> Chat([FromBody] AiChatRequest? req)
    {
        if (req == null)
            return BadRequest(new { message = "Request body is required" });

        if (string.IsNullOrWhiteSpace(req.Message))
            return BadRequest(new { message = "Message is required" });

        var accountId = _config["Cloudflare:AccountId"];
        var apiToken = _config["Cloudflare:ApiToken"];

        if (string.IsNullOrWhiteSpace(accountId) || string.IsNullOrWhiteSpace(apiToken))
            return StatusCode(503, new { message = "AI not configured. Add Cloudflare:AccountId and Cloudflare:ApiToken to appsettings.json" });

        try
        {
            var url = $"https://api.cloudflare.com/client/v4/accounts/{accountId}/ai/run/@cf/meta/llama-3.1-8b-instruct";

            var systemText = req.SystemPrompt
                ?? "You are a friendly assistant for a Library Cafe. Help with book recommendations, historical trivia, cafe pairings, and reading culture. Keep responses warm and concise.";

            var payload = new
            {
                messages = new[]
                {
                    new { role = "system", content = systemText },
                    new { role = "user",   content = req.Message }
                }
            };

            var json = JsonSerializer.Serialize(payload);
            using var httpReq = new HttpRequestMessage(HttpMethod.Post, url)
            {
                Content = new StringContent(json, Encoding.UTF8, "application/json")
            };
            httpReq.Headers.Add("Authorization", $"Bearer {apiToken}");

            var response = await _http.SendAsync(httpReq);
            var body = await response.Content.ReadAsStringAsync();

            if (!response.IsSuccessStatusCode)
            {
                try
                {
                    using var errDoc = JsonDocument.Parse(body);
                    var errMsg = errDoc.RootElement
                        .GetProperty("errors")[0]
                        .GetProperty("message")
                        .GetString() ?? "Cloudflare AI error";
                    return StatusCode((int)response.StatusCode, new { message = errMsg });
                }
                catch
                {
                    return StatusCode((int)response.StatusCode, new { message = "Cloudflare AI error", detail = body });
                }
            }

            // Cloudflare response: { "result": { "response": "..." } }
            using var doc = JsonDocument.Parse(body);
            var text = doc.RootElement
                .GetProperty("result")
                .GetProperty("response")
                .GetString() ?? "";

            return Ok(new { reply = text });
        }
        catch (HttpRequestException ex)
        {
            return StatusCode(503, new { message = "Cannot reach Cloudflare AI.", detail = ex.Message });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "AI request failed.", detail = ex.Message });
        }
    }
}

public class AiChatRequest
{
    public string Message { get; set; } = "";
    public string? SystemPrompt { get; set; }
}
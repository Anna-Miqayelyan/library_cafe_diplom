using System.Net.Http.Headers;
namespace LibraryCafe.Api.Services
{
    public class CloudinaryService
    {
        private readonly HttpClient _http;
        private readonly string _cloudName;
        private readonly string _apiKey;
        private readonly string _apiSecret;

        public CloudinaryService(IHttpClientFactory httpClientFactory, IConfiguration config)
        {
            _http = httpClientFactory.CreateClient();
            _cloudName = config["Cloudinary:CloudName"] ?? throw new Exception("Cloudinary:CloudName is missing in appsettings.json");
            _apiKey = config["Cloudinary:ApiKey"] ?? throw new Exception("Cloudinary:ApiKey is missing in appsettings.json");
            _apiSecret = config["Cloudinary:ApiSecret"] ?? throw new Exception("Cloudinary:ApiSecret is missing in appsettings.json");
        }

        /// <summary>
        /// Uploads an image file to Cloudinary. Returns the secure HTTPS URL.
        /// </summary>
        public async Task<string> UploadImageAsync(IFormFile file, string folder = "library/images")
        {
            return await UploadAsync(file, folder, resourceType: "image");
        }

        /// <summary>
        /// Uploads a PDF file to Cloudinary. Returns the secure HTTPS URL.
        /// </summary>
        public async Task<string> UploadPdfAsync(IFormFile file, string folder = "library/pdfs")
        {
            return await UploadAsync(file, folder, resourceType: "raw");
        }

        // ── Core upload method (works for both images and PDFs) ──────────────────
        private async Task<string> UploadAsync(IFormFile file, string folder, string resourceType)
        {
            var url = $"https://api.cloudinary.com/v1_1/{_cloudName}/{resourceType}/upload";

            // Build auth: Basic base64(apiKey:apiSecret)
            var credentials = Convert.ToBase64String(
                System.Text.Encoding.UTF8.GetBytes($"{_apiKey}:{_apiSecret}"));

            // Build timestamp + signature
            var timestamp = DateTimeOffset.UtcNow.ToUnixTimeSeconds().ToString();
            var paramsToSign = $"folder={folder}&timestamp={timestamp}";
            var signature = ComputeSha1($"{paramsToSign}{_apiSecret}");

            using var content = new MultipartFormDataContent();

            // File stream
            var fileContent = new StreamContent(file.OpenReadStream());
            fileContent.Headers.ContentType = new MediaTypeHeaderValue(file.ContentType);
            content.Add(fileContent, "file", file.FileName);

            // Required Cloudinary fields
            content.Add(new StringContent(_apiKey), "api_key");
            content.Add(new StringContent(timestamp), "timestamp");
            content.Add(new StringContent(signature), "signature");
            content.Add(new StringContent(folder), "folder");

            // ✅ ADD THIS LINE - Makes files publicly accessible
            content.Add(new StringContent("public"), "access_mode");

            var request = new HttpRequestMessage(HttpMethod.Post, url) { Content = content };
            request.Headers.Authorization = new AuthenticationHeaderValue("Basic", credentials);

            var response = await _http.SendAsync(request);
            var body = await response.Content.ReadAsStringAsync();

            if (!response.IsSuccessStatusCode)
                throw new Exception($"Cloudinary upload failed ({response.StatusCode}): {body}");

            // Parse secure_url from JSON response
            using var doc = System.Text.Json.JsonDocument.Parse(body);
            if (doc.RootElement.TryGetProperty("secure_url", out var urlProp))
                return urlProp.GetString()!;

            throw new Exception($"Cloudinary response did not contain secure_url: {body}");
        }

        private static string ComputeSha1(string input)
        {
            var bytes = System.Security.Cryptography.SHA1.HashData(
                System.Text.Encoding.UTF8.GetBytes(input));
            return Convert.ToHexString(bytes).ToLower();
        }
    }
}
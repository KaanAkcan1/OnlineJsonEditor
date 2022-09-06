using Flurl.Http;

namespace OnlineJsonEditor.Services
{
    public class FlurlServices
    {
        private IFlurlRequest ApiRequest(string route, string? baseUrl, string? apiKey)
        {
            return baseUrl.WithHeader("X-Api-Key", apiKey).AppendPathSegment(route);
        }

        public Task<TResult?> Deneme<TResult>(string url, string baseUrl, object payload, string? apiKey) 
        {
            return (baseUrl + url).PostJsonAsync(payload).ReceiveJson<TResult>();
        }

        public Task<TResult?> PostJsonAsync<TResult>(string url, string baseUrl, object payload, string? apiKey) => SendJsonAsync<TResult>(url, "POST",baseUrl, payload, apiKey);
        public Task<TResult?> GetJsonAsync<TResult>(string url, string baseUrl, object? payload = null, string? apiKey =null) => SendJsonAsync<TResult>(url, "GET",baseUrl,payload, apiKey);

        private async Task<TResult?> SendJsonAsync<TResult>(string url, string method, string baseUrl, object? payload,string? apiKey)
        {
            var request = ApiRequest(url,baseUrl,apiKey);

            try
            {
                request.Settings.Timeout = TimeSpan.FromMinutes(4);

                var response = method.ToLowerInvariant() switch
                {
                    "post" => await request.PostJsonAsync(payload).ReceiveJson<TResult>(),
                    _ => payload != null ? await request.SetQueryParams(payload).GetJsonAsync<TResult>() : await request.GetJsonAsync<TResult>(),
                };

                return response;
            }
            catch (Exception ex)
            {
                return default;
            }
        }
    }
}

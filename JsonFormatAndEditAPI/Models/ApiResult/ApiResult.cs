namespace OnlineJsonEditor.Models.ApiResult
{
    public class ApiResult<T>
    {
        public T Data { get; set; }
        public bool Success { get; set; }
        public string Message { get; set; }
    }
}

using Microsoft.AspNetCore.Mvc;

namespace OnlineJsonEditor.Files

{
    public class ApiEndPoints
    {
        #region Apiler İçin Controller

        public class ApiResult<T>
        {
            public T Data { get; set; }
            public bool Success { get; set; }
            public string Message { get; set; }
        }


        [HttpPost("find-json")]
        public async Task<ApiResult<string>> FindJsonAsync(string path)
        {
            var result = new ApiResult<string>();

            if (path != null)
            {
                try
                {
                    var json = await System.IO.File.ReadAllTextAsync(path);

                    result.Success = true;
                    result.Data = json;
                    result.Message = "OK";

                    return result;
                }
                catch (Exception ex)
                {
                    result.Message = ex.Message;
                    result.Success = false;
                    return result;
                }
            }
            result.Success = false;
            result.Message = "Path is null";
            return result;
        }


        public class RequestModel
        {
            public string Data { get; set; }
            public string Path { get; set; }
            public string WebSiteName { get; set; }
        }

        [HttpPost("save-json")]
        public async Task<ApiResult<string>> SaveJsonAsync(RequestModel request)
        {
            var result = new ApiResult<string>();

            if (request.Path != null)
            {
                try
                {
                    var json = await System.IO.File.ReadAllTextAsync(request.Path);

                    var time = DateTime.Now.ToString("yyyyMMddHHmmss");

                    var bakPath = request.Path.Split(".json")[0] + "-" + time + ".bak";

                    var oldRecord = await System.IO.File.ReadAllTextAsync(request.Path);

                    System.IO.File.WriteAllText(bakPath, oldRecord);

                    System.IO.File.Delete(request.Path);

                    System.IO.File.WriteAllText(request.Path, request.Data);

                    result.Success = true;
                    result.Data = request.Data;
                    result.Message = "OK";

                    return result;

                }
                catch (Exception ex)
                {
                    result.Message = ex.Message;
                    result.Success = false;
                    return result;
                }
            }
            result.Success = false;
            result.Message = "Path is null";
            return result;
        }


        #endregion
    }
}

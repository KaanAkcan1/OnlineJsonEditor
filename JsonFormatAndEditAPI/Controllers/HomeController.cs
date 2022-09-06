using OnlineJsonEditor.Models;
using OnlineJsonEditor.Models.Account;
using OnlineJsonEditor.Services;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Diagnostics;
using OnlineJsonEditor.Models.ApiResult;

namespace OnlineJsonEditor.Controllers
{
    public class HomeController : Controller
    {
        private readonly FlurlServices _flurlServices;
        private readonly LoginServices _loginServices;

        public HomeController(FlurlServices flurlServices, LoginServices loginServices)
        {
            _flurlServices = flurlServices;
            _loginServices = loginServices;
        }

        public async Task<IActionResult> Index()
        {
            if (_loginServices.IsLogIn) return View();
            
            return RedirectToAction("Login", "Account");
        }

        [Route("/find-json")]
        public async Task<IActionResult> FindJsonAsync(RequestFromUI request)
        {
            var result = new ResponseToUI();

            var webSite = _loginServices.WebSites.Where(x => x.Name == request.WebSiteName).FirstOrDefault();

            if(webSite != null)
            {
                try
                {
                    var response = await _flurlServices.PostJsonAsync<ApiResult<string>>(webSite.GetJsonUrl, webSite.BaseUrl, request.Path, webSite.ApiKey);

                    if(response != null && response.Success && response.Data != null)
                    {
                        result.Success = true;
                        result.Data = response.Data;
                        result.Message = response.Message;
                    }
                    else 
                    {
                        if (response != null)
                            result.Message=response.Message;

                        result.Success = false;
                    }
                }
                catch (Exception ex)
                {

                    result.Success = false;
                    result.Message = ex.Message;
                    return Ok(result);
                }
            }

            return Ok(result);
        }

        [Route("/save-json")]
        public async Task<IActionResult> SaveJsonAsync(RequestFromUI request)
        {
            var result = new ResponseToUI();

            var webSite = _loginServices.WebSites.Where(x => x.Name == request.WebSiteName).FirstOrDefault();

            if (webSite != null)
            {
                try
                {
                    var response = await _flurlServices.PostJsonAsync<ApiResult<string>>(webSite.SaveJsonUrl, webSite.BaseUrl, request.Data, webSite.ApiKey);

                    if (response != null && response.Success && response.Data != null)
                    {
                        result.Success = true;
                        result.Data = response.Data;
                        result.Message = response.Message;
                    }
                    else
                    {
                        if (response != null)
                            result.Message = response.Message;

                        result.Success = false;
                    }
                }
                catch (Exception ex)
                {

                    result.Success = false;
                    result.Message = ex.Message;
                    return Ok(result);
                }
            }

            return Ok(result);
            
        }
    }
}
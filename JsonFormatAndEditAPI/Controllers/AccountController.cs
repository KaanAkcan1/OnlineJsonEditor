using OnlineJsonEditor.Models;
using OnlineJsonEditor.Models.Account;
using OnlineJsonEditor.Services;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Diagnostics;

namespace OnlineJsonEditor.Controllers
{
    
    public class AccountController : Controller
    {
        private readonly FlurlServices _flurlServices;
        private readonly LoginServices _loginServices;

        private IConfigurationRoot identityApiValues
        {
            get
            {
                return new ConfigurationBuilder().AddJsonFile("appsettings.json").Build();
            }
        }

        public AccountController(FlurlServices flurlServices, LoginServices loginServices)
        {
            _flurlServices = flurlServices;
            _loginServices = loginServices;
        }
        public async Task<IActionResult> Login()
        {
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> Login(Login login)
        {
            var result = _loginServices.LogIn(login);

            if (result)
            {
                ViewBag.LogIn = true;

                return RedirectToAction("Index", "Home");
            }
            else
                return View();
        }

        public async Task<IActionResult> LogOut()
        {
            _loginServices.LogOut();

            return RedirectToAction("Index", "Home");
        }


        [HttpGet("get-select-list")]
        public async Task<IActionResult> GetSelectionListAsync()
        {
            var result = _loginServices.WebSites;

            return Ok(result);
        }
    }
}

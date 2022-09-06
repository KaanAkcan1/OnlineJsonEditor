using JsonFormatAndEditAPI.Services;
using Microsoft.AspNetCore.Mvc;

namespace JsonFormatAndEditAPI.Controllers
{
    public class FlurlController : Controller
    {
        private readonly FlurlServices _flurlServices;

        public FlurlController(FlurlServices flurlServices)
        {
            _flurlServices = flurlServices;
        }

        public void Deneme()
        {

            var a = 2;
        }
    }
}

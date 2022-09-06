using Newtonsoft.Json;
using OnlineJsonEditor.Models;
using OnlineJsonEditor.Models.Account;

namespace OnlineJsonEditor.Services
{
    public class LoginServices
    {
        private class AppUser
        {
            public List<WebSite> WebSites { get; set; } = new();
            public string Name { get;  } = "Admin";
            public string Email { get; } = "dev@performans.com";
            public string Password { get; } = "Performans.2022";
            
        }

        public bool IsLogIn { get; set; } = false;

        public List<WebSite> WebSites { get; set; } = null;

        public bool LogIn(Login login)
        {
            var userInfo = new AppUser();

            if(login.Password == userInfo.Password && login.Email == userInfo.Email)
            {
                var json = System.IO.File.ReadAllText(Path.Combine("Files", "WebSites.js"));

                WebSites= JsonConvert.DeserializeObject<List<WebSite>>(json);

                IsLogIn = true;

                return true;
            }

            return false;
        }

        public bool LogOut()
        {
            IsLogIn = false;

            WebSites = null;

            return true;
        }

    }
}

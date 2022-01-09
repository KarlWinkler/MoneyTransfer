using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using MoneyTransferAPI.Data.AuthData;
using MoneyTransferAPI.Data.RepositoryInterface;
using MoneyTransferAPI.JWTAuth;
using MoneyTransferAPI.JWTAuthorization;
using MoneyTransferAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace MoneyTransferAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        IConfiguration _config;
        private readonly IAccountRepo _conn;
        public AuthController(IConfiguration configuration, IAccountRepo conn)
        {
            _config = configuration;
            _conn = conn;
        }
        [HttpGet]
        [Authorize]
        public ActionResult<string> test() {

            // var currentUser = HttpContext.User;
            ClaimsPrincipal currentUser = HttpContext.User;
            string data = null;

            if(currentUser.HasClaim(claim => claim.Type == "Id"))
            {
                data = currentUser.Claims.FirstOrDefault(claim => claim.Type == "Id").Value;

                return Ok(data);
            }

            return data == null ? Ok("Your JWT is not valid") : Ok("Hello, World");
        }

        [HttpPost]
        public IActionResult auth(AuthDataModel data) {
            Account check = _conn.getAccountByUserName(data.username); 

            if(check == null) return Unauthorized( new { Response = "Username or password is not correct!" });

            var token = new Authenticator().authentictorHelper(data, check, _config);

            if (token == "null") return Unauthorized("Your Credintials are not corect");

            return Ok(new { Token = token });
        }
    }
}

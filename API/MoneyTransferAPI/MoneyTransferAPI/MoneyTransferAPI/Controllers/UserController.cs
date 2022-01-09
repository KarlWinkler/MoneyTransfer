using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MoneyTransferAPI.Data.RepositoryInterface;
using MoneyTransferAPI.JWTAuthorization;
using MoneyTransferAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MoneyTransferAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class UserController : Controller
    {

        private readonly IUserRepo _conn;
        public UserController(IUserRepo conn) {
            _conn = conn;
        }

        [HttpGet("all")]
        public ActionResult<IEnumerable<dynamic>> getAllusers() {
            string AccountType = new Authorizer().AuthorizerRequestType(HttpContext.User);
            if (AccountType != null && AccountType == "ADMIN")
                return Ok(_conn.getAllUser());
            else
                return Ok(new { Response = "Your Account Type is not Autorized" });
        }

        [HttpGet]
        public ActionResult<dynamic> getUserById() {
            int AccountId = new Authorizer().AuthorizerRequestId(HttpContext.User);
            return Ok(_conn.getUserById(AccountId));
        }

        [HttpGet("rewards")]
        public ActionResult<dynamic> getUserRewards() {
            int AccountId = new Authorizer().AuthorizerRequestId(HttpContext.User);
            return Ok(_conn.getUserRewads(AccountId));
        }

        [HttpGet("friend")]
        public ActionResult<dynamic> getFriends()
        {
            int AccountId = new Authorizer().AuthorizerRequestId(HttpContext.User);
            return Ok(_conn.getFriends(AccountId));
        }
        
    }
}

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MoneyTransferAPI.Data.RepositoryInterface;
using MoneyTransferAPI.JWTAuthorization;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MoneyTransferAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class AdminController : Controller
    {
        private readonly IAdminRepo _conn;
        public AdminController(IAdminRepo conn)
        {
            _conn = conn;
        }

        [HttpGet("all")]
        public ActionResult<IEnumerable<dynamic>> getAllAdmin()
        {
            string AccountType = new Authorizer().AuthorizerRequestType(HttpContext.User);
            if (AccountType != null && AccountType == "ADMIN")
                return Ok(_conn.getAllAdmin());
            else
                return Ok(new { Response = "Your Account Type is not Autorized" });   
        }

        [HttpGet]
        public ActionResult<dynamic> getAdminById()
        {
            int AccountId = new Authorizer().AuthorizerRequestId(HttpContext.User);
            return Ok(_conn.getAdminById(AccountId));
        }

    }
}

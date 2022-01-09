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
    public class PartnerController : Controller
    {
        private readonly IPartnerRepo _conn;
        public PartnerController(IPartnerRepo conn)
        {
            _conn = conn;
        }

        [HttpGet("all")]
        public ActionResult<IEnumerable<dynamic>> getAllPartners()
        {
            string AccountType = new Authorizer().AuthorizerRequestType(HttpContext.User);

            if (AccountType != null && AccountType == "ADMIN")
                return Ok(_conn.getAllPartners());
            else
                return Ok(new { Response = "Your Account Type is not Autorized" });
            
        }

        [HttpGet]
        public ActionResult<dynamic> getPartnerById()
        {
            int AccountId = new Authorizer().AuthorizerRequestId(HttpContext.User);
            return Ok(_conn.getPartnerById(AccountId));
        }

        [HttpGet("location")]
        public ActionResult<dynamic> getPartnerLocations() {
            int AccountId = new Authorizer().AuthorizerRequestId(HttpContext.User);
            return Ok(_conn.getPartnerLocations(AccountId));
        }

    }
}

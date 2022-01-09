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
    public class FeeController : Controller
    {
        private readonly IFeeRepo _conn;

        public FeeController(IFeeRepo conn)
        {
            _conn = conn;
        }

        [HttpGet("all")]
        public ActionResult<IEnumerable<Fee>> getAllFees() {
            string AccountType = new Authorizer().AuthorizerRequestType(HttpContext.User);
            if (AccountType != null && AccountType == "ADMIN")
                return Ok(_conn.getAllFees());
            else
                return Ok(new { Response = "Your Account Type is not Autorized" });
            
        }

        [HttpGet("{id}")]
        public ActionResult<dynamic> getFeeById(int id) {
            return Ok(_conn.getFeeById(id));
        }

        [HttpPost]
        public ActionResult<Fee> postFee(Fee data) {
            return Ok(_conn.postFee(data));
        }

        [HttpDelete("{id}")]
        public ActionResult<Fee> deleteFee(int id)
        {
            return Ok(_conn.deleteFee(id));
        }


    }
}

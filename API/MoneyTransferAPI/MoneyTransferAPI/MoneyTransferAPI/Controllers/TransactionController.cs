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
    public class TransactionController : Controller
    {
        private readonly ITransactionRepo _conn;

        public TransactionController(ITransactionRepo conn)
        {
            _conn = conn;
        }

        [HttpGet("all")]
        public ActionResult<IEnumerable<dynamic>> getAllTrans()
        {
            string AccountType = new Authorizer().AuthorizerRequestType(HttpContext.User);
            if (AccountType != null && AccountType == "ADMIN")
                return Ok(_conn.getAllTrans());
            else
                return Ok(new { Response = "Your Account Type is not Autorized" });
            
        }

        [HttpGet("{id}")]
        public ActionResult<dynamic> getTransById(int id)
        {
            return Ok(_conn.getTransById(id));
        }

        [HttpPost]
        public ActionResult<dynamic> postTransaction(Transaction data)
        {
            return Ok(_conn.postTrans(data));
        }

        [HttpDelete("{id}")]
        public ActionResult<dynamic> deleteTrans(int id)
        {
            return Ok(_conn.deleteTrans(id));
        }
    }
}

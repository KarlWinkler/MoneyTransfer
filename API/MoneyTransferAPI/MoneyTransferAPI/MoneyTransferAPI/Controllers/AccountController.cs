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
    public class AccountController : Controller
    {
        private readonly IAccountRepo _conn;

        public AccountController(IAccountRepo conn)
        {
            _conn = conn;
        }

        [HttpGet("all")]
        public ActionResult<IEnumerable<dynamic>> getAllAccounts()
        {
            string AccountType = new Authorizer().AuthorizerRequestType(HttpContext.User);
            if (AccountType != null && AccountType == "ADMIN")
                return Ok(_conn.getAllAccounts());
            else
                return Ok(new { Response = "Your Account Type is not Autorized" });
        }

        [HttpPost]
        public ActionResult<Account> postAccount(Account data) {
            return Ok(_conn.postAccount(data));
        }

        [HttpPut]
        public ActionResult<Account> putAccount(Account data) {
            data.AccountId = new Authorizer().AuthorizerRequestId(HttpContext.User);
            return Ok(_conn.putAccount(data));
        }

        [HttpDelete]
        public ActionResult<Account> deleteAccount() {
            int AccountId = new Authorizer().AuthorizerRequestId(HttpContext.User);
            return Ok(_conn.deleteAccount(AccountId));
        }

        [HttpGet("transaction")]
        public ActionResult<dynamic> getTransactions() {
            int AccountId = new Authorizer().AuthorizerRequestId(HttpContext.User);
            return Ok(_conn.getTransactiontion(AccountId));
        }

        [HttpGet("paymentmethods")]
        public ActionResult<IEnumerable<dynamic>> getPaymentsMethod() {
            int AccountId = new Authorizer().AuthorizerRequestId(HttpContext.User);
            return Ok(_conn.getPaymentMethods(AccountId));
        }


    }
}

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
    public class PaymentMethodController : Controller
    {
        
        private readonly IPaymentmethodRepo _conn;

        public PaymentMethodController(IPaymentmethodRepo conn)
        {
            _conn = conn;
        }

        [HttpGet]
        [Authorize]
        public ActionResult<IEnumerable<Paymentmethod>> getPaymentmathods() {
            int AccountId = new Authorizer().AuthorizerRequestId(HttpContext.User);
            return Ok(_conn.GetPaymentmethodsByUserId(AccountId));
        }

        [HttpPost]
        [Authorize]
        public ActionResult<Paymentmethod> addPaymentmethod(Paymentmethod data) {
            data.AccountId = new Authorizer().AuthorizerRequestId(HttpContext.User);
            return Ok(_conn.PostPaymentmethodsByUserId(data));
        }

        [HttpPut]
        [Authorize]
        public ActionResult<Paymentmethod> udpatePayment(Paymentmethod data) {
            data.AccountId = new Authorizer().AuthorizerRequestId(HttpContext.User);

            return Ok(_conn.PutPaymentmethodsByPaymentmethodNumber(data));
        }

        [HttpDelete]
        [Authorize]
        public ActionResult<Paymentmethod> DeletePaymentmethodsByPaymentmethodNumber([FromQuery] string PN) {
            return Ok(_conn.DeletePaymentmethodsByPaymentmethodNumber(PN));
        }
        [HttpDelete("all")]
        [Authorize]
        public ActionResult<IEnumerable<Paymentmethod>> DeleteAllPaymentmethodsForUser() {
            int AccountId = new Authorizer().AuthorizerRequestId(HttpContext.User);

            return Ok(_conn.DeleteAllPaymentmethodsByUserId(AccountId));
        }
        
    }
}

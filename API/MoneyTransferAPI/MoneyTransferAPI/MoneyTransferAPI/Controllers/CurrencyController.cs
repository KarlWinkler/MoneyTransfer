using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MoneyTransferAPI.Data.RepositoryInterface;
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
    public class CurrencyController : Controller
    {
        
        private readonly ICurrencyRepo _conn;
        public CurrencyController(ICurrencyRepo conn)
        {
            _conn = conn;
        }

        [HttpGet]
        public ActionResult<IEnumerable<dynamic>> getCurrencies() {
            return Ok(_conn.GetCurrencies());
        }

        [HttpGet("{id}")]
        public ActionResult<dynamic> getCurrencyById(int id) {
            return Ok(_conn.GetCurrencyById(id));
        }

        [HttpPost]
        public ActionResult<Currency> postCurrency(Currency data) {
            return _conn.PostCurrency(data);
        }

        [HttpDelete("{id}")]
        public ActionResult<Currency> DeleteCurrency(int id) { 
            return _conn.DeleteCurrency(id);
        }

        [HttpPut]
        public ActionResult<Currency> putCurrency(Currency data) {
            return _conn.PutCurrency(data);
        }
        
    }
}

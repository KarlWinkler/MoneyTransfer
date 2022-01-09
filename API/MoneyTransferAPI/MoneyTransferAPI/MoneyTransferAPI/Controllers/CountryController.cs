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
    public class CountryController : Controller
    {
        
        private readonly ICountryRepo _conn;

        public CountryController(ICountryRepo conn)
        {
            _conn = conn;
        }

        [HttpGet]
        public ActionResult<IEnumerable<Country>> getAllcountries() {

            string AccountType = new Authorizer().AuthorizerRequestType(HttpContext.User);
            if (AccountType != null && AccountType == "ADMIN")
                return Ok(_conn.GetCountries());
            else
                return Ok(new { Response = "Your Account Type is not Autorized" });
            
        }

        [HttpPost]
        public ActionResult<Country> postCountry(Country data) {
            return Ok(_conn.PostCountry(data));
        }

        [HttpPut]
        public ActionResult<Country> putCountry(Country data) {
            return Ok(_conn.PutCountry(data));
        }

        [HttpDelete]
        public ActionResult<Country> deleteCountry(int countryId) {
            return Ok(_conn.DeleteCountry(countryId));
        }
        
    }
}

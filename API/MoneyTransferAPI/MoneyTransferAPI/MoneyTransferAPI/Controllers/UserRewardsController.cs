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
    public class UserRewardsController : Controller
    {
        private readonly IUserRewards _conn;

        public UserRewardsController(IUserRewards conn)
        {
            _conn = conn;
        }
        
        [HttpGet]
        public ActionResult<dynamic> getAllUserRewards() {

            string AccountType = new Authorizer().AuthorizerRequestType(HttpContext.User);
            if (AccountType != null && AccountType == "ADMIN")
                return Ok(_conn.GetUserRewards());
            else
                return Ok(new { Response = "Your Account Type is not Autorized" });

            
        }

        [HttpPost]
        public ActionResult<Userreward> postUserReward(Userreward data) {
            return Ok(_conn.PostReward(data));
        }

        [HttpPut]
        public ActionResult<Userreward> putUserReward(Userreward data) {
            return Ok(_conn.PutReward(data));
        }

        [HttpDelete]
        public ActionResult<dynamic> deleteReward(int userRewardId) {
            return Ok(_conn.DeleteReward(userRewardId));
        }
        
    }
}

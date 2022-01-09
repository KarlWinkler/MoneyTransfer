using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace MoneyTransferAPI.JWTAuthorization
{
    public class Authorizer
    {

        // 0 FOR ADMINS
        // 1 FOR USERS
        // 2 FOR PARTNERS
        public bool AuthorizerHelper(string type, int option) {

            if(option == 0) return type == "ADMIN" ? true : false;
            if(option == 1) return type == "USER" ? true : false;
            if(option == 2) return type == "PARTNER" ? true : false;

            return false;
        }

        public int AuthorizerRequestId(ClaimsPrincipal currentUser) {

            string data = null;

            if (currentUser.HasClaim(claim => claim.Type == "Id"))
            {
                data = currentUser.Claims.FirstOrDefault(claim => claim.Type == "Id").Value;
                return Int32.Parse(data);
            }

            return -1;
        }
        public string AuthorizerRequestType(ClaimsPrincipal currentUser)
        {

            if (currentUser.HasClaim(claim => claim.Type == "Type"))
            {
                return currentUser.Claims.FirstOrDefault(claim => claim.Type == "Type").Value;
            }

            return null;
        }
    }
}

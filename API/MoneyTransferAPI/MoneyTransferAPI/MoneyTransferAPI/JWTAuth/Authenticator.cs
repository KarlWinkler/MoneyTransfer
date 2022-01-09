using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using MoneyTransferAPI.Data.AuthData;
using MoneyTransferAPI.Models;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace MoneyTransferAPI.JWTAuth
{
    public class Authenticator
    {


        public string authentictorHelper(AuthDataModel data, Account check, IConfiguration _config) {

            // check the user first
            if (data.username != check.Username || data.password != check.Password)
                return "Username or password is not correct!";

            // genertae a token
            var secretKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["JWT:Key"]));
            var signinCredentails = new SigningCredentials(secretKey, SecurityAlgorithms.HmacSha256);

            // claims 
            var claims = new[] {
                new Claim("Username", check.Username),
                new Claim("Type", check.Type),
                new Claim("Id", check.AccountId.ToString())
            };

            // token options
            var tokenOptions = new JwtSecurityToken(
                issuer: _config["JWT:Issuer"],
                audience: _config["JWT:Audience"],
                claims: claims,
                expires: DateTime.Now.AddMinutes(30),
                signingCredentials: signinCredentails
                );

            // tokenString
            var tokenString = new JwtSecurityTokenHandler().WriteToken(tokenOptions);
            
            return tokenString;
        } 
    }
}

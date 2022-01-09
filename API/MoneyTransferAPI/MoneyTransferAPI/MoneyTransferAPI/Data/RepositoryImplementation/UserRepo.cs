using Microsoft.EntityFrameworkCore;
using MoneyTransferAPI.Data.RepositoryInterface;
using MoneyTransferAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MoneyTransferAPI.Data.RepositoryImplementation
{
    public class UserRepo : IUserRepo
    {
        
        private readonly DBContext _context;
        public UserRepo(DBContext context)
        {
            _context = context;
        }
       
        public IEnumerable<dynamic> getAllUser()
        {
            var res = (from u in _context.Accounts
                       where (u.Type == "USER")
                       select new 
                      {
                          u.AccountId,
                          u.FName,
                          u.LName,
                          u.Username,
                          u.Email,
                          u.Type,
                          u.Balance
                      }).ToList();
            return res;

        }

        public dynamic getUserById(int id) {

            var res = (from u in _context.Accounts
                       where (u.AccountId == id && u.Type == "USER")          
                       select new
                       {
                           u.AccountId,
                           u.FName,
                           u.LName,
                           u.Username,
                           u.Email,
                           u.Type,
                           u.Balance
                       });

            return res;
        }

        public IEnumerable<dynamic> getFriends(int id)
        {
            var res = (from f in _context.Friends
                        where f.AccountId == id

                        join u in _context.Accounts
                        on f.FriendAccountd equals u.AccountId

                        select new
                        {
                            frindFirstName = u.FName,
                            frindLastName = u.LName,
                            frindUsername= u.Username
                        })
                        .ToList();

            return res;
        }

        public dynamic getUserRewads(int id) {

            var res = (from acc in _context.Accounts
                        where (acc.AccountId == id && acc.Type == "USER")

                        join ue in _context.Userearns
                        on acc.AccountId equals ue.UserId

                        join ur in _context.Userrewards
                        on ue.RewardId equals ur.RewardId

                        select new {
                            acc.FName, acc.Username, acc.AccountId,
                            ur.RewardId, ur.RewardLevel, ur.RewardName, ur.RewardPoints
                        })
                        .ToList();

            return res;
        }


    }
}

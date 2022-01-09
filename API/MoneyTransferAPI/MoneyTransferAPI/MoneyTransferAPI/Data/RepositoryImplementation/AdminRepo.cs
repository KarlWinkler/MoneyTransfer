using MoneyTransferAPI.Data.RepositoryInterface;
using MoneyTransferAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MoneyTransferAPI.Data.RepositoryImplementation
{
    public class AdminRepo : IAdminRepo
    {
        private readonly DBContext _context;
        public AdminRepo(DBContext context)
        {
            _context = context;
        }

        public dynamic getAdminById(int id)
        {
            var res = (from u in _context.Accounts
                       where (u.AccountId == id && u.Type == "ADMIN")
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


        public IEnumerable<dynamic> getAllAdmin()
        {
            var res = (from u in _context.Accounts
                       where (u.Type == "ADMIN")
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

    }
}

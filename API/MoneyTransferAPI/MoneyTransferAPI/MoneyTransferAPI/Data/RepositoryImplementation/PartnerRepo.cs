using MoneyTransferAPI.Data.RepositoryInterface;
using MoneyTransferAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MoneyTransferAPI.Data.RepositoryImplementation
{
    public class PartnerRepo : IPartnerRepo
    {
        private readonly DBContext _context;
        public PartnerRepo(DBContext context)
        {
            _context = context;
        }
        public IEnumerable<dynamic> getAllPartners()
        {
            var res = (from u in _context.Accounts
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

        public dynamic getPartnerById(int id)
        {
            var res = (from u in _context.Accounts
                       where (u.AccountId == id && u.Type == "PARTNER")
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

        public dynamic getPartnerLocations(int id)
        {
            var res = (from p in _context.Accounts
                       where (p.AccountId == id && p.Type == "PARTNER")
                       join l in _context.Locations
                       on p.AccountId equals l.AccountId
                       join c in _context.Countries
                       on l.CountryId equals c.CountryId
                       select new { 
                            p.FName, l.LocationId, l.PhoneNo,
                           c.CountryName, l.City, l.Hours
                       });

            return res;
        }

        public dynamic getPartnerRewads(int id)
        {
            throw new NotImplementedException();
        }
    }
}

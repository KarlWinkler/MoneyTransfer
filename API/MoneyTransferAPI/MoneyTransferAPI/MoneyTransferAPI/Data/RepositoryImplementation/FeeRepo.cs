using MoneyTransferAPI.Data.RepositoryInterface;
using MoneyTransferAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MoneyTransferAPI.Data.RepositoryImplementation
{
    public class FeeRepo : IFeeRepo
    {
        private readonly DBContext _context;
        public FeeRepo(DBContext context)
        {
            _context = context;
        }
        public Fee deleteFee(int id)
        {
            var data = getFeeObjById(id);
            if (data == null) return null;
            _context.Remove(data);
            _context.SaveChanges();

            return data;
        }

        public IEnumerable<dynamic> getAllFees()
        {
            var res = (from f in _context.Fees
                       join c in _context.Countries
                       on f.CountryId equals c.CountryId
                       select new
                       {
                           f.FeeId, f.FeeName, f.FeeRate, f.TarnsactionType ,c.CountryName
                       }).ToList();
            return res;
        }

        public dynamic getFeeById(int id)
        {
            var res = (from f in _context.Fees
                       where f.FeeId == id
                       join c in _context.Countries
                       on f.CountryId equals c.CountryId
                       select new
                       {
                           f.FeeId,
                           f.FeeName,
                           f.FeeRate,
                           f.TarnsactionType,
                           c.CountryName
                       });
            return res;
        }

        public Fee getFeeObjById(int id)
        {
            return _context.Fees.Where(f => f.FeeId == id).FirstOrDefault<Fee>();
        }

        public Fee postFee(Fee data)
        {

            _context.Add(data);
            _context.SaveChanges();

            return data;
        }
    }
}

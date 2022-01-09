using MoneyTransferAPI.Data.RepositoryInterface;
using MoneyTransferAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MoneyTransferAPI.Data.RepositoryImplementation
{
    public class CurrencyRepo : ICurrencyRepo
    {
        
        private readonly DBContext _context;

        public CurrencyRepo(DBContext context)
        {
            _context = context;
        }
        

        public IEnumerable<dynamic> GetCurrencies()
        {
            var res = (from c in _context.Currencies
                       select new { 
                            c.CurrencyId, c.CurrencyName, c.FromUsd
                       }).ToList();
            return res;
        }

        public dynamic GetCurrencyById(int currencyId) {
            var res = (from c in _context.Currencies
                       where c.CurrencyId == currencyId
                       select new
                       {
                           c.CurrencyId,
                           c.CurrencyName,
                           c.FromUsd
                       }).ToList();
            return res;
        }

        public Currency PostCurrency(Currency data)
        {
            _context.Currencies.Add(data);
            _context.SaveChanges();

            return data;
        }

        public Currency DeleteCurrency(int currencyId)
        {
            var data = GetCurrencyById(currencyId);
            _context.Currencies.Remove(data);
            _context.SaveChanges();

            return data;
        }

        public Currency PutCurrency(Currency newData)
        {
            var oldData = GetCurrencyById(newData.CurrencyId);
            oldData.CurrencyName = newData.CurrencyName;
            oldData.FromUsd = newData.FromUsd;
            _context.SaveChanges();

            return oldData;
        }
        
    }
}

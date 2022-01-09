
using MoneyTransferAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MoneyTransferAPI.Data.RepositoryInterface
{
    public interface ICurrencyRepo
    {
        
        public IEnumerable<dynamic> GetCurrencies();
        public dynamic GetCurrencyById(int currencyId);
        public Currency PostCurrency(Currency data);
        public Currency PutCurrency(Currency data);
        public Currency DeleteCurrency(int currencyId);
        
    }
}

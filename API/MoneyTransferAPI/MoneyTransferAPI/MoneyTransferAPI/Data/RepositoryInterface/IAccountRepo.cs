using MoneyTransferAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MoneyTransferAPI.Data.RepositoryInterface
{
    public interface IAccountRepo
    {
        public IEnumerable<dynamic> getAllAccounts();
        public Account postAccount(Account data);
        public Account putAccount(Account data);
        public Account deleteAccount(int id);
        public IEnumerable<dynamic> getTransactiontion(int id);
        Account getAccountByUserName(string username);
        public IEnumerable<dynamic> getPaymentMethods(int accountId);
    }
}

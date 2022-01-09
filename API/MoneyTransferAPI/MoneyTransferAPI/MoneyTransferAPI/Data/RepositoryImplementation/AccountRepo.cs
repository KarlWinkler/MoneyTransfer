using MoneyTransferAPI.Data.RepositoryInterface;
using MoneyTransferAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MoneyTransferAPI.Data.RepositoryImplementation
{
    public class AccountRepo : IAccountRepo
    {
        private readonly DBContext _context;
        public AccountRepo(DBContext context)
        {
            _context = context;
        }
        public Account deleteAccount(int id)
        {
            var data = getAccountObj(id);
            _context.Remove(data);
            _context.SaveChanges();

            return data;
        }

        public IEnumerable<dynamic> getAllAccounts()
        {
            var res = (from acc in _context.Accounts
                       select new
                       {
                           acc.AccountId, acc.FName,
                           acc.Username, acc.Type
                       }).ToList(); 
            return res;
        }

        public Account getAccountObj(int id) {
            return _context.Accounts.Where(acc => acc.AccountId == id).FirstOrDefault<Account>();
        }

        public Account postAccount(Account data)
        {
            _context.Add(data);
            _context.SaveChanges();
            return data;
        }

        public Account putAccount(Account data)
        {
            var oldData = getAccountObj(data.AccountId);

            oldData.AccountId = data.AccountId;
            oldData.FName = data.FName;
            oldData.LName = data.LName;
            oldData.CurrencyId = data.CurrencyId;
            oldData.Email = data.Email;
            oldData.Balance = data.Balance;
            oldData.Type = data.Type;

            _context.SaveChanges();

            return oldData;
        }

        public IEnumerable<dynamic> getTransactiontion(int id) {
            
            var res = (from tr in _context.Transactions
                       where tr.SenderId == id // Get Trans from sender

                       join acc in _context.Accounts // Get Sender
                       on tr.SenderId equals acc.AccountId

                       join acc2 in _context.Accounts // Get Receiver
                       on tr.ReceiverId equals acc2.AccountId

                       join cu in _context.Currencies // sender Currency
                       on tr.CurrencyFromSender equals cu.CurrencyId

                       join cu2 in _context.Currencies // Receier Currency 
                       on tr.CurrencyToReceiver equals cu2.CurrencyId

                       join fe in _context.Fees // Fees Info
                       on tr.FeeId equals fe.FeeId

                       join co in _context.Countries // get Fee country
                       on fe.CountryId equals co.CountryId

                       select new
                       {
                           TansId = tr.TransId,

                           SenderName = acc.FName,
                           ReceiverName = acc2.FName,
                           Value = tr.Value,

                           senderCurrency = cu.CurrencyName,
                           ReceiverCurrency = cu2.CurrencyName,

                           FeeName = fe.FeeName,
                           FeeCountry = co.CountryName
                       });

            return res;
        }

        public Account getAccountByUserName(string username)
        {
            return _context.Accounts.Where(acc => acc.Username == username).FirstOrDefault<Account>();
        }

        public IEnumerable<dynamic> getPaymentMethods(int accountId)
        {
            var res = (from acc in _context.Accounts
                       where acc.AccountId == accountId
                       join p in _context.Paymentmethods
                       on acc.AccountId equals p.AccountId
                       select new
                       {
                           acc.FName,
                           p.PaymentMethodNumber,
                           p.PaymentMethodName
                       }).ToList();
            return res;
        }
    }
}

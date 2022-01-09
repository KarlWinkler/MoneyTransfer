using MoneyTransferAPI.Data.RepositoryInterface;
using MoneyTransferAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MoneyTransferAPI.Data.RepositoryImplementation
{
    public class TransactionRepo : ITransactionRepo
    {
        private readonly DBContext _context;
        public TransactionRepo(DBContext context)
        {
            _context = context;
        }

        public dynamic deleteTrans(int id)
        {
            var data = getTransObjById(id);
            if (data == null) return null;
            _context.Remove(data);
            _context.SaveChanges();

            return new { data.TransId, data.SenderId, data.CurrencyFromSender, data.ReceiverId, data.CurrencyToReceiver, data.Value, data.FeeId};

        }

        public Transaction getTransObjById(int id) {
            return _context.Transactions.Where(tr => tr.TransId == id).FirstOrDefault<Transaction>();
        }

        public IEnumerable<dynamic> getAllTrans()
        {
            var res = (from data in _context.Transactions
                       select new {
                           data.TransId,
                           data.SenderId,
                           data.CurrencyFromSender,
                           data.ReceiverId,
                           data.CurrencyToReceiver,
                           data.Value,
                           data.FeeId
                       }).ToList();
            return res;
        }

        public dynamic getTransById(int id)
        {
            var res = (from data in _context.Transactions
                       where data.TransId == id
                       select new
                       {
                           data.TransId,
                           data.SenderId,
                           data.CurrencyFromSender,
                           data.ReceiverId,
                           data.CurrencyToReceiver,
                           data.Value,
                           data.FeeId
                       }).ToList();
            return res;
        }

        public dynamic postTrans(Transaction data)
        {
            _context.Add(data);
            _context.SaveChanges();
            return new { data.TransId, data.SenderId, data.CurrencyFromSender, data.ReceiverId, data.CurrencyToReceiver, data.Value, data.FeeId };
        }
    }
}

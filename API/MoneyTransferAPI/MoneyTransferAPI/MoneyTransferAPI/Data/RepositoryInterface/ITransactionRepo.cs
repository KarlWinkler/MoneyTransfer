using MoneyTransferAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;


namespace MoneyTransferAPI.Data.RepositoryInterface
{
    public interface ITransactionRepo
    {
        public IEnumerable<dynamic> getAllTrans();
        public dynamic getTransById(int id);
        public dynamic postTrans(Transaction data);
        public dynamic deleteTrans(int id);
    }
}

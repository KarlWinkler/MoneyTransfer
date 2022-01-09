using MoneyTransferAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MoneyTransferAPI.Data.RepositoryInterface
{
    public interface IFeeRepo
    {
        public IEnumerable<dynamic> getAllFees();
        public dynamic getFeeById(int id);
        public Fee postFee(Fee data);
        public Fee deleteFee(int id);
    }
}

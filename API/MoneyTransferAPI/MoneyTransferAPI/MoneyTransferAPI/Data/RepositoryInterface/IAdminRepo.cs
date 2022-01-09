using MoneyTransferAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MoneyTransferAPI.Data.RepositoryInterface
{
    public interface IAdminRepo
    {
        public IEnumerable<dynamic> getAllAdmin();
        public dynamic getAdminById(int id);

    }
}


using MoneyTransferAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MoneyTransferAPI.Data.RepositoryInterface
{
    public interface IUserRepo
    {
        
        public IEnumerable<dynamic> getAllUser();

        public dynamic getUserById(int id);

        public IEnumerable<dynamic> getFriends(int id);

        public dynamic getUserRewads(int id);
        
    }
}
